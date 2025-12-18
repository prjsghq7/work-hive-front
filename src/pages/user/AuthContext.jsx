import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { userService } from "../../services/user/userService.js";
import { useApi } from "../../hooks/useApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { run } = useApi();

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("accessToken");
            console.log("Auth init token:", token);

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await run(() => userService.getMyInfo());
                console.log("getMyInfo raw res:", res);

                const me = res?.data ?? res;// ⭐ 핵심
                setUser(me);
            } catch (e) {
                console.log("getMyInfo 실패:", e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [run]);

    const isLoggedIn = !!user;

    const login = async (loginResult) => {
        localStorage.setItem("accessToken", loginResult.accessToken);
        localStorage.setItem("empId", loginResult.emp_id);

        setLoading(true);
        try {
            const res = await run(() => userService.getMyInfo());
            const me = res?.data ?? res;
            setUser(me);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("empId");
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, isLoggedIn, loading, login, logout }),
        [user, isLoggedIn, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
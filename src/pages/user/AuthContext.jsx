import {useEffect, useMemo, useState, useContext, createContext} from "react";
import {userService} from "../../services/user/userService.js";
import {useApi} from "../../hooks/useApi.js";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const {run} = useApi();
    const isLoggedIn = !!user;
    //!! 는값이 존재하냐를 true/false로 바꿔주는 연산자.

    useEffect(() => {
        async function init(){
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                return;
            }
            try{
                const res = await run(() => userService.getMyInfo());
                setUser(res.data);
            }catch (e){
                console.log(e);
                setUser(null);
            }
        }
        init();
    }, [run]);

    const login = (loginResult)=>{
        //loginResult =는 res.data가 들어간다.
        const accessToken = loginResult.accessToken;
        const empId = loginResult.emp_id;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("empId", empId);
        setUser({empId: empId})

    }

    const logout = ()=>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("empId");
        setUser(null);
    }

    const value = useMemo(
        () => ({user, setUser, isLoggedIn, login, logout}),
        [user, isLoggedIn]
    );
    //useMemo  -> 의존성이 바뀔 때만 객체를 새로 만든다.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
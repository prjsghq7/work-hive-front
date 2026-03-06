import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { userService } from "../../services/user/userService.js";
import { useApi } from "../../hooks/useApi.js";

import { startChatNotify, stopChatNotify } from "../../services/chat/chatNotifyService.js";
import { chatRoomService } from "../../services/chat/chatRoomService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { run } = useApi();

    const [chatRoomMap, setChatRoomMap] = useState({}); // { [roomIndex]: summary }
    const [chatRoomOrder, setChatRoomOrder] = useState([]); // 목록 표시 순서가 필요하면

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

    // 로그인 상태가 되면 실행되는 effect 
    useEffect(() => {
        if (!user) return;

        // 1) 최초 채팅방 목록 로딩
        (async () => {
            try {
                const res = await run(() => chatRoomService.getMyRooms());
                const rooms = res?.data ?? res ?? [];

                const map = {};
                const order = [];
                for (const r of rooms) {
                    const idx = r.roomIndex ?? r.room_index ?? r.index;
                    if (!idx) continue;
                    map[idx] = r;
                    order.push(idx);
                }

                setChatRoomMap(map);
                setChatRoomOrder(order);
            } catch (e) {
                console.error("getMyRooms failed", e);
            }
        })();

        // 2) 개인 알림 채널 1개만 구독
        startChatNotify(async (payload) => {
            if (!payload) return;

            const roomIndex = payload.roomIndex ?? payload.room_index;
            if (!roomIndex) return;

            try {
                const res = await run(() => chatRoomService.getRoomSummary(roomIndex));
                const summary = res?.data ?? res;

                setChatRoomMap((prev) => ({
                    ...prev,
                    [roomIndex]: summary,
                }));

                // 최신 알림 온 방을 위로 올리고 싶으면 order 갱신
                setChatRoomOrder((prev) => {
                    const next = prev.filter((x) => x !== roomIndex);
                    next.unshift(roomIndex);
                    return next;
                });
            } catch (e) {
                console.error("getRoomSummary failed", e);
            }
        });

        // cleanup: 로그아웃/언마운트 시 구독 해제
        return () => {
            stopChatNotify();
        };
    }, [user, run]);

    const isLoggedIn = !!user;

    const getMyInfo = async (loginResult) => {
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
    const refreshUser = async ()=>{
        const token = localStorage.getItem("accessToken");
        if(!token){
            setUser(null);
            return null;
        }
        setLoading(true);
        try{
            const res = await run(() => userService.getMyInfo());
            const me = res?.data ?? res;
            setUser(me)
            return me;
        }catch(e){
            console.log("refresh 실패", e);
            setUser(null);
            return null;
        }finally {
            setLoading(false);
        }
    }

    const value = useMemo(
        () => ({ user, isLoggedIn, loading, getMyInfo, logout,refreshUser }),
        [user, isLoggedIn, loading]
    );



    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
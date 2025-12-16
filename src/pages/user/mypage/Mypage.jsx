import {useEffect} from "react";
import {useAuth} from "../AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useApi} from "../../../hooks/useApi.js";
import {userService} from "../../../services/user/userService.js";

export default function Mypage() {

    const {user, loading, isLoggedIn} = useAuth();
    const nav = useNavigate();
    const {run} = useApi();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            nav("/user/login", {replace: true});
        }

        run(() => userService.getMyInfo());
    }, [isLoggedIn]);

    if (loading) return <div>로딩중</div>;
    if (!isLoggedIn) return null;      // 이동 처리 중
    if (!user) return <div>정보가 없습니다.</div>;
    return (
        <div>
            <h2>내 정보</h2>
            <div>{user.name ?? "-"}</div>
            <div>{user.email ?? "-"}</div>
        </div>
    );
};
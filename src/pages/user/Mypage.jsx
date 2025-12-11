import {useEffect, useState} from "react";
import {userService} from "../../services/user/userService.js";

export default function Mypage() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await userService.getMyInfo();
                setMe(res.data);
            } catch (e) {
                console.error("내 정보 불러오기 실패:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, []);
    console.log(me);
    if (loading) return <div>로딩중...</div>;
    if (!me) return <div>정보를 불러올 수 없습니다.</div>;

    return (
        <div style={{padding: "20px"}}>
            <h2>내 정보</h2>
            <div style={{background:"white"}}><strong>이름:</strong> {me.name}</div>
            <div style={{background:"white"}}><strong>이메일:</strong> {me.email}</div>
            <div style={{background:"white"}}><strong>전화번호:</strong> {me.phoneNumber}</div>
            <div style={{background:"white"}}><strong>입사일:</strong> {me.start_date}</div>
            <div style={{background:"white"}}><strong>생년월일:</strong> {me.birth}</div>
            <div style={{background:"white"}}><strong>권한:</strong> {me.role_code === 101 ? "관리자" : "일반 유저"}</div>
        </div>
    );
}
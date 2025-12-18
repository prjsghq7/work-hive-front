import { useAuth } from "../AuthContext.jsx";
import Loading from "../../../components/loading/Loading.jsx";

export default function Mypage() {
    const { user, loading } = useAuth();

    if (loading) return <Loading message="불러오는중입니다." />;
    if (!user) return <div>정보가 없습니다.</div>;

    return (
        <div>
            <h2>내 정보</h2>
            <div>{user.name ?? "-"}</div>
            <div>{user.email ?? "-"}</div>
        </div>
    );
}
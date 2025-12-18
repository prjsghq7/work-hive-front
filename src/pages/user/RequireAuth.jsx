import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "./AuthContext.jsx";
import Loading from "../../components/loading/Loading.jsx";

export default function RequireAuth({ children }) {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading message="로딩중..."/>;
    if (!isLoggedIn) return <Navigate to="/user/login" replace state={{ from: location }} />;

    return children;
}
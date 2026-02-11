import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/user/AuthContext.jsx";

export default function PrivateRoute({ children }) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        alert("로그인이 필요한 페이지입니다.");
        return <Navigate to="/" replace />;
    }

    return children;
}
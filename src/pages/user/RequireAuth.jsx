import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>로딩중...</div>;
    if (!user) return <Navigate to="/user/login" replace />;
    return children;
}
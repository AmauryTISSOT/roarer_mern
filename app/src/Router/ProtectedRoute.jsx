import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/connexion", { replace: true });
        }
    }, [user, navigate]);

    return user ? <Outlet /> : null;
};

export default ProtectedRoute;

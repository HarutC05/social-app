import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

interface PrivateRouteProps {
    children: JSX.Element;
}

export default function PrivateRoute({
    children,
}: PrivateRouteProps): JSX.Element {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

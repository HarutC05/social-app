import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const PrivateRoute = ({
    isAuthenticated,
    children,
}: PrivateRouteProps) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routing/AppRoutes";
import { AuthProvider, useAuth } from "./hooks/useAuth";

export default function AppWrapper() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutesWrapper />
            </BrowserRouter>
        </AuthProvider>
    );
}

function AppRoutesWrapper() {
    const { currentUser, logout } = useAuth();

    return <AppRoutes isAuthenticated={!!currentUser} onLogout={logout} />;
}

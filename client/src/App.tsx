import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routing/AppRoutes";
import { AuthProvider } from "./hooks/useAuth";
import type { JSX } from "react";

export default function App(): JSX.Element {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

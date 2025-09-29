import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routing/AppRoutes";
import { useState } from "react";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const handleLogout = () => {
        // clear tokens/session storage if needed
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <AppRoutes
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
            />
        </BrowserRouter>
    );
}

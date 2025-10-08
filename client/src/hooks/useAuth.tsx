import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import {
    getMe,
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    refresh as apiRefresh,
    type User,
    type LoginPayload,
    type RegisterPayload,
} from "../api/authApi";

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            try {
                const user = await getMe();
                if (user) {
                    setCurrentUser(user);
                } else {
                    const refreshed = await apiRefresh();
                    if (refreshed) setCurrentUser(refreshed);
                    else setCurrentUser(null);
                }
            } catch (e) {
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const login = async (payload: LoginPayload) => {
        const user = await apiLogin(payload);
        setCurrentUser(user);
    };

    const register = async (payload: RegisterPayload) => {
        const user = await apiRegister(payload);
        setCurrentUser(user);
    };

    const logout = async () => {
        await apiLogout();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading,
                login,
                register,
                logout,
                isAuthenticated: !!currentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

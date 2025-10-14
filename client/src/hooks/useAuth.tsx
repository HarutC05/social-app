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
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

function normalizeUser(raw?: Partial<User> | null): User | null {
    if (!raw) return null;
    return {
        id: (raw as any).id ?? 0,
        username: raw.username ?? "",
        email: raw.email ?? "",
        avatar_url:
            raw.avatar_url !== undefined && raw.avatar_url !== ""
                ? raw.avatar_url
                : null,
        bio: raw.bio ?? "",
    } as User;
}

interface LoginPayload {
    email: string;
    password: string;
}
interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    setCurrentUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const setCurrentUser = (u: User | null) => {
        setCurrentUserState(normalizeUser(u));
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            setIsLoading(true);

            const TIMEOUT_MS = 1200;
            let timeoutFired = false;
            const timeoutId = setTimeout(() => {
                if (!mounted) return;
                timeoutFired = true;
                setIsLoading(false);
            }, TIMEOUT_MS);

            try {
                let user = await getMe();

                if (!user) {
                    try {
                        user = await apiRefresh();
                    } catch {
                        user = null;
                    }
                }

                if (!mounted) return;

                setCurrentUser(user ? normalizeUser(user) : null);
            } catch (err) {
                if (mounted) setCurrentUser(null);
            } finally {
                clearTimeout(timeoutId);
                if (mounted && !timeoutFired) setIsLoading(false);
            }
        };

        initAuth();
        return () => {
            mounted = false;
        };
    }, []);

    const login = async (payload: LoginPayload) => {
        setIsLoading(true);
        try {
            await apiLogin(payload);

            const user = await getMe();
            setCurrentUser(user ? normalizeUser(user) : null);

            setIsLoading(false);
            navigate("/", { replace: true });
        } catch (err) {
            setIsLoading(false);
            throw err;
        }
    };

    const register = async (payload: RegisterPayload) => {
        setIsLoading(true);
        try {
            await apiRegister(payload);

            const user = await getMe();
            setCurrentUser(user ? normalizeUser(user) : null);

            setIsLoading(false);
            navigate("/", { replace: true });
        } catch (err) {
            setIsLoading(false);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } finally {
            setCurrentUser(null);
            setIsLoading(false);
            navigate("/login", { replace: true });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading,
                isAuthenticated: !!currentUser,
                login,
                register,
                logout,
                setCurrentUser,
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

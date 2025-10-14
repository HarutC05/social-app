import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
import appLogo from "../../assets/icons/appLogo.png";
import { ROUTES } from "../../routing/routes";
import UserMenu from "../UserMenu/UserMenu";
import HeaderIcons from "./components/HeaderIcons";
import Input from "../Input/Input";
import { searchIcon } from "../../assets/icons/searchIcon";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Button/Button";
import type { JSX } from "react/jsx-runtime";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

type HeaderProps = {
    onLogout: () => void;
};

export default function Header({ onLogout }: HeaderProps): JSX.Element {
    const { currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);

    useEffect(() => {
        const avatar =
            currentUser?.avatar_url && currentUser.avatar_url.trim() !== ""
                ? currentUser.avatar_url
                : DEFAULT_AVATAR;
        setAvatarUrl(avatar);
    }, [currentUser]);

    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = searchValue.trim();
        if (trimmed === "") {
            navigate(ROUTES.HOME);
        } else {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        }
    };

    useEffect(() => {
        if (searchValue.trim() === "") {
            if (location.pathname.startsWith("/search")) {
                navigate(ROUTES.HOME);
            }
        }
    }, [searchValue, location.pathname]);

    return (
        <header className={styles.container}>
            <Link to={ROUTES.HOME}>
                <div className={styles.logo}>
                    <img src={appLogo} alt="app logo" />
                </div>
            </Link>

            <form
                className={styles.searchContainer}
                onSubmit={handleSearchSubmit}
            >
                <Input
                    name="q"
                    placeholder="Search posts or users..."
                    type="search"
                    icon={searchIcon}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button type="submit" className={styles.searchButton}>
                    Search
                </Button>
            </form>

            <ul className={styles.nav}>
                {isAuthenticated && (
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                )}
                <li>
                    <Link to={ROUTES.ABOUT}>About Us</Link>
                </li>
                {isAuthenticated ? (
                    <li>
                        <UserMenu avatarUrl={avatarUrl} onLogout={onLogout}>
                            <HeaderIcons />
                        </UserMenu>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to={ROUTES.LOGIN}>Login</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.REGISTER}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

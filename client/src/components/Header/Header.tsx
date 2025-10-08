import { Link } from "react-router-dom";
import styles from "./header.module.css";
import appLogo from "../../assets/icons/appLogo.png";
import { ROUTES } from "../../routing/routes";
import UserMenu from "../UserMenu/UserMenu";
import HeaderIcons from "./components/HeaderIcons";
import Input from "../Input/Input";
import { searchIcon } from "../../assets/icons/searchIcon";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

type HeaderProps = {
    onLogout: () => void;
};

export default function Header({ onLogout }: HeaderProps): JSX.Element {
    const { currentUser } = useAuth();
    const isLoggedIn = !!currentUser;
    const avatarUrl = currentUser?.avatar_url ?? DEFAULT_AVATAR;

    return (
        <header className={styles.container}>
            <Link to={ROUTES.HOME}>
                <div className={styles.logo}>
                    <img src={appLogo} alt="app logo" />
                </div>
            </Link>

            <div className={styles.searchContainer}>
                <Input
                    placeholder="Search posts..."
                    type="search"
                    icon={searchIcon}
                />
            </div>

            <ul className={styles.nav}>
                <li>
                    <Link to={ROUTES.HOME}>Home</Link>
                </li>
                <li>
                    <Link to={ROUTES.ABOUT}>About Us</Link>
                </li>
                {isLoggedIn ? (
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

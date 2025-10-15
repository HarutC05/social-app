import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./userMenu.module.css";

type UserMenuProps = {
    avatarUrl: string;
    children?: ReactNode;
    onLogout: () => void;
};

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function UserMenu({
    avatarUrl,
    children,
    onLogout,
}: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.menuContainer}>
            <div className={styles.icons}>
                {children}
                <div
                    className={styles.avatarWrapper}
                    onClick={() => setIsOpen((p) => !p)}
                >
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className={styles.avatar}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                DEFAULT_AVATAR;
                        }}
                    />
                </div>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <Link to="/me" className={styles.item}>
                        My Profile
                    </Link>
                    <Link to="/help" className={styles.item}>
                        Help & Support
                    </Link>
                    <Link to="/settings" className={styles.item}>
                        Settings
                    </Link>
                    <button
                        onClick={onLogout}
                        className={`${styles.item} ${styles.logout}`}
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./userMenu.module.css";

type UserMenuProps = {
    avatarUrl: string;
    children?: ReactNode;
    onLogout: () => void;
};

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

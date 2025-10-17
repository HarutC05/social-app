import styles from "./sidebar.module.css";

interface SidebarProps {
    selected: string;
    onSelect: (section: string) => void;
}

export default function Sidebar({ selected, onSelect }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <h3 className={styles.title}>Account</h3>
            <ul className={styles.list}>
                <li
                    className={
                        selected === "changePassword" ? styles.active : ""
                    }
                    onClick={() => onSelect("changePassword")}
                >
                    Change Password
                </li>
                <li
                    className={
                        selected === "deleteAccount" ? styles.active : ""
                    }
                    onClick={() => onSelect("deleteAccount")}
                >
                    Delete Account
                </li>
            </ul>

            <h3 className={styles.title}>Other</h3>
            <ul className={styles.list}></ul>
        </div>
    );
}

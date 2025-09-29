import { Bell } from "lucide-react";
import styles from "./headerIcons.module.css";

export default function HeaderIcons() {
    return (
        <div className={styles.iconSquare} aria-hidden>
            <Bell size={20} stroke="#929292" path="#929292" />
        </div>
    );
}

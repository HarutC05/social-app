import styles from "./leftPanel.module.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routing/routes";

export default function LeftPanel() {
    return (
        <aside className={styles.container}>
            <div className={styles.card}>
                <h3 className={styles.heading}>Shortcuts</h3>
                <nav className={styles.nav}>
                    <Link to={ROUTES.HOME}>Home</Link>
                    <Link to={ROUTES.PROFILE}>Profile</Link>
                    <Link to={ROUTES.ABOUT}>About</Link>
                    <Link to={ROUTES.HELP}>Help</Link>
                </nav>
            </div>

            <div className={styles.card}>
                <h3 className={styles.heading}>Filters</h3>
                <div className={styles.tags}>
                    <button className={styles.tag}>Popular</button>
                    <button className={styles.tag}>Recent</button>
                    <button className={styles.tag}>Images</button>
                    <button className={styles.tag}>Tutorials</button>
                </div>
            </div>
        </aside>
    );
}

import styles from "./rightPanel.module.css";
import { mockUsers } from "../../../../components/MockData/users";

export default function RightPanel() {
    const trending = [
        "React",
        "Frontend",
        "Design",
        "Open Source",
        "UI/UX",
        "TypeScript",
    ];

    return (
        <aside className={styles.container}>
            <div className={styles.card}>
                <h3 className={styles.heading}>Trending</h3>
                <ul className={styles.trending}>
                    {trending.map((t) => (
                        <li key={t} className={styles.trendItem}>
                            #{t}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.card}>
                <h3 className={styles.heading}>Suggested</h3>
                <div className={styles.users}>
                    {mockUsers.map((u) => (
                        <div key={u.id} className={styles.user}>
                            <img
                                src={u.avatar}
                                alt={u.username}
                                className={styles.avatar}
                            />
                            <div className={styles.info}>
                                <div className={styles.name}>{u.username}</div>
                                <div className={styles.small}>{u.bio}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

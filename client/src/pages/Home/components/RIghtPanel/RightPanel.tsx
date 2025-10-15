import styles from "./rightPanel.module.css";
import { getUsers, type User } from "../../../../api/usersApi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function RightPanel() {
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const users = await getUsers();
                setSuggestedUsers(users.slice(0, 5));
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        }
        fetchUsers();
    }, []);

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
                    {suggestedUsers.map((u) => (
                        <Link
                            to={`/users/${u.id}`}
                            key={u.id}
                            className={styles.userLink}
                        >
                            <div className={styles.user}>
                                <img
                                    src={u.avatar_url || DEFAULT_AVATAR}
                                    alt={u.username}
                                    className={styles.avatar}
                                />
                                <div className={styles.info}>
                                    <div className={styles.name}>
                                        {u.username}
                                    </div>
                                    <div className={styles.small}>{u.bio}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

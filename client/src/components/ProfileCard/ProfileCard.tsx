import styles from "./profileCard.module.css";
import type { JSX } from "react/jsx-runtime";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

interface Props {
    username?: string | null;
    avatar?: string | null;
    bio?: string | null;
}

export default function ProfileCard({
    username,
    avatar,
    bio,
}: Props): JSX.Element {
    const src =
        avatar && String(avatar).trim() !== "" ? avatar : DEFAULT_AVATAR;

    const displayName =
        username && String(username).trim() !== "" ? username : "Unknown";
    const displayBio = bio && String(bio).trim() !== "" ? bio : "No bio yet.";

    return (
        <div className={styles.card}>
            <img src={src} alt={displayName} className={styles.avatar} />
            <div className={styles.meta}>
                <h2 className={styles.username}>{displayName}</h2>
                <p className={styles.bio}>{displayBio}</p>
            </div>
        </div>
    );
}

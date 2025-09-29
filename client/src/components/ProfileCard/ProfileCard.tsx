import styles from "./profileCard.module.css";

interface ProfileCardProps {
    username: string;
    avatar: string;
    bio: string;
}

export default function ProfileCard({
    username,
    avatar,
    bio,
}: ProfileCardProps) {
    return (
        <div className={styles.card}>
            <img
                src={avatar}
                alt={`${username}'s avatar`}
                className={styles.avatar}
            />
            <h2 className={styles.username}>{username}</h2>
            <p className={styles.bio}>{bio}</p>
        </div>
    );
}

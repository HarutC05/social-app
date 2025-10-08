import { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfilePage from "./EditProfile";
import Button from "../../components/Button/Button";
import styles from "./myProfilePage.module.css";
import { useAuth } from "../../hooks/useAuth";
import { getUserById, type User as ApiUser } from "../../api/usersApi";
import type { JSX } from "react/jsx-runtime";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function MyProfilePage(): JSX.Element {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [localUser, setLocalUser] = useState<{
        id: number;
        username: string;
        bio: string;
        avatar_url: string | null;
    } | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!currentUser) {
                setLocalUser(null);
                return;
            }
            try {
                const fresh: ApiUser = await getUserById(currentUser.id);
                setLocalUser({
                    id: fresh.id,
                    username: fresh.username,
                    bio: fresh.bio ?? "",
                    avatar_url: fresh.avatar_url ?? null,
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
                setLocalUser({
                    id: currentUser.id,
                    username: currentUser.username,
                    bio: currentUser.bio ?? "",
                    avatar_url: currentUser.avatar_url ?? null,
                });
            }
        };
        load();
    }, [currentUser]);

    const handleSave = (updated: {
        username: string;
        bio: string;
        avatar_url?: string | null;
    }) => {
        if (!localUser) return;
        setLocalUser((prev) =>
            prev
                ? {
                      ...prev,
                      username: updated.username,
                      bio: updated.bio,
                      avatar_url: updated.avatar_url ?? prev.avatar_url,
                  }
                : prev
        );
        setIsEditing(false);
    };

    if (!currentUser) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>My Profile</h1>
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    if (!localUser) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>My Profile</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (isEditing) {
        return (
            <EditProfilePage
                user={{
                    id: localUser.id,
                    username: localUser.username,
                    avatar: localUser.avatar_url ?? null,
                    bio: localUser.bio ?? "",
                }}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Profile</h1>
            <ProfileCard
                username={localUser.username}
                avatar={localUser.avatar_url ?? DEFAULT_AVATAR}
                bio={localUser.bio}
            />
            <Button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
            >
                Edit Profile
            </Button>
        </div>
    );
}

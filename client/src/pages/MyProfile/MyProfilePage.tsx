import { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfilePage from "./EditProfile";
import Button from "../../components/Button/Button";
import styles from "./myProfilePage.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function MyProfilePage() {
    const { currentUser, setCurrentUser, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) return <div className={styles.container}>Loading...</div>;

    if (!currentUser) return <div className={styles.container}>No user</div>;

    useEffect(() => {
        if (currentUser) {
            if (
                !currentUser.username ||
                String(currentUser.username).trim() === ""
            ) {
                // eslint-disable-next-line no-console
                console.debug(
                    "MyProfilePage: currentUser.username is empty",
                    currentUser
                );
            }
            if (currentUser.bio === undefined) {
                // eslint-disable-next-line no-console
                console.debug(
                    "MyProfilePage: currentUser.bio is undefined",
                    currentUser
                );
            }
        }
    }, [currentUser]);

    if (isEditing) {
        return (
            <EditProfilePage
                user={{
                    id: currentUser.id,
                    username: currentUser.username ?? "",
                    avatar: currentUser.avatar_url ?? null,
                    bio: currentUser.bio ?? "",
                }}
                onSave={(updatedUser) => {
                    setCurrentUser({
                        ...currentUser,
                        username: updatedUser.username,
                        bio: updatedUser.bio,
                        avatar_url: updatedUser.avatar_url ?? null,
                    });
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Profile</h1>

            <ProfileCard
                username={currentUser.username ?? ""}
                avatar={
                    currentUser.avatar_url &&
                    currentUser.avatar_url.trim() !== ""
                        ? currentUser.avatar_url
                        : null
                }
                bio={currentUser.bio ?? ""}
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

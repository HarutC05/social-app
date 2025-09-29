import { useState } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { mockUsers } from "../../components/MockData/users";
import EditProfilePage from "./EditProfile";
import Button from "../../components/Button/Button";
import styles from "./myProfilePage.module.css";

export default function MyProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(mockUsers[0]);

    if (isEditing) {
        return (
            <EditProfilePage
                user={currentUser}
                onSave={(updatedUser) => {
                    setCurrentUser(updatedUser);
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
                username={currentUser.username}
                avatar={currentUser.avatar}
                bio={currentUser.bio}
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

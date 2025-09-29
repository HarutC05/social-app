import { useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { usernameIcon } from "../../assets/icons/usernameIcon";
import { bioIcon } from "../../assets/icons/bioIcon";
import { avatarIcon } from "../../assets/icons/avatarIcon";
import styles from "./editProfile.module.css";

interface EditProfilePageProps {
    user?: {
        id: number;
        username: string;
        avatar: string;
        bio: string;
    };
    onSave?: (user: any) => void;
    onCancel?: () => void;
}

export default function EditProfilePage({
    user = {
        id: 0,
        username: "",
        avatar: "",
        bio: "",
    },
    onSave = () => {},
    onCancel = () => {},
}: EditProfilePageProps) {
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [avatar, setAvatar] = useState(user.avatar);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...user, username, bio, avatar });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Profile</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>
                        Username
                    </label>
                    <Input
                        icon={usernameIcon}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="bio" className={styles.label}>
                        Bio
                    </label>
                    <Input
                        icon={bioIcon}
                        type="text"
                        id="bio"
                        name="bio"
                        placeholder="Enter bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="avatar" className={styles.label}>
                        Avatar URL
                    </label>
                    <Input
                        icon={avatarIcon}
                        type="text"
                        id="avatar"
                        name="avatar"
                        placeholder="Enter image URL"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>

                <div className={styles.buttonRow}>
                    <Button type="submit">Save</Button>
                    <Button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

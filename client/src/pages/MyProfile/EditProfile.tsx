import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { usernameIcon } from "../../assets/icons/usernameIcon";
import { bioIcon } from "../../assets/icons/bioIcon";
import styles from "./editProfile.module.css";
import { updateUser, uploadAvatar } from "../../api/usersApi";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../routing/routes";
import type { JSX } from "react/jsx-runtime";

interface EditProfilePageProps {
    user?: {
        id: number;
        username: string;
        avatar?: string | null;
        bio?: string | null;
    };
    onSave?: (user: {
        username: string;
        bio: string;
        avatar_url?: string | null;
    }) => void;
    onCancel?: () => void;
}

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

export default function EditProfilePage({
    user = { id: 0, username: "", avatar: "", bio: "" },
    onSave = () => {},
    onCancel = () => {},
}: EditProfilePageProps): JSX.Element {
    const { currentUser, setCurrentUser } = useAuth();
    const [username, setUsername] = useState(user.username ?? "");
    const [bio, setBio] = useState(user.bio ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(
        user.avatar ?? DEFAULT_AVATAR
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreview(user.avatar ?? DEFAULT_AVATAR);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(String(reader.result));
        };
        reader.readAsDataURL(file);
    }, [file, user.avatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            let avatar_result_url: string | null = null;
            if (file) {
                const res = await uploadAvatar(currentUser.id, file);
                avatar_result_url = res.avatar_url;
            }

            const payload: any = { username, bio };
            if (avatar_result_url) payload.avatar_url = avatar_result_url;

            const updated = await updateUser(currentUser.id, payload);

            const updatedUser = {
                ...currentUser,
                username: updated.username,
                bio: updated.bio ?? "",
                avatar_url: updated.avatar_url ?? null,
            };
            setCurrentUser(updatedUser);

            onSave({
                username: updated.username,
                bio: updated.bio ?? "",
                avatar_url: updated.avatar_url ?? null,
            });
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Profile</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.previewRow}>
                    <img
                        src={preview}
                        alt="avatar preview"
                        className={styles.preview}
                    />
                </div>

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
                        onChange={(e) =>
                            setUsername((e.target as HTMLInputElement).value)
                        }
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
                        onChange={(e) =>
                            setBio((e.target as HTMLInputElement).value)
                        }
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="avatar" className={styles.label}>
                        Upload avatar
                    </label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className={styles.settingsLink}>
                    <p>
                        Want to change your password or other settings? <br />
                        <Link to={ROUTES.SETTINGS}>Go to Settings</Link>
                    </p>
                </div>

                <div className={styles.buttonRow}>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
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

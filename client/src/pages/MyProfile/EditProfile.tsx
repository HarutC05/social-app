import { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { usernameIcon } from "../../assets/icons/usernameIcon";
import { bioIcon } from "../../assets/icons/bioIcon";
import styles from "./editProfile.module.css";
import { updateUser, uploadAvatar, updatePassword } from "../../api/usersApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username ?? "");
    const [bio, setBio] = useState(user.bio ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(
        user.avatar ?? DEFAULT_AVATAR
    );
    const [loading, setLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!file) {
            setPreview(user.avatar ?? DEFAULT_AVATAR);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setPreview(String(reader.result));
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
        setPasswordError(null);

        try {
            if (newPassword || confirmPassword || currentPassword) {
                if (!currentPassword) {
                    setPasswordError(
                        "Current password is required to change password"
                    );
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmPassword) {
                    setPasswordError(
                        "New password and confirm password do not match"
                    );
                    setLoading(false);
                    return;
                }
                if (newPassword && newPassword.length < 6) {
                    setPasswordError(
                        "New password must be at least 6 characters"
                    );
                    setLoading(false);
                    return;
                }
            }

            let avatar_result_url: string | null = null;
            if (file) {
                const res = await uploadAvatar(currentUser.id, file);
                avatar_result_url = res.avatar_url ?? DEFAULT_AVATAR;
            }

            const payload: any = { username, bio };
            if (avatar_result_url) payload.avatar_url = avatar_result_url;

            const updated = await updateUser(currentUser.id, payload);

            if (newPassword) {
                await updatePassword(
                    currentUser.id,
                    currentPassword,
                    newPassword
                );
            }

            onSave({
                username: updated.username,
                bio: updated.bio ?? "",
                avatar_url: updated.avatar_url ?? DEFAULT_AVATAR,
            });
        } catch (err: any) {
            console.error(err);
            if (err?.response?.data?.message) {
                setPasswordError(err.response.data.message);
            }
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

                <hr />

                <h3 className={styles.subtitle}>Change password</h3>
                <div className={styles.inputGroup}>
                    <label htmlFor="currentPassword" className={styles.label}>
                        Current password
                    </label>
                    <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) =>
                            setCurrentPassword(
                                (e.target as HTMLInputElement).value
                            )
                        }
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword" className={styles.label}>
                        New password
                    </label>
                    <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword((e.target as HTMLInputElement).value)
                        }
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                        Confirm new password
                    </label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                (e.target as HTMLInputElement).value
                            )
                        }
                    />
                </div>

                {passwordError && (
                    <div className={styles.error}>{passwordError}</div>
                )}

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

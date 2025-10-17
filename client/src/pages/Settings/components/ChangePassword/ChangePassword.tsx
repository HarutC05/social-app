import { useState } from "react";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import { updatePassword } from "../../../../api/usersApi";
import { useAuth } from "../../../../hooks/useAuth";
import styles from "./changePassword.module.css";

export default function ChangePassword() {
    const { currentUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setError(null);
        setSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await updatePassword(currentUser.id, currentPassword, newPassword);
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Change Password</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <div className={styles.error}>{error}</div>}
                {success && (
                    <div className={styles.success}>Password updated!</div>
                )}

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </Button>
            </form>
        </div>
    );
}

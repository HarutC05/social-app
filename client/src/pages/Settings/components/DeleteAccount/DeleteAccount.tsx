import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { deleteUser } from "../../../../api/usersApi";
import { useNavigate } from "react-router-dom";
import styles from "./deleteAccount.module.css";

export default function DeleteAccount() {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!currentUser) return;
        if (
            !confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            )
        )
            return;

        setLoading(true);
        setError(null);
        try {
            await deleteUser(currentUser.id);
            setCurrentUser(null);
            navigate("/register");
        } catch (err: any) {
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to delete account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Delete Account</h2>
            <p>This action is irreversible. Please be careful.</p>
            {error && <div className={styles.error}>{error}</div>}
            <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={loading}
            >
                {loading ? "Deleting..." : "Delete Account"}
            </button>
        </div>
    );
}

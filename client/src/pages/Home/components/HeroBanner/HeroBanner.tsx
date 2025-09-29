import Button from "../../../../components/Button/Button";
import styles from "./heroBanner.module.css";
import { mockPosts } from "../../../../components/MockData/posts";
import { mockUsers } from "../../../../components/MockData/users";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../routing/routes";

export default function HeroBanner() {
    const navigate = useNavigate();

    function handleCreatePostClick() {
        navigate(ROUTES.CREATE_POST);
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h1 className={styles.title}>Explore the feed</h1>
                <p className={styles.subtitle}>
                    Catch up with the latest posts from people you follow and
                    discover new creators.
                </p>
                <div className={styles.actions}>
                    <Button type="button" onClick={handleCreatePostClick}>
                        Create Post
                    </Button>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>
                                {mockPosts.length}
                            </div>
                            <div className={styles.statLabel}>Posts</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>
                                {mockUsers.length}
                            </div>
                            <div className={styles.statLabel}>Members</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.heroImage} />
            </div>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Button from "../../../../components/Button/Button";
import styles from "./heroBanner.module.css";
import { getPosts } from "../../../../api/postsApi";
import { getUsersCount } from "../../../../api/usersApi";
import { ROUTES } from "../../../../routing/routes";

import heroBannerImage from "../../../../assets/images/heroBannerImage.avif";

export default function HeroBanner() {
    const navigate = useNavigate();

    const [postsCount, setPostsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);

    function handleCreatePostClick() {
        navigate(ROUTES.CREATE_POST);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const postsData = await getPosts(1, 1000);
                const usersData = await getUsersCount();

                setPostsCount(postsData.meta.total);
                setUsersCount(usersData.total);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        }
        fetchData();
    }, []);

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
                                {postsCount}
                            </div>
                            <div className={styles.statLabel}>Posts</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>
                                {usersCount}
                            </div>
                            <div className={styles.statLabel}>Members</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <img
                    src={heroBannerImage}
                    alt="hero banner image"
                    className={styles.heroImage}
                />
            </div>
        </div>
    );
}

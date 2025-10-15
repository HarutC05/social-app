import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, type User } from "../../api/usersApi";
import { getPosts, type Post } from "../../api/postsApi";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./profilePage.module.css";

export default function ProfilePage() {
    const { id } = useParams();
    const userId = Number(id);
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (isNaN(userId)) return;
            setLoading(true);
            try {
                const u = await getUserById(userId);
                if (!u) {
                    setUser(null);
                    setPosts([]);
                    return;
                }
                setUser(u);

                const res = await getPosts(1, 20, userId);
                setPosts(res.data || []);
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setUser(null);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found.</p>;

    const headerClass =
        posts.length === 0
            ? `${styles.profileHeader} ${styles.centeredHeader}`
            : styles.profileHeader;

    return (
        <div className={styles.page}>
            <div className={headerClass}>
                <img
                    src={user.avatar_url || ""}
                    alt={user.username}
                    className={styles.avatar}
                />
                <div className={styles.meta}>
                    <h1 className={styles.username}>{user.username}</h1>
                    <p className={styles.bio}>{user.bio}</p>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className={styles.noPosts}>
                    <p className={styles.noPostsText}>
                        {user.username
                            ? `${user.username} has no posts yet.`
                            : "This user has no posts yet."}
                    </p>
                </div>
            ) : (
                <div className={styles.posts}>
                    {posts.map((p) => (
                        <PostCard
                            key={p.id}
                            postId={p.id}
                            title={p.title}
                            content={p.content}
                            author={user.username}
                            authorId={user.id}
                            avatar={user.avatar_url || ""}
                            likes={p.likesCount || 0}
                            comments={p.commentsCount || 0}
                            image={p.image_url || ""}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

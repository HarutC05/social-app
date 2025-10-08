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
                if (!u) return setUser(null);
                setUser(u);

                const res = await getPosts(1, 20, userId);
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found.</p>;

    return (
        <div className={styles.page}>
            <div className={styles.profileHeader}>
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
        </div>
    );
}

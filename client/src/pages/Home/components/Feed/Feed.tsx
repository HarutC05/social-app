import { useEffect, useState } from "react";
import PostCard from "../../../../components/PostCard/PostCard";
import { getPosts, type Post } from "../../../../api/postsApi";
import styles from "./feed.module.css";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await getPosts(page, limit);
                setPosts(res.data);
                setTotalPages(res.meta.totalPages);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page, limit]);

    if (loading) return <p>Loading posts...</p>;
    if (!posts.length) return <p>No posts yet.</p>;

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    postId={post.id}
                    title={post.title}
                    content={post.content}
                    author={post.author?.username || "Unknown"}
                    authorId={post.author?.id}
                    avatar={post.author?.avatar_url ?? undefined}
                    likes={post.likesCount || 0}
                    comments={post.commentsCount || 0}
                    image={post.image_url || undefined}
                />
            ))}

            <div className={styles.pagination}>
                <button
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                        <button
                            key={num}
                            className={`${styles.pageBtn} ${page === num ? styles.activePage : ""}`}
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </button>
                    )
                )}

                <button
                    className={styles.pageBtn}
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </>
    );
}

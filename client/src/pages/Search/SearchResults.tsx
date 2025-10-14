import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import { getPosts, type Post } from "../../api/postsApi";
import styles from "./searchResults.module.css";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const q = String(searchParams.get("q") ?? "").trim();
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchAndFilter = async () => {
            try {
                setLoading(true);

                // Fetch a large enough batch to filter locally
                const res = await getPosts(1, 100);
                if (!isMounted) return;

                const posts = res.data as Post[];
                const searchTerm = q.toLowerCase();

                const filtered = posts.filter((p) => {
                    const text =
                        `${p.title ?? ""} ${p.content ?? ""} ${p.author?.username ?? ""}`.toLowerCase();
                    return text.includes(searchTerm);
                });

                setResults(filtered);
            } catch (err) {
                console.error("Error fetching search results:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (q) {
            fetchAndFilter();
        } else {
            setLoading(false);
            setResults([]);
        }

        return () => {
            isMounted = false;
        };
    }, [q]);

    if (!q) {
        return (
            <div className={styles.container}>
                <p className={styles.message}>Please enter a search term.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <p className={styles.message}>Searching...</p>
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className={styles.container}>
                <p className={styles.message}>No results found for “{q}”.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>
                Search results for “<span className={styles.query}>{q}</span>”
            </h2>

            <div className={styles.results}>
                {results.map((post) => (
                    <PostCard
                        key={post.id}
                        postId={post.id}
                        title={post.title}
                        content={post.content}
                        author={post.author?.username || "Unknown"}
                        authorId={post.author?.id ?? 0}
                        avatar={post.author?.avatar_url || ""}
                        likes={post.likesCount || 0}
                        comments={post.commentsCount || 0}
                        image={post.image_url || ""}
                    />
                ))}
            </div>
        </div>
    );
}

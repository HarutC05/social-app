import { useMemo, useState } from "react";
import styles from "./postCard.module.css";
import { likeIcon } from "../../assets/icons/likeIcon";
import { commentIcon } from "../../assets/icons/commentIcon";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { mockComments } from "../../components/MockData/comments";
import { mockUsers } from "../../components/MockData/users";

interface PostCardProps {
    postId?: number;
    title: string;
    content: string;
    author: string;
    avatar: string;
    likes: number;
    comments: number;
    image?: string;
}

interface Comment {
    id: number;
    author: string;
    content: string;
}

export default function PostCard({
    postId,
    title,
    content,
    author,
    avatar,
    likes,
    comments,
    image,
}: PostCardProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [showComments, setShowComments] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");

    const initialComments = useMemo(() => {
        let seeded: Comment[] = [];

        if (typeof postId === "number") {
            const fromMock = mockComments
                .filter((c) => c.postId === postId)
                .map((c) => {
                    const user = mockUsers.find((u) => u.id === c.userId);
                    return {
                        id: c.id,
                        author: user?.username ?? `User ${c.userId}`,
                        content: c.content,
                    };
                });
            seeded = fromMock;
        }

        const placeholdersNeeded = Math.max(0, comments - seeded.length);
        for (let i = 0; i < placeholdersNeeded; i++) {
            seeded.push({
                id: (seeded.length + 1) * 100 + i,
                author: `User${i + 1}`,
                content: `Placeholder comment #${i + 1}`,
            });
        }

        if (seeded.length === 0 && comments === 0) {
            seeded = [
                { id: 1, author: "Alice", content: "Nice post!" },
                { id: 2, author: "Bob", content: "Thanks for sharing." },
                { id: 3, author: "Charlie", content: "Love this." },
            ];
        }

        return seeded;
    }, [postId, comments]);

    const [commentList, setCommentList] = useState<Comment[]>(initialComments);

    const toggleLike = () => {
        setLiked((prev) => !prev);
        setLikeCount((prev) => prev + (liked ? -1 : 1));
    };

    const toggleComments = () => {
        setShowComments((prev) => !prev);
        if (!showComments) {
            setShowAllComments(false);
        }
    };

    const addComment = () => {
        const text = commentInput.trim();
        if (!text) return;
        const newComment: Comment = {
            id: Date.now(),
            author: "You",
            content: text,
        };
        setCommentList((prev) => [newComment, ...prev]);
        setCommentInput("");
    };

    const VISIBLE_COUNT = 2;
    const totalCount = commentList.length;

    const shownComments = showAllComments
        ? commentList
        : commentList.slice(0, VISIBLE_COUNT);
    const moreCount = Math.max(0, totalCount - VISIBLE_COUNT);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <img
                    src={avatar}
                    alt={`${author}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.headerMeta}>
                    <span className={styles.author}>{author}</span>
                </div>
            </div>

            {image && (
                <div className={styles.imageWrapper}>
                    <img src={image} alt={title} className={styles.postImage} />
                </div>
            )}

            <h2 className={styles.title}>{title}</h2>
            <p className={styles.content}>{content}</p>

            <div className={styles.footer}>
                <button
                    className={`${styles.action} ${liked ? styles.liked : ""}`}
                    onClick={toggleLike}
                    aria-pressed={liked}
                >
                    {likeIcon}
                    <span className={styles.actionCount}>{likeCount}</span>
                </button>

                <button className={styles.action} onClick={toggleComments}>
                    {commentIcon}
                    <span className={styles.actionCount}>{totalCount}</span>
                </button>
            </div>

            {showComments && (
                <div className={styles.commentsSection}>
                    <div className={styles.commentBox}>
                        <Input
                            type="text"
                            placeholder="Add a comment..."
                            icon={commentIcon}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                        <Button
                            type="button"
                            className={styles.addButton}
                            disabled={!commentInput.trim()}
                            onClick={addComment}
                        >
                            Add
                        </Button>
                    </div>

                    <div className={styles.commentsList}>
                        {shownComments.map((c) => (
                            <div key={c.id} className={styles.commentItem}>
                                <div className={styles.commentAuthor}>
                                    {c.author}
                                </div>
                                <div className={styles.commentText}>
                                    {c.content}
                                </div>
                            </div>
                        ))}

                        {moreCount > 0 && !showAllComments && (
                            <button
                                className={styles.viewMore}
                                onClick={() => setShowAllComments(true)}
                            >
                                View {moreCount} more comment
                                {moreCount > 1 ? "s" : ""}
                            </button>
                        )}

                        {showAllComments && totalCount > VISIBLE_COUNT && (
                            <button
                                className={styles.viewMore}
                                onClick={() => setShowAllComments(false)}
                            >
                                Hide comments
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

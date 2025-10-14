import { useEffect, useState } from "react";
import styles from "./postCard.module.css";
import { likeIcon } from "../../assets/icons/likeIcon";
import { commentIcon } from "../../assets/icons/commentIcon";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import {
    getCommentsByPost,
    createComment,
    type Comment as ApiComment,
} from "../../api/commentsApi";
import { likePost, unlikePost } from "../../api/likesApi";
import type { JSX } from "react/jsx-runtime";
import { useAuth } from "../../hooks/useAuth";

const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

interface PostCardProps {
    postId: number;
    title: string;
    content: string;
    author: string;
    authorId?: number;
    avatar?: string | null;
    likes: number;
    comments?: number;
    image?: string;
}

export default function PostCard({
    postId,
    title,
    content,
    author,
    authorId,
    avatar,
    likes,
    comments = 0,
    image,
}: PostCardProps): JSX.Element {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [showComments, setShowComments] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [commentList, setCommentList] = useState<ApiComment[]>([]);
    const [commentCount, setCommentCount] = useState<number>(comments);
    const { currentUser } = useAuth();

    useEffect(() => {
        let mounted = true;
        if (!postId) return;
        getCommentsByPost(postId)
            .then((data) => {
                if (!mounted) return;
                const mapped = data.map(
                    (c) =>
                        ({
                            ...c,
                            authorUsername:
                                c.author?.username ?? `User ${c.authorId}`,
                            authorAvatar: c.author?.avatar_url ?? undefined,
                        }) as ApiComment
                );
                setCommentList(mapped);
                setCommentCount(mapped.length);
            })
            .catch((err) => {
                console.error("Error fetching comments:", err);
            });
        return () => {
            mounted = false;
        };
    }, [postId]);

    const toggleLike = async () => {
        try {
            if (!currentUser) return;
            if (liked) {
                await unlikePost(postId);
                setLikeCount((prev) => Math.max(0, prev - 1));
            } else {
                await likePost(postId);
                setLikeCount((prev) => prev + 1);
            }
            setLiked((prev) => !prev);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const toggleComments = () => {
        setShowComments((prev) => !prev);
        if (!showComments) setShowAllComments(false);
    };

    const addComment = async () => {
        const text = commentInput.trim();
        if (!text) return;
        try {
            const newComment = await createComment(postId, text);
            const mapped = {
                ...newComment,
                authorUsername:
                    newComment.author?.username ??
                    `User ${newComment.authorId}`,
                authorAvatar: newComment.author?.avatar_url ?? undefined,
            } as ApiComment;
            setCommentList((prev) => [mapped, ...prev]);
            setCommentCount((prev) => prev + 1);
            setCommentInput("");
            setShowComments(true);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const VISIBLE_COUNT = 2;
    const totalCount = commentCount;
    const shownComments = showAllComments
        ? commentList
        : commentList.slice(0, VISIBLE_COUNT);
    const moreCount = Math.max(0, totalCount - VISIBLE_COUNT);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                {authorId ? (
                    <Link to={`/users/${authorId}`}>
                        <img
                            src={avatar ?? DEFAULT_AVATAR}
                            alt={`${author}'s avatar`}
                            className={styles.avatar}
                        />
                    </Link>
                ) : (
                    <img
                        src={avatar ?? DEFAULT_AVATAR}
                        alt={`${author}'s avatar`}
                        className={styles.avatar}
                    />
                )}
                <div className={styles.headerMeta}>
                    {authorId ? (
                        <Link
                            to={`/users/${authorId}`}
                            className={styles.authorLink}
                        >
                            <span className={styles.author}>{author}</span>
                        </Link>
                    ) : (
                        <span className={styles.author}>{author}</span>
                    )}
                </div>
            </div>

            {image && (
                <div className={styles.imageWrapper}>
                    <img
                        src={image.replace(/(\?blur=\d+)/, "")}
                        alt={title}
                        className={styles.postImage}
                        loading="lazy"
                    />
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
                            onChange={(e) =>
                                setCommentInput(
                                    (e.target as HTMLInputElement).value
                                )
                            }
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
                                <Link
                                    to={`/users/${c.authorId}`}
                                    className={styles.commentAuthorRow}
                                >
                                    <img
                                        src={c.authorAvatar ?? DEFAULT_AVATAR}
                                        alt={c.authorUsername}
                                        className={styles.commentAvatar}
                                    />
                                    <div className={styles.commentAuthor}>
                                        {c.authorUsername}
                                    </div>
                                </Link>
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

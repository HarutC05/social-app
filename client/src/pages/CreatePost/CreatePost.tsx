import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./createPost.module.css";
import {
    createPost as apiCreatePost,
    getPostById,
    updatePost,
} from "../../api/postsApi";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

export default function CreatePostPage(): JSX.Element {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const { currentUser } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsText, setTagsText] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEditing || !id) return;
        (async () => {
            try {
                const post = await getPostById(Number(id));
                setTitle(post.title);
                setContent(post.content);
                setTags(post.tags ? post.tags.split(",") : []);
                if (post.image_url) setPreviewUrl(post.image_url);
            } catch (err) {
                console.error("Failed to load post for editing:", err);
            }
        })();
    }, [isEditing, id]);

    useEffect(() => {
        if (!imageFile) {
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!currentUser) return;
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        try {
            let image_url = previewUrl ?? undefined;

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await apiClient.post("/uploads", formData);
                image_url = uploadRes.data?.url;
            }

            const postData = {
                title: title.trim(),
                content: content.trim(),
                tags: tags.length ? tags.join(",") : undefined,
                authorId: currentUser.id,
                image_url,
            };

            if (isEditing && id) {
                await updatePost(Number(id), postData);
            } else {
                await apiCreatePost(postData);
            }

            navigate("/");
        } catch (err) {
            console.error(
                isEditing ? "Failed to update post:" : "Failed to create post:",
                err
            );
        } finally {
            setLoading(false);
        }
    }

    function addTagFromText() {
        const parts = tagsText
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length === 0) return;
        setTags((t) => Array.from(new Set([...t, ...parts])));
        setTagsText("");
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isEditing ? "Edit Post" : "Create Post"}
                </h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <Input
                            type="text"
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Content</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Write your post..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                        />
                    </div>

                    <div className={styles.row}>
                        <div
                            className={`${styles.dropzone} ${
                                isDragging ? styles.dragging : ""
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files?.[0])
                                    setImageFile(e.dataTransfer.files[0]);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setImageFile(e.target.files?.[0] ?? null)
                                }
                                className={styles.fileInput}
                            />
                            {!previewUrl ? (
                                <div className={styles.dropContent}>
                                    <div className={styles.dropTitle}>
                                        Add an image
                                    </div>
                                    <div className={styles.dropHint}>
                                        Drag & drop or click to browse
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.previewWrap}>
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className={styles.preview}
                                    />
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            setImageFile(null);
                                            setPreviewUrl(null);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.tagsCol}>
                            <label className={styles.label}>Tags</label>
                            <div className={styles.tagsInputRow}>
                                <Input
                                    type="text"
                                    placeholder="Add tags"
                                    value={tagsText}
                                    onChange={(e) =>
                                        setTagsText(e.target.value)
                                    }
                                />
                                <Button type="button" onClick={addTagFromText}>
                                    Add
                                </Button>
                            </div>
                            <div className={styles.tagsRow}>
                                {tags.map((t) => (
                                    <div className={styles.tag} key={t}>
                                        <span>{t}</span>
                                        <button
                                            type="button"
                                            className={styles.removeTag}
                                            onClick={() =>
                                                setTags((prev) =>
                                                    prev.filter((x) => x !== t)
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? isEditing
                                    ? "Saving..."
                                    : "Publishing..."
                                : isEditing
                                  ? "Save Changes"
                                  : "Publish"}
                        </Button>
                        <Button
                            type="button"
                            className={styles.secondary}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

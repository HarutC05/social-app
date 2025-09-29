import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./createPost.module.css";

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsText, setTagsText] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    function onFileChosen(file?: File | null) {
        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        setImageFile(file);
    }

    function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        onFileChosen(file);
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        onFileChosen(file);
    }

    function removeImage() {
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function addTagFromText() {
        const raw = tagsText.trim();
        if (!raw) return;
        const parts = raw
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length === 0) return;
        setTags((t) => {
            const merged = [...t];
            for (const p of parts) {
                if (!merged.includes(p)) merged.push(p);
            }
            return merged;
        });
        setTagsText("");
    }

    function removeTag(tag: string) {
        setTags((t) => t.filter((x) => x !== tag));
    }

    // function handleKeyTags(e: React.KeyboardEvent<HTMLInputElement>) {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         addTagFromText();
    //     }
    // }

    function canSubmit() {
        return title.trim().length > 0 && content.trim().length > 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit()) return;
        const newPost = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            image: previewUrl,
            tags,
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
        };
        console.log("Created post (UI only):", newPost);
        navigate("/");
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Post</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <Input
                            icon={undefined}
                            type="text"
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.title}
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
                            className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onFileInputChange}
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
                                        onClick={removeImage}
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
                                    icon={undefined}
                                    type="text"
                                    placeholder="Add tags"
                                    value={tagsText}
                                    onChange={(e) =>
                                        setTagsText(e.target.value)
                                    }
                                    // onKeyDown={handleKeyTags}
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
                                            className={styles.removeTag}
                                            onClick={() => removeTag(t)}
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={!canSubmit()}>
                            {canSubmit() ? "Publish" : "Fill title & content"}
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

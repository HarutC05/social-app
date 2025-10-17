import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import EditProfilePage from "./EditProfile";
import Button from "../../components/Button/Button";
import styles from "./myProfilePage.module.css";
import { useAuth } from "../../hooks/useAuth";
import { getPosts, type Post } from "../../api/postsApi";
import PostCard from "../../components/PostCard/PostCard";

export default function MyProfilePage() {
    const { currentUser, setCurrentUser, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setPosts([]);
            setLoadingPosts(false);
            return;
        }

        let mounted = true;
        const fetch = async () => {
            setLoadingPosts(true);
            try {
                const res = await getPosts(1, 50, currentUser.id);
                if (!mounted) return;
                setPosts(res.data || []);
            } catch (err) {
                console.error("Error fetching my posts:", err);
                if (mounted) setPosts([]);
            } finally {
                if (mounted) setLoadingPosts(false);
            }
        };
        fetch();

        return () => {
            mounted = false;
        };
    }, [currentUser]);

    if (isLoading) return <div className={styles.container}>Loading...</div>;
    if (!currentUser) return <div className={styles.container}>No user</div>;

    if (isEditing) {
        return (
            <EditProfilePage
                user={{
                    id: currentUser.id,
                    username: currentUser.username ?? "",
                    avatar: currentUser.avatar_url || null,
                    bio: currentUser.bio ?? "",
                }}
                onSave={(updatedUser) => {
                    setCurrentUser({
                        ...currentUser,
                        username: updatedUser.username,
                        bio: updatedUser.bio,
                        avatar_url: updatedUser.avatar_url?.trim() || null,
                    });
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Profile</h1>

            <ProfileCard
                username={currentUser.username ?? ""}
                avatar={currentUser.avatar_url || null}
                bio={currentUser.bio ?? ""}
            />

            <Button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
            >
                Edit Profile
            </Button>

            {posts.length !== 0 && (
                <h2 className={styles.sectionTitle}>My Posts</h2>
            )}
            {loadingPosts ? (
                <div className={styles.loadingPosts}>Loading your posts...</div>
            ) : posts.length === 0 ? (
                <div className={styles.noPosts}>
                    <p className={styles.noPostsText}>
                        {currentUser.username
                            ? `${currentUser.username} has no posts yet.`
                            : "You have no posts yet."}
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
                            author={currentUser.username}
                            authorId={currentUser.id}
                            avatar={currentUser.avatar_url || ""}
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

import PostCard from "../../components/PostCard/PostCard";
import { mockPosts } from "../../components/MockData/posts";
import { mockUsers } from "../../components/MockData/users";
import styles from "./homePage.module.css";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RIghtPanel/RightPanel";

export default function HomePage() {
    return (
        <div className={styles.page}>
            <LeftPanel />
            <div className={styles.center}>
                <HeroBanner />
                <div className={styles.feed}>
                    {mockPosts.map((post) => {
                        const author = mockUsers.find(
                            (user) => user.id === post.authorId
                        );
                        return (
                            <PostCard
                                key={post.id}
                                postId={post.id}
                                title={post.title}
                                content={post.content}
                                author={author?.username || "Unknown"}
                                avatar={author?.avatar || ""}
                                likes={post.likes}
                                comments={post.comments}
                                image={post.image}
                            />
                        );
                    })}
                </div>
            </div>
            <RightPanel />
        </div>
    );
}

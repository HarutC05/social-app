import { useParams } from "react-router-dom";

const PostPage = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Post {id}</h1>
            <p>
                Here you would show the post content, author, comments, likes,
                etc.
            </p>
        </div>
    );
};

export default PostPage;

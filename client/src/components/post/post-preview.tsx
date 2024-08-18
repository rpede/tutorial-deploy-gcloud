import { Link } from "react-router-dom";
import { Post } from "../../api";

export default function PostPreview({ post }: { post: Post }) {
  return (
    <article className="py-1">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <small>
            <b>
              <Link to={`/author/${post.id}`}>{post.author?.userName}</Link>
            </b>{" "}
            on {formatDate(post.publishedAt!)}{" "}
            {post.editedAt ? (
              <i>(Edited: {formatDate(post.editedAt)})</i>
            ) : (
              <></>
            )}
          </small>
          <p>{post.content}</p>
          <div className="card-actions justify-end">
            <Link to={`/post/${post.id}`} className="btn btn-primary">
              Read
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Date(date).toDateString();
}

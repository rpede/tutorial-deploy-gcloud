import { CommentForPost } from "../../api";
import Avatar from "../base/avatar";

export default function Comments({ comments }: { comments: CommentForPost[] }) {
  return comments.map((comment) => (
    <div key={comment.id} className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Avatar userName={comment.author?.userName} />
        </div>
      </div>
      <div className="chat-header">
        {comment.author?.userName ?? "Anonymous"}
        <time className="text-xs opacity-50">
          {new Date(comment.createdAt!).toLocaleString()}
        </time>
      </div>
      <div className="chat-bubble">{comment.content}</div>
    </div>
  ));
}

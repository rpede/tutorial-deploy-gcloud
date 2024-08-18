import { SubmitHandler, useForm } from "react-hook-form";
import { CommentFormData } from "../../api";
import { useNavigate } from "react-router-dom";
import { http } from "../../http";

export default function CommentForm({ postId }: { postId: number }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>();

  const onSubmit: SubmitHandler<CommentFormData> = async (data) => {
    await http.blogCommentCreate(postId, data);
    navigate("");
  };
  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        <div className="flex-1">
          <textarea
            placeholder="Comment"
            className={`textarea textarea-bordered w-full ${
              errors.content && "input-error"
            }`}
            {...register("content", { required: "Content is required" })}
          ></textarea>
          <small className="text-error">{errors.content?.message}</small>
        </div>
        <div className="flex-none place-self-end pl-3">
          <button type="submit" className="btn btn-primary">
            📨 Post
          </button>
        </div>
      </div>
    </form>
  );
}

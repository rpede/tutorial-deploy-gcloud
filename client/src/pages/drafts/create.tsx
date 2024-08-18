import { useNavigate } from "react-router-dom";
import { DraftFormData } from "../../api";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { http } from "../../http";

const schema: yup.ObjectSchema<DraftFormData> = yup
  .object({
    title: yup.string().required(),
    content: yup.string().required(),
    publish: yup.boolean().default(false).nullable(),
  })
  .required();

export default function DraftCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<DraftFormData> = async (data) => {
    const promise = http.draftCreate(data);
    await toast.promise(promise, {
      success: "Draft created successfully",
      error: "Draft creation failed",
      loading: "Creating draft...",
    });
    await promise.then(() => navigate(".."));
  };

  return (
    <div className="card w-full bg-neutral shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create post</h2>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              placeholder="Title"
              type="text"
              className={`input input-bordered w-full max-w-xs ${
                errors.title && "input-error"
              }`}
              {...register("title")}
            />
            <small className="text-error">{errors.title?.message}</small>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              placeholder="Content"
              className={`textarea textarea-bordered w-full ${
                errors.content && "input-error"
              }`}
              {...register("content")}
            />
            <small className="text-error">{errors.content?.message}</small>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Publish</span>
              <input
                type="checkbox"
                className="toggle"
                {...register("publish")}
              />
            </label>
          </div>
          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

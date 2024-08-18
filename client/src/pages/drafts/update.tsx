import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { DraftDetail, DraftFormData } from "../../api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { http } from "../../http";
import { Loading } from "../../components/base/loading";

export async function draftLoader({ params }: LoaderFunctionArgs) {
  const response = await http.draftDetail(Number.parseInt(params.id!));
  return response.data;
}

const schema: yup.ObjectSchema<DraftFormData> = yup
  .object({
    title: yup.string().required(),
    content: yup.string().required(),
    publish: yup.boolean().default(false).nullable(),
  })
  .required();

export default function DraftUpdate() {
  const draft = useLoaderData() as DraftDetail;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  if (!draft) return <Loading />;

  const onSubmit: SubmitHandler<DraftFormData> = async (data) => {
    const promise = http.draftUpdate(draft.id!, data);
    await toast.promise(promise, {
      success: "Draft updated successfully",
      error: "Draft update failed",
      loading: "Updating draft...",
    });
    await promise.then(() => navigate("/draft"));
  };

  return (
    <div className="card w-full bg-neutral shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Update post</h2>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <input
              placeholder="Title"
              type="text"
              defaultValue={draft.title!}
              className={`input input-bordered w-full max-w-xs ${
                errors.title && "input-error"
              }`}
              {...register("title")}
            />
            <small className="text-error">{errors.title?.message}</small>
          </div>
          <div className="form-control">
            <textarea
              placeholder="Content"
              defaultValue={draft.content!}
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
            <small className="text-error">{errors.publish?.message}</small>
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

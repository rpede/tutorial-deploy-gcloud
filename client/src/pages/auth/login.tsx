import { Credentials } from "../../atoms/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

const schema: yup.ObjectSchema<Credentials> = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })
  .required();

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<Credentials> = (data) => {
    // TODO login and give user feedback
    toast(`Login as "${data.email}". Implementation is missing!`);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Blogging offers numerous advantages, serving as a platform for
            sharing expertise, connecting with a global audience, and boosting
            credibility. Through regular content creation, bloggers can enhance
            website traffic and search engine rankings, while fostering
            community engagement and meaningful interactions. For businesses,
            blogs are invaluable for generating leads, nurturing customer
            relationships, and driving sales conversions. In essence, blogging
            empowers individuals and businesses to establish influence,
            visibility, and success in the digital landscape.
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form
            className="card-body"
            method="post"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                className={`input input-bordered ${
                  errors.email && "input-error"
                }`}
                {...register("email")}
              />
              <small className="text-error">{errors.email?.message}</small>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className={`input input-bordered ${
                  errors.password && "input-error"
                }`}
                {...register("password")}
              />
              <small className="text-error">{errors.password?.message}</small>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

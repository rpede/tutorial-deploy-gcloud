import animation from "/src/assets/1715419052584.gif";
import { RegisterRequest } from "../../api";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { http } from "../../http";

type Inputs = RegisterRequest & { passwordRepeat: string };

const schema: yup.ObjectSchema<Inputs> = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    passwordRepeat: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
  })
  .required();

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null);
    try {
      try {
        const createPromise = http.authRegisterCreate(data);
        toast.promise(createPromise, {
          success: "Registered successfully",
          error: "Registration failed",
          loading: "Registering...",
        });
        await createPromise;
        navigate("/register-success");
      } catch (e: any) {
        setError(e.message);
      }
    } catch (e: any) {}
  };

  return (
    <>
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            onClick={() => setError(null)}
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign-up now!</h1>
            <img className="py-6" src={animation} />
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form
              className="card-body"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className={`input input-bordered ${
                    errors.name && "input-error"
                  }`}
                  {...register("name")}
                />
                <small className="text-error">{errors.name?.message}</small>
              </div>
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
                  className={`input input-bordered  ${
                    errors.password && "input-error"
                  }`}
                  {...register("password")}
                />
                <small className="text-error">{errors.password?.message}</small>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Repeat password</span>
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  className={`input input-bordered  ${
                    errors.passwordRepeat && "input-error"
                  }`}
                  {...register("passwordRepeat")}
                />
                <small className="text-error">
                  {errors.passwordRepeat?.message}
                </small>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

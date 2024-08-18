import { Link } from "react-router-dom";
import { useAuth } from "../../atoms/auth";

export default function WelcomeHero() {
  const { user } = useAuth();
  return (
    <div className="hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold prose">Welcome</h1>
          {user && <h2 className="prose">{user.username}</h2>}
          <p className="py-6 prose">
            This blog site contains interesting articles from various authors.
            Feel free to read and share your thoughts.
          </p>
          {!user && (
            <>
              <Link to="/register" className="btn btn-primary mx-1">
                Register
              </Link>
              <Link to="/login" className="btn btn-accent mx-1">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

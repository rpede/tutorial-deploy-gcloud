import { Link } from "react-router-dom";
import ProfileDropdown from "./profile-dropdown";
import { useAuth } from "../../atoms/auth";

export function Navbar() {
  const { user } = useAuth();
  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Blog
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          {user?.canPublish && (
            <li>
              <Link to={"/draft"}>Draft</Link>
            </li>
          )}
        </ul>
        <ProfileDropdown />
      </div>
    </div>
  );
}

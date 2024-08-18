import { Link } from "react-router-dom";
import Avatar from "./avatar";
import { useAuth } from "../../atoms/auth";
import toast from "react-hot-toast";

export default function ProfileDropdown() {
  const { user } = useAuth();

  let items: JSX.Element;
  if (user) {
    items = (
      <>
        <li>
          <a>Profile</a>
        </li>
        <li>
          <button onClick={() => toast("Logout implementation is missing!")}>
            Logout
          </button>
        </li>
      </>
    );
  } else {
    items = (
      <>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </>
    );
  }
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <Avatar userName={user?.username} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        {items}
      </ul>
    </div>
  );
}

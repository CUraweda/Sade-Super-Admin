import { BsList } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { LoginStore } from "../store/Store";

const Navbar = () => {
  const navigate = useNavigate();
  const { removeToken } = LoginStore();

  const logout = () => {
    sessionStorage.clear();
    removeToken();
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div>
      <div className="navbar shadow-md bg-base-100">
        <div className="flex-1">
          <label
            className="btn btn-ghost text-3xl lg:hidden"
            htmlFor="my-drawer-2"
          >
            <BsList />
          </label>
        </div>

        <div className="flex-none gap-5">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src="https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              {/* <li>
                <a className="justify-between">Profile</a>
              </li> */}

              <li onClick={logout} className="text-red-500">
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

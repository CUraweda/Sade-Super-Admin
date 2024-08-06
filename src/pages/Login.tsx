import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../middleware/Api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginStore } from "../store/Store";
import Swal from "sweetalert2";
import logo from "../assets/sade.png";
import bg from "../assets/bg2.png";

const schema = Yup.object({
  email: Yup.string().required("email required"),
  password: Yup.string().required("Password required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { setToken, setRole, setId } = LoginStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const Login = async () => {
    const { email, password } = formik.values;
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please check your username or password again!",
      });
      return;
    }
    try {
      setLoading(true);
      const emailLower = email.toLowerCase();
      const response = await Auth.Login(emailLower, password);
      const role = response.data.data.role_id;
      const id = response.data.data.id;
      setRole(role.toString());
      setId(id?.toString());
      localStorage.setItem("role", role.toString());
      if (role == 1) {
        setToken(response.data.tokens.access.token);
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "akun anda tidak memiliki akses!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please make sure your username and password are correct!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full flex flex-col justify-center items-center min-h-screen"
        style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
      >
        <div className="w-full sm:w-1/4 bg-white shadow-md rounded-md flex justify-center items-center p-3 flex-col">
          <div className="w-32 mt-5">
            <img src={logo} alt="" />
          </div>
          <span className="my-10 text-3xl text-black font-bold">
            Login Administrator
          </span>
          <div className="w-full flex flex-col gap-3 ">
            <div className="w-full flex justify-center flex-col items-center">
              <label htmlFor="" className="w-5/6 font-bold text-black">
                Username
              </label>
              <input
                type="text"
                name="email"
                placeholder="Type here"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center flex-col items-center">
              <label htmlFor="" className="w-5/6 font-bold text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Type here"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center my-5">
              <button
                className="btn btn-ghost bg-green-500 text-white w-5/6"
                onClick={Login}
              >
                {loading ? (
                  <span className="loading loading-infinity loading-lg"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

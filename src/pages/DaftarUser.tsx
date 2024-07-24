import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { User } from "../middleware/Api";
import { UserList } from "../middleware/utils";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginStore } from "../store/Store";
import Modal, { openModal, closeModal } from "../component/ModalProps";
import Swal from "sweetalert2";

const DaftarUser = () => {
  const { token } = LoginStore();
  const [user, setUser] = useState<UserList[]>([]);
  const [role, setRole] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
  });
  const [editingUser, setEditingUser] = useState<UserList | null>(null);

  const validationSchemaAdd = Yup.object({
    full_name: Yup.string().required("Nama tidak boleh kosong"),
    email: Yup.string().required("Email tidak boleh kosong"),
    password: Yup.string().required("Password tidak boleh kosong"),
    confirm_password: Yup.string().required(
      "Konfirmasi Password tidak boleh kosong"
    ),
    role_id: Yup.string().required("Role tidak boleh kosong"),
  });

  const validationSchemaEdit = Yup.object({
    full_name: Yup.string().required("Nama tidak boleh kosong"),
    email: Yup.string().required("Email tidak boleh kosong"),
    address: Yup.string().required("Alamat tidak boleh kosong"),
    role_id: Yup.string().required("Role tidak boleh kosong"),
  });

  const formikCreateUser = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role_id: 1,
    },
    validationSchema: validationSchemaAdd,
    onSubmit: (values) => {
      handleCreateUser(values);
    },
  });

  const formikEditUser = useFormik({
    initialValues: {
      full_name: editingUser?.full_name || "",
      email: editingUser?.email || "",
      address: editingUser?.address || "",
      role_id: editingUser?.role_id || 1,
    },
    enableReinitialize: true,
    validationSchema: validationSchemaEdit,
    onSubmit: (values) => {
      if (editingUser) {
        handleEditUser(values, editingUser.id);
      }
    },
  });

  useEffect(() => {
    DataUser();
    DataRole();
  }, [filter, search]);

  const DataUser = async () => {
    try {
      const response = await User.GetAllDataUser(
        token,
        filter.page,
        search,
        filter.limit
      );
      const { result, ...meta } = response.data.data;
      setUser(result);
      setPageMeta(meta);
    } catch (error) {
      console.error(error);
    }
  };

  const DataRole = async () => {
    try {
      const response = await User.GetDataRole(token);
      setRole(response.data.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      const { full_name, email, password, confirm_password, role_id } = values;
      const data = {
        full_name,
        email,
        password,
        confirm_password,
        role_id,
      };
      await User.CreateUser(token, data);

      closeModal("addUserModal");
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menambahkan data User",
      });
      DataUser();
    } catch (error) {
      closeModal("addUserModal");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menambahkan data User, silakan refresh halaman!",
      });
    }
  };

  const handleEditUser = async (values: any, id: number) => {
    try {
      const { full_name, email, address, role_id } = values;
      const data = {
        full_name,
        email,
        address,
        role_id,
      };
      await User.EditUser(token, data, id);

      closeModal("editUserModal");
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Mengupdate data User",
      });
      DataUser();
    } catch (error) {
      closeModal("editUserModal");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengupdate data User, silakan refresh halaman!",
      });
    }
  };

  const trigerDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteUser(id);
      }
    });
  };

  const HandleDeleteUser = async (id: number) => {
    try {
      await User.DeleteUser(token, id);
      DataUser();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key !== "page") obj["page"] = 0;
    setFilter(obj);
  };

  const handleAddUser = () => {
    formikCreateUser.resetForm();
    openModal("addUserModal");
  };

  const handleEditUserModal = (user: UserList) => {
    setEditingUser(user);
    formikEditUser.setValues({
      full_name: user.full_name,
      email: user.email,
      address: user.address,
      role_id: user.role_id,
    });
    openModal("editUserModal");
  };

  return (
    <div className="w-full flex flex-col items-center p-5">
      <span className="text-xl font-bold">Daftar User</span>
      <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md ">
        <div className="w-full flex justify-end my-4 gap-2 items-center">
          <label className="input input-sm input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          <button
            className="btn btn-ghost bg-blue-500 btn-sm text-white "
            onClick={handleAddUser}
          >
            <FaPlus />
            Tambah
          </button>
        </div>
        <table className="table table-zebra table-sm">
          <thead className="bg-blue-300">
            <tr>
              <th>No</th>
              <th>Nama User</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((item, index) => (
              <tr key={item.id}>
                <td>{filter.page * filter.limit + index + 1}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.address}</td>
                <td>
                  <div className="join">
                    <button
                      className="btn btn-ghost btn-sm text-orange-500 text-xl"
                      onClick={() => handleEditUserModal(item)}
                    >
                      <FaPencil />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-red-500 text-xl"
                      onClick={() => trigerDelete(item.id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControl
          meta={pageMeta}
          onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
          onNextClick={() => handleFilter("page", pageMeta.page + 1)}
          onJumpPageClick={(val) => handleFilter("page", val)}
          onLimitChange={(val) => handleFilter("limit", val)}
        />
      </div>

      {/* Modal Tambah User */}
      <Modal id="addUserModal">
        <div className="p-4">
          <h3 className="text-lg font-bold">Tambah User</h3>
          <form onSubmit={formikCreateUser.handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  formikCreateUser.touched.full_name &&
                  formikCreateUser.errors.full_name
                    ? "input-error"
                    : ""
                }`}
                required
                name="full_name"
                value={formikCreateUser.values.full_name}
                onChange={formikCreateUser.handleChange}
              />
              {formikCreateUser.touched.full_name &&
              formikCreateUser.errors.full_name ? (
                <div className="text-red-500 text-xs">
                  {formikCreateUser.errors.full_name}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${
                  formikCreateUser.touched.email &&
                  formikCreateUser.errors.email
                    ? "input-error"
                    : ""
                }`}
                required
                name="email"
                value={formikCreateUser.values.email}
                onChange={formikCreateUser.handleChange}
              />
              {formikCreateUser.touched.email &&
              formikCreateUser.errors.email ? (
                <div className="text-red-500 text-xs">
                  {formikCreateUser.errors.email}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered w-full ${
                  formikCreateUser.touched.password &&
                  formikCreateUser.errors.password
                    ? "input-error"
                    : ""
                }`}
                required
                name="password"
                value={formikCreateUser.values.password}
                onChange={formikCreateUser.handleChange}
              />
              {formikCreateUser.touched.password &&
              formikCreateUser.errors.password ? (
                <div className="text-red-500 text-xs">
                  {formikCreateUser.errors.password}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered w-full ${
                  formikCreateUser.touched.confirm_password &&
                  formikCreateUser.errors.confirm_password
                    ? "input-error"
                    : ""
                }`}
                required
                name="confirm_password"
                value={formikCreateUser.values.confirm_password}
                onChange={formikCreateUser.handleChange}
              />
              {formikCreateUser.touched.confirm_password &&
              formikCreateUser.errors.confirm_password ? (
                <div className="text-red-500 text-xs">
                  {formikCreateUser.errors.confirm_password}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                className={`select w-full select-bordered ${
                  formikCreateUser.touched.role_id &&
                  formikCreateUser.errors.role_id
                    ? "select-error"
                    : ""
                }`}
                name="role_id"
                value={formikCreateUser.values.role_id}
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
              >
                <option disabled selected>
                  Pilih Role
                </option>
                {role.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formikCreateUser.touched.role_id &&
              formikCreateUser.errors.role_id ? (
                <div className="text-red-500 text-xs">
                  {formikCreateUser.errors.role_id}
                </div>
              ) : null}
            </div>
            <div className="form-control mt-4">
              <button
                type="submit"
                className="w-full btn btn-ghost bg-green-500 text-white"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal Edit User */}
      <Modal id="editUserModal">
        <div className="p-4">
          <h3 className="text-lg font-bold">Edit User</h3>
          <form onSubmit={formikEditUser.handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  formikEditUser.touched.full_name &&
                  formikEditUser.errors.full_name
                    ? "input-error"
                    : ""
                }`}
                required
                name="full_name"
                value={formikEditUser.values.full_name}
                onChange={formikEditUser.handleChange}
              />
              {formikEditUser.touched.full_name &&
              formikEditUser.errors.full_name ? (
                <div className="text-red-500 text-xs">
                  {formikEditUser.errors.full_name}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${
                  formikEditUser.touched.email && formikEditUser.errors.email
                    ? "input-error"
                    : ""
                }`}
                required
                name="email"
                value={formikEditUser.values.email}
                onChange={formikEditUser.handleChange}
              />
              {formikEditUser.touched.email && formikEditUser.errors.email ? (
                <div className="text-red-500 text-xs">
                  {formikEditUser.errors.email}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Alamat</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  formikEditUser.touched.address &&
                  formikEditUser.errors.address
                    ? "input-error"
                    : ""
                }`}
                required
                name="address"
                value={formikEditUser.values.address}
                onChange={formikEditUser.handleChange}
              />
              {formikEditUser.touched.address &&
              formikEditUser.errors.address ? (
                <div className="text-red-500 text-xs">
                  {formikEditUser.errors.address}
                </div>
              ) : null}

              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                className={`select w-full select-bordered ${
                  formikEditUser.touched.role_id &&
                  formikEditUser.errors.role_id
                    ? "select-error"
                    : ""
                }`}
                name="role_id"
                value={formikEditUser.values.role_id}
                onChange={formikEditUser.handleChange}
                onBlur={formikEditUser.handleBlur}
              >
                <option disabled selected>
                  Pilih Role
                </option>
                {role.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formikEditUser.touched.role_id &&
              formikEditUser.errors.role_id ? (
                <div className="text-red-500 text-xs">
                  {formikEditUser.errors.role_id}
                </div>
              ) : null}
            </div>
            <div className="form-control mt-4">
              <button
                type="submit"
                className="w-full btn btn-ghost bg-green-500 text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DaftarUser;

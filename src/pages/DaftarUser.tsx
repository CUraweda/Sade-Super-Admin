import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
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
    confirm_password: Yup.string().oneOf(
      [Yup.ref("password")],
      "Password tidak sama"
    ),
    role_id: Yup.string().required("Role tidak boleh kosong"),
  });

  const validationSchemaEdit = Yup.object({
    full_name: Yup.string().required("Nama tidak boleh kosong"),
    email: Yup.string().required("Email tidak boleh kosong"),
    role_id: Yup.string().required("Role tidak boleh kosong"),
    status: Yup.number().oneOf([0, 1]),
    email_verified: Yup.number().oneOf([0, 1]),
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
      role_id: editingUser?.role_id || 1,
      status: editingUser?.status || 0,
      email_verified: editingUser?.email_verified || 0,
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
      const { full_name, email, role_id, status, email_verified } = values;
      const data = {
        full_name,
        email,
        role_id,
        status,
        email_verified,
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
      role_id: user.role_id,
      status: user.status,
      email_verified: user.email_verified,
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
              <th>Status</th>
              <th>Status Email</th>
              <th className="flex items-center justify-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((item, index) => (
              <tr key={index}>
                <th>{filter.page * filter.limit + index + 1}</th>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>
                  <div
                    className={`badge text-white ${
                      item.status == 1 ? "badge-success" : "badge-error"
                    }`}
                  >
                    {item.status == 1 ? (
                      <>
                        <FaCheck />
                      </>
                    ) : (
                      <>
                        <FaTimes />
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <div
                    className={`badge text-white flex whitespace-nowrap ${
                      item.email_verified == 1 ? "badge-success" : "badge-error"
                    }`}
                  >
                    {item.email_verified == 1 ? (
                      <>
                        <FaCheck className="mr-1" />
                        Sudah Verifikasi
                      </>
                    ) : (
                      <>
                        <FaTimes className="mr-1" />
                        Belum Verifikasi
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="btn btn-ghost btn-sm text-blue-500 text-xl"
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
      <Modal id="addUserModal">
        <form onSubmit={formikCreateUser.handleSubmit}>
          <div className="py-4">
            <h3 className="text-lg font-bold">Tambah User</h3>
            <div className="form-control">
              <label htmlFor="full_name" className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="input input-bordered"
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
                value={formikCreateUser.values.full_name}
              />
              {formikCreateUser.errors.full_name &&
                formikCreateUser.touched.full_name && (
                  <span className="text-red-500 text-sm">
                    {formikCreateUser.errors.full_name}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="input input-bordered"
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
                value={formikCreateUser.values.email}
              />
              {formikCreateUser.errors.email &&
                formikCreateUser.touched.email && (
                  <span className="text-red-500 text-sm">
                    {formikCreateUser.errors.email}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input input-bordered"
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
                value={formikCreateUser.values.password}
              />
              {formikCreateUser.errors.password &&
                formikCreateUser.touched.password && (
                  <span className="text-red-500 text-sm">
                    {formikCreateUser.errors.password}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="confirm_password" className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                className="input input-bordered"
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
                value={formikCreateUser.values.confirm_password}
              />
              {formikCreateUser.errors.confirm_password &&
                formikCreateUser.touched.confirm_password && (
                  <span className="text-red-500 text-sm">
                    {formikCreateUser.errors.confirm_password}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="role_id" className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                className="input input-bordered"
                onChange={formikCreateUser.handleChange}
                onBlur={formikCreateUser.handleBlur}
                value={formikCreateUser.values.role_id}
              >
                {role.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formikCreateUser.errors.role_id &&
                formikCreateUser.touched.role_id && (
                  <span className="text-red-500 text-sm">
                    {formikCreateUser.errors.role_id}
                  </span>
                )}
            </div>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => closeModal("addUserModal")}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Tambah
            </button>
          </div>
        </form>
      </Modal>
      <Modal id="editUserModal">
        <form onSubmit={formikEditUser.handleSubmit}>
          <div className="py-4">
            <h3 className="text-lg font-bold">Edit User</h3>
            <div className="form-control">
              <label htmlFor="full_name" className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="input input-bordered"
                onChange={formikEditUser.handleChange}
                onBlur={formikEditUser.handleBlur}
                value={formikEditUser.values.full_name}
              />
              {formikEditUser.errors.full_name &&
                formikEditUser.touched.full_name && (
                  <span className="text-red-500 text-sm">
                    {formikEditUser.errors.full_name}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="input input-bordered"
                onChange={formikEditUser.handleChange}
                onBlur={formikEditUser.handleBlur}
                value={formikEditUser.values.email}
              />
              {formikEditUser.errors.email && formikEditUser.touched.email && (
                <span className="text-red-500 text-sm">
                  {formikEditUser.errors.email}
                </span>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="role_id" className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                className="input input-bordered"
                onChange={formikEditUser.handleChange}
                onBlur={formikEditUser.handleBlur}
                value={formikEditUser.values.role_id}
              >
                {role.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {formikEditUser.errors.role_id &&
                formikEditUser.touched.role_id && (
                  <span className="text-red-500 text-sm">
                    {formikEditUser.errors.role_id}
                  </span>
                )}
            </div>
            <div className="form-control">
              <label htmlFor="status" className="label cursor-pointer">
                <span className="label-text">Status</span>
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  className="toggle toggle-primary"
                  onChange={(e) =>
                    formikEditUser.setFieldValue(
                      "status",
                      e.target.checked ? 1 : 0
                    )
                  }
                  onBlur={formikEditUser.handleBlur}
                  checked={formikEditUser.values.status === 1}
                />
              </label>
            </div>
            <div className="form-control">
              <label htmlFor="email_verified" className="label cursor-pointer">
                <span className="label-text">Verifikasi Email</span>
                <input
                  type="checkbox"
                  id="email_verified"
                  name="email_verified"
                  className="toggle toggle-primary"
                  onChange={(e) =>
                    formikEditUser.setFieldValue(
                      "email_verified",
                      e.target.checked ? 1 : 0
                    )
                  }
                  onBlur={formikEditUser.handleBlur}
                  checked={formikEditUser.values.email_verified === 1}
                />
              </label>
            </div>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => closeModal("editUserModal")}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DaftarUser;

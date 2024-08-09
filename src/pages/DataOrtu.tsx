import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
import { OrangTua } from "../middleware/Api";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { LoginStore } from "../store/Store";
import { openModal, closeModal } from "../component/ModalProps";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";

const filterFormData = (data: any) => {
  const {
    id,
    name,
    parent_type,
    nationality,
    religion,
    address,
    phone,
    email,
    field_of_work,
    last_education,
    latitude,
    longitude,
  } = data;
  return {
    id,
    name,
    parent_type,
    nationality,
    religion,
    address,
    phone,
    email,
    field_of_work,
    last_education,
    latitude,
    longitude,
  };
};

const DataOrtu = () => {
  const { token } = LoginStore();
  const [ortu, setOrtu] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({ page: 0, limit: 10 });
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [modalData, setModalData] = useState<any>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    DataOrtu();
  }, [filter, search]);

  const DataOrtu = async () => {
    try {
      const response = await OrangTua.GetAllDataOrtu(
        token,
        filter.page,
        filter.limit,
        search
      );
      const { result, ...meta } = response.data.data;
      setOrtu(result);
      setPageMeta(meta);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (key: string, value: any) => {
    const obj = { ...filter, [key]: value };
    if (key !== "page") obj["page"] = 0;
    setFilter(obj);
  };

  const handleDelete = async (id: number) => {
    try {
      await OrangTua.DeleteOrtu(token, id);
      Swal.fire("Berhasil!", "Data dihapus!", "success");
      DataOrtu();
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan", "error");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Nama Lengkap wajib diisi"),
    parent_type: Yup.string().required("Status wajib diisi"),
    nationality: Yup.string().required("Kewarnegaraan wajib diisi"),
    religion: Yup.string().required("Agama wajib diisi"),
    address: Yup.string().required("Alamat wajib diisi"),
    phone: Yup.string().required("Nomor Hp wajib diisi"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    field_of_work: Yup.string().required("Bidang pekerjaan wajib diisi"),
    last_education: Yup.string().required("Pendidikan terakhir wajib diisi"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      parent_type: "",
      nationality: "",
      religion: "",
      address: "",
      phone: "",
      email: "",
      field_of_work: "",
      last_education: "",
      latitude: 0,
      longitude: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const filteredData = filterFormData(values);
        if (modalMode === "create") {
          await OrangTua.CreateOrtu(token, filteredData);
        } else if (modalMode === "update") {
          await OrangTua.UpdateOrtu(token, filteredData, filteredData.id);
        }
        Swal.fire(
          "Berhasil!",
          `Data ${modalMode === "create" ? "ditambahkan" : "diupdate"}!`,
          "success"
        );
        closeModal("modalForm");
        DataOrtu();
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan", "error");
      }
    },
  });

  useEffect(() => {
    if (modalMode === "update" && modalData.id) {
      formik.setValues(modalData);
    } else if (modalMode === "create") {
      formik.resetForm();
    }
  }, [modalData, modalMode]);

  const handleAddClick = () => {
    setModalMode("create");
    formik.resetForm();
    openModal("modalForm");
  };

  const handleEditClick = (item: any) => {
    setModalMode("update");
    setModalData(filterFormData(item));
    openModal("modalForm");
  };

  return (
    <div className="w-full flex flex-col items-center p-5">
      <span className="text-xl font-bold">Daftar Orang Tua</span>
      <div className="overflow-hidden w-full mt-5 bg-white p-4 rounded-md shadow-md">
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
            onClick={handleAddClick}
            className="btn btn-ghost bg-blue-500 btn-sm text-white"
          >
            <FaPlus /> Tambah
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Kewarnegaraan</th>
                <th>Agama</th>
                <th>Nomor Hp</th>
                <th className="flex items-center justify-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {ortu.map((item, index) => (
                <tr key={item.id}>
                  <th>{filter.page * filter.limit + index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.nationality}</td>
                  <td>{item.religion}</td>
                  <td>{item.phone}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn btn-ghost btn-sm text-blue-500 text-xl"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-ghost btn-sm text-red-500 text-xl"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControl
          meta={pageMeta}
          onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
          onNextClick={() => handleFilter("page", pageMeta.page + 1)}
          onJumpPageClick={(val) => handleFilter("page", val)}
          onLimitChange={(val) => handleFilter("limit", val)}
        />
      </div>

      {/* Modal Form */}
      <dialog id="modalForm" className="modal modal-middle">
        <div className="modal-box w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={() => closeModal("modalForm")}
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold mb-4">
            {modalMode === "create"
              ? "Tambah Data Orang Tua"
              : "Update Data Orang Tua"}
          </h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Berperan Sebagai
                </label>
                <select
                  name="parent_type"
                  className="select select-bordered w-full"
                  value={formik.values.parent_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Pilih salah satu
                  </option>
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali</option>
                </select>
                {formik.errors.parent_type && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.parent_type}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kewarnegaraan
                </label>
                <select
                  name="nationality"
                  className="select select-bordered w-full"
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>
                    Pilih salah satu
                  </option>
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
                {formik.errors.nationality && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.nationality}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Agama</label>
                <input
                  type="text"
                  name="religion"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.religion}
                />
                {formik.errors.religion && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.religion}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <input
                  type="text"
                  name="address"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
                {formik.errors.address && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.address}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Hp
                </label>
                <input
                  type="text"
                  name="phone"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
                {formik.errors.phone && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bidang Pekerjaan
                </label>
                <input
                  type="text"
                  name="field_of_work"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.field_of_work}
                />
                {formik.errors.field_of_work && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.field_of_work}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  name="last_education"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.last_education}
                />
                {formik.errors.last_education && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.last_education}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.latitude}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  className="input input-bordered w-full"
                  onChange={formik.handleChange}
                  value={formik.values.longitude}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="btn btn-primary">
                {modalMode === "create" ? "Tambah" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DataOrtu;

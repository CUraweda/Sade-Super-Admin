import { useEffect, useState } from "react";
import {
  FaDownload,
  FaPlus,
  FaRegTrashAlt,
  FaSync,
  FaUpload,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Siswa } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { SiswaList } from "../middleware/utils";
import Modal, { openModal, closeModal } from "../component/ModalProps";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const DataSiswa = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const [siswa, setSiswa] = useState<SiswaList[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaList | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key !== "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataSiswa = async () => {
    try {
      const response = await Siswa.GetAllDataSiswa(
        token,
        filter.page,
        filter.limit,
        search
      );
      const { result, ...meta } = response.data.data;
      setSiswa(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    DataSiswa();
  }, [filter, search]);

  const formatDate = (date: string) => {
    let Newdate = new Date(date);
    let formattedDate = Newdate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSiswa(null);
    openModal("siswaModal");
  };

  const handleEditClick = (siswa: SiswaList) => {
    setModalMode("edit");
    setSelectedSiswa(siswa);
    openModal("siswaModal");
  };

  const validationSchema = Yup.object().shape({
    nis: Yup.string().required("NIS wajib diisi"),
    nisn: Yup.string().required("NISN wajib diisi"),
    full_name: Yup.string().required("Nama lengkap wajib diisi"),
    nickname: Yup.string().required("Nama panggilan wajib diisi"),
    gender: Yup.string().required("Jenis kelamin wajib dipilih"),
    pob: Yup.string().required("Tempat lahir wajib diisi"),
    dob: Yup.date().required("Tanggal lahir wajib diisi"),
    nationality: Yup.string().required("Kewarganegaraan wajib diisi"),
    religion: Yup.string().required("Agama wajib diisi"),
    address: Yup.string().required("Alamat wajib diisi"),
  });

  const formik = useFormik({
    initialValues: {
      nis: selectedSiswa?.nis || "",
      nisn: selectedSiswa?.nisn || "",
      full_name: selectedSiswa?.full_name || "",
      nickname: selectedSiswa?.nickname || "",
      gender: selectedSiswa?.gender || "",
      pob: selectedSiswa?.pob || "",
      dob: selectedSiswa?.dob || "",
      nationality: selectedSiswa?.nationality || "",
      religion: selectedSiswa?.religion || "",
      address: selectedSiswa?.address || "",
      is_active: selectedSiswa?.is_active || "ya",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (modalMode === "add") {
          await Siswa.CreateSiswa(token, values);
          Swal.fire("Berhasil!", "Siswa berhasil ditambahkan", "success");
        } else if (selectedSiswa?.id) {
          const id = parseInt(selectedSiswa.id);
          await Siswa.UpdateSiswa(token, values, id);
          Swal.fire("Berhasil!", "Data siswa berhasil diperbarui", "success");
        }
        closeModal("siswaModal");
        DataSiswa();
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
      }
    },
    enableReinitialize: true,
  });

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
        HandleDeleteSiswa(id);
      }
    });
  };

  const HandleDeleteSiswa = async (id: number) => {
    try {
      await Siswa.DeleteSiswa(token, id);
      DataSiswa();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Daftar Siswa</span>
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

            {/* <select className="select select-bordered w-md select-sm">
              <option>Kelas</option>
              {kelas.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.class_name}
                </option>
              ))}
            </select> */}
            <div className="join">
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                data-tip={"tarik data PMB"}
              >
                <FaSync />
              </button>
              <button
                className="btn btn-ghost bg-blue-500 btn-sm text-white join-item tooltip"
                data-tip={"tambah siswa"}
                onClick={handleAddClick}
              >
                <FaPlus />
              </button>
              <button
                className="btn btn-ghost bg-cyan-500 btn-sm text-white join-item tooltip"
                data-tip={"upload siswa"}
              >
                <FaUpload />
              </button>
              <button
                className="btn btn-ghost bg-orange-500 btn-sm text-white join-item tooltip tooltip-left"
                data-tip={"download data"}
              >
                <FaDownload />
              </button>
            </div>
          </div>
          <table className="table table-zebra table-sm">
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NIS</th>
                <th>NISN</th>
                <th>TTL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {siswa.map((item: SiswaList, index: number) => (
                <tr key={item.id}>
                  <th>{filter.page * filter.limit + index + 1}</th>
                  <td>{item.full_name}</td>
                  <td>{item.nis}</td>
                  <td>{item.nisn}</td>
                  <td>
                    {item.pob}, {formatDate(item.dob)}
                  </td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm text-orange-500 text-xl"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-red-500 text-xl"
                        onClick={() => trigerDelete(parseInt(item.id))}
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
            onLimitChange={(value) => handleFilter("limit", value)}
          />
        </div>
      </div>

      <Modal id="siswaModal" onClose={() => setSelectedSiswa(null)}>
        <div className="p-4">
          <h3 className="text-lg font-bold">
            {modalMode === "add" ? "Tambah Siswa" : "Edit Siswa"}
          </h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="full_name"
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.full_name && formik.errors.full_name ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.full_name}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Panggilan</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="nickname"
                value={formik.values.nickname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nickname && formik.errors.nickname ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.nickname}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">NIS</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="nis"
                value={formik.values.nis}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nis && formik.errors.nis ? (
                <div className="text-red-500 text-sm">{formik.errors.nis}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">NISN</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="nisn"
                value={formik.values.nisn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nisn && formik.errors.nisn ? (
                <div className="text-red-500 text-sm">{formik.errors.nisn}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Jenis Kelamin</span>
              </label>
              <select
                className="input input-bordered"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Pilih jenis kelamin" />
                <option value="male" label="Laki-laki" />
                <option value="female" label="Perempuan" />
              </select>
              {formik.touched.gender && formik.errors.gender ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.gender}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tempat Lahir</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="pob"
                value={formik.values.pob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.pob && formik.errors.pob ? (
                <div className="text-red-500 text-sm">{formik.errors.pob}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Lahir</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dob && formik.errors.dob ? (
                <div className="text-red-500 text-sm">{formik.errors.dob}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Kewarganegaraan</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nationality && formik.errors.nationality ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.nationality}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Agama</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="religion"
                value={formik.values.religion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.religion && formik.errors.religion ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.religion}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Alamat</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.address && formik.errors.address ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.address}
                </div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status Aktif</span>
              </label>
              <select
                name="is_active"
                className="select select-bordered"
                value={formik.values.is_active}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
              {formik.touched.is_active && formik.errors.is_active && (
                <span className="text-red-500 text-xs">
                  {formik.errors.is_active}
                </span>
              )}
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">
                {modalMode === "add" ? "Tambah" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default DataSiswa;

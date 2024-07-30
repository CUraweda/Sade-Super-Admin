import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { KepalaSekolah } from "../middleware/Api";
import { KepsekList } from "../middleware/utils";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginStore } from "../store/Store";
import Modal, { openModal, closeModal } from "../component/ModalProps";
import Swal from "sweetalert2";

const DaftarKepsek = () => {
  const { token } = LoginStore();
  const [kepsek, setKepsek] = useState<KepsekList[]>([]);
  const [employee, setEmployee] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
  });
  const [editingKepsek, setEditingKepsek] = useState<KepsekList | null>(null);

  const validationSchemaAdd = Yup.object({
    employee_id: Yup.string().required("Guru tidak boleh kosong"),
    start_academic_year: Yup.string().required("Tahun tidak boleh kosong"),
    end_academic_year: Yup.string().required("Tahun tidak boleh kosong"),
  });

  const validationSchemaEdit = Yup.object({
    employee_id: Yup.string().required("Guru tidak boleh kosong"),
    start_academic_year: Yup.string().required("Tahun tidak boleh kosong"),
    end_academic_year: Yup.string().required("Tahun tidak boleh kosong"),
  });

  const formikCreateKepsek = useFormik({
    initialValues: {
      employee_id: 0,
      start_academic_year: "",
      end_academic_year: "",
      is_active: true,
      category: "",
    },
    validationSchema: validationSchemaAdd,
    onSubmit: (values) => {
      handleCreateKepsek(values);
    },
  });

  const formikEditKepsek = useFormik({
    initialValues: {
      employee_id: editingKepsek?.employee_id || 1,
      start_academic_year: editingKepsek?.start_academic_year || "",
      end_academic_year: editingKepsek?.end_academic_year || "",
      is_active: editingKepsek?.is_active,
      category: editingKepsek?.category || ""
    },
    enableReinitialize: true,
    validationSchema: validationSchemaEdit,
    onSubmit: (values) => {
      if (editingKepsek) {
        handleEditKepsek(values, editingKepsek.id);
      }
    },
  });

  useEffect(() => {
    DataKepsek();
    DataDropdownEmployee();
  }, [filter]);

  const DataKepsek = async () => {
    try {
      const response = await KepalaSekolah.GetDataKepsek(
        token,
        filter.page,
        filter.limit
      );
      const { result, ...meta } = response.data.data;
      setKepsek(result);
      setPageMeta(meta);
    } catch (error) {
      console.error(error);
    }
  };

  const DataDropdownEmployee = async () => {
    try {
      const response = await KepalaSekolah.GetDataDropdownEmployee(token);
      setEmployee(response.data.data.result);
    } catch (error) {
      console.error(error);
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

  const handleCreateKepsek = async (values: any) => {
    try {
      const { employee_id, start_academic_year, end_academic_year, is_active, category } =
        values;
      const data = {
        employee_id,
        start_academic_year,
        end_academic_year,
        is_active,
        category
      };
      await KepalaSekolah.CreateKepsek(token, data);
      closeModal("addKepsekModal");
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menambahkan data User",
      });
      DataKepsek();
    } catch {
      closeModal("addUserModal");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menambahkan data User, silakan refresh halaman!",
      });
    }
  };

  const handleEditKepsek = async (values: any, id: number) => {
    try {
      const { employee_id, start_academic_year, end_academic_year, is_active, category } =
        values;
      const data = {
        employee_id,
        start_academic_year,
        end_academic_year,
        is_active,
        category
      };
      await KepalaSekolah.EditKepsek(token, data, id);
      DataKepsek();
      closeModal("editKepsekModal");
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Mengupdate data User",
      });
    } catch {
      closeModal("editKepsekModal");
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
        HandleDeleteKepsek(id);
      }
    });
  };

  const HandleDeleteKepsek = async (id: number) => {
    try {
      await KepalaSekolah.DeleteKepsek(token, id);
      DataKepsek();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddKepsek = () => {
    formikCreateKepsek.resetForm();
    openModal("addKepsekModal");
  };

  const handleEditKepsekModal = (kepsek: KepsekList) => {
    setEditingKepsek(kepsek);
    formikEditKepsek.setValues({
      employee_id: kepsek.employee_id,
      start_academic_year: kepsek.start_academic_year,
      end_academic_year: kepsek.end_academic_year,
      is_active: kepsek.is_active,
      category: kepsek.category
    });
    openModal("editKepsekModal");
  };

  const getYears = (startYear: number, endYear: number): string[] => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
    }
    return years;
  };

  const getCategorys = () => {
    return ["Cluster Bawah", "Cluster Atas", "Cluster Tinggal"]
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear;
  const endYear = currentYear + 50;
  const years = getYears(startYear, endYear);
  const categorys = getCategorys()

  return (
    <div className="w-full flex flex-col items-center p-5 ">
      <span className="text-xl font-bold">Daftar Kepala Sekolah</span>
      <div className="overflow-hidden w-full mt-5 bg-white p-4 rounded-md shadow-md">
        <div className="w-full flex justify-end my-4 gap-2 items-center">
          <div></div>
          <button
            className="btn btn-ghost bg-blue-500 btn-sm text-white "
            onClick={handleAddKepsek}
          >
            <FaPlus />
            Tambah
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Kategori</th>
                <th>L/P</th>
                <th>Tanggal Lahir</th>
                <th>Tempat Lahir</th>
                <th>Agama</th>
                <th>Kawin/Belum Kawin</th>
                <th>Pendidikan Terakhir</th>
                <th>Waktu Mulai Bekerja</th>
                <th>Status</th>
                <th>Jabatan/Tugas</th>
                <th className="flex items-center justify-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {kepsek.map((item, index) => (
                <tr key={index}>
                  <th>{filter.page * filter.limit + index + 1}</th>
                  <td>{item.employee?.full_name}</td>
                  <td>{item.category}</td>
                  <td>{item.employee.gender}</td>
                  <td>{item.employee.dob.split("T")[0]}</td>
                  <td>{item.employee.pob}</td>
                  <td>{item.employee.religion}</td>
                  <td>{item.employee.marital_status}</td>
                  <td>{item.employee.last_education}</td>
                  <td>{item.employee.work_start_date}</td>
                  <td>
                    <div
                      className={`badge text-white ${item.is_active == true ? "badge-success" : "badge-error"
                        }`}
                    >
                      {item.is_active == true ? <FaCheck /> : <FaTimes />}
                    </div>
                  </td>
                  <td>{item.employee.duty}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="btn btn-ghost btn-sm text-blue-500 text-xl"
                        onClick={() => handleEditKepsekModal(item)}
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
        </div>

        <PaginationControl
          meta={pageMeta}
          onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
          onNextClick={() => handleFilter("page", pageMeta.page + 1)}
          onJumpPageClick={(val) => handleFilter("page", val)}
          onLimitChange={(val) => handleFilter("limit", val)}
        />
      </div>

      <Modal id="addKepsekModal">
        <form onSubmit={formikCreateKepsek.handleSubmit}>
          <div className="py-4">
            <h3 className="text-lg font-bold">Tambah Kepala Sekolah</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pilih Guru</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="employee_id"
                name="employee_id"
                onChange={formikCreateKepsek.handleChange}
                onBlur={formikCreateKepsek.handleBlur}
                value={formikCreateKepsek.values.employee_id}
              >
                <option disabled selected value={0}>
                  Pilih Salah satu
                </option>
                {employee.map((item, index) => (
                  <option value={item.id} key={index}>
                    {item.full_name}
                  </option>
                ))}
              </select>
              {formikCreateKepsek.errors.employee_id &&
                formikCreateKepsek.touched.employee_id && (
                  <span className="text-red-500 text-sm">
                    {formikCreateKepsek.errors.employee_id}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Mulai Tahun Ajaran</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="start_academic_year"
                name="start_academic_year"
                onChange={formikCreateKepsek.handleChange}
                onBlur={formikCreateKepsek.handleBlur}
                value={formikCreateKepsek.values.start_academic_year}
              >
                <option disabled selected value="">
                  Pilih Tahun
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formikCreateKepsek.errors.start_academic_year &&
                formikCreateKepsek.touched.start_academic_year && (
                  <span className="text-red-500 text-sm">
                    {formikCreateKepsek.errors.start_academic_year}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Akhir Tahun Ajaran</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="end_academic_year"
                name="end_academic_year"
                onChange={formikCreateKepsek.handleChange}
                onBlur={formikCreateKepsek.handleBlur}
                value={formikCreateKepsek.values.end_academic_year}
              >
                <option disabled selected value="">
                  Pilih Tahun
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formikCreateKepsek.errors.end_academic_year &&
                formikCreateKepsek.touched.end_academic_year && (
                  <span className="text-red-500 text-sm">
                    {formikCreateKepsek.errors.end_academic_year}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Kategori</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="category"
                name="category"
                onChange={formikCreateKepsek.handleChange}
                onBlur={formikCreateKepsek.handleBlur}
                value={formikCreateKepsek.values.category}
              >
                <option disabled selected value="">
                  Pilih Kategori
                </option>
                {categorys.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formikCreateKepsek.errors.category &&
                formikCreateKepsek.touched.category && (
                  <span className="text-red-500 text-sm">
                    {formikCreateKepsek.errors.category}
                  </span>
                )}

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-bold mt-3">
                    Aktif/Tidak Aktif
                  </span>
                  <input
                    type="checkbox"
                    name="is_active"
                    className="checkbox"
                    onChange={formikCreateKepsek.handleChange}
                    onBlur={formikCreateKepsek.handleBlur}
                    checked={formikCreateKepsek.values.is_active}
                  />
                </label>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => closeModal("addKepsekModal")}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Tambah
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal id="editKepsekModal">
        <form onSubmit={formikEditKepsek.handleSubmit}>
          <div className="py-4">
            <h3 className="text-lg font-bold">Edit Kepala Sekolah</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pilih Guru</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="employee_id"
                name="employee_id"
                onChange={formikEditKepsek.handleChange}
                onBlur={formikEditKepsek.handleBlur}
                value={formikEditKepsek.values.employee_id}
              >
                <option disabled selected value={0}>
                  Pilih Salah satu
                </option>
                {employee.map((item, index) => (
                  <option value={item.id} key={index}>
                    {item.full_name}
                  </option>
                ))}
              </select>
              {formikEditKepsek.errors.employee_id &&
                formikEditKepsek.touched.employee_id && (
                  <span className="text-red-500 text-sm">
                    {formikEditKepsek.errors.employee_id}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Mulai Tahun Ajaran</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="start_academic_year"
                name="start_academic_year"
                onChange={formikEditKepsek.handleChange}
                onBlur={formikEditKepsek.handleBlur}
                value={formikEditKepsek.values.start_academic_year}
              >
                <option disabled selected value="">
                  Pilih Tahun
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formikEditKepsek.errors.start_academic_year &&
                formikEditKepsek.touched.start_academic_year && (
                  <span className="text-red-500 text-sm">
                    {formikEditKepsek.errors.start_academic_year}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Akhir Tahun Ajaran</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="end_academic_year"
                name="end_academic_year"
                onChange={formikEditKepsek.handleChange}
                onBlur={formikEditKepsek.handleBlur}
                value={formikEditKepsek.values.end_academic_year}
              >
                <option disabled selected value="">
                  Pilih Tahun
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {formikEditKepsek.errors.end_academic_year &&
                formikEditKepsek.touched.end_academic_year && (
                  <span className="text-red-500 text-sm">
                    {formikEditKepsek.errors.end_academic_year}
                  </span>
                )}

              <label className="label">
                <span className="label-text">Kategori</span>
              </label>
              <select
                className="select select-bordered w-full"
                id="category"
                name="category"
                onChange={formikEditKepsek.handleChange}
                onBlur={formikEditKepsek.handleBlur}
                value={formikEditKepsek.values.category}
              >
                <option disabled selected value="">
                  Pilih Kategori
                </option>
                {categorys.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formikEditKepsek.errors.category &&
                formikEditKepsek.touched.category && (
                  <span className="text-red-500 text-sm">
                    {formikEditKepsek.errors.category}
                  </span>
                )}

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-bold mt-3">
                    Aktif/Tidak Aktif
                  </span>
                  <input
                    type="checkbox"
                    name="is_active"
                    className="checkbox"
                    onChange={formikEditKepsek.handleChange}
                    onBlur={formikEditKepsek.handleBlur}
                    checked={formikEditKepsek.values.is_active}
                  />
                </label>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => closeModal("addKepsekModal")}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DaftarKepsek;

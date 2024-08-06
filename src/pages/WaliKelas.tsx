import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { GuruKaryawan, Wali } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  WaKelDetail,
  WaKel,
  Employee,
  EditFormValuesWalikelas,
  ClassData,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
const WaliKelas = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  const [selectedOption, setStatus] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTodo, setAlertTodo] = useState("");
  const [EditData, setEditData] = useState<EditFormValuesWalikelas | null>(
    null
  );
  const [academic_year, setAcademicYear] = useState<any>("");
  const [idWaKel, setIdWaKel] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [Kelas, setKelas] = useState<ClassData[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataWaKel, setDataWaKel] = useState<WaKel[]>([]);

  useEffect(() => {
    DataWaliKelas();
    setAcademicYear("");
  }, []);

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataWaliKelas = async () => {
    try {
      const response = await Wali.GetAllWaliKelas(
        token,
        querysearch,
        selectedOption,
        academic_year,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setDataWaKel(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const DeleteWaKel = async (id: number) => {
    try {
      await Wali.DeleteWaliKelas(token, id);
      DataWaliKelas();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data Guru Wali Kelas",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal menghapus silahkan coba kembali!`,
      });
    }
  };

  const handleInputChange = (event: any) => {
    setQuerySearch(event.target.value);
  };
  const handleStatus = (event: any) => {
    setStatus(event.target.value);
  };

  const handleDelete = async (value: WaKelDetail) => {
    const {
      employee: { full_name },
      id,
    } = value;
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: `Do you want to continue deleting ${full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      DeleteWaKel(id);
    } else {
      console.log("Edit canceled");
    }
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    return Array.from(
      { length: 5 },
      (_, index) => `${startYear + index}/${startYear + index + 1}`
    );
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await GuruKaryawan.GetAllGuruKaryawan(
        token,
        "",
        1000,
        "",
        ""
      );
      const { result } = response.data.data;
      setEmployees(result);
    };
    const fetchAllKelas = async () => {
      const response = await Wali.GetAllKelas(token, 100000);
      const { result } = response.data.data;
      setKelas(result);
    };
    fetchEmployees();
    fetchAllKelas();
  }, []);

  // Schema validasi dengan Yup
  const formTeacherSchema = Yup.object().shape({
    employee_id: Yup.number().required("Employee ID is required"),
    class_id: Yup.number().required("Class ID is required"),
    academic_year: Yup.string().required("Academic Year is required"),
    is_active: Yup.string()
      .oneOf(["true", "false"], "Invalid selection")
      .required("Active status is required"),
  });
  const FormTeacher = useFormik<EditFormValuesWalikelas>({
    initialValues: {
      employee_id: EditData?.employee_id || "",
      class_id: EditData?.class_id || "",
      academic_year: EditData?.academic_year || "",
      is_active: EditData?.is_active || "true",
    },
    validationSchema: formTeacherSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        is_active: values.is_active === "true",
      };
      try {
        if (alertTodo === "edit") {
          await Wali.UpdateWaliKelas(token, idWaKel, payload);
          DataWaliKelas();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data Guru Wali Kelas",
          });

          setShowAlert(false);
        } else {
          await Wali.CreateWaliKelas(token, payload);
          DataWaliKelas();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data Guru Wali Kelas",
          });

          setShowAlert(false);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal membuat data baru, silahkan coba kembali!",
        });
      }
    },
  });

  const handleEdit = (value: any) => {
    setShowAlert(true);
    setIdWaKel(value.id);
    const itemToEdit = DataWaKel.find((item) => item.id === value.id);
    if (itemToEdit) {
      setEditData({
        employee_id: itemToEdit.employee_id.toString(),
        class_id: itemToEdit.class_id.toString(),
        academic_year: itemToEdit.academic_year,
        is_active: itemToEdit.is_active ? "true" : "false",
      });
    }
    setAlertTodo("edit");
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormTeacher.setValues(EditData);
    }
  }, [EditData, alertTodo]);
  useEffect(() => {
    DataWaliKelas();
  }, [filter, querysearch, selectedOption]);

  const handleShowAlert = (type: string) => {
    setAlertTodo(type);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    FormTeacher.resetForm();
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Wali Kelas</span>
        {showAlert === true ? (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleCloseAlert}
          >
            <div className="bg-gray-900 bg-opacity-50 absolute inset-0"></div>
            <div
              className="bg-white p-6 rounded shadow-lg z-10 lg:min-w-[600px] max-w-screen overflow-y-auto max-h-[90vh] relative"
              onClick={handleDialogClick}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleCloseAlert}
              >
                ✕
              </button>
              <div>
                <form onSubmit={FormTeacher.handleSubmit}>
                  <div className="my-2">
                    <label htmlFor="employee_id">Karyawan</label>
                    <select
                      id="employee_id"
                      name="employee_id"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      value={FormTeacher.values.employee_id}
                      onChange={FormTeacher.handleChange}
                    >
                      <option value="" disabled>
                        Pilih Karyawan
                      </option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.full_name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormTeacher.errors.employee_id ? (
                        <div>{FormTeacher.errors.employee_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="class_id">Kelas</label>
                    <select
                      id="class_id"
                      name="class_id"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      value={FormTeacher.values.class_id}
                      onChange={FormTeacher.handleChange}
                    >
                      <option value="" disabled>
                        Pilih Kelas
                      </option>
                      {Kelas.map((Kelas) => (
                        <option key={Kelas.id} value={Kelas.id}>
                          {Kelas.class_name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormTeacher.errors.class_id ? (
                        <div>{FormTeacher.errors.class_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="academic_year">Tahun Ajaran</label>
                    <select
                      id="academic_year"
                      name="academic_year"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      onChange={FormTeacher.handleChange}
                      onBlur={FormTeacher.handleBlur}
                      value={FormTeacher.values.academic_year}
                    >
                      <option disabled value="">
                        Pilih tahun ajaran
                      </option>
                      {generateAcademicYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormTeacher.touched.academic_year &&
                      FormTeacher.errors.academic_year ? (
                        <div>{FormTeacher.errors.academic_year}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="is_active">Status Aktif</label>
                    <select
                      id="is_active"
                      name="is_active"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      onChange={FormTeacher.handleChange}
                      onBlur={FormTeacher.handleBlur}
                      value={FormTeacher.values.is_active}
                    >
                      <option value={"true"}>Aktif</option>
                      <option value={"false"}>Tidak Aktif</option>
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormTeacher.touched.is_active &&
                      FormTeacher.errors.is_active ? (
                        <div>{FormTeacher.errors.is_active}</div>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded my-3"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-full mt-5 bg-white p-4 rounded-md shadow-md ">
          <div className="w-full flex justify-end my-4 gap-2 items-center">
            <label className="input input-sm input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={querysearch}
                onChange={handleInputChange}
              />
              <IoSearch />{" "}
            </label>

            <select
              className="select select-bordered w-md select-sm"
              value={selectedOption}
              onChange={handleStatus}
            >
              <option value="" disabled selected>
                Pilih Opsi
              </option>
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
            <div className="join">
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                // data-tip={"tambah Guru/ Karyawan"}
                onClick={() => handleShowAlert("create")}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-[100%] ">
              {/* head */}
              <thead className="bg-blue-300">
                <tr className="text-center">
                  <th>No</th>
                  <th>Nama Lengkap</th>
                  <th>Tahun Ajaran</th>
                  <th>Jenis Kelamin</th>
                  <th>Tempat Lahir</th>
                  <th>Agama</th>
                  <th>Pendidikan Terakhir</th>
                  <th>Status Pekerjaan</th>
                  <th>Jabatan</th>
                  <th>Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DataWaKel?.map((item: WaKel, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.employee.full_name}</td>
                    <td>{item.academic_year}</td>
                    <td>{item.employee.gender}</td>
                    <td>{item.employee.pob}</td>
                    <td>{item.employee.religion}</td>
                    <td>{item.employee.last_education}</td>
                    <td>{item.employee.employee_status}</td>
                    <td>{item.employee.occupation}</td>
                    <td>{item.class.class_name}</td>
                    <td>
                      <div className="join">
                        <button
                          className="btn btn-ghost btn-sm text-orange-500 text-xl"
                          onClick={() => handleEdit(item)}
                        >
                          <FaPencil />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-red-500 text-xl"
                          onClick={() => handleDelete(item)}
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
      </div>
    </>
  );
};
export default WaliKelas;

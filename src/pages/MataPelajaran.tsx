import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { GuruKaryawan, Pelajaran } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  WaKelDetail,
  Employee,
  EditFormValuesPelajaran,
  Subject,
  FormSubjectResult,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";

const MataPelajaran = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  const [selectedOption, setStatus] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTodo, setAlertTodo] = useState("");
  const [EditData, setEditData] = useState<EditFormValuesPelajaran | null>(
    null
  );
  const [academic_year, setAcademicYear] = useState<any>("");
  const [idMapel, setidMapel] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [Subject, setSubject] = useState<Subject[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataMapel, setDataMapel] = useState<FormSubjectResult[]>([]);

  useEffect(() => {
    DataGuruMapel();
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

  const DataGuruMapel = async () => {
    try {
      const response = await Pelajaran.GetAllGuruMataPelajaran(
        token,
        selectedOption,
        querysearch,
        academic_year,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setDataMapel(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const DeleteGuruMataPelajaran = async (id: number) => {
    try {
      await Pelajaran.DeleteGuruMataPelajaran(token, id);
      DataGuruMapel();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data Guru Mata Pelajaran",
      });

      FormPelajaran.resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus silahkan coba kembali!",
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
      title: "Are you sure?",
      text: `Do you want to continue deleting ${full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      DeleteGuruMataPelajaran(id);
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
    const fetchAllSubject = async () => {
      const response = await Pelajaran.GetAllSubject(token);
      const { result } = response.data.data;
      setSubject(result);
    };
    fetchEmployees();
    fetchAllSubject();
  }, []);

  // Schema validasi dengan Yup
  const FormPelajaranSchema = Yup.object().shape({
    employee_id: Yup.number().required("Employee is required"),
    subject_id: Yup.number().required("Subject is required"),
    academic_year: Yup.string().required("Academic Year is required"),
    is_active: Yup.string()
      .oneOf(["true", "false"], "Invalid selection")
      .required("Active status is required"),
  });
  const FormPelajaran = useFormik<EditFormValuesPelajaran>({
    initialValues: {
      employee_id: EditData?.employee_id || "",
      subject_id: EditData?.subject_id || "",
      academic_year: EditData?.academic_year || "",
      is_active: EditData?.is_active || "true",
    },
    validationSchema: FormPelajaranSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        is_active: values.is_active === "true",
      };
      try {
        if (alertTodo === "edit") {
          await Pelajaran.UpdateGuruMataPelajaran(token, idMapel, payload);
          DataGuruMapel();
          setShowAlert(false);
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data Guru Mata Pelajaran",
          });

          FormPelajaran.resetForm();
        } else {
          await Pelajaran.CreateGuruMataPelajaran(token, payload);
          DataGuruMapel();
          setShowAlert(false);
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data Guru Mata Pelajaran",
          });

          FormPelajaran.resetForm();
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
    setidMapel(value.id);
    const itemToEdit = DataMapel.find((item) => item.id === value.id);
    if (itemToEdit) {
      setEditData({
        employee_id: itemToEdit.employee_id.toString(),
        subject_id: itemToEdit.subject_id.toString(),
        academic_year: itemToEdit.academic_year,
        is_active: itemToEdit.is_active ? "true" : "false",
      });
    }
    setAlertTodo("edit");
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormPelajaran.setValues(EditData);
    }
  }, [EditData, alertTodo]);
  useEffect(() => {
    DataGuruMapel();
  }, [filter, querysearch, selectedOption]);

  const handleShowAlert = (type: string) => {
    setAlertTodo(type);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    FormPelajaran.resetForm();
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Guru Mata Pelajaran</span>
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
                <form onSubmit={FormPelajaran.handleSubmit}>
                  <div className="my-2">
                    <label htmlFor="employee_id">Karyawan</label>
                    <select
                      id="employee_id"
                      name="employee_id"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      value={FormPelajaran.values.employee_id}
                      onChange={FormPelajaran.handleChange}
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
                      {FormPelajaran.errors.employee_id ? (
                        <div>{FormPelajaran.errors.employee_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="subject_id">Subject</label>
                    <select
                      id="subject_id"
                      name="subject_id"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      value={FormPelajaran.values.subject_id}
                      onChange={FormPelajaran.handleChange}
                    >
                      <option value="" disabled>
                        Pilih Subject
                      </option>
                      {Subject.map((Subject) => (
                        <option key={Subject.id} value={Subject.id}>
                          {Subject.level} - {Subject.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormPelajaran.errors.subject_id ? (
                        <div>{FormPelajaran.errors.subject_id}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="academic_year">Tahun Ajaran</label>
                    <select
                      id="academic_year"
                      name="academic_year"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      onChange={FormPelajaran.handleChange}
                      onBlur={FormPelajaran.handleBlur}
                      value={FormPelajaran.values.academic_year}
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
                      {FormPelajaran.touched.academic_year &&
                      FormPelajaran.errors.academic_year ? (
                        <div>{FormPelajaran.errors.academic_year}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="is_active">Status Aktif</label>
                    <select
                      id="is_active"
                      name="is_active"
                      className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                      onChange={FormPelajaran.handleChange}
                      onBlur={FormPelajaran.handleBlur}
                      value={FormPelajaran.values.is_active}
                    >
                      <option value={"true"}>Aktif</option>
                      <option value={"false"}>Tidak Aktif</option>
                    </select>
                    <div className="text-red-500 text-sm">
                      {FormPelajaran.touched.is_active &&
                      FormPelajaran.errors.is_active ? (
                        <div>{FormPelajaran.errors.is_active}</div>
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
                  <th>NO</th>
                  <th>Kode Mata Pelajaran</th>
                  <th>Nama Mata Pelajaran</th>
                  <th>Nama Pengajar</th>
                  <th>Posisi</th>
                  <th>Tahun Ajaran</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DataMapel?.map((item: FormSubjectResult, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.subject.code}</td>
                    <td>{item.subject.name}</td>
                    <td>{item.employee.full_name}</td>
                    <td>{item.employee.occupation}</td>
                    <td>{item.academic_year}</td>
                    <td>{item.is_active ? "Aktif" : "Tidak Aktif"}</td>
                    <td className="text-center">
                      <div className="join ">
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

export default MataPelajaran;

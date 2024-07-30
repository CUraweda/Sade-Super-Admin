import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { HistoryStudent, Wali, Student } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  ResultItemStudent,
  EditFormValuesStudent,
  ClassData,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Modal, { openModal, closeModal } from "../component/ModalProps";

const HistorySiswa = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  // const [selectedOption, setStatus] = useState<any>(null);
  const [alertTodo, setAlertTodo] = useState("");
  const [idSettings, setidSettings] = useState<any>(null);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [Kelas, setKelas] = useState<ClassData[]>([]);
  const [DataStudent, setDataStudent] = useState<ResultItemStudent[]>([]);
  const [EditData, setEditData] = useState<EditFormValuesStudent | null>(null);
  const [StudentList, setStudentList] = useState<any>([]);

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataHistory = async () => {
    try {
      const response = await HistoryStudent.getHistory(
        token,
        querysearch,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setDataStudent(result);
      handleCloseModal();
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data pengaturan, silakan refresh halaman!",
      });
    }
  };

  const deleteHistoryStudent = async (id: number) => {
    try {
      await HistoryStudent.deleteHistory(token, id);
      DataHistory();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data history siswa",
      });
      handleCloseModal();
      FormStudent.resetForm();
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

  const handleDelete = async (value: any) => {
    const { id } = value;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to continue deleting ${value.student.full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      deleteHistoryStudent(id);
    } else {
      console.log("Edit canceled");
    }
  };
  const fetchAllKelas = async () => {
    const response = await Wali.GetAllKelas(token, 100000);
    const { result } = response.data.data;
    setKelas(result);
  };
  const fetchAllSiswa = async () => {
    const response = await Student.getAllStudent(token, "", 100000, 0);
    const { result } = response.data.data;
    setStudentList(result);
  };
  useEffect(() => {
    DataHistory();
    fetchAllKelas();
    fetchAllSiswa();
  }, []);

  // Schema validasi dengan Yup
  const FormStudentSchema = Yup.object().shape({
    student_id: Yup.number().required("Student ID is required"),
    class_id: Yup.number().required("Class ID is required"),
    academic_year: Yup.string().required("Academic Year is required"),
    is_active: Yup.string()
      .oneOf(["Ya", "Tidak"], "Invalid selection")
      .required("Active status is required"),
  });

  const FormStudent = useFormik<EditFormValuesStudent>({
    initialValues: {
      student_id: EditData?.student_id || "",
      class_id: EditData?.class_id || "",
      academic_year: EditData?.academic_year || "",
      is_active: EditData?.is_active || "Ya",
    },
    validationSchema: FormStudentSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        if (alertTodo === "edit") {
          await HistoryStudent.editHistory(token, idSettings, payload);
          DataHistory();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data history Siswa",
          });
          handleCloseModal();
        } else {
          await HistoryStudent.createHistory(token, payload);
          DataHistory();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data history Siswa",
          });
          handleCloseModal();
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
  const handleEdit = (state: string, value: any) => {
    if (state !== "Edit") {
      openModal("modal-Settings");

      const itemToEdit = DataStudent.find((item) => item.id === value.id);

      if (itemToEdit) {
        setEditData({
          student_id: itemToEdit?.student_id.toString(),
          class_id: itemToEdit?.class_id.toString() || "",
          academic_year: itemToEdit?.academic_year.toString() || "",
          is_active: itemToEdit?.is_active.toString() || "Ya",
        });
      }

      setAlertTodo("edit");
      state;
      setidSettings(value.id);
    } else {
      handleCloseModal();
    }
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormStudent.setValues(EditData);
    }
  }, [EditData, alertTodo]);

  useEffect(() => {
    DataHistory();
  }, [filter, querysearch]);

  const handleShowAlert = (type: any, value: any) => {
    openModal("modal-Settings");
    value;
    setAlertTodo(type);
  };
  const handleCloseModal = () => {
    closeModal("modal-Settings");
    FormStudent.resetForm();
  };
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    return Array.from(
      { length: 5 },
      (_, index) => `${startYear + index}/${startYear + index + 1}`
    );
  };
  // const handleStatus = (event: any) => {
  //   setStatus(event.target.value);
  // };

  return (
    <>
      <Modal id="modal-Settings" onClose={handleCloseModal}>
        <form onSubmit={FormStudent.handleSubmit}>
          <div className="my-2">
            <label htmlFor="student_id">Siswa</label>
            <select
              id="student_id"
              name="student_id"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              value={FormStudent.values.student_id}
              onChange={FormStudent.handleChange}
            >
              <option value="" disabled>
                Pilih Siswa
              </option>
              {StudentList.map((StudentList: any) => (
                <option key={StudentList.id} value={StudentList.id}>
                  {StudentList.full_name}
                </option>
              ))}
            </select>
            <div className="text-red-500 text-sm">
              {FormStudent.errors.student_id ? (
                <div>{FormStudent.errors.student_id}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="class_id">Kelas</label>
            <select
              id="class_id"
              name="class_id"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              value={FormStudent.values.class_id}
              onChange={FormStudent.handleChange}
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
              {FormStudent.errors.class_id ? (
                <div>{FormStudent.errors.class_id}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="academic_year">Tahun Ajaran</label>
            <select
              id="academic_year"
              name="academic_year"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              onChange={FormStudent.handleChange}
              onBlur={FormStudent.handleBlur}
              value={FormStudent.values.academic_year}
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
              {FormStudent.touched.academic_year &&
              FormStudent.errors.academic_year ? (
                <div>{FormStudent.errors.academic_year}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="is_active">Status</label>
            <select
              id="is_active"
              name="is_active"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              onChange={FormStudent.handleChange}
              onBlur={FormStudent.handleBlur}
              value={FormStudent.values.is_active}
            >
              <option value={"Ya"}>Aktif</option>
              <option value={"Tidak"}>Tidak Aktif</option>
            </select>
            <div className="text-red-500 text-sm">
              {FormStudent.touched.is_active && FormStudent.errors.is_active ? (
                <div>{FormStudent.errors.is_active}</div>
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
      </Modal>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">History Siswa</span>

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

            {/* <select
              className="select select-bordered w-md select-sm"
              value={selectedOption}
              onChange={handleStatus}
            >
              <option value="" disabled selected>
                Pilih Opsi
              </option>
              <option value={"Ya"}>Aktif</option>
              <option value={"Tidak"}>Tidak Aktif</option>
            </select> */}
            <div className="join">
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                onClick={() => handleShowAlert("Create", null)}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-[100%] ">
              {/* head */}
              <thead className="bg-blue-300">
                <tr>
                  <th>No.</th>
                  <th>NIS</th>
                  <th>NISN</th>
                  <th>Nama Siswa</th>
                  <th>Tingkat</th>
                  <th>Tahun Ajaran</th>
                  <th>Kelas</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {DataStudent?.map((item: ResultItemStudent, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.student.nis}</td>
                    <td>{item.student.nisn}</td>
                    <td>{item.student.full_name}</td>
                    <td>{item.student.level}</td>
                    <td>{item.academic_year}</td>
                    <td>{item.class.class_name}</td>
                    <td>{item.is_active === "Ya" ? "Aktif" : "Tidak Aktif"}</td>
                    <td className="text-center">
                      <div className="join ">
                        <button
                          className="btn btn-ghost btn-sm text-orange-500 text-xl"
                          onClick={() => handleEdit("GuruSettings", item)}
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

export default HistorySiswa;

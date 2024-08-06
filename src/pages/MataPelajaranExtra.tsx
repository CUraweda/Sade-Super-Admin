import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil, FaDribbble } from "react-icons/fa6";
import { GuruKaryawan, Extra, GuruMapelExtra } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  Employee,
  ExtracurricularActivity,
  EditFormValuesExtra,
  EditSubjectExtra,
  FormExtra,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Modal, { openModal, closeModal } from "../component/ModalProps";

const MataPelajaranExtra = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  //   const [selectedOption, setStatus] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTodo, setAlertTodo] = useState("");
  const [idMapel, setidMapel] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataExtra, setDataExtra] = useState<ExtracurricularActivity[]>([]);
  const [EditData, setEditData] = useState<EditFormValuesExtra | null>(null);
  const [GuruExtra, setGuruExtra] = useState<FormExtra[]>([]);
  const [StateEdit, setStateEdit] = useState("");
  const [EditGuruExtra, setEditGuruExtra] = useState<EditSubjectExtra | null>(
    null
  );

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataMapelExtra = async () => {
    try {
      const response = await Extra.GetMapelExtra(
        token,
        querysearch,
        filter.limit,
        filter.page
      );
      const { result } = response.data.data;
      setDataExtra(result);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const DataGuruExtra = async () => {
    try {
      const response = await GuruMapelExtra.GetGuruExtra(
        token,
        querysearch,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setGuruExtra(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

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
  const DeleteGuruMataExtra = async (id: number) => {
    try {
      await Extra.DeleteMapelExtra(token, id);
      DataMapelExtra();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data Guru Mata Pelajaran Extra",
      });

      FormExtra.resetForm();
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

  const handleDelete = async (state: string, value: any) => {
    const { id } = value;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to continue deleting ${
        state !== "MapelExtra" ? value.employee.full_name : value.name
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      DeleteGuruMataExtra(id);
    } else {
      console.log("Edit canceled");
    }
  };

  useEffect(() => {
    fetchEmployees();
    DataMapelExtra();
    DataGuruExtra();
  }, []);

  // Schema validasi dengan Yup
  const FormExtraSchema = Yup.object().shape({
    name: Yup.string().required("Nama Ekstrakulikuler harus di isi"),
  });

  const FormExtra = useFormik<EditFormValuesExtra>({
    initialValues: {
      name: EditData?.name || "",
    },
    validationSchema: FormExtraSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        if (alertTodo === "edit") {
          await Extra.UpdateMapelExtra(token, idMapel, payload);
          DataGuruExtra();
          DataMapelExtra();
          setShowAlert(false);
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah Mapel Extra",
          });

          handleCloseModal();
          FormExtra.resetForm();
        } else {
          await Extra.CreateMapelExtra(token, payload);
          DataMapelExtra();
          DataGuruExtra();
          setShowAlert(false);
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat Mapel Extra",
          });

          handleCloseModal();
          FormExtra.resetForm();
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
  const FormGuruSchema = Yup.object().shape({
    employee_id: Yup.number()
      .required("Employee ID is required")
      .integer("Employee ID must be an integer"),
    subject_extra_id: Yup.number()
      .required("Subject Extra ID is required")
      .integer("Subject Extra ID must be an integer"),
    academic_year: Yup.string()
      .required("Academic Year is required")
      .matches(/^\d{4}\/\d{4}$/, "Academic Year must be in format YYYY/YYYY"),
    is_active: Yup.string()
      .required("Active status is required")
      .default("false"),
  });
  const FormGuruExtra = useFormik<EditSubjectExtra>({
    initialValues: {
      employee_id: EditGuruExtra?.employee_id || "",
      subject_extra_id: EditGuruExtra?.subject_extra_id || "",
      academic_year: EditGuruExtra?.subject_extra_id || "",
      is_active: EditGuruExtra?.is_active || "",
    },
    validationSchema: FormGuruSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        if (alertTodo === "edit") {
          await GuruMapelExtra.UpdateGuruExtra(token, idMapel, payload);
          DataGuruExtra();
          DataMapelExtra();
          setShowAlert(false);
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data Guru Mata Pelajaran Extra",
          });
          FormExtra.resetForm();
        } else {
          await GuruMapelExtra.CreateGuruExtra(token, payload);
          DataMapelExtra();
          DataGuruExtra();
          setShowAlert(false);
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Menambahkan data Guru Mata Pelajaran Extra",
          });
          FormExtra.resetForm();
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
      openModal("modal-extra");
      setShowAlert(false);

      const itemToEdit = DataExtra.find((item) => item.id === value.id);
      const itemToGuru = GuruExtra.find((item) => item.id === value.id);

      if (itemToEdit) {
        setEditData({
          name: itemToEdit.name.toString(),
        });
      }

      if (itemToGuru) {
        setEditGuruExtra({
          employee_id: itemToGuru.employee_id.toString(),
          subject_extra_id: itemToGuru.subject_extra_id.toString(),
          academic_year: itemToGuru.academic_year,
          is_active: itemToGuru.is_active ? "true" : "false",
        });
      }
      setAlertTodo("edit");
      setStateEdit(state);
      setidMapel(value.id);
    } else {
      setShowAlert(true);
    }
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormExtra.setValues(EditData);
    }
    if (alertTodo === "edit" && EditGuruExtra) {
      FormGuruExtra.setValues(EditGuruExtra);
    }
  }, [EditData, alertTodo, EditGuruExtra]);

  useEffect(() => {
    DataMapelExtra();
    DataGuruExtra();
  }, [filter, querysearch]);

  const handleShowAlert = (type: string) => {
    setAlertTodo(type);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    FormExtra.resetForm();
    FormGuruExtra.resetForm();
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleOpenModal = (value: any) => {
    openModal("modal-extra");
    setStateEdit(value);
  };
  const handleCloseModal = () => {
    closeModal("modal-extra");
    FormExtra.resetForm();
    FormGuruExtra.resetForm();
  };

  return (
    <>
      <Modal id="modal-extra" onClose={handleCloseModal}>
        {StateEdit === "MapelExtra" ? (
          <form onSubmit={FormExtra.handleSubmit}>
            <div className="my-2">
              <label htmlFor="name">Nama Extrakulikuler</label>
              <input
                id="name"
                name="name"
                type="text"
                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
                value={FormExtra.values.name}
                onChange={FormExtra.handleChange}
              />
              <div className="text-red-500 text-sm">
                {FormExtra.errors.name ? (
                  <div>{FormExtra.errors.name}</div>
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
        ) : (
          <form onSubmit={FormGuruExtra.handleSubmit}>
            <div className="my-2">
              <label htmlFor="employee_id">Karyawan</label>
              <select
                id="employee_id"
                name="employee_id"
                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                value={FormGuruExtra.values.employee_id}
                onChange={FormGuruExtra.handleChange}
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
                {FormGuruExtra.errors.employee_id ? (
                  <div>{FormGuruExtra.errors.employee_id}</div>
                ) : null}
              </div>
            </div>

            <div className="my-2">
              <label htmlFor="subject_extra_id">Ekstrakurikuler</label>
              <select
                id="subject_extra_id"
                name="subject_extra_id"
                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                value={FormGuruExtra.values.subject_extra_id}
                onChange={FormGuruExtra.handleChange}
              >
                <option value="" disabled>
                  Pilih Ekstrakurikuler
                </option>
                {DataExtra.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="text-red-500 text-sm">
                {FormGuruExtra.errors.subject_extra_id ? (
                  <div>{FormGuruExtra.errors.subject_extra_id}</div>
                ) : null}
              </div>
            </div>

            <div className="my-2">
              <label htmlFor="academic_year">Academic Year</label>
              <input
                id="academic_year"
                name="academic_year"
                type="text"
                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
                value={FormGuruExtra.values.academic_year}
                onChange={FormGuruExtra.handleChange}
                placeholder="e.g., 2024/2025"
              />
              <div className="text-red-500 text-sm">
                {FormGuruExtra.errors.academic_year ? (
                  <div>{FormGuruExtra.errors.academic_year}</div>
                ) : null}
              </div>
            </div>

            <div className="my-2">
              <label htmlFor="is_active">Status</label>
              <select
                id="is_active"
                name="is_active"
                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
                value={FormGuruExtra.values.is_active}
                onChange={FormGuruExtra.handleChange}
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </select>
              <div className="text-red-500 text-sm">
                {FormGuruExtra.errors.is_active ? (
                  <div>{FormGuruExtra.errors.is_active}</div>
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
        )}
      </Modal>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Mata Pelajaran Extra</span>
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
              {alertTodo === "Extra" ? (
                <div>
                  <button
                    className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                    onClick={() => handleOpenModal("MapelExtra")}
                  >
                    <FaPlus />
                  </button>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra table-sm w-[100%] ">
                      {/* head */}
                      <thead className="bg-blue-300">
                        <tr className="text-center">
                          <th>No</th>
                          <th>Nama Extra Kurikuler</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DataExtra?.map(
                          (item: ExtracurricularActivity, index: number) => (
                            <tr key={index}>
                              <th>{filter.page * filter.limit + index + 1}</th>
                              <td>{item.name}</td>

                              <td className="text-center">
                                <div className="join ">
                                  <button
                                    className="btn btn-ghost btn-sm text-orange-500 text-xl"
                                    onClick={() =>
                                      handleEdit("MapelExtra", item)
                                    }
                                  >
                                    <FaPencil />
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-sm text-red-500 text-xl"
                                    onClick={() =>
                                      handleDelete("MapelExtra", item)
                                    }
                                  >
                                    <FaRegTrashAlt />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
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

            {/* <select
              className="select select-bordered w-md select-sm"
              value={selectedOption}
              onChange={handleStatus}
            >
              <option value="" disabled selected>
                Pilih Opsi
              </option>
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select> */}
            <div className="join">
              <button
                className="btn btn-ghost bg-blue-500 btn-sm text-white join-item tooltip"
                data-tip={"tambah Extra Kurikuler"}
                onClick={() => handleShowAlert("Extra")}
              >
                <FaDribbble />{" "}
              </button>
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                onClick={() => handleOpenModal("GuruExtra")}
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
                  <th>NO</th>
                  <th>Employee Name</th>
                  <th>Subject Extra</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {GuruExtra?.map((item: FormExtra, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.employee.full_name}</td>
                    <td>{item.subjectextra.name}</td>
                    <td>{item.academic_year}</td>
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td className="text-center">
                      <div className="join ">
                        <button
                          className="btn btn-ghost btn-sm text-orange-500 text-xl"
                          onClick={() => handleEdit("GuruExtra", item)}
                        >
                          <FaPencil />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-red-500 text-xl"
                          onClick={() => handleDelete("GuruExtra", item)}
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

export default MataPelajaranExtra;

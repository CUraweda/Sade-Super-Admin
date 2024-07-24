import { useEffect, useState } from "react";
import {
  FaDownload,
  FaPlus,
  FaRegTrashAlt,
  FaSync,
  FaUpload,
} from "react-icons/fa";
import { IoAddOutline, IoSearch } from "react-icons/io5";
import { FaPencil, FaLink, FaLinkSlash } from "react-icons/fa6";
import { GuruKaryawan } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  Employee,
  EmployeeDetail,
  UserSearchData,
  CreateFormValues,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { FaRegCircleUser } from "react-icons/fa6";
const DaftarGukar = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  const [querysearchuser, setQuerySearchuser] = useState<any>("");
  const [selectedOption, setStatus] = useState<any>("");
  const [datasearch, setDataSearch] = useState<UserSearchData[]>([]);
  const [inputValue, setInputValue] = useState<any>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTodo, setAlertTodo] = useState("");
  // const [tautanid, setTautanId] = useState<any>("");
  const [showData, setShowData] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataGukar, setDataGukar] = useState<Employee[]>([]);

  useEffect(() => {
    DataGuruKaryawan();
  }, []);

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataGuruKaryawan = async () => {
    try {
      const response = await GuruKaryawan.GetAllGuruKaryawan(
        token,
        filter.page,
        filter.limit,
        querysearch,
        selectedOption
      );
      const { result, ...meta } = response.data.data;
      console.log(result);
      setDataGukar(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const searchUser = async () => {
    try {
      const response = await GuruKaryawan.SearchUser(token, querysearchuser);
      const { result, ...meta } = response.data.data;
      setDataSearch(result);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const TautanAkun = async (value: any) => {
    try {
      const response = await GuruKaryawan.TautanAkun(token, inputValue, value);
      const { result, ...meta } = response.data.data;
      DataGuruKaryawan();
      setShowAlert(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const DeleteGuruKaryawan = async (id: number) => {
    try {
      const response = await GuruKaryawan.DeleteGuruKaryawan(token, id);
      const { result, ...meta } = response.data.data;
      DataGuruKaryawan();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const handleInputChange = (event: any) => {
    setQuerySearch(event.target.value);
  };
  const handleStatus = (event: any) => {
    setStatus(event.target.value);
  };

  const handleDelete = async (value: EmployeeDetail) => {
    const { full_name, id } = value;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to continue deleting ${full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      DeleteGuruKaryawan(id);
    } else {
      console.log("Edit canceled");
    }
  };

  const [mode, setMode] = useState<"create" | "update">("create");
  const [editData, setEditData] = useState<CreateFormValues | null>(null);
  const [idgukar, setIdGukar] = useState<any>(0);

  useEffect(() => {
    if (mode === "update" && editData) {
      createFormik.setValues(editData);
    }
  }, [editData, mode]);

  const handleEdit = async (value: any) => {
    const itemToEdit = DataGukar.find((item) => item.id === value?.id);
    setIdGukar(value.id);
    console.log(value.id);
    if (itemToEdit) {
      setMode("update");
      setEditData({
        employee_no: itemToEdit?.employee_no || "",
        full_name: itemToEdit?.full_name,
        gender: itemToEdit?.gender,
        pob: itemToEdit?.pob,
        dob: itemToEdit?.dob,
        religion: itemToEdit?.religion,
        marital_status: itemToEdit?.marital_status,
        last_education: itemToEdit?.last_education,
        certificate_year: itemToEdit?.certificate_year?.toString() || "",
        is_education: itemToEdit?.is_education,
        major: itemToEdit?.major || "",
        employee_status: itemToEdit?.employee_status,
        work_start_date: itemToEdit?.work_start_date,
        occupation: itemToEdit?.occupation,
        is_teacher: itemToEdit?.is_teacher,
        duty: itemToEdit?.duty || "",
        job_desc: itemToEdit?.job_desc || "",
        grade: itemToEdit?.grade || "",
        email: itemToEdit?.email || "",
      });
      setShowAlert(true);
      setAlertTodo("edit");
    }
  };
  useEffect(() => {
    DataGuruKaryawan();
    searchUser();
  }, [filter, querysearch, selectedOption]);
  useEffect(() => {
    searchUser();
  }, [querysearchuser]);
  // const formatDate = (date: string) => {
  //   let Newdate = new Date(date);
  //   let formattedDate = Newdate.toLocaleDateString("id-ID", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   });
  //   return formattedDate;
  // };

  const handleShowAlert = (value: any | null, type: string) => {
    setInputValue(value);
    setAlertTodo(type);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    createFormik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      querysearchuser: "",
    },
    onSubmit: async (values: any) => {
      try {
        const response = await GuruKaryawan.SearchUser(
          token,
          values.querysearchuser
        );
        const { result, ...meta } = response.data.data;
        setDataSearch(result);
        setShowData(true);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
        });
      }
    },
  });
  const genderOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  const maritalStatusOptions = [
    { value: "KAWIN", label: "Nikah" },
    { value: "BELUM KAWIN", label: "Belum Nikah" },
  ];

  const isEducationOptions = [
    { value: "NK", label: "NK" },
    { value: "K", label: "K" },
  ];

  const employeeStatusOptions = [
    { value: "TETAP", label: "Tetap" },
    { value: "KONTRAK", label: "Kontrak" },
  ];

  const isTeacherOptions = [
    { value: "G", label: "G" },
    { value: "NG", label: "NG" },
  ];
  const createFormSchema = Yup.object().shape({
    employee_no: Yup.string().required("Nomor Karyawan/NIK diperlukan"),
    full_name: Yup.string().required("Nama Lengkap diperlukan"),
    gender: Yup.string()
      .oneOf(["L", "P"], "Gender harus L atau P")
      .required("Gender diperlukan"),
    pob: Yup.string().required("Tempat Lahir diperlukan"),
    dob: Yup.date()
      .required("Tanggal Lahir diperlukan")
      .nullable()
      .typeError("Tanggal Lahir harus berupa tanggal"),
    religion: Yup.string().required("Agama diperlukan"),
    marital_status: Yup.string()
      .oneOf(
        ["KAWIN", "BELUM KAWIN"],
        "Status Pernikahan harus KAWIN atau BELUM KAWIN"
      )
      .required("Status Pernikahan diperlukan"),
    last_education: Yup.string().required("Pendidikan Terakhir diperlukan"),
    certificate_year: Yup.number()
      .required("Tahun Ijazah diperlukan")
      .positive("Tahun Ijazah harus positif")
      .integer("Tahun Ijazah harus bilangan bulat"),
    is_education: Yup.string()
      .oneOf(["NK", "K"], "Is Education harus NK atau K")
      .required("Status Pendidikan diperlukan"),
    major: Yup.string().required("Jurusan diperlukan"),
    employee_status: Yup.string()
      .oneOf(["TETAP", "KONTRAK"], "Status Karyawan harus TETAP atau KONTRAK")
      .required("Status Karyawan diperlukan"),
    work_start_date: Yup.date()
      .required("Tanggal Mulai Bekerja diperlukan")
      .nullable()
      .typeError("Tanggal Mulai Bekerja harus berupa tanggal"),
    occupation: Yup.string().required("Jabatan/Tugas diperlukan"),
    is_teacher: Yup.string()
      .oneOf(["G", "NG"], "Status Guru harus G atau NG")
      .required("Status Guru diperlukan"),
    duty: Yup.string().required("Tugas diperlukan"),
    job_desc: Yup.string().required("Deskripsi Pekerjaan diperlukan"),
    grade: Yup.string().required("Golongan diperlukan"),
    email: Yup.string().required("Email diperlukan"),
  });
  const labels: { [key in keyof CreateFormValues]: string } = {
    employee_no: "Nomor Karyawan/NIK",
    full_name: "Nama Lengkap",
    gender: "Jenis Kelamin",
    pob: "Tempat Lahir",
    dob: "Tanggal Lahir",
    religion: "Agama",
    marital_status: "Status Pernikahan",
    last_education: "Pendidikan Terakhir",
    certificate_year: "Tahun Ijazah",
    is_education: "Status Pendidikan",
    major: "Jurusan",
    employee_status: "Status Karyawan",
    work_start_date: "Tanggal Mulai Bekerja",
    occupation: "Jabatan/Tugas",
    is_teacher: "Status Guru",
    duty: "Tugas",
    job_desc: "Deskripsi Pekerjaan",
    grade: "Golongan",
    email: "Email",
  };
  const createFormik = useFormik<CreateFormValues>({
    initialValues: {
      employee_no: "",
      full_name: "",
      gender: "",
      pob: "",
      dob: "",
      religion: "",
      marital_status: "",
      last_education: "",
      certificate_year: "",
      is_education: "",
      major: "",
      employee_status: "",
      work_start_date: "",
      occupation: "",
      is_teacher: "",
      duty: "",
      job_desc: "",
      grade: "",
      email: "",
    },
    validationSchema: createFormSchema,
    onSubmit: async (values) => {
      try {
        const formattedValues = {
          ...values,
          dob: values.dob
            ? new Date(values.dob).toISOString().split("T")[0]
            : "",
          work_start_date: values.work_start_date
            ? new Date(values.work_start_date).toISOString().split("T")[0]
            : "",
        };
        if (mode === "update") {
          const id = idgukar;
          await GuruKaryawan.UpdateGuruKaryawan(token, formattedValues, id);
          setShowAlert(false);
          DataGuruKaryawan();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data berhasil diperbarui!",
          });
          createFormik.resetForm();
        } else {
          await GuruKaryawan.CreateGuruKaryawan(token, formattedValues);
          setShowAlert(false);
          DataGuruKaryawan();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data berhasil ditambahkan!",
          });
          createFormik.resetForm();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menambahkan data, silakan coba lagi!",
        });
      }
    },
  });
  const handleTautanAkun = async (value: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Apakah ingin menautkan akun ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tautkan",
      cancelButtonText: "Tidak",
    });
    if (result.isConfirmed) {
      TautanAkun(value);
    } else {
      console.log("Tautan Akun dibatalkan");
    }
  };
  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Daftar Guru & Karyawan</span>
        {showAlert === true ? (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleCloseAlert}
          >
            <div className="bg-gray-900 bg-opacity-50 absolute inset-0"></div>
            <div
              className="bg-white p-6 rounded shadow-lg z-10 lg:min-w-[600px] max-w-screen overflow-y-auto max-h-[90vh]"
              onClick={handleDialogClick}
            >
              {alertTodo === "findingdata" ? (
                <div>
                  <div className="flex justify-between w-full">
                    <h2 className="text-lg font-bold mb-4 text-center h-full items-center p-auto">
                      Search Akun
                    </h2>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex gap-2 mb-4">
                      <label className="input input-sm input-bordered flex items-center gap-2 grow">
                        <input
                          type="text"
                          name="querysearchuser"
                          className="grow"
                          placeholder="Search"
                          value={formik.values.querysearchuser}
                          onChange={formik.handleChange}
                        />
                        <IoSearch />
                      </label>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 text-xs btn-sm rounded"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                  <div>
                    {showData && (
                      <table className="table table-zebra table-sm my-5">
                        {/* head */}
                        <thead className="bg-blue-300">
                          <tr className="text-center">
                            <th>No</th>
                            <th>Emal</th>
                            <th>Nama</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {datasearch?.map((item: any, index: number) =>
                            item.full_name
                              .toLowerCase()
                              .includes(
                                formik.values.querysearchuser.toLowerCase()
                              ) && formik.values.querysearchuser !== "" ? (
                              <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{item.email}</td>
                                <td>{item.full_name}</td>
                                <td>
                                  <button
                                    className="bg-blue-500 text-white px-4 py-2 text-xs btn-sm rounded"
                                    onClick={() => handleTautanAkun(item.id)}
                                  >
                                    Select
                                  </button>
                                </td>
                              </tr>
                            ) : null
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 text-xs btn-sm rounded"
                    onClick={handleCloseAlert}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold mb-4 mt-2">
                    Create New Entry
                  </h2>
                  <form onSubmit={createFormik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.keys(createFormik.values).map((key) => {
                        if (key === "gender") {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              <select
                                name={key}
                                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                value={
                                  createFormik.values[
                                    key as keyof CreateFormValues
                                  ]
                                }
                                onChange={createFormik.handleChange}
                              >
                                <option value="">Pilih</option>
                                {genderOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        } else if (key === "marital_status") {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              <select
                                name={key}
                                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                value={
                                  createFormik.values[
                                    key as keyof CreateFormValues
                                  ]
                                }
                                onChange={createFormik.handleChange}
                              >
                                <option value="">Pilih</option>
                                {maritalStatusOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        } else if (key === "is_education") {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              <select
                                name={key}
                                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                value={
                                  createFormik.values[
                                    key as keyof CreateFormValues
                                  ]
                                }
                                onChange={createFormik.handleChange}
                              >
                                <option value="">Pilih</option>
                                {isEducationOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        } else if (key === "employee_status") {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              <select
                                name={key}
                                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                value={
                                  createFormik.values[
                                    key as keyof CreateFormValues
                                  ]
                                }
                                onChange={createFormik.handleChange}
                              >
                                <option value="">Pilih</option>
                                {employeeStatusOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        } else if (key === "is_teacher") {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              <select
                                name={key}
                                className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                value={
                                  createFormik.values[
                                    key as keyof CreateFormValues
                                  ]
                                }
                                onChange={createFormik.handleChange}
                              >
                                <option value="">Pilih</option>
                                {isTeacherOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700">
                                {labels[key as keyof CreateFormValues]}
                              </label>
                              {key === "dob" || key === "work_start_date" ? (
                                <input
                                  type="date"
                                  name={key}
                                  className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                  value={
                                    createFormik.values[
                                      key as keyof CreateFormValues
                                    ] || ""
                                  }
                                  onChange={createFormik.handleChange}
                                />
                              ) : (
                                <input
                                  type="text"
                                  name={key}
                                  className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
                                  value={
                                    createFormik.values[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                  onChange={createFormik.handleChange}
                                />
                              )}
                              {createFormik.errors[
                                key as keyof CreateFormValues
                              ] && (
                                <div className="text-red-500 text-sm">
                                  {
                                    createFormik.errors[
                                      key as keyof CreateFormValues
                                    ]
                                  }
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        {mode === "update" ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : null}
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md ">
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
                Pilih Option
              </option>
              <option value="Y">Sudah Assign</option>
              <option value="N">Belum Assign</option>
            </select>
            <div className="join">
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                // data-tip={"tambah Guru/ Karyawan"}
                onClick={() => handleShowAlert("findingdata", "create")}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <table className="table table-zebra table-sm">
            {/* head */}
            <thead className="bg-blue-300">
              <tr className="text-center">
                <th>NO</th>
                <th>Nomor Karyawan/ NIK</th>
                <th>Nama Lengkap</th>
                <th>L/P</th>
                <th>Tempat Lahir</th>
                <th>Agama</th>
                <th>Kawin/ Belum Kawin</th>
                <th>Pendidikan Terakhir</th>
                <th>Waktu Mulai Bekerja</th>
                <th>Tetap/ Kontrak</th>
                <th>Jabatan/ Tugas</th>
                <th>Status Akun</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {DataGukar?.map((item: Employee, index: number) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{item?.employee_no}</td>
                  <td>{item?.full_name}</td>
                  <td>{item?.gender}</td>
                  <td>{item?.pob}</td>
                  <td>{item?.religion}</td>
                  <td>{item?.marital_status}</td>
                  <td>{item?.last_education}</td>
                  <td>{item?.work_start_date}</td>
                  <td>{item?.employee_status}</td>
                  <td>{item?.job_desc}</td>
                  <td className="text-center">
                    {item?.user_id == null ? (
                      <button
                        className="btn btn-ghost btn-sm text-orange-500 text-xl"
                        onClick={() => handleShowAlert(item?.id, "findingdata")}
                      >
                        <FaLinkSlash />
                      </button>
                    ) : (
                      <p>
                        <button
                          className="btn btn-ghost btn-sm text-orange-500 text-xl"
                          onClick={() =>
                            handleShowAlert(item?.id, "findingdata")
                          }
                        >
                          <FaLink />
                          {/* {item?.user_id} */}
                        </button>
                      </p>
                    )}
                  </td>
                  <td className="text-center">
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

export default DaftarGukar;
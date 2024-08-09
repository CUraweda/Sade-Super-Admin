import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
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
      const { result } = response.data.data;
      setDataSearch(result);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data, silakan coba kembali!",
      });
    }
  };

  const TautanAkun = async (value: any) => {
    try {
      await GuruKaryawan.TautanAkun(token, inputValue, value);
      DataGuruKaryawan();
      setShowAlert(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Menautkan akun, silakan coba kembali!",
      });
    }
  };

  const DeleteGuruKaryawan = async (id: number) => {
    try {
      await GuruKaryawan.DeleteGuruKaryawan(token, id);
      DataGuruKaryawan();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus data, silakan coba kembali!",
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
      title: "Apakah kamu yakin?",
      text: `Ingin menghapus data  ${full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Tidak",
    });
    if (result.isConfirmed) {
      DeleteGuruKaryawan(id);
    } else {
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
    setQuerySearchuser("");
  }, [filter, querysearch, selectedOption]);
  useEffect(() => {
    searchUser();
  }, []);
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
        const { result } = response.data.data;
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
    { value: "Laki-Laki", label: "Laki-Laki" },
    { value: "Perempuan", label: "Perempuan" },
  ];

  const maritalStatusOptions = [
    { value: "Sudah Menikah", label: "Sudah Menikah" },
    { value: "Belum Menikah", label: "Belum Menikah" },
  ];

  const isEducationOptions = [
    { value: "Non Kuliah", label: "Non Kuliah" },
    { value: "Kuliah", label: "Kuliah" },
  ];

  const employeeStatusOptions = [
    { value: "Tetap", label: "Tetap" },
    { value: "Kontrak", label: "Kontrak" },
  ];

  const isTeacherOptions = [
    { value: "Guru", label: "Guru" },
    { value: "Non Guru", label: "Non Guru" },
  ];
  const createFormSchema = Yup.object().shape({
    employee_no: Yup.string().required("Nomor Karyawan/NIK diperlukan"),
    full_name: Yup.string().required("Nama Lengkap diperlukan"),
    gender: Yup.string()
      .oneOf(
        ["Laki-Laki", "Perempuan"],
        "Gender harus Laki-Laki atau Perempuan"
      )
      .required("Gender diperlukan"),
    pob: Yup.string().required("Tempat Lahir diperlukan"),
    dob: Yup.date()
      .required("Tanggal Lahir diperlukan")
      .nullable()
      .typeError("Tanggal Lahir harus berupa tanggal"),
    religion: Yup.string().required("Agama diperlukan"),
    marital_status: Yup.string()
      .oneOf(
        ["Sudah Menikah", "Belum Menikah"],
        "Status Pernikahan harus Menikah atau Belum Menikah"
      )
      .required("Status Pernikahan diperlukan"),
    last_education: Yup.string().required("Pendidikan Terakhir diperlukan"),
    certificate_year: Yup.number()
      .required("Tahun Ijazah diperlukan")
      .positive("Tahun Ijazah harus positif")
      .integer("Tahun Ijazah harus bilangan bulat"),
    is_education: Yup.string()
      .oneOf(["Non Kulian", "Kuliah"], "Is Education harus Tidak atau Ya")
      .required("Status Pendidikan diperlukan"),
    major: Yup.string().required("Jurusan diperlukan"),
    employee_status: Yup.string()
      .oneOf(["Tetap", "Kontrak"], "Status Karyawan harus Tetap atau Kontrak")
      .required("Status Karyawan diperlukan"),
    work_start_date: Yup.date()
      .required("Tanggal Mulai Bekerja diperlukan")
      .nullable()
      .typeError("Tanggal Mulai Bekerja harus berupa tanggal"),
    occupation: Yup.string().required("Jabatan/Tugas diperlukan"),
    is_teacher: Yup.string()
      .oneOf(["Guru", "Non Guru"], "Status Guru harus G atau NG")
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
      title: "Apakah kamu yakin?",
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
              className="bg-white p-6 rounded shadow-lg z-10 lg:min-w-[600px] max-w-screen overflow-y-auto max-h-[90vh] relative"
              onClick={handleDialogClick}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleCloseAlert}
              >
                ✕
              </button>
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
                                    Pilih
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

        <div className="overflow-hidden w-full mt-5 bg-white p-4 rounded-md shadow-md ">
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
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-[100%] ">
              {/* head */}
              <thead className="bg-blue-300">
                <tr className="text-center">
                  <th>NO</th>
                  <th>Nomor Pegawai</th>
                  <th>Nama Lengkap</th>
                  <th>Jenis Kelamin</th>
                  <th>Tempat Lahir</th>
                  <th>Tanggal Lahir</th>
                  <th>Agama</th>
                  <th>Pendidikan Terakhir</th>
                  <th>Jurusan</th>
                  <th>Status Pekerjaan</th>
                  <th>Tanggal Mulai Bekerja</th>
                  <th>Pekerjaan</th>
                  <th>Nama Lengkap User</th>
                  <th>Email User</th>
                  <th>Akun</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DataGukar?.map((item: Employee, index: number) => (
                  <tr key={item.id}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.employee_no}</td>
                    <td>{item.full_name}</td>
                    <td>{item.gender}</td>
                    <td>{item.pob}</td>
                    <td>{new Date(item.dob).toLocaleDateString()}</td>
                    <td>{item.religion}</td>
                    <td>{item.last_education}</td>
                    <td>{item.major}</td>
                    <td>{item.employee_status}</td>
                    <td>
                      {new Date(item.work_start_date).toLocaleDateString()}
                    </td>
                    <td>{item.occupation}</td>
                    <td>{item.full_name}</td>
                    <td>{item.email}</td>
                    <td className="text-center">
                      {item?.user_id == null ? (
                        <button
                          className="btn btn-ghost btn-sm text-orange-500 text-xl"
                          onClick={() =>
                            handleShowAlert(item?.id, "findingdata")
                          }
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

export default DaftarGukar;

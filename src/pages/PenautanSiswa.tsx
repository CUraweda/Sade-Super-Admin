import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { AksesSiswa, Student, Wali } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import {
  ResultItemAksesSiswa,
  EditFormValuesAksesSiswa,
} from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Modal, { openModal, closeModal } from "../component/ModalProps";

const PenautanSiswa = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  const [dataDropdownLevel, setDataDropdownLevel] = useState<any[]>([]);
  const [level, setLevel] = useState("");
  // const [selectedOption, setStatus] = useState<any>(null);
  const [alertTodo, setAlertTodo] = useState("");
  const [idUser, setidUser] = useState<any>(null);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataAksesSiswa, setDataAksesSiswa] = useState<ResultItemAksesSiswa[]>(
    []
  );
  const [EditData, setEditData] = useState<EditFormValuesAksesSiswa | null>(
    null
  );
  const [AksesSiswaList, setAksesSiswaList] = useState<any>([]);
  const [UserList, setUser] = useState<any>([]);
  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataAkses = async () => {
    try {
      const response = await AksesSiswa.getAksesSiswa(
        token,
        querysearch,
        filter.limit,
        filter.page,
        level
      );
      const { result, ...meta } = response.data.data;
      setDataAksesSiswa(result);
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

  const DeleteAksesSiswa = async (id: number) => {
    try {
      await AksesSiswa.deleteAksesSiswa(token, id);
      DataAkses();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data Akses siswa",
      });
      handleCloseModal();
      FormAksesSiswa.resetForm();
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
      title: "Apakah kamu yakin?",
      text: `Ingin menghapus data  ${value.user.full_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Tidak",
    });
    if (result.isConfirmed) {
      DeleteAksesSiswa(id);
    } else {
      console.log("Edit canceled");
    }
  };

  const fetchAllSiswa = async () => {
    const response = await Student.getAllStudent(token, "", 100000, 0);
    const responseDropdown = await Wali.GetAllKelas(token, 10000);

    const uniqueDropdownLevel = responseDropdown.data.data.result.filter(
      (item: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.level === item.level)
    );

    setDataDropdownLevel(uniqueDropdownLevel);
    const { result } = response.data.data;
    setAksesSiswaList(result);
  };
  const fetchAllUser = async () => {
    const response = await AksesSiswa.getAllUser(token, "", 100000, 0);
    const { result } = response.data.data;
    setUser(result);
  };
  useEffect(() => {
    DataAkses();
    fetchAllSiswa();
    fetchAllUser();
  }, [level]);

  // Schema validasi dengan Yup
  const FormAksesSiswaSchema = Yup.object().shape({
    user_id: Yup.number().required("User is required"),
    student_id: Yup.number().required("Siswa is required"),
  });

  const FormAksesSiswa = useFormik<EditFormValuesAksesSiswa>({
    initialValues: {
      user_id: EditData?.user_id || "",
      student_id: EditData?.student_id || "",
    },
    validationSchema: FormAksesSiswaSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        if (alertTodo === "edit") {
          await AksesSiswa.editAksesSiswa(token, idUser, payload);
          DataAkses();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data Akses Siswa",
          });
          handleCloseModal();
        } else {
          await AksesSiswa.createAksesSiswa(token, payload);
          DataAkses();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data Akses Siswa",
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

      const itemToEdit = DataAksesSiswa.find((item) => item.id === value.id);

      if (itemToEdit) {
        setEditData({
          user_id: itemToEdit?.user_id.toString(),
          student_id: itemToEdit?.student_id.toString(),
        });
      }

      setAlertTodo("edit");
      state;
      setidUser(value.id);
    } else {
      handleCloseModal();
    }
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormAksesSiswa.setValues(EditData);
    }
  }, [EditData, alertTodo]);

  useEffect(() => {
    DataAkses();
  }, [filter, querysearch]);

  const handleShowAlert = (type: any, value: any) => {
    openModal("modal-Settings");
    value;
    setAlertTodo(type);
  };
  const handleCloseModal = () => {
    closeModal("modal-Settings");
    FormAksesSiswa.resetForm();
  };

  return (
    <>
      <Modal id="modal-Settings" onClose={handleCloseModal}>
        <form onSubmit={FormAksesSiswa.handleSubmit}>
          <div className="my-2">
            <label htmlFor="user_id">User</label>
            <select
              id="user_id"
              name="user_id"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              value={FormAksesSiswa.values.user_id}
              onChange={FormAksesSiswa.handleChange}
            >
              <option value="" disabled>
                Pilih User
              </option>
              {UserList.map((UserList: any) => (
                <option key={UserList.id} value={UserList.id}>
                  {UserList.full_name} - {UserList.email}
                </option>
              ))}
            </select>
            <div className="text-red-500 text-sm">
              {FormAksesSiswa.errors.user_id ? (
                <div>{FormAksesSiswa.errors.user_id}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="student_id">Siswa</label>
            <select
              id="student_id"
              name="student_id"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              value={FormAksesSiswa.values.student_id}
              onChange={FormAksesSiswa.handleChange}
            >
              <option value="" disabled>
                Pilih Siswa
              </option>
              {AksesSiswaList.map((AksesSiswaList: any) => (
                <option key={AksesSiswaList.id} value={AksesSiswaList.id}>
                  {AksesSiswaList.full_name} -{AksesSiswaList.nis}
                </option>
              ))}
            </select>
            <div className="text-red-500 text-sm">
              {FormAksesSiswa.errors.student_id ? (
                <div>{FormAksesSiswa.errors.student_id}</div>
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
        <span className="text-xl font-bold">Akses Siswa</span>

        <div className="w-full mt-5 bg-white p-4 rounded-md shadow-md ">
          <div className="w-full flex justify-end my-4 gap-2 items-center">
            <select
              className="select select-bordered w-full select-sm max-w-[15rem]"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option disabled selected>
                Pilih
              </option>
              {dataDropdownLevel.map((item, index) => (
                <option key={index} value={item.level}>
                  {item.level}
                </option>
              ))}
            </select>
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
                  <th>Nama Orang Tua</th>
                  <th>Email</th>
                  <th>NIS</th>
                  <th>NISN</th>
                  <th>Nama Siswa</th>
                  <th>Kelas</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {DataAksesSiswa?.map(
                  (item: ResultItemAksesSiswa, index: number) => (
                    <tr key={index}>
                      <th>{filter.page * filter.limit + index + 1}</th>
                      <td>{item.user.full_name}</td>
                      <td>{item.user.email}</td>
                      <td>{item.student.nis}</td>
                      <td>{item.student.nisn}</td>
                      <td>{item.student.full_name}</td>
                      <td>{item.student.class}</td>
                      <td>
                        {item.student.is_active === "Ya"
                          ? "Aktif"
                          : "Tidak Aktif"}
                      </td>
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
                  )
                )}
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
export default PenautanSiswa;

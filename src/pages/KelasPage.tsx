import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { Kelas } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { EditClass, FormClass } from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Modal, { openModal, closeModal } from "../component/ModalProps";

const KelasPage = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [querysearch, setQuerySearch] = useState<any>("");
  //   const [selectedOption, setStatus] = useState<any>(null);
  const [alertTodo, setAlertTodo] = useState("");
  const [idSettings, setidSettings] = useState<any>(null);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [DataKelas, setDataKelas] = useState<FormClass[]>([]);
  const [EditData, setEditData] = useState<EditClass | null>(null);

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataPengaturan = async () => {
    try {
      const response = await Kelas.getAllClasses(
        token,
        querysearch,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setDataKelas(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data pengaturan, silakan refresh halaman!",
      });
    }
  };

  const deleteSettingsData = async (id: number) => {
    try {
      await Kelas.deleteClasses(token, id);
      DataPengaturan();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data kelas",
      });

      FormKelas.resetForm();
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
      text: `Ingin menghapus data  ${value.class_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Tidak",
    });
    if (result.isConfirmed) {
      deleteSettingsData(id);
    } else {
      console.log("Edit canceled");
    }
  };

  useEffect(() => {
    DataPengaturan();
  }, []);

  // Schema validasi dengan Yup
  const FormKelasSchema = Yup.object().shape({
    class_name: Yup.string().required("Nama kelas harus diisi"),
    is_active: Yup.string()
      .oneOf(["true", "false"], "Invalid selection")
      .required("Status harus diisi"),
    level: Yup.string()
      .oneOf(["SM", "SD", "TK"], "Invalid selection")
      .required("Status harus diisi"),

    book_target: Yup.string().required("Target buku kelas harus diisi"),
    waste_target: Yup.string().required(
      "Target timbangan sampah kelas harus diisi"
    ),
  });

  const FormKelas = useFormik<EditClass>({
    initialValues: {
      level: EditData?.level || "",
      class_name: EditData?.class_name || "",
      book_target: EditData?.book_target || "",
      waste_target: EditData?.waste_target || "",
      is_active: EditData?.is_active || "true",
    },
    validationSchema: FormKelasSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      try {
        if (alertTodo === "edit") {
          await Kelas.editClasses(token, idSettings, payload);
          DataPengaturan();
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data kelas",
          });

          handleCloseModal();
          FormKelas.resetForm();
        } else {
          await Kelas.createClasses(token, payload);
          DataPengaturan();
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data kelas",
          });

          handleCloseModal();
          FormKelas.resetForm();
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
    openModal("modal-Settings");

    const itemToEdit = DataKelas.find((item) => item.id === value.id);

    if (itemToEdit) {
      setEditData({
        level: itemToEdit.level.toString(),
        class_name: itemToEdit.class_name.toString(),
        book_target: itemToEdit.book_target.toString(),
        waste_target: itemToEdit.waste_target.toString(),
        is_active: itemToEdit.is_active.toString(),
      });
    }

    setAlertTodo("edit");
    setidSettings(value.id);
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormKelas.setValues(EditData);
    }
  }, [EditData, alertTodo]);

  useEffect(() => {
    DataPengaturan();
  }, [filter, querysearch]);

  const handleShowAlert = (type: any) => {
    openModal("modal-Settings");
    setAlertTodo(type);
  };
  const handleCloseModal = () => {
    closeModal("modal-Settings");
    FormKelas.resetForm();
  };

  return (
    <>
      <Modal id="modal-Settings" onClose={handleCloseModal}>
        <form onSubmit={FormKelas.handleSubmit}>
          <div className="my-2">
            <label htmlFor="class_name">Nama Kelas</label>
            <input
              id="class_name"
              name="class_name"
              type="text"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
              value={FormKelas.values.class_name}
              onChange={FormKelas.handleChange}
            />
            <div className="text-red-500 text-sm">
              {FormKelas.errors.class_name ? (
                <div>{FormKelas.errors.class_name}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              onChange={FormKelas.handleChange}
              onBlur={FormKelas.handleBlur}
              value={FormKelas.values.level}
            >
              <option value={""} disabled>
                Pilih Level
              </option>
              <option value={"SM"}>SM</option>
              <option value={"SD"}>SD</option>
              <option value={"TK"}>TK</option>
            </select>
            <div className="text-red-500 text-sm">
              {FormKelas.errors.level ? (
                <div>{FormKelas.errors.level}</div>
              ) : null}
            </div>
          </div>

          <div className="my-2">
            <label htmlFor="book_target">Book Target</label>
            <input
              id="book_target"
              name="book_target"
              type="text"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
              value={FormKelas.values.book_target}
              onChange={FormKelas.handleChange}
            />
            <div className="text-red-500 text-sm">
              {FormKelas.errors.book_target ? (
                <div>{FormKelas.errors.book_target}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="waste_target">Waste Target</label>
            <input
              id="waste_target"
              name="waste_target"
              type="text"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
              value={FormKelas.values.waste_target}
              onChange={FormKelas.handleChange}
            />
            <div className="text-red-500 text-sm">
              {FormKelas.errors.waste_target ? (
                <div>{FormKelas.errors.waste_target}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="is_active">Status Aktif</label>
            <select
              id="is_active"
              name="is_active"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              onChange={FormKelas.handleChange}
              onBlur={FormKelas.handleBlur}
              value={FormKelas.values.is_active}
            >
              <option value={"true"}>Aktif</option>
              <option value={"false"}>Tidak Aktif</option>
            </select>
            <div className="text-red-500 text-sm">
              {FormKelas.touched.is_active && FormKelas.errors.is_active ? (
                <div>{FormKelas.errors.is_active}</div>
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
        <span className="text-xl font-bold">Daftar Kelas</span>

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
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                onClick={() => handleShowAlert("Create")}
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
                  <th>Tahun Ajaran</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {DataKelas?.map((item: FormClass, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.class_name}</td>
                    <td>{item.level}</td>
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

export default KelasPage;

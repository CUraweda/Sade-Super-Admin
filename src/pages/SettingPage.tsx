import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { Settings } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { ResultSettings, EditSettings } from "../middleware/utils";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Modal, { openModal, closeModal } from "../component/ModalProps";

const SettingPage = () => {
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
  const [DataSettings, setDataSettings] = useState<ResultSettings[]>([]);
  const [EditData, setEditData] = useState<EditSettings | null>(null);

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
      const response = await Settings.getSettings(
        token,
        querysearch,
        filter.limit,
        filter.page
      );
      const { result, ...meta } = response.data.data;
      setDataSettings(result);
      console.log(result);
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
      await Settings.deleteSettings(token, id);
      DataPengaturan();
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menghapus data pengaturan Tahun Ajaran",
      });

      FormSettings.resetForm();
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
      text: `Do you want to continue deleting ${value.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
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
  const FormSettingsSchema = Yup.object().shape({
    name: Yup.string().required(""),
    status: Yup.string().required(""),
  });

  const FormSettings = useFormik<EditSettings>({
    initialValues: {
      name: EditData?.name || "",
      start: EditData?.start || "",
      end: EditData?.end || "",
      status: EditData?.status || "",
    },
    validationSchema: FormSettingsSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        status: values.status || "",
        start: values.name.split("/")[0],
        end: values.name.split("/")[1],
      };
      try {
        if (alertTodo === "edit") {
          await Settings.updateSettings(token, idSettings, payload);
          DataPengaturan();
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Merubah data Guru Wali Kelas",
          });

          handleCloseModal();
          FormSettings.resetForm();
        } else {
          await Settings.createSettings(token, payload);
          DataPengaturan();
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Sukses",
            text: "Sukses Membuat data Guru Wali Kelas",
          });

          handleCloseModal();
          FormSettings.resetForm();
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

    const itemToEdit = DataSettings.find((item) => item.id === value.id);

    if (itemToEdit) {
      setEditData({
        start: itemToEdit.start.toString(),
        end: itemToEdit.end.toString(),
        name: itemToEdit.name.toString(),
        status: itemToEdit.status.toString(),
      });
    }

    setAlertTodo("edit");
    setidSettings(value.id);
  };
  useEffect(() => {
    if (alertTodo === "edit" && EditData) {
      FormSettings.setValues(EditData);
    }
  }, [EditData, alertTodo]);

  useEffect(() => {
    DataPengaturan();
  }, [filter, querysearch]);

  // const handleCloseAlert = () => {
  //   handleCloseModal();
  //   FormSettings.resetForm();
  // };

  // const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  // };
  const handleShowAlert = (type: any) => {
    openModal("modal-Settings");
    setAlertTodo(type);
  };
  const handleCloseModal = () => {
    closeModal("modal-Settings");
    FormSettings.resetForm();
  };
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    return Array.from(
      { length: 5 },
      (_, index) => `${startYear + index}/${startYear + index + 1}`
    );
  };

  return (
    <>
      <Modal id="modal-Settings" onClose={handleCloseModal}>
        <form onSubmit={FormSettings.handleSubmit}>
          <div className="my-2">
            <label htmlFor="name">Tahun Ajaran</label>
            <select
              id="name"
              name="name"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border  rounded-md shadow-sm sm:text-sm"
              onChange={FormSettings.handleChange}
              onBlur={FormSettings.handleBlur}
              value={FormSettings.values.name}
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
              {FormSettings.touched.name && FormSettings.errors.name ? (
                <div>{FormSettings.errors.name}</div>
              ) : null}
            </div>
          </div>
          <div className="my-2">
            <label htmlFor="status">Active Status</label>
            <select
              id="status"
              name="status"
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
              value={FormSettings.values.status}
              onChange={FormSettings.handleChange}
            >
              <option value={""}>Select</option>
              <option value={"Aktif"}>Active</option>
              <option value={"Tidak Aktif"}>Inactive</option>
            </select>
            <div className="text-red-500 text-sm">
              {FormSettings.errors.status ? (
                <div>{FormSettings.errors.status}</div>
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
        <span className="text-xl font-bold">Tahun Ajaran</span>

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
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {DataSettings?.map((item: ResultSettings, index: number) => (
                  <tr key={index}>
                    <th>{filter.page * filter.limit + index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.status === "Aktif" ? "Aktif" : "Tidak Aktif"}</td>
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

export default SettingPage;

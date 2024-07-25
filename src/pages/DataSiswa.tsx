import { useEffect, useState } from "react";
import {
  FaDownload,
  FaPlus,
  FaRegTrashAlt,
  FaSync,
  FaUpload,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Siswa } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { SiswaList } from "../middleware/utils";
import Modal, { openModal, closeModal } from "../component/ModalProps";
import Swal from "sweetalert2";

const DataSiswa = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [siswa, setSiswa] = useState<SiswaList[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaList | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    DataSiswa();
  }, []);

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const DataSiswa = async () => {
    try {
      const response = await Siswa.GetAllDataSiswa(
        token,
        filter.page,
        filter.limit
      );
      const { result, ...meta } = response.data.data;
      setSiswa(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    DataSiswa();
  }, [filter]);

  const formatDate = (date: string) => {
    let Newdate = new Date(date);
    let formattedDate = Newdate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSiswa(null);
    openModal("siswaModal");
  };

  const handleEditClick = (siswa: SiswaList) => {
    setModalMode("edit");
    setSelectedSiswa(siswa);
    openModal("siswaModal");
  };

  const handleSubmit = () => {
    closeModal("siswaModal");
    DataSiswa();
  };

  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Daftar Siswa</span>
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md ">
          <div className="w-full flex justify-end my-4 gap-2 items-center">
            <label className="input input-sm input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>

            <select className="select select-bordered w-md select-sm">
              <option> Kelas</option>
              <option>1</option>
              <option>2</option>
            </select>
            <div className="join">
              <button
                className="btn btn-ghost bg-green-500 btn-sm text-white join-item tooltip"
                data-tip={"tarik data PMB"}
              >
                <FaSync />
              </button>
              <button
                className="btn btn-ghost bg-blue-500 btn-sm text-white join-item tooltip"
                data-tip={"tambah siswa"}
                onClick={handleAddClick}
              >
                <FaPlus />
              </button>
              <button
                className="btn btn-ghost bg-cyan-500 btn-sm text-white join-item tooltip"
                data-tip={"upload siswa"}
              >
                <FaUpload />
              </button>
              <button
                className="btn btn-ghost bg-orange-500 btn-sm text-white join-item tooltip tooltip-left"
                data-tip={"download data"}
              >
                <FaDownload />
              </button>
            </div>
          </div>
          <table className="table table-zebra table-sm">
            {/* head */}
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NIS</th>
                <th>NISN</th>
                <th>TTL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {siswa?.map((item: SiswaList, index: number) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{item.full_name}</td>
                  <td>{item.nis}</td>
                  <td>{item.nisn}</td>
                  <td>
                    {item.pob}, {formatDate(item.dob)}
                  </td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm text-orange-500 text-xl"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaPencil />
                      </button>
                      <button className="btn btn-ghost btn-sm text-red-500 text-xl">
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

      <Modal id="siswaModal" onClose={() => setSelectedSiswa(null)}>
        <div className="p-4">
          <h3 className="text-lg font-bold">
            {modalMode === "add" ? "Tambah Siswa" : "Edit Siswa"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                defaultValue={selectedSiswa?.full_name || ""}
                required
              />
            </div>
            {/* Tambahkan input lainnya sesuai kebutuhan */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">
                {modalMode === "add" ? "Tambah" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default DataSiswa;

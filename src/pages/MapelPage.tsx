import { useEffect, useState } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../component/ModalProps";
import { Mapel } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import Swal from "sweetalert2";
import { IpageMeta, PaginationControl } from "../component/PaginationControl";
import { MapelList } from "../middleware/utils";
import { FaPencil } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  code: Yup.string().required("code required"),
  name: Yup.string().required("name required"),
  level: Yup.string().required("level required"),
  threshold: Yup.string().required("KKM required"),
});

const MapelPage = () => {
  const { token } = LoginStore();
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });
  const [mapel, setMapel] = useState<MapelList[]>([]);
  const [level, setLevel] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      level: "",
      threshold: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    DataMapel();
  }, [filter, level]);

  const DataMapel = async () => {
    try {
      const response = await Mapel.GetAllDataMapel(
        token,
        filter.page,
        filter.limit
      );
      const { result, ...meta } = response.data.data;
      const dateFilter = result.filter((value) => value.level === level);
      const MapelFilter = level ? dateFilter : result;
      setMapel(MapelFilter);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data mapel, silakan refresh halaman!",
      });
    }
  };

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const handleCreate = async () => {
    try {
      const { code, level, name, threshold } = formik.values;
      const thresholdconv = parseFloat(threshold);
      const data = {
        code,
        level,
        name,
        threshold: thresholdconv,
      };
      await Mapel.CreateMapel(token, data);

      closeModal("add-mapel");
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Sukses Menambahkan data Mapel",
      });
      DataMapel();
    } catch (error) {
      closeModal("add-mapel");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menambahkan data mapel, silakan refresh halaman!",
      });
    }
  };

  const trigerDelete = (id: string | number | undefined) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleDelete = async (id: string | number | undefined) => {
    try {
      await Mapel.DeleteMapel(token, id);
      Swal.fire({
        title: "Deleted!",
        text: "mata pelajaran berhasil dihapus",
        icon: "success",
      });
      DataMapel();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Menghapus data, silakan refresh halaman!",
      });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Level</span>
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md">
          <div className="w-full flex justify-end my-4 gap-2">
            <select
              className="select select-bordered w-md select-sm"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value={""}>Semua Level</option>
              <option value={"TK"}>TK</option>
              <option value={"SD"}>SD</option>
              <option value={"SM"}>SM</option>
            </select>
            <button
              className="btn btn-ghost bg-blue-500 btn-sm text-white"
              onClick={() => openModal("add-mapel")}
            >
              <FaPlus />
              Tambah
            </button>
          </div>
          <table className="table table-zebra">
            {/* head */}
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Level</th>
                <th>Nama Pelajaran</th>
                <th>KKM</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mapel.map((item: MapelList, index: number) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.code}</td>
                  <td>{item.level}</td>
                  <td>{item.name}</td>
                  <td>{item.threshold}</td>

                  <td>
                    <div className="join">
                      <button className="btn btn-ghost btn-sm text-orange-500 text-xl">
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-red-500 text-xl"
                        onClick={() => trigerDelete(item.id)}
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

      <Modal id="add-mapel">
        <div className="w-full">
          <div className="mb-6">
            <span className="text-xl font-bold">Tambah Mapel</span>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex justify-start w-full flex-col gap-3"
          >
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Kode
              </label>

              <input
                type="text"
                placeholder="Kode"
                className={`input input-bordered w-full ${
                  formik.touched.code && formik.errors.code ? "input-error" : ""
                } `}
                name="code"
                value={formik.values.code}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              {formik.touched.code && formik.errors.code ? (
                <div className="text-red-500 text-xs">{formik.errors.code}</div>
              ) : null}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Level
              </label>

              <select
                className={`select join-item w-full select-bordered ${
                  formik.touched.level && formik.errors.level
                    ? "select-error"
                    : ""
                }`}
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option selected value={""}>
                  Level
                </option>
                <option value={"TK"}>TK</option>
                <option value={"SD"}>SD</option>
                <option value={"SM"}>SM</option>
              </select>
              {formik.touched.level && formik.errors.level ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.level}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Nama Mapel
              </label>

              <input
                type="text"
                placeholder="Nama Mapel"
                className={`input input-bordered w-full ${
                  formik.touched.name && formik.errors.name ? "input-error" : ""
                } `}
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-xs">{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                KKM
              </label>

              <input
                type="number"
                placeholder="0"
                className={`input input-bordered w-full ${
                  formik.touched.threshold && formik.errors.threshold
                    ? "input-error"
                    : ""
                } `}
                name="threshold"
                value={formik.values.threshold}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              {formik.touched.threshold && formik.errors.threshold ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.threshold}
                </div>
              ) : null}
            </div>
            <div className="w-full mt-5">
              <button
                className="w-full btn btn-ghost bg-green-500 text-white"
                onClick={handleCreate}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default MapelPage;

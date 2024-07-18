
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const KelasPage = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Daftar Kelas</span>
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md">
          <div className="w-full flex justify-end my-4 gap-2">
            <select className="select select-bordered w-md select-sm">
              <option>Tahun Pelajaran</option>
              <option>2023/2024</option>
              <option>2024/2025</option>
            </select>
            <button className="btn btn-ghost bg-blue-500 btn-sm text-white">
              <FaPlus />
              Tambah
            </button>
          </div>
          <table className="table table-zebra">
            {/* head */}
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Nama Kelas</th>
                <th>Wali Kelas</th>
                <th>Tahun</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>bahasa indonesia</td>
                <td>aji pangestu</td>
                <td>2023/2024</td>
                <td>
                  <div className="join">
                    <button className="btn btn-ghost btn-sm text-orange-500 text-xl">
                      <FaPencil />
                    </button>
                    <button className="btn btn-ghost btn-sm text-red-500 text-xl">
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default KelasPage;

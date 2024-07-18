
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";

const SettingPage = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Pengaturan Tahun Pelajaran</span>
        <div className="overflow-x-auto w-full mt-5 bg-white p-4 rounded-md shadow-md">
            <div className="w-full flex justify-end my-4">

        <button className="btn btn-ghost bg-blue-500 btn-sm text-white"><FaPlus />Tambah</button>
            </div>
          <table className="table table-zebra">
            {/* head */}
            <thead className="bg-blue-300">
              <tr>
                <th>No</th>
                <th>Tahun Pelajaran</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>2023/2024</td>
                <td><span className="badge badge-accent badge-outline">Aktif</span></td>
                <td>
                    <div className="join">
                        <button className="btn btn-ghost btn-sm text-red-500 text-xl"><FaRegTrashAlt /></button>

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

export default SettingPage;

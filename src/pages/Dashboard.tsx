import { LoginStore } from "../store/Store";
import { useNavigate } from "react-router-dom";
import { GuruKaryawan, User, Siswa } from "../middleware/Api";
import { UserList, SiswaList } from "../middleware/utils";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { token } = LoginStore();
  const navigate = useNavigate();
  const [listUser, setListUser] = useState<UserList[]>([]);
  const [listGukar, setListGukar] = useState<any[]>([]);
  const [listSiswa, setListSiswa] = useState<SiswaList[]>([]);

  useEffect(() => {
    DataUser();
  }, []);

  const DataUser = async () => {
    try {
      const responseUser = await User.GetAllDataUser(token, 0, "", 1000000);
      setListUser(responseUser.data.data.result);
      const responseGukar = await GuruKaryawan.GetAllGuruKaryawan(
        token,
        0,
        100000,
        "",
        "Y"
      );
      setListGukar(responseGukar.data.data.result);
      const responseSiswa = await Siswa.GetAllDataSiswa(token, 0, 100000, "");
      setListSiswa(responseSiswa.data.data.result);
    } catch {
      console.error("error");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white p-4 shadow-md rounded-lg mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button className="btn btn-outline btn-white btn-sm">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Selamat Datang Admin!!</h2>
        <p className="text-gray-700 mb-8">
          Kelola data dan informasi sekolah dengan mudah dan efisien.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-100 shadow-lg hover:bg-blue-200 transition ease-in-out duration-300">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2">Total User</h3>
              <p className="text-3xl font-bold text-blue-800">
                {listUser.length}
              </p>
            </div>
          </div>
          <div className="card bg-green-100 shadow-lg hover:bg-green-200 transition ease-in-out duration-300">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2">
                Total Guru dan Karyawan
              </h3>
              <p className="text-3xl font-bold text-green-800">
                {listGukar.length}
              </p>
            </div>
          </div>
          <div className="card bg-yellow-100 shadow-lg hover:bg-yellow-200 transition ease-in-out duration-300">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2">Total Siswa</h3>
              <p className="text-3xl font-bold text-yellow-800">
                {listSiswa.length}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="card bg-blue-200 shadow-lg hover:bg-blue-300 transition ease-in-out duration-300 cursor-pointer"
            onClick={() => navigate("/guru/daftar-user")}
          >
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold mb-2">Tambah User</h3>
              <button className="btn btn-primary">Tambah</button>
            </div>
          </div>
          <div
            className="card bg-green-200 shadow-lg hover:bg-green-300 transition ease-in-out duration-300 cursor-pointer"
            onClick={() => navigate("/guru-karyawan")}
          >
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold mb-2">Tambah Gukar</h3>
              <button className="btn btn-primary">Tambah</button>
            </div>
          </div>
          <div
            className="card bg-yellow-200 shadow-lg hover:bg-yellow-300 transition ease-in-out duration-300 cursor-pointer"
            onClick={() => navigate("/data-siswa")}
          >
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold mb-2">Tambah Siswa</h3>
              <button className="btn btn-primary">Tambah</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { LoginStore } from "../store/Store";
import { useNavigate } from "react-router-dom";
import { GuruKaryawan, User, Siswa } from "../middleware/Api";
import { UserList, SiswaList } from "../middleware/utils";
import { useEffect, useState } from "react";
import axios from 'axios';

const Dashboard = () => {
  const [totalLocations, setTotalLocations] = useState(0);
  const { token } = LoginStore();
  const navigate = useNavigate();
  const [listUser, setListUser] = useState<UserList[]>([]);
  const [listGukar, setListGukar] = useState<any[]>([]);
  const [listSiswa, setListSiswa] = useState<SiswaList[]>([]);

  useEffect(() => {
    DataUser();
    fetchLocations();
  }, []);

  const instance = axios.create({ baseURL: import.meta.env.VITE_REACT_BASE_API_URL_HRD });

  const Location = {
    fetchLocations: (token: string | null) =>
      instance({
        method: "GET",
        url: "location/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  };

  const fetchLocations = async () => {
    try {
      const response = await Location.fetchLocations(token);
      if (response.data.status && response.data.code === 200) {
        setTotalLocations(response.data.data.result.length);
      } else {
        throw new Error(response.data.message || "Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };


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
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center p-8">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white p-5 shadow-md rounded-lg mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold mb-4">Selamat Datang Admin!</h2>
        <p className="text-gray-700 mb-6">
          Kelola data dan informasi sekolah dengan mudah dan efisien.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl2:grid-cols-4 gap-5 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition ease-in-out duration-300 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Total User</h3>
              <p className="text-4xl font-bold">{listUser.length}</p>
            </div>
            <div className="p-4 bg-blue-800 rounded-full">
              <svg
                className="w-12 h-12 text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M3 6h18M3 14h18m-9 8v-8"
                />
              </svg>
            </div>
          </div>
          <div className="bg-green-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition ease-in-out duration-300 p-6 flex items-center justify-between gap-2">
            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold mb-1">
                Total Guru dan Karyawan
              </h3>
              <p className="text-4xl font-bold">{listGukar.length}</p>
            </div>
            <div className="p-4 bg-green-800 rounded-full">
              <svg
                className="w-12 h-12 text-green-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
                />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition ease-in-out duration-300 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Total Siswa</h3>
              <p className="text-4xl font-bold">{listSiswa.length}</p>
            </div>
            <div className="p-4 bg-yellow-800 rounded-full">
              <svg
                className="w-12 h-12 text-yellow-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
                />
              </svg>
            </div>
          </div>
          <div className="bg-red-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition ease-in-out duration-300 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Total Lokasi Presensi</h3>
              <p className="text-4xl font-bold">{totalLocations}</p>
            </div>
            <div className="p-4 bg-orange-800 rounded-full">
              <svg
                className="w-12 h-12 text-orange-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl2:grid-cols-4 gap-5">
          <div
            className="bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition ease-in-out duration-300 cursor-pointer p-6 flex flex-col items-center text-center"
            onClick={() => navigate("/guru/daftar-user")}
          >
            <svg
              className="w-16 h-16 mb-4 text-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M3 6h18M3 14h18m-9 8v-8"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Tambah User</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah
            </button>
          </div>
          <div
            className="bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition ease-in-out duration-300 cursor-pointer p-6 flex flex-col items-center text-center"
            onClick={() => navigate("/guru-karyawan")}
          >
            <svg
              className="w-16 h-16 mb-4 text-green-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">
              Tambah Guru dan Karyawan
            </h3>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Tambah
            </button>
          </div>
          <div
            className="bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition ease-in-out duration-300 cursor-pointer p-6 flex flex-col items-center text-center"
            onClick={() => navigate("/data-siswa")}
          >
            <svg
              className="w-16 h-16 mb-4 text-yellow-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Tambah Siswa</h3>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
              Tambah
            </button>
          </div>
          <div
            className="bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition ease-in-out duration-300 cursor-pointer p-6 flex flex-col items-center text-center"
            onClick={() => navigate("/lokasi-Absen")}
          >
            <svg
              className="w-16 h-16 mb-4 text-red-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7v-7m0-4V7m0 4l-3-3m6 3l3-3"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Tambah Lokasi</h3>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Tambah
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

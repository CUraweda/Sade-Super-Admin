import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loading from "../component/Loading";
import Layout from "../component/Layout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import RoleAkses from "../pages/RoleAkses.tsx";
import HistorySiswa from "../pages/HistorySIswa.tsx";
import PenautanSiswa from "../pages/PenautanSiswa.tsx";
import RaporSiswa from "../pages/RaporSiswa.tsx";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const LokasiAbsen = lazy(() => import("../pages/LokasiAbsen.tsx"));
const Login = lazy(() => import("../pages/Login"));
const SettingPage = lazy(() => import("../pages/SettingPage"));
const MapelPage = lazy(() => import("../pages/MapelPage"));
const KelasPage = lazy(() => import("../pages/KelasPage"));
const DataSiswa = lazy(() => import("../pages/DataSiswa"));
const DaftarGukar = lazy(() => import("../pages/DaftarGukar"));
const WaliSiswa = lazy(() => import("../pages/WaliKelas"));
const MataPelajaran = lazy(() => import("../pages/MataPelajaran"));
const DaftarUser = lazy(() => import("../pages/DaftarUser"));
const DaftarKepsek = lazy(() => import("../pages/DaftarKepsek.tsx"));
const MataPelajaranExtra = lazy(() => import("../pages/MataPelajaranExtra"));
const CustomerCarePage = lazy(() => import("../pages/CustomerCare.tsx"));
const DataOrangTuaPage = lazy(() => import("../pages/DataOrtu.tsx"));

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/lokasi-absen"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <LokasiAbsen />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <SettingPage />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/mapel"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <MapelPage />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/kelas"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <KelasPage />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/data-siswa"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <DataSiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/guru/daftar-user"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <DaftarUser />
                  </Layout>
                </Suspense>
              }
            />
          }
        />

        <Route
          path="/guru/role-akses"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <RoleAkses />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/guru-karyawan"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <DaftarGukar />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/guru/wali-kelas"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <WaliSiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/guru/mata-pelajaran"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <MataPelajaran />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/history-siswa"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <HistorySiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/data-ortu"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <DataOrangTuaPage />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/hub-ortu"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <PenautanSiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/kepala-sekolah"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <DaftarKepsek />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/guru/mata-pelajaran-extra"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <MataPelajaranExtra />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/cs-admin"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <CustomerCarePage />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/siswa/akun-siswa"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <PenautanSiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/siswa/rapor-siswa"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loading />}>
                  <Layout>
                    <RaporSiswa />
                  </Layout>
                </Suspense>
              }
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

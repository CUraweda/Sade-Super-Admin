import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../component/Loading";
import Layout from "../component/Layout";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const SettingPage = lazy(() => import("../pages/SettingPage"));
const MapelPage = lazy(() => import("../pages/MapelPage"));
const KelasPage = lazy(() => import("../pages/KelasPage"));
const DataSiswa = lazy(() => import("../pages/DataSiswa"));
const DaftarUser = lazy(() => import("../pages/DaftarUser"));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Dashboard />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/setting"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <SettingPage />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/mapel"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <MapelPage />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/kelas"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <KelasPage />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/daftar-user"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <DaftarUser />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/data-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <DataSiswa />
              </Layout>
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

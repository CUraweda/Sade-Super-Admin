import axios, { AxiosPromise } from "axios";
import {
  LoginResponse,
  MapelList,
  MapelResponse,
  SiswaResponse,
  UserResponse,
  KepsekResponse,
  DropdownEmployeeResponse,
} from "./utils";
const instance = axios.create({ baseURL: import.meta.env.VITE_REACT_API_URL });

const Auth = {
  Login: (
    email: string | null,
    password: string | null
  ): AxiosPromise<LoginResponse> =>
    instance({
      method: "POST",
      url: "/api/auth/login",
      data: {
        email,
        password,
      },
    }),
};

const Siswa = {
  GetAllDataSiswa: (
    token: string | null,
    page: number,
    limit: number,
    search: string
  ): AxiosPromise<SiswaResponse> =>
    instance({
      method: "GET",
      url: `/api/student?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateSiswa: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/student/create`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  UpdateSiswa: (
    token: string | null,
    data: any,
    id: number
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  DeleteSiswa: (token: string | null, id: number): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/student/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Mapel = {
  GetAllDataMapel: (
    token: string | null,
    page: number,
    limit: number
  ): AxiosPromise<MapelResponse> =>
    instance({
      method: "GET",
      url: `/api/subject?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  CreateMapel: (token: string | null, data: MapelList): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/subject/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  EditMapel: (token: string | null, data: any, id: number): AxiosPromise<any> =>
    instance({
      method: "PUT",
      data,
      url: `/api/subject/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  DeleteMapel: (
    token: string | null,

    id: string | number | undefined
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/subject/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const GuruKaryawan = {
  GetAllGuruKaryawan: (
    token: string | null,
    page: number | string,
    limit: number,
    searchquery: string,
    status: string
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/employee?isAssign=${status}&search_query=${searchquery}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
        page: page,
      },
    }),

  CreateGuruKaryawan: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/employee/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  UpdateGuruKaryawan: (
    token: string | null,
    data: any,
    id: string | number
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/employee/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteGuruKaryawan: (
    token: string | null,
    id: string | number
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/employee/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  SearchUser: (token: string | null, name: string): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/user?search_query=${name}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  TautanAkun: (
    token: string | null,
    id: string | number,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/employee/attach/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { user_id: data },
    }),
};

const User = {
  GetAllDataUser: (
    token: string | null,
    page: number,
    search: string,
    limit: number
  ): AxiosPromise<UserResponse> =>
    instance({
      method: "GET",
      url: `/api/user?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateUser: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/auth/register`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  EditUser: (token: string | null, data: any, id: number): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/user/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  DeleteUser: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/user/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetDataRole: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/role`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const KepalaSekolah = {
  GetDataKepsek: (
    token: string | null,
    page: number,
    limit: number
  ): AxiosPromise<KepsekResponse> =>
    instance({
      method: "GET",
      url: `/api/headmaster?page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateKepsek: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/headmaster/create`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  EditKepsek: (
    token: string | null,
    data: any,
    id: number
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/headmaster/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  DeleteKepsek: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/headmaster/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetDataDropdownEmployee: (
    token: string | null
  ): AxiosPromise<DropdownEmployeeResponse> =>
    instance({
      method: "GET",
      url: `/api/employee?limit=100000`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Wali = {
  GetAllWaliKelas: (
    token: string | null,
    querysearch: string,
    is_active: boolean,
    academic_year: string | number,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/form-teacher`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        is_active: is_active,
        academic_year: academic_year,
        limit: limit,
        page: page,
      },
    }),
  CreateWaliKelas: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/form-teacher/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteWaliKelas: (
    token: string | null,
    id: string | number
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/form-teacher/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateWaliKelas: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/form-teacher/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  GetAllKelas: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/classes?is_active=Y`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const Pelajaran = {
  GetAllGuruMataPelajaran: (
    token: string | null,
    status: string,
    querysearch: string,
    academic_year: string | number,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/form-subject`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        is_active: status,
        search_query: querysearch,
        academic_year: academic_year,
        limit: limit,
        page: page,
      },
    }),
  CreateGuruMataPelajaran: (
    token: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/form-subject/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  UpdateGuruMataPelajaran: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/form-subject/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteGuruMataPelajaran: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/form-subject/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllSubject: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/subject?with_assign=Y`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const Extra = {
  GetMapelExtra: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/subject-extra`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  CreateMapelExtra: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/subject-extra/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  UpdateMapelExtra: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/subject-extra/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteMapelExtra: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/subject-extra/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const GuruMapelExtra = {
  GetGuruExtra: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/form-extra`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  CreateGuruExtra: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/form-extra/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  UpdateGuruExtra: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/form-extra/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteGuruExtra: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/form-extra/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
export {
  Auth,
  Siswa,
  Mapel,
  GuruKaryawan,
  Wali,
  Pelajaran,
  Extra,
  GuruMapelExtra,
  User,
  KepalaSekolah,
};

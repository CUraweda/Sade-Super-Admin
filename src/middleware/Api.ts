import axios, { AxiosPromise } from "axios";
import {
  LoginResponse,
  MapelList,
  MapelResponse,
  SiswaResponse,
  UserResponse,
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
    limit: number
  ): AxiosPromise<SiswaResponse> =>
    instance({
      method: "GET",
      url: `/api/student?search_query=&page=${page}&limit=${limit}`,
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
    page: number,
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
export { Auth, Siswa, Mapel, GuruKaryawan, User };

import axios, { AxiosPromise } from "axios";
import {
  LoginResponse,
  MapelList,
  MapelResponse,
  SiswaResponse,
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
  DeleteMapel: (token: string | null, id: string |number |undefined): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/subject/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    }),
};
export { Auth, Siswa, Mapel };

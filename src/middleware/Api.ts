import axios, { AxiosPromise } from "axios";
import { LoginResponse, SiswaResponse } from "./utils";
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
}

export { Auth ,Siswa};

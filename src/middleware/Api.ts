import axios, { AxiosPromise } from 'axios';
import {
  LoginResponse,
  MapelList,
  MapelResponse,
  SiswaResponse,
  UserResponse,
  KepsekResponse,
  DropdownEmployeeResponse,
} from './utils';
const instance = axios.create({ baseURL: import.meta.env.VITE_REACT_API_URL });

const Auth = {
  Login: (
    email: string | null,
    password: string | null
  ): AxiosPromise<LoginResponse> =>
    instance({
      method: 'POST',
      url: '/auth/login',
      data: {
        email,
        password,
      },
    }),
};

const OrangTua = {
  GetAllDataOrtu: (
    token: string | null,
    page: number,
    limit: number,
    search: string
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/parent?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateOrtu: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/parent/create`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  UpdateOrtu: (
    token: string | null,
    data: any,
    id: number
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/parent/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  DeleteOrtu: (token: string | null, id: number): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/parent/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
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
      method: 'GET',
      url: `/student?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateSiswa: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/student/create`,
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
      method: 'PUT',
      url: `/student/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  DeleteSiswa: (token: string | null, id: number): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/student/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  import: (token: string | null, data: any) =>
    instance({
      method: 'POST',
      data,
      url: `/student/import`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  export: (token: string | null, search: string) =>
    instance({
      method: 'GET',
      url: `/student/export`,
      params: { search_query: search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }),
};

const Mapel = {
  GetAllDataMapel: (
    token: string | null,
    page: number,
    limit: number
  ): AxiosPromise<MapelResponse> =>
    instance({
      method: 'GET',
      url: `/subject?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  CreateMapel: (token: string | null, data: MapelList): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/subject/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  EditMapel: (token: string | null, data: any, id: number): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      data,
      url: `/subject/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  DeleteMapel: (
    token: string | null,

    id: string | number | undefined
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/subject/delete/${id}`,
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
      method: 'GET',
      url: `/employee?isAssign=${status}&search_query=${searchquery}`,
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
      method: 'POST',
      url: `/employee/create`,
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
      method: 'PUT',
      url: `/employee/update/${id}`,
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
      method: 'DELETE',
      url: `/employee/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  SearchUser: (token: string | null, name: string): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user?search_query=${name}`,
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
      method: 'PUT',
      url: `/employee/attach/${id}`,
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
      method: 'GET',
      url: `/user?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateUser: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/auth/register`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ForgotPassword: (email: string): AxiosPromise<any> =>
    instance({
      method: 'POST',
      data: {
        email,
      },
      url: `/auth/forgot-password`,
    }),
  ResetPassword: (data: any, token: string | null): AxiosPromise<any> =>
    instance({
      method: 'POST',
      data,
      url: `/auth/admin-reset-pass`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  EditUser: (token: string | null, data: any, id: number): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/user/update/${id}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }),

  DeleteUser: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/user/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetDataRole: (token: string | null): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/role?page=0&limit=100000`,
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
      method: 'GET',
      url: `/headmaster?page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreateKepsek: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/headmaster/create`,
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
      method: 'PUT',
      url: `/headmaster/update/${id}`,
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
      method: 'DELETE',
      url: `/headmaster/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetDataDropdownEmployee: (
    token: string | null
  ): AxiosPromise<DropdownEmployeeResponse> =>
    instance({
      method: 'GET',
      url: `/employee?limit=100000`,
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
      method: 'GET',
      url: `/form-teacher`,
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
      method: 'POST',
      url: `/form-teacher/create`,
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
      method: 'DELETE',
      url: `/form-teacher/delete/${id}`,
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
      method: 'PUT',
      url: `/form-teacher/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  GetAllKelas: (token: string | null, limit: any): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/classes?is_active=Y`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
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
      method: 'GET',
      url: `/form-subject`,
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
      method: 'POST',
      url: `/form-subject/create`,
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
      method: 'PUT',
      url: `/form-subject/update/${id}`,
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
      method: 'DELETE',
      url: `/form-subject/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllSubject: (token: string | null): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/subject?with_assign=Y`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 10000,
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
      method: 'GET',
      url: `/subject-extra`,
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
      method: 'POST',
      url: `/subject-extra/create`,
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
      method: 'PUT',
      url: `/subject-extra/update/${id}`,
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
      method: 'DELETE',
      url: `/subject-extra/delete/${id}`,
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
      method: 'GET',
      url: `/form-extra`,
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
      method: 'POST',
      url: `/form-extra/create`,
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
      method: 'PUT',
      url: `/form-extra/update/${id}`,
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
      method: 'DELETE',
      url: `/form-extra/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const CustomerCare = {
  getUserChats: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user-chat/show-by-user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createUserChats: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/customer-care/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  getDataChat: (token: string | null, limit: number): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
      },
    }),
  getMessages: (
    token: string | null,
    id: string | null,
    idUser: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user-chat/show-conversation?userid=${id}&withid=${idUser}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  sendMessage: (
    token: string | null,
    currentReceiverId: number | string,
    inputMessage: any,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/message/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_id: id,
        with_id: currentReceiverId,
        message: inputMessage,
      },
    }),
};

const Settings = {
  getSettings: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/academic-year`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  updateSettings: (
    token: string | null,
    id: number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/academic-year/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createSettings: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/academic-year/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteSettings: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/academic-year/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Kelas = {
  getAllClasses: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/classes`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
        is_active: false,
      },
    }),
  createClasses: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/classes/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editClasses: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/classes/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteClasses: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/classes/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const HistoryStudent = {
  getHistory: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/student-class`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  createHistory: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/student-class/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editHistory: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/student-class/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteHistory: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/student-class/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const Student = {
  getAllStudent: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/student`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  createStudent: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/student/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editStudent: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/student/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteStudent: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/student/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const AksesSiswa = {
  getAksesSiswa: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number,
    level: string
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user-access?level=${level}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
  createAksesSiswa: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: 'POST',
      url: `/user-access/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editAksesSiswa: (
    token: string | null,
    id: number | string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: 'PUT',
      url: `/user-access/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteAksesSiswa: (
    token: string | null,
    id: number | string
  ): AxiosPromise<any> =>
    instance({
      method: 'DELETE',
      url: `/user-access/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllUser: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: 'GET',
      url: `/user`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
};

const RaporSiswaApi = {
  showAll: (
    token: string | null,
    search: string = '',
    page: number = 1,
    limit: number = 20,
    classId: string = '',
    semester: string = '',
    academic: string = '',
    withAssign: string = 'N'
  ) =>
    instance({
      method: 'GET',
      url: `/student-report`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: search,
        page,
        limit,
        class_id: classId,
        semester,
        academic,
        with_assign: withAssign,
      },
    }),
  download: (token: string | null, path: string = '') =>
    instance({
      method: 'GET',
      url: `/student-task/download`,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        filepath: path,
      },
    }),
  merge: (token: string | null, id: string) =>
    instance({
      method: 'PUT',
      url: `/student-report/merge/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAllNumberReports: (
    token: string | null,
    search: string = '',
    page: number = 1,
    limit: number = 20,
    classId: string = '',
    semester: string = '',
    academic: string = '',
    reportId: string = '',
    subjectId: string = ''
  ) =>
    instance({
      method: 'GET',
      url: `/number-report`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: search,
        page,
        limit,
        class_id: classId,
        semester,
        academic,
        report_id: reportId,
        subject_id: subjectId,
      },
    }),
  showNarrativeReportsByStudentClass: (
    token: string | null,
    id: string,
    academic: string = '',
    semester: string = ''
  ) =>
    instance({
      method: 'GET',
      url: `/narrative-report/show-by-student/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { academic, semester },
    }),
  showNarrativeCommentsByReport: (token: string | null, id: string) =>
    instance({
      method: 'GET',
      url: `/narrative-comment/show-by-student-report/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showPortofolioReportsByReport: (token: string | null, id: string) =>
    instance({
      method: 'GET',
      url: `/portofolio-report/show-all-by-student-report/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  generateNumberReport: (
    token: string | null,
    id: string,
    academic: string = '',
    semester: string = '',
    date: string = ''
  ) =>
    instance({
      method: 'GET',
      url: `/number-report/generate/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { semester, academic, date },
    }),
  generateNarrativeReport: (
    token: string | null,
    id: string,
    academic: string = '',
    semester: string = '',
    reportId: string = ''
  ) =>
    instance({
      method: 'GET',
      url: `/narrative-report/generate/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { semester, academic, report_id: reportId },
    }),
};

export {
  HistoryStudent,
  CustomerCare,
  Auth,
  OrangTua,
  Siswa,
  Mapel,
  GuruKaryawan,
  Wali,
  Pelajaran,
  Extra,
  GuruMapelExtra,
  User,
  Kelas,
  KepalaSekolah,
  Settings,
  Student,
  AksesSiswa,
  RaporSiswaApi,
};

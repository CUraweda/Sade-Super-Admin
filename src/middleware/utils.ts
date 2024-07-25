export interface LoginResponse {
  data: {
    token: string;
    role_id: number;
  };
  tokens: {
    access: {
      token: string;
    };
  };
}

export interface EmployeeDetail {
  id: number;
  full_name: string;
}

export interface UserSearchData {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
  password: string;
  status: number;
  email_verified: number;
  address: string | null;
  phone_number: string | null;
  avatar: string | null;
  reset_token: string | null;
  reset_token_exp: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface Employee {
  id: number;
  user_id: number | null;
  employee_no: string | null;
  full_name: string;
  gender: string;
  pob: string;
  dob: string;
  marital_status: string;
  last_education: string;
  certificate_year: number | null;
  is_education: string;
  major: string | null;
  employee_status: string;
  work_start_date: string;
  occupation: string;
  is_teacher: string;
  duty: string | null;
  job_desc: string | null;
  grade: string | null;
  createdAt: string;
  updatedAt: string;
  religion: string;
  email: string;
}
export interface SiswaList {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  nickname: string;
  gender: string;
  pob: string;
  dob: string;
  nationality: string;
  religion: string;
  address: string;
  category: string;
}

export interface SiswaResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: SiswaList[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
}

export interface MapelResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: MapelList[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
}

export interface MapelList {
  id?: string | number;
  code: string;
  level: string;
  name: string;
  threshold: string | number;
}

export interface GukarResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: SiswaList[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
}

export interface CreateFormValues {
  employee_no: string;
  full_name: string;
  gender: string;
  pob: string;
  dob: string;
  religion: string;
  marital_status: string;
  last_education: string;
  certificate_year: string;
  is_education: string;
  major: string;
  employee_status: string;
  work_start_date: string;
  occupation: string;
  is_teacher: string;
  duty: string;
  job_desc: string;
  grade: string;
  email: string;
  [key: string]: string; // Index signature
}

export interface UserResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: UserList[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
}

export interface UserList {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
  password: string;
  status: number;
  email_verified: number;
  address: string;
  phone_number: string;
  avatar: string;
  reset_token: string;
  reset_token_exp: string;
  createdAt: string;
  updatedAt: string;
}

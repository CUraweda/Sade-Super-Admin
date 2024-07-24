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

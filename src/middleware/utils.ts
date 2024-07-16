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

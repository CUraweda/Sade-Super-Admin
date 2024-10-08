export interface LoginResponse {
  data: {
    token: string;
    role_id: number;
    id: any;
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
  is_active: string;
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
  threshold: number;
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

export interface Class {
  id: number;
  level: string;
  class_name: string;
  book_target: number;
  waste_target: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaKel {
  id: number;
  class_id: number;
  employee_id: number;
  academic_year: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  class: Class;
}

export interface WaKelResponse {
  code: number;
  data: {
    result: WaKel[];
    limit: number;
    page: number;
    totalPage: number;
    totalRows: number;
  };
  message: string;
  status: boolean;
}

export interface WaKelDetail {
  id: number;
  employee: {
    full_name: string;
  };
}

export interface EditFormValuesWalikelas {
  employee_id: string;
  class_id: string;
  academic_year: string;
  is_active: string;
}

export interface ClassData {
  id: number;
  level: string;
  class_name: string;
  book_target: number;
  waste_target: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: number;
  level: string;
  code: string;
  name: string;
  threshold: number;
}

export interface FormSubjectResult {
  id: number;
  subject_id: number;
  employee_id: number;
  academic_year: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  subject: Subject;
}

export interface FormSubjectData {
  result: FormSubjectResult[];
  page: number;
  limit: number;
  totalRows: number;
  totalPage: number;
}

export interface EditFormValuesPelajaran {
  employee_id: string;
  subject_id: string;
  academic_year: string;
  is_active: string;
}
export interface ExtracurricularActivity {
  id: number;
  name: string;
}

export interface Data {
  result: ExtracurricularActivity[];
}

export interface EditFormValuesExtra {
  name: string;
}

export interface SubjectExtra {
  id: number;
  name: string;
}

// Interface untuk entitas dalam array "result"
export interface FormExtra {
  id: number;
  subject_extra_id: number;
  employee_id: number;
  academic_year: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  subjectextra: SubjectExtra;
}

export interface EditSubjectExtra {
  employee_id: string;
  subject_extra_id: string;
  academic_year: string;
  is_active: boolean;
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

export interface KepsekResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: KepsekList[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
}

export interface KepsekList {
  id: number;
  employee_id: number;
  category: string;
  start_academic_year: string;
  end_academic_year: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: number;
    user_id: number;
    employee_no: number;
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
    createdAt: string;
    updatedAt: string;
  };
}

export interface DropdownEmployeeResponse {
  status: string;
  code: number;
  message: string;
  data: {
    result: DropdownEmployeeList[];
  };
}

export interface DropdownEmployeeList {
  id: number;
  user_id: number;
  employee_no: number;
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
  createdAt: string;
  updatedAt: string;
  user: string;
}

export interface User {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
}

export interface UserSummary {
  id: number;
  full_name: string;
}

export interface Chat {
  id: number;
  user_id: number;
  with_id: number;
  unique_id: string;
  idUser: UserSummary;
  withUser: UserSummary;
}

export interface ResultSettings {
  id: number;
  start: string;
  end: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataResponseSettings {
  result: ResultSettings[];
}

export interface EditSettings {
  start: string;
  end: string;
  name: string;
  status: string;
}

export interface EditSettings {
  start: string;
  end: string;
  name: string;
  status: string;
}

export interface EditClass {
  level: string;
  class_name: string;
  book_target: string;
  waste_target: string;
  is_active: string;
}

export interface FormClass {
  id: number;
  level: string;
  class_name: string;
  book_target: number;
  waste_target: number;
  is_active: boolean;
}

export interface Student {
  id: number;
  nis: string;
  nisn: string | null;
  full_name: string;
  nickname: string;
  gender: string;
  pob: string;
  dob: string;
  nationality: string;
  religion: string;
  address: string;
  level: string;
  class: string;
  is_active: string;
  is_transfer: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: number;
  level: string;
  class_name: string;
  book_target: number;
  waste_target: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResultItemStudent {
  id: number;
  academic_year: string;
  student_id: number;
  class_id: number;
  is_active: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  class: Class;
}

export interface EditFormValuesStudent {
  student_id: string;
  class_id: string;
  start_year: string;
  end_year: string;
  is_active: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
  role: Role;
}

export interface ResultItemAksesSiswa {
  id: number;
  user_id: number;
  student_id: number;
  createdAt: string;
  updatedAt: string;
  student: Student;
  user: User;
}

export interface EditFormValuesAksesSiswa {
  user_id: string;
  student_id: string;
}

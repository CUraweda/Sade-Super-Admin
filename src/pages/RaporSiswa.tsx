import { useEffect, useState } from 'react';
import { RaporSiswaApi } from '../middleware/Api';
import { LoginStore } from '../store/Store';
import { IpageMeta, PaginationControl } from '../component/PaginationControl';
import Swal from 'sweetalert2';
import { FaCodeMerge, FaFilePdf } from 'react-icons/fa6';
import ClassPicker from '../component/pickers/ClassPicker';
import AcademicYearPicker from '../component/pickers/AcademicYearPicker';
import SearchBar from '../component/SearchBar';

const RaporSiswa = () => {
  const { token } = LoginStore();

  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: '',
    classId: '',
    semester: '',
    academic: '',
  });

  const handleFilter = <K extends keyof typeof filter>(
    key: K,
    value: (typeof filter)[K]
  ) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key !== 'page') obj.page = 0;
    setFilter(obj);
  };

  const getReports = async () => {
    try {
      const response = await RaporSiswaApi.showAll(
        token,
        filter.search,
        filter.page,
        filter.limit,
        filter.classId,
        filter.semester,
        filter.academic
      );
      const { result, ...meta } = response.data.data;
      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengambil data rapor siswa',
      });
    }
  };

  const downloadReport = async (path: string) => {
    try {
      const response = await RaporSiswaApi.download(token, path);
      const urlParts = path.split('/');
      const fileName = urlParts.pop() || '';
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengunduh rapor',
      });
    }
  };

  const mergeReport = async (id: string) => {
    try {
      await RaporSiswaApi.merge(token, id);
      getReports();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Berhasil menggabungkan rapor',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menggabungkan rapor',
      });
    }
  };

  useEffect(() => {
    getReports();
  }, [filter]);

  return (
    <>
      <div className="w-full flex flex-col items-center p-5">
        <span className="text-xl font-bold">Rapor Siswa</span>

        <div className="w-full mt-5 bg-white p-4 rounded-xl">
          <div className="w-full flex my-4 gap-2 items-center">
            <AcademicYearPicker
              value={filter.academic}
              onChange={(v) => handleFilter('academic', v)}
            />
            <select
              className="select select-bordered select-sm"
              value={filter.semester}
              onChange={(e) => handleFilter('semester', e.target.value)}
            >
              <option value={''} selected>
                Semester
              </option>
              <option value={1}>Ganjil</option>
              <option value={2}>Genap</option>
            </select>
            <ClassPicker
              value={filter.classId}
              onChange={(v) => handleFilter('classId', v)}
            />
            <SearchBar onEnter={(v) => handleFilter('search', v)} />
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-[100%] ">
              <thead className="bg-blue-300">
                <tr>
                  <th>No</th>
                  <th>Nama Siswa</th>
                  <th>Semester</th>
                  <th>Rapot Angka</th>
                  <th>Rapot Narasi</th>
                  <th>Raport Portofolio</th>
                  <th>Raport Siswa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataList?.map((item, i: number) => (
                  <tr key={i}>
                    <th>{filter.page * filter.limit + i + 1}</th>
                    <td>{item?.studentclass.student.full_name}</td>
                    <td>{item?.semester == 1 ? 'Ganjil' : 'Genap'}</td>
                    <td>
                      <button
                        className={`btn btn-sm btn-square bg-green-500 text-white ${
                          !item?.number_path ? 'btn-disabled' : ''
                        }`}
                        data-tip="Download Rapor Angka"
                        onClick={() => downloadReport(item?.number_path)}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm btn-square bg-green-500 text-white ${
                          !item?.narrative_path ? 'btn-disabled' : ''
                        }`}
                        disabled={!item?.narrative_path}
                        data-tip="Download Rapor Narasi"
                        onClick={() => downloadReport(item?.narrative_path)}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm btn-square bg-green-500 text-white ${
                          !item?.portofolio_path ? 'btn-disabled' : ''
                        }`}
                        data-tip="Download Rapor Portofolio"
                        onClick={() => downloadReport(item?.portofolio_path)}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    </td>

                    <td>
                      <button
                        className={`btn btn-sm btn-square bg-green-500 text-white ${
                          !item?.merged_path ? 'btn-disabled' : ''
                        }`}
                        data-tip="Download Rapor Siswa"
                        onClick={() => downloadReport(item?.merged_path)}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    </td>
                    <td className="flex items-center justify-between">
                      <button
                        className={`btn btn-sm btn-square bg-orange-500 text-white ${
                          !item?.number_path ||
                          !item?.narrative_path ||
                          !item?.portofolio_path
                            ? 'btn-disabled'
                            : ''
                        }`}
                        onClick={() => mergeReport(item?.id)}
                      >
                        <FaCodeMerge size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter('page', pageMeta.page - 1)}
            onNextClick={() => handleFilter('page', pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter('page', val)}
            onLimitChange={(val) => handleFilter('limit', val)}
          />
        </div>
      </div>
    </>
  );
};
export default RaporSiswa;

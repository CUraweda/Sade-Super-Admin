import { useEffect, useState } from 'react';
import { RaporSiswaApi } from '../middleware/Api';
import { LoginStore } from '../store/Store';
import { IpageMeta, PaginationControl } from '../component/PaginationControl';
import Swal from 'sweetalert2';
import { FaCodeMerge, FaFilePdf, FaGear } from 'react-icons/fa6';
import ClassPicker from '../component/pickers/ClassPicker';
import AcademicYearPicker from '../component/pickers/AcademicYearPicker';
import SearchBar from '../component/SearchBar';
import Modal, { closeModal, openModal } from '../component/ModalProps';
import { FaCheck } from 'react-icons/fa';
import TruncateText from '../component/TruncateText';

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

  const downloadReport = async (path: string, htmlId?: string) => {
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
        target: htmlId ? document.getElementById(htmlId) : undefined,
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

  // detail report
  const [data, setData] = useState<any>(null),
    [numberReports, setNumberReports] = useState<any[]>([]),
    [narrativeReports, setNarrativeReports] = useState<any>(null),
    [narrativeComments, setNarrativeComments] = useState<any[]>([]),
    [portofolioReports, setPortofolioReports] = useState<any[]>([]);

  const [narrativeCatId, setNarrativeCatId] = useState('');

  const getNumberReports = async (dat: any) => {
    if (!dat) return;
    try {
      const res = await RaporSiswaApi.showAllNumberReports(
        token,
        '',
        0,
        1000,
        '',
        dat.semester,
        dat.studentclass.academic_year,
        dat.id
      );
      setNumberReports(res.data?.data?.result ?? []);
    } catch {
      // silent
    }
  };

  const getNarrativeReports = async (dat: any) => {
    if (!dat) return;
    try {
      const res = await RaporSiswaApi.showNarrativeReportsByStudentClass(
        token,
        dat.student_class_id,
        dat.studentclass.academic_year,
        dat.semester
      );
      setNarrativeReports(res.data?.data);
    } catch {
      // silent
    }
  };

  const getNarrativeComments = async (dat: any) => {
    if (!dat) return;
    try {
      const res = await RaporSiswaApi.showNarrativeCommentsByReport(
        token,
        dat.id
      );
      setNarrativeComments(res.data?.data ?? []);
    } catch {
      // silent
    }
  };

  const getPortofolioReports = async (dat: any) => {
    if (!dat) return;
    try {
      const res = await RaporSiswaApi.showPortofolioReportsByReport(
        token,
        dat.id
      );
      setPortofolioReports(res.data?.data ?? []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    setNumberReports([]);
    setNarrativeReports(null);
    setNarrativeComments([]);
    setPortofolioReports([]);

    getNumberReports(data);
    getNarrativeReports(data);
    getNarrativeComments(data);
    getPortofolioReports(data);
  }, [data]);

  const generateNumberReport = async (
    studentId: string,
    academic: string,
    semester: string
  ) => {
    try {
      await RaporSiswaApi.generateNumberReport(
        token,
        studentId,
        academic,
        semester
      );

      getReports();
      closeModal('modal-studentreport-detail');
    } catch {
      Swal.fire({
        target: document.getElementById('modal-studentreport-detail'),
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal generate PDF rapor angka',
      });
    }
  };

  const generateNarrativeReport = async (
    reportId: string,
    studentClassId: string,
    academic: string,
    semester: string
  ) => {
    try {
      await RaporSiswaApi.generateNarrativeReport(
        token,
        studentClassId,
        academic,
        semester,
        reportId
      );

      getReports();
      closeModal('modal-studentreport-detail');
    } catch {
      Swal.fire({
        target: document.getElementById('modal-studentreport-detail'),
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal generate PDF rapor narasi',
      });
    }
  };

  return (
    <>
      <Modal
        id="modal-studentreport-detail"
        width="w-11/12 max-w-2xl"
        onClose={() => setData(null)}
      >
        <p className="text-xl font-bold">Detail Rapor</p>

        <table className="mt-4">
          <tbody>
            <tr>
              <td>Tahun ajaran</td>
              <td>:</td>
              <td>{data?.studentclass?.academic_year ?? '-'}</td>
            </tr>
            <tr>
              <td>Semester</td>
              <td>:</td>
              <td>{data?.semester ?? '-'}</td>
            </tr>
            <tr>
              <td>Nama siswa</td>
              <td>:</td>
              <td>{data?.studentclass?.student?.full_name ?? '-'}</td>
            </tr>
          </tbody>
        </table>

        <div className="tabs tabs-bordered mt-8">
          <input
            type="radio"
            name="tabs-studentreport-detail"
            className="tab whitespace-nowrap"
            aria-label="Rapor Angka"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-4">
            <button
              onClick={() =>
                generateNumberReport(
                  data?.studentclass?.student_id ?? '',
                  data?.studentclass?.academic_year ?? '',
                  data?.semester ?? ''
                )
              }
              className="btn btn-sm bg-red-700 text-white mb-4"
            >
              <FaFilePdf />
              Generate PDF
            </button>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mata pelajaran</th>
                    <th>Nilai angka</th>
                    <th>Nilai huruf</th>
                  </tr>
                </thead>
                <tbody>
                  {numberReports?.map((nr, i) => (
                    <tr key={i}>
                      <td>{nr.subject?.name ?? '-'}</td>
                      <td>{nr.grade ?? '-'}</td>
                      <td>{nr.grade_text ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <input
            type="radio"
            name="tabs-studentreport-detail"
            className="tab whitespace-nowrap"
            aria-label="Rapor Narasi"
          />
          <div className="tab-content bg-base-100 border-base-300 p-4">
            <div className="flex flex-wrap gap-2 items-center mb-8">
              <button
                className="btn btn-sm bg-red-700 text-white"
                onClick={() => {
                  generateNarrativeReport(
                    data?.id,
                    data?.studentclass?.id ?? '',
                    data?.studentclass?.academic_year ?? '',
                    data?.semester ?? ''
                  );
                }}
              >
                <FaFilePdf />
                Generate PDF
              </button>
              <select
                className="select select-bordered select-sm"
                value={narrativeCatId}
                onChange={(e) => setNarrativeCatId(e.target.value)}
              >
                <option value={''} selected>
                  Kategori
                </option>
                {narrativeReports?.narrative_categories
                  ?.map(({ id, category }: any) => ({ id, category }))
                  .map((nr: any, i: number) => (
                    <option key={i} value={nr.id}>
                      {nr.category ?? '-'}
                    </option>
                  ))}
              </select>
            </div>

            {narrativeComments
              .filter((nc) => nc.narrative_cat_id == narrativeCatId)
              .map((nc, i) => (
                <div className="mb-8" key={i}>
                  <div className="flex gap-4 mb-2 items-center">
                    <h6 className="font-bold">KOMENTAR</h6>
                    <div className="grow h-px bg-base-300"></div>
                  </div>
                  <TruncateText text={nc?.comments ?? ''} />
                </div>
              ))}

            {narrativeReports?.narrative_categories
              ?.find((nc: any) => nc.id.toString() == narrativeCatId)
              ?.narrative_sub_categories.map((nsc: any, i: number) => (
                <div key={i} className="mb-8">
                  <div className="flex gap-4 mb-2 items-center">
                    <h6 className="font-bold">{nsc.sub_category ?? '-'}</h6>
                    <div className="grow h-px bg-base-300"></div>
                  </div>
                  <div className="overflow-x-auto max-w-xl">
                    <table className="table">
                      <thead className="bg-blue-50">
                        <tr>
                          <th>No</th>
                          <th>Keterangan</th>
                          <th className="text-center">
                            Membutuhkan
                            <br /> banyak latihan
                          </th>
                          <th className="text-center">Berkembang</th>
                          <th className="text-center">Mandiri</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nsc?.narrative_reports?.map((nr: any, j: number) => (
                          <tr key={i}>
                            <td>{j + 1}</td>
                            <td className="min-w-80 ">{nr?.desc ?? ''}</td>
                            <td>
                              {nr.grade == 1 && (
                                <FaCheck className="text-green-400 m-auto" />
                              )}
                            </td>
                            <td>
                              {nr.grade == 2 && (
                                <FaCheck className="text-green-400 m-auto" />
                              )}
                            </td>
                            <td>
                              {nr.grade == 3 && (
                                <FaCheck className="text-green-400 m-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

            <div className="mb-8">
              <div className="flex gap-4 mb-2 items-center">
                <h6 className="font-bold">Komentar Guru</h6>
                <div className="grow h-px bg-base-300"></div>
              </div>
              <TruncateText
                text={narrativeReports?.nar_teacher_comments ?? ''}
              />
            </div>

            <div className="mb-8">
              <div className="flex gap-4 mb-2 items-center">
                <h6 className="font-bold">Komentar Orang Tua</h6>
                <div className="grow h-px bg-base-300"></div>
              </div>
              <TruncateText
                text={narrativeReports?.nar_parent_comments ?? ''}
              />
            </div>
          </div>

          <input
            type="radio"
            name="tabs-studentreport-detail"
            className="tab whitespace-nowrap"
            aria-label="Rapor Portofolio"
          />
          <div className="tab-content bg-base-100 border-base-300 p-4">
            <div className="flex flex-wrap gap-2 items-center mb-8">
              <button className="btn btn-sm bg-red-700 text-white">
                <FaFilePdf />
                Generate PDF
              </button>
            </div>

            <div className="overflow-x-auto max-w-xl mb-8">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Keterangan</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {portofolioReports.map((pr, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{pr.type ?? '-'}</td>
                      <td>
                        <button
                          className={`btn btn-sm btn-square bg-green-500 text-white ${
                            !pr?.file_path ? 'btn-disabled' : ''
                          }`}
                          onClick={() =>
                            downloadReport(
                              pr.file_path,
                              'modal-studentreport-detail'
                            )
                          }
                          data-tip="Download portofolio"
                        >
                          <FaFilePdf size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <div className="flex gap-4 mb-2 items-center">
                <h6 className="font-bold">Komentar Guru</h6>
                <div className="grow h-px bg-base-300"></div>
              </div>
              <TruncateText text={data?.por_teacher_comments ?? ''} />
            </div>

            <div className="mb-8">
              <div className="flex gap-4 mb-2 items-center">
                <h6 className="font-bold">Komentar Orang Tua</h6>
                <div className="grow h-px bg-base-300"></div>
              </div>
              <TruncateText text={data?.por_parent_comments ?? ''} />
            </div>
          </div>
        </div>
      </Modal>

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
                    <td className="flex items-center gap-2">
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
                      <button
                        className={`btn btn-sm btn-square btn-primary`}
                        onClick={() => {
                          setData(item);
                          openModal('modal-studentreport-detail');
                        }}
                      >
                        <FaGear size={18} />
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

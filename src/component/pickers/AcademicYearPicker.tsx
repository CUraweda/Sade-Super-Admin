import { useEffect, useState } from 'react';
import { Settings } from '../../middleware/Api';
import { LoginStore } from '../../store/Store';

const AcademicYearPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const { token } = LoginStore();
  const [years, setYears] = useState<any[]>([]);

  const getYears = async () => {
    try {
      const res = await Settings.getSettings(token, '', 10000, 0);
      const { result } = res.data.data;
      setYears(result);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    getYears();
  }, []);

  return (
    <select
      className="select select-bordered select-sm"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value={''} selected>
        Tahun ajaran
      </option>
      {years.map((year, i) => (
        <option
          key={i}
          className="text-small"
          value={year.name}
          selected={year.status == 'Aktif'}
        >
          {year.name}
        </option>
      ))}
    </select>
  );
};

export default AcademicYearPicker;

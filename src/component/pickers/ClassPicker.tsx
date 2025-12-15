import { useEffect, useState } from 'react';
import { LoginStore } from '../../store/Store';
import { Kelas } from '../../middleware/Api';

const ClassPicker = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const { token } = LoginStore();
  const [classes, setClasses] = useState<any[]>([]);

  const getClasses = async () => {
    try {
      const res = await Kelas.getAllClasses(token, '', 1000, 0);
      const { result } = res.data.data;
      setClasses(result);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <select
      className="select select-bordered select-sm"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value={''} selected>
        Kelas
      </option>
      {classes?.map((item, i) => (
        <option
          value={item.id}
          key={i}
        >{`${item.level}-${item.class_name}`}</option>
      ))}
    </select>
  );
};

export default ClassPicker;

import { useState } from 'react';

type SearchBarProps = {
  onEnter: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const SearchBar = ({
  onEnter,
  placeholder = 'Cari...',
  className = '',
}: SearchBarProps) => {
  const [value, setValue] = useState<string>('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEnter(value);
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`input input-bordered input-sm w-full ${className}`}
      />
    </form>
  );
};

export default SearchBar;

import { ComponentProps, useMemo, useState } from 'react';

interface Props extends ComponentProps<'p'> {
  text: string;
  maxLength?: number;
}

const TruncateText = ({ text, maxLength = 120, ...props }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = useMemo(() => {
    if (!shouldTruncate || showAll) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
  }, [maxLength, shouldTruncate, showAll, text]);

  return (
    <div>
      <p {...props}>{displayText}</p>
      {shouldTruncate && (
        <button
          type="button"
          className="btn btn-link btn-xs px-0"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Sembunyikan' : 'Tampilkan semua'}
        </button>
      )}
    </div>
  );
};

export default TruncateText;

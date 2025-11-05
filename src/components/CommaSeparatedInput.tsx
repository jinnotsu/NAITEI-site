import React, { ChangeEvent } from 'react';

interface CommaSeparatedInputProps {
  label: string;
  name: string;
  value: string[];
  onChange: (newValue: string[]) => void;
}

const CommaSeparatedInput: React.FC<CommaSeparatedInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStringValue = e.target.value;
    const newArrayValue = newStringValue.split(',').map(item => item.trim());
    onChange(newArrayValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontWeight: 'bold' }}>{label}</label>
      <input
        type="text"
        name={name}
        value={value.join(', ')}
        onChange={handleChange}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
};

export default CommaSeparatedInput;

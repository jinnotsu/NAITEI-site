import React, { ChangeEvent } from 'react';

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  children?: React.ReactNode;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  name,
  value,
  onChange,
  rows = 8,
  children,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontWeight: 'bold' }}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }}
      />
      {children && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default TextAreaInput;

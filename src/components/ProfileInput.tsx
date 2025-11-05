import React, { ChangeEvent } from 'react';

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontWeight: 'bold' }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
};

export default ProfileInput;

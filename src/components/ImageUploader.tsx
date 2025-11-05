import React, { ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  onImageDelete,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
      <label style={{ fontWeight: 'bold' }}>プロフィール画像</label>
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={onImageChange}
      />
      {imageUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
          <Image src={imageUrl} alt="選択した画像" width={100} height={100} style={{ objectFit: 'cover', borderRadius: '8px' }} unoptimized />
          <button
            onClick={onImageDelete}
            style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            画像を削除
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

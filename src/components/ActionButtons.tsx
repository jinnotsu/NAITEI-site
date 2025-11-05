import React from 'react';

interface ActionButtonsProps {
  onSave: () => void;
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onDownload }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
      <button
        onClick={onSave}
        style={{ flex: 1, padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        💾 保存
      </button>
      <button
        onClick={onDownload}
        style={{ padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', width: '100%' }}
      >
        ZIPファイルで一括ダウンロード 📁
      </button>
    </div>
  );
};

export default ActionButtons;

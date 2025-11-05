'use client'

import React from 'react';
import ProofreadingPopUp from './ProofreadingPopUp';
import { useProofreading } from '@/hooks/useProofreading';

interface ProofreadingButtonProps {
  text: string;
  onProofreadComplete?: (correctedText: string) => void;
  className?: string;
  disabled?: boolean;
  buttonText?: string;
}

const ProofreadingButton: React.FC<ProofreadingButtonProps> = ({
  text,
  onProofreadComplete,
  className = '',
  disabled = false,
  buttonText = '校正'
}) => {
  const {
    isPopupOpen,
    isLoading,
    correctedText,
    originalText,
    handleButtonClick,
    handleConfirm,
    handleCancel,
    handleClose,
  } = useProofreading(text, onProofreadComplete);

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={disabled || isLoading || !text.trim()}
        className={`btn btn-primary d-flex align-items-center ${className}`}
        type="button"
      >
        {isLoading ? (
          <>
            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
            校正中... (最大10秒)
          </>
        ) : (
          <>
            <i className="bi bi-check2-circle me-2"></i>
            {buttonText}
          </>
        )}
      </button>

      <ProofreadingPopUp
        isOpen={isPopupOpen}
        originalText={originalText}
        correctedText={correctedText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    </>
  );
};

export default ProofreadingButton;
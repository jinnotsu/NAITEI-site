"use client";

import { useState } from 'react';

interface ProofreadButtonProps {
  text: string;
  fieldName: string;
  isLoading?: boolean;
  onProofreadStart: (fieldName: string) => void;
  onProofreadComplete: (originalText: string, correctedText: string, fieldName: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ProofreadButton({
  text,
  fieldName,
  isLoading = false,
  onProofreadStart,
  onProofreadComplete,
  onError,
  disabled = false,
  style,
  children
}: ProofreadButtonProps) {
  const getBootstrapClasses = (isLoading: boolean, hasText: boolean, disabled: boolean): string => {
    const baseClasses = 'btn btn-sm';
    
    if (isLoading) {
      return `${baseClasses} btn-secondary`;
    }
    
    if (!hasText || disabled) {
      return `${baseClasses} btn-outline-success disabled`;
    }
    
    return `${baseClasses} btn-success`;
  };

  const getCustomStyles = (): React.CSSProperties => ({
    fontSize: '12px',
    whiteSpace: 'nowrap',
    cursor: isLoading || disabled || !text.trim() ? 'not-allowed' : 'pointer',
    ...style
  });

  const handleProofread = async () => {
    if (!text.trim() || isLoading || disabled) return;

    onProofreadStart(fieldName);
    
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'proofread',
          text: text 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        onProofreadComplete(text, data.correctedText, fieldName);
      } else {
        console.error('Error:', data.error);
        onError('校正に失敗しました: ' + data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      onError('校正に失敗しました');
    }
  };

  return (
    <button
      onClick={handleProofread}
      disabled={isLoading || disabled || !text.trim()}
      className={getBootstrapClasses(isLoading, text.trim().length > 0, disabled)}
      style={getCustomStyles()}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
      )}
      {children || (isLoading ? '校正中...' : '文章校正')}
    </button>
  );
}

"use client";

import { useState } from 'react';

export const useProofreading = (text: string, onProofreadComplete?: (correctedText: string) => void) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [originalText, setOriginalText] = useState('');

  const callProofreadingAPI = async (textToProofread: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProofread }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.correctedText;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('校正処理がタイムアウトしました（10秒）。しばらく待ってから再試行してください。');
      }
      throw error;
    }
  };

  const handleButtonClick = async () => {
    if (!text.trim()) {
      alert('校正するテキストを入力してください。');
      return;
    }

    setIsLoading(true);
    setOriginalText(text);

    try {
      const result = await callProofreadingAPI(text);
      setCorrectedText(result);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('校正エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(errorMessage.includes('タイムアウト') ? '校正処理がタイムアウトしました（10秒）。' : `校正中にエラーが発生しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (onProofreadComplete) {
      onProofreadComplete(correctedText);
    }
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return {
    isPopupOpen,
    isLoading,
    correctedText,
    originalText,
    handleButtonClick,
    handleConfirm,
    handleCancel,
    handleClose,
  };
};

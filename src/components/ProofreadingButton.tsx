// Next.jsのClient Componentとして動作させるためのディレクティブ
'use client'

import React, { useState } from 'react';
import ProofreadingPopUp from './ProofreadingPopUp';

// ProofreadingButtonコンポーネントのProps型定義
interface ProofreadingButtonProps {
  text: string; // 校正対象のテキスト
  onProofreadComplete?: (correctedText: string) => void; // 校正完了時のコールバック関数（オプション）
  className?: string; // 追加のCSSクラス（オプション）
  disabled?: boolean; // ボタンの無効化フラグ（オプション）
  buttonText?: string; // ボタンに表示するテキスト（オプション）
}

// ProofreadingButtonコンポーネントの定義
const ProofreadingButton: React.FC<ProofreadingButtonProps> = ({
  text,
  onProofreadComplete,
  className = '', // デフォルト値: 空文字
  disabled = false, // デフォルト値: false（有効）
  buttonText = '校正' // デフォルト値: '校正'
}) => {
  // ポップアップの表示状態を管理するstate
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(false);
  // 校正済みテキストを保存するstate
  const [correctedText, setCorrectedText] = useState('');
  // 元のテキストを保存するstate
  const [originalText, setOriginalText] = useState('');
  

  // 校正APIを呼び出す非同期関数（10秒タイムアウト付き）
  const callProofreadingAPI = async (textToProofread: string): Promise<string> => {
    // 10秒タイムアウトの設定
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 10秒

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToProofread }),
        signal: controller.signal, // タイムアウト用のシグナル
      });

      // タイムアウトをクリア
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

  // ボタンクリック時の処理を行う非同期関数
  const handleButtonClick = async () => {
    // テキストが空の場合はアラートを表示して処理を中断
    if (!text.trim()) {
      alert('校正するテキストを入力してください。');
      return;
    }

    
    // ローディング状態を開始し、元のテキストを保存
    setIsLoading(true);
    setOriginalText(text);

    try {
      console.log('校正API呼び出し開始（10秒タイムアウト）');
      
      // 校正APIを呼び出し（10秒タイムアウト）
      const result = await callProofreadingAPI(text);
      
      // 成功した場合
      setCorrectedText(result);
      setIsPopupOpen(true);
      console.log('校正処理完了');
      
    } catch (error) {
      console.error('校正エラー:', error);
      
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      
      
      // エラーの種類に応じてメッセージを変更
      if (errorMessage.includes('タイムアウト')) {
        alert('校正処理がタイムアウトしました（10秒）。');
      } else {
        alert(`校正中にエラーが発生しました: ${errorMessage}`);
      }
    } finally {
      // 処理完了後、必ずローディング状態を解除
      setIsLoading(false);
    }
  };

  // ポップアップで「確定」ボタンがクリックされた時の処理
  const handleConfirm = () => {
    // 親コンポーネントにコールバック関数が渡されている場合は実行
    if (onProofreadComplete) {
      onProofreadComplete(correctedText);
    }
    // ポップアップを閉じる
    setIsPopupOpen(false);
  };

  // ポップアップで「キャンセル」ボタンがクリックされた時の処理
  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  // ポップアップの「×」ボタンがクリックされた時の処理
  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* 校正ボタン */}
      <button
        onClick={handleButtonClick}
        // ボタンの無効化条件: disabled props、ローディング中、テキストが空
        disabled={disabled || isLoading || !text.trim()}
        // Bootstrap CSSクラスと追加のclassNameを結合
        className={`btn btn-primary d-flex align-items-center ${className}`}
        type="button"
      >
        {/* ローディング中は spinner を表示、通常時はアイコンとテキストを表示 */}
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

      {/* 校正結果を表示するポップアップコンポーネント */}
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

// コンポーネントをエクスポート
export default ProofreadingButton;

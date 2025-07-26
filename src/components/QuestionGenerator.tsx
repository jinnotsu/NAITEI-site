"use client";

import { useState } from 'react';
import ProofreadButton from './ProofreadButton';

interface DynamicQuestion {
  id: string;
  question: string;
  answer: string;
}

interface QuestionGeneratorProps {
  inputs: Record<string, string>;
  dynamicQuestions: DynamicQuestion[];
  onQuestionsUpdate: (questions: DynamicQuestion[]) => void;
  onProofreadModalOpen: (originalText: string, correctedText: string, fieldName: string) => void;
  proofreadingLoading: Record<string, boolean>;
  onProofreadingLoadingUpdate: (updates: Record<string, boolean>) => void;
}

export default function QuestionGenerator({
  inputs,
  dynamicQuestions,
  onQuestionsUpdate,
  onProofreadModalOpen,
  proofreadingLoading,
  onProofreadingLoadingUpdate
}: QuestionGeneratorProps) {
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const generateQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);
      
      // フォームデータから名前以外の情報を抽出
      const formDataText = Object.entries(inputs)
        .filter(([key]) => key !== 'yourName') // 名前以外の情報
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      console.log('送信データ:', { action: 'generateQuestions', text: formDataText });

      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateQuestions',
          text: formDataText
        }),
      });

      console.log('レスポンスステータス:', response.status);
      console.log('レスポンスヘッダー:', response.headers);
      
      // レスポンステキストを確認
      const responseText = await response.text();
      console.log('レスポンステキスト:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON解析エラー:', parseError);
        console.error('レスポンス内容:', responseText);
        throw new Error(`APIレスポンスの解析に失敗しました: ${responseText}`);
      }
      
      console.log('レスポンスデータ:', responseData);

      if (!response.ok) {
        throw new Error(`質問生成に失敗しました: ${responseData.error || 'Unknown error'}`);
      }

      const { questions } = responseData;
      
      if (!questions || !Array.isArray(questions)) {
        throw new Error('質問の形式が正しくありません');
      }
      
      // 生成された質問を動的質問リストに追加
      const newQuestions = questions.map((question: string, index: number) => ({
        id: `generated_${Date.now()}_${index}`,
        question: question,
        answer: ''
      }));
      
      onQuestionsUpdate([...dynamicQuestions, ...newQuestions]);

    } catch (error) {
      console.error('質問生成エラー:', error);
      alert(`質問生成中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 動的質問の回答を更新
  const updateDynamicAnswer = (id: string, answer: string) => {
    const updatedQuestions = dynamicQuestions.map(q => 
      q.id === id ? { ...q, answer } : q
    );
    onQuestionsUpdate(updatedQuestions);
  };

  // 動的質問を削除
  const removeDynamicQuestion = (id: string) => {
    const filteredQuestions = dynamicQuestions.filter(q => q.id !== id);
    onQuestionsUpdate(filteredQuestions);
  };

  // 校正開始時の処理
  const handleProofreadStart = (fieldName: string) => {
    onProofreadingLoadingUpdate({ ...proofreadingLoading, [fieldName]: true });
  };

  // 校正完了時の処理
  const handleProofreadComplete = (originalText: string, correctedText: string, fieldName: string) => {
    onProofreadingLoadingUpdate({ ...proofreadingLoading, [fieldName]: false });
    onProofreadModalOpen(originalText, correctedText, fieldName);
  };

  // 校正エラー時の処理
  const handleProofreadError = (error: string) => {
    alert(error);
  };

  return (
    <>
      {/* 質問追加ボタン */}
      <div className="mb-4">
        <button
          onClick={generateQuestions}
          disabled={isGeneratingQuestions}
          className={`btn ${isGeneratingQuestions ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isGeneratingQuestions && (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          )}
          {isGeneratingQuestions ? '質問生成中...' : '質問を追加 🤔'}
        </button>
      </div>

      {/* 動的に生成された質問フィールド */}
      {dynamicQuestions.length > 0 && (
        <div className="mb-4">
          <h3 className="h5 mb-3">追加された質問</h3>
          {dynamicQuestions.map((questionItem) => (
            <div key={questionItem.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <label className="form-label fw-medium text-dark flex-grow-1 me-2">
                    {questionItem.question}
                  </label>
                  <button
                    onClick={() => removeDynamicQuestion(questionItem.id)}
                    className="btn btn-link text-danger p-0"
                    style={{ fontSize: '12px' }}
                  >
                    削除 ❌
                  </button>
                </div>
                <div className="d-flex gap-2 align-items-end">
                  <textarea
                    value={questionItem.answer}
                    onChange={(e) => updateDynamicAnswer(questionItem.id, e.target.value)}
                    rows={3}
                    placeholder="回答を入力してください..."
                    className="form-control flex-grow-1"
                    style={{ fontSize: '14px' }}
                  />
                  <ProofreadButton
                    text={questionItem.answer}
                    fieldName={`dynamic_${questionItem.id}`}
                    isLoading={proofreadingLoading[`dynamic_${questionItem.id}`]}
                    onProofreadStart={handleProofreadStart}
                    onProofreadComplete={handleProofreadComplete}
                    onError={handleProofreadError}
                    style={{ minWidth: '80px' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { templates, TemplateKey } from '@/lib/templates';
import { Inputs } from '@/types/portfolio';
import { Question } from '@/components/QuestionsManager';
import { usePortfolioDownloader } from './usePortfolioDownloader';

export const usePortfolioManager = () => {
  const { data: session, status } = useSession();

  const [inputs, setInputs] = useState<Inputs>({
    yourName: '山田 太郎',
    hometown: '東京都',
    university: '東京大学',
    faculty: '理科一類',
    dream: 'データサイエンティスト',
    hobby: ['競技プログラミング', '釣り'],
    skill: ['Python', 'HTML', 'CSS', 'JavaScript'],
    self_pr: '投資プログラムを開発し、コンテストで入賞したことです。\n開発期間は6か月、Pythonを使って個人で開発しました。',
    questions: [
      {
        id: '1',
        question: 'チームワークで重視することは何ですか？',
        answer: '相互尊重とオープンなコミュニケーションを重視します。チームメンバーそれぞれの意見を聞き、建設的な議論を通じて最適な解決策を見つけることが大切だと考えています。'
      },
    ] as Question[]
  });

  const [cssContents, setCssContents] = useState<Record<string, string>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('first');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Custom hook for download logic
  const { handleDownload } = usePortfolioDownloader(inputs, selectedTemplate, imageFile, cssContents);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            const content = data.content;

            if (typeof content.questions === 'string') {
              const questionsText = content.questions;
              const questions: Question[] = [];
              if (questionsText && questionsText.trim()) {
                const lines = questionsText.split('\n\n');
                let currentQuestion: Partial<Question> = {};
                lines.forEach((line: string, index: number) => {
                  if (line.startsWith('Q')) {
                    currentQuestion = {
                      id: (index + 1).toString(),
                      question: line.replace(/^Q\\d+\\.\s*/, ''),
                      answer: ''
                    };
                  } else if (line.startsWith('A') && currentQuestion.id) {
                    currentQuestion.answer = line.replace(/^A\\d+\\.\s*/, '');
                    questions.push(currentQuestion as Question);
                    currentQuestion = {};
                  }
                });
              }
              content.questions = questions;
            }
            setInputs(content);
            setSelectedTemplate(data.templateId);
          } else if (res.status === 404) {
            console.log('No profile data found for this user.');
          } else {
            console.error('Failed to fetch profile data.');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchProfile();
    }
  }, [status, session]);

  useEffect(() => {
    const fetchAllCss = async () => {
      const allCss: Record<string, string> = {};
      for (const key in templates) {
        const path = templates[key as TemplateKey].cssPath;
        try {
          const response = await fetch(path);
          if (response.ok) {
            allCss[key] = await response.text();
          }
        } catch (error) {
          console.error(`Failed to fetch css for ${key}:`, error);
        }
      }
      setCssContents(allCss);
    };
    fetchAllCss();
  }, []);

  const handleSave = async () => {
    if (!session) {
      alert('保存するにはログインが必要です。');
      return;
    }
    const dataToSave = {
      content: inputs,
      templateId: selectedTemplate,
    };
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        alert('保存しました！');
      } else {
        alert('保存に失敗しました。');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('通信エラーにより保存に失敗しました。');
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(null);
    setImageUrl(null);
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  return {
    status,
    inputs,
    setInputs,
    cssContents,
    isPreviewVisible,
    setIsPreviewVisible,
    selectedTemplate,
    setSelectedTemplate,
    imageFile,
    imageUrl,
    handleSave,
    handleImageChange,
    handleImageDelete,
    handleChange,
    handleDownload,
  };
};

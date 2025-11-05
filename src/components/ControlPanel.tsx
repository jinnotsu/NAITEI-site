"use client";

import { ChangeEvent } from 'react';
import { TemplateKey, templates } from '@/lib/templates';
import { Question } from './QuestionsManager';
import { Inputs } from '@/types/portfolio';
import ImageUploader from './ImageUploader';
import ProfileInput from './ProfileInput';
import CommaSeparatedInput from './CommaSeparatedInput';
import TextAreaInput from './TextAreaInput';
import ProofreadingButton from './ProofreadingButton';
import QuestionsManager from './QuestionsManager';
import ActionButtons from './ActionButtons';

interface ControlPanelProps {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  selectedTemplate: TemplateKey;
  setSelectedTemplate: (template: TemplateKey) => void;
  imageUrl: string | null;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: () => void;
  inputs: Inputs;
  setInputs: (inputs: React.SetStateAction<Inputs>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSave: () => void;
  handleDownload: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPreviewVisible,
  setIsPreviewVisible,
  selectedTemplate,
  setSelectedTemplate,
  imageUrl,
  handleImageChange,
  handleImageDelete,
  inputs,
  setInputs,
  handleChange,
  handleSave,
  handleDownload,
}) => {
  return (
    <div style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#fdfdfd', color: '#000000' }}>
      <div style={{ maxWidth: isPreviewVisible ? '600px' : '800px', margin: '0 auto', transition: 'max-width 0.3s' }}>
        <h1>ポートフォリオジェネレーター 🚀</h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setIsPreviewVisible(!isPreviewVisible)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            {isPreviewVisible ? 'プレビューを隠す' : 'プレビューを表示'}
          </button>
          <div>
            <label htmlFor="template-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>テンプレート:</label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
              style={{ padding: '8px' }}
            >
              {Object.keys(templates).map((key) => (
                <option key={key} value={key}>
                  {templates[key as TemplateKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
        
        <ImageUploader
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          onImageDelete={handleImageDelete}
        />

        <h2 style={{borderBottom: '1px solid #eee', paddingBottom: '10px'}}>プロフィール情報</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <ProfileInput label="氏名" name="yourName" value={inputs.yourName} onChange={handleChange} />
          <ProfileInput label="出身地" name="hometown" value={inputs.hometown} onChange={handleChange} />
          <ProfileInput label="大学" name="university" value={inputs.university} onChange={handleChange} />
          <ProfileInput label="学部・学科" name="faculty" value={inputs.faculty} onChange={handleChange} />
          <ProfileInput label="将来の夢" name="dream" value={inputs.dream} onChange={handleChange} />
          <CommaSeparatedInput
            label="趣味 (カンマ区切りで入力)"
            name="hobby"
            value={inputs.hobby}
            onChange={(newHobby) => {
              setInputs((prev: Inputs) => ({ ...prev, hobby: newHobby }));
            }}
          />
          <CommaSeparatedInput
            label="スキル (カンマ区切りで入力)"
            name="skill"
            value={inputs.skill}
            onChange={(newSkill) => {
              setInputs((prev: Inputs) => ({ ...prev, skill: newSkill }));
            }}
          />
          <TextAreaInput
            label="自己PR"
            name="self_pr"
            value={inputs.self_pr}
            onChange={handleChange}
          >
            <ProofreadingButton
              text={inputs.self_pr}
              onProofreadComplete={(correctedText) => {
                setInputs((prev: Inputs) => ({
                  ...prev,
                  self_pr: correctedText
                }));
              }}
              className="btn-sm"
            />
          </TextAreaInput>
          <QuestionsManager
            questions={inputs.questions}
            onChange={(questions) => {
              setInputs((prev: Inputs) => ({
                ...prev,
                questions
              }));
            }}
            selfPR={inputs.self_pr}
          />
        </div>

        <ActionButtons onSave={handleSave} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default ControlPanel;

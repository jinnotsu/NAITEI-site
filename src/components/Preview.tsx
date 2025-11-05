"use client";

import { templates, TemplateKey } from '@/lib/templates';
import { Inputs } from '@/types/portfolio';

interface PreviewProps {
  inputs: Inputs;
  imageUrl: string | null;
  selectedTemplate: TemplateKey;
  cssContents: Record<string, string>;
}

const Preview: React.FC<PreviewProps> = ({
  inputs,
  imageUrl,
  selectedTemplate,
  cssContents,
}) => {
  const TemplateComponent = templates[selectedTemplate].component;
  const css = cssContents[selectedTemplate] || '';

  // Render null or a loading indicator if the component or css is not ready
  if (!TemplateComponent || !css) {
    return (
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#e9ecef', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading Preview...</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#e9ecef', overflow: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#495057' }}>プレビュー</h2>
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <TemplateComponent inputs={inputs} imageUrl={imageUrl} css={css} />
      </div>
    </div>
  );
};

export default Preview;
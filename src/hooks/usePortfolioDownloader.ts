import JSZip from 'jszip';
import { templates, TemplateKey } from '@/lib/templates';
import { Inputs } from '@/types/portfolio';

export const usePortfolioDownloader = (
  inputs: Inputs,
  selectedTemplate: TemplateKey,
  imageFile: File | null,
  cssContents: Record<string, string>
) => {
  const handleDownload = async () => {
    const zip = new JSZip();
    const css = cssContents[selectedTemplate] || '';

    if (!css) {
      alert('CSSがまだ読み込めていません。少し待ってから再度お試しください。');
      return;
    }

    const { html, js } = templates[selectedTemplate].generate(inputs, imageFile?.name);
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);

    if (imageFile) {
      const imgFolder = zip.folder('img');
      if (imgFolder) {
        imgFolder.file(imageFile.name, imageFile);
      }
    }

    const staticImagePaths = ['logo.png', 'english-icon.png'];
    const imgFolder = zip.folder('img');
    if (imgFolder) {
      for (const path of staticImagePaths) {
        try {
          const response = await fetch(`/img/${path}`);
          if (response.ok) {
            const blob = await response.blob();
            imgFolder.file(path, blob);
          }
        } catch (error) {
          console.error(`Error fetching static image ${path}:`, error);
        }
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-site.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { handleDownload };
};

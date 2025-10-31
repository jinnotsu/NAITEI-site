import type { NextApiRequest, NextApiResponse } from 'next';
import JSZip from 'jszip';

interface Inputs {
  yourName: string;
  strengthAndWeakness: string;
  // 他のプロパティもここに追加
}

// この関数は、入力内容からHTMLコンテンツを生成する例です。
// 実際のテンプレートに応じて内容は調整してください。
const generateHtml = (inputs: Inputs): string => {
  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>${inputs.yourName}のポートフォリオ</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>${inputs.yourName}</h1>
      <h2>長所と短所</h2>
      <p>${inputs.strengthAndWeakness}</p>
      {/* 他の項目も同様に追加 */}
    </body>
    </html>
  `;
};

// CSSコンテンツの例
const generateCss = (): string => {
  return `
    body { font-family: sans-serif; }
    h1 { color: #333; }
  `;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const inputs = req.body; // フロントから送られてきた入力内容

    // 1. HTMLとCSSのコンテンツを生成
    const htmlContent = generateHtml(inputs);
    const cssContent = generateCss();

    // 2. ZIPファイルを作成
    const zip = new JSZip();
    zip.file('index.html', htmlContent);
    zip.file('style.css', cssContent);
    // 画像など他のファイルもここに追加可能

    // 3. ZIPファイルをBuffer形式に変換
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 4. ヘッダーを設定してファイルをダウンロードさせる
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.zip');
    res.send(zipBuffer);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    res.status(500).json({ error: 'ファイルの生成に失敗しました' });
  }
}
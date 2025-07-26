interface PortfolioData {
  yourName: string;
  catchphrase: string;
  strengthAndWeakness: string;
  mostDevotedThing: string;
  companyAttraction: string;
  dynamicQuestions?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

// --- テンプレート1: スタイリッシュ ---
const generateStylishContent = (data: PortfolioData, imageFileName?: string) => {
  // 画像が指定されていれば<img>タグを生成、なければ空文字
  const imageTag = imageFileName
    ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">`
    : '';

  // 動的質問のHTMLを生成
  const dynamicQuestionsHtml = data.dynamicQuestions && data.dynamicQuestions.length > 0
    ? data.dynamicQuestions.map(q => `
      <div class="faq-item">
        <h3>${q.question}</h3>
        <p>${q.answer.replace(/\n/g, '<br>')}</p>
      </div>`).join('')
    : '';

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.yourName}のポートフォリオサイト</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    ${imageTag}
    <h1>${data.yourName}</h1>
    <p class="catchphrase">${data.catchphrase}</p>
    <div class="faq-section">
      <h2>よくあるご質問 (FAQ)</h2>
      <div class="faq-item">
        <h3>あなたの長所と短所を教えてください。</h3>
        <p>${data.strengthAndWeakness.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="faq-item">
        <h3>学生時代に最も打ち込んだことは何ですか？</h3>
        <p>${data.mostDevotedThing.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="faq-item">
        <h3>当社のどのような点に魅力を感じましたか？</h3>
        <p>${data.companyAttraction.replace(/\n/g, '<br>')}</p>
      </div>
      ${dynamicQuestionsHtml}
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `body {
  font-family: 'Helvetica Neue', 'Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  line-height: 1.8;
  color: #333;
  background-color: #f9f9f9;
}
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
h1, h2 {
  border-bottom: 2px solid #0070f3;
  padding-bottom: 10px;
}
h1 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 10px;
}
.catchphrase {
  text-align: center;
  font-size: 1.2em;
  color: #555;
  margin-bottom: 40px;
}
.faq-section {
  margin-top: 50px;
}
.faq-item {
  margin-bottom: 30px;
}
.faq-item h3 {
  font-size: 1.2em;
  color: #0070f3;
  margin-bottom: 10px;
  padding-left: 1em;
  border-left: 4px solid #0070f3;
}
.faq-item p {
  padding: 10px;
  background-color: #f3f3f3;
  border-radius: 5px;
  white-space: pre-wrap;
}
.profile-image {
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 20px;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`;

  const js = `document.addEventListener('DOMContentLoaded', () => {
  console.log('ポートフォリオサイトへようこそ！');
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', () => {
      alert('こんにちは、${data.yourName}です！');
    });
  }
});`;

  return { html, css, js };
};

// --- テンプレート2: シンプル ---
const generateSimpleContent = (data: PortfolioData, imageFileName?: string) => {
  const imageTag = imageFileName
    ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">`
    : '';

  // 動的質問のHTMLを生成
  const dynamicQuestionsHtml = data.dynamicQuestions && data.dynamicQuestions.length > 0
    ? data.dynamicQuestions.map(q => `
    <h3>${q.question}</h3>
    <p>${q.answer.replace(/\n/g, '<br>')}</p>`).join('')
    : '';

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${data.yourName}のポートフォリオ</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    ${imageTag}
    <h1>${data.yourName}</h1>
    <h2>自己紹介</h2>
    <p>${data.catchphrase}</p>
    <h2>よくあるご質問</h2>
    <h3>長所と短所</h3>
    <p>${data.strengthAndWeakness.replace(/\n/g, '<br>')}</p>
    <h3>学生時代に最も打ち込んだこと</h3>
    <p>${data.mostDevotedThing.replace(/\n/g, '<br>')}</p>
    <h3>当社への魅力</h3>
    <p>${data.companyAttraction.replace(/\n/g, '<br>')}</p>
    ${dynamicQuestionsHtml}
  </div>
  <script src="script.js"></script>
</body>
</html>`;
  
  const css = `body {
  font-family: "MS PMincho", "Hiragino Mincho ProN", serif;
  line-height: 2;
  color: #222;
}
.container {
  max-width: 720px;
  margin: 30px auto;
  padding: 20px;
}
h1 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 30px;
}
h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  margin-top: 40px;
}
p {
  text-indent: 1em;
}
.profile-image {
  display: block;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}`;

  const js = `console.log('ページが読み込まれました。');`;

  return { html, css, js };
};


// --- エクスポート部分 ---
export const templates = {
  stylish: {
    name: 'スタイリッシュ ✨',
    generate: generateStylishContent,
  },
  simple: {
    name: 'シンプル 📄',
    generate: generateSimpleContent,
  },
};

export type TemplateKey = keyof typeof templates;
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inputs } from '@/types/portfolio';

// Props for the template component
interface TemplateProps {
  inputs: Inputs;
  imageUrl: string | null;
  css: string;
}

// The actual template as a React component for live preview
const PortfolioTemplate: React.FC<TemplateProps> = ({ inputs, imageUrl, css }) => {
  // Helper to handle newlines in self_pr
  const selfPrWithBreaks = inputs.self_pr.split('\n').map((line, index) => (
    <React.Fragment key={index}>{line}<br /></React.Fragment>
  ));

  return (
    <>
      <style>{css}</style>
      <script src="https://kit.fontawesome.com/8036d0d404.js" crossOrigin="anonymous" async></script>

      <nav>
        <div className="container navigation">
          <Image className="logo" src="/img/logo.png" alt="logo" width={150} height={40} />
          <div className="language">
            <Image src="/img/english-icon.png" alt="English" className="flag" width={30} height={30} />
            <Link href="/">English</Link>
            <i className="fa-solid fa-chevron-up"></i>
          </div>
        </div>
      </nav>

      <section className="basic-info">
        <div className="container">
          <div className="first-block section-divider">
            {imageUrl && <Image src={imageUrl} alt="プロフィール写真" className="profile-image" width={150} height={150} />}
            <div className="profile-text">
              <div className="profile-row">
                <div className="profile-label">名前</div>
                <div className="profile-colon">:</div>
                <div className="profile-value">{inputs.yourName}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">出身地</div>
                <div className="profile-colon">:</div>
                <div className="profile-value">{inputs.hometown}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">大学</div>
                <div className="profile-colon">:</div>
                <div className="profile-value">{inputs.university}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">学部/学科</div>
                <div className="profile-colon">:</div>
                <div className="profile-value">{inputs.faculty}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">将来の夢</div>
                <div className="profile-colon">:</div>
                <div className="profile-value">{inputs.dream}</div>
              </div>
            </div>
          </div>

          <div className="second-block section-divider">
            <div className="second-box-wrapper">
              <h2 className="header">趣味</h2>
              <div className="second-box">
                <ul>
                  {inputs.hobby.map((item, i) => <li key={`hobby-${item}-${i}`}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="second-box-wrapper">
              <h2 className="header">スキル・資格</h2>
              <div className="second-box">
                <ul>
                  {inputs.skill.map((item, i) => <li key={`skill-${item}-${i}`}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="third-block section-divider">
            <h2 className="header">自己PR</h2>
            <div className="text-box">
              <p>{selfPrWithBreaks}</p>
            </div>
          </div>

          {inputs.questions.map((q) => (
            <div className="question-block section-divider" key={q.id}>
              <h2 className="header">{q.question}</h2>
              <div className="text-box">
                <p>{q.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <footer>
          <p>&copy;NAITEI.site 2025 All rights reserved.</p>
        </footer>
      </section>
    </>
  );
};

// --- Functions to generate HTML string for download ---
const getHtml = (data: Inputs, imageFileName?: string) => {
  const imageTag = imageFileName ? `<img src="img/${imageFileName}" alt="プロフィール写真" class="profile-image">` : '';
  const hobbyList = data.hobby.map(item => `<li>${item}</li>`).join('');
  const skillList = data.skill.map(item => `<li>${item}</li>`).join('');
  const questionsHtml = data.questions.map((q) => ` 
            <div class="question-block section-divider">
                <h2 class="header">${q.question}</h2>
                <div class="text-box">
                    <p>${q.answer}</p>
                </div>
            </div>`).join('');

  const selfPrHtml = data.self_pr.replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Serif+JP:wght@200..900&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/8036d0d404.js" crossorigin="anonymous" async></script>
    <script src="static/js/main.js"></script>
    <title>NAITEI.site</title>
</head>
<body>
    <nav>
        <div class="container navigation">
            <img class="logo" src="img/logo.png" alt="logo"> 
            <div class="language">
                <img src="img/english-icon.png" alt="English" class="flag">
                <a href="/">English</a>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
        </div>
    </nav>
    <section class="basic-info">
        <div class="container">
            <div class="first-block section-divider">
                ${imageTag}
                <div class="profile-text">
                    <div class="profile-row">
                        <div class="profile-label">名前</div>
                        <div class="profile-colon">:</div>
                        <div class="profile-value">${data.yourName}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">出身地</div>
                        <div class="profile-colon">:</div>
                        <div class="profile-value">${data.hometown}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">大学</div>
                        <div class="profile-colon">:</div>
                        <div class="profile-value">${data.university}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">学部/学科</div>
                        <div class="profile-colon">:</div>
                        <div class="profile-value">${data.faculty}</div>
                    </div>
                    <div class="profile-row">
                        <div class="profile-label">将来の夢</div>
                        <div class="profile-colon">:</div>
                        <div class="profile-value">${data.dream}</div>
                    </div>
                </div>
            </div>
            <div class="second-block section-divider">
                <div class="second-box-wrapper">
                    <h2 class="header">趣味</h2>
                    <div class="second-box">
                        <ul>
                          ${hobbyList}
                        </ul>
                    </div>
                </div>
                <div class="second-box-wrapper">
                    <h2 class="header">スキル・資格</h2>
                    <div class="second-box">
                        <ul>
                          ${skillList}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="third-block section-divider">
                <h2 class="header">自己PR</h2>
                <div class="text-box">
                    <p>
                    ${selfPrHtml}
                    </p>
                </div>
            </div>
            ${questionsHtml}
        </div>
            <footer>
                <p>&copy;NAITEI.site 2025 All rights reserved.</p>
            </footer>
    </section>
</body>
</html>`;
};

const generatePatern = (data: Inputs, imageFileName?: string) => {
  const html = getHtml(data, imageFileName);
  const js = `document.addEventListener('DOMContentLoaded', () => {
  console.log('ポートフォリオサイトへようこそ！');
});`;
  return { html, js };
};

// --- Export section ---
export const templates = {
  first: {
    name: '色1 📄',
    generate: generatePatern,
    component: PortfolioTemplate,
    cssPath: '/css/pattern1.css'
  },
  second: {
    name: '色2 📄',
    generate: generatePatern,
    component: PortfolioTemplate,
    cssPath: '/css/pattern2.css'
  },
  third: {
    name: '色3 📄',
    generate: generatePatern,
    component: PortfolioTemplate,
    cssPath: '/css/pattern3.css'
  },
  forth: {
    name: '色4 📄',
    generate: generatePatern,
    component: PortfolioTemplate,
    cssPath: '/css/pattern4.css'
  },
  fifth: {
    name: '色5 📄',
    generate: generatePatern,
    component: PortfolioTemplate,
    cssPath: '/css/pattern5.css'
  },
};

export type TemplateKey = keyof typeof templates;

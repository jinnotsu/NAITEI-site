import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// .tsxにするとページコンポートとして認識される
// APIキー
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

export async function POST(request: NextRequest) {
  try {
    // APIキーの存在確認
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // 校正機能
    if (body.text) {
      if (!body.text.trim()) {
        return Response.json({ error: 'Text is required' }, { status: 400 });
      }
      const correctedText = await generateProofreadText(body.text);
      return Response.json({ correctedText });
    }
    
    // 質問生成機能
    if (body.selfPR) {
      if (!body.selfPR.trim()) {
        return Response.json({ error: '自己PRが入力されていません' }, { status: 400 });
      }
      const questions = await generateQuestions(body.selfPR);
      return Response.json({ questions });
    }
    
    return Response.json({ error: 'リクエストパラメータが不正です' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    // APIエラー
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

async function generateProofreadText(text: string): Promise<string> {
  const prompt = `以下の文章を校正してください。誤字脱字、文法の間違いを修正してください。大きな意味の変更や大幅な文字の削減はしないでください。校正後の文章のみを返してください。説明は不要です.\n\n文章:\n${text}`;

  // モデル指定
  const result = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt, // ここにプロンプト
  });

  // result.candidates[0].content.parts[0].text から校正済みテキストを取得
  // 無理やりすぎる...
  const correctedText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  return correctedText.trim(); // 余分な空白を削除して返す
}

async function generateQuestions(selfPR: string): Promise<string[]> {
  const prompt = `以下の自己PRの内容を読んで、面接で聞かれそうな深掘りできる質問を2つ生成してください。
質問は簡潔に1文で作成し、具体的で回答者の経験や考えを引き出せるものにしてください。
質問のみを改行区切りで返してください。説明や番号は不要です。

自己PR:
${selfPR}`;

  // モデル指定
  const result = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });

  // レスポンスからテキストを取得
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  
  // 改行で分割して質問の配列を作成
  const questions = text
    .split('\n')
    .map(q => q.trim())
    .filter(q => q.length > 0 && !q.match(/^\d+\./) && q.includes('？')); // 番号付きを除外し、疑問符があるもののみ
  
  return questions;
}
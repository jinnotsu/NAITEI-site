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
    const { text, action } = await request.json();
    
    if (action === 'proofread') {
      if (!text) {
        return Response.json({ error: 'Text is required' }, { status: 400 });
      }
      const correctedText = await generateProofreadText(text);
      return Response.json({ correctedText });
    }
    
    if (action === 'generateQuestions') {
      if (!text) {
        return Response.json({ error: 'Text is required for question generation' }, { status: 400 });
      }
      const questions = await generateQuestions(text);
      return Response.json({ questions });
    }
    
    // 後方互換性のため、actionが指定されていない場合は校正として処理
    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }
    const correctedText = await generateProofreadText(text);
    return Response.json({ correctedText });
    
  } catch (error) {
    console.error('API Error:', error);
    // APIエラー
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export async function generateProofreadText(text: string): Promise<string> {
  const prompt = `以下の文章を校正してください。誤字脱字、文法の間違い、より読みやすい文章にしてください。大きな意味の変更はしないでください。校正後の文章のみを返してください。説明は不要です。\n\n文章:\n${text}`;

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

export async function generateQuestions(inputData: string): Promise<string[]> {
  console.log('generateQuestions 関数が呼び出されました。入力データ:', inputData);
  
  const prompt = `以下の入力データを分析して、その人の背景や経験を深掘りできる質問を3つ生成してください。質問は面接や自己分析に使えるような具体的で有意義なものにしてください。ただし1行程度の簡潔な質問にしてください。

入力データ:
${inputData}

質問例：
- どういったエンジニアになりたいですか？
- これまでの経験で最も印象に残っているプロジェクトは何ですか？
- 今後挑戦してみたい技術や分野はありますか？

生成する質問は「- 」で始めて出力してください。`;

  try {
    console.log('Gemini API を呼び出しています...');
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    console.log('Gemini API のレスポンス:', result);

    const questionsText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('生成されたテキスト:', questionsText);
    
    const questions = questionsText
      .split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.replace(/^- /, '').trim())
      .filter(question => question.length > 0);

    console.log('解析された質問:', questions);
    return questions;
  } catch (error) {
    console.error('generateQuestions でエラー:', error);
    throw error;
  }
}
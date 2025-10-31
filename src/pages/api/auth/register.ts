// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { kv } from '@/lib/kv'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  // --- ▼ デバッグ用のコードを追加 ▼ ---
  console.log('--- Environment Variables Check ---');
  console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL);
  // トークン自体は長すぎるので、存在するかどうか(true/false)だけ確認
  console.log('KV_REST_API_TOKEN is set:', !!process.env.KV_REST_API_TOKEN);
  console.log('---------------------------------');
  // --- ▲ デバッグ用のコードはここまで ▲ ---
  
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 12);

    // Vercel KVにユーザー情報を保存（キーはemail）
    await kv.set(`user:${email}`, {
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; 
import { kv } from '@/lib/kv';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const session = await getServerSession(req, res, authOptions);
  console.log("✅ session:", session); // ← 確認用ログ追加

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'ログインしていません' });
  }
  
  const userId = session.user.id;
  const userKey = `profile:${userId}`;

  switch (req.method) {
    // Read: データの読み込み
    case 'GET':
      try {
        const profileData = await kv.get(userKey);
        if (!profileData) {
          return res.status(404).json({ message: 'データが見つかりません' });
        }
        return res.status(200).json(profileData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return res.status(500).json({ error: 'データの取得に失敗しました' });
      }

    // Update: データの更新（保存）
    case 'POST':
      try {
        const profileData = req.body;
        await kv.set(userKey, profileData);
        return res.status(200).json({ message: '保存しました' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return res.status(500).json({ error: '保存に失敗しました' });
      }

    // Delete: データの削除
    case 'DELETE':
      try {
        await kv.del(userKey);
        return res.status(200).json({ message: '削除しました' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return res.status(500).json({ error: '削除に失敗しました' });
      }

    // それ以外のメソッドは許可しない
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
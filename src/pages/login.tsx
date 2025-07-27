// pages/login.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ログイン済みならトップへリダイレクト
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('メールアドレスまたはパスワードが間違っています。');
    } else if (result?.ok) {
      router.replace('/');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    // sessionがあればリダイレクト済みなので何も表示しない
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-4xl w-full min-h-[600px]">
        {/* 左側のログインフォームなど、あなたのコードのまま */}
        <div className="flex-1 px-12 py-16 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Sign in</h1>

            {/* ソーシャルログインボタン（略） */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* メール、パスワードのinput */}
              <input  placeholder="email" name="email" type="email" required />
              <input placeholder="password" name="password" type="password" required />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </div>

        {/* 右側のウェルカムメッセージなど */}
      </div>
    </div>
  );
}

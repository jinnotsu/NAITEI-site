// src/app/register/page.tsx
"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('メールアドレスまたはパスワードが間違っています。');
    } else {
      router.push('/');
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-4xl w-full min-h-[600px]">
        {/* 左側: ログインフォーム */}
        <div className="flex-1 px-12 py-16 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Sign in</h1>
            
            {/* ソーシャルログインボタン */}
            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:border-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Sign in with GitHub
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="relative text-center my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="bg-white px-5 text-gray-500 text-sm">or use your account</span>
            </div>

            {/* メール・パスワードフォーム */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600 text-sm hover:underline transition-colors duration-200">
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-base uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            {error && (
              <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center border border-red-200">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 右側: ウェルカムメッセージ */}
        <div className="flex-1 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-center px-10 py-16">
          <div className="max-w-xs">
            <h2 className="text-4xl font-bold mb-5">Hello, Friend!</h2>
            <p className="text-base leading-relaxed mb-10 opacity-90">
              Enter your personal details and start your journey with us
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-3 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-red-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
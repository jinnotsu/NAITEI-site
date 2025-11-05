'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';


export default function RequireLogin({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'loading') return null;

  if (!session) {
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
        router.refresh();
      }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
      setIsLoading(true);
      await signIn(provider, { callbackUrl: '/' });
      setIsLoading(false);
    };

    // スタイルオブジェクト
    const styles = {
      minScreenCenter: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f2937', // bg-gray-900
        padding: '1.25rem',
      },
      container: {
        backgroundColor: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
        overflow: 'hidden',
        display: 'flex',
        maxWidth: '42rem', // max-w-2xl
        width: '100%',
      },
      leftPanel: {
        flex: 1,
        padding: '3rem 2.5rem',
      },
      formWrapper: {
        width: '100%',
        maxWidth: '24rem',
        margin: '0 auto',
      },
      title: {
        fontSize: '1.875rem', // text-3xl
        fontWeight: '700',
        color: '#111827', // text-gray-900
        marginBottom: '2rem',
        textAlign: 'center' as const,
      },
      socialButtonsContainer: {
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.75rem',
      },
      githubButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#111827', // bg-gray-900
        color: 'white',
        borderRadius: '0.5rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        border: 'none',
      },
      githubButtonHover: {
        backgroundColor: '#1f2937', // bg-gray-800
      },
      githubButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      googleButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db', // border-gray-300
        color: '#374151', // text-gray-700
        borderRadius: '0.5rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        backgroundColor: 'white',
      },
      googleButtonHover: {
        backgroundColor: '#f9fafb', // bg-gray-50
      },
      googleButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      dividerWrapper: {
        position: 'relative' as const,
        textAlign: 'center' as const,
        margin: '1.5rem 0',
      },
      dividerLineContainer: {
        position: 'absolute' as const,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
      },
      dividerLine: {
        width: '100%',
        borderTop: '1px solid #e5e7eb', // border-gray-200
      },
      dividerText: {
        position: 'relative' as const,
        backgroundColor: '#fff',
        padding: '0 1rem',
        color: '#6b7280', // text-gray-500
        fontSize: '0.875rem',
      },
      form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
      },
      label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151', // text-gray-700
        marginBottom: '0.25rem',
      },
      input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db', // border-gray-300
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        color: '#000000', // text-black
        outline: 'none',
        transition: 'all 0.2s',
      } as React.CSSProperties,
      inputFocus: {
        borderColor: 'transparent',
        boxShadow: '0 0 0 2px #3b82f6', // focus:ring-blue-500
      },
      submitButton: {
        width: '100%',
        backgroundColor: '#2563eb', // bg-blue-600
        color: 'white',
        padding: '0.75rem 0',
        borderRadius: '0.5rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        border: 'none',
      },
      submitButtonHover: {
        backgroundColor: '#1d4ed8', // bg-blue-700
      },
      submitButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      errorBox: {
        marginTop: '1rem',
        backgroundColor: '#fef2f2', // bg-red-50
        color: '#b91c1c', // text-red-700
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        textAlign: 'center' as const,
        border: '1px solid #fecaca', // border-red-200
      },
      bottomText: {
        marginTop: '1.5rem',
        textAlign: 'center' as const,
        fontSize: '0.875rem',
        color: '#4b5563', // text-gray-600
      },
      linkBlue: {
        color: '#2563eb',
        textDecoration: 'underline',
        fontWeight: 500,
        cursor: 'pointer',
      },
      rightPanel: {
        flex: 1,
        background: 'linear-gradient(to bottom right, #6366f1, #a78bfa, #3b82f6)', // from-indigo-400 via-purple-400 to-blue-500
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center' as const,
        padding: '3rem 2rem',
      },
      rightPanelContent: {
        maxWidth: '20rem',
      },
      rightPanelTitle: {
        fontSize: '1.875rem', // text-3xl
        fontWeight: 700,
        marginBottom: '1rem',
      },
      rightPanelText: {
        fontSize: '1rem',
        lineHeight: 1.5,
        marginBottom: '2rem',
        opacity: 0.9,
      },
      signUpLink: {
        display: 'inline-block',
        backgroundColor: 'transparent',
        border: '2px solid white',
        color: 'white',
        padding: '0.75rem 2rem',
        borderRadius: '9999px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s',
        textDecoration: 'none',
      },
      signUpLinkHover: {
        backgroundColor: 'white',
        color: '#a78bfa', // text-purple-500
      },
    };

    // フォーカス時にinputにスタイル追加は難しいので省略しています

    return (
      <>
        {/* Tailwind CSS is now imported via your global CSS, so no <script> tag is needed here */}
        <div style={styles.minScreenCenter}>
          <div style={styles.container}>
            {/* Left Panel */}
            <div style={styles.leftPanel}>
              <div style={styles.formWrapper}>
                <h1 style={styles.title}>Sign in</h1>

                {/* Social Login Buttons */}
                <div style={styles.socialButtonsContainer}>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    style={{
                      ...styles.githubButton,
                      ...(isLoading ? styles.githubButtonDisabled : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = '#1f2937');
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = '#111827');
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ width: '1.25rem', height: '1.25rem' }}>
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sign in with GitHub
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    style={{
                      ...styles.googleButton,
                      ...(isLoading ? styles.googleButtonDisabled : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = '#f9fafb');
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = 'white');
                    }}
                  >
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                {/* Divider */}
                <div style={styles.dividerWrapper}>
                  <div style={styles.dividerLineContainer}>
                    <div style={styles.dividerLine}></div>
                  </div>
                  <span style={styles.dividerText}>or use your account</span>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div>
                    <label htmlFor="email" style={styles.label}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      style={styles.input}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" style={styles.label}>
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      style={styles.input}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      ...styles.submitButton,
                      ...(isLoading ? styles.submitButtonDisabled : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = '#1d4ed8');
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) (e.currentTarget.style.backgroundColor = '#2563eb');
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                {error && <div style={styles.errorBox}>{error}</div>}

                <p style={styles.bottomText}>
                  アカウントをお持ちでないですか？{' '}
                  <Link href="/register" style={styles.linkBlue}>
                    新規登録
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div style={styles.rightPanel}>
              <div style={styles.rightPanelContent}>
                <h2 style={styles.rightPanelTitle}>みなさんこんにちは！</h2>
                <p style={styles.rightPanelText}>Naitei-Site</p>
                  <Link
                    href="/register"
                    style={styles.signUpLink}
                    onMouseEnter={(e) => {
                      (e.currentTarget.style.backgroundColor = 'white');
                      (e.currentTarget.style.color = '#a78bfa');
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget.style.backgroundColor = 'transparent');
                      (e.currentTarget.style.color = 'white');
                    }}
                  >
                    SIGN UP
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}

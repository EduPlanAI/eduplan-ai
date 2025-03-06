import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn({ email, password });
      
      if (error) throw error;
      
      // 登录成功，重定向到仪表板
      router.push('/dashboard');
    } catch (error) {
      console.error('登录错误:', error);
      setError('登录失败，请检查您的邮箱和密码');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>登录 | EduPlan AI</title>
      </Head>

      <main>
        <div>
          <h1>登录</h1>
          <p>欢迎回来！请登录您的账户</p>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">电子邮箱</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              {/* 注意这里的 Link 组件用法变化 */}
              <Link href="/auth/reset-password">
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div>
            <p>
              还没有账户？{' '}
              {/* 注意这里的 Link 组件用法变化 */}
              <Link href="/auth/signup">
                注册
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

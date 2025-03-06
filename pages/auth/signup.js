import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 注册用户
      const { data, error: signUpError } = await signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // 注册成功，重定向到登录页面
      router.push('/auth/signin');
    } catch (error) {
      console.error('注册错误:', error);
      setError('注册失败，请检查您的信息');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>注册 | EduPlan AI</title>
      </Head>

      <main>
        <div>
          <h1>创建账户</h1>
          <p>开始您的个性化教育规划之旅</p>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <label htmlFor="firstName">姓</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">名</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                minLength={6}
              />
              <small>密码至少需要6个字符</small>
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div>
            <p>
              已有账户？{' '}
              {/* 注意这里的 Link 组件用法变化 */}
              <Link href="/auth/signin">
                登录
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

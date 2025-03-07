import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>仪表板 | EduPlan AI</title>
      </Head>

      <main>
        <h1>欢迎回来, {user.user_metadata?.first_name || '用户'}!</h1>
        
    <div className={styles.dashboardSection}>
      <h2>您的教育规划</h2>
      <p>您还没有创建任何教育规划。开始一次评估来创建您的第一个规划。</p>
      <button 
      onClick={() => router.push('/assessment')}
      className={styles.actionButton}
      >
     开始评估
   </button>
 </div>
              

        <button onClick={signOut}>
          登出
        </button>
      </main>
    </div>
  );
}

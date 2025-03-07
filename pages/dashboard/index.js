import styles from '../../styles/Dashboard.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取用户的教育计划
  useEffect(() => {
    async function fetchPlans() {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/plans');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || '获取计划失败');
        }
        
        setPlans(data.plans || []);
      } catch (err) {
        console.error('获取计划错误:', err);
        setError('加载计划时出错，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlans();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div className={styles.loadingContainer}>加载中...</div>;
  }

  if (!user) {
    return null;
  }

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>仪表板 | EduPlan AI</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.welcomeMessage}>欢迎回来, {user.user_metadata?.first_name || '用户'}!</h1>
          <button onClick={signOut} className={styles.signOutButton}>
            登出
          </button>
        </div>
        
        <div className={styles.dashboardSection}>
          <h2>您的教育规划</h2>
          
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          
          {plans.length === 0 ? (
            <div className={styles.emptyState}>
              <p>您还没有创建任何教育规划。开始一次评估来创建您的第一个规划。</p>
              <button 
                onClick={() => router.push('/assessment')}
                className={styles.actionButton}
              >
                开始评估
              </button>
            </div>
          ) : (
            <div className={styles.plansList}>
              {plans.map((plan) => (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planInfo}>
                    <h3 className={styles.planTitle}>{plan.title}</h3>
                    <p className={styles.planDate}>创建于: {formatDate(plan.created_at)}</p>
                    
                    <div className={styles.planTags}>
                      {plan.path_preference === 'china' && (
                        <span className={`${styles.planTag} ${styles.chinaTag}`}>中国教育路径</span>
                      )}
                      {plan.path_preference === 'australia' && (
                        <span className={`${styles.planTag} ${styles.ausTag}`}>澳洲教育路径</span>
                      )}
                      {plan.path_preference === 'mixed' && (
                        <span className={`${styles.planTag} ${styles.mixedTag}`}>中澳混合路径</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.planActions}>
                    <Link href={`/plans/${plan.id}`} className={styles.viewButton}>
                      查看
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className={styles.newAssessmentCard}>
                <p>创建新的教育规划评估？</p>
                <button 
                  onClick={() => router.push('/assessment')}
                  className={styles.actionButton}
                >
                  新建评估
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

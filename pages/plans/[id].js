import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Head from 'next/head';
import styles from '../../styles/PlanView.module.css';

export default function PlanView() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 检查用户是否登录
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    // 获取计划数据
    async function fetchPlan() {
      if (!id || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/plans/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取计划失败');
        }

        setPlan(data.plan);
      } catch (err) {
        console.error('获取计划错误:', err);
        setError('加载计划时出错，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, [id, user, loading, router]);

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  if (loading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1>出错了</h1>
          <p>{error}</p>
          <Link href="/dashboard" className={styles.backLink}>
            返回仪表板
          </Link>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  const assessmentData = plan.assessment_data || {};
  const aiAnalysis = plan.ai_analysis || {};
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{plan.title} | EduPlan AI</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backLink}>
            &larr; 返回仪表板
          </Link>
          <div className={styles.planMeta}>
            <span className={styles.planDate}>创建于: {formatDate(plan.created_at)}</span>
          </div>
        </div>

        <div className={styles.planContent}>
          <h1 className={styles.title}>{plan.title}</h1>
          
          <section className={styles.section}>
            <h2>基本信息</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>姓名：</span>
                <span className={styles.infoValue}>{assessmentData.name || '未提供'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>年龄：</span>
                <span className={styles.infoValue}>{assessmentData.age || '未提供'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>年级：</span>
                <span className={styles.infoValue}>{assessmentData.grade || '未提供'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>学校：</span>
                <span className={styles.infoValue}>{assessmentData.school || '未提供'}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>学习风格分析</h2>
            <p>{aiAnalysis.learningStyleAnalysis}</p>
            
            <div className={styles.styleChart}>
              {assessmentData.visual && (
                <div className={styles.styleBar}>
                  <span className={styles.styleLabel}>视觉学习</span>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{width: `${(assessmentData.visual / 5) * 100}%`}}
                    ></div>
                  </div>
                  <span className={styles.styleScore}>{assessmentData.visual}/5</span>
                </div>
              )}
              
              {assessmentData.auditory && (
                <div className={styles.styleBar}>
                  <span className={styles.styleLabel}>听觉学习</span>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{width: `${(assessmentData.auditory / 5) * 100}%`}}
                    ></div>
                  </div>
                  <span className={styles.styleScore}>{assessmentData.auditory}/5</span>
                </div>
              )}
              
              {assessmentData.reading && (
                <div className={styles.styleBar}>
                  <span className={styles.styleLabel}>阅读学习</span>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{width: `${(assessmentData.reading / 5) * 100}%`}}
                    ></div>
                  </div>
                  <span className={styles.styleScore}>{assessmentData.reading}/5</span>
                </div>
              )}
              
              {assessmentData.kinesthetic && (
                <div className={styles.styleBar}>
                  <span className={styles.styleLabel}>动手学习</span>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{width: `${(assessmentData.kinesthetic / 5) * 100}%`}}
                    ></div>
                  </div>
                  <span className={styles.styleScore}>{assessmentData.kinesthetic}/5</span>
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>中国教育路径建议</h2>
            <p>{aiAnalysis.chinaEducationPath}</p>
          </section>

          <section className={styles.section}>
            <h2>澳洲教育路径建议</h2>
            <p>{aiAnalysis.australiaEducationPath}</p>
          </section>

          <section className={styles.section}>
            <h2>个性化建议</h2>
            <p>{aiAnalysis.personalizedRecommendations}</p>
          </section>

          {aiAnalysis.keyDecisionPoints && aiAnalysis.keyDecisionPoints.length > 0 && (
            <section className={styles.section}>
              <h2>关键决策点</h2>
              <div className={styles.decisionPoints}>
                {aiAnalysis.keyDecisionPoints.map((point, index) => (
                  <div key={index} className={styles.decisionPoint}>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className={styles.actions}>
            <button className={styles.downloadButton}>
              下载完整报告 (PDF)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

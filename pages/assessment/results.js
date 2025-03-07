import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Assessment.module.css';

export default function AssessmentResults() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assessmentData, setAssessmentData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState(null);

  // 加载评估数据
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin?redirect=/assessment/results');
        return;
      }
      
      const savedData = localStorage.getItem('eduplan_assessment');
      if (savedData) {
        setAssessmentData(JSON.parse(savedData));
      } else {
        router.push('/assessment');
      }
      
      setIsLoading(false);
    }
  }, [user, loading, router]);

  // 生成学习风格分析
  function getLearningStyleAnalysis() {
    if (!assessmentData) return null;
    
    const styles = {
      visual: parseInt(assessmentData.visual) || 0,
      auditory: parseInt(assessmentData.auditory) || 0,
      reading: parseInt(assessmentData.reading) || 0,
      kinesthetic: parseInt(assessmentData.kinesthetic) || 0
    };
    
    // 找出最强和次强的学习风格
    const sortedStyles = Object.entries(styles)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, value]) => value > 0);
    
    if (sortedStyles.length === 0) return null;
    
    const primaryStyle = sortedStyles[0];
    const secondaryStyle = sortedStyles.length > 1 ? sortedStyles[1] : null;
    
    // 返回学习风格分析
    return {
      primaryStyle: getStyleName(primaryStyle[0]),
      primaryScore: primaryStyle[1],
      secondaryStyle: secondaryStyle ? getStyleName(secondaryStyle[0]) : null,
      secondaryScore: secondaryStyle ? secondaryStyle[1] : null,
      styles
    };
  }

  // 获取学习风格名称
  function getStyleName(styleKey) {
    const styleNames = {
      visual: '视觉学习者',
      auditory: '听觉学习者',
      reading: '阅读学习者',
      kinesthetic: '动手学习者'
    };
    return styleNames[styleKey] || styleKey;
  }

  // 获取学习风格建议
  function getStyleRecommendations(styleKey) {
    const recommendations = {
      visual: [
        '使用图表、图像和视频辅助学习',
        '用彩色笔标记重点内容',
        '绘制思维导图组织信息',
        '观看教学视频加深理解'
      ],
      auditory: [
        '参加小组讨论和辩论',
        '录音并回听课堂笔记',
        '大声读出重要内容',
        '使用口头解释和讲解进行理解'
      ],
      reading: [
        '做详细的阅读笔记',
        '多阅读教科书和参考材料',
        '用自己的话重写关键概念',
        '利用列表和大纲组织信息'
      ],
      kinesthetic: [
        '通过动手实验和项目学习',
        '使用实物模型辅助理解',
        '在学习时适当活动',
        '参与角色扮演和模拟练习'
      ]
    };
    return recommendations[styleKey] || [];
  }

  // 生成 AI 教育规划
  async function generateAIPlan() {
    if (!assessmentData) return;
    
    setIsGeneratingAI(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI plan');
      }
      
      const data = await response.json();
      setAiAnalysis(data.analysis);
      
      // 保存 AI 分析结果到本地存储，避免重复生成
      localStorage.setItem('eduplan_ai_analysis', JSON.stringify(data.analysis));
    } catch (err) {
      console.error('Error generating AI plan:', err);
      setError('生成AI教育规划时出错，请稍后再试');
    } finally {
      setIsGeneratingAI(false);
    }
  }

  // 检查是否有保存的 AI 分析
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('eduplan_ai_analysis');
    if (savedAnalysis) {
      try {
        setAiAnalysis(JSON.parse(savedAnalysis));
      } catch (err) {
        console.error('Error parsing saved AI analysis:', err);
      }
    }
  }, []);

  if (loading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className={styles.container}>
        <Head>
          <title>评估结果 | EduPlan AI</title>
        </Head>
        <main className={styles.main}>
          <div className={styles.card}>
            <h1 className={styles.title}>未找到评估数据</h1>
            <p className={styles.description}>
              您需要先完成评估才能查看结果。
            </p>
            <Link href="/assessment" className={styles.button}>
              开始评估
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const learningStyle = getLearningStyleAnalysis();

  return (
    <div className={styles.container}>
      <Head>
        <title>评估结果 | EduPlan AI</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>您的教育评估结果</h1>
          
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

          {learningStyle && (
            <section className={styles.section}>
              <h2>学习风格分析</h2>
              <p className={styles.description}>
                {assessmentData.name || '学生'}的主要学习风格是
                <strong className={styles.highlight}>
                  {learningStyle.primaryStyle}（{learningStyle.primaryScore}/5）
                </strong>
                {learningStyle.secondaryStyle && 
                  <>
                    ，次要学习风格是
                    <strong className={styles.highlight}>
                      {learningStyle.secondaryStyle}（{learningStyle.secondaryScore}/5）
                    </strong>
                  </>
                }。
              </p>

              <div className={styles.styleChart}>
                {Object.entries(learningStyle.styles).map(([style, score]) => (
                  <div key={style} className={styles.styleBar}>
                    <span className={styles.styleLabel}>{getStyleName(style)}</span>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.barFill} 
                        style={{width: `${(score / 5) * 100}%`}}
                      ></div>
                    </div>
                    <span className={styles.styleScore}>{score}/5</span>
                  </div>
                ))}
              </div>

              <div className={styles.recommendations}>
                <h3>学习建议</h3>
                <ul className={styles.recommendationList}>
                  {getStyleRecommendations(Object.entries(learningStyle.styles)
                    .sort((a, b) => b[1] - a[1])[0][0])
                    .map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                </ul>
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2>优势与兴趣</h2>
            <div className={styles.strengthsInterests}>
              <div className={styles.strengthsBox}>
                <h3>优势学科/领域</h3>
                <p>{assessmentData.strengths || '未提供'}</p>
              </div>
              <div className={styles.interestsBox}>
                <h3>兴趣爱好</h3>
                <p>{assessmentData.interests || '未提供'}</p>
              </div>
            </div>
          </section>

          {!aiAnalysis && !isGeneratingAI && (
            <section className={styles.section}>
              <h2>AI教育规划</h2>
              <p className={styles.description}>
                基于您提供的信息，我们可以生成详细的AI教育规划分析。
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <button 
                onClick={generateAIPlan}
                className={styles.button}
                disabled={isGeneratingAI}
              >
                生成AI教育规划
              </button>
            </section>
          )}

          {isGeneratingAI && (
            <section className={styles.section}>
              <h2>AI教育规划</h2>
              <div className={styles.loading}>
                正在生成AI教育规划，请稍候...
                <div className={styles.spinner}></div>
              </div>
            </section>
          )}

          {aiAnalysis && (
            <>
              <section className={styles.section}>
                <h2>AI学习风格分析</h2>
                <p>{aiAnalysis.learningStyleAnalysis}</p>
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

              <div className={styles.downloadSection}>
                <button className={styles.downloadButton}>
                  下载完整报告 (PDF)
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

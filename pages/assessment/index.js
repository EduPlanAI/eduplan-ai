import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Assessment.module.css';

export default function AssessmentStart() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  function handleStart() {
    if (!user) {
      // 如果用户未登录，重定向到登录页
      router.push('/auth/signin?redirect=/assessment');
      return;
    }

    // 已登录用户，开始评估流程
    router.push('/assessment/step/1');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>开始教育评估 | EduPlan AI</title>
        <meta name="description" content="开始您的个性化教育评估，获取AI驱动的教育规划" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>开始您的教育规划评估</h1>
          <p className={styles.description}>
            通过完成这份评估，我们的AI将帮助您为孩子制定个性化的教育规划。
            评估大约需要10-15分钟完成。
          </p>

          <div className={styles.infoBox}>
            <h3>评估内容包括：</h3>
            <ul>
              <li>学生基本情况</li>
              <li>学习风格和偏好</li>
              <li>兴趣和特长</li>
              <li>教育目标和期望</li>
            </ul>
          </div>

          <button
            className={styles.button}
            onClick={handleStart}
            disabled={isStarting || loading}
          >
            {isStarting ? '准备中...' : '开始评估'}
          </button>

          <p className={styles.note}>
            您的所有信息都将严格保密，仅用于生成个性化教育规划。
          </p>
        </div>
      </main>
    </div>
  );
}

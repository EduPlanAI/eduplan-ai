import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>EduPlan AI - 个性化教育规划助手</title>
        <meta name="description" content="基于AI的中澳双视角教育规划助手，为您的孩子定制个性化学习路径" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          为您的孩子打造 <span className={styles.highlight}>个性化教育路径</span>
        </h1>
        <p className={styles.description}>
          EduPlan AI 结合中国和澳洲教育体系优势，利用人工智能为您的孩子创建量身定制的教育规划
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/auth/signin" className={styles.primaryButton}>
            开始评估
          </Link>
          <Link href="/about" className={styles.secondaryButton}>
            了解更多
          </Link>
        </div>

        <section className={styles.features}>
          <h2>我们的优势</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>中澳双视角</h3>
              <p>结合中澳两国教育体系优势，为孩子提供全球化视野</p>
            </div>
            <div className={styles.featureCard}>
              <h3>个性化分析</h3>
              <p>基于学习风格和个人特点，定制教育方案</p>
            </div>
            <div className={styles.featureCard}>
              <h3>AI驱动洞察</h3>
              <p>运用先进人工智能分析海量教育数据，提供专业建议</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} EduPlan AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../../context/AuthContext';
import styles from '../../../styles/Assessment.module.css';

// 评估问题配置
const assessmentSteps = [
  {
    id: 1,
    title: '学生基本信息',
    description: '请提供学生的基本信息',
    questions: [
      { id: 'name', label: '学生姓名', type: 'text', required: true },
      { id: 'age', label: '学生年龄', type: 'number', required: true },
      { id: 'grade', label: '当前年级', type: 'text', required: true },
      { id: 'school', label: '当前学校', type: 'text', required: true }
    ]
  },
  {
    id: 2,
    title: '学习风格评估',
    description: '请评估学生在以下学习方式中的偏好程度',
    questions: [
      { 
        id: 'visual', 
        label: '视觉学习（通过图像、视频等学习）', 
        type: 'range', 
        min: 1, 
        max: 5, 
        required: true 
      },
      { 
        id: 'auditory', 
        label: '听觉学习（通过听讲、讨论等学习）', 
        type: 'range', 
        min: 1, 
        max: 5, 
        required: true 
      },
      { 
        id: 'reading', 
        label: '阅读学习（通过阅读材料学习）', 
        type: 'range', 
        min: 1, 
        max: 5, 
        required: true 
      },
      { 
        id: 'kinesthetic', 
        label: '动手学习（通过实践、体验学习）', 
        type: 'range', 
        min: 1, 
        max: 5, 
        required: true 
      }
    ]
  },
  {
    id: 3,
    title: '优势与兴趣',
    description: '请告诉我们学生的学科优势和兴趣爱好',
    questions: [
      { id: 'strengths', label: '学生的优势学科/领域', type: 'textarea', required: true },
      { id: 'weaknesses', label: '学生需要提升的学科/领域', type: 'textarea', required: true },
      { id: 'interests', label: '学生的兴趣爱好', type: 'textarea', required: true }
    ]
  },
  {
    id: 4,
    title: '教育目标',
    description: '请分享您对学生教育的期望和目标',
    questions: [
      { id: 'shortGoals', label: '短期教育目标（1-2年）', type: 'textarea', required: true },
      { id: 'longGoals', label: '长期教育目标', type: 'textarea', required: true },
      { 
        id: 'pathPreference', 
        label: '教育路径偏好', 
        type: 'select', 
        options: [
          { value: 'china', label: '中国教育体系' },
          { value: 'australia', label: '澳洲教育体系' },
          { value: 'mixed', label: '中澳混合路径' }
        ],
        required: true 
      }
    ]
  }
];

export default function AssessmentStep() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载当前步骤数据
  useEffect(() => {
    if (id) {
      const stepId = parseInt(id);
      const step = assessmentSteps.find(s => s.id === stepId);
      if (step) {
        setCurrentStep(step);
        
        // 从localStorage加载之前保存的答案
        const savedData = localStorage.getItem('eduplan_assessment');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setSavedAnswers(parsedData);
          
          // 预填当前步骤的答案
          const stepAnswers = {};
          step.questions.forEach(q => {
            if (parsedData[q.id]) {
              stepAnswers[q.id] = parsedData[q.id];
            }
          });
          setAnswers(stepAnswers);
        }
      } else {
        router.push('/assessment');
      }
    }
  }, [id, router]);

  // 验证用户是否登录
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/assessment');
    }
  }, [user, loading, router]);

  // 处理输入变化
  function handleInputChange(e) {
    const { id, value, type } = e.target;
    let finalValue = value;
    
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    setAnswers(prev => ({
      ...prev,
      [id]: finalValue
    }));
  }

  // 处理表单提交
  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 合并所有答案
    const allAnswers = {
      ...savedAnswers,
      ...answers
    };
    
    // 保存到localStorage
    localStorage.setItem('eduplan_assessment', JSON.stringify(allAnswers));
    
    // 导航到下一步或结果页面
    const currentStepIndex = assessmentSteps.findIndex(s => s.id === currentStep.id);
    if (currentStepIndex < assessmentSteps.length - 1) {
      router.push(`/assessment/step/${assessmentSteps[currentStepIndex + 1].id}`);
    } else {
      router.push('/assessment/results');
    }
  }

  // 处理返回上一步
  function handleBack() {
    const currentStepIndex = assessmentSteps.findIndex(s => s.id === currentStep.id);
    if (currentStepIndex > 0) {
      router.push(`/assessment/step/${assessmentSteps[currentStepIndex - 1].id}`);
    } else {
      router.push('/assessment');
    }
  }

  if (loading || !currentStep) {
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{currentStep.title} | EduPlan AI 评估</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(currentStep.id / assessmentSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>
              步骤 {currentStep.id} / {assessmentSteps.length}
            </div>
          </div>

          <h1 className={styles.title}>{currentStep.title}</h1>
          <p className={styles.description}>{currentStep.description}</p>

          <form onSubmit={handleSubmit}>
            {currentStep.questions.map((question) => (
              <div key={question.id} className={styles.formGroup}>
                <label htmlFor={question.id} className={styles.label}>
                  {question.label}
                  {question.required && <span className={styles.required}>*</span>}
                </label>

                {question.type === 'text' && (
                  <input
                    type="text"
                    id={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    required={question.required}
                    className={styles.input}
                  />
                )}

                {question.type === 'number' && (
                  <input
                    type="number"
                    id={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    required={question.required}
                    className={styles.input}
                  />
                )}

                {question.type === 'textarea' && (
                  <textarea
                    id={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    required={question.required}
                    className={styles.textarea}
                    rows={4}
                  />
                )}

                {question.type === 'select' && (
                  <select
                    id={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    required={question.required}
                    className={styles.select}
                  >
                    <option value="">请选择</option>
                    {question.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === 'range' && (
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      id={question.id}
                      min={question.min}
                      max={question.max}
                      value={answers[question.id] || question.min}
                      onChange={handleInputChange}
                      required={question.required}
                      className={styles.range}
                    />
                    <div className={styles.rangeLabels}>
                      <span>低 ({question.min})</span>
                      <span>高 ({question.max})</span>
                    </div>
                    <div className={styles.rangeValue}>
                      {answers[question.id] || question.min}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleBack}
                className={styles.backButton}
              >
                上一步
              </button>
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存中...' : 
                  currentStep.id === assessmentSteps.length ? '完成评估' : '下一步'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

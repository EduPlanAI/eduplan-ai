/**
 * 生成教育规划分析
 * @param {Object} assessmentData - 评估数据
 */
export async function generateEducationPlan(assessmentData) {
  try {
    // 构建提示信息
    const prompt = `
你是一名专业的教育规划顾问，专注于中国和澳洲的教育系统。请根据以下学生信息，生成一份详细的教育规划分析：

学生基本信息:
- 姓名: ${assessmentData.name || '未提供'}
- 年龄: ${assessmentData.age || '未提供'}
- 年级: ${assessmentData.grade || '未提供'}
- 当前学校: ${assessmentData.school || '未提供'}

学习风格:
- 视觉学习: ${assessmentData.visual || 0}/5
- 听觉学习: ${assessmentData.auditory || 0}/5
- 阅读学习: ${assessmentData.reading || 0}/5
- 动手学习: ${assessmentData.kinesthetic || 0}/5

优势学科/领域:
${assessmentData.strengths || '未提供'}

待提升学科/领域:
${assessmentData.weaknesses || '未提供'}

兴趣爱好:
${assessmentData.interests || '未提供'}

教育目标:
- 短期目标: ${assessmentData.shortGoals || '未提供'}
- 长期目标: ${assessmentData.longGoals || '未提供'}
- 教育路径偏好: ${assessmentData.pathPreference || '未提供'}

请提供以下内容：

1. 学习风格分析 (200字)：分析学生的主要学习风格特点和学习方式建议。

2. 中国教育路径规划 (300字)：基于学生特点，提供在中国教育体系下的发展建议，包括关键阶段规划和学习方法。

3. 澳洲教育路径规划 (300字)：基于学生特点，提供在澳洲教育体系下的发展建议，包括可能的学校选择和学习方法。

4. 个性化建议 (200字)：针对该学生的独特情况，提供最关键的教育建议。

5. 关键决策点 (列出3个)：未来教育发展中的重要时间点和决策，每个决策点包括时间、描述和建议。

请确保建议具体、实用，充分考虑学生的年龄、学习风格和兴趣特点。
`;

    // 使用 fetch API 调用 OpenAI API
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('OpenAI API 返回了无效的响应');
    }

    // 解析响应
    const analysis = parseEducationPlanResponse(data.choices[0].text);
    
    return analysis;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('无法生成教育规划分析');
  }
}

/**
 * 解析 AI 响应，提取各个部分
 */
function parseEducationPlanResponse(text) {
  // 初始化结果对象
  const result = {
    learningStyleAnalysis: '',
    chinaEducationPath: '',
    australiaEducationPath: '',
    personalizedRecommendations: '',
    keyDecisionPoints: []
  };

  // 查找学习风格分析
  const learningStyleMatch = text.match(/学习风格分析[\s\S]*?(?=\n\n\d+\.|\n\n中国教育)/i);
  if (learningStyleMatch) {
    result.learningStyleAnalysis = learningStyleMatch[0].replace(/学习风格分析[：:]\s*/i, '').trim();
  }

  // 查找中国教育路径规划
  const chinaPathMatch = text.match(/中国教育路径规划[\s\S]*?(?=\n\n\d+\.|\n\n澳洲教育)/i);
  if (chinaPathMatch) {
    result.chinaEducationPath = chinaPathMatch[0].replace(/中国教育路径规划[：:]\s*/i, '').trim();
  }

  // 查找澳洲教育路径规划
  const australiaPathMatch = text.match(/澳洲教育路径规划[\s\S]*?(?=\n\n\d+\.|\n\n个性化建议)/i);
  if (australiaPathMatch) {
    result.australiaEducationPath = australiaPathMatch[0].replace(/澳洲教育路径规划[：:]\s*/i, '').trim();
  }

  // 查找个性化建议
  const recommendationsMatch = text.match(/个性化建议[\s\S]*?(?=\n\n\d+\.|\n\n关键决策点)/i);
  if (recommendationsMatch) {
    result.personalizedRecommendations = recommendationsMatch[0].replace(/个性化建议[：:]\s*/i, '').trim();
  }

  // 查找关键决策点
  const decisionPointsSection = text.match(/关键决策点[\s\S]*$/i);
  if (decisionPointsSection) {
    const decisionPointsText = decisionPointsSection[0].replace(/关键决策点[：:]\s*/i, '').trim();
    
    // 寻找决策点模式
    const decisionPointPattern = /(\d+)[\.、]([^:：]*)[：:]([\s\S]*?)(?=\n\n\d+[\.、]|$)/g;
    let match;
    while ((match = decisionPointPattern.exec(decisionPointsText)) !== null) {
      result.keyDecisionPoints.push({
        id: match[1].trim(),
        title: match[2].trim(),
        description: match[3].trim()
      });
    }
  }

  return result;
}

  return result;
}

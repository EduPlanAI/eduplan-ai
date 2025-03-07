import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 获取认证会话
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return res.status(401).json({ error: '未授权访问' });
    }

    const userId = session.user.id;
    const { assessmentData, aiAnalysis } = req.body;
    
    if (!assessmentData || !aiAnalysis) {
      return res.status(400).json({ error: '缺少必要数据' });
    }

    // 创建计划标题
    const planTitle = `${assessmentData.name || '学生'}的教育规划`;
    
    // 获取当前日期
    const createdAt = new Date().toISOString();

    // 将计划保存到数据库
    const { data, error } = await supabase
      .from('education_plans')
      .insert([
        { 
          user_id: userId,
          title: planTitle,
          assessment_data: assessmentData,
          ai_analysis: aiAnalysis,
          created_at: createdAt,
          path_preference: assessmentData.pathPreference || 'mixed'
        }
      ])
      .select();
    
    if (error) {
      console.error('保存计划错误:', error);
      return res.status(500).json({ error: '保存计划失败', details: error.message });
    }
    
    return res.status(200).json({ success: true, plan: data[0] });
  } catch (error) {
    console.error('保存计划时出错:', error);
    return res.status(500).json({ error: '服务器错误', details: error.message });
  }
}

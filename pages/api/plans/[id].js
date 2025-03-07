import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: '缺少计划ID' });
  }

  try {
    // 获取认证会话
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return res.status(401).json({ error: '未授权访问' });
    }

    const userId = session.user.id;
    
    // 从数据库中获取特定计划
    const { data, error } = await supabase
      .from('education_plans')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('获取计划错误:', error);
      return res.status(500).json({ error: '获取计划失败', details: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: '未找到计划' });
    }
    
    return res.status(200).json({ success: true, plan: data });
  } catch (error) {
    console.error('获取计划时出错:', error);
    return res.status(500).json({ error: '服务器错误', details: error.message });
  }
}

import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 获取认证会话
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return res.status(401).json({ error: '未授权访问' });
    }

    const userId = session.user.id;
    
    // 从数据库中获取用户的计划
    const { data, error } = await supabase
      .from('education_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取计划错误:', error);
      return res.status(500).json({ error: '获取计划失败', details: error.message });
    }
    
    return res.status(200).json({ success: true, plans: data });
  } catch (error) {
    console.error('获取计划时出错:', error);
    return res.status(500).json({ error: '服务器错误', details: error.message });
  }
}

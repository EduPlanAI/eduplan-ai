import { generateEducationPlan } from '../../../lib/ai/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const assessmentData = req.body;
    
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    // 调用 OpenAI 生成教育规划
    const analysis = await generateEducationPlan(assessmentData);
    
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error('Error generating education plan:', error);
    return res.status(500).json({ error: 'Failed to generate education plan', details: error.message });
  }
}

/**
 * PDF 生成工具函数
 * 注意：此文件依赖 jspdf 和 html2canvas 库
 * 需要运行: npm install jspdf html2canvas 
 */

/**
 * 生成教育计划 PDF
 * @param {Object} plan - 教育计划数据
 * @param {string} elementId - 要转换成 PDF 的 DOM 元素 ID
 */
export async function generatePlanPDF(plan, elementId) {
  // 动态导入 jspdf 和 html2canvas
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas')
  ]);

  try {
    // 获取要转换的元素
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('找不到指定的 DOM 元素');
    }

    // 创建一个临时容器，用于生成 PDF (避免样式影响)
    const container = document.createElement('div');
    container.innerHTML = element.innerHTML;
    container.style.padding = '40px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.fontSize = '12px';
    container.style.width = '750px'; // A4 宽度 (约 210mm)

    // 添加页眉
    const header = document.createElement('div');
    header.style.marginBottom = '20px';
    header.style.borderBottom = '1px solid #ddd';
    header.style.paddingBottom = '10px';

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = plan.title;
    headerTitle.style.fontSize = '18px';
    headerTitle.style.marginBottom = '5px';

    const headerDate = document.createElement('p');
    headerDate.textContent = `创建日期: ${new Date(plan.created_at).toLocaleDateString('zh-CN')}`;
    headerDate.style.fontSize = '12px';
    headerDate.style.color = '#666';

    header.appendChild(headerTitle);
    header.appendChild(headerDate);
    container.insertBefore(header, container.firstChild);

    // 添加页脚
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.borderTop = '1px solid #ddd';
    footer.style.paddingTop = '10px';
    footer.style.textAlign = 'center';
    footer.style.fontSize = '10px';
    footer.style.color = '#666';
    footer.textContent = `EduPlan AI | ${plan.title} | ${new Date().toLocaleDateString('zh-CN')}`;
    container.appendChild(footer);

    // 将临时容器添加到文档中
    document.body.appendChild(container);

    // 使用 html2canvas 将内容转换为图像
    const canvas = await html2canvas(container, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // 从文档中移除临时容器
    document.body.removeChild(container);

    // 计算 PDF 尺寸
    const imgWidth = 210; // A4 宽度 (mm)
    const pageHeight = 297; // A4 高度 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // 创建 PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // 添加第一页
    pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，则添加更多页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 保存 PDF
    pdf.save(`${plan.title.replace(/\s+/g, '_')}.pdf`);

    return true;
  } catch (error) {
    console.error('生成 PDF 时出错:', error);
    throw error;
  }
}

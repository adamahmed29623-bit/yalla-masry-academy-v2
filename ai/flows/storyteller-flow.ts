/**
 * محرك سرد القصص في الأكاديمية الملكية.
 */

export async function storytellerFlow(prompt: string): Promise<string> {
  if (!prompt) {
    throw new Error("يجب إدخال نص لبدء القصة");
  }

  // الرد باللهجة المصرية الفريدة التي خططتِ لها
  const response = `أهلاً بك في الأكاديمية الملكية! قصتك عن "${prompt}" يتم تحضيرها الآن بلمسة ملكية مصرية... حكاية من قلب التاريخ المصري العظيم.`;
  
  return response;
}

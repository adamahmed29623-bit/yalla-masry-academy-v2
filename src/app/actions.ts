"use server";

import { storytellerFlow } from "@/ai/flows/storyteller-flow";
import { generateSecurityRules } from "@/ai/flows/generate-security-rules";

/**
 * تنفيذ تدفق القصص لتعليم اللهجة المصرية
 */
export async function handleStorytellerAction(userInput: string) {
  try {
    if (!userInput) throw new Error("Input is required");
    
    const result = await storytellerFlow(userInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Storyteller Flow Error:", error);
    return { success: false, error: "حدث خطأ أثناء معالجة القصة، حاول مرة أخرى." };
  }
}

/**
 * تحديث قواعد الأمان والتحقق من الصلاحيات
 */
export async function updateSecurityRulesAction(context: string) {
  try {
    const rules = await generateSecurityRules(context);
    return { success: true, rules };
  } catch (error) {
    console.error("Security Update Error:", error);
    return { success: false, error: "فشل في تحديث إعدادات الأمان." };
  }
}

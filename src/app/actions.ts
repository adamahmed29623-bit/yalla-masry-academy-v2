{"use server";

import { generateSecurityRules } from "@/ai/flows/generate-security-rules";
import { suggestRuleImprovements } from "@/ai/flows/suggest-rule-improvements";
import { handleAdventure } from "@/ai/flows/smart-adventure-flow";
import { z } from "zod";

const generateRulesSchema = z.object({
  dataStructure: z.string().min(10, { message: "Please describe your data structure in more detail." }),
  accessPatterns: z.string().min(10, { message: "Please describe your access patterns in more detail." }),
});

export async function handleGenerateRules(prevState: any, formData: FormData) {
  const validatedFields = generateRulesSchema.safeParse({
    dataStructure: formData.get('dataStructure'),
    accessPatterns: formData.get('accessPatterns'),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateSecurityRules({
      dataStructureDescription: validatedFields.data.dataStructure,
      accessPatternsDescription: validatedFields.data.accessPatterns,
    });
    return { message: "success", rules: result.securityRules };
  } catch (error) {
    return { message: "AI generation failed. Please try again.", errors: {} };
  }
}

const improveRulesSchema = z.object({
  existingRules: z.string().min(10, { message: "Please provide your existing rules." }),
  schemaDescription: z.string().min(10, { message: "Please describe your schema in more detail." }),
});

export async function handleSuggestImprovements(prevState: any, formData: FormData) {
  const validatedFields = improveRulesSchema.safeParse({
    existingRules: formData.get('existingRules'),
    schemaDescription: formData.get('schemaDescription'),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await suggestRuleImprovements({
      existingRules: validatedFields.data.existingRules,
      schemaDescription: validatedFields.data.schemaDescription,
    });
    return { message: "success", ...result };
  } catch (error) {
    console.error(error);
    return { message: "AI suggestion failed. Please try again.", errors: {} };
  }
}

const adventureSchema = z.object({
  userInput: z.string(),
  taskType: z.enum(['challenge', 'correction']),
});

export async function handleSmartAdventure(prevState: any, formData: FormData) {
    const validatedFields = adventureSchema.safeParse({
      userInput: formData.get('userInput'),
      taskType: formData.get('taskType'),
    });

    if (!validatedFields.success) {
        return { message: "Invalid input.", text: "" };
    }

    try {
        const result = await handleAdventure(validatedFields.data);
        return { message: "success", text: result.text };
    } catch (error) {
        console.error(error);
        return { message: "AI generation failed.", text: "حصلت مشكلة في الاتصال بـ Gemini، حاول تاني يا بطل!" };
    }
}
}
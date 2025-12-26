{"use server";

import { generateSecurityRules } from "@/ai/flows/generate-security-rules";
import { suggestRuleImprovements } from "@/ai/flows/suggest-rule-improvements";
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

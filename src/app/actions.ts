'use server';

import { generateSecurityRules } from "@/ai/flows/generate-security-rules";
import { suggestRuleImprovements } from "@/ai/flows/suggest-rule-improvements";
import { handleAdventure } from "@/ai/flows/smart-adventure-flow";
import { getAnimalSoundFlow } from "@/ai/flows/animal-sound-flow";
// The critical line is below
import { getStorytellerAudio, StorytellerInputSchema } from "../../ai/flows/storyteller-flow";
import { getDialogueEvaluationFlow, DialogueEvaluationInputSchema, DialogueEvaluationOutput } from "@/ai/flows/dialogue-evaluation-flow";
import { z } from "zod";

// ... (rest of the file remains the same)
// ... (باقي محتوى الملف يبقى كما هو)

// I will provide the full correct file just in case.
// سأوفر الملف الكامل الصحيح احتياطياً

export async function handleGenerateRules(prevState: any, formData: FormData) {
  const validatedFields = z.object({
    dataStructure: z.string().min(10, { message: "Please describe your data structure in more detail." }),
    accessPatterns: z.string().min(10, { message: "Please describe your access patterns in more detail." }),
  }).safeParse({
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

export async function handleSuggestImprovements(prevState: any, formData: FormData) {
  const validatedFields = z.object({
    existingRules: z.string().min(10, { message: "Please provide your existing rules." }),
    schemaDescription: z.string().min(10, { message: "Please describe your schema in more detail." }),
  }).safeParse({
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

export async function handleSmartAdventure(prevState: any, formData: FormData) {
    const validatedFields = z.object({
      userInput: z.string(),
      taskType: z.enum(['challenge', 'correction']),
    }).safeParse({
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

export async function getAnimalSound(
  input: z.infer<typeof z.object({ animalName: z.string() })>
) {
  const validatedFields = z.object({ animalName: z.string() }).safeParse(input);
  if (!validatedFields.success) {
    throw new Error('Invalid input for getAnimalSound');
  }
  return await getAnimalSoundFlow(validatedFields.data);
}

export async function handleGetStory(input: z.infer<typeof StorytellerInputSchema>) {
    const validatedFields = StorytellerInputSchema.safeParse(input);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid input" };
    }
    try {
        const result = await getStorytellerAudio(validatedFields.data);
        return { success: true, audioDataUri: result.media };
    } catch (e) {
        console.error("Storyteller error:", e);
        return { success: false, error: "Failed to generate audio story." };
    }
}

export async function getDialogueEvaluation(
    input: z.infer<typeof DialogueEvaluationInputSchema>
): Promise<{ success: boolean; data?: DialogueEvaluationOutput; error?: string }> {
    const validatedFields = DialogueEvaluationInputSchema.safeParse(input);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid input for dialogue evaluation" };
    }
    try {
        const result = await getDialogueEvaluationFlow(validatedFields.data);
        return { success: true, data: result };
    } catch (e) {
        console.error("Dialogue Evaluation error:", e);
        return { success: false, error: "Failed to get AI evaluation." };
    }
}

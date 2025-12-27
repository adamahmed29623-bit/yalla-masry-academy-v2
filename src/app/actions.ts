'use server';

import { z } from 'zod';
import {
  generateSecurityRules as genRules,
  GenerateSecurityRulesInput,
  GenerateSecurityRulesOutput,
} from '@/ai/flows/generate-security-rules';
import {
  suggestRuleImprovements as suggestRules,
  SuggestRuleImprovementsInput,
  SuggestRuleImprovementsOutput,
} from '@/ai/flows/suggest-rule-improvements';
import {
  handleAdventure as runAdventure,
  AdventureInput,
  AdventureOutput,
} from '@/ai/flows/smart-adventure-flow';
import { 
  getAnimalSoundFlow,
  AnimalSoundInput,
  AnimalSoundOutput
} from '@/ai/flows/animal-sound-flow';
import {
  getDialogueEvaluationFlow,
  DialogueEvaluationInput,
  DialogueEvaluationOutput,
  DialogueEvaluationInputSchema,
} from '@/ai/flows/dialogue-evaluation-flow';


// --- Validation Schemas ---

const GenerateRulesSchema = z.object({
  dataStructure: z.string().min(10, { message: 'Data structure description is too short.' }),
  accessPatterns: z.string().min(10, { message: 'Access patterns description is too short.' }),
});

const SuggestImprovementsSchema = z.object({
    existingRules: z.string().min(20, {message: "Existing rules seem too short to analyze."}),
    schemaDescription: z.string().min(10, {message: "Please provide a more detailed schema description."})
});

const SmartAdventureSchema = z.object({
  userInput: z.string().optional(),
  taskType: z.enum(['challenge', 'correction']),
});


// --- Server Action for Generating Rules ---

type GenerateState = {
  message: string;
  rules?: string;
  errors?: {
    dataStructure?: string[];
    accessPatterns?: string[];
  };
};

export async function handleGenerateRules(prevState: GenerateState, formData: FormData): Promise<GenerateState> {
  const validatedFields = GenerateRulesSchema.safeParse({
    dataStructure: formData.get('dataStructure'),
    accessPatterns: formData.get('accessPatterns'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const input: GenerateSecurityRulesInput = {
      dataStructureDescription: validatedFields.data.dataStructure,
      accessPatternsDescription: validatedFields.data.accessPatterns,
    };
    const result: GenerateSecurityRulesOutput = await genRules(input);
    return { message: 'success', rules: result.securityRules };
  } catch (e: any) {
    return { message: `AI generation failed: ${e.message}` };
  }
}


// --- Server Action for Suggesting Improvements ---

type ImproveState = {
    message: string;
    improvedRules?: string;
    vulnerabilitiesIdentified?: string[];
    performanceSuggestions?: string[];
    errors?: {
        existingRules?: string[];
        schemaDescription?: string[];
    };
};

export async function handleSuggestImprovements(prevState: ImproveState, formData: FormData): Promise<ImproveState> {
    const validatedFields = SuggestImprovementsSchema.safeParse({
        existingRules: formData.get('existingRules'),
        schemaDescription: formData.get('schemaDescription'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const input: SuggestRuleImprovementsInput = {
            existingRules: validatedFields.data.existingRules,
            schemaDescription: validatedFields.data.schemaDescription,
        };
        const result: SuggestRuleImprovementsOutput = await suggestRules(input);
        return { 
            message: 'success', 
            improvedRules: result.improvedRules,
            vulnerabilitiesIdentified: result.vulnerabilitiesIdentified,
            performanceSuggestions: result.performanceSuggestions
        };
    } catch (e: any) {
        return { message: `AI suggestion failed: ${e.message}` };
    }
}

// --- Server Action for Smart Adventure ---

type AdventureState = {
  message: string;
  text?: string;
  error?: string;
};

export async function handleSmartAdventure(prevState: AdventureState, formData: FormData): Promise<AdventureState> {
    const validatedFields = SmartAdventureSchema.safeParse({
        userInput: formData.get('userInput'),
        taskType: formData.get('taskType'),
    });

    if (!validatedFields.success) {
        return { message: 'error', error: 'Invalid task type.' };
    }

    try {
        const input: AdventureInput = {
            userInput: validatedFields.data.userInput || '',
            taskType: validatedFields.data.taskType,
        };
        const result: AdventureOutput = await runAdventure(input);
        return { message: 'success', text: result.text };
    } catch (e: any) {
        return { message: 'error', error: `AI adventure failed: ${e.message}` };
    }
}


// --- Server Action for Animal Sounds ---

export async function getAnimalSound(
  input: AnimalSoundInput
): Promise<AnimalSoundOutput> {
  try {
    return await getAnimalSoundFlow(input);
  } catch (error) {
    console.error("Animal Sound Error:", error);
    throw new Error("فشل في الحصول على صوت الحيوان");
  }
}

// --- Server Action for Dialogue Evaluation ---

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

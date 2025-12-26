'use server';

/**
 * @fileOverview A Genkit flow for a smart AI adventure for learning Egyptian Arabic.
 * - handleAdventure: Main function to process user requests (challenge or correction).
 * - AdventureInput: Input type for the flow.
 * - AdventureOutput: Output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdventureInputSchema = z.object({
  userInput: z.string().describe("The text provided by the user."),
  taskType: z.enum(['challenge', 'correction']).describe("The type of task to perform."),
});
export type AdventureInput = z.infer<typeof AdventureInputSchema>;

const AdventureOutputSchema = z.object({
  text: z.string().describe("The AI-generated response, either a new challenge or a correction."),
});
export type AdventureOutput = z.infer<typeof AdventureOutputSchema>;


export async function handleAdventure(input: AdventureInput): Promise<AdventureOutput> {
  return smartAdventureFlow(input);
}


const challengePrompt = ai.definePrompt({
    name: 'challengePrompt',
    prompt: `You are an AI assistant for "Yalla Masry Academy," an app for learning Egyptian Arabic.
    Generate a new, short, and fun challenge for a student.
    The challenge should be a simple question, a sentence to translate, or a situation to respond to in Egyptian Arabic.
    Be creative and encouraging. Address the student as "يا بطل" or "يا بطلة".
    The challenge should be in Arabic.
    `,
});

const correctionPrompt = ai.definePrompt({
    name: 'correctionPrompt',
    input: { schema: z.object({ userInput: z.string() }) },
    prompt: `You are a friendly and encouraging Egyptian Arabic teacher at "Yalla Masry Academy."
    A student has submitted the following text for correction: "{{userInput}}".
    
    Your task is:
    1. Identify any mistakes in grammar, spelling, or appropriate word choice.
    2. Provide the corrected sentence or phrase in Egyptian Arabic.
    3. Briefly and simply explain the correction in Arabic, as if you're talking to a friend.
    4. Keep your feedback positive and motivating. Start with a phrase like "عاش يا بطل!" or "إجابة ممتازة، وفيه كام تعديل بسيط يخليها أحسن".
    
    Format your response clearly. For example:
    التصحيح: [The corrected sentence]
    الشرح: [Brief, simple explanation]
    `,
});


const smartAdventureFlow = ai.defineFlow(
  {
    name: 'smartAdventureFlow',
    inputSchema: AdventureInputSchema,
    outputSchema: AdventureOutputSchema,
  },
  async (input) => {
    
    if (input.taskType === 'challenge') {
      const { output } = await challengePrompt();
      return { text: output! };
    } else {
      if (!input.userInput) {
        return { text: "علشان أصحح لك، محتاج تكتب جملة الأول يا بطل!" };
      }
      const { output } = await correctionPrompt({ userInput: input.userInput });
      return { text: output! };
    }
  }
);

'use server';

/**
 * @fileOverview AI tool to suggest improvements to existing Firestore security rules.
 *
 * - suggestRuleImprovements - A function that suggests improvements to Firestore security rules.
 * - SuggestRuleImprovementsInput - The input type for the suggestRuleImprovements function.
 * - SuggestRuleImprovementsOutput - The return type for the suggestRuleImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRuleImprovementsInputSchema = z.object({
  existingRules: z
    .string()
    .describe('The existing Firestore security rules to be improved.'),
  schemaDescription: z
    .string()
    .describe('A description of the Firestore schema, including collection names and data structures.'),
});
export type SuggestRuleImprovementsInput = z.infer<
  typeof SuggestRuleImprovementsInputSchema
>;

const SuggestRuleImprovementsOutputSchema = z.object({
  improvedRules: z
    .string()
    .describe('The improved Firestore security rules, with comments explaining the changes.'),
  vulnerabilitiesIdentified: z
    .array(z.string())
    .describe('A list of potential vulnerabilities identified in the original rules.'),
  performanceSuggestions: z
    .array(z.string())
    .describe('A list of suggestions for improving the performance of the rules.'),
});
export type SuggestRuleImprovementsOutput = z.infer<
  typeof SuggestRuleImprovementsOutputSchema
>;

export async function suggestRuleImprovements(
  input: SuggestRuleImprovementsInput
): Promise<SuggestRuleImprovementsOutput> {
  return suggestRuleImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRuleImprovementsPrompt',
  input: {schema: SuggestRuleImprovementsInputSchema},
  output: {schema: SuggestRuleImprovementsOutputSchema},
  prompt: `You are a security expert specializing in securing Firestore databases.

You will be provided with the existing Firestore security rules and a description of the Firestore schema.

Your task is to identify potential vulnerabilities, suggest improvements to the rules, and provide performance suggestions.

Existing Rules:
{{{existingRules}}}

Schema Description:
{{{schemaDescription}}}

Respond with improved rules, a list of vulnerabilities identified, and performance suggestions. Make sure the improved rules are valid Firestore security rules.

Output in the following JSON format:
{
  "improvedRules": "...",
  "vulnerabilitiesIdentified": ["..."],
  "performanceSuggestions": ["..."]
}
`,
});

const suggestRuleImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestRuleImprovementsFlow',
    inputSchema: SuggestRuleImprovementsInputSchema,
    outputSchema: SuggestRuleImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

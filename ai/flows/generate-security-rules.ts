// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates Firestore security rules based on a description of the data structure and access patterns.
 *
 * - generateSecurityRules - A function that handles the generation of security rules.
 * - GenerateSecurityRulesInput - The input type for the generateSecurityRules function.
 * - GenerateSecurityRulesOutput - The return type for the generateSecurityRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSecurityRulesInputSchema = z.object({
  dataStructureDescription: z
    .string()
    .describe('A description of the data structure in Firestore.'),
  accessPatternsDescription: z
    .string()
    .describe('A description of the access patterns for the data in Firestore.'),
});
export type GenerateSecurityRulesInput = z.infer<typeof GenerateSecurityRulesInputSchema>;

const GenerateSecurityRulesOutputSchema = z.object({
  securityRules: z.string().describe('The generated Firestore security rules.'),
});
export type GenerateSecurityRulesOutput = z.infer<typeof GenerateSecurityRulesOutputSchema>;

export async function generateSecurityRules(
  input: GenerateSecurityRulesInput
): Promise<GenerateSecurityRulesOutput> {
  return generateSecurityRulesFlow(input);
}

const generateSecurityRulesPrompt = ai.definePrompt({
  name: 'generateSecurityRulesPrompt',
  input: {schema: GenerateSecurityRulesInputSchema},
  output: {schema: GenerateSecurityRulesOutputSchema},
  prompt: `You are an AI security expert specializing in generating secure Firestore security rules.

  Based on the provided data structure description and access patterns, generate Firestore security rules that follow the principle of least privilege.

  Data Structure Description: {{{dataStructureDescription}}}
  Access Patterns Description: {{{accessPatternsDescription}}}

  Ensure that the generated rules are secure, efficient, and easy to understand.
  Return only the security rules, with no additional explanations.
  Do not include the \"rules_version\" declaration.  We will add that ourselves.
  Consider common security vulnerabilities and prevent them in the rules.
  Use version 2 syntax.
  `,
});

const generateSecurityRulesFlow = ai.defineFlow(
  {
    name: 'generateSecurityRulesFlow',
    inputSchema: GenerateSecurityRulesInputSchema,
    outputSchema: GenerateSecurityRulesOutputSchema,
  },
  async input => {
    const {output} = await generateSecurityRulesPrompt(input);
    return output!;
  }
);

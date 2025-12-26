"use server";

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

// === Schemas ===
export const StorytellerInputSchema = z.object({
  title: z.string().describe("The title of the artifact."),
  description: z.string().describe("A brief description of the artifact."),
});
export type StorytellerInput = z.infer<typeof StorytellerInputSchema>;

const NarrativeOutputSchema = z.object({
    narrative: z.string().describe("A compelling, story-like narrative about the artifact in Arabic, suitable for a museum audio guide."),
});

export const SpeechOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI of the narrative."),
});
export type SpeechOutput = z.infer<typeof SpeechOutputSchema>;

// === Prompts ===
const narrativePrompt = ai.definePrompt({
  name: 'storytellerNarrativePrompt',
  input: { schema: StorytellerInputSchema },
  output: { schema: NarrativeOutputSchema },
  prompt: `You are a master storyteller and expert Egyptologist.
Artifact Title: "{{title}}"
Artifact Description: "{{description}}"
Create a 2-3 sentence narrative in formal Arabic. No titles, just text.`,
});

// === Utility Functions ===
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });
    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

// === Flows ===
export const storytellerAudioFlow = ai.defineFlow(
  {
    name: 'storytellerAudioFlow',
    inputSchema: StorytellerInputSchema,
    outputSchema: SpeechOutputSchema,
  },
  async (input) => {
    const narrativeResponse = await narrativePrompt(input);
    const narrative = narrativeResponse.output?.narrative;

    if (!narrative) throw new Error('Failed to generate a narrative.');

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash-exp'), // تأكدي من توافق اسم الموديل
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Arcturus' },
          },
        },
      },
      prompt: narrative,
    });

    if (!media) throw new Error('No media returned.');

    const pcmAudioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(pcmAudioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

// الدالة الأساسية التي يتم استدعاؤها
export async function getStorytellerAudio(input: StorytellerInput): Promise<SpeechOutput> {
    return await storytellerAudioFlow(input);
}

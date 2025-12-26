'use server';
/**
 * @fileOverview A Genkit flow for generating animal sounds using a TTS model.
 * - getAnimalSoundFlow: Main function to generate the audio.
 * - AnimalSoundInput: Input type for the flow.
 * - AnimalSoundOutput: Output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const AnimalSoundInputSchema = z.object({
  animalName: z.string().describe('The name of the animal to generate a sound for.'),
});
export type AnimalSoundInput = z.infer<typeof AnimalSoundInputSchema>;

const AnimalSoundOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type AnimalSoundOutput = z.infer<typeof AnimalSoundOutputSchema>;

// Helper function to convert PCM buffer to WAV base64 string
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

export const getAnimalSoundFlow = ai.defineFlow(
  {
    name: 'getAnimalSoundFlow',
    inputSchema: AnimalSoundInputSchema,
    outputSchema: AnimalSoundOutputSchema,
  },
  async ({ animalName }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: `Generate the sound of a ${animalName}.`,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Using a prebuilt voice as a base, the prompt will guide the sound.
            // There isn't a direct "animal sound" voice, so we rely on the model's ability to interpret the prompt.
            prebuiltVoiceConfig: { voiceName: 'Alloy' },
          },
        },
      },
    });

    if (!media || !media.url) {
      throw new Error('No audio media was returned from the model.');
    }

    // The media.url is a base64 data URI for the raw PCM audio data.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    // Convert the raw PCM data to a proper WAV format.
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

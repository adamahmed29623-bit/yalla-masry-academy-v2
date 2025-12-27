// السطر 88 وما بعده
export async function getAnimalSound(
  input: { animalName: string } // تبسيط المدخلات لتقليل الاعتماد على zod هنا مؤقتاً
) {
  try {
    return await getAnimalSoundFlow(input);
  } catch (error) {
    console.error("Animal Sound Error:", error);
    throw new Error("فشل في الحصول على صوت الحيوان");
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

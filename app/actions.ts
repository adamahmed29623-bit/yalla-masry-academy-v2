"use server";

import { generateSecurityRules } from "@/ai/flows/generate-security-rules";
import { suggestRuleImprovements } from "@/ai/flows/suggest-rule-improvements";
import { z } from "zod";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase/config";
import { revalidatePath } from "next/cache";


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

const addProjectSchema = z.object({
    name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
    projectId: z.string().min(3, { message: "Project ID must be at least 3 characters." }),
    apiKey: z.string().min(10, { message: "Please enter a valid API Key." }),
    authDomain: z.string().optional(),
    userId: z.string(),
});

export async function handleAddProject(prevState: any, formData: FormData) {
    const validatedFields = addProjectSchema.safeParse({
        name: formData.get('name'),
        projectId: formData.get('projectId'),
        apiKey: formData.get('apiKey'),
        authDomain: formData.get('authDomain'),
        userId: formData.get('userId'),
    });

    if (!validatedFields.success) {
        return {
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const app = initializeApp(firebaseConfig, 'server-app-for-actions');
        const firestore = getFirestore(app);
        const projectsCollection = collection(firestore, `users/${validatedFields.data.userId}/firebaseProjects`);
        
        await addDoc(projectsCollection, {
            name: validatedFields.data.name,
            projectId: validatedFields.data.projectId,
            apiKey: validatedFields.data.apiKey,
            authDomain: validatedFields.data.authDomain,
            userId: validatedFields.data.userId,
            id: validatedFields.data.projectId, // Using projectId as document id for easier lookup
        });

        revalidatePath('/dashboard');
        return { message: "success", errors: {} };

    } catch (error: any) {
        return { message: `Failed to create project: ${error.message}`, errors: {} };
    }
}

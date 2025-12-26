"use client"
import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleGenerateRules, handleSuggestImprovements } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const initialRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // By default, deny all reads and writes
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : children}</Button>;
}

export function RulesEditor() {
    const { toast } = useToast();
    const [rules, setRules] = useState(initialRules);
    const [generateOpen, setGenerateOpen] = useState(false);
    const [improveOpen, setImproveOpen] = useState(false);

    const [generateState, generateAction] = useFormState(handleGenerateRules, { message: "", errors: {} });
    const [improveState, improveAction] = useFormState(handleSuggestImprovements, { message: "", errors: {}, vulnerabilitiesIdentified: [], performanceSuggestions: [] });

    useEffect(() => {
        if (generateState.message === "success" && generateState.rules) {
            setRules(`rules_version = '2';\n${generateState.rules}`);
            setGenerateOpen(false);
            toast({ title: "Success", description: "New security rules have been generated." });
        } else if (generateState.message && generateState.message !== "success") {
            toast({ variant: "destructive", title: "Error", description: generateState.message });
        }
    }, [generateState, toast]);
    
    useEffect(() => {
        if (improveState.message === "success" && improveState.improvedRules) {
            setRules(improveState.improvedRules);
            setImproveOpen(false);
            toast({ title: "Success", description: "Security rules have been improved." });
        } else if (improveState.message && improveState.message !== "success") {
             toast({ variant: "destructive", title: "Error", description: improveState.message });
        }
    }, [improveState, toast]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle>Security Rules</CardTitle>
                            <CardDescription>Define access control for your Firestore data.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Generate with AI</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    <form action={generateAction}>
                                        <DialogHeader>
                                            <DialogTitle>Generate Security Rules</DialogTitle>
                                            <DialogDescription>Describe your data and how it should be accessed.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div>
                                                <Label htmlFor="dataStructure" className="mb-2 block">Data Structure</Label>
                                                <Textarea id="dataStructure" name="dataStructure" placeholder="e.g., We have a 'users' collection where each document is a user profile..." className="min-h-[100px]" />
                                                {generateState.errors?.dataStructure && <p className="text-sm text-destructive mt-1">{generateState.errors.dataStructure[0]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="accessPatterns" className="mb-2 block">Access Patterns</Label>
                                                <Textarea id="accessPatterns" name="accessPatterns" placeholder="e.g., Users can read their own profile. Only admins can write to the 'admin' field..." className="min-h-[100px]" />
                                                {generateState.errors?.accessPatterns && <p className="text-sm text-destructive mt-1">{generateState.errors.accessPatterns[0]}</p>}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <SubmitButton>Generate Rules</SubmitButton>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={improveOpen} onOpenChange={setImproveOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Improve with AI</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    <form action={improveAction}>
                                        <DialogHeader>
                                            <DialogTitle>Improve Security Rules</DialogTitle>
                                            <DialogDescription>Get AI-powered suggestions for your existing rules.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <input type="hidden" name="existingRules" value={rules} />
                                            <div>
                                                <Label htmlFor="schemaDescription" className="mb-2 block">Schema Description</Label>
                                                <Textarea id="schemaDescription" name="schemaDescription" placeholder="e.g., The 'posts' collection contains documents with 'authorId', 'content', and 'publishedAt' fields." className="min-h-[100px]" />
                                                {improveState.errors?.schemaDescription && <p className="text-sm text-destructive mt-1">{improveState.errors.schemaDescription[0]}</p>}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <SubmitButton>Get Suggestions</SubmitButton>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                        className="font-code h-[400px] text-sm font-mono"
                        placeholder="Enter your security rules here..."
                        aria-label="Firestore security rules editor"
                    />
                </CardContent>
                <CardFooter>
                  <Button>Publish</Button>
                </CardFooter>
            </Card>

            {improveState.message === 'success' && (
                <div className="space-y-4">
                    {improveState.vulnerabilitiesIdentified && improveState.vulnerabilitiesIdentified.length > 0 && (
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Vulnerabilities Identified</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc space-y-1 pl-5">
                                    {improveState.vulnerabilitiesIdentified.map((vuln, i) => <li key={i}>{vuln}</li>)}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    {improveState.performanceSuggestions && improveState.performanceSuggestions.length > 0 && (
                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Performance Suggestions</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc space-y-1 pl-5">
                                    {improveState.performanceSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, PlusCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { useState, useEffect } from 'react';
import { collection } from 'firebase/firestore';
import { useFormState, useFormStatus } from 'react-dom';
import { handleAddProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

function AddProjectForm({ userId }: { userId: string }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(handleAddProject, initialState);

    useEffect(() => {
        if (state.message === "success") {
            setOpen(false);
            toast({ title: "Success", description: "Project added successfully." });
        } else if (state.message && state.message !== 'Validation failed') {
            toast({ variant: "destructive", title: "Error", description: state.message });
        }
    }, [state, toast]);

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" disabled={pending}>
                {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create'}
            </Button>
        );
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={dispatch}>
                    <DialogHeader>
                        <DialogTitle>Create project</DialogTitle>
                        <DialogDescription>
                            Add a new Firebase project to manage.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <input type="hidden" name="userId" value={userId} />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" placeholder="My New Project" className="col-span-3" />
                        </div>
                        {state.errors?.name && <p className="text-sm text-destructive col-start-2 col-span-3">{state.errors.name[0]}</p>}
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="projectId" className="text-right">
                                Project ID
                            </Label>
                            <Input id="projectId" name="projectId" placeholder="my-new-project-123" className="col-span-3" />
                        </div>
                        {state.errors?.projectId && <p className="text-sm text-destructive col-start-2 col-span-3">{state.errors.projectId[0]}</p>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="apiKey" className="text-right">
                                API Key
                            </Label>
                            <Input id="apiKey" name="apiKey" placeholder="AIza..." className="col-span-3" />
                        </div>
                        {state.errors?.apiKey && <p className="text-sm text-destructive col-start-2 col-span-3">{state.errors.apiKey[0]}</p>}
                        
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="authDomain" className="text-right">
                                Auth Domain
                            </Label>
                            <Input id="authDomain" name="authDomain" placeholder="project.firebaseapp.com" className="col-span-3" />
                        </div>

                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function DashboardPage() {
    const { user, firestore, isUserLoading } = useFirebase();

    const projectsCollection = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/firebaseProjects`);
    }, [firestore, user]);

    const { data: projects, isLoading: isLoadingProjects } = useCollection(projectsCollection);

    if (isUserLoading || isLoadingProjects) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    if (!user) {
        return (
             <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold">Welcome to Yalla Masry Academy</h1>
                <p className="text-muted-foreground">Please sign in to manage your projects.</p>
            </div>
        )
    }
    
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">Projects</h1>
                <AddProjectForm userId={user.uid} />
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col transition-all hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-headline">{project.name}</CardTitle>
                                <CardDescription>{project.projectId}</CardDescription>
                            </CardHeader>
                             <CardContent className="flex-grow">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Globe className="mr-2 h-4 w-4" />
                                <span>{project.authDomain || 'N/A'}</span>
                              </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant="outline">
                                    <Link href={`/project/${project.projectId}/overview`}>Open Project</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No projects yet</h2>
                    <p className="text-muted-foreground mt-2">Click "Add Project" to get started.</p>
                </div>
            )}
        </div>
    );
}

"use client";

import { ProjectNav } from "@/components/project-nav"
import { useDoc, useFirebase, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const { firestore, user, isUserLoading } = useFirebase()

  const projectRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    // Note: The document ID is params.id which is the projectId
    return doc(firestore, `users/${user.uid}/firebaseProjects`, params.id)
  }, [firestore, user, params.id])

  const { data: project, isLoading, error } = useDoc(projectRef)
  
  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound()
  }

  return (
    <div>
      <div className="border-b bg-card">
        <div className="container py-4">
          <h1 className="text-2xl font-bold font-headline">{project.name}</h1>
          <p className="text-muted-foreground">{project.projectId}</p>
        </div>
      </div>
      <ProjectNav projectId={params.id} />
      <div className="container py-8">
        {children}
      </div>
    </div>
  )
}

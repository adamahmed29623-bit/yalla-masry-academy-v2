'use client';
import React, { useState, useEffect } from 'react';
import { useCollection, type WithId, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AdventureChallenge = {
  category: string;
  gulf_phrase: string;
  egyptian_phrase: string;
  explanation: string;
};

const ChallengeForm = ({ challenge, onSave, onCancel }: { challenge?: WithId<AdventureChallenge>, onSave: (c: AdventureChallenge) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<AdventureChallenge>({
    category: '',
    gulf_phrase: '',
    egyptian_phrase: '',
    explanation: '',
  });

  useEffect(() => {
    if (challenge) {
      setFormData(challenge);
    } else {
      setFormData({ category: '', gulf_phrase: '', egyptian_phrase: '', explanation: '' });
    }
  }, [challenge]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={formData.category} onChange={handleChange} placeholder="e.g., At the Airport" required />
      </div>
      <div>
        <Label htmlFor="gulf_phrase">Gulf Phrase</Label>
        <Input id="gulf_phrase" value={formData.gulf_phrase} onChange={handleChange} placeholder="What Nouf would say" required />
      </div>
      <div>
        <Label htmlFor="egyptian_phrase">Egyptian Phrase</Label>
        <Input id="egyptian_phrase" value={formData.egyptian_phrase} onChange={handleChange} placeholder="The correct Egyptian equivalent" required />
      </div>
      <div>
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea id="explanation" value={formData.explanation} onChange={handleChange} placeholder="Explain the nuance or difference" required />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Challenge</Button>
      </DialogFooter>
    </form>
  );
};

export default function AdventureChallengesAdminPage() {
  const firestore = useFirestore();
  const challengesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'adventure_challenges') : null, [firestore]);
  const { data: challenges, isLoading, error } = useCollection<AdventureChallenge>(challengesCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<WithId<AdventureChallenge> | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = async (challengeData: AdventureChallenge) => {
    if (!firestore) return;
    try {
      if (editingChallenge) {
        await updateDoc(doc(firestore, 'adventure_challenges', editingChallenge.id), challengeData);
        toast({ title: 'Challenge updated successfully!' });
      } else {
        await addDoc(collection(firestore, 'adventure_challenges'), challengeData);
        toast({ title: 'Challenge added successfully!' });
      }
      setIsDialogOpen(false);
      setEditingChallenge(undefined);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving challenge', description: (e as Error).message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await deleteDoc(doc(firestore, 'adventure_challenges', id));
      toast({ title: 'Challenge deleted successfully!' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting challenge', description: (e as Error).message });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nouf's Journey Challenges</CardTitle>
          <CardDescription>Manage the dialect translation challenges.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingChallenge(undefined)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingChallenge ? 'Edit Challenge' : 'Add New Challenge'}</DialogTitle>
            </DialogHeader>
            <ChallengeForm
              challenge={editingChallenge}
              onSave={handleSave}
              onCancel={() => { setIsDialogOpen(false); setEditingChallenge(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Gulf Phrase</TableHead>
              <TableHead>Egyptian Phrase</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error loading data.</TableCell></TableRow>}
            {challenges?.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.category}</TableCell>
                <TableCell>{challenge.gulf_phrase}</TableCell>
                <TableCell>{challenge.egyptian_phrase}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingChallenge(challenge); setIsDialogOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(challenge.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

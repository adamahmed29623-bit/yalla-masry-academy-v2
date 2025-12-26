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

type Phrase = {
  category: string;
  text: string;
  translation: string;
};

const PhraseForm = ({ phrase, onSave, onCancel }: { phrase?: WithId<Phrase>, onSave: (p: Phrase) => void, onCancel: () => void }) => {
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    if (phrase) {
      setCategory(phrase.category);
      setText(phrase.text);
      setTranslation(phrase.translation);
    } else {
        setCategory('');
        setText('');
        setTranslation('');
    }
  }, [phrase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ category, text, translation });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Greetings" required />
      </div>
      <div>
        <Label htmlFor="text">Phrase (Egyptian)</Label>
        <Input id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., صباح الخير" required />
      </div>
      <div>
        <Label htmlFor="translation">Translation (English)</Label>
        <Input id="translation" value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder="e.g., Good morning" required />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Phrase</Button>
      </DialogFooter>
    </form>
  );
};

export default function PhrasesAdminPage() {
  const firestore = useFirestore();
  const phrasesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'phrases') : null, [firestore]);
  const { data: phrases, isLoading, error } = useCollection<Phrase>(phrasesCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<WithId<Phrase> | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = async (phraseData: Phrase) => {
    if (!firestore) return;
    try {
      if (editingPhrase) {
        // Update
        const phraseDoc = doc(firestore, 'phrases', editingPhrase.id);
        await updateDoc(phraseDoc, phraseData);
        toast({ title: 'Phrase updated successfully!' });
      } else {
        // Create
        await addDoc(collection(firestore, 'phrases'), phraseData);
        toast({ title: 'Phrase added successfully!' });
      }
      setIsDialogOpen(false);
      setEditingPhrase(undefined);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving phrase', description: (e as Error).message });
    }
  };

  const handleDelete = async (phraseId: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this phrase?')) return;
    try {
      await deleteDoc(doc(firestore, 'phrases', phraseId));
      toast({ title: 'Phrase deleted successfully!' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting phrase', description: (e as Error).message });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Phrasebook</CardTitle>
          <CardDescription>Manage the phrases used in challenges and lessons.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPhrase(undefined)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Phrase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPhrase ? 'Edit Phrase' : 'Add New Phrase'}</DialogTitle>
            </DialogHeader>
            <PhraseForm
              phrase={editingPhrase}
              onSave={handleSave}
              onCancel={() => { setIsDialogOpen(false); setEditingPhrase(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Egyptian Phrase</TableHead>
              <TableHead>English Translation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error loading data.</TableCell></TableRow>}
            {phrases?.map((phrase) => (
              <TableRow key={phrase.id}>
                <TableCell>{phrase.category}</TableCell>
                <TableCell>{phrase.text}</TableCell>
                <TableCell>{phrase.translation}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingPhrase(phrase); setIsDialogOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(phrase.id)}>
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

'use client';
import React, { useState, useEffect } from 'react';
import { useCollection, type WithId, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Hadith = {
  topic: string;
  source: string;
  text: string;
};

const HadithForm = ({ hadith, onSave, onCancel }: { hadith?: WithId<Hadith>, onSave: (h: Hadith) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Hadith>({ topic: '', source: '', text: '' });

  useEffect(() => {
    if (hadith) {
      setFormData(hadith);
    } else {
      setFormData({ topic: '', source: '', text: '' });
    }
  }, [hadith]);

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
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" value={formData.topic} onChange={handleChange} placeholder="e.g., Faith, Prayer" required />
      </div>
      <div>
        <Label htmlFor="source">Source</Label>
        <Input id="source" value={formData.source} onChange={handleChange} placeholder="e.g., Sahih Bukhari" required />
      </div>
      <div>
        <Label htmlFor="text">Hadith Text</Label>
        <Textarea id="text" value={formData.text} onChange={handleChange} placeholder="Enter the full text of the hadith" required />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Hadith</Button>
      </DialogFooter>
    </form>
  );
};

export default function HadithsAdminPage() {
  const firestore = useFirestore();
  const hadithsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'hadiths') : null, [firestore]);
  const { data: hadiths, isLoading, error } = useCollection<Hadith>(hadithsCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHadith, setEditingHadith] = useState<WithId<Hadith> | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = async (hadithData: Hadith) => {
    if (!firestore) return;
    try {
      if (editingHadith) {
        await updateDoc(doc(firestore, 'hadiths', editingHadith.id), hadithData);
        toast({ title: 'Hadith updated!' });
      } else {
        await addDoc(collection(firestore, 'hadiths'), hadithData);
        toast({ title: 'Hadith added!' });
      }
      setIsDialogOpen(false);
      setEditingHadith(undefined);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving hadith', description: (e as Error).message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(firestore, 'hadiths', id));
      toast({ title: 'Hadith deleted!' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting hadith', description: (e as Error).message });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sunnah (Hadiths)</CardTitle>
          <CardDescription>Manage the Hadiths collection.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingHadith(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> Add Hadith</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHadith ? 'Edit Hadith' : 'Add New Hadith'}</DialogTitle>
            </DialogHeader>
            <HadithForm hadith={editingHadith} onSave={handleSave} onCancel={() => { setIsDialogOpen(false); setEditingHadith(undefined); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error loading data.</TableCell></TableRow>}
            {hadiths?.map((hadith) => (
              <TableRow key={hadith.id}>
                <TableCell>{hadith.topic}</TableCell>
                <TableCell className="max-w-sm truncate">{hadith.text}</TableCell>
                <TableCell>{hadith.source}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingHadith(hadith); setIsDialogOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(hadith.id)}>
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

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

type Book = {
  title: string;
  author: string;
  category: string;
  cover: string;
};

const BookForm = ({ book, onSave, onCancel }: { book?: WithId<Book>, onSave: (b: Book) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Book>({ title: '', author: '', category: '', cover: '' });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({ title: '', author: '', category: '', cover: '' });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" value={formData.author} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={formData.category} onChange={handleChange} placeholder="e.g., Tafsir" required />
      </div>
      <div>
        <Label htmlFor="cover">Cover Image URL</Label>
        <Input id="cover" type="url" value={formData.cover} onChange={handleChange} placeholder="https://..." required />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Book</Button>
      </DialogFooter>
    </form>
  );
};

export default function BooksAdminPage() {
  const firestore = useFirestore();
  const booksCollection = useMemoFirebase(() => firestore ? collection(firestore, 'books') : null, [firestore]);
  const { data: books, isLoading, error } = useCollection<Book>(booksCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<WithId<Book> | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = async (bookData: Book) => {
    if (!firestore) return;
    try {
      if (editingBook) {
        await updateDoc(doc(firestore, 'books', editingBook.id), bookData);
        toast({ title: 'Book updated!' });
      } else {
        await addDoc(collection(firestore, 'books'), bookData);
        toast({ title: 'Book added!' });
      }
      setIsDialogOpen(false);
      setEditingBook(undefined);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving book', description: (e as Error).message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(firestore, 'books', id));
      toast({ title: 'Book deleted!' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting book', description: (e as Error).message });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Digital Library Books</CardTitle>
          <CardDescription>Manage the books available in the Islamic library.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBook(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> Add Book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            </DialogHeader>
            <BookForm book={editingBook} onSave={handleSave} onCancel={() => { setIsDialogOpen(false); setEditingBook(undefined); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error loading data.</TableCell></TableRow>}
            {books?.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingBook(book); setIsDialogOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
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

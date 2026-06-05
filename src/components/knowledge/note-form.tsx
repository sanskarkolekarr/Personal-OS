'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNotes } from '@/hooks/use-notes';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Note } from '@/types';
import { useAppStore } from '@/stores/app-store';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  folder_id: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
}

export function NoteForm({ note, onSuccess }: NoteFormProps) {
  const { createNote, updateNote } = useNotes();
  const { closeQuickAdd } = useAppStore();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title ?? '',
      content: note?.content ?? '',
      folder_id: note?.folder_id ?? null,
      tags: note?.tags ?? [],
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
    const data = {
      title: values.title,
      content: values.content ?? '',
      folder_id: values.folder_id ?? null,
      tags: values.tags ?? [],
    };

    if (note) {
      await updateNote(note.id, data);
      toast.success('Note updated successfully!');
    } else {
      await createNote(data);
      toast.success('Note created successfully!');
    }

    onSuccess ? onSuccess() : closeQuickAdd();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Ideas for Q3 Marketing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Start typing your note…"
                  className="resize-none h-40 font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 gap-2">
          <Button type="button" variant="ghost" onClick={onSuccess ?? closeQuickAdd}>
            Cancel
          </Button>
          <Button type="submit">
            {note ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

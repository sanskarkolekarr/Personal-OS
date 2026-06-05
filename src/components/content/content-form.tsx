'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useContent } from '@/hooks/use-content';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTENT_PLATFORMS } from '@/lib/constants';
import { ContentItem } from '@/types';
import { useAppStore } from '@/stores/app-store';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  platform: z.string(),
  status: z.enum(['idea', 'researching', 'drafting', 'ready', 'posted']),
  category: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentFormProps {
  item?: ContentItem;
  onSuccess?: () => void;
}

export function ContentForm({ item, onSuccess }: ContentFormProps) {
  const { createContent, updateContent } = useContent();
  const { closeQuickAdd } = useAppStore();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: item?.title ?? '',
      notes: item?.notes ?? '',
      platform: item?.platform ?? 'twitter',
      status: item?.status ?? 'idea',
      category: item?.category ?? '',
    },
  });

  const onSubmit = async (values: ContentFormValues) => {
    const data = {
      title: values.title,
      notes: values.notes ?? '',
      platform: values.platform,
      status: values.status,
      category: values.category ?? '',
      tags: item?.tags ?? [],
    };

    if (item) {
      await updateContent(item.id, data);
      toast.success('Content idea updated successfully!');
    } else {
      await createContent(data as any);
      toast.success('Content idea created successfully!');
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
              <FormLabel>Idea / Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 5 tips for productivity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Outline (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's the main hook or angle?"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTENT_PLATFORMS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">💡 Idea</SelectItem>
                    <SelectItem value="researching">🔍 Researching</SelectItem>
                    <SelectItem value="drafting">✍️ Drafting</SelectItem>
                    <SelectItem value="ready">✅ Ready</SelectItem>
                    <SelectItem value="posted">🚀 Posted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4 gap-2">
          <Button type="button" variant="ghost" onClick={onSuccess ?? closeQuickAdd}>
            Cancel
          </Button>
          <Button type="submit">
            {item ? 'Update Idea' : 'Create Idea'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

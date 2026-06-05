'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGoals } from '@/hooks/use-goals';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal } from '@/types';
import { useAppStore } from '@/stores/app-store';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['yearly', 'quarterly', 'monthly', 'weekly', 'daily']),
  status: z.enum(['active', 'completed', 'abandoned']),
  deadline: z.string().optional().nullable(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  goal?: Goal;
  onSuccess?: () => void;
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const { createGoal, updateGoal } = useGoals();
  const { closeQuickAdd } = useAppStore();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: goal?.title ?? '',
      description: goal?.description ?? '',
      type: goal?.type ?? 'quarterly',
      status: goal?.status ?? 'active',
      deadline: goal?.deadline ? goal.deadline.split('T')[0] : '',
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    const data = {
      title: values.title,
      description: values.description ?? '',
      type: values.type,
      status: values.status,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
      parent_id: goal?.parent_id ?? null,
      milestones: goal?.milestones ?? [],
      progress: goal?.progress ?? 0,
    };

    if (goal) {
      await updateGoal(goal.id, data);
      toast.success('Goal updated successfully!');
    } else {
      await createGoal(data as any);
      toast.success('Goal created successfully!');
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
              <FormLabel>Goal Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Reach $10k MRR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Key Results (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What does success look like for this goal?"
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horizon</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select horizon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} />
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
            {goal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

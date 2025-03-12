import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Task } from '../../types';

const taskSchema = z.object({
  title: z.string().min(1, "Topshiriq nomini kiriting"),
  description: z.string().min(1, "Topshiriq tavsifini kiriting"),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().min(1, "Muddatni kiriting"),
});

type FormData = z.infer<typeof taskSchema>;

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
}

const AddTaskModal = ({ open, onOpenChange, onSubmit }: AddTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        status: 'pending',
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi topshiriq qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nomi</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Topshiriq nomini kiriting"
              className={form.formState.errors.title ? 'border-red-500' : ''}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Tavsif</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Topshiriq tavsifini kiriting"
              className={form.formState.errors.description ? 'border-red-500' : ''}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritet</Label>
            <select
              id="priority"
              {...form.register('priority')}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="low">Past</option>
              <option value="medium">O'rta</option>
              <option value="high">Yuqori</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Muddat</Label>
            <Input
              id="deadline"
              type="date"
              {...form.register('deadline')}
              className={form.formState.errors.deadline ? 'border-red-500' : ''}
            />
            {form.formState.errors.deadline && (
              <p className="text-sm text-red-500">
                {form.formState.errors.deadline.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Qo'shish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { User } from '../../types/types';

const formSchema = z.object({
  username: z.string().min(2, "Foydalanuvchi nomi kamida 2 ta harfdan iborat bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email format"),
  role: z.enum(['admin', 'manager', 'employee']),
  status: z.enum(['active', 'inactive']),
});

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
}

const AddUserModal = ({
  open,
  onOpenChange,
  onSubmit,
}: AddUserModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      role: 'employee',
      status: 'active',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Foydalanuvchi nomi</label>
            <Input
              {...form.register('username')}
              placeholder="Foydalanuvchi nomini kiriting"
              className={form.formState.errors.username ? 'border-red-500' : ''}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="email@example.com"
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rol</label>
            <Select
              onValueChange={(value) => form.setValue('role', value as User['role'])}
              defaultValue={form.getValues('role')}
            >
              <SelectTrigger
                className={form.formState.errors.role ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Rolni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Menejer</SelectItem>
                <SelectItem value="employee">Xodim</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              onValueChange={(value) => form.setValue('status', value as User['status'])}
              defaultValue={form.getValues('status')}
            >
              <SelectTrigger
                className={form.formState.errors.status ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Statusni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="inactive">Faol emas</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-red-500">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal; 
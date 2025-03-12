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
import { Employee } from '../../types';

const formSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email format"),
  phone: z.string().min(12, "Telefon raqami noto'g'ri format"),
  position: z.string().min(1, "Lavozimni tanlang"),
  department: z.string().min(1, "Bo'limni tanlang"),
  status: z.enum(["active", "inactive"]),
});

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Employee, 'id' | 'createdAt'>) => void;
}

const AddEmployeeModal = ({
  open,
  onOpenChange,
  onSubmit,
}: AddEmployeeModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
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
          <DialogTitle>Yangi xodim qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ism</label>
            <Input
              {...form.register('name')}
              placeholder="Xodim ismi"
              className={form.formState.errors.name ? 'border-red-500' : ''}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
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
            <label className="text-sm font-medium">Telefon</label>
            <Input
              {...form.register('phone')}
              placeholder="+998 90 123 45 67"
              className={form.formState.errors.phone ? 'border-red-500' : ''}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lavozim</label>
            <Select
              onValueChange={(value) => form.setValue('position', value)}
              defaultValue={form.getValues('position')}
            >
              <SelectTrigger
                className={form.formState.errors.position ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Lavozimni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend Developer">
                  Frontend Developer
                </SelectItem>
                <SelectItem value="Backend Developer">
                  Backend Developer
                </SelectItem>
                <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.position && (
              <p className="text-sm text-red-500">
                {form.formState.errors.position.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bo'lim</label>
            <Select
              onValueChange={(value) => form.setValue('department', value)}
              defaultValue={form.getValues('department')}
            >
              <SelectTrigger
                className={form.formState.errors.department ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Bo'limni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.department && (
              <p className="text-sm text-red-500">
                {form.formState.errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              onValueChange={(value) =>
                form.setValue('status', value as 'active' | 'inactive')
              }
              defaultValue={form.getValues('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statusni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="inactive">Faol emas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal; 
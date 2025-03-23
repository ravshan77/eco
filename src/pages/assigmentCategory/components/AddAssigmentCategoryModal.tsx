import * as z from 'zod';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { assigmenCategorytAPI } from '@/services/assigmentCategory.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const positionSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(2, "Bo'lim nomi 2 ta harfdan ko'p bo'lishi kerak"),
});

type FormData = z.infer<typeof positionSchema>;

interface Props {
  open: boolean;
  fetchData: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export const AddAssigmentCategoryModal = memo(({ open, onOpenChange, fetchData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({ resolver: zodResolver(positionSchema) });
  const { handleSubmit, register, formState } = form

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await assigmenCategorytAPI.create(data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Yangi topshiriq kategoriyasi qo'shildi" });
        fetchData()
        onOpenChange(false)
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      {isLoading && <LoadingOverlay />}
        <DialogHeader>
          <DialogTitle>Yangi Topshiriq kategoriyasi qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nomi *</Label>
            <Input {...register('name')} autoFocus id="name" required placeholder="T/q kategoriyasi nomini kiriting" className={formState.errors.name ? 'border-red-500' : ''} />
            {formState.errors.name && (<p className="text-sm text-red-500"> {formState.errors.name.message} </p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Izoh</Label>
            <Input {...register('description')} id="description" placeholder="Izoh" className={formState.errors.description ? 'border-red-500' : ''} />
            {formState.errors.description && (<p className="text-sm text-red-500"> {formState.errors.description.message} </p>)}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="yellow" className='mr-3' onClick={() => onOpenChange(false)} disabled={isLoading}> Oynani yopish </Button>
            <Button type="submit" className='ml-3' variant={"green"} disabled={isLoading}> Saqlash </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
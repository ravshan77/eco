import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TSections } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { sectionsAPI } from '@/services/sections.service';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const sectionsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  responsible_worker: z.string().optional(),
  name: z.string().min(3, "Bo'lim nomi 3 ta harfdan ko'p bo'lishi kerak"),
});

type FormData = z.infer<typeof sectionsSchema>;

interface Props {
  open: boolean;
  data: TSections;
  fetchData: () => Promise<void>;
  onOpenChange: (open: TSections) => void;
}

const EditSectionModal = ({ open, onOpenChange, fetchData, data }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({ resolver: zodResolver(sectionsSchema), values: data });
  const { handleSubmit, register, formState } = form

  const handleClose = () => onOpenChange({name:""})

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await sectionsAPI.update(data);
      if (res.status) {
        toast({ title: "Muvaffaqiyatli", description: "Bo'lim tahrirlandi" });
        fetchData()
        handleClose()
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: err?.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      {isLoading && <LoadingOverlay />}
        <DialogHeader>
          <DialogTitle>Bo'limni tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nomi</Label>
            <Input {...register('name')} id="name" autoFocus required placeholder="Bo'lim nomini kiriting" className={formState.errors.name ? 'border-red-500' : ''} />
            {formState.errors.name && (<p className="text-sm text-red-500"> {formState.errors.name.message} </p>)}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" className='mr-3' onClick={handleClose} disabled={isLoading}> Bekor qilish </Button>
            <Button type="submit" className='ml-3' disabled={isLoading}> Saqlash </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSectionModal; 
import * as z from 'zod';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SingleOption } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { positionsAPI } from '@/services/positions.service';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const positionSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  section_name: z.string().optional(),
  responsible_worker: z.string().optional(),
  section_id: z.number().min(1, { message: "Bo'lim tanlanishi shart" }),
  name: z.string().min(2, "Bo'lim nomi 2 ta harfdan ko'p bo'lishi kerak"),
});

type FormData = z.infer<typeof positionSchema>;

interface Props {
  open: boolean;
  fetchData: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
  options: { sections: SingleOption[] }
}

export const AddPositionModal = memo(({ open, onOpenChange, fetchData, options }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({ resolver: zodResolver(positionSchema) });
  const { handleSubmit, register, formState, setValue, watch } = form

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await positionsAPI.create(data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Yangi lavozim qo'shildi" });
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
          <DialogTitle>Yangi lavozim qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nomi</Label>
            <Input {...register('name')} id="name" autoFocus required placeholder="Lavozim nomini kiriting" className={formState.errors.name ? 'border-red-500' : ''} />
            {formState.errors.name && (<p className="text-sm text-red-500"> {formState.errors.name.message} </p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Bo'lim</Label>
            <Select required value={String(watch("section_id"))} onValueChange={value => setValue("section_id", Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.sections.map((ste) => ( <SelectItem key={ste.id} value={String(ste.id)}> {ste.name} </SelectItem> ))}
              </SelectContent>
              </Select>
            {formState.errors.section_id && (<p className="text-sm text-red-500"> {formState.errors.section_id.message} </p>)}
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
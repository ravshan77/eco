import * as z from 'zod';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { SingleOption, TPositions } from '@/types/types';
import { positionsAPI } from '@/services/positions.service';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const positionSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  section_name: z.string().nullable().optional(),
  responsible_worker: z.string().optional(),
  section_id: z.number().min(1, { message: "Bo'lim tanlanishi shart" }),
  name: z.string().min(2, "Bo'lim nomi 2 ta harfdan ko'p bo'lishi kerak"),
});

type FormData = z.infer<typeof positionSchema>;

interface Props {
  open: boolean;
  data: TPositions;
  fetchData: () => Promise<void>;
  onOpenChange: (open: TPositions) => void;
  options: { sections: SingleOption[] }
}

export const EditPositionModal = memo(({ open, onOpenChange, fetchData, data, options }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({ resolver: zodResolver(positionSchema), values: data });
  const { handleSubmit, register, formState, setValue,  watch } = form

  const handleClose = () => onOpenChange({name:"", section_id: 0})

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await positionsAPI.update(data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Lavozim tahrirlandi" });
        fetchData()
        handleClose()
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    }finally {
      setIsLoading(false);
    }
  };  

  return (
    <Dialog open={open.valueOf()} onOpenChange={handleClose} modal={true}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      {isLoading && <LoadingOverlay />}
        <DialogHeader>
          <DialogTitle>Lavozimni tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nomi</Label>
            <Input {...register('name')} autoFocus={false} id="name" required placeholder="Lavozim nomini kiriting" className={formState.errors.name ? 'border-red-500' : ''} />
            {formState.errors.name && (<p className="text-sm text-red-500"> {formState.errors.name.message} </p>)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Bo'lim</Label>
            <Select required defaultValue={String(data.section_id)} value={String(watch("section_id"))} onValueChange={value => setValue("section_id", Number(value))}>
              <SelectTrigger className="w-full"> 
                <SelectValue placeholder="Bo'limni tanlang"/> 
              </SelectTrigger>
              <SelectContent>
                {options.sections.map((ste) => ( <SelectItem key={ste.id} value={ste.id}> {ste.name} </SelectItem> ))}
              </SelectContent>
            </Select>
            {formState.errors.section_id && (<p className="text-sm text-red-500"> {formState.errors.section_id.message} </p>)}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="yellow" className='mr-3' onClick={handleClose} disabled={isLoading}> Oynani yopish </Button>
            <Button type="submit" className='ml-3' variant={"green"} disabled={isLoading}> Saqlash </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

import * as z from 'zod';
import { useState } from 'react';
import { WORKER_STATUS } from '@/constants';
import { Input } from '@/components/ui/input';
import { TWorkersOrders } from '@/types/types';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import SearchableSelect from '@/components/SearchableSelect';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { GetWorkersOrders, workersOrdersAPI } from '@/services/workersOrders.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const orderSchema = z.object({
  worker_id: z.number({required_error:"Xodim tanlang"}).min(1, "Xodim tanlang"),
  order_status: z.number({required_error:"Buyruq statusini tanlang"}).min(1, "Buyruq statusni tanlang"),
  order_date: z.string(),
  description: z.string().optional(),
});

// type FormData = z.infer<typeof orderSchema>;

interface Props {
  open: boolean;
  filtersQuery?: any;
  fetchData: (params: GetWorkersOrders) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const AddOrderModal = ({ open, onOpenChange, fetchData, filtersQuery={} }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<TWorkersOrders>({ resolver: zodResolver(orderSchema), disabled: loading, shouldUnregister: false });
  const { control, setValue, formState: { errors }, handleSubmit, watch } = form;
 

  const onSubmit = async (data: TWorkersOrders) => { 
    setLoading(true);
    try {
      const response = await workersOrdersAPI.create(data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Yangi buyruq chiqarildi"});
        fetchData({filters: { ...filtersQuery}, page_number: 1})
        onOpenChange(false)
        // navigate (`/workers/edit-worker/${response.resoult.id}`)
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  console.log(errors)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      {loading && <LoadingOverlay />}
        <DialogHeader>
          <DialogTitle>Yangi buyruq chiqarish</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormField control={control} name={"worker_id"} render={({ field: formField }) => 
              <FormItem className="w-full">
                <FormLabel>Xodim *</FormLabel>
                <FormControl>
                  <SearchableSelect formField={formField} control={control} errors={errors} setValue={setValue} watch={watch} />
                </FormControl>
                <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />  

          <div className='flex justify-between'>
            <FormField control={control} name={"order_status"} render={({ field: formField }) => 
              <FormItem className="w-80">
                <FormLabel>Buyruq *</FormLabel>
                <FormControl>
                  <Select value={String(watch("order_status"))} required disabled={loading} onValueChange={value => {
                    if (value) {
                      setValue(formField.name, Number(value))
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKER_STATUS.map((sts) => ( <SelectItem key={sts.id} value={String(sts.id)}> {sts.name} </SelectItem> ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />

            <FormField control={control} name={"order_date"} render={({ field: formField }) => 
              <FormItem className="w-32">
                <FormLabel>Buyruq sanasi *</FormLabel>
                <FormControl>
                  <Input type={"date"} required min={"1930-01-01"} max={new Date().toISOString().split("T")[0]} disabled={loading} value={formField.value} onChange={(e) => setValue(formField.name, e.target.value)} />
                </FormControl>
                <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />
          </div>
            <FormField control={control} name={"description"} render={({ field: formField }) => 
              <FormItem className="w-full">
                <FormLabel>Izoh</FormLabel>
                <FormControl>
                  <Input type={"text"} value={watch("description") ? String(watch("description")) : undefined } disabled={loading} onChange={(e) => setValue(formField.name, e.target.value)} />
                </FormControl>
                <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="yellow" className='mr-3' onClick={() => onOpenChange(false)} disabled={loading}> Oynani yopish </Button>
              <Button type="submit" className='ml-3' variant={"green"} disabled={loading}> Saqlash </Button>
            </div>
          </form>
        </FormProvider>  
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal; 
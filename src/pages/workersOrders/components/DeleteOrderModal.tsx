import { useState } from "react";
import { TWorkersOrders } from "@/types/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { GetWorkersOrders, workersOrdersAPI } from "@/services/workersOrders.service";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface ConfirmProps {
  open: boolean;
  filtersQuery: any
  data: TWorkersOrders;
  onOpenChange: (open: boolean) => void;
  fetchData: (params: GetWorkersOrders) => Promise<void>;
}

export const DeleteOrderModal = ({ open, fetchData, onOpenChange, data, filtersQuery }: ConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => onOpenChange(false)

  const onConfirm = async () => {
    if (!data.id) {
      return  
    }
    try {
      setIsLoading(true);
      const response = await workersOrdersAPI.delete(data?.id);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Buyruq o'chirildi" });
        fetchData({filters: { ...filtersQuery}, page_number: 1})
        handleClose()
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
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tasdiqlash</AlertDialogTitle>
          <AlertDialogDescription>Siz haqiqatdan ham <b>{data.order_number}</b> raqamli buyruqni o'chirishni xohlaysizmi?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <Button variant="yellow" disabled={isLoading} className='mr-3' onClick={handleClose}>Oynani yopish</Button>
          <Button variant="destructive" disabled={isLoading} className='ml-3' onClick={onConfirm}>O'chirish</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

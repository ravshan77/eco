import { useState } from "react";
import { TWorkers } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { workerDefaultValues } from "@/constants";
import { GetWorkers, workersAPI } from "@/services/workers.service";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface ConfirmProps {
  open: boolean;
  data: TWorkers;
  filtersQuery?: any;
  onOpenChange: (open: TWorkers) => void;
  fetchData?: (params: GetWorkers) => Promise<void>;
}

export const DeleteWorkerModal = ({ open, fetchData, onOpenChange, data, filtersQuery }: ConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => onOpenChange(workerDefaultValues)

  const onConfirm = async () => {
    if (!data.id) {
      return  
    }
    try {
      setIsLoading(true);
      const response = await workersAPI.delete(data?.id);
      if (response.status) {
        if (fetchData) {
            fetchData({filters:filtersQuery, page_number: 1})
        } else{
          navigate(-1)
        }

        toast({ title: "Muvaffaqiyatli", description: "Xodim o'chirildi" });
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
          <AlertDialogDescription>Siz haqiqatdan ham <b>{data.name}</b> xodimni o'chirishni xohlaysizmi?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <Button variant="yellow" disabled={isLoading} className='mr-3' onClick={handleClose}>Oynani yopish</Button>
          <Button variant="destructive" disabled={isLoading} className='ml-3' onClick={onConfirm}>O'chirish</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

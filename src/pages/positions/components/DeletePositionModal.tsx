import { memo, useState } from "react";
import { TPositions } from "@/types/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { positionsAPI } from "@/services/positions.service";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface ConfirmProps {
  open: boolean;
  data: TPositions;
  fetchData: () => Promise<void>;
  onOpenChange: (open: TPositions) => void;
}

export const DeletePositionModal = memo(({ open, fetchData, onOpenChange, data }: ConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => onOpenChange({name:"", section_id:0,})

  const onConfirm = async () => {
    if (!data.id) {
      return  
    }
    try {
      setIsLoading(true);
      const response = await positionsAPI.delete(data?.id);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Lavozim o'chirildi" });
        fetchData()
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
          <AlertDialogDescription>Siz haqiqatdan ham <b>{data.name}</b> lavozimni o'chirishni xohlaysizmi?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" disabled={isLoading} className='mr-3' onClick={handleClose}>Bekor qilish</Button>
          <Button variant="destructive" disabled={isLoading} className='ml-3' onClick={onConfirm}>O'chirish</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

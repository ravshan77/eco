import { useState } from "react";
import { TSections } from "@/types/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { sectionsAPI } from "@/services/sections.service";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface ConfirmProps {
  open: boolean;
  data: TSections;
  fetchData: () => Promise<void>;
  onOpenChange: (open: TSections) => void;
}

export const DeleteSectionModal = ({ open, fetchData, onOpenChange, data }: ConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => onOpenChange({name:""})

  const onConfirm = async () => {
    if (!data.id) {
      return  
    }
    try {
      setIsLoading(true);
      const response = await sectionsAPI.delete(data?.id);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Bo'lim o'chirildi" });
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
          <AlertDialogDescription>Siz haqiqatdan ham <b>{data.name}</b> bo'limini o'chirishni xohlaysizmi?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <Button variant="yellow" disabled={isLoading} className='mr-3' onClick={handleClose}>Oynani yopish</Button>
          <Button variant="destructive" disabled={isLoading} className='ml-3' onClick={onConfirm}>O'chirish</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

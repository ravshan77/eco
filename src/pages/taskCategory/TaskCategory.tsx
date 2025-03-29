import { Card } from '@/components/ui/card';
import { TTaskCategory } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { taskCategoryApi } from '@/services/taskCategory.service';
import { AddTaskCategoryModal } from './components/AddTaskCategoryModal';
import { EditTaskCategoryModal } from './components/EditTaskCategoryModal';
import { ChevronLeft, PenLine, Plus, Settings2, Trash2 } from 'lucide-react';
import { DeleteTaskCategoryModal } from './components/DeleteTaskCategoryModal';

export default function TaskCategory() {
  // **STATES**
  const [data, setData] = useState<TTaskCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isOpenEditModal, setOpenEditModal] = useState<TTaskCategory | null>(null);
  const [isDeleteModal, setOpenDeleteModal] = useState<TTaskCategory | null>(null);

  // **HOOKS**
  const navigate = useNavigate();

  // **FETCH DATA FUNCTION**
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await taskCategoryApi.getAll();
      if (response.status) {
        setData(response.resoult);
        toast({ title: "Muvaffaqiyatli yuklandi", description: "Topshiriq kategoriyalar ro'yxati yangilandi" });
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);


  // **HANDLERS**
  const handleGoBack = () => navigate(-1);
  const handleAddModal = () => setOpenAddModal(true);
  const handleEdit = (item: TTaskCategory) => setOpenEditModal(item);
  const handleDelete = (item: TTaskCategory) => setOpenDeleteModal(item);

  return (
    <>
      {isLoading && <LoadingOverlay />}

      {/* **MODALS** */}
      {isOpenAddModal && <AddTaskCategoryModal open={isOpenAddModal} onOpenChange={setOpenAddModal} fetchData={fetchData} />}
      {isOpenEditModal && (<EditTaskCategoryModal open={true} onOpenChange={() => setOpenEditModal(null)} fetchData={fetchData} data={isOpenEditModal} />)}
      {isDeleteModal && (<DeleteTaskCategoryModal open={true} onOpenChange={() => setOpenDeleteModal(null)} fetchData={fetchData} data={isDeleteModal} /> )}

      {/* **LAYOUT** */}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Topshiriq kategoriyalari ro'yxati </h2>
          <Button onClick={handleAddModal} type="button" variant={"primary"} className="w-full sm:w-auto"> <Plus className="mr-2 h-4 w-4" /> T/q kategoriyasi qo'shish </Button>
        </div>

        {/* **TABLE** */}
        <Card className="p-4 sm:p-6">
          <div className="rounded-md border overflow-auto max-h-[75vh]">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              {/* THEADER */}
              <thead className="bg-white dark:bg-black sticky top-0 z-20 shadow-md border-b-2 border-gray-400">
                <tr className="border-b h-12 border-gray-300">
                  <th className="p-2 text-center w-8 border border-gray-300">№</th>
                  <th className="p-2 text-center w-8 border border-gray-300">Sana</th>
                  <th className="p-2 text-center border border-gray-300">Topshiriq kategoriyasi</th>
                  <th className="p-2 text-center border border-gray-300">Izoh</th>
                  <th className="p-2 text-center border border-gray-300">Ma'sul xodim</th>
                  <th className="p-2 text-center w-8 border border-gray-300">
                    <div className="flex justify-center">
                      <Settings2 />
                    </div>
                  </th>
                </tr>
              </thead>

              {/* TBODY */}
              <tbody className="cursor-pointer">
                {data.map((item, ind) => (
                  <tr key={item.id} onDoubleClick={() => handleEdit(item)} className="border-b border-gray-300">
                    <td className="p-2 border border-gray-300"> {ind + 1} </td>
                    <td className="p-2 border border-gray-300"> {item.created_at} </td>
                    <td className="p-2 border border-gray-300"> {item.name} </td>
                    <td className="p-2 border border-gray-300"> {item.description} </td>
                    <td className="p-2 border border-gray-300"> {item.responsible_worker} </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex justify-center">
                        <Button type="button" onClick={() => handleEdit(item)} className="w-12 h-full mr-2 bg-green-500 text-white hover:bg-green-600"> <PenLine /> </Button>
                        <Button type="button" onClick={() => handleDelete(item)} variant={"destructive"} className="w-12 h-full ml-2"> <Trash2 /> </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

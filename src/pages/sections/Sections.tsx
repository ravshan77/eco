import { TSections } from '@/types/types';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { sectionsAPI } from '@/services/sections.service';
import AddSectionModal from './components/AddSectionModal';
import EditSectionModal from './components/EditSectionModal';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { DeleteSectionModal } from './components/DeleteSectionModal';
import { ChevronLeft, PenLine, Plus, Settings, Trash2 } from 'lucide-react';

export default function Sections() {
  // **STATES**
  const [data, setData] = useState<TSections[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isOpenEditModal, setOpenEditModal] = useState<TSections | null>(null);
  const [isDeleteModal, setOpenDeleteModal] = useState<TSections | null>(null);

  // **HOOKS**
  const navigate = useNavigate();

  // **FETCH DATA FUNCTION**
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await sectionsAPI.getAll();
      if (response.status) {
        setData(response.resoult);
        toast({ title: "Muvaffaqiyatli yuklandi", description: "Bo'limlar ro'yxati yangilandi" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Bo'limlarni yuklashda xatolik yuz berdi" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // **HANDLERS**
  const handleGoBack = () => navigate(-1);
  const handleAddModal = () => setOpenAddModal(true);
  const handleEdit = (item: TSections) => setOpenEditModal(item);
  const handleDelete = (item: TSections) => setOpenDeleteModal(item);

  return (
    <>
      {isLoading && <LoadingOverlay />}

      {/* **MODALS** */}
      <AddSectionModal open={isOpenAddModal} onOpenChange={setOpenAddModal} fetchData={fetchData} />
      {isOpenEditModal && (<EditSectionModal open={true} onOpenChange={() => setOpenEditModal(null)} fetchData={fetchData} data={isOpenEditModal} />)}
      {isDeleteModal && (<DeleteSectionModal open={true} onOpenChange={() => setOpenDeleteModal(null)} fetchData={fetchData} data={isDeleteModal} /> )}

      {/* **LAYOUT** */}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Bo'limlar ro'yxati </h2>
          <Button onClick={handleAddModal} type="button" className="w-full sm:w-auto"> <Plus className="mr-2 h-4 w-4" /> Bo'lim qo'shish </Button>
        </div>

        {/* **TABLE** */}
        <Card className="p-4 sm:p-6">
          <div className="rounded-md border overflow-auto max-h-[75vh]">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              {/* THEADER */}
              <thead className="bg-white dark:bg-black sticky top-0 z-20 shadow-md border-b-2 border-gray-400">
                <tr className="border-b h-12 border-gray-300">
                  <th className="p-2 text-left w-8 border border-gray-300">№</th>
                  <th className="p-2 text-left border border-gray-300">F.I.O</th>
                  <th className="p-2 text-center w-8 border border-gray-300">
                    <div className="flex justify-center">
                      <Settings />
                    </div>
                  </th>
                </tr>
              </thead>

              {/* TBODY */}
              <tbody className="cursor-pointer">
                {data.map((item, ind) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="p-2 border border-gray-300"> {ind + 1} </td>
                    <td className="p-2 border border-gray-300"> {item.name} </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex justify-center">
                        <Button type="button" onClick={() => handleEdit(item)} className="w-12 h-full mr-2"> <PenLine /> </Button>
                        <Button type="button" onClick={() => handleDelete(item)} className="w-12 h-full ml-2"> <Trash2 /> </Button>
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

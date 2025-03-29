import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { SingleOption, TPositions } from '@/types/types';
import { useState, useEffect, useCallback } from 'react';
import { sectionsAPI } from '@/services/sections.service';
import { positionsAPI } from '@/services/positions.service';
import { AddPositionModal } from './components/AddPositionModal';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { EditPositionModal } from './components/EditPositionModal';
import { DeletePositionModal } from './components/DeletePositionModal';
import { ChevronLeft, PenLine, Plus, Settings2, Trash2 } from 'lucide-react';

export default function Positions() {
  // **STATES**
  const [data, setData] = useState<TPositions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isOpenEditModal, setOpenEditModal] = useState<TPositions | null>(null);
  const [isDeleteModal, setOpenDeleteModal] = useState<TPositions | null>(null);
  const [options, setOptions] = useState<{ sections: SingleOption[] }>({ sections: [] })

  // **HOOKS**
  const navigate = useNavigate();

  // **FETCH DATA FUNCTION**
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await positionsAPI.getAll();
      if (response.status) {
        setData(response.resoult);
        toast({ title: "Muvaffaqiyatli yuklandi", description: "Lavozimlar ro'yxati yangilandi" });
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
  }, [fetchData]);

  // get sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sectionsAPI.getAll();
        if (response.status) {
          const resp = response.resoult.map(pstn => ({ id: String(pstn.id), name: pstn?.name }))
          setOptions(prev => ({ ...prev, sections: resp }));
        } else {
          throw new Error(response.error.message)
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
      }
    };

    fetchData();
  }, []);

  // **HANDLERS**
  const handleGoBack = () => navigate(-1);
  const handleAddModal = () => setOpenAddModal(true);
  const handleEdit = (item: TPositions) => setOpenEditModal(item);
  const handleDelete = (item: TPositions) => setOpenDeleteModal(item);

  return (
    <>
      {isLoading && <LoadingOverlay />}

      {/* **MODALS** */}
      {isOpenAddModal && <AddPositionModal open={isOpenAddModal} options={options} onOpenChange={setOpenAddModal} fetchData={fetchData} />}
      {isOpenEditModal && (<EditPositionModal open={true} options={options} onOpenChange={() => setOpenEditModal(null)} fetchData={fetchData} data={isOpenEditModal} />)}
      {isDeleteModal && (<DeletePositionModal open={true} onOpenChange={() => setOpenDeleteModal(null)} fetchData={fetchData} data={isDeleteModal} /> )}

      {/* **LAYOUT** */}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Lavozimlar ro'yxati </h2>
          <Button onClick={handleAddModal} type="button" variant={"primary"} className="w-full sm:w-auto"> <Plus className="mr-2 h-4 w-4" /> Lavozim qo'shish </Button>
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
                  <th className="p-2 text-center border border-gray-300">Lavozim nomi</th>
                  <th className="p-2 text-center border border-gray-300">Bo'lim nomi</th>
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
                    <td className="p-2 border border-gray-300"> {item.section_name} </td>
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

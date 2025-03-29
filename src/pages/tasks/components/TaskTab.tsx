import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import { Card } from '../../../components/ui/card';
import { DeleteTaskModal } from './DeleteTaskModal';
import { Input } from '../../../components/ui/input';
import { Pagination } from '@/components/pagination';
import { toast } from '../../../components/ui/use-toast';
import { useState, useEffect, ChangeEvent } from 'react';
import { getDateDifference } from '@/utils/getDateDifference';
import { GetTasks, tasksApi } from '@/services/tasks.service';
import { Eye, PenLine, Settings2, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_META_DATA, MONTHS, TASK_CONFIRM_STATUS_INFO, TASK_PREORIIY_STATUS_INFO, YEARS } from '@/constants';
import { PaginationMeta, TaskConfirmStatusEnum, TaskPreoriyStatusEnum, TTask, TTaskCategory } from '../../../types/types';

type Props = {
  worker_id: number;
  assigment_category: TTaskCategory;
}

const TaskTab = ({ assigment_category, worker_id }:Props) => {
  const [data, setData] = useState<TTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_DATA);
  const [isDeleteModal, setOpenDeleteModal] = useState<TTask | null>(null);
  const [filtersQuery, setFiltersQuery] = useState({ search:"", worker_id: worker_id, assigment_category_id: assigment_category.id });

  const navigate = useNavigate();

  // VARABELS
  const total_pages = meta?.total;
  const current_page = meta?.current_page

  const fetchData = async ({ filters, page_number } : GetTasks) => {
    try {
      setLoading(true);
      const response = await tasksApi.getAll({page_number, filters});
      setData(response.resoult.data);
      setMeta(response.resoult.meta);
      toast({ title: "Muvaffaqiyatli yuklandi", description: "Topshiriqlar ro'yxati yangilandi" });
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Topshiriqlarni yuklashda xatolik yuz berdi" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ filters: filtersQuery, page_number:1 });
  }, [assigment_category.id]);


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltersQuery( prev =>  ({ ...prev, [e.target.name] : e.target.value}));
    fetchData({ filters: { ...filtersQuery, search: e.target.value }, page_number: 1})
  };
  
  const handleDelete = (t: TTask) => setOpenDeleteModal(t)
  const handleEdit = (t: TTask) =>  navigate(`/tasks/edit-task/${t.id}`);
  const handleCompleteTask = (t:TTask) => navigate(`/complete-task/${t.id}`);
  const handleConfirmTask = (t:TTask) => {
    if(!t.assignment_result?.id){
      toast({ variant: "destructive", title: "Jarayonda", description: "Topshiriq bajarilish Jarayon vaqtida uni tasqilash mumkin emas" });
      return
    }

    navigate(`/confirm-task/${t.id}`)
  };

  const checkConfirmStatus = (status: TTask["confirmation_status"]) => {
    switch (status) {
      case TaskConfirmStatusEnum.Jarayonda:
        return TASK_CONFIRM_STATUS_INFO.jarayonda
      case TaskConfirmStatusEnum.Bajarilgan:
        return TASK_CONFIRM_STATUS_INFO.bajarilgan
      case TaskConfirmStatusEnum.Tasdiqlangan:
        return TASK_CONFIRM_STATUS_INFO.tasdiqlangan 
      default:
        return { color:"", text:"" }
    }
  }

  const checkPreoriyStatus = (status: TTask["preority"]) => {
    switch (status) {
      case TaskPreoriyStatusEnum.Muhim:
        return TASK_PREORIIY_STATUS_INFO.muhim
      case TaskPreoriyStatusEnum.Qilinishi_kerak:
        return TASK_PREORIIY_STATUS_INFO.qilinishi_kerak
      case TaskPreoriyStatusEnum.Zarur:
        return TASK_PREORIIY_STATUS_INFO.zarur 
      default:
        return { color:"", text:"" }
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {isDeleteModal && <DeleteTaskModal data={isDeleteModal} open={true} onOpenChange={setOpenDeleteModal} filtersQuery={filtersQuery} fetchData={fetchData} />} 
       
      <Card className="py-2 px-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div className="w-full sm:max-w-md">
            <Input type="search" placeholder="Topshiriqni qidirish..." className="w-full" value={filtersQuery.search} onChange={handleSearch} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Oy" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => ( <SelectItem key={month.value} value={month.value}> {month.label} </SelectItem> ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Yil" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => ( <SelectItem key={year} value={year.toString()}> {year} </SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto min-h-[45vh]">
          <table className="w-full min-w-max border-separate border-spacing-0">
            {/* TEPADAGI HEADER QISMI */}
            <thead className="bg-white dark:bg-black sticky top-0 z-20 shadow-md border-b-2 border-gray-400">
              <tr className="border-b h-12 border-gray-300 bg-muted/50">
                <th className="p-2 text-center border border-gray-300">№</th>
                <th className="p-2 text-center border border-gray-300">Sana</th>
                <th className="p-2 text-center border border-gray-300">Topshiriq</th>
                <th className="p-2 text-center border border-gray-300">Muddat (dan - gacha)</th>
                <th className="p-2 text-center border border-gray-300">Muddat nazorati</th>
                <th className="p-2 text-center border border-gray-300">Muhimligi</th>
                <th className="p-2 text-center border border-gray-300">Ball</th>
                <th className="p-2 text-center border border-gray-300">Xolati</th>
                <th className="p-2 text-center border border-gray-300">Ma'sul xodim</th>
                <th className="p-2 text-center w-8 border border-gray-300"> <div className='flex justify-center'><Settings2 /></div></th>
              </tr>
            </thead>

            {/* BODY QISMI */}
            <tbody className="cursor-pointer">
              {data?.map((item, ind) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="p-2 border border-gray-300 max-w-[20px]"> {ind + meta?.from} </td>
                  <td className="p-2 border border-gray-300 w-[32px]"> { item.created_at }</td>
                  <td className="p-2 border border-gray-300 max-w-sm"> { item.assigment } </td>
                  <td className="p-2 border border-gray-300 w-[190px]"> { formatDate(item.period_from)} - {formatDate(item.period_to)} </td>
                  <td className="p-2 border border-gray-300 w-[100px]"> { getDateDifference(item.period_from, item.period_to)} </td>
                  <td className="p-2 border border-gray-300 w-[140px]"> <div className={checkPreoriyStatus(item?.preority).color}> {checkPreoriyStatus(item?.preority).text}</div> </td>
                  <td className="p-2 border border-gray-300 w-[50px]"> { item.ball } </td>
                  <td className="p-2 border border-gray-300 w-[170px]" onClick={_ => handleConfirmTask(item)}> <div className={checkConfirmStatus(item?.confirmation_status).color}>{ checkConfirmStatus(item?.confirmation_status).text }</div> </td>
                  <td className="p-2 border border-gray-300 max-w-[100px] truncate"> { item.responsible_worker } </td>
                  <td className="p-2 border border-gray-300 "> 
                    <div className='flex justify-center'>
                      <Button type='button' onClick={() => handleEdit(item)} variant={"green"} className="w-12 h-full mx-2"> <PenLine /> </Button>
                      <Button type="button" onClick={() => handleDelete(item)} variant={"destructive"} className="w-12 h-full mx-2"> <Trash2 /> </Button>
                      <Button type="button" onClick={() => handleCompleteTask(item)} variant={"primary"} className="w-12 h-full mx-2"> <Eye /> </Button>
                    </div> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1"> Jami <b>{total_pages}</b> ta {assigment_category.name} </div>
          <div> <Pagination fetchPage={fetchData} current_page={current_page} meta={meta} total_pages={total_pages} filtersQuery={filtersQuery} /> </div>
        </div>
      </Card>
    </>
  )
}

export default TaskTab
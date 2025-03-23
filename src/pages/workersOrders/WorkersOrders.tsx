import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Pagination } from '@/components/pagination';
import AddOrderModal from './components/AddOrderModal';
import { useState, useEffect, ChangeEvent } from 'react';
import EditOrderModal from './components/EditOrderModal';
import { DeleteOrderModal } from './components/DeleteOrderModal';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { ChevronLeft, PenLine, Plus, Settings, Trash2 } from 'lucide-react';
import { GetWorkersOrders, workersOrdersAPI } from '@/services/workersOrders.service';
import { PaginationMeta,  WorkerOrdersStatusEnum, TWorkersOrders } from '@/types/types';
import { DEFAULT_META_DATA, MONTHS, StatusInfo, WORKER_STATUS_INFO, YEARS } from '@/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function WorkersOrders() {
  // STETS
  const [data, setData] = useState<TWorkersOrders[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersQuery, setFiltersQuery] = useState({ search:"" });
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_DATA);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isOpenEditModal, setOpenEditModal] = useState<TWorkersOrders | null>(null);
  const [isDeleteModal, setOpenDeleteModal] = useState<TWorkersOrders | null>(null);

  // VARABELS
  const total_pages = meta?.total;
  const current_page = meta?.current_page

  // HOOKS
  const navigate = useNavigate();

  // EFFECTS
  useEffect(() => {
    fetchData({ filters: filtersQuery, page_number:1 });
  }, []);
  

  const fetchData = async ({ filters, page_number } : GetWorkersOrders) => {
    setIsLoading(true);
    try {
      const response = await workersOrdersAPI.getAll({filters, page_number});
      if(response.status){
        setData(response.resoult.data);
        setMeta(response.resoult.meta);
        toast({ title: "Muvaffaqiyatli yuklandi", description: "Buyruqlar ro'yxati yuklandi" });
      } else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltersQuery( prev =>  ({ ...prev, [e.target.name] : e.target.value}));
    fetchData({ filters: { search: e.target.value }, page_number: 1})
  };

  const getWorkerOrdersStatus = (status: TWorkersOrders["order_status"]): StatusInfo => {
    switch (status) {
      case WorkerOrdersStatusEnum.ish_faoliyatida:
        return WORKER_STATUS_INFO.ish_faoliyatida
      case WorkerOrdersStatusEnum.tatil:
        return WORKER_STATUS_INFO.tatilda
      case WorkerOrdersStatusEnum.komandirovfka:
        return WORKER_STATUS_INFO.mehnat_safari
      case WorkerOrdersStatusEnum.ishdan_boshatilingan:
        return WORKER_STATUS_INFO.ishdan_bushagan  
      case WorkerOrdersStatusEnum.buyruq_chiqarilmagan:
        return WORKER_STATUS_INFO.buyrugi_chiqarilmagan  
      default:
        return { color:"", text:"" }
    }
  }

  const handleGoBack = () => navigate(-1)
  const handleAddModal = () => setOpenAddModal(true);
  const handleDelete = (item: TWorkersOrders) => setOpenDeleteModal(item);
  const handleEdit = (item: TWorkersOrders) => setOpenEditModal(item);


  return (
    <>
      {isLoading && <LoadingOverlay />}
      {/* **MODALS** */}
      <AddOrderModal open={isOpenAddModal} onOpenChange={setOpenAddModal} filtersQuery={filtersQuery} fetchData={fetchData} />
      {isOpenEditModal && (<EditOrderModal open={true} onOpenChange={() => setOpenEditModal(null)} fetchData={fetchData} data={isOpenEditModal} />)}
      {isDeleteModal && (<DeleteOrderModal open={true} onOpenChange={() => setOpenDeleteModal(null)} filtersQuery={filtersQuery} fetchData={fetchData} data={isDeleteModal} /> )}

      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Buyruqlar ro'yxati </h2>
          <Button onClick={handleAddModal} variant={"primary"} type="button" className="w-full sm:w-auto"> <Plus className="mr-2 h-4 w-4" /> Buyruq chiqarish </Button>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:max-w-md">
              <Input type="search" name='search' placeholder="Buyruq raqami va xodim ismi bo'yicha qidirish..." className="w-full" value={filtersQuery.search} onChange={handleSearch} />
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

          <div className="rounded-md border overflow-auto max-h-[64vh]">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              {/* TEPADAGI HEADER QISMI */}
              <thead className="bg-white dark:bg-black sticky top-0 z-20 shadow-md border-b-2 border-gray-400">
                <tr className="border-b h-12 border-gray-300">
                  <th className="p-2 text-left w-8 border border-gray-300">№</th>
                  <th className="p-2 text-left w-[110px] border border-gray-300">Sana</th>
                  <th className="p-2 text-left w-[140px] border border-gray-300">Buyruq raqami</th>
                  <th className="p-2 text-left w-max-44 border border-gray-300">Xodim</th>
                  <th className="p-2 text-left w-48 border border-gray-300">Status</th>
                  <th className="p-2 text-left max-w-44 border border-gray-300">Ma'sul xodim</th>
                  <th className="p-2 text-left w-28 border border-gray-300">Izoh</th>
                  <th className="p-2 text-center w-8 border border-gray-300"> <div className='flex justify-center'><Settings /></div></th>
                </tr>
              </thead>

              {/* BODY QISMI */}
              <tbody className="cursor-pointer">
                {data?.map((wkr, ind) => (
                  <tr key={wkr.id} className="border-b border-gray-300">
                    <td className="p-2 border border-gray-300"> {ind + meta?.from} </td>
                    <td className="p-2 border border-gray-300"> {wkr.order_date} </td>
                    <td className="p-2 border border-gray-300"> {wkr.order_number} </td>
                    <td className="p-2 border border-gray-300"> {wkr.worker_name} </td>
                    <td className={`p-2 border border-gray-300`} > 
                      <div className={`flex items-center h-full justify-start ${getWorkerOrdersStatus(wkr.order_status).color}`}> 
                        <h3 className='h-full w-full'>{getWorkerOrdersStatus(wkr.order_status).text}</h3> 
                      </div> 
                    </td>
                    <td className="p-2 border border-gray-300 max-w-44"> {wkr.resposible_worker} </td>
                    <td className="p-2 border border-gray-300 max-w-28 truncate"> {wkr.description}</td>
                    <td className="p-2 border border-gray-300"> 
                      <div className='flex justify-center'>
                        <Button type='button' onClick={() => handleEdit(wkr)} className="w-12 h-full mr-2 bg-green-500 text-white hover:bg-green-600"> <PenLine  /> </Button>
                        <Button type="button" onClick={() => handleDelete(wkr)} variant={"destructive"} className="w-12 h-full ml-2"> <Trash2 /> </Button>
                      </div> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div> <Pagination fetchPage={fetchData} current_page={current_page} meta={meta} total_pages={total_pages} filtersQuery={filtersQuery} /> </div>
            <div className="text-sm text-muted-foreground order-2 sm:order-1"> Jami {total_pages} buyruq </div>
          </div>
        </Card>
      </div>
    </>
  );
} 
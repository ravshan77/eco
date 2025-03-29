import { base } from '@/services/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Pagination } from '@/components/pagination';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { DeleteWorkerModal } from './components/DeleteWorkerModal';
import { GetWorkers, workersAPI } from '@/services/workers.service';
import { ChevronLeft, PenLine, Plus, Settings2, Trash2 } from 'lucide-react';
import { DEFAULT_META_DATA, MONTHS, WORKER_STATUS_INFO, YEARS } from '@/constants';
import { PaginationMeta, StatusInfo, TWorkers, WorkerOrdersStatusEnum } from '@/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function Workers() {
  // STETS
  const [data, setData] = useState<TWorkers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersQuery, setFiltersQuery] = useState({ search:"" });
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_DATA);
  const [isDeleteModal, setOpenDeleteModal] = useState<TWorkers | null>(null);

  // VARABELS
  const total_pages = meta?.total;
  const current_page = meta?.current_page
  
  // HOOKS
  const navigate = useNavigate();

  // EFFECTS
  useEffect(() => {
    fetchWorkers({ filters: filtersQuery, page_number:1 });
  }, []);
  

  const fetchWorkers = async ({ filters, page_number } : GetWorkers) => {
    setIsLoading(true);
    try {
      const response = await workersAPI.postAll({filters, page_number});
      if(response.status){
        setData(response.resoult.data);
        setMeta(response.resoult.meta);
        toast({ title: "Muvaffaqiyatli yuklandi", description: "Xodimlar ro'yxati yuklandi" });
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
    fetchWorkers({ filters: { ...filtersQuery, search: e.target.value }, page_number: 1})
  };

  const handleGoBack = () => navigate(-1)
  const handleDelete = (item: TWorkers) => setOpenDeleteModal(item);
  const handleGoEdit = (id:string) => navigate(`/workers/edit-worker/${id}`)

  const getWorkerOrdersStatus = (status: TWorkers["status"]): StatusInfo => {
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

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {isDeleteModal && (<DeleteWorkerModal open={true} onOpenChange={() => setOpenDeleteModal(null)} fetchData={fetchWorkers} data={isDeleteModal} filtersQuery={filtersQuery} /> )}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Xodimlar ro'yxati </h2>
          <Button asChild variant={"primary"} className="w-full sm:w-auto"> 
            <NavLink to="/workers/add-new-worker">
              <Plus className="mr-2 h-4 w-4" /> 
              Xodim qo'shish
            </NavLink> 
          </Button>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:max-w-md">
              <Input type="search" name='search' placeholder="Xodim qidirish..." className="w-full" value={filtersQuery.search} onChange={handleSearch} />
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
                <tr className="border-b h-12 border-gray-300 bg-muted/50">
                  <th className="p-2 text-center w-8 border border-gray-300">№</th>
                  <th className="p-2 text-center w-8 border border-gray-300">Rasmi</th>
                  <th className="p-2 text-center border border-gray-300">F.I.O</th>
                  <th className="p-2 text-center border border-gray-300">Lavozim</th>
                  <th className="p-2 text-center w-48 border border-gray-300">Status</th>
                  <th className="p-2 text-center w-36 border border-gray-300">Tel 1</th>
                  <th className="p-2 text-center w-36 border border-gray-300">Ish telefoni</th>
                  <th className="p-2 text-center w-8 border border-gray-300"> <div className='flex justify-center'><Settings2 /></div></th>
                </tr>
              </thead>

              {/* BODY QISMI */}
              <tbody className="cursor-pointer">
                {data?.map((wkr, ind) => (
                  <tr key={wkr.id} onDoubleClick={() => handleGoEdit(String(wkr.id))} className="border-b border-gray-300">
                    <td className="p-1 border border-gray-300"> {ind + meta?.from} </td>
                    <td className="p-1 border border-gray-300 flex justify-center items-center"> 
                      <PhotoProvider>
                        <PhotoView src={`${base + wkr.photo}`}>
                          <img src={`${base + wkr.photo}`} className='w-10 h-10 border' />
                        </PhotoView>
                      </PhotoProvider> 
                    </td>
                    <td className="p-1 border border-gray-300"> {wkr.name} </td>
                    <td className="p-1 border border-gray-300"> {wkr.position_name} </td>
                    <td className={`p-1 border border-gray-300`} > 
                      <div className={`flex items-center h-full justify-start ${getWorkerOrdersStatus(wkr.status).color}`}> 
                        <h3 className='h-full w-full'>{getWorkerOrdersStatus(wkr.status).text}</h3> 
                      </div> 
                    </td>
                    <td className="p-1 border border-gray-300"> +998 { wkr.phone_youre ? formatPhoneNumber(wkr.phone_youre) : "" } </td>
                    <td className="p-1 border border-gray-300"> +998 { wkr?.phone_work ? formatPhoneNumber(wkr.phone_work) : ""} </td>
                    <td className="p-1 border border-gray-300"> 
                      <div className='flex justify-center'>
                        <Button type='button' onClick={() => handleGoEdit(String(wkr.id))} variant={"secondary"} className="w-12 h-full mr-2 bg-green-500 text-white hover:bg-green-600"> <PenLine  /> </Button>
                        <Button type="button" onClick={() => handleDelete(wkr)} variant={"destructive"} className="w-12 h-full ml-2"> <Trash2 /> </Button>
                      </div> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1"> Jami {total_pages} xodim </div>
            <div> <Pagination fetchPage={fetchWorkers} current_page={current_page} meta={meta} total_pages={total_pages} filtersQuery={filtersQuery} /> </div>
          </div>
        </Card>
      </div>
    </>
  );
} 
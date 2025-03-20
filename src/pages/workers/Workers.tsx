import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { ChevronLeft, PenLine, Plus, Settings } from 'lucide-react';
import { GetWorkers, workersAPI } from '@/services/workers.service';
import { PaginationMeta, TWorkers, WorkerStatusEnum } from '@/types/types';
import { DEFAULT_META_DATA, MONTHS, StatusInfo, WORKER_STATUS_INFO, YEARS } from '@/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function Workers() {
  // STETS
  const [data, setData] = useState<TWorkers[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersQuery, setFiltersQuery] = useState({ search:"" });
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_DATA);

  // VARABELS
  const current_page = meta?.current_page
  const total_pages = meta?.total;
  
  // HOOKS
  const navigate = useNavigate();

  // EFFECTS
  useEffect(() => {
    fetchWorkers({ filters: filtersQuery, page_number:1 });
  }, []);
  

  const fetchWorkers = async ({ filters, page_number } : GetWorkers) => {
    setIsLoading(true);
    try {
      const response = await workersAPI.getAll({filters, page_number});
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
    fetchWorkers({ filters: { search: e.target.value }, page_number: 1})
  };

  const handleGoBack = () => navigate(-1)
  const handleGoEdit = (id:string) => navigate(`/workers/edit-worker/${id}`)
  const getWorkerStatus = (status: TWorkers["status"]): StatusInfo => {
    switch (status) {
      case WorkerStatusEnum.ish_faoliyatida:
        return WORKER_STATUS_INFO.ish_faoliyatida
      case WorkerStatusEnum.tatil:
        return WORKER_STATUS_INFO.tatilda
      case WorkerStatusEnum.komandirovfka:
        return WORKER_STATUS_INFO.mehnat_safari
      case WorkerStatusEnum.ishdan_boshatilingan:
        return WORKER_STATUS_INFO.ishdan_bushagan  
      default:
        return { color:"", text:"" }
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} className="w-full sm:w-auto"> <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold"> Xodimlar ro'yxati </h2>
          <Button asChild className="w-full sm:w-auto"> 
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
                <tr className="border-b h-12 border-gray-300">
                  <th className="p-2 text-left w-8 border border-gray-300">№</th>
                  <th className="p-2 text-left w-8 border border-gray-300">Rasmi</th>
                  <th className="p-2 text-left border border-gray-300">F.I.O</th>
                  <th className="p-2 text-left border border-gray-300">Lavozim</th>
                  <th className="p-2 text-left w-36 border border-gray-300">Status</th>
                  <th className="p-2 text-left w-32 border border-gray-300">Tel 1</th>
                  <th className="p-2 text-left w-32 border border-gray-300">Ish telefoni</th>
                  <th className="p-2 text-center w-8 border border-gray-300"> <div className='flex justify-center'><Settings /></div></th>
                </tr>
              </thead>

              {/* BODY QISMI */}
              <tbody className="cursor-pointer">
                {data?.map((wkr, ind) => (
                  <tr key={wkr.id} className="border-b border-gray-300">
                    <td className="p-2 border border-gray-300"> {ind + 1} </td>
                    <td className="p-2 border border-gray-300"> 
                      <PhotoProvider>
                        <PhotoView src={wkr.photo ?? ""}>
                          <img src={wkr.photo ?? ""} className='w-16 h-10 border' />
                        </PhotoView>
                      </PhotoProvider> 
                    </td>
                    <td className="p-2 border border-gray-300"> {wkr.name} </td>
                    <td className="p-2 border border-gray-300"> {wkr.position_name} </td>
                    <td className="p-2 border border-gray-300"> 
                      <div className={`flex items-center justify-start ${getWorkerStatus(wkr.status).color}`}> 
                        <h3 className='h-full w-full'>{getWorkerStatus(wkr.status).text}</h3> 
                      </div> 
                    </td>
                    <td className="p-2 border border-gray-300"> { wkr.phone_youre } </td>
                    <td className="p-2 border border-gray-300"> {wkr.phone_youre} </td>
                    <td className="p-2 border border-gray-300"> 
                      <div className='flex justify-center'>
                        <Button type='button' onClick={() => handleGoEdit(String(wkr.id))} className='w-12 h-full'> <PenLine  /> </Button>
                      </div> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Jami {total_pages} xodim
            </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={() => fetchWorkers({ filters: filtersQuery, page_number: current_page - 1})} disabled={current_page === 1}> Oldingi </Button>
              <Button variant="outline" size="sm" onClick={() => fetchWorkers({ filters: filtersQuery, page_number: current_page + 1}) } disabled={current_page === total_pages}> Keyingi </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
} 
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { workersAPI } from '@/services/workers.service';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';
import { TWorkers, WorkerStatusEnum } from '@/types/types';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { ChevronLeft, PenLine, Plus, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { _facke_workers, ITEMS_PER_PAGE, MONTHS, StatusInfo, WORKER_STATUS_INFO, YEARS } from '@/constants';

export default function Workers() {
  // STETS
  const [data, setData] = useState(_facke_workers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  // VARABELS
  const filteredWorkers = data.filter((wkr) => wkr.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredWorkers.slice(startIndex, endIndex);
  
  // HOOKS
  const navigate = useNavigate();

  // EFFECTS
  useEffect(() => {
    // fetchWorkers();
  }, []);


  const fetchWorkers = async () => {
    try {
      setIsLoading(true);
      const data = await workersAPI.getAll();
      setData(data);
      toast({ title: "Muvaffaqiyatli yuklandi", description: "Topshiriqlar ro'yxati yangilandi" });
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Topshiriqlarni yuklashda xatolik yuz berdi" });
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
              <Input type="search" placeholder="Topshiriqni qidirish..." className="w-full" value={searchQuery} onChange={handleSearch} />
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
                {currentData.map((wkr, ind) => (
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
              Jami {filteredWorkers.length} xodim
            </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}> Oldingi </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) } disabled={currentPage === totalPages}> Keyingi </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
} 
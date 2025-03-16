import { TWorkers } from '../../types/types';
import { MONTHS } from '@/constants';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useState, useEffect, ChangeEvent } from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { ChevronLeft, Plus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const _tasks: TWorkers[] =  [ 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36",
      passport_series: "AB" 
    }, 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36" ,
      passport_series: "AB"
    }, 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36" ,
      passport_series: "AB"
    }, 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36" ,
      passport_series: "AB"
    }, 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36" ,
      passport_series: "AB"
    }, 
    { 
      id: 1,
      name: "Avazbek",
      section_id: null,
      section_name: null,
      position_id: "1",
      position_name: "Dasturchi",
      birthday: "03.04.2020",
      phone_youre: "+998991940851",
      phone_additional: null,
      phone_work: null,
      address: null,
      education: null,
      education_place: null,
      photo: null,
      passport_number: null,
      state_id: null,
      state_name: null,
      region_id: null,
      region_name: null,
      responsible_worker: "Supper admin",
      status: "is_active",
      date: "10.03.2025 11:36" ,
      passport_series: "AB"
    }, 
  ]
export default function Workers() {
  const navigate = useNavigate();

  const [data, setData] = useState(_tasks);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  // const fetchTasks = async () => {
  //   try {
  //     setIsLoading(true);
  //     // const data = await tasksAPI.getAll();
  //     // setTasks(data);
  //     toast({ title: "Muvaffaqiyatli yuklandi", description: "Topshiriqlar ro'yxati yangilandi" });
  //   } catch (err) {
  //     toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Topshiriqlarni yuklashda xatolik yuz berdi" });
  //     console.error('Error fetching tasks:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchTasks();
  }, []);


  const filteredTasks = data.filter((wkr) => wkr.name.toLowerCase().includes(searchQuery.toLowerCase()) );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredTasks.slice(startIndex, endIndex);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleGoBack = () => navigate(-1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
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
                  {years.map((year) => ( <SelectItem key={year} value={year.toString()}> {year} </SelectItem> ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-auto max-h-[60vh]">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              {/* TEPADAGI HEADER QISMI */}
              <thead className="bg-white dark:bg-black sticky top-0 z-20 shadow-md border-b-2 border-gray-400">
                <tr className="border-b border-gray-300">
                  <th className="p-2 text-left w-[120px] border border-gray-300">Tug'ilgan sana</th>
                  <th className="p-2 text-left w-[250px] border border-gray-300">Topshiriqlar</th>
                  <th className="p-2 text-left w-[150px] border border-gray-300">Berilgan muddatda</th>
                  <th className="p-2 text-left w-[150px] border border-gray-300">Muddat nazorati</th>
                  <th className="p-2 text-left w-[120px] border border-gray-300">Prioritet</th>
                  <th className="p-2 text-left w-[80px] border border-gray-300">Ball</th>
                  <th className="p-2 text-left w-[150px] border border-gray-300">Tasdiqlash</th>
                </tr>
              </thead>

              {/* BODY QISMI */}
              <tbody className="cursor-pointer">
                {currentData.map((wkr) => (
                  <tr key={wkr.id} className="border-b border-gray-300">
                    <td className="p-2 border border-gray-300"> {wkr.name} </td>
                    <td className="p-2 border border-gray-300"> {wkr.id} </td>
                    <td className="p-2 border border-gray-300"> {wkr.birthday} </td>
                    <td className="p-2 border border-gray-300"> {wkr.address} </td>
                    <td className="p-2 border border-gray-300"> {wkr.date}  </td>
                    <td className="p-2 border border-gray-300"> { wkr.phone_youre } </td>
                    <td className="p-2 border border-gray-300"> {wkr.position_name} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Jami {filteredTasks.length} topshiriq
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
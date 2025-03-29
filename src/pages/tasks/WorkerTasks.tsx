import TaskTab from './components/TaskTab';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';
import { workersAPI } from '@/services/workers.service';
import { useNavigate, useParams } from "react-router-dom"
import { TTaskCategory, TWorkers } from '../../types/types';
import { taskCategoryApi } from '@/services/taskCategory.service';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Plus, DollarSign, Users, Activity, CreditCard, ChevronLeft } from 'lucide-react';

const WorkerTasks = () => {
  const { worker_id } = useParams()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState<TWorkers>();
  const [tabs, setTabs] = useState<TTaskCategory[]>([]);
  const [active_tab, setActiveTab] = useState("1"); // 1 id

  const fetchData = async () => {
    setLoading(true);
    try {
      const workerRes = await workersAPI.getById(Number(worker_id));
      if (!workerRes.status) throw new Error();
        const [assigmentCategoryRes] = await Promise.all([ taskCategoryApi.getAll() ])
        
        setWorker(workerRes.resoult);
        setTabs(assigmentCategoryRes.resoult)

        toast({title: "Muvaffaqiyatli yuklandi", description: "Ma'lumotlar ro'yxati yuklandi"});
    } catch (err) {
      toast({variant: "destructive", title: "Xatolik yuz berdi", description: "Ma'lumotlarni yuklashda xatolik yuz berdi" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  },[worker_id])
      

  const handleGoBack = () => navigate(-1)
  const handleTab = (e:string) => setActiveTab(e)
  const handleToggleAddModal = () => navigate(`/tasks/add-task/${worker?.id}/${active_tab}`)

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold">{worker?.name}ning <span className="text-xl">ish stoli</span></h2>
          <Button onClick={handleToggleAddModal} variant={"primary"} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Yangi topshiriq
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
              <CardTitle className="text-sm font-medium"> KPI ballari</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='p-2'>
              <div className="text-2xl font-bold">85 ball</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
              <CardTitle className="text-sm font-medium"> Jami bajargan vazifalari </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='p-2'>
              <div className="text-2xl font-bold">+50</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
              <CardTitle className="text-sm font-medium"> Mudatdan o'tgan topshiriqlar </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='p-2'>
              <div className="text-2xl font-bold">12 ta</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
              <CardTitle className="text-sm font-medium"> Shu oyda qoldirga ish kunlari </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='p-2'>
              <div className="text-2xl font-bold">4 kun</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='1' value={String(active_tab)} onValueChange={handleTab} className="w-full">
          <TabsList className="mb-4 h-12 w-full flex justify-between">
            {tabs.map(tab => <TabsTrigger value={String(tab.id)} key={tab.id} className='h-9 w-full text-lg'>{tab.name}</TabsTrigger>)}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent value={String(tab.id)} key={tab.id}> 
              <TaskTab worker_id={Number(worker?.id)} assigment_category={tab} /> 
            </TabsContent>)
          )}
        </Tabs>


      </div>
    </>
  );
};

export default WorkerTasks; 
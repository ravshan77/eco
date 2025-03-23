import TaskTab1 from './TaskTab1';
import { Task } from '../../types/types';
import { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';
import { useNavigate, useParams } from "react-router-dom"
import AddTaskModal from '../../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Plus, DollarSign, ArrowUp, Users, ArrowUpRight, Activity, CreditCard, ArrowDown, ChevronLeft } from 'lucide-react';

const TasksToEmployee = () => {
  const { name } = useParams()
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tab, setTab] = useState("tasks");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // const data = await tasksAPI.getAll();
      toast({ title: "Muvaffaqiyatli yuklandi", description: "Topshiriqlar ro'yxati yangilandi" });
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Topshiriqlarni yuklashda xatolik yuz berdi" });
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchTasks();
  }, []);

  const handleAddTask = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      setIsActionLoading(true);
      await tasksAPI.create({ ...data, createdAt: new Date().toISOString() });
      await fetchTasks();
      setIsAddModalOpen(false);
      toast({ title: "Muvaffaqiyatli qo'shildi", description: "Yangi topshiriq qo'shildi" });
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Topshiriq qo'shishda xatolik yuz berdi" });
      console.error('Error creating task:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleAddModal = () => setIsAddModalOpen(prev => !prev)
  const handleGoBack = () => navigate(-1)

  const handleTab = (e:string) => setTab(e)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {isActionLoading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" /> Ortga </Button>
          <h2 className="text-2xl font-bold">{name}ning ish stoli</h2>
          <Button onClick={handleToggleAddModal} variant={"primary"} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Yangi topshiriq
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> KPI ballari (shu oy)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85 ball</div>
              {/* <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center"> 
                   <ArrowUp className="h-4 w-4 mr-1" /> +20% 
                </span>{" "} o'tgan oyga nisbatan
              </p> */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Jami bajargan vazifalari </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+50</div>
              {/* <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center"> <ArrowUpRight className="h-4 w-4 mr-1" /> +80 </span>{" "}
                o'tgan haftaga nisbatan
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Mudatdan o'tgan topshiriqlar </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 ta</div>
              {/* <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +19 ta
                </span>{" "}
                o'tgan oyga nisbatan
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Shu oyda qoldirga ish kunlari </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4 kun</div>
              {/* <p className="text-xs text-muted-foreground">
                <span className="text-red-500 inline-flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  26
                </span>{" "}
                 kundan
              </p> */}
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={handleTab} className="w-full">
          <TabsList className="mb-4 h-14 w-full flex justify-between">
            <TabsTrigger value="tasks" className='h-11 w-full text-lg'>Kunlik vazifalar (Lavozim yoʼriqnoma)</TabsTrigger>
            <TabsTrigger value="performance" className='h-11 w-full text-lg'>Qo'shimcha vazifalar</TabsTrigger>
            <TabsTrigger value="info" className='h-11 w-full text-lg'>Topshiriqlar</TabsTrigger>
            <TabsTrigger value="other" className='h-11 w-full text-lg'>Yillik va oylik reja</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskTab1 />
          </TabsContent>

          <TabsContent value="performance">
            <TaskTab1 />
          </TabsContent>

          <TabsContent value="info">
            <TaskTab1 />
          </TabsContent>

          <TabsContent value="other">
            <TaskTab1 />
          </TabsContent>

          </Tabs>


      </div>

      <AddTaskModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddTask} />
    </>
  );
};

export default TasksToEmployee; 
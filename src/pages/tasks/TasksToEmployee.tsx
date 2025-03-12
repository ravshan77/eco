import { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, DollarSign, ArrowUp, Users, ArrowUpRight, Activity, CreditCard, ArrowDown, ChevronLeft } from 'lucide-react';
import { Task } from '../../types';
import { tasksAPI } from '../../services/api';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { toast } from '../../components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TasksToEmployee = () => {
  const { name } = useParams()
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([ 
    { assignedTo: '67345673456734567345673456734567', createdAt: '11.03.2025 - 20.06.2025', deadline: '2025-03-11', description: "Reyd chorshanba kuni o'tqazish", id: '1', priority: 'low', status: 'completed', title: 'Birnarsa qilib bajardi' }, 
    { assignedTo: '67345673456734567345673456734568', createdAt: '23.03.2025 - 14.04.2025', deadline: '2025-04-07 ', description: 'Xududlar mojorosini taxlil qilish', id: '2', priority: 'high', status: 'pending', title: '' }, 
    { assignedTo: '67345673456734567345673456734569', createdAt: '03.03.2025 - 02.09.2025', deadline: '2025-09-07 ', description: "Targ'ibot ishlari", id: '3', priority: 'medium', status: 'in_progress', title: '' }, 
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 5;

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const months = [
    { value: "1", label: "Yanvar" },
    { value: "2", label: "Fevral" },
    { value: "3", label: "Mart" },
    { value: "4", label: "Aprel" },
    { value: "5", label: "May" },
    { value: "6", label: "Iyun" },
    { value: "7", label: "Iyul" },
    { value: "8", label: "Avgust" },
    { value: "9", label: "Sentabr" },
    { value: "10", label: "Oktabr" },
    { value: "11", label: "Noyabr" },
    { value: "12", label: "Dekabr" },
  ]

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await tasksAPI.getAll();
      setTasks(data);
      toast({
        title: "Muvaffaqiyatli yuklandi",
        description: "Topshiriqlar ro'yxati yangilandi",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: "Topshiriqlarni yuklashda xatolik yuz berdi",
      });
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
      await tasksAPI.create({
        ...data,
        createdAt: new Date().toISOString(),
      });
      await fetchTasks();
      setIsAddModalOpen(false);
      toast({
        title: "Muvaffaqiyatli qo'shildi",
        description: "Yangi topshiriq qo'shildi",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: "Topshiriq qo'shishda xatolik yuz berdi",
      });
      console.error('Error creating task:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      setIsActionLoading(true);
      await tasksAPI.updateStatus(taskId, newStatus);
      await fetchTasks();
      toast({
        title: "Muvaffaqiyatli yangilandi",
        description: "Topshiriq statusi yangilandi",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: "Status yangilashda xatolik yuz berdi",
      });
      console.error('Error updating task status:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusTextComplate = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Tasdiqlangan';
      case 'in_progress':
        return 'Yakunlandi';
      case 'pending':
        return 'Kutilmoqda';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Yuqori';
      case 'medium':
        return "O'rta";
      case 'low':
        return 'Past';
      default:
        return priority;
    }
  };

  const handleToggleAddModal = () => setIsAddModalOpen(prev => !prev)
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
      {isActionLoading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Ortga
          </Button>
          <h2 className="text-2xl font-bold">{name}ning ish stoli</h2>
          <Button onClick={handleToggleAddModal} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yangi topshiriq
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Baxolash tizimi (KPI) </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100 ball</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center"> 
                   <ArrowUp className="h-4 w-4 mr-1" /> +20% 
                </span>{" "} o'tgan oyga nisbatan
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Qo'shimcha balli </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+50</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center"> <ArrowUpRight className="h-4 w-4 mr-1" /> +80 </span>{" "}
                o'tgan haftaga nisbatan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Bajarilgan topshiriqlar </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34 ta</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +19 ta
                </span>{" "}
                o'tgan oyga nisbatan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> Ish haqi to'lovlari </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23,500,000 so'm</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 inline-flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  -4%
                </span>{" "}
                o'tgan oyga nisbatan
              </p>
            </CardContent>
          </Card>
        </div>


        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-4 h-14 w-full flex justify-between">
            <TabsTrigger value="tasks" className='h-11 w-full text-lg'>Kunlik vazifalar</TabsTrigger>
            <TabsTrigger value="performance" className='h-11 w-full text-lg'>Qo'shimcha vazifalar</TabsTrigger>
            <TabsTrigger value="info" className='h-11 w-full text-lg'>Topshiriqlar</TabsTrigger>
            <TabsTrigger value="other" className='h-11 w-full text-lg'>Yillik va oylik reja</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
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
                      {months.map((month) => ( <SelectItem key={month.value} value={month.value}> {month.label} </SelectItem> ))}
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

              <div className="rounded-md border overflow-x-auto min-h-max">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Sana</th>
                      <th className="p-2 text-left">Topshiriqlar</th>
                      <th className="p-2 text-left">Berilgan muddatda</th>
                      <th className="p-2 text-left">Muddat nazorati</th>
                      <th className="p-2 text-left">Prioritet</th>
                      <th className="p-2 text-left">Natijasi</th>
                      <th className="p-2 text-left">Tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody className='cursor-pointer'>
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="p-2"> <div className="text-left space-x-1"> {task.deadline} </div> </td>
                        <td className="p-2">{task.description}</td>
                        <td className="p-2">{task.createdAt}</td>
                        <td className="p-2"> <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}> {getPriorityText(task.priority)} </span> </td>
                        <td className="p-2">
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) } className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status)}`} >
                            <option value="pending">Kutilmoqda</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="completed">Bajarilgan</option>
                          </select>
                        </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{task.title}</span> </div> </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{getStatusTextComplate(task.status)}</span> </div> </td>
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
          </TabsContent>

          <TabsContent value="performance">
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
                      {months.map((month) => ( <SelectItem key={month.value} value={month.value}> {month.label} </SelectItem> ))}
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

              <div className="rounded-md border overflow-x-auto min-h-max">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Sana</th>
                      <th className="p-2 text-left">Topshiriqlar</th>
                      <th className="p-2 text-left">Berilgan muddatda</th>
                      <th className="p-2 text-left">Muddat nazorati</th>
                      <th className="p-2 text-left">Prioritet</th>
                      <th className="p-2 text-left">Natijasi</th>
                      <th className="p-2 text-left">Tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody className='cursor-pointer'>
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="p-2"> <div className="text-left space-x-1"> {task.deadline} </div> </td>
                        <td className="p-2">{task.description}</td>
                        <td className="p-2">{task.createdAt}</td>
                        <td className="p-2"> <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}> {getPriorityText(task.priority)} </span> </td>
                        <td className="p-2">
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) } className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status)}`} >
                            <option value="pending">Kutilmoqda</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="completed">Bajarilgan</option>
                          </select>
                        </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{task.title}</span> </div> </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{getStatusTextComplate(task.status)}</span> </div> </td>
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
          </TabsContent>

          <TabsContent value="info">
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
                      {months.map((month) => ( <SelectItem key={month.value} value={month.value}> {month.label} </SelectItem> ))}
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

              <div className="rounded-md border overflow-x-auto min-h-max">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Sana</th>
                      <th className="p-2 text-left">Topshiriqlar</th>
                      <th className="p-2 text-left">Berilgan muddatda</th>
                      <th className="p-2 text-left">Muddat nazorati</th>
                      <th className="p-2 text-left">Prioritet</th>
                      <th className="p-2 text-left">Natijasi</th>
                      <th className="p-2 text-left">Tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody className='cursor-pointer'>
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="p-2"> <div className="text-left space-x-1"> {task.deadline} </div> </td>
                        <td className="p-2">{task.description}</td>
                        <td className="p-2">{task.createdAt}</td>
                        <td className="p-2"> <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}> {getPriorityText(task.priority)} </span> </td>
                        <td className="p-2">
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) } className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status)}`} >
                            <option value="pending">Kutilmoqda</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="completed">Bajarilgan</option>
                          </select>
                        </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{task.title}</span> </div> </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{getStatusTextComplate(task.status)}</span> </div> </td>
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
          </TabsContent>

          <TabsContent value="other">
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
                      {months.map((month) => ( <SelectItem key={month.value} value={month.value}> {month.label} </SelectItem> ))}
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

              <div className="rounded-md border overflow-x-auto min-h-max">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Sana</th>
                      <th className="p-2 text-left">Topshiriqlar</th>
                      <th className="p-2 text-left">Berilgan muddatda</th>
                      <th className="p-2 text-left">Muddat nazorati</th>
                      <th className="p-2 text-left">Prioritet</th>
                      <th className="p-2 text-left">Natijasi</th>
                      <th className="p-2 text-left">Tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody className='cursor-pointer'>
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="p-2"> <div className="text-left space-x-1"> {task.deadline} </div> </td>
                        <td className="p-2">{task.description}</td>
                        <td className="p-2">{task.createdAt}</td>
                        <td className="p-2"> <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}> {getPriorityText(task.priority)} </span> </td>
                        <td className="p-2">
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) } className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status)}`} >
                            <option value="pending">Kutilmoqda</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="completed">Bajarilgan</option>
                          </select>
                        </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{task.title}</span> </div> </td>
                        <td className="p-2"> <div className="flex items-center space-x-1"> <span>{getStatusTextComplate(task.status)}</span> </div> </td>
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
          </TabsContent>

          </Tabs>


      </div>

      <AddTaskModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddTask} />
    </>
  );
};

export default TasksToEmployee; 
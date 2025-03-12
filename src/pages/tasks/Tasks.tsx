import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Clock } from 'lucide-react';
import { Task } from '../../types';
import { tasksAPI } from '../../services/api';
// import AddTaskModal from '../../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { toast } from '../../components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([ 
    { assignedTo: '67345673456734567345673456734561', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Darxat ekish', id: '1', priority: 'high', status: 'pending', title: 'Palonchayev Pistoncha' }, 
    { assignedTo: '67345673456734567345673456734562', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Seminar', id: '2', priority: 'high', status: 'pending', title: 'Kenjayev Islom' }, 
    { assignedTo: '67345673456734567345673456734563', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Majlis', id: '3', priority: 'high', status: 'pending', title: 'Salimov Jamshid' }, 
    { assignedTo: '67345673456734567345673456734564', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Tekshiruv', id: '4', priority: 'high', status: 'pending', title: 'Abdullayev Malik' }, 
    { assignedTo: '67345673456734567345673456734565', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Bugalteriga', id: '5', priority: 'high', status: 'pending', title: 'Xojiyev Ali' }, 
    { assignedTo: '67345673456734567345673456734566', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Dars ishlanma', id: '6', priority: 'high', status: 'pending', title: 'Abdusattorov Muxammad' }, 
    { assignedTo: '67345673456734567345673456734567', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Hisobotlar', id: '7', priority: 'high', status: 'pending', title: 'Erkinov Baxodir' }, 
    { assignedTo: '67345673456734567345673456734568', createdAt: '2025-03-11', deadline: '2025-03-11', description: "So'rovnoma", id: '8', priority: 'high', status: 'pending', title: 'Turaqulov Sherzod' }, 
    { assignedTo: '67345673456734567345673456734569', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Dehqonchilik', id: '9', priority: 'high', status: 'pending', title: 'Boborajabov Baxrom' }, 
    { assignedTo: '67345673456734567345673456734510', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Tumanlar bilan aloqa', id: '10', priority: 'high', status: 'pending', title: 'Vohidov Erkin' }, 
    { assignedTo: '67345673456734567345673456734511', createdAt: '2025-03-11', deadline: '2025-03-11', description: 'Tashkiliy ishlar', id: '11', priority: 'high', status: 'pending', title: 'Qudratov Sardor' }, 
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 10;

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

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Bajarilgan';
      case 'in_progress':
        return 'Jarayonda';
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

  const onRowDoubleClick = (e:Task) => {
   navigate(`/tasks-to-employee/${e.title}/${e.id}`);
  }

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
          <h3 className="text-2xl font-bold">Xodimlar ro'yxati</h3>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:max-w-md">
              <Input type="search" placeholder="Qidirish..." className="w-full" value={searchQuery} onChange={handleSearch} />
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
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
            </div> */}
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">F.I.O</th>
                  <th className="p-2 text-left">Tavsif</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Prioritet</th>  
                  <th className="p-2 text-left">Bajarilishi kerak</th>
                  <th className="p-2 text-left">Yaratilgan</th>
                </tr>
              </thead>
              <tbody className='cursor-pointer'>
                {currentTasks.map((task) => (
                  <tr onDoubleClick={() => onRowDoubleClick(task)} key={task.id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) }
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status )}`}
                      >
                        <option value="pending">Kutilmoqda</option>
                        <option value="in_progress">Jarayonda</option>
                        <option value="completed">Bajarilgan</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`} >
                        {getPriorityText(task.priority)}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{task.deadline}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{task.createdAt}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1"> Jami {filteredTasks.length} topshiriq </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} >
                Oldingi
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) } disabled={currentPage === totalPages} >
                Keyingi
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* <AddTaskModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddTask}
      /> */}
    </>
  );
};

export default Tasks; 
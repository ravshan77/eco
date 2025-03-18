import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Task } from '../../types/types';
import { tasksAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { toast } from '../../components/ui/use-toast';
import { useNavigate } from "react-router-dom"

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([ 
    { assignedTo: '+998 (50) 324 5434', createdAt: '2025-03-11', deadline: 'Toshkent', description: "Tashkiliy-partiyaviy ishlar rais o‘rinbosari", id: '1', priority: 'high', status: 'pending', title: 'Tojiyev Rustambek' }, 
    { assignedTo: '+998 (91) 567 6532', createdAt: '2025-03-11', deadline: 'Toshkent', description: 'Yoshlar va xotin-qizlar masalalari bo‘yicha rais', id: '2', priority: 'high', status: 'pending', title: 'Kenjayev Islom' }, 
    { assignedTo: '+998 (33) 097 6743', createdAt: '2025-03-11', deadline: 'Toshkent', description: "Partiya tashabusi bo'lim boshlig'i", id: '3', priority: 'high', status: 'pending', title: 'Salimov Jamshid' }, 
    { assignedTo: '+998 (94) 123 5433', createdAt: '2025-03-11', deadline: 'Toshkent', description: 'Ekologik siyosat va mafkuraviy ishlari raisni', id: '4', priority: 'high', status: 'pending', title: 'Abdullayev Malik' }, 
    { assignedTo: '+998 (99) 435 7123', createdAt: '2025-03-11', deadline: 'Sirdaryo', description: "Sirdaryo partiya tashkiloti Kengashi raisi", id: '5', priority: 'high', status: 'pending', title: 'Xojiyev Ali' }, 
    { assignedTo: '+998 (77) 456 7676', createdAt: '2025-03-11', deadline: 'Toshkent', description: 'Toshkent shahar partiya tashkiloti raisi', id: '6', priority: 'high', status: 'pending', title: 'Abdusattorov Muxammad' }, 
    { assignedTo: '+998 (90) 777 0986', createdAt: '2025-03-11', deadline: 'Toshkent', description: 'Toshkent viloyati partiya tashkiloti raisi', id: '7', priority: 'high', status: 'pending', title: 'Erkinov Baxodir' }, 
    { assignedTo: '+998 (93) 435 8798', createdAt: '2025-03-11', deadline: 'Andijon', description: "Andijon viloyati partiya tashkiloti raisi", id: '8', priority: 'high', status: 'pending', title: 'Turaqulov Sherzod' }, 
    { assignedTo: '+998 (93) 658 2345', createdAt: '2025-03-11', deadline: "Farg'ona", description: 'Farg`ona viloyati partiya tashkiloti raisi', id: '9', priority: 'high', status: 'pending', title: 'Boborajabov Baxrom' }, 
    { assignedTo: '+998 (98) 870 3213', createdAt: '2025-03-11', deadline: 'Namangan', description: 'Namangan viloyati partiya tashkiloti raisi', id: '10', priority: 'high', status: 'pending', title: 'Vohidov Erkin' }, 
    { assignedTo: '+998 (95) 900 4515', createdAt: '2025-03-11', deadline: 'Buxoro', description: 'Buxoro viloyat partiya tashkiloti Kengashi Ijroiya qo‘mitasi raisi', id: '11', priority: 'high', status: 'pending', title: 'Qudratov Sardor' }, 
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
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
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b bg-muted/50">
                <th className="p-2 text-left">№</th>
                  <th className="p-2 text-left">F.I.O</th>
                  <th className="p-2 text-left">Lavozimi</th>
                  <th className="p-2 text-left">Tel</th>
                  <th className="p-2 text-left">Viloyat</th>
                  <th className="p-2 text-left">Tug'ilgan sana</th>
                </tr>
              </thead>
              <tbody className='cursor-pointer'>
                {currentTasks.map((task, ind) => (
                  <tr onDoubleClick={() => onRowDoubleClick(task)} key={task.id} className="border-b">
                    <td className="p-2 w-8">{ind}</td>
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">{task.assignedTo}</td>
                    <td className="p-2">{task.deadline}</td>
                    <td className="p-2">{task.createdAt}</td>
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
    </>
  );
};

export default Tasks; 
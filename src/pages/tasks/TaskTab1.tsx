import { Task } from '../../types/types';
import { MONTHS } from '@/constants';
import { tasksAPI } from '../../services/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';
import { useState, useEffect, ChangeEvent } from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const _tasks: Task[] =  [ 
    { assignedTo: '67345673456734567345673456734567', createdAt: '11.03.2025 - 20.06.2025', deadline: '2025-03-11', description: "Reyd chorshanba kuni o'tqazish", id: '1', priority: 'low', status: 'completed', title: 'Birnarsa qilib bajardi' }, 
    { assignedTo: '67345673456734567345673456734568', createdAt: '23.03.2025 - 14.04.2025', deadline: '2025-04-07 ', description: 'Xududlar mojorosini taxlil qilish', id: '2', priority: 'high', status: 'pending', title: '' }, 
    { assignedTo: '67345673456734567345673456734569', createdAt: '03.03.2025 - 02.09.2025', deadline: '2025-09-07 ', description: "Targ'ibot ishlari", id: '3', priority: 'medium', status: 'in_progress', title: '' }, 
  ]

const TaskTab1 = () => {
  
    const [tasks, setTasks] = useState(_tasks);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await tasksAPI.getAll();
        setTasks(data);
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
  
  
    const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
      try {
        setIsActionLoading(true);
        await tasksAPI.updateStatus(taskId, newStatus);
        await fetchTasks();
        toast({ title: "Muvaffaqiyatli yangilandi", description: "Topshiriq statusi yangilandi" });
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: "Status yangilashda xatolik yuz berdi" });
        console.error('Error updating task status:', err);
      } finally {
        setIsActionLoading(false);
      }
    };
  
    const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()) );
  
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
          return 'Tasdiqlandi';
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
  
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
  
  return (
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

    <div className="rounded-md border overflow-x-auto min-h-max">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">Sana</th>
            <th className="p-2 text-left">Topshiriqlar</th>
            <th className="p-2 text-left">Berilgan muddatda</th>
            <th className="p-2 text-left">Muddat nazorati</th>
            <th className="p-2 text-left">Prioritet</th>
            <th className="p-2 text-left">Ball</th>
            <th className="p-2 text-left">Tasdiqlash</th>
          </tr>
        </thead>
        <tbody className='cursor-pointer'>
          {currentTasks.map((task) => (
            <tr key={task.id} className="border-b">
              <td className="p-2"> <div className="text-left space-x-1"> {task.deadline} </div> </td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.createdAt}</td>
              <td className="p-2"> <span className={`flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}> {getPriorityText(task.priority)} </span> </td>
              <td className="p-2">
                <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status']) } className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor( task.status)}`} >
                  <option value="pending">Kutilmoqda</option>
                  <option value="in_progress">Bajarilgan</option>
                  <option value="completed">Bajarilgan</option>
                </select>
              </td>
              <td className="p-2"> <div className="flex items-center space-x-1"> <span>50</span> </div> </td>
              <td className="p-2"> <div className={`flex items-center space-x-1 ${getStatusColor( task.status)}`}> <span>{getStatusTextComplate(task.status)}</span> </div> </td>
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
  )
}

export default TaskTab1
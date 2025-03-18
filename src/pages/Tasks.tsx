import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { Task } from '../types/types';
import { tasksAPI } from '../services/api';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { LoadingOverlay } from '../components/ui/loading-overlay';
import { toast } from '../components/ui/use-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

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
    fetchTasks();
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

  // const getStatusText = (status: Task['status']) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'Bajarilgan';
  //     case 'in_progress':
  //       return 'Jarayonda';
  //     case 'pending':
  //       return 'Kutilmoqda';
  //     default:
  //       return status;
  //   }
  // };

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
    <>
      {isActionLoading && <LoadingOverlay />}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Topshiriqlar</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi topshiriq
          </Button>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Topshiriq qidirish..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Nomi</th>
                  <th className="p-2 text-left">Tavsif</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Prioritet</th>
                  <th className="p-2 text-left">Bajarilishi kerak</th>
                  <th className="p-2 text-left">Yaratilgan</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value as Task['status'])
                        }
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        <option value="pending">Kutilmoqda</option>
                        <option value="in_progress">Jarayonda</option>
                        <option value="completed">Bajarilgan</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
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

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Jami {filteredTasks.length} topshiriq
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Oldingi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Keyingi
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AddTaskModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddTask}
      />
    </>
  );
};

export default Tasks; 
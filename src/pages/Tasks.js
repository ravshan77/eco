import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { tasksAPI } from '../services/api';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { LoadingOverlay } from '../components/ui/loading-overlay';
import { toast } from '../components/ui/use-toast';
const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 5;
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const data = await tasksAPI.getAll();
            setTasks(data);
            toast({
                title: "Muvaffaqiyatli yuklandi",
                description: "Topshiriqlar ro'yxati yangilandi",
            });
        }
        catch (err) {
            toast({
                variant: "destructive",
                title: "Xatolik yuz berdi",
                description: "Topshiriqlarni yuklashda xatolik yuz berdi",
            });
            console.error('Error fetching tasks:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    const handleAddTask = async (data) => {
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
        }
        catch (err) {
            toast({
                variant: "destructive",
                title: "Xatolik yuz berdi",
                description: "Topshiriq qo'shishda xatolik yuz berdi",
            });
            console.error('Error creating task:', err);
        }
        finally {
            setIsActionLoading(false);
        }
    };
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            setIsActionLoading(true);
            await tasksAPI.updateStatus(taskId, newStatus);
            await fetchTasks();
            toast({
                title: "Muvaffaqiyatli yangilandi",
                description: "Topshiriq statusi yangilandi",
            });
        }
        catch (err) {
            toast({
                variant: "destructive",
                title: "Xatolik yuz berdi",
                description: "Status yangilashda xatolik yuz berdi",
            });
            console.error('Error updating task status:', err);
        }
        finally {
            setIsActionLoading(false);
        }
    };
    const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, endIndex);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const getStatusColor = (status) => {
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
    const getStatusText = (status) => {
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
    const getPriorityColor = (priority) => {
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
    const getPriorityText = (priority) => {
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
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    return (_jsxs(_Fragment, { children: [isActionLoading && _jsx(LoadingOverlay, {}), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Topshiriqlar" }), _jsxs(Button, { onClick: () => setIsAddModalOpen(true), children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Yangi topshiriq"] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "mb-4 flex items-center space-x-4", children: _jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Topshiriq qidirish...", value: searchQuery, onChange: handleSearch, className: "pl-8" })] }) }), _jsx("div", { className: "rounded-md border", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Nomi" }), _jsx("th", { className: "p-2 text-left", children: "Tavsif" }), _jsx("th", { className: "p-2 text-left", children: "Status" }), _jsx("th", { className: "p-2 text-left", children: "Prioritet" }), _jsx("th", { className: "p-2 text-left", children: "Bajarilishi kerak" }), _jsx("th", { className: "p-2 text-left", children: "Yaratilgan" })] }) }), _jsx("tbody", { children: currentTasks.map((task) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: task.title }), _jsx("td", { className: "p-2", children: task.description }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: task.status, onChange: (e) => handleStatusChange(task.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`, children: [_jsx("option", { value: "pending", children: "Kutilmoqda" }), _jsx("option", { value: "in_progress", children: "Jarayonda" }), _jsx("option", { value: "completed", children: "Bajarilgan" })] }) }), _jsx("td", { className: "p-2", children: _jsx("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`, children: getPriorityText(task.priority) }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { children: task.deadline })] }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { children: task.createdAt })] }) })] }, task.id))) })] }) }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Jami ", filteredTasks.length, " topshiriq"] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: "Oldingi" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: "Keyingi" })] })] })] })] }), _jsx(AddTaskModal, { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, onSubmit: handleAddTask })] }));
};
export default Tasks;

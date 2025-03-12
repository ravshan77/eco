import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, DollarSign, ArrowUp, Users, ArrowUpRight, Activity, CreditCard, ArrowDown, ChevronLeft } from 'lucide-react';
import { tasksAPI } from '../../services/api';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { toast } from '../../components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const TasksToEmployee = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
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
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
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
    ];
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
        // fetchTasks();
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
    const getStatusTextComplate = (status) => {
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
    const handleToggleAddModal = () => setIsAddModalOpen(prev => !prev);
    const handleGoBack = () => navigate(-1);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    return (_jsxs(_Fragment, { children: [isActionLoading && _jsx(LoadingOverlay, {}), _jsxs("div", { className: "space-y-4 min-w-[360px]", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs(Button, { onClick: handleGoBack, className: "w-full sm:w-auto", children: [_jsx(ChevronLeft, { className: "mr-2 h-4 w-4" }), "Ortga"] }), _jsxs("h2", { className: "text-2xl font-bold", children: [name, "ning ish stoli"] }), _jsxs(Button, { onClick: handleToggleAddModal, className: "w-full sm:w-auto", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Yangi topshiriq"] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: " Baxolash tizimi (KPI) " }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "100 ball" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [_jsx(ArrowUp, { className: "h-4 w-4 mr-1" }), " +20%"] }), " ", " o'tgan oyga nisbatan"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: " Qo'shimcha balli " }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "+50" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [" ", _jsx(ArrowUpRight, { className: "h-4 w-4 mr-1" }), " +80 "] }), " ", "o'tgan haftaga nisbatan"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: " Bajarilgan topshiriqlar " }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "34 ta" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [_jsx(ArrowUp, { className: "h-4 w-4 mr-1" }), "+19 ta"] }), " ", "o'tgan oyga nisbatan"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: " Ish haqi to'lovlari " }), _jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "23,500,000 so'm" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-red-500 inline-flex items-center", children: [_jsx(ArrowDown, { className: "h-4 w-4 mr-1" }), "-4%"] }), " ", "o'tgan oyga nisbatan"] })] })] })] }), _jsxs(Tabs, { defaultValue: "tasks", className: "w-full", children: [_jsxs(TabsList, { className: "mb-4 h-14 w-full flex justify-between", children: [_jsx(TabsTrigger, { value: "tasks", className: 'h-11 w-full text-lg', children: "Kunlik vazifalar" }), _jsx(TabsTrigger, { value: "performance", className: 'h-11 w-full text-lg', children: "Qo'shimcha vazifalar" }), _jsx(TabsTrigger, { value: "info", className: 'h-11 w-full text-lg', children: "Topshiriqlar" }), _jsx(TabsTrigger, { value: "other", className: 'h-11 w-full text-lg', children: "Yillik va oylik reja" })] }), _jsx(TabsContent, { value: "tasks", children: _jsxs(Card, { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4", children: [_jsx("div", { className: "w-full sm:max-w-md", children: _jsx(Input, { type: "search", placeholder: "Topshiriqni qidirish...", className: "w-full", value: searchQuery, onChange: handleSearch }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto", children: [_jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Oy" }) }), _jsx(SelectContent, { children: months.map((month) => (_jsxs(SelectItem, { value: month.value, children: [" ", month.label, " "] }, month.value))) })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[120px]", children: _jsx(SelectValue, { placeholder: "Yil" }) }), _jsx(SelectContent, { children: years.map((year) => (_jsxs(SelectItem, { value: year.toString(), children: [" ", year, " "] }, year))) })] })] })] }), _jsx("div", { className: "rounded-md border overflow-x-auto min-h-max", children: _jsxs("table", { className: "w-full min-w-[640px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Sana" }), _jsx("th", { className: "p-2 text-left", children: "Topshiriqlar" }), _jsx("th", { className: "p-2 text-left", children: "Berilgan muddatda" }), _jsx("th", { className: "p-2 text-left", children: "Muddat nazorati" }), _jsx("th", { className: "p-2 text-left", children: "Prioritet" }), _jsx("th", { className: "p-2 text-left", children: "Natijasi" }), _jsx("th", { className: "p-2 text-left", children: "Tasdiqlash" })] }) }), _jsx("tbody", { className: 'cursor-pointer', children: currentTasks.map((task) => (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "text-left space-x-1", children: [" ", task.deadline, " "] }), " "] }), _jsx("td", { className: "p-2", children: task.description }), _jsx("td", { className: "p-2", children: task.createdAt }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`, children: [" ", getPriorityText(task.priority), " "] }), " "] }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: task.status, onChange: (e) => handleStatusChange(task.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`, children: [_jsx("option", { value: "pending", children: "Kutilmoqda" }), _jsx("option", { value: "in_progress", children: "Jarayonda" }), _jsx("option", { value: "completed", children: "Bajarilgan" })] }) }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: task.title }), " "] }), " "] }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: getStatusTextComplate(task.status) }), " "] }), " "] })] }, task.id))) })] }) }), _jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground order-2 sm:order-1", children: ["Jami ", filteredTasks.length, " topshiriq"] }), _jsxs("div", { className: "flex items-center space-x-2 order-1 sm:order-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: " Oldingi " }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: " Keyingi " })] })] })] }) }), _jsx(TabsContent, { value: "performance", children: _jsxs(Card, { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4", children: [_jsx("div", { className: "w-full sm:max-w-md", children: _jsx(Input, { type: "search", placeholder: "Topshiriqni qidirish...", className: "w-full", value: searchQuery, onChange: handleSearch }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto", children: [_jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Oy" }) }), _jsx(SelectContent, { children: months.map((month) => (_jsxs(SelectItem, { value: month.value, children: [" ", month.label, " "] }, month.value))) })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[120px]", children: _jsx(SelectValue, { placeholder: "Yil" }) }), _jsx(SelectContent, { children: years.map((year) => (_jsxs(SelectItem, { value: year.toString(), children: [" ", year, " "] }, year))) })] })] })] }), _jsx("div", { className: "rounded-md border overflow-x-auto min-h-max", children: _jsxs("table", { className: "w-full min-w-[640px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Sana" }), _jsx("th", { className: "p-2 text-left", children: "Topshiriqlar" }), _jsx("th", { className: "p-2 text-left", children: "Berilgan muddatda" }), _jsx("th", { className: "p-2 text-left", children: "Muddat nazorati" }), _jsx("th", { className: "p-2 text-left", children: "Prioritet" }), _jsx("th", { className: "p-2 text-left", children: "Natijasi" }), _jsx("th", { className: "p-2 text-left", children: "Tasdiqlash" })] }) }), _jsx("tbody", { className: 'cursor-pointer', children: currentTasks.map((task) => (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "text-left space-x-1", children: [" ", task.deadline, " "] }), " "] }), _jsx("td", { className: "p-2", children: task.description }), _jsx("td", { className: "p-2", children: task.createdAt }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`, children: [" ", getPriorityText(task.priority), " "] }), " "] }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: task.status, onChange: (e) => handleStatusChange(task.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`, children: [_jsx("option", { value: "pending", children: "Kutilmoqda" }), _jsx("option", { value: "in_progress", children: "Jarayonda" }), _jsx("option", { value: "completed", children: "Bajarilgan" })] }) }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: task.title }), " "] }), " "] }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: getStatusTextComplate(task.status) }), " "] }), " "] })] }, task.id))) })] }) }), _jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground order-2 sm:order-1", children: ["Jami ", filteredTasks.length, " topshiriq"] }), _jsxs("div", { className: "flex items-center space-x-2 order-1 sm:order-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: " Oldingi " }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: " Keyingi " })] })] })] }) }), _jsx(TabsContent, { value: "info", children: _jsxs(Card, { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4", children: [_jsx("div", { className: "w-full sm:max-w-md", children: _jsx(Input, { type: "search", placeholder: "Topshiriqni qidirish...", className: "w-full", value: searchQuery, onChange: handleSearch }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto", children: [_jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Oy" }) }), _jsx(SelectContent, { children: months.map((month) => (_jsxs(SelectItem, { value: month.value, children: [" ", month.label, " "] }, month.value))) })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[120px]", children: _jsx(SelectValue, { placeholder: "Yil" }) }), _jsx(SelectContent, { children: years.map((year) => (_jsxs(SelectItem, { value: year.toString(), children: [" ", year, " "] }, year))) })] })] })] }), _jsx("div", { className: "rounded-md border overflow-x-auto min-h-max", children: _jsxs("table", { className: "w-full min-w-[640px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Sana" }), _jsx("th", { className: "p-2 text-left", children: "Topshiriqlar" }), _jsx("th", { className: "p-2 text-left", children: "Berilgan muddatda" }), _jsx("th", { className: "p-2 text-left", children: "Muddat nazorati" }), _jsx("th", { className: "p-2 text-left", children: "Prioritet" }), _jsx("th", { className: "p-2 text-left", children: "Natijasi" }), _jsx("th", { className: "p-2 text-left", children: "Tasdiqlash" })] }) }), _jsx("tbody", { className: 'cursor-pointer', children: currentTasks.map((task) => (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "text-left space-x-1", children: [" ", task.deadline, " "] }), " "] }), _jsx("td", { className: "p-2", children: task.description }), _jsx("td", { className: "p-2", children: task.createdAt }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`, children: [" ", getPriorityText(task.priority), " "] }), " "] }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: task.status, onChange: (e) => handleStatusChange(task.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`, children: [_jsx("option", { value: "pending", children: "Kutilmoqda" }), _jsx("option", { value: "in_progress", children: "Jarayonda" }), _jsx("option", { value: "completed", children: "Bajarilgan" })] }) }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: task.title }), " "] }), " "] }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: getStatusTextComplate(task.status) }), " "] }), " "] })] }, task.id))) })] }) }), _jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground order-2 sm:order-1", children: ["Jami ", filteredTasks.length, " topshiriq"] }), _jsxs("div", { className: "flex items-center space-x-2 order-1 sm:order-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: " Oldingi " }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: " Keyingi " })] })] })] }) }), _jsx(TabsContent, { value: "other", children: _jsxs(Card, { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4", children: [_jsx("div", { className: "w-full sm:max-w-md", children: _jsx(Input, { type: "search", placeholder: "Topshiriqni qidirish...", className: "w-full", value: searchQuery, onChange: handleSearch }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto", children: [_jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Oy" }) }), _jsx(SelectContent, { children: months.map((month) => (_jsxs(SelectItem, { value: month.value, children: [" ", month.label, " "] }, month.value))) })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-full sm:w-[120px]", children: _jsx(SelectValue, { placeholder: "Yil" }) }), _jsx(SelectContent, { children: years.map((year) => (_jsxs(SelectItem, { value: year.toString(), children: [" ", year, " "] }, year))) })] })] })] }), _jsx("div", { className: "rounded-md border overflow-x-auto min-h-max", children: _jsxs("table", { className: "w-full min-w-[640px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Sana" }), _jsx("th", { className: "p-2 text-left", children: "Topshiriqlar" }), _jsx("th", { className: "p-2 text-left", children: "Berilgan muddatda" }), _jsx("th", { className: "p-2 text-left", children: "Muddat nazorati" }), _jsx("th", { className: "p-2 text-left", children: "Prioritet" }), _jsx("th", { className: "p-2 text-left", children: "Natijasi" }), _jsx("th", { className: "p-2 text-left", children: "Tasdiqlash" })] }) }), _jsx("tbody", { className: 'cursor-pointer', children: currentTasks.map((task) => (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "text-left space-x-1", children: [" ", task.deadline, " "] }), " "] }), _jsx("td", { className: "p-2", children: task.description }), _jsx("td", { className: "p-2", children: task.createdAt }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`, children: [" ", getPriorityText(task.priority), " "] }), " "] }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: task.status, onChange: (e) => handleStatusChange(task.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`, children: [_jsx("option", { value: "pending", children: "Kutilmoqda" }), _jsx("option", { value: "in_progress", children: "Jarayonda" }), _jsx("option", { value: "completed", children: "Bajarilgan" })] }) }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: task.title }), " "] }), " "] }), _jsxs("td", { className: "p-2", children: [" ", _jsxs("div", { className: "flex items-center space-x-1", children: [" ", _jsx("span", { children: getStatusTextComplate(task.status) }), " "] }), " "] })] }, task.id))) })] }) }), _jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground order-2 sm:order-1", children: ["Jami ", filteredTasks.length, " topshiriq"] }), _jsxs("div", { className: "flex items-center space-x-2 order-1 sm:order-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: " Oldingi " }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: " Keyingi " })] })] })] }) })] })] }), _jsx(AddTaskModal, { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, onSubmit: handleAddTask })] }));
};
export default TasksToEmployee;

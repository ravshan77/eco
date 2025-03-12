import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { employeesAPI } from '../services/api';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 5;
    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const data = await employeesAPI.getAll();
            setEmployees(data);
            setError(null);
        }
        catch (err) {
            setError('Xodimlarni yuklashda xatolik yuz berdi');
            console.error('Error fetching employees:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);
    const handleAddEmployee = async (data) => {
        try {
            await employeesAPI.create(data);
            fetchEmployees();
            setIsAddModalOpen(false);
        }
        catch (err) {
            console.error('Error creating employee:', err);
        }
    };
    const filteredEmployees = employees.filter((employee) => employee.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'inactive':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { className: "text-red-500", children: error }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Xodimlar" }), _jsxs(Button, { onClick: () => setIsAddModalOpen(true), children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Yangi xodim"] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "mb-4 flex items-center space-x-4", children: _jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Xodim qidirish...", value: searchQuery, onChange: handleSearch, className: "pl-8" })] }) }), _jsx("div", { className: "rounded-md border", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Ism" }), _jsx("th", { className: "p-2 text-left", children: "Email" }), _jsx("th", { className: "p-2 text-left", children: "Telefon" }), _jsx("th", { className: "p-2 text-left", children: "Lavozim" }), _jsx("th", { className: "p-2 text-left", children: "Bo'lim" }), _jsx("th", { className: "p-2 text-left", children: "Status" }), _jsx("th", { className: "p-2 text-left", children: "Yaratilgan" })] }) }), _jsx("tbody", { children: currentEmployees.map((employee) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: employee.name }), _jsx("td", { className: "p-2", children: employee.email }), _jsx("td", { className: "p-2", children: employee.phone }), _jsx("td", { className: "p-2", children: employee.position }), _jsx("td", { className: "p-2", children: employee.department }), _jsx("td", { className: "p-2", children: _jsx("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(employee.status)}`, children: employee.status === 'active' ? 'Faol' : 'Faol emas' }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { children: formatDate(employee.createdAt) })] }) })] }, employee.id))) })] }) }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Jami ", filteredEmployees.length, " xodim"] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: "Oldingi" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: "Keyingi" })] })] })] }), _jsx(AddEmployeeModal, { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, onSubmit: handleAddEmployee })] }));
};
export default Employees;

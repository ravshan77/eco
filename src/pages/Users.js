import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { usersAPI } from '../services/api';
import AddUserModal from '../components/users/AddUserModal';
const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 5;
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await usersAPI.getAll();
            setUsers(data);
            setError(null);
        }
        catch (err) {
            setError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
            console.error('Error fetching users:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleAddUser = async (data) => {
        try {
            await usersAPI.create(data);
            fetchUsers();
            setIsAddModalOpen(false);
        }
        catch (err) {
            console.error('Error creating user:', err);
        }
    };
    const handleStatusChange = async (userId, newStatus) => {
        try {
            await usersAPI.updateStatus(userId, newStatus);
            fetchUsers();
        }
        catch (err) {
            console.error('Error updating user status:', err);
        }
    };
    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'manager':
                return 'bg-blue-100 text-blue-700';
            case 'employee':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    const getRoleText = (role) => {
        switch (role) {
            case 'admin':
                return 'Administrator';
            case 'manager':
                return 'Menejer';
            case 'employee':
                return 'Xodim';
            default:
                return role;
        }
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Foydalanuvchilar" }), _jsxs(Button, { onClick: () => setIsAddModalOpen(true), children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Yangi foydalanuvchi"] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "mb-4 flex items-center space-x-4", children: _jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Foydalanuvchi qidirish...", value: searchQuery, onChange: handleSearch, className: "pl-8" })] }) }), _jsx("div", { className: "rounded-md border", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "p-2 text-left", children: "Foydalanuvchi nomi" }), _jsx("th", { className: "p-2 text-left", children: "Email" }), _jsx("th", { className: "p-2 text-left", children: "Rol" }), _jsx("th", { className: "p-2 text-left", children: "Status" }), _jsx("th", { className: "p-2 text-left", children: "Oxirgi kirish" }), _jsx("th", { className: "p-2 text-left", children: "Yaratilgan" })] }) }), _jsx("tbody", { children: currentUsers.map((user) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2", children: user.username }), _jsx("td", { className: "p-2", children: user.email }), _jsx("td", { className: "p-2", children: _jsx("span", { className: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`, children: getRoleText(user.role) }) }), _jsx("td", { className: "p-2", children: _jsxs("select", { value: user.status, onChange: (e) => handleStatusChange(user.id, e.target.value), className: `rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`, children: [_jsx("option", { value: "active", children: "Faol" }), _jsx("option", { value: "inactive", children: "Faol emas" })] }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsx("span", { children: user.lastLogin })] }) }), _jsx("td", { className: "p-2", children: user.createdAt })] }, user.id))) })] }) }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Jami ", filteredUsers.length, " foydalanuvchi"] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, children: "Oldingi" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, children: "Keyingi" })] })] })] }), _jsx(AddUserModal, { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, onSubmit: handleAddUser })] }));
};
export default Users;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';
const formSchema = z.object({
    username: z.string().min(2, "Foydalanuvchi nomi kamida 2 ta harfdan iborat bo'lishi kerak"),
    email: z.string().email("Noto'g'ri email format"),
    role: z.enum(['admin', 'manager', 'employee']),
    status: z.enum(['active', 'inactive']),
});
const AddUserModal = ({ open, onOpenChange, onSubmit, }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            role: 'employee',
            status: 'active',
        },
    });
    const handleSubmit = (data) => {
        onSubmit(data);
        form.reset();
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Yangi foydalanuvchi qo'shish" }) }), _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Foydalanuvchi nomi" }), _jsx(Input, { ...form.register('username'), placeholder: "Foydalanuvchi nomini kiriting", className: form.formState.errors.username ? 'border-red-500' : '' }), form.formState.errors.username && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.username.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { ...form.register('email'), type: "email", placeholder: "email@example.com", className: form.formState.errors.email ? 'border-red-500' : '' }), form.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Rol" }), _jsxs(Select, { onValueChange: (value) => form.setValue('role', value), defaultValue: form.getValues('role'), children: [_jsx(SelectTrigger, { className: form.formState.errors.role ? 'border-red-500' : '', children: _jsx(SelectValue, { placeholder: "Rolni tanlang" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "admin", children: "Administrator" }), _jsx(SelectItem, { value: "manager", children: "Menejer" }), _jsx(SelectItem, { value: "employee", children: "Xodim" })] })] }), form.formState.errors.role && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.role.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Status" }), _jsxs(Select, { onValueChange: (value) => form.setValue('status', value), defaultValue: form.getValues('status'), children: [_jsx(SelectTrigger, { className: form.formState.errors.status ? 'border-red-500' : '', children: _jsx(SelectValue, { placeholder: "Statusni tanlang" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "active", children: "Faol" }), _jsx(SelectItem, { value: "inactive", children: "Faol emas" })] })] }), form.formState.errors.status && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.status.message }))] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: "Saqlash" }) })] })] }) }));
};
export default AddUserModal;

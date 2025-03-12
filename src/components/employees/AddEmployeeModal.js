import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';
const formSchema = z.object({
    name: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
    email: z.string().email("Noto'g'ri email format"),
    phone: z.string().min(12, "Telefon raqami noto'g'ri format"),
    position: z.string().min(1, "Lavozimni tanlang"),
    department: z.string().min(1, "Bo'limni tanlang"),
    status: z.enum(["active", "inactive"]),
});
const AddEmployeeModal = ({ open, onOpenChange, onSubmit, }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            position: '',
            department: '',
            status: 'active',
        },
    });
    const handleSubmit = (data) => {
        onSubmit(data);
        form.reset();
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Yangi xodim qo'shish" }) }), _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Ism" }), _jsx(Input, { ...form.register('name'), placeholder: "Xodim ismi", className: form.formState.errors.name ? 'border-red-500' : '' }), form.formState.errors.name && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { ...form.register('email'), type: "email", placeholder: "email@example.com", className: form.formState.errors.email ? 'border-red-500' : '' }), form.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Telefon" }), _jsx(Input, { ...form.register('phone'), placeholder: "+998 90 123 45 67", className: form.formState.errors.phone ? 'border-red-500' : '' }), form.formState.errors.phone && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.phone.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Lavozim" }), _jsxs(Select, { onValueChange: (value) => form.setValue('position', value), defaultValue: form.getValues('position'), children: [_jsx(SelectTrigger, { className: form.formState.errors.position ? 'border-red-500' : '', children: _jsx(SelectValue, { placeholder: "Lavozimni tanlang" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Frontend Developer", children: "Frontend Developer" }), _jsx(SelectItem, { value: "Backend Developer", children: "Backend Developer" }), _jsx(SelectItem, { value: "UI/UX Designer", children: "UI/UX Designer" }), _jsx(SelectItem, { value: "Project Manager", children: "Project Manager" })] })] }), form.formState.errors.position && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.position.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Bo'lim" }), _jsxs(Select, { onValueChange: (value) => form.setValue('department', value), defaultValue: form.getValues('department'), children: [_jsx(SelectTrigger, { className: form.formState.errors.department ? 'border-red-500' : '', children: _jsx(SelectValue, { placeholder: "Bo'limni tanlang" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "IT", children: "IT" }), _jsx(SelectItem, { value: "Design", children: "Design" }), _jsx(SelectItem, { value: "Marketing", children: "Marketing" }), _jsx(SelectItem, { value: "HR", children: "HR" })] })] }), form.formState.errors.department && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.department.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Status" }), _jsxs(Select, { onValueChange: (value) => form.setValue('status', value), defaultValue: form.getValues('status'), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Statusni tanlang" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "active", children: "Faol" }), _jsx(SelectItem, { value: "inactive", children: "Faol emas" })] })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: "Saqlash" }) })] })] }) }));
};
export default AddEmployeeModal;

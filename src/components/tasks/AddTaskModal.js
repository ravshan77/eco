import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LoadingSpinner } from '../ui/loading-spinner';
const taskSchema = z.object({
    title: z.string().min(1, "Topshiriq nomini kiriting"),
    description: z.string().min(1, "Topshiriq tavsifini kiriting"),
    priority: z.enum(["low", "medium", "high"]),
    deadline: z.string().min(1, "Muddatni kiriting"),
});
const AddTaskModal = ({ open, onOpenChange, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            deadline: '',
        },
    });
    const handleSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            await onSubmit({
                ...data,
                status: 'pending',
            });
            form.reset();
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Yangi topshiriq qo'shish" }) }), _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Nomi" }), _jsx(Input, { id: "title", ...form.register('title'), placeholder: "Topshiriq nomini kiriting", className: form.formState.errors.title ? 'border-red-500' : '' }), form.formState.errors.title && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.title.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Tavsif" }), _jsx(Input, { id: "description", ...form.register('description'), placeholder: "Topshiriq tavsifini kiriting", className: form.formState.errors.description ? 'border-red-500' : '' }), form.formState.errors.description && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.description.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "priority", children: "Prioritet" }), _jsxs("select", { id: "priority", ...form.register('priority'), className: "w-full rounded-md border border-input bg-background px-3 py-2", children: [_jsx("option", { value: "low", children: "Past" }), _jsx("option", { value: "medium", children: "O'rta" }), _jsx("option", { value: "high", children: "Yuqori" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "deadline", children: "Muddat" }), _jsx(Input, { id: "deadline", type: "date", ...form.register('deadline'), className: form.formState.errors.deadline ? 'border-red-500' : '' }), form.formState.errors.deadline && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.deadline.message }))] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), disabled: isSubmitting, children: "Bekor qilish" }), _jsxs(Button, { type: "submit", disabled: isSubmitting, children: [isSubmitting ? (_jsx(LoadingSpinner, { size: "sm", className: "mr-2" })) : null, "Qo'shish"] })] })] })] }) }));
};
export default AddTaskModal;

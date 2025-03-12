import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useTheme } from '../components/theme-provider';
const profileSchema = z.object({
    name: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
    email: z.string().email("Noto'g'ri email format"),
    phone: z.string().min(12, "Telefon raqami noto'g'ri format"),
    currentPassword: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    newPassword: z.string().min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
});
const systemSchema = z.object({
    systemName: z.string().min(1, "Tizim nomini kiriting"),
    systemDescription: z.string().min(1, "Tizim tavsifini kiriting"),
    timezone: z.string().min(1, "Vaqt mintaqasini tanlang"),
});
const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isSystemLoading, setIsSystemLoading] = useState(false);
    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });
    const systemForm = useForm({
        resolver: zodResolver(systemSchema),
        defaultValues: {
            systemName: 'Admin Panel',
            systemDescription: 'Xodimlar va topshiriqlarni boshqarish tizimi',
            timezone: 'Asia/Tashkent',
        },
    });
    const handleThemeChange = (checked) => {
        setTheme(checked ? 'dark' : 'light');
    };
    const handleProfileSubmit = async (data) => {
        try {
            setIsProfileLoading(true);
            // Bu yerda profilni yangilash API logikasi bo'ladi
            await new Promise(resolve => setTimeout(resolve, 1000)); // API simulyatsiyasi
            profileForm.reset();
        }
        catch (err) {
            console.error('Profile update error:', err);
        }
        finally {
            setIsProfileLoading(false);
        }
    };
    const handleSystemSubmit = async (data) => {
        try {
            setIsSystemLoading(true);
            // Bu yerda tizim sozlamalarini yangilash API logikasi bo'ladi
            await new Promise(resolve => setTimeout(resolve, 1000)); // API simulyatsiyasi
            systemForm.reset();
        }
        catch (err) {
            console.error('System settings update error:', err);
        }
        finally {
            setIsSystemLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Sozlamalar" }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Umumiy sozlamalar" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Qorong'i rejim" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Interfeysni qorong'i rejimda ko'rsatish" })] }), _jsx(Switch, { checked: theme === 'dark', onCheckedChange: handleThemeChange })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Bildirishnomalar" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Yangi xabarlar haqida bildirishnomalar olish" })] }), _jsx(Switch, { checked: notifications, onCheckedChange: setNotifications })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "Email bildirishnomalari" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Yangi xabarlar haqida email orqali xabar olish" })] }), _jsx(Switch, { checked: emailNotifications, onCheckedChange: setEmailNotifications })] })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Profil sozlamalari" }), _jsxs("form", { onSubmit: profileForm.handleSubmit(handleProfileSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Ism" }), _jsx(Input, { ...profileForm.register('name'), placeholder: "Ismingizni kiriting", className: profileForm.formState.errors.name ? 'border-red-500' : '' }), profileForm.formState.errors.name && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Email" }), _jsx(Input, { ...profileForm.register('email'), type: "email", placeholder: "Email manzilingizni kiriting", className: profileForm.formState.errors.email ? 'border-red-500' : '' }), profileForm.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Telefon" }), _jsx(Input, { ...profileForm.register('phone'), type: "tel", placeholder: "Telefon raqamingizni kiriting", className: profileForm.formState.errors.phone ? 'border-red-500' : '' }), profileForm.formState.errors.phone && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.phone.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Joriy parol" }), _jsx(Input, { ...profileForm.register('currentPassword'), type: "password", placeholder: "Joriy parolni kiriting", className: profileForm.formState.errors.currentPassword ? 'border-red-500' : '' }), profileForm.formState.errors.currentPassword && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.currentPassword.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Yangi parol" }), _jsx(Input, { ...profileForm.register('newPassword'), type: "password", placeholder: "Yangi parolni kiriting", className: profileForm.formState.errors.newPassword ? 'border-red-500' : '' }), profileForm.formState.errors.newPassword && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.newPassword.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Parolni tasdiqlash" }), _jsx(Input, { ...profileForm.register('confirmPassword'), type: "password", placeholder: "Parolni qayta kiriting", className: profileForm.formState.errors.confirmPassword ? 'border-red-500' : '' }), profileForm.formState.errors.confirmPassword && (_jsx("p", { className: "text-sm text-red-500", children: profileForm.formState.errors.confirmPassword.message }))] }), _jsx(Button, { type: "submit", disabled: isProfileLoading, children: isProfileLoading ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash" })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Tizim sozlamalari" }), _jsxs("form", { onSubmit: systemForm.handleSubmit(handleSystemSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Tizim nomi" }), _jsx(Input, { ...systemForm.register('systemName'), className: systemForm.formState.errors.systemName ? 'border-red-500' : '' }), systemForm.formState.errors.systemName && (_jsx("p", { className: "text-sm text-red-500", children: systemForm.formState.errors.systemName.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Tizim tavsifi" }), _jsx(Input, { ...systemForm.register('systemDescription'), className: systemForm.formState.errors.systemDescription ? 'border-red-500' : '' }), systemForm.formState.errors.systemDescription && (_jsx("p", { className: "text-sm text-red-500", children: systemForm.formState.errors.systemDescription.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Vaqt mintaqasi" }), _jsx(Input, { ...systemForm.register('timezone'), className: systemForm.formState.errors.timezone ? 'border-red-500' : '' }), systemForm.formState.errors.timezone && (_jsx("p", { className: "text-sm text-red-500", children: systemForm.formState.errors.timezone.message }))] }), _jsx(Button, { type: "submit", disabled: isSystemLoading, children: isSystemLoading ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash" })] })] })] }));
};
export default Settings;

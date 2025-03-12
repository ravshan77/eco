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

type ProfileFormData = z.infer<typeof profileSchema>;
type SystemFormData = z.infer<typeof systemSchema>;

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSystemLoading, setIsSystemLoading] = useState(false);

  const profileForm = useForm<ProfileFormData>({
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

  const systemForm = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      systemName: 'Admin Panel',
      systemDescription: 'Xodimlar va topshiriqlarni boshqarish tizimi',
      timezone: 'Asia/Tashkent',
    },
  });

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsProfileLoading(true);
      // Bu yerda profilni yangilash API logikasi bo'ladi
      await new Promise(resolve => setTimeout(resolve, 1000)); // API simulyatsiyasi
      profileForm.reset();
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSystemSubmit = async (data: SystemFormData) => {
    try {
      setIsSystemLoading(true);
      // Bu yerda tizim sozlamalarini yangilash API logikasi bo'ladi
      await new Promise(resolve => setTimeout(resolve, 1000)); // API simulyatsiyasi
      systemForm.reset();
    } catch (err) {
      console.error('System settings update error:', err);
    } finally {
      setIsSystemLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sozlamalar</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Umumiy sozlamalar</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Qorong'i rejim</Label>
              <p className="text-sm text-muted-foreground">
                Interfeysni qorong'i rejimda ko'rsatish
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bildirishnomalar</Label>
              <p className="text-sm text-muted-foreground">
                Yangi xabarlar haqida bildirishnomalar olish
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email bildirishnomalari</Label>
              <p className="text-sm text-muted-foreground">
                Yangi xabarlar haqida email orqali xabar olish
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profil sozlamalari</h2>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Ism</Label>
            <Input
              {...profileForm.register('name')}
              placeholder="Ismingizni kiriting"
              className={profileForm.formState.errors.name ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.name && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              {...profileForm.register('email')}
              type="email"
              placeholder="Email manzilingizni kiriting"
              className={profileForm.formState.errors.email ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input
              {...profileForm.register('phone')}
              type="tel"
              placeholder="Telefon raqamingizni kiriting"
              className={profileForm.formState.errors.phone ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Joriy parol</Label>
            <Input
              {...profileForm.register('currentPassword')}
              type="password"
              placeholder="Joriy parolni kiriting"
              className={profileForm.formState.errors.currentPassword ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.currentPassword && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Yangi parol</Label>
            <Input
              {...profileForm.register('newPassword')}
              type="password"
              placeholder="Yangi parolni kiriting"
              className={profileForm.formState.errors.newPassword ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.newPassword && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Parolni tasdiqlash</Label>
            <Input
              {...profileForm.register('confirmPassword')}
              type="password"
              placeholder="Parolni qayta kiriting"
              className={profileForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
            />
            {profileForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {profileForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isProfileLoading}>
            {isProfileLoading ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tizim sozlamalari</h2>
        <form onSubmit={systemForm.handleSubmit(handleSystemSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tizim nomi</Label>
            <Input
              {...systemForm.register('systemName')}
              className={systemForm.formState.errors.systemName ? 'border-red-500' : ''}
            />
            {systemForm.formState.errors.systemName && (
              <p className="text-sm text-red-500">
                {systemForm.formState.errors.systemName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tizim tavsifi</Label>
            <Input
              {...systemForm.register('systemDescription')}
              className={systemForm.formState.errors.systemDescription ? 'border-red-500' : ''}
            />
            {systemForm.formState.errors.systemDescription && (
              <p className="text-sm text-red-500">
                {systemForm.formState.errors.systemDescription.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Vaqt mintaqasi</Label>
            <Input
              {...systemForm.register('timezone')}
              className={systemForm.formState.errors.timezone ? 'border-red-500' : ''}
            />
            {systemForm.formState.errors.timezone && (
              <p className="text-sm text-red-500">
                {systemForm.formState.errors.timezone.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSystemLoading}>
            {isSystemLoading ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings; 
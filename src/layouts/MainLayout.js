import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/Header';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
export default function MainLayout() {
    const { isOpen } = useSidebar();
    return (_jsxs("div", { className: "relative min-h-screen bg-background", children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden", "aria-hidden": "true" })), _jsx("div", { className: cn("fixed inset-y-0 left-0 z-50", "transition-transform duration-300", "w-64", !isOpen && "-translate-x-full lg:translate-x-0 lg:w-[70px]"), children: _jsx(AppSidebar, {}) }), _jsxs("div", { className: cn("min-h-screen transition-all duration-300", 
                // Desktop
                isOpen ? "lg:pl-64" : "lg:pl-[70px]", 
                // Mobile & Tablet
                "pl-0"), children: [_jsx(Header, {}), _jsx("main", { className: "container mx-auto p-4 transition-all duration-300", children: _jsx(Outlet, {}) })] })] }));
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronDown, Home, Inbox, Search, Settings, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
const items = [
    {
        title: "Bosh sahifa",
        url: "/",
        icon: Home,
    },
    {
        title: "Topshiriqlar",
        icon: Inbox,
        submenuKey: "tasks",
        submenu: [
            {
                title: "Xodimlarga topshiriq berish",
                url: "/tasks",
            },
            {
                title: "Yangi topshiriqlar",
                url: "/tasks  ",
            },
            {
                title: "Bajarilayotgan",
                url: "/tasks/in-progress",
            },
            {
                title: "Bajarilgan",
                url: "/tasks/completed",
            },
        ],
    },
    {
        title: "Xodimlar",
        icon: Users,
        submenuKey: "employees",
        submenu: [
            {
                title: "Barcha xodimlar",
                url: "/employees",
            },
            {
                title: "Yangi xodim",
                url: "/employees/new",
            },
            {
                title: "Faol xodimlar",
                url: "/employees/active",
            },
            {
                title: "Arxivdagi xodimlar",
                url: "/employees/archived",
            },
        ],
    },
    {
        title: "Qidiruv",
        url: "/search",
        icon: Search,
    },
    {
        title: "Sozlamalar",
        url: "/settings",
        icon: Settings,
    },
];
export function AppSidebar() {
    const { isOpen, toggle } = useSidebar();
    const [openSubmenus, setOpenSubmenus] = useState(new Set(['tasks', 'employees']));
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const sidebarRef = useRef(null);
    // Check if current path matches any submenu item
    const isSubmenuItemActive = useCallback((item) => {
        if (!item.submenu)
            return false;
        return item.submenu.some(subItem => location.pathname === subItem.url);
    }, [location.pathname]);
    // Initial setup for mobile devices
    useEffect(() => {
        if (isMobile && isOpen) {
            toggle();
        }
    }, []);
    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 1024;
            setIsMobile(newIsMobile);
            if (newIsMobile && isOpen) {
                toggle();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, toggle]);
    // Handle route change on mobile
    useEffect(() => {
        if (isMobile && isOpen) {
            toggle();
        }
    }, [location.pathname, isMobile, toggle]);
    // Handle click outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggle();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, isOpen, toggle]);
    const handleItemClick = (item) => {
        if ('submenu' in item && item.submenuKey) {
            setOpenSubmenus(prev => {
                const newSet = new Set(prev);
                if (newSet.has(item.submenuKey)) {
                    newSet.delete(item.submenuKey);
                }
                else {
                    newSet.add(item.submenuKey);
                }
                return newSet;
            });
        }
        else if ('url' in item && item.url) {
            navigate(item.url);
            if (isMobile && isOpen) {
                toggle();
            }
        }
    };
    return (_jsxs(_Fragment, { children: [isMobile && isOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300", "aria-hidden": "true", onClick: () => toggle() })), _jsxs("aside", { ref: sidebarRef, className: cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card", "transition-transform duration-300 ease-in-out", isOpen ? "w-64 shadow-lg" : "w-0 lg:w-[70px]", isMobile && !isOpen && "-translate-x-full", isMobile && isOpen && "translate-x-0"), children: [_jsx("div", { className: "flex h-14 items-center border-b", children: _jsx("h2", { className: cn("font-semibold truncate transition-all duration-300 px-4", isOpen ? "text-lg" : "text-sm text-center w-full"), children: isOpen ? "Admin Panel" : "A-P" }) }), _jsx("div", { className: "flex-1 overflow-y-auto py-4", children: _jsx("nav", { className: "grid gap-1 px-2", children: items.map((item) => (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", className: cn("w-full", isOpen ? "justify-between px-4" : "justify-center p-2", "hover:bg-accent hover:text-accent-foreground", (location.pathname === item.url || isSubmenuItemActive(item)) && "bg-accent text-accent-foreground"), onClick: () => handleItemClick(item), children: [_jsxs("span", { className: "flex items-center gap-3", children: [item.icon && _jsx(item.icon, { className: "h-5 w-5 shrink-0" }), isOpen && _jsx("span", { className: "truncate", children: item.title })] }), isOpen && item.submenu && (_jsx(ChevronDown, { className: cn("h-4 w-4 shrink-0 transition-transform duration-200", openSubmenus.has(item.submenuKey) && "rotate-180") }))] }), isOpen && item.submenu && item.submenuKey && openSubmenus.has(item.submenuKey) && (_jsx("div", { className: "mt-1 ml-4 grid gap-1", children: item.submenu.map((subitem) => (_jsx(Button, { variant: "ghost", className: cn("w-full justify-start", "hover:bg-accent hover:text-accent-foreground", location.pathname === subitem.url && "bg-accent text-accent-foreground"), onClick: () => handleItemClick(subitem), children: subitem.title }, subitem.title))) }))] }, item.title))) }) })] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, MessageSquare, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export default function Header() {
    const { theme, setTheme } = useTheme();
    const { isOpen, toggle } = useSidebar();
    return (_jsx("header", { className: cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "transition-all duration-300"), children: _jsx("div", { className: cn("flex h-14 items-center transition-all duration-300", isOpen ? "lg:pl-0" : "lg:pl-[0px]"), children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9", onClick: toggle, "aria-label": "Toggle sidebar", children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "ghost", size: "icon", className: "relative", "aria-label": "Notifications", children: [_jsx(Bell, { className: "h-5 w-5" }), _jsx("span", { className: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white", children: "3" })] }), _jsxs(Button, { variant: "ghost", size: "icon", className: "relative", "aria-label": "Messages", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), _jsx("span", { className: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white", children: "5" })] }), _jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Toggle theme", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), children: theme === "dark" ? (_jsx(Moon, { className: "h-5 w-5" })) : (_jsx(Sun, { className: "h-5 w-5" })) })] })] }) }) }) }));
}

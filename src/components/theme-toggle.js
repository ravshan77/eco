import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (_jsxs(Button, { variant: "ghost", size: "icon", onClick: () => setTheme(theme === "light" ? "dark" : "light"), children: [_jsx(Sun, { className: "h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), _jsx(Moon, { className: "absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }), _jsx("span", { className: "sr-only", children: "Mavzuni o'zgartirish" })] }));
}

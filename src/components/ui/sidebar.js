import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;
const SIDEBAR_COOKIE = "sidebar-state";
const sidebarVariants = cva("fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300 overflow-hidden", {
    variants: {
        variant: {
            default: "border-r border-border",
            ghost: "border-transparent",
        },
        state: {
            expanded: "w-[280px]",
            collapsed: "w-[80px]",
        },
    },
    defaultVariants: {
        variant: "default",
        state: "expanded",
    },
});
const sidebarVariantsMobile = cva("fixed top-0 left-0 z-40 h-screen transition-transform bg-background border-r", {
    variants: {
        side: {
            left: "left-0",
            right: "right-0",
        },
        variant: {
            default: "bg-background",
            transparent: "bg-transparent",
        },
        collapsible: {
            icon: "w-[64px] data-[open=true]:w-[256px]",
            full: "w-[256px]",
        },
    },
    defaultVariants: {
        side: "left",
        variant: "default",
        collapsible: "full",
    },
});
const SidebarContext = React.createContext(undefined);
export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = React.useState(true);
    const [isSubMenuOpen, setIsSubMenuOpen] = React.useState({});
    const toggle = React.useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);
    const toggleSubMenu = React.useCallback((key) => {
        setIsSubMenuOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }, []);
    return (_jsx(SidebarContext.Provider, { value: { isOpen, toggle, isSubMenuOpen, toggleSubMenu }, children: children }));
}
export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
export function Sidebar({ className, variant, state, ...props }) {
    const { isOpen } = useSidebar();
    return (_jsx("div", { className: cn(sidebarVariants({ variant, state: isOpen ? "expanded" : "collapsed" }), className), ...props }));
}
export function SidebarHeader({ className, ...props }) {
    const { isOpen } = useSidebar();
    return (_jsx("div", { className: cn("flex h-16 items-center gap-3 border-b px-4", isOpen ? "justify-between" : "justify-center", className), ...props }));
}
export function SidebarFooter({ className, ...props }) {
    return (_jsx("div", { className: cn("flex h-14 items-center border-t px-4", className), ...props }));
}
export function SidebarContent({ className, ...props }) {
    return (_jsx("div", { className: cn("flex-1 overflow-y-auto py-6", className), ...props }));
}
export function SidebarGroup({ className, ...props }) {
    return (_jsx("div", { className: cn("space-y-2 px-3", className), ...props }));
}
export function SidebarGroupLabel({ className, ...props }) {
    const { isOpen } = useSidebar();
    return (_jsx("div", { className: cn("text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2", className), ...props }));
}
export function SidebarMenuItem({ className, icon: Icon, children, isSubmenu, submenuKey, ...props }) {
    const { isOpen, isSubMenuOpen, toggleSubMenu } = useSidebar();
    const isCurrentSubmenuOpen = submenuKey ? isSubMenuOpen[submenuKey] : false;
    return (_jsxs("div", { className: cn("group relative flex items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer", isSubmenu && "pl-10", className), onClick: () => submenuKey && toggleSubMenu(submenuKey), ...props, children: [Icon && (_jsx(Icon, { className: cn("h-5 w-5", isOpen ? "mr-3" : "mx-auto") })), (isOpen || isSubmenu) && children] }));
}
export function SidebarSubmenu({ className, children, submenuKey, ...props }) {
    const { isSubMenuOpen } = useSidebar();
    const isOpen = isSubMenuOpen[submenuKey];
    return (_jsx("div", { className: cn("overflow-hidden transition-all duration-200", isOpen ? "max-h-screen" : "max-h-0", className), ...props, children: children }));
}
export function SidebarMenu({ className, ...props }) {
    return (_jsx("div", { className: cn("flex flex-col space-y-1", className), ...props }));
}
export function SidebarMenuButton({ className, ...props }) {
    return (_jsx("button", { className: cn("flex w-full items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className), ...props }));
}
export function SidebarTrigger({ className, ...props }) {
    const { toggle, isOpen } = useSidebar();
    return (_jsx("button", { className: cn("flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 hover:bg-accent/20", className), onClick: toggle, ...props, children: _jsx("svg", { className: cn("h-4 w-4 transition-transform", isOpen && "rotate-180"), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) }));
}
export function SidebarMobile({ className, side, variant, collapsible, ...props }) {
    const { isOpen } = useSidebar();
    return (_jsx("aside", { "data-open": isOpen, className: cn(sidebarVariantsMobile({ side, variant, collapsible }), className), ...props }));
}

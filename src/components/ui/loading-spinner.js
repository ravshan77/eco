import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function LoadingSpinner({ className, size = "md", ...props }) {
    return (_jsx("div", { className: cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg",
        }, "text-primary", className), ...props, children: _jsx("span", { className: "sr-only", children: "Loading..." }) }));
}

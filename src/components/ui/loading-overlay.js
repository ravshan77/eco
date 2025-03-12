import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoadingSpinner } from "./loading-spinner";
export function LoadingOverlay({ message = "Yuklanmoqda..." }) {
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(LoadingSpinner, { size: "lg" }), _jsx("p", { className: "text-sm text-muted-foreground", children: message })] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
const NotFound = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate(-1);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs(Card, { className: "w-full max-w-md p-8", children: [_jsxs("div", { className: "flex flex-col items-center space-y-4 mb-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: "404" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Sahifa topilmadi" })] }), _jsx(Button, { onClick: handleLogin, className: "w-full", children: "Ortga" })] }) }));
};
export default NotFound;

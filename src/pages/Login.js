import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useTheme } from '../components/theme-provider';
const Login = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const handleLogin = () => {
        // Temporary: Just set a dummy token and navigate
        localStorage.setItem('token', 'dummy-token');
        navigate('/');
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs(Card, { className: "w-full max-w-md p-8", children: [_jsxs("div", { className: "flex flex-col items-center space-y-4 mb-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Admin Panel" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Tizimga kirish uchun tugmani bosing" })] }), _jsx(Button, { onClick: handleLogin, className: "w-full", children: "Kirish" }), _jsx("div", { className: "mt-6 flex items-center justify-center", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'), children: theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim" }) })] }) }));
};
export default Login;

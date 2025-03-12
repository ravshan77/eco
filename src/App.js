import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/page';
import Employees from './pages/employees/Employees';
import NewEmployee from './pages/employees/NewEmployee';
import ActiveEmployees from './pages/employees/ActiveEmployees';
import ArchivedEmployees from './pages/employees/ArchivedEmployees';
import Tasks from './pages/tasks/Tasks';
import NewTasks from './pages/tasks/NewTasks';
import CompletedTasks from './pages/tasks/CompletedTasks';
import InProgressTasks from './pages/tasks/InProgressTasks';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Login from './pages/Login';
import './styles/globals.css';
import NotFound from './pages/NotFound';
import TasksToEmployee from './pages/tasks/TasksToEmployee';
function App() {
    return (_jsx(ThemeProvider, { defaultTheme: "system", storageKey: "vite-ui-theme", children: _jsxs(SidebarProvider, { children: [_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) }), _jsxs(Route, { path: "/", element: localStorage.getItem('token') ? (_jsx(MainLayout, {})) : (_jsx(Navigate, { to: "/login", replace: true })), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "employees", element: _jsx(Employees, {}) }), _jsx(Route, { path: "employees/new", element: _jsx(NewEmployee, {}) }), _jsx(Route, { path: "employees/active", element: _jsx(ActiveEmployees, {}) }), _jsx(Route, { path: "employees/archived", element: _jsx(ArchivedEmployees, {}) }), _jsx(Route, { path: "tasks", element: _jsx(Tasks, {}) }), _jsx(Route, { path: "tasks/new", element: _jsx(NewTasks, {}) }), _jsx(Route, { path: "tasks/completed", element: _jsx(CompletedTasks, {}) }), _jsx(Route, { path: "tasks/in-progress", element: _jsx(InProgressTasks, {}) }), _jsx(Route, { path: "search", element: _jsx(Search, {}) }), _jsx(Route, { path: "settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/tasks-to-employee/:name/:id", element: _jsx(TasksToEmployee, {}) })] })] }) }), _jsx(Toaster, {})] }) }));
}
export default App;

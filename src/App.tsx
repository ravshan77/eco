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
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={ localStorage.getItem('token') ? ( <MainLayout /> ) : ( <Navigate to="/login" replace /> )}>
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/new" element={<NewEmployee />} />
              <Route path="employees/active" element={<ActiveEmployees />} />
              <Route path="employees/archived" element={<ArchivedEmployees />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/new" element={<NewTasks />} />
              <Route path="tasks/completed" element={<CompletedTasks />} />
              <Route path="tasks/in-progress" element={<InProgressTasks />} />
              <Route path="search" element={<Search />} />
              <Route path="settings" element={<Settings />} />
              <Route path="/tasks-to-employee/:name/:id" element={<TasksToEmployee />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

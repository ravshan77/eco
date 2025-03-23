import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/page';
import Workers from './pages/workers/Workers';
import Tasks from './pages/tasks/Tasks';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Login from './pages/Login';
import './styles/globals.css';
import NotFound from './pages/NotFound';
import TasksToEmployee from './pages/tasks/TasksToEmployee';
import AddWorkerPage from './pages/workers/AddWorkerPage';
import EditWorkerPage from './pages/workers/EditWorkerPage';
import Sections from './pages/sections/Sections';
import Positions from './pages/positions/Positions';
import WorkersOrders from './pages/workersOrders/WorkersOrders';
import AssigmentCategory from './pages/assigmentCategory/AssigmentCategory';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={ true ? ( <MainLayout /> ) : ( <Navigate to="/login" replace /> )}>
              <Route index element={<Dashboard />} />
              <Route path="workers" element={<Workers />} />
              <Route path="informations/sections" element={<Sections />} />
              <Route path="informations/positions" element={<Positions />} />
              <Route path="informations/assigment-category" element={<AssigmentCategory />} />
              <Route path="workers/add-new-worker" element={<AddWorkerPage />} />
              <Route path="workers/edit-worker/:id" element={<EditWorkerPage />} />
              <Route path="workers-orders" element={<WorkersOrders />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="search" element={<Search />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tasks-to-employee/:name/:id" element={<TasksToEmployee />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

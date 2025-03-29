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
import NotFound from './pages/NotFound';
import WorkerTasks from './pages/tasks/WorkerTasks';
import AddWorkerPage from './pages/workers/AddWorkerPage';
import EditWorkerPage from './pages/workers/EditWorkerPage';
import Sections from './pages/sections/Sections';
import Positions from './pages/positions/Positions';
import WorkersOrders from './pages/workersOrders/WorkersOrders';
import TaskCategory from './pages/taskCategory/TaskCategory';
import CompleteTask from './pages/tasks/CompleteTask';
import AddTask from './pages/tasks/AddTask';
import EditTask from './pages/tasks/EditTask';
import ConfirmTask from './pages/tasks/ConfirmTask';

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
              <Route path="informations/assigment-category" element={<TaskCategory />} />
              <Route path="workers/add-new-worker" element={<AddWorkerPage />} />
              <Route path="workers/edit-worker/:worker_id" element={<EditWorkerPage />} />
              <Route path="workers-orders" element={<WorkersOrders />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/add-task/:worker_id/:assigment_category_id" element={<AddTask />} />
              <Route path="tasks/edit-task/:assigment_id" element={<EditTask />} />
              <Route path="search" element={<Search />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tasks-to-employee/:worker_id" element={<WorkerTasks />} />
              <Route path="complete-task/:assigment_id" element={<CompleteTask />} />
              <Route path="confirm-task/:assigment_id" element={<ConfirmTask />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

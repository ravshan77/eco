import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/page';
import Workers from './pages/workers/Workers';
// import NewEmployee from './pages/workers/NewEmployee';
// import ActiveEmployees from './pages/workers/ActiveEmployees';
// import ArchivedEmployees from './pages/workers/ArchivedEmployees';
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
import AddWorkerPage from './pages/workers/AddWorkerPage';
import EditWorkerPage from './pages/workers/EditWorkerPage';
import Sections from './pages/sections/Sections';
import Positions from './pages/positions/Positions';

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
              {/* <Route path="workers/new" element={<NewEmployee />} /> */}
              <Route path="workers/add-new-worker" element={<AddWorkerPage />} />
              <Route path="workers/edit-worker/:id" element={<EditWorkerPage />} />
              {/* <Route path="workers/active" element={<ActiveEmployees />} /> */}
              {/* <Route path="workers/archived" element={<ArchivedEmployees />} /> */}
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/new" element={<NewTasks />} />
              <Route path="tasks/completed" element={<CompletedTasks />} />
              <Route path="tasks/in-progress" element={<InProgressTasks />} />
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

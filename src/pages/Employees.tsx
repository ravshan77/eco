import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { TWorkers } from '../types/types';
import { employeesAPI } from '../services/api';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Employees = () => {
  const [employees, setEmployees] = useState<TWorkers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeesAPI.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Xodimlarni yuklashda xatolik yuz berdi');
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (data: Omit<TWorkers, 'id' | 'createdAt'>) => {
    try {
      await employeesAPI.create(data);
      fetchEmployees();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error creating employee:', err);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: TWorkers['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Xodimlar</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi xodim
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Xodim qidirish..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left">Ism</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Telefon</th>
                <th className="p-2 text-left">Lavozim</th>
                <th className="p-2 text-left">Bo'lim</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Yaratilgan</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        employee.status
                      )}`}
                    >
                      {employee.status === 'active' ? 'Faol' : 'Faol emas'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(employee.date)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Jami {filteredEmployees.length} xodim
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Oldingi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Keyingi
            </Button>
          </div>
        </div>
      </Card>

      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddEmployee}
      />
    </div>
  );
};

export default Employees; 
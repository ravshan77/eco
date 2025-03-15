import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Clock } from 'lucide-react';
import { User } from '../types/types';
import { usersAPI } from '../services/api';
import AddUserModal from '../components/users/AddUserModal';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      await usersAPI.create(data);
      fetchUsers();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      await usersAPI.updateStatus(userId, newStatus);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'manager':
        return 'bg-blue-100 text-blue-700';
      case 'employee':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Menejer';
      case 'employee':
        return 'Xodim';
      default:
        return role;
    }
  };

  const getStatusColor = (status: User['status']) => {
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
        <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi foydalanuvchi
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Foydalanuvchi qidirish..."
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
                <th className="p-2 text-left">Foydalanuvchi nomi</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Oxirgi kirish</th>
                <th className="p-2 text-left">Yaratilgan</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="p-2">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value as User['status'])
                      }
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      <option value="active">Faol</option>
                      <option value="inactive">Faol emas</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{user.lastLogin}</span>
                    </div>
                  </td>
                  <td className="p-2">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Jami {filteredUsers.length} foydalanuvchi
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

      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users; 
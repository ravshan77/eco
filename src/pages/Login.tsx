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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">
            Tizimga kirish uchun tugmani bosing
          </p>
        </div>

        <Button 
          onClick={handleLogin}
          className="w-full"
        >
          Kirish
        </Button>

        <div className="mt-6 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login; 
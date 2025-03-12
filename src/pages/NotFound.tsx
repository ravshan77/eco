import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold">404</h1>
          <p className="text-sm text-muted-foreground">
            Sahifa topilmadi
          </p>
        </div>

        <Button  onClick={handleLogin} className="w-full" >
          Ortga
        </Button>
      </Card>
    </div>
  );
};

export default NotFound; 
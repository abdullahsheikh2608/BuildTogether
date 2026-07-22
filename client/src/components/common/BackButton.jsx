import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function BackButton() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    if (user?.role === 'founder') {
      navigate('/founder');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Button variant="ghost" onClick={handleBack} className="mb-6">
      ← Back
    </Button>
  );
}

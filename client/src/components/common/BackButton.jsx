import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function BackButton({ fallbackPath, className = '', label = 'Back' }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
      return;
    }

    if (fallbackPath) {
      navigate(fallbackPath);
      return;
    }

    if (user?.role === 'founder') {
      navigate('/founder');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 mb-4 hover:bg-blueprint-800/50 cursor-pointer ${className}`}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </Button>
  );
}

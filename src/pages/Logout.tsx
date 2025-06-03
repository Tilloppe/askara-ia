import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer l'état d'authentification
    localStorage.removeItem('isAuthenticated');
    
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });
  }, [navigate]);

  return null; // Pas de rendu nécessaire
};

export default Logout;

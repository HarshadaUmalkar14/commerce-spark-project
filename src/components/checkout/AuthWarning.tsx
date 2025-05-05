
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuthWarning: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4">Please sign in to complete your purchase.</p>
        <Button 
          onClick={() => navigate('/login')}
          className="w-full bg-shop-blue hover:bg-shop-blue-dark"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default AuthWarning;

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data) => {
    try {
      await register(data);
      navigate('/');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="register-page">
      <RegisterForm onSubmit={handleSubmit} loading={loading} error={error || errorMessage} />
    </div>
  );
}

export default Register;
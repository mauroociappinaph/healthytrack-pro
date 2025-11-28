import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HealthyTrack Pro</h1>
          <p className="text-gray-600">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Tu nombre"
            data-testid="register-name-input"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            data-testid="register-email-input"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
            data-testid="register-password-input"
          />

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" data-testid="register-error">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading} data-testid="register-submit-button">
            Registrarse
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-500 hover:text-primary-600 font-semibold"
              data-testid="login-link"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setMessage({ type: 'error', text: 'La contraseña actual es incorrecta o hubo un error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Contraseña Actual"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={handleChange}
        required
        data-testid="password-current-input"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          data-testid="password-new-input"
        />
        <Input
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          data-testid="password-confirm-input"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}
          data-testid={`password-${message.type === 'success' ? 'success' : 'error'}-message`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="secondary" isLoading={isLoading} data-testid="password-change-button">
          Cambiar Contraseña
        </Button>
      </div>
    </form>
  );
};

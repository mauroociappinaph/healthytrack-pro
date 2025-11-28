import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ProfileForm: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          data-testid="profile-name-input"
        />
        <Input
          label="URL de Avatar (Opcional)"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          data-testid="profile-avatar-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Biografía
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          placeholder="Cuéntanos un poco sobre ti..."
          data-testid="profile-bio-input"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}
          data-testid={`profile-${message.type === 'success' ? 'success' : 'error'}-message`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} data-testid="profile-save-button">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

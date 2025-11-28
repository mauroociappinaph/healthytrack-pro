import React from 'react';
import { useAuthStore } from '../store/authStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ChangePasswordForm } from '../components/profile/ChangePasswordForm';
import { Card } from '../components/ui/Card';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader
          name={user.name}
          email={user.email}
          bio={user.bio}
          avatar={user.avatar}
        />

        <div className="grid grid-cols-1 gap-8">
          <Card title="Información Personal">
            <ProfileForm />
          </Card>

          <Card title="Seguridad">
            <div className="max-w-xl">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Asegúrate de usar una contraseña segura que no utilices en otros sitios.
              </p>
              <ChangePasswordForm />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

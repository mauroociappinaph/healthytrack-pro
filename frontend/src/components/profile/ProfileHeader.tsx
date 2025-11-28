import React from 'react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, bio, avatar }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-6" data-testid="profile-header">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-800">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </motion.div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" data-testid="profile-name">{name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4" data-testid="profile-email">{email}</p>

        {bio ? (
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl" data-testid="profile-bio-display">{bio}</p>
        ) : (
          <p className="text-gray-400 italic" data-testid="profile-bio-display">Sin biografía. ¡Añade una para personalizar tu perfil!</p>
        )}
      </div>
    </div>
  );
};

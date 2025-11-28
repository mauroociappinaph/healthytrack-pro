import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export const ActivityHub: React.FC = () => {
  const navigate = useNavigate();

  const activities = [
    { id: 'walks', icon: '🚶', title: 'Caminata', path: '/walks', color: 'bg-blue-500' },
    { id: 'home', icon: '🏠', title: 'Ejercicio en Casa', path: '/home-exercises', color: 'bg-green-500' },
    { id: 'gym', icon: '💪', title: 'Gimnasio', path: '/gym', color: 'bg-red-500' },
    { id: 'meals', icon: '🍽️', title: 'Comida', path: '/meals', color: 'bg-yellow-500' },
    { id: 'health', icon: '❤️', title: 'Salud', path: '/health', color: 'bg-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Registrar Actividad</h1>
          <p className="text-gray-600">¿Qué quieres registrar hoy?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              onClick={() => navigate(activity.path)}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-center">
                <div className={`w-20 h-20 ${activity.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-4xl">{activity.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

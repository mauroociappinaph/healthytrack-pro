import React from 'react';

export const RemindersPanel: React.FC = () => {
  const reminders = [
    { id: 1, title: 'Tomar agua', time: 'Cada 2 horas', icon: '💧' },
    { id: 2, title: 'Ir al gimnasio', time: 'Hoy, 18:00', icon: '💪' },
    { id: 3, title: 'Meditación', time: 'Mañana, 08:00', icon: '🧘' },
  ];

  const recentActivity = [
    { id: 1, title: 'Caminata 45m', time: 'Hace 2 horas', status: 'Completado' },
    { id: 2, title: 'Registro de Comida', time: 'Hace 5 horas', status: 'Revisión' },
  ];

  return (
    <div className="space-y-8">
      {/* Recordatorios */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recordatorios</h3>
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Próximas actividades</p>

        <div className="space-y-3">
          {reminders.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-xl mr-3">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-primary-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Otros / Actividad Reciente Resumida */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Otros</h3>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <span className="mr-1">🕒</span> {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

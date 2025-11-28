import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-10 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Tu Salud, <span className="text-primary-600">Optimizada</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Registra tus entrenamientos, monitorea tu salud y recibe recomendaciones personalizadas basadas en tus datos. Todo en una sola plataforma.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/register')}>
                Comenzar Gratis
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Métricas Avanzadas</h3>
              <p className="text-gray-600">
                Análisis automático de RHR y HRV para detectar fatiga y estrés antes de que ocurran.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tracking Completo</h3>
              <p className="text-gray-600">
                Registra gimnasio, caminatas, ejercicios en casa y comidas en un solo lugar.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recomendaciones IA</h3>
              <p className="text-gray-600">
                Recibe consejos semanales personalizados basados en tu rendimiento y salud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

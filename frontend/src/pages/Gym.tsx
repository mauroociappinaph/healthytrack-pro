import React, { useEffect, useState } from 'react';
import { useActivityStore } from '../store/activityStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { format } from 'date-fns';
import { gymService } from '../services/activityService';

export const Gym: React.FC = () => {
  const { gymSessions, isLoading, fetchGymSessions, addGymSession, deleteGymSession } = useActivityStore();
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

 const [sessionForm, setSessionForm] = useState({
  name: '',
  date: new Date().toISOString().split('T')[0],
  duration: '',
});

const [exerciseForm, setExerciseForm] = useState({
  name: '',
  sets: '',
  reps: '',
  weight: '',
});

  useEffect(() => {
    fetchGymSessions();
  }, [fetchGymSessions]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGymSession({
      name: sessionForm.name,
      date: new Date(sessionForm.date + 'T12:00:00').toISOString(),
      duration: Number(sessionForm.duration),
    });
    setIsSessionModalOpen(false);
   setSessionForm({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
  });
    setExerciseForm({
      name: '',
      sets: '',
      reps: '',
      weight: '',
    });
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) return;

    await gymService.addExercise(selectedSessionId, {
      name: exerciseForm.name,
      sets: Number(exerciseForm.sets),
      reps: Number(exerciseForm.reps),
      weight: Number(exerciseForm.weight),
    });

    // Refresh sessions to show new exercise
    fetchGymSessions();
    setIsExerciseModalOpen(false);
    setExerciseForm({
      name: '',
      sets: '',
      reps: '',
      weight: '',
    });
  };

  const openExerciseModal = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsExerciseModalOpen(true);
  };

  if (isLoading && gymSessions.length === 0) {
    return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gimnasio</h1>
          <p className="text-gray-600">Sesiones y ejercicios de fuerza</p>
        </div>
        <Button onClick={() => setIsSessionModalOpen(true)}>+ Nueva Sesión</Button>
      </div>

      <div className="space-y-6">
        {gymSessions.map((session) => (
          <Card key={session.id} className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl mr-4">
                  💪
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{session.name}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(session.date), 'dd MMM yyyy')} • {session.duration} min
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteGymSession(session.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                🗑️
              </button>
            </div>

            {/* Exercises List */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Ejercicios</h4>
              {session.exercises && session.exercises.length > 0 ? (
                <div className="space-y-2">
                  {session.exercises.map((ex) => (
                    <div key={ex.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                      <span className="font-medium text-gray-800">{ex.name}</span>
                      <span className="text-sm text-gray-600">
                        {ex.sets} x {ex.reps} @ {ex.weight}kg
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No hay ejercicios registrados</p>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => openExerciseModal(session.id)}
            >
              + Agregar Ejercicio
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal Crear Sesión */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Nueva Sesión de Gimnasio"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Input
            label="Nombre de la Sesión"
            value={sessionForm.name}
            onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
            placeholder="Ej: Pierna y Hombro"
            required
          />
          <Input
            label="Fecha"
            type="date"
            value={sessionForm.date}
            onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
            required
          />
          <Input
            label="Duración Total (min)"
            type="number"
            value={sessionForm.duration}
            onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
            required
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">Crear Sesión</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Agregar Ejercicio */}
      <Modal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        title="Agregar Ejercicio"
      >
        <form onSubmit={handleAddExercise} className="space-y-4">
          <Input
            label="Nombre del Ejercicio"
            value={exerciseForm.name}
            onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
            placeholder="Ej: Sentadilla"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Series"
              type="number"
              value={exerciseForm.sets}
              onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
              required
            />
            <Input
              label="Reps"
              type="number"
              value={exerciseForm.reps}
              onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
              required
            />
            <Input
              label="Peso (kg)"
              type="number"
              value={exerciseForm.weight}
              onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
              required
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full">Agregar a la Sesión</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useActivityStore } from '../store/activityStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { format } from 'date-fns';

export const HomeExercises: React.FC = () => {
  const { homeExercises, isLoading, fetchHomeExercises, addHomeExercise, deleteHomeExercise } = useActivityStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState('cardio');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchHomeExercises();
  }, [fetchHomeExercises]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHomeExercise({
      type,
      duration: Number(duration),
      level: level as 'beginner' | 'intermediate' | 'advanced',
      date: new Date(date + 'T12:00:00').toISOString(),
      notes,
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setType('cardio');
    setDuration('');
    setLevel('intermediate');
    setNotes('');
  };

  if (isLoading && homeExercises.length === 0) {
    return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ejercicios en Casa</h1>
          <p className="text-gray-600">Rutinas sin equipamiento</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Ejercicio</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeExercises.map((ex) => (
          <Card key={ex.id} className="relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => deleteHomeExercise(ex.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl mr-3">
                🏠
              </div>
              <div>
                <p className="font-bold text-gray-800">{format(new Date(ex.date), 'dd MMM yyyy')}</p>
                <p className="text-sm text-gray-500 capitalize">{ex.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-xs text-gray-500">Duración</p>
                <p className="font-semibold">{ex.duration} min</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Nivel</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ex.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  ex.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ex.level}
                </span>
              </div>
            </div>
            {ex.notes && (
              <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                "{ex.notes}"
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Ejercicio en Casa"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Select
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'cardio', label: 'Cardio' },
              { value: 'strength', label: 'Fuerza' },
              { value: 'yoga', label: 'Yoga' },
              { value: 'flexibility', label: 'Flexibilidad' },
              { value: 'hiit', label: 'HIIT' },
            ]}
          />
          <Input
            label="Duración (min)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min="1"
          />
          <Select
            label="Nivel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            options={[
              { value: 'beginner', label: 'Principiante' },
              { value: 'intermediate', label: 'Intermedio' },
              { value: 'advanced', label: 'Avanzado' },
            ]}
          />
          <Input
            label="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Rutina de abdominales de YouTube"
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

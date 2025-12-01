import React, { useEffect, useState } from 'react';
import { useActivityStore } from '../store/activityStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { format } from 'date-fns';

export const Walks: React.FC = () => {
  const { walks, isLoading, fetchWalks, addWalk, deleteWalk } = useActivityStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWalks();
  }, [fetchWalks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWalk({
      duration: Number(duration),
      distance: distance ? Number(distance) : undefined,
      intensity: intensity as 'low' | 'medium' | 'high',
      date: new Date(date + 'T12:00:00').toISOString(),
      notes,
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDuration('');
    setDistance('');
    setIntensity('medium');
    setNotes('');
  };

  if (isLoading && walks.length === 0) {
    return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Caminatas</h1>
          <p className="text-gray-600">Registra tus pasos diarios</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Nueva Caminata</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {walks.map((walk) => (
          <Card key={walk.id} className="relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => deleteWalk(walk.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-2xl mr-3">
                🚶
              </div>
              <div>
                <p className="font-bold text-gray-800">{format(new Date(walk.date), 'dd MMM yyyy')}</p>
                <p className="text-sm text-gray-500 capitalize">{walk.intensity} Intensity</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-xs text-gray-500">Duración</p>
                <p className="font-semibold">{walk.duration} min</p>
              </div>
              {walk.distance && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Distancia</p>
                  <p className="font-semibold">{walk.distance} km</p>
                </div>
              )}
            </div>
            {walk.notes && (
              <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                "{walk.notes}"
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Caminata"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duración (min)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
            />
            <Input
              label="Distancia (km)"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>
          <Select
            label="Intensidad"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            options={[
              { value: 'low', label: 'Baja' },
              { value: 'medium', label: 'Media' },
              { value: 'high', label: 'Alta' },
            ]}
          />
          <Input
            label="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Caminata matutina en el parque"
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

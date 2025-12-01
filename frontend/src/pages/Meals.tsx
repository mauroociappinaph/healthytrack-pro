import React, { useEffect, useState } from 'react';
import { useActivityStore } from '../store/activityStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { format } from 'date-fns';

export const Meals: React.FC = () => {
  const { meals, isLoading, fetchMeals, addMeal, deleteMeal } = useActivityStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [type, setType] = useState('lunch');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMeal({
      description,
      calories: Number(calories),
      type: type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      date: new Date(date + 'T12:00:00').toISOString(),
      photoUrl: photoUrl || undefined,
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDescription('');
    setCalories('');
    setType('lunch');
    setPhotoUrl('');
  };

  if (isLoading && meals.length === 0) {
    return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Comidas</h1>
          <p className="text-gray-600">Registro fotográfico y calórico</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Nueva Comida</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden p-0">
            <div className="relative h-48 bg-gray-200">
              {meal.photoUrl ? (
                <img
                  src={meal.photoUrl}
                  alt={meal.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">
                  🍽️
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase text-white shadow ${
                  meal.type === 'breakfast' ? 'bg-yellow-500' :
                  meal.type === 'lunch' ? 'bg-green-500' :
                  meal.type === 'dinner' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {meal.type}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500">{format(new Date(meal.date), 'dd MMM HH:mm')}</p>
                  <h3 className="font-bold text-gray-800 truncate">{meal.description}</h3>
                </div>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
              <p className="text-primary-600 font-semibold">{meal.calories} kcal</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Comida"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Fecha"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Ensalada César con Pollo"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'breakfast', label: 'Desayuno' },
                { value: 'lunch', label: 'Almuerzo' },
                { value: 'dinner', label: 'Cena' },
                { value: 'snack', label: 'Snack' },
              ]}
            />
            <Input
              label="Calorías"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <Input
            label="URL de Foto (opcional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

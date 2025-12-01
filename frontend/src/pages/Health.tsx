import React, { useEffect, useState } from 'react';
import { useMetricsStore } from '../store/metricsStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Gauge } from '../components/ui/Gauge';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';

export const Health: React.FC = () => {
  const {
    sleep, stress, heartMetrics, energy, isLoading,
    fetchSleep, fetchStress, fetchHeartMetrics, fetchEnergy,
    addSleep, addStress, addHeartMetric, addEnergy
  } = useMetricsStore();

  const [activeTab, setActiveTab] = useState<'sleep' | 'stress' | 'heart' | 'energy'>('sleep');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Form States
  const [formData, setFormData] = useState({
  sleepHours: '',
  sleepQuality: '',
  stressLevel: '',
  energyLevel: '',
  rhr: '',
  hrv: '',
});

  useEffect(() => {
    fetchSleep();
    fetchStress();
    fetchHeartMetrics();
    fetchEnergy();
  }, [fetchEnergy, fetchHeartMetrics, fetchSleep, fetchStress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isoDate = new Date(date + 'T12:00:00').toISOString();

    if (activeTab === 'sleep') {
      await addSleep({ hours: Number(formData.sleepHours), quality: Number(formData.sleepQuality), date: isoDate });
    } else if (activeTab === 'stress') {
      await addStress({ level: Number(formData.stressLevel), date: isoDate });
    } else if (activeTab === 'energy') {
      await addEnergy({ level: Number(formData.energyLevel), date: isoDate });
    } else if (activeTab === 'heart') {
      await addHeartMetric({ rhr: Number(formData.rhr), hrv: Number(formData.hrv), date: isoDate });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      sleepHours: '',
      sleepQuality: '',
      stressLevel: '',
      energyLevel: '',
      rhr: '',
      hrv: '',
    });
  };

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Métricas de Salud</h1>
          <p className="text-gray-600">Monitoreo integral de bienestar</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Registrar {activeTab}</Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {[
          { id: 'sleep', label: '😴 Sueño' },
          { id: 'stress', label: '🤯 Estrés' },
          { id: 'heart', label: '❤️ Corazón' },
          { id: 'energy', label: '⚡ Energía' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'sleep' | 'stress' | 'heart' | 'energy')}
            className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'sleep' && sleep.map((s) => (
          <Card key={s.id}>
            <div className="text-center">
              <p className="text-gray-500 mb-2">{new Date(s.date).toLocaleDateString()}</p>
              <p className="text-4xl font-bold text-indigo-600 mb-2">{s.hours}h</p>
              <div className="flex justify-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  s.quality >= 7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Calidad: {s.quality}/10
                </span>
              </div>
            </div>
          </Card>
        ))}

        {activeTab === 'stress' && stress.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 mb-4">{new Date(s.date).toLocaleDateString()}</p>
              <Gauge value={s.level} label="Nivel de Estrés" />
            </div>
          </Card>
        ))}

        {activeTab === 'energy' && energy.map((e) => (
          <Card key={e.id}>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 mb-4">{new Date(e.date).toLocaleDateString()}</p>
              <Gauge value={e.level} label="Nivel de Energía" color="text-yellow-500" />
            </div>
          </Card>
        ))}

        {activeTab === 'heart' && heartMetrics.map((h) => (
          <Card key={h.id}>
            <div className="text-center">
              <p className="text-gray-500 mb-4">{new Date(h.date).toLocaleDateString()}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">RHR</p>
                  <p className="text-2xl font-bold text-red-500">{h.rhr} <span className="text-xs">bpm</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">HRV</p>
                  <p className="text-2xl font-bold text-blue-500">{h.hrv} <span className="text-xs">ms</span></p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Registrar ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {activeTab === 'sleep' && (
            <>
              <Input
                label="Horas de Sueño"
                type="number"
                step="0.1"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                required
              />
              <Input
                label="Calidad (1-10)"
                type="number"
                min="1"
                max="10"
                value={formData.sleepQuality}
                onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                required
              />
            </>
          )}

          {(activeTab === 'stress' || activeTab === 'energy') && (
            <Input
              label="Nivel (1-10)"
              type="number"
              min="1"
              max="10"
              value={activeTab === 'stress' ? formData.stressLevel : formData.energyLevel}
              onChange={(e) => activeTab === 'stress' ? setFormData({ ...formData, stressLevel: e.target.value }) : setFormData({ ...formData, energyLevel: e.target.value })}
              required
            />
          )}

          {activeTab === 'heart' && (
            <>
              <Input
                label="RHR (Resting Heart Rate)"
                type="number"
                value={formData.rhr}
                onChange={(e) => setFormData({ ...formData, rhr: e.target.value })}
                required
              />
              <Input
                label="HRV (Heart Rate Variability)"
                type="number"
                value={formData.hrv}
                onChange={(e) => setFormData({ ...formData, hrv: e.target.value })}
                required
              />
            </>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

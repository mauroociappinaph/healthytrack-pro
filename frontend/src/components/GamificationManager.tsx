import React, { useState, useEffect } from 'react';
import { useGamificationStore } from '../stores/gamificationStore';
import { LevelUpModal } from './gamification/LevelUpModal';

/**
 * GamificationManager - Componente global que maneja eventos de gamification
 * Se encarga de mostrar el LevelUpModal cuando el usuario sube de nivel
 */
export const GamificationManager: React.FC = () => {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const progress = useGamificationStore((state) => state.progress);

  useEffect(() => {
    // Guardar el nivel anterior para detectar cambios
    let previousLevel = progress?.level || 1;

    const unsubscribe = useGamificationStore.subscribe((state) => {
      const currentLevel = state.progress?.level || 1;

      // Si el nivel aumentó, mostrar el modal
      if (currentLevel > previousLevel) {
        setNewLevel(currentLevel);
        setShowLevelUpModal(true);
        previousLevel = currentLevel;
      }
    });

    return () => unsubscribe();
  }, [progress?.level]);

  return (
    <LevelUpModal
      isOpen={showLevelUpModal}
      newLevel={newLevel}
      onClose={() => setShowLevelUpModal(false)}
    />
  );
};

import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, type ToastProps } from './Toast';

export interface ToastData {
  type: ToastProps['type'];
  title: string;
  message: string;
  icon?: string;
  duration?: number;
}

let toastId = 0;

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Expose addToast globally
  React.useEffect(() => {
    window.addToast = (data: ToastData) => {
      const id = `toast-${toastId++}`;
      setToasts(prev => [...prev, { ...data, id, onClose: removeToast }]);
    };

    return () => {
      delete window.addToast;
    };
  }, [removeToast]);

  return (
    <div className="fixed top-20 right-4 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

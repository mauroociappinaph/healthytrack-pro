import type { ToastData } from './ToastContainer';

declare global {
  interface Window {
    addToast?: (data: ToastData) => void;
  }
}

// Helper function to show toasts
export const showToast = (data: ToastData) => {
  if (window.addToast) {
    window.addToast(data);
  }
};

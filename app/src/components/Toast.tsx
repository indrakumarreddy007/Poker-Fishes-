import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const variantIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
};

const variantStyles = {
  default: 'bg-gradient-to-r from-purple-600 to-purple-800',
  destructive: 'bg-gradient-to-r from-red-600 to-red-800',
  success: 'bg-gradient-to-r from-green-600 to-green-800',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = variantIcons[toast.variant || 'default'];
        return (
          <div
            key={toast.id}
            className={`${variantStyles[toast.variant || 'default']} rounded-xl p-4 min-w-[300px] shadow-2xl backdrop-blur-lg animate-slide-in-right`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-sm text-white/80 mt-1">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

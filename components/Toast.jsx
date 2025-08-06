'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success', // 'success', 'error', 'warning', 'info'
  duration = 4000,
  onClose,
  isDark = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide after duration
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = `max-w-sm w-full shadow-lg rounded-xl border transition-all duration-300 transform ${
      isVisible && !isLeaving ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
    }`;
    
    if (isDark) {
      return `${baseStyles} bg-gray-800/95 border-gray-700 text-white backdrop-blur-sm`;
    }
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-white border-green-200 text-gray-900`;
      case 'error':
        return `${baseStyles} bg-white border-red-200 text-gray-900`;
      case 'warning':
        return `${baseStyles} bg-white border-yellow-200 text-gray-900`;
      case 'info':
        return `${baseStyles} bg-white border-blue-200 text-gray-900`;
      default:
        return `${baseStyles} bg-white border-gray-200 text-gray-900`;
    }
  };

  const toastContent = (
    <div className={getStyles()}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsLeaving(true);
              setTimeout(onClose, 300);
            }}
            className={`flex-shrink-0 ml-2 p-1 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(toastContent, document.body)
    : null;
};

// Toast Container Component
export const ToastContainer = ({ toasts, isDark = false }) => {
  if (!toasts || toasts.length === 0) return null;

  const containerContent = (
    <div className="fixed top-4 right-4 z-[10000] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
          isDark={isDark}
        />
      ))}
    </div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(containerContent, document.body)
    : null;
};

export default Toast;

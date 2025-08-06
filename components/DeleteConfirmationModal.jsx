'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  fileName,
  isDeleting = false,
  isDark = false 
}) => {
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div 
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warning Icon */}
        <div className={`p-6 text-center ${
          isDark ? 'bg-red-900/20 border-b border-red-800/30' : 'bg-red-50/80 border-b border-red-200'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark ? 'bg-red-900/40' : 'bg-red-100'
          }`}>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-red-300' : 'text-red-700'
          }`}>
            Delete File
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            This action cannot be undone
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`p-4 rounded-xl mb-6 ${
            isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm mb-1 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  File to delete:
                </p>
                <p className={`text-sm truncate ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} title={fileName}>
                  {fileName}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border mb-6 ${
            isDark 
              ? 'bg-amber-900/20 border-amber-800/40 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500" />
              <div>
                <p className="font-medium text-sm mb-1">Warning</p>
                <p className="text-xs leading-relaxed">
                  This file will be permanently deleted from the knowledge nest. Other users will no longer be able to access it.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isDeleting 
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isDeleting
                  ? 'bg-red-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transform hover:scale-105 active:scale-95'
              }`}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default DeleteConfirmationModal;

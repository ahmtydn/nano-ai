'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { 
  Upload, 
  X, 
  File, 
  FileText, 
  Image, 
  FileVideo, 
  Archive,
  Music,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const FileUploadModal = ({ 
  isOpen, 
  onClose, 
  userOrgDetails, 
  onUploadSuccess,
  isDark = false,
  showToast
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState(''); // For "Other" option
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const uploadFileMetadata = useMutation(api.knowledgeNest.uploadFileMetadata);
  const generateUploadUrl = useMutation(api.knowledgeNest.generateUploadUrl);

  // Handle ESC key to close modal and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && !uploading) {
        handleClose();
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
  }, [isOpen, uploading]);

  // Common subjects for computer science
  const commonSubjects = [
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Web Development',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Mobile App Development',
    'Cloud Computing',
    'Blockchain',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Other'
  ];

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="w-6 h-6 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music className="w-6 h-6 text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <Archive className="w-6 h-6 text-yellow-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const validateFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'audio/mpeg',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed'
    ];

    if (file.size > maxSize) {
      return `File size must be less than 50MB (current: ${formatFileSize(file.size)})`;
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not allowed. Please upload PDF, Word, Excel, PowerPoint, text files, images, videos, audio, or archive files.';
    }

    return null;
  };

  const handleUpload = async () => {
    // Determine the final subject to use
    const finalSubject = subject === 'Other' ? customSubject.trim() : subject.trim();
    
    if (!selectedFile || !finalSubject) {
      setError('Please select a file and enter a subject');
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');
    setUploadStatus(null);

    try {
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Step 2: Upload file to Convex storage
      const fileUploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!fileUploadResult.ok) {
        throw new Error('Failed to upload file to storage');
      }

      const { storageId } = await fileUploadResult.json();

      // Step 3: Save metadata to database
      const result = await uploadFileMetadata({
        file_id: storageId,
        subject: finalSubject,
        filename: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        description: description.trim(),
        username: userOrgDetails.org_user,
      });

      if (result.success) {
        setUploadStatus('success');
        // Clear the form immediately to show success
        setSelectedFile(null);
        setSubject('');
        setCustomSubject('');
        setDescription('');
        setError('');
        
        // Show toast notification if function is provided
        if (showToast) {
          showToast(`"${selectedFile.name}" uploaded successfully! 🎉`);
        }
        
        // Close modal more quickly after success
        setTimeout(() => {
          onUploadSuccess();
          handleClose();
        }, 800); // Further reduced for better UX
      } else {
        throw new Error(result.message || 'Failed to save file metadata');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSubject('');
    setCustomSubject('');
    setDescription('');
    setError('');
    setUploadStatus(null);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  // Create portal content for perfect centering with mobile optimization
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) {
          handleClose();
        }
      }}
    >
      <div 
        className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'
        }`}
        style={{
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-blue-500 to-indigo-600`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  📚 Upload File
                </h2>
                <p className="text-blue-100 text-xs">Share with your class</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">{/* Previous long content replaces with shorter version */}
        <div className="p-4 space-y-4">
          {/* Compact Organization Details */}
          <div className={`p-3 rounded-xl text-xs ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-3 h-3 text-blue-500" />
              <span className="font-medium">Auto-filled from your profile</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>� {userOrgDetails.org_name}</span>
              </div>
              <div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>� Sem {userOrgDetails.semester}</span>
              </div>
            </div>
          </div>

          {/* Compact File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                : selectedFile
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : isDark
                ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{selectedFile.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className={`p-1 rounded-lg transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className={`text-xs flex items-center justify-center gap-2 ${
                  isDark ? 'text-green-300' : 'text-green-600'
                }`}>
                  <CheckCircle className="w-3 h-3" />
                  Ready to upload
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <Upload className={`w-6 h-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Drop file here or click to browse
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    PDF, Word, Excel, Images, Videos (Max: 50MB)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-105"
                >
                  Choose File
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.webm,.mp3,.wav,.zip,.rar,.7z"
            />
          </div>

          {/* Compact Form Fields */}
          <div className="space-y-3">
            {/* Subject Field */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📚 Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  // Clear custom subject when switching away from "Other"
                  if (e.target.value !== 'Other') {
                    setCustomSubject('');
                  }
                }}
                className={`w-full p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:bg-gray-700' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-blue-50/50'
                } focus:outline-none focus:ring-0`}
                required
              >
                <option value="">Select a subject</option>
                {commonSubjects.slice(0, 8).map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            {/* Custom Subject Input - Show when "Other" is selected */}
            {subject === 'Other' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  ✏️ Custom Subject *
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter your custom subject..."
                  className={`w-full p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                  } focus:outline-none focus:ring-0`}
                  required
                />
              </div>
            )}

            {/* Description Field */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📝 Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={2}
                className={`w-full p-2.5 rounded-lg border text-sm transition-all duration-200 resize-none ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                } focus:outline-none focus:ring-0`}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
              isDark 
                ? 'bg-red-900/30 border-red-700/50 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <XCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
              isDark 
                ? 'bg-green-900/30 border-green-700/50 text-green-300' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <p>File uploaded successfully! 🎉</p>
            </div>
          )}

          {/* Compact Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleClose}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || (!subject.trim() || (subject === 'Other' && !customSubject.trim())) || uploading}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 transform ${
                !selectedFile || (!subject.trim() || (subject === 'Other' && !customSubject.trim())) || uploading
                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal for proper modal rendering
  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default FileUploadModal;

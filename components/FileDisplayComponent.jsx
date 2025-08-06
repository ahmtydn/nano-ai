'use client';

import React, { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ToastContainer } from './Toast';
import { useToast } from '@/lib/hooks/useToast';
import { 
  File, 
  FileText, 
  Image, 
  FileVideo, 
  Archive,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  BookOpen,
  Filter,
  Search,
  Grid,
  List,
  Loader2,
  AlertCircle,
  Upload,
  MoreVertical,
  Star,
  Clock,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Music,
  Palette
} from 'lucide-react';

const FileDisplayComponent = ({ 
  username, 
  isDark = false,
  onFileSelect = null, // For selection mode
  showToast = null, // Toast function from parent
  showErrorToast = null // Error toast function from parent
}) => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [filterSubject, setFilterSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'size', 'subject'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Fetch files
  const filesData = useQuery(api.knowledgeNest.getKnowledgeNestFiles, {
    username,
    subject: filterSubject || undefined,
  });

  // Fetch subjects for filter
  const subjectsData = useQuery(api.knowledgeNest.getSubjects, { username });

  // Delete file mutation
  const deleteFile = useMutation(api.knowledgeNest.deleteFile);

  // Download file query - we'll use it on demand
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [previewingFile, setPreviewingFile] = useState(null);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    file: null,
    isDeleting: false
  });
  
  // Toast notifications - use parent functions if available, otherwise use local hook
  const localToast = useToast();
  const showSuccessToast = showToast || localToast.showSuccess;
  const showErrorToastFunc = showErrorToast || localToast.showError;

  const getFileIcon = (fileType, size = 'w-6 h-6') => {
    const className = `${size} flex-shrink-0`;
    
    if (fileType.startsWith('image/')) return <Image className={`${className} text-emerald-500`} />;
    if (fileType.startsWith('video/')) return <FileVideo className={`${className} text-purple-500`} />;
    if (fileType.startsWith('audio/')) return <Music className={`${className} text-pink-500`} />;
    if (fileType.includes('pdf')) return <FileText className={`${className} text-red-500`} />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className={`${className} text-blue-500`} />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileSpreadsheet className={`${className} text-green-500`} />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <Presentation className={`${className} text-orange-500`} />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <Archive className={`${className} text-yellow-500`} />;
    if (fileType.includes('javascript') || fileType.includes('python') || fileType.includes('java')) return <FileCode className={`${className} text-indigo-500`} />;
    if (fileType.includes('text/')) return <FileText className={`${className} text-gray-500`} />;
    return <File className={`${className} text-gray-400`} />;
  };

  const getFileCategory = (fileType) => {
    if (fileType.startsWith('image/')) return { name: 'Image', color: 'emerald' };
    if (fileType.startsWith('video/')) return { name: 'Video', color: 'purple' };
    if (fileType.startsWith('audio/')) return { name: 'Audio', color: 'pink' };
    if (fileType.includes('pdf')) return { name: 'PDF', color: 'red' };
    if (fileType.includes('word') || fileType.includes('document')) return { name: 'Document', color: 'blue' };
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return { name: 'Spreadsheet', color: 'green' };
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return { name: 'Presentation', color: 'orange' };
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return { name: 'Archive', color: 'yellow' };
    if (fileType.includes('javascript') || fileType.includes('python') || fileType.includes('java')) return { name: 'Code', color: 'indigo' };
    if (fileType.includes('text/')) return { name: 'Text', color: 'gray' };
    return { name: 'File', color: 'gray' };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreview = async (file) => {
    try {
      setPreviewingFile(file.file_id);
      
      // Check if file type supports preview
      if (!file.file_type.includes('pdf')) {
        alert('⚠️ Preview is only supported for PDF files. Other file types must be downloaded to view.');
        setPreviewingFile(null);
        return;
      }
      
      // Create preview URL using the dedicated preview API
      const previewUrl = `/api/preview?file_id=${encodeURIComponent(file.file_id)}&username=${encodeURIComponent(username)}`;
      
      // Open preview in new tab - this will serve the file with proper headers for inline viewing
      const previewWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer');
      
      // Check if window was blocked
      if (!previewWindow) {
        alert('Popup blocked. Please allow popups for file preview.');
      }
      
    } catch (error) {
      console.error('Preview error:', error);
      alert('Preview not available for this file');
    } finally {
      setPreviewingFile(null);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      setDownloadingFile(fileId);
      
      const downloadData = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId,
          username: username,
        }),
      });

      if (downloadData.ok) {
        const result = await downloadData.json();
        
        if (result.success) {
          // Create a proper download using fetch and blob
          const response = await fetch(result.downloadUrl);
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            alert('Failed to download file');
          }
        } else {
          alert(result.message || 'Failed to download file');
        }
      } else {
        alert('Failed to prepare download');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDelete = async (file) => {
    setDeleteModal({
      isOpen: true,
      file: file,
      isDeleting: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.file) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const result = await deleteFile({
        file_id: deleteModal.file.file_id,
        username,
      });
      
      if (result.success) {
        showSuccessToast(`"${deleteModal.file.filename}" deleted successfully! 🗑️`);
        setDeleteModal({ isOpen: false, file: null, isDeleting: false });
      } else {
        showErrorToastFunc(result.message || 'Failed to delete file');
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
      }
    } catch (error) {
      console.error('Delete error:', error);
      showErrorToastFunc('Failed to delete file');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDelete = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, file: null, isDeleting: false });
    }
  };

  // Enhanced filtering and sorting
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = filesData?.files?.filter(file => 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploaded_username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
        case 'date':
        default:
          comparison = new Date(a.upload_date) - new Date(b.upload_date);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filesData?.files, searchTerm, sortBy, sortOrder]);

  if (!filesData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full animate-pulse flex items-center justify-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading Files
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Please wait while we fetch your knowledge nest...
          </p>
        </div>
      </div>
    );
  }

  if (!filesData.success) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Failed to Load Files
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filesData.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Header with Advanced Controls */}
      <div className="space-y-4">
        {/* Search and Primary Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search Bar */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search files, subjects, or contributors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                showFilters
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className={`flex rounded-xl overflow-hidden border ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'cards'
                    ? 'bg-blue-500 text-white' 
                    : isDark 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white' 
                    : isDark 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className={`p-6 rounded-xl border transition-all duration-300 ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/50 border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subject Filter */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  📚 Subject
                </label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-sm ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">All Subjects</option>
                  {subjectsData?.subjects?.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  🔄 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-sm ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="date">Upload Date</option>
                  <option value="name">File Name</option>
                  <option value="size">File Size</option>
                  <option value="subject">Subject</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  📈 Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-sm ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              <span className="font-medium">
                {filteredAndSortedFiles.length} file{filteredAndSortedFiles.length !== 1 ? 's' : ''} 
              </span>
            </div>
            {searchTerm && (
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Search: <strong>"{searchTerm}"</strong></span>
              </div>
            )}
            {filterSubject && (
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Subject: <strong>{filterSubject}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Empty State */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center py-16">
          <div className={`max-w-md mx-auto p-8 rounded-2xl ${
            isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'
          }`}>
            <div className="relative mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-200/80'
              }`}>
                <Archive className={`w-10 h-10 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h3 className={`text-xl font-bold mb-3 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {searchTerm || filterSubject ? 'No Files Match Your Search' : 'No Files Found'}
            </h3>
            
            <p className={`mb-6 text-sm leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchTerm || filterSubject 
                ? 'Try adjusting your search terms or filters to discover more files in your knowledge nest.'
                : 'Start building your knowledge repository by uploading your first study materials and resources.'
              }
            </p>
            
            {!searchTerm && !filterSubject && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                isDark 
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-800' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                <Upload className="w-4 h-4" />
                Upload your first resource to get started
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Professional Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredAndSortedFiles.map((file) => {
            const category = getFileCategory(file.file_type);
            return (
              <div
                key={file._id}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  onFileSelect 
                    ? 'cursor-pointer hover:ring-2 hover:ring-blue-500/30' 
                    : ''
                } ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50/50 hover:border-gray-300'
                }`}
                onClick={() => onFileSelect && onFileSelect(file)}
              >
                {/* File Header with Icon and Category */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${
                      isDark ? `bg-${category.color}-900/20` : `bg-${category.color}-50`
                    }`}>
                      {getFileIcon(file.file_type, 'w-5 h-5')}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      isDark 
                        ? `bg-${category.color}-900/30 text-${category.color}-300` 
                        : `bg-${category.color}-100 text-${category.color}-700`
                    }`}>
                      {category.name}
                    </span>
                  </div>

                  {/* File Name and Size */}
                  <div className="mb-3">
                    <h3 className={`font-semibold text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`} title={file.filename}>
                      {file.filename.length > 25 ? `${file.filename.slice(0, 25)}...` : file.filename}
                    </h3>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>

                  {/* Subject Badge */}
                  <div className="mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      isDark 
                        ? 'bg-blue-900/20 text-blue-300 border border-blue-800/50' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      <BookOpen className="w-3 h-3" />
                      <span className="truncate max-w-24">{file.subject}</span>
                    </div>
                  </div>

                  {/* File Description - Fixed height container */}
                  <div className={`text-xs p-2.5 rounded-lg mb-3 h-12 flex items-start ${
                    isDark ? 'bg-gray-700/30 text-gray-400' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {file.description ? (
                      <p 
                        className="overflow-hidden text-ellipsis" 
                        title={file.description}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {file.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No description</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!onFileSelect && (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(file);
                        }}
                        disabled={previewingFile === file.file_id}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          previewingFile === file.file_id
                            ? 'opacity-50 cursor-not-allowed'
                            : !file.file_type.includes('pdf')
                            ? isDark 
                              ? 'bg-gray-700/50 text-gray-500 border border-gray-600/50 cursor-not-allowed opacity-60' 
                              : 'bg-gray-100/50 text-gray-400 border border-gray-200/50 cursor-not-allowed opacity-60'
                            : isDark 
                              ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-800/50' 
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                        title={!file.file_type.includes('pdf') ? 'Preview only available for PDF files' : 'Preview file'}
                      >
                        {previewingFile === file.file_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                        <span>{previewingFile === file.file_id ? 'Opening...' : file.file_type.includes('pdf') ? 'Preview' : 'PDF Only'}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file.file_id, file.filename);
                        }}
                        disabled={downloadingFile === file.file_id}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          downloadingFile === file.file_id
                            ? 'opacity-50 cursor-not-allowed'
                            : isDark 
                              ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300 border border-green-800/50' 
                              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        {downloadingFile === file.file_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        <span>{downloadingFile === file.file_id ? 'Downloading...' : 'Download'}</span>
                      </button>
                      {file.uploaded_username === username && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isDark 
                              ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800/50' 
                              : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                          }`}
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with Metadata */}
                <div className={`px-4 py-3 border-t ${
                  isDark ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-100 bg-gray-50/30'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className={`truncate max-w-16 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} title={file.uploaded_username}>
                        {file.uploaded_username}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {formatDate(file.upload_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Overlay for onFileSelect mode */}
                {onFileSelect && (
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Select File
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Professional List View */
        <div className="space-y-3">
          {filteredAndSortedFiles.map((file) => {
            const category = getFileCategory(file.file_type);
            return (
              <div
                key={file._id}
                className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                  onFileSelect 
                    ? 'cursor-pointer hover:ring-2 hover:ring-blue-500/30' 
                    : ''
                } ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50/50 hover:border-gray-300'
                }`}
                onClick={() => onFileSelect && onFileSelect(file)}
              >
                <div className="flex items-start gap-4">
                  {/* File Icon and Category */}
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-xl ${
                      isDark ? `bg-${category.color}-900/20` : `bg-${category.color}-50`
                    }`}>
                      {getFileIcon(file.file_type, 'w-6 h-6')}
                    </div>
                  </div>
                  
                  {/* File Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-6">
                      {/* Primary Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-base mb-1 truncate group-hover:text-blue-600 transition-colors ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`} title={file.filename}>
                              {file.filename}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                isDark 
                                  ? `bg-${category.color}-900/30 text-${category.color}-300` 
                                  : `bg-${category.color}-100 text-${category.color}-700`
                              }`}>
                                {category.name}
                              </span>
                              <span className={`flex items-center gap-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <Archive className="w-3 h-3" />
                                {formatFileSize(file.file_size)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className={`flex flex-wrap items-center gap-4 text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{file.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-green-500" />
                            <span>{file.uploaded_username}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>{formatDateTime(file.upload_date)}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        {file.description && (
                          <div className={`mt-3 text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <p className="line-clamp-2" title={file.description}>
                              {file.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {!onFileSelect && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(file);
                            }}
                            disabled={previewingFile === file.file_id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                              previewingFile === file.file_id
                                ? 'opacity-50 cursor-not-allowed'
                                : !file.file_type.includes('pdf')
                                ? isDark 
                                  ? 'bg-gray-700/50 text-gray-500 border border-gray-600/50 cursor-not-allowed opacity-60' 
                                  : 'bg-gray-100/50 text-gray-400 border border-gray-200/50 cursor-not-allowed opacity-60'
                                : isDark 
                                  ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-800/50' 
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                            title={!file.file_type.includes('pdf') ? 'Preview only available for PDF files' : 'Preview file'}
                          >
                            {previewingFile === file.file_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {previewingFile === file.file_id ? 'Opening...' : file.file_type.includes('pdf') ? 'Preview' : 'PDF Only'}
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file.file_id, file.filename);
                            }}
                            disabled={downloadingFile === file.file_id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isDark 
                                ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300 border border-green-800/50' 
                                : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                            }`}
                          >
                            {downloadingFile === file.file_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {downloadingFile === file.file_id ? 'Downloading...' : 'Download'}
                            </span>
                          </button>
                          {file.uploaded_username === username && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(file);
                              }}
                              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                                isDark 
                                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800/50' 
                                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                              }`}
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Selection Overlay for onFileSelect mode */}
                      {onFileSelect && (
                        <div className="lg:absolute lg:inset-0 lg:bg-blue-500/10 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200 lg:flex lg:items-center lg:justify-center">
                          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            Select File
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        fileName={deleteModal.file?.filename || ''}
        isDeleting={deleteModal.isDeleting}
        isDark={isDark}
      />
      
      {/* Toast Notifications - only show if using local toast system */}
      {!showToast && <ToastContainer toasts={localToast.toasts} isDark={isDark} />}
    </div>
  );
};

export default FileDisplayComponent;

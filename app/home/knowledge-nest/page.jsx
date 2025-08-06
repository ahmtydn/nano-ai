"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import FileUploadModal from "@/components/FileUploadModal";
import FileDisplayComponent from "@/components/FileDisplayComponent";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/lib/hooks/useToast";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Upload, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  Moon, 
  Sun,
  Building2,
  GraduationCap,
  Calendar,
  TrendingUp,
  Archive,
  Share2,
  Shield,
  Sparkles,
  AlertTriangle,
  Send,
  CheckCircle
} from "lucide-react";

// Org Verification Component
const OrgVerification = ({ user, onVerificationSuccess, isDark, riveContainer, particlesContainer }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'details'
  const [formData, setFormData] = useState({
    org_mail: '',
    otp: '',
    org_name: '',
    semester: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Use org-specific functions for OTP verification
  const verifyOrgOTP = useMutation(api.org.verifyOrgOTP);
  const createOrUpdateOrg = useMutation(api.org.createOrUpdateOrg);

  const handleSendOTP = async () => {
    if (!formData.org_mail.endsWith('edu.tr')) {
      setError('Only edu.tr domain is allowed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the new org email API route
      const response = await fetch('/api/org/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_mail: formData.org_mail,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setStep('otp');
        // Show success message instead of OTP for security
        console.log('OTP sent to:', formData.org_mail);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use org-specific OTP verification function
      const result = await verifyOrgOTP({
        org_mail: formData.org_mail,
        otp: formData.otp
      });

      if (result.success) {
        setStep('details');
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDetails = async () => {
    if (!formData.org_name || !formData.semester || !formData.branch) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate semester
    const semesterNum = parseInt(formData.semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      setError('Semester must be between 1 and 8');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createOrUpdateOrg({
        org_name: formData.org_name,
        org_user: user.username,
        org_mail: formData.org_mail,
        semester: formData.semester,
        branch: formData.branch
      });

      if (result.success) {
        onVerificationSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to save organization details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Rive Animation Background */}
      <div className="absolute inset-0 opacity-30">
        <canvas 
          ref={riveContainer}
          className="w-full h-full"
          style={{ filter: 'blur(1px)' }}
        />
      </div>

      {/* Enhanced Dynamic background elements - matching home page exactly */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        <div 
          ref={particlesContainer}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Main gradient orbs - exactly like home page */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          isDark 
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
            : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20'
        }`}></div>
        <div className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse animation-delay-2000 ${
          isDark 
            ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
            : 'bg-gradient-to-br from-purple-300/20 to-pink-300/20'
        }`}></div>
        <div className={`absolute bottom-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse animation-delay-4000 ${
          isDark 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
            : 'bg-gradient-to-br from-green-300/20 to-emerald-300/20'
        }`}></div>
        
        {/* Grid pattern overlay */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}>
          <div className="grid-pattern"></div>
        </div>
      </div>

      <div className="max-w-xs sm:max-w-sm md:max-w-lg w-full relative z-10">
        <div 
          className={`glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900/50 border-gray-700/30' 
              : 'bg-white/80 border-white/50'
          }`} 
          style={{ 
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* Header with icon */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-pulse`}></div>
              <div className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${
                isDark ? 'bg-gray-900' : 'bg-white'
              }`}>
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🔐 Knowledge Nest Access
            </h2>
            <p className={`text-sm sm:text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Verify your institutional email to access shared academic resources within your organization
            </p>
          </div>

          {/* Status indicator */}
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
            isDark 
              ? 'bg-blue-900/30 border-blue-700/50 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                Secure verification process with edu.tr domain
              </span>
            </div>
          </div>

          {error && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-300 ${
              isDark 
                ? 'bg-red-900/30 text-red-300' 
                : 'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  🏫 Organization Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.org_mail}
                    onChange={(e) => handleInputChange('org_mail', e.target.value)}
                    placeholder="Your institutional email (edu.tr domain)"
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-lg ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                    } focus:outline-none focus:ring-0`}
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
                <p className={`text-xs mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Shield className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                  Only verified edu.tr domain emails are accepted
                </p>
              </div>
              
              <button
                onClick={handleSendOTP}
                disabled={loading || !formData.org_mail}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white transition-all duration-200 transform text-sm sm:text-base ${
                  loading || !formData.org_mail
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm">Sending Verification Code...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Send Verification Code
                  </div>
                )}
              </button>
              
              {otpSent && !loading && (
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
                  isDark 
                    ? 'bg-green-900/30 border-green-700/50 text-green-300' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Verification code sent!</p>
                      <p className="text-xs mt-1 opacity-90 break-words">
                        Please check your email inbox at {formData.org_mail}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  🔢 Enter Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-center text-lg sm:text-2xl tracking-widest font-mono ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                    } focus:outline-none focus:ring-0`}
                  />
                </div>
                <p className={`text-xs mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Calendar className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="break-words">We've sent a 6-digit verification code to {formData.org_mail}</span>
                </p>
              </div>
              
              <button
                onClick={handleVerifyOTP}
                disabled={loading || formData.otp.length !== 6}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white transition-all duration-200 transform text-sm sm:text-base ${
                  loading || formData.otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm">Verifying Code...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Verify & Continue
                  </div>
                )}
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => setStep('email')}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                    isDark 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  ← Back to Email
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, otp: '' }));
                    setError('');
                    handleSendOTP();
                  }}
                  disabled={loading}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-xs sm:text-sm ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : isDark 
                        ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900 border border-blue-700' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                  }`}
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4 sm:space-y-6">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
                isDark 
                  ? 'bg-blue-900/30 border-blue-700/50 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">
                    Email verified successfully! Complete your profile below.
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  👤 Username (Read-only)
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-base ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-gray-300 cursor-not-allowed' 
                      : 'border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  🏫 Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.org_name}
                    onChange={(e) => handleInputChange('org_name', e.target.value)}
                    placeholder="e.g., Reva University"
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-base ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                    } focus:outline-none focus:ring-0`}
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  📚 Semester (1-8)
                </label>
                <div className="relative">
                  <select
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 appearance-none text-sm sm:text-base ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-blue-50/50'
                    } focus:outline-none focus:ring-0`}
                  >
                    <option value="">Select Your Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem.toString()}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  🎓 Branch/Department
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    placeholder="e.g., Computer Science Engineering"
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-base ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/50'
                    } focus:outline-none focus:ring-0`}
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <Archive className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitDetails}
                disabled={loading || !formData.org_name || !formData.semester || !formData.branch}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white transition-all duration-200 transform text-sm sm:text-base ${
                  loading || !formData.org_name || !formData.semester || !formData.branch
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm">Completing Setup...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Complete Verification
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Knowledge Nest Dashboard Component
const KnowledgeNestDashboard = ({ user, isDark }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Toast notifications
  const { toasts, showSuccess, showError } = useToast();

  // Fetch organization details for current user
  const userOrgDetails = useQuery(api.org.getOrgByUser, {
    org_user: user.username,
  });

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Remove loading state - show header immediately for seamless experience

  return (
    <>
      {/* Mobile-optimized container */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 ">
        
        {/* Enhanced Header Section - Matching home page exactly */}
        <div className="relative overflow-hidden rounded-3xl glass-card  mt-15 text-white shadow-lg mb-8"
        style={{borderRadius: '45px'}}>
          <div className="relative px-6 py-12 text-center">
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Knowledge Nest</h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Share and discover academic resources within your organization
            </p>
            
            {/* Organization info integrated into header - only show if data is available */}
            {userOrgDetails?.org && (
              <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100/80 text-blue-700'
                }`}>
                  <Building2 className="w-3 h-3" />
                  {userOrgDetails.org.org_name}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100/80 text-green-700'
                }`}>
                  <GraduationCap className="w-3 h-3" />
                  Semester {userOrgDetails.org.semester}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100/80 text-purple-700'
                }`}>
                  <BookOpen className="w-3 h-3" />
                  {userOrgDetails.org.branch}
                </span>
              </div>
            )}
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white font-medium py-2 px-6 rounded-3xl hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              Upload Resource
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-white/10 dark:bg-gray-800/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-white/10 dark:bg-gray-800/10 rounded-full"></div>
        </div>

        {/* Enhanced Files Section */}
        <div className={`transition-all duration-300 shadow-lg`} style={{borderRadius: '35px'}}>
          <div className="p-4 lg:p-6">
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-indigo-500" />
                <h2 className={`text-xl lg:text-2xl font-bold ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>Shared Resources</h2>
              </div>
              <p className={`text-sm lg:text-base ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Files shared within your organization and class
              </p>
            </div>

            <FileDisplayComponent 
              username={user.username}
              isDark={isDark}
              key={refreshTrigger} // Force refresh after upload
              showToast={showSuccess} // Pass toast function to FileDisplayComponent
              showErrorToast={showError} // Pass error toast function
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        userOrgDetails={userOrgDetails?.org ? {...userOrgDetails.org, org_user: user.username} : null}
        onUploadSuccess={handleUploadSuccess}
        isDark={isDark}
        showToast={showSuccess}
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} isDark={isDark} />
    </>
  );
};

// Main Page Component
export default function KnowledgeNestPage() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [isOrgVerified, setIsOrgVerified] = useState(undefined);
  const particlesContainer = useRef(null);
  const riveContainer = useRef(null);

  // Get current user data from register table
  const userQuery = useQuery(api.auth.getCurrentUser);
  const orgQuery = useQuery(
    api.org.getOrgByUser, 
    user ? { org_user: user.username } : "skip"
  );

  useEffect(() => {
    // Initialize user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Initialize theme based on localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const initialDarkMode = savedTheme ? savedTheme === "dark" : false;
    setIsDark(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);

    // Listen for theme changes
    const handleThemeChange = (e) => {
      const newDarkMode = e.detail.isDark;
      setIsDark(newDarkMode);
      document.documentElement.classList.toggle('dark', newDarkMode);
    };

    // Initialize Rive animation
    const initRiveAnimation = async () => {
      try {
        const rive = await import('@rive-app/canvas');
        
        if (riveContainer.current) {
          const riveInstance = new rive.Rive({
            src: 'https://public.rive.app/community/runtime-files/2063-4080-peaceful-rhythms.riv',
            canvas: riveContainer.current,
            autoplay: true,
            stateMachines: 'State Machine 1',
            onLoad: () => {
              riveInstance.resizeDrawingSurfaceToCanvas();
            },
          });
        }
      } catch (error) {
        console.log('Rive animation not available, using fallback');
      }
    };

    // Create floating particles animation
    const createParticles = () => {
      let cleanup = () => {};

      if (particlesContainer.current) {
        const particles = [];
        const particleCount = 40;
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'floating-particle';
          const colors = isDark 
            ? ['59, 130, 246', '168, 85, 247', '236, 72, 153']
            : ['37, 99, 235', '147, 51, 234', '219, 39, 119'];
          
          const size = Math.random() * 6 + 2;
          particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(${colors[Math.floor(Math.random() * colors.length)]}, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            filter: blur(1px);
            animation: floatParticle ${Math.random() * 25 + 15}s linear infinite;
            animation-delay: -${Math.random() * 20}s;
          `;
          particlesContainer.current.appendChild(particle);
          particles.push(particle);
        }
        
        cleanup = () => {
          particles.forEach(particle => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          });
        };
      }

      return cleanup;
    };

    window.addEventListener('themeChanged', handleThemeChange);

    const cleanupParticles = createParticles();
    initRiveAnimation();

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      cleanupParticles();
      if (riveContainer.current) {
        riveContainer.current.innerHTML = '';
      }
    };
  }, [isDark]);

  useEffect(() => {
    if (orgQuery !== undefined) {
      if (orgQuery && orgQuery.success && orgQuery.org && orgQuery.org.org_verified) {
        setIsOrgVerified(true);
      } else if (orgQuery && !orgQuery.success) {
        // Only set to false if we explicitly get a failed response
        setIsOrgVerified(false);
      }
      // If orgQuery is undefined or still loading, keep isOrgVerified as undefined
      // but allow the dashboard to show with fallback values
    }
  }, [orgQuery]);

  const handleVerificationSuccess = () => {
    // Force a page reload to refresh the verification status
    window.location.reload();
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: newTheme } }));
  };

  

  if (!user) {
    return (
      <div className={`min-h-screen relative overflow-hidden pt-16 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} ${isDark ? 'dark' : ''}`}>
        
        {/* Rive Animation Background */}
        <div className="absolute inset-0 opacity-30">
          <canvas 
            ref={riveContainer}
            className="w-full h-full"
            style={{ filter: 'blur(1px)' }}
          />
        </div>

        {/* Floating Particles */}
        <div 
          ref={particlesContainer}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
              : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20'
          }`}></div>
          <div className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse animation-delay-2000 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
              : 'bg-gradient-to-br from-purple-300/20 to-pink-300/20'
          }`}></div>
          <div className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl animate-pulse animation-delay-4000 ${
            isDark 
              ? 'bg-gradient-to-br from-pink-500/10 to-blue-500/10' 
              : 'bg-gradient-to-br from-pink-300/20 to-blue-300/20'
          }`}></div>
          
          {/* Grid pattern overlay */}
          <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}>
            <div className="grid-pattern"></div>
          </div>
        </div>


        <div className="min-h-screen flex items-center justify-center relative z-10 pt-24">
          <div className="text-center glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Please log in to access Knowledge Nest
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Show verification form if explicitly not verified, otherwise show dashboard
  if (isOrgVerified === false) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen relative overflow-hidden pt-16 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} ${isDark ? 'dark' : ''}`}>
          
          {/* Rive Animation Background */}
          <div className="absolute inset-0 opacity-30">
            <canvas 
              ref={riveContainer}
              className="w-full h-full"
              style={{ filter: 'blur(1px)' }}
            />
          </div>

          {/* Floating Particles */}
          <div 
            ref={particlesContainer}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Geometric Background Elements - exactly like home page */}
          <div className="absolute inset-0">
            <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
              isDark 
                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
                : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20'
            }`}></div>
            <div className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse animation-delay-2000 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
                : 'bg-gradient-to-br from-purple-300/20 to-pink-300/20'
            }`}></div>
            <div className={`absolute bottom-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse animation-delay-4000 ${
              isDark 
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
                : 'bg-gradient-to-br from-green-300/20 to-emerald-300/20'
            }`}></div>
            
            {/* Grid Pattern */}
            <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}>
              <div className="grid-pattern"></div>
            </div>
          </div>

          <OrgVerification 
            user={user} 
            onVerificationSuccess={handleVerificationSuccess} 
            isDark={isDark}
            riveContainer={riveContainer}
            particlesContainer={particlesContainer}
          />
        </div>
      </ProtectedRoute>
    );
  }

  // Main Knowledge Nest Interface - Show Dashboard (removed loading check)
  return (
    <ProtectedRoute>
      <div className={`min-h-screen relative overflow-hidden pt-16 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} ${isDark ? 'dark' : ''}`}>
        
        {/* Rive Animation Background */}
        <div className="absolute inset-0 opacity-30">
          <canvas 
            ref={riveContainer}
            className="w-full h-full"
            style={{ filter: 'blur(1px)' }}
          />
        </div>

        {/* Floating Particles */}
        <div 
          ref={particlesContainer}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Geometric Background Elements - exactly like home page */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
              : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20'
          }`}></div>
          <div className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse animation-delay-2000 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
              : 'bg-gradient-to-br from-purple-300/20 to-pink-300/20'
          }`}></div>
          <div className={`absolute bottom-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse animation-delay-4000 ${
            isDark 
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
              : 'bg-gradient-to-br from-green-300/20 to-emerald-300/20'
          }`}></div>
          
          {/* Grid Pattern */}
          <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}>
            <div className="grid-pattern"></div>
          </div>
        </div>

        <KnowledgeNestDashboard user={user} isDark={isDark} />

        {/* Enhanced Custom Styles */}
        <style jsx>{`
          @keyframes floatParticle {
            0% {
              transform: translateY(110vh) translateX(-10px);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-10vh) translateX(10px);
              opacity: 0;
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .grid-pattern {
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 40px 40px;
          }

          .glass-card {
            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)'};
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.3)'};
            box-shadow: 
              0 8px 32px ${isDark ? 'rgba(0, 0, 0, 0.37)' : 'rgba(31, 38, 135, 0.37)'},
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          }

          @media (max-width: 768px) {
            .glass-card {
              backdrop-filter: blur(15px) saturate(150%);
              -webkit-backdrop-filter: blur(15px) saturate(150%);
            }
          }

          /* Mobile-specific improvements */
          @media (max-width: 640px) {
            .glass-card {
              margin: 0.5rem;
              min-height: auto;
            }
            
            /* Ensure proper touch targets on mobile */
            button {
              min-height: 44px;
            }
            
            input, select {
              font-size: 16px; /* Prevents zoom on iOS */
            }
            
            /* Better spacing for small screens */
            .space-y-4 > * + * {
              margin-top: 1rem;
            }
            
            .space-y-6 > * + * {
              margin-top: 1rem;
            }
          }

          /* Extra small screens */
          @media (max-width: 480px) {
            .grid-cols-1 {
              gap: 0.5rem;
            }
            
            /* Ensure text remains readable */
            .text-xs {
              font-size: 0.75rem;
            }
            
            .text-sm {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}

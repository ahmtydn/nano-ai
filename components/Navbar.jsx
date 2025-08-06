"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'sonner';

// SVG Icon Components
const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 5v6h4v-6m-4-2h4" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CakeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
  </svg>
);

const GlobeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Validation Icon Components
const ValidationIcon = ({ state, onClick, field }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(field, state);
    }
  };

  if (state === 'loading') {
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleClick}>
        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        </svg>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleClick}>
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleClick}>
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  return null;
};

// ProfileDetail Component
const ProfileDetail = ({ icon: Icon, label, value, isDark, textStyle, onEditClick, editState }) => (
  <div className="flex items-center space-x-2 p-2 rounded-lg">
    <Icon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
    <div className="flex-1">
      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${textStyle}`}>{value}</p>
        {onEditClick && (
          <div className="relative">
            <button
              onClick={onEditClick}
              className={`absolute right-0 -top-1.5 p-1 rounded-full transition-all duration-300
                ${editState === 'editing' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label={`Edit ${label}`}
            >
              {editState === 'editing' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            </button>
            <ValidationIcon state={editState} onClick={onEditClick} field={label} />
          </div>
        )}
      </div>
    </div>
  </div>
);

// Validation helper functions (must be declared before component to avoid hoisting issues)
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, '')) && phone.replace(/[\s\-\(\)]/g, '').length >= 10;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: ""
  });

  // All Convex hooks must be called before any conditional returns
  const logout = useMutation(api.auth.logout);
  const userData = useQuery(api.auth.getCurrentUser, { 
    email: user?.email || undefined 
  });
  
  // Real-time validation queries for profile editing
  const checkUsernameExists = useQuery(api.auth.checkUsernameExists,
    (isEditing && formData.username && formData.username.length >= 3 && formData.username !== user?.username)
      ? { username: formData.username }
      : "skip"
  );
  
  const checkEmailExists = useQuery(api.auth.checkEmailExists,
    (isEditing && formData.email && isValidEmail(formData.email) && formData.email !== user?.email)
      ? { email: formData.email }
      : "skip"
  );
  
  const checkPhoneExists = useQuery(api.auth.checkPhoneExists,
    (isEditing && formData.phoneNumber && isValidPhone(formData.phoneNumber) && formData.phoneNumber !== userData?.phoneNumber)
      ? { phoneNumber: formData.phoneNumber }
      : "skip"
  );

  // Additional hooks for profile functionality
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const updateProfile = useMutation(api.auth.updateProfile);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // All useEffect hooks must be before conditional return
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
    };

    const handleLogin = (event) => {
      const userData = event.detail || JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    };

    const handleStorage = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userLoggedIn", handleLogin);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("userLoggedIn", handleLogin);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (userData && user) {
      setFormData({
        username: userData.username || user.username || "",
        email: userData.email || user.email || "",
        phoneNumber: userData.phoneNumber || ""
      });
    }
  }, [userData, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle profile dropdown click outside
      if (isProfileDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      // Handle mobile menu click outside
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isMenuOpen]);
  
  // Hide navbar on NanoAI pages - MOVED AFTER ALL HOOKS
  if (pathname && pathname.includes('/studybuddy')) {
    return null;
  }
  
  // Validation state functions
  const getUsernameValidationState = () => {
    if (!isEditing || !formData.username) return null;
    if (formData.username.length < 3) return 'error';
    if (checkUsernameExists === undefined) return 'loading';
    return checkUsernameExists?.exists ? 'error' : 'success';
  };

  const getEmailValidationState = () => {
    if (!isEditing || !formData.email) return null;
    if (!isValidEmail(formData.email)) return 'error';
    if (checkEmailExists === undefined) return 'loading';
    return checkEmailExists?.exists ? 'error' : 'success';
  };

  const getPhoneValidationState = () => {
    if (!isEditing || !formData.phoneNumber) return null;
    if (!isValidPhone(formData.phoneNumber)) return 'error';
    if (checkPhoneExists === undefined) return 'loading';
    return checkPhoneExists?.exists ? 'error' : 'success';
  };
  
  // Validation click handler to explain errors
  const handleValidationClick = (field, state) => {
    if (state === 'error') {
      switch (field) {
        case 'username':
          if (formData.username.length < 3) {
            toast.error('Username must be at least 3 characters long');
          } else if (checkUsernameExists?.exists) {
            toast.error('This username is already taken. Please choose another one.');
          }
          break;
        case 'email':
          if (!isValidEmail(formData.email)) {
            toast.error('Please enter a valid email address with @ and . symbols');
          } else if (checkEmailExists?.exists) {
            toast.error('This email is already registered. Please use another email.');
          }
          break;
        case 'phoneNumber':
          if (!isValidPhone(formData.phoneNumber)) {
            toast.error('Please enter a valid phone number (minimum 10 digits)');
          } else if (checkPhoneExists?.exists) {
            toast.error('This phone number is already registered. Please use another number.');
          }
          break;
      }
    } else if (state === 'success') {
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} is valid and available!`);
    } else if (state === 'loading') {
      toast.info(`Checking ${field} availability...`);
    }
  };
  
  const handleLogout = async () => {
    if (user) {
      const response = await logout({ email: user.email });
      if (response.success) {
        localStorage.removeItem("user");
        setUser(null);
        setIsProfileDropdownOpen(false);
        setIsMenuOpen(false);
        router.push("/");
        toast.success("Logged out successfully!");
      } else {
        console.error("Logout failed:", response.message);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsMenuOpen(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submitting
    const isUsernameValid = formData.username && formData.username.length >= 3 && !checkUsernameExists?.exists;
    const isEmailValid = formData.email && isValidEmail(formData.email) && !checkEmailExists?.exists;
    const isPhoneValid = formData.phoneNumber && isValidPhone(formData.phoneNumber) && !checkPhoneExists?.exists;
    
    if (!isUsernameValid) {
      toast.error('Please enter a valid and unique username (minimum 3 characters)');
      return;
    }
    
    if (!isEmailValid) {
      toast.error('Please enter a valid and unique email address');
      return;
    }
    
    if (!isPhoneValid) {
      toast.error('Please enter a valid and unique phone number');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await updateProfile({
        currentEmail: user.email,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      });
      
      if (response.success) {
        // Update local storage with new user data
        const updatedUser = {
          ...user,
          username: formData.username,
          email: formData.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNavbarStyles = () => {
    if (isDark) {
      return isScrolled 
        ? 'bg-black/95 backdrop-blur-xl shadow-xl' 
        : 'bg-black/90 backdrop-blur-md';
    } else {
      return isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl' 
        : 'bg-white/90 backdrop-blur-md';
    }
  };

  const getLogoStyles = () => {
    const baseGradient = 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient transition-all duration-300';
    return `${baseGradient} ${isScrolled ? 'opacity-100' : 'drop-shadow-sm'}`;
  };

  const getTextStyles = () => {
    return isDark 
      ? (isScrolled ? 'text-gray-200' : 'text-white/90')
      : (isScrolled ? 'text-gray-700' : 'text-gray-800/90');
  };

  const getLinkStyles = () => {
    return isDark 
      ? (isScrolled 
        ? 'text-gray-200 hover:text-blue-400 hover:bg-gray-800/50' 
        : 'text-white/90 hover:text-white hover:bg-white/10')
      : (isScrolled 
        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
        : 'text-gray-800/90 hover:text-gray-900 hover:bg-black/10');
  };

  const getThemeButtonStyles = () => {
    return isDark 
      ? (isScrolled 
        ? 'text-gray-200' 
        : 'text-white')
      : (isScrolled 
        ? 'text-gray-700' 
        : 'text-gray-800');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Nano AI Logo"
                width={40}
                height={40}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Nano AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">
                  Welcome back, <span className="font-semibold text-gray-900">{user.username}</span>
                </span>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.username}</h3>
                            <p className="text-sm text-gray-500">{userData?.email || user.email}</p>
                          </div>
                        </div>

                        {!isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Username</p>
                                  <p className="text-sm text-gray-900">{userData?.username || user.username}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <EmailIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Email</p>
                                  <p className="text-sm text-gray-900">{userData?.email || user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <PhoneIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                                  <p className="text-sm text-gray-900">{userData?.phoneNumber || 'Not set'}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 pt-2">
                              <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                              >
                                Edit Profile
                              </button>
                              <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                              >
                                Logout
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={formData.username}
                                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Enter username"
                                />
                                <ValidationIcon 
                                  state={getUsernameValidationState()} 
                                  onClick={handleValidationClick}
                                  field="username"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Enter email"
                                />
                                <ValidationIcon 
                                  state={getEmailValidationState()} 
                                  onClick={handleValidationClick}
                                  field="email"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                              <div className="relative">
                                <input
                                  type="tel"
                                  value={formData.phoneNumber}
                                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Enter phone number"
                                />
                                <ValidationIcon 
                                  state={getPhoneValidationState()} 
                                  onClick={handleValidationClick}
                                  field="phoneNumber"
                                />
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 pt-2">
                              <button
                                type="submit"
                                disabled={loading || 
                                  getUsernameValidationState() === 'error' || 
                                  getEmailValidationState() === 'error' || 
                                  getPhoneValidationState() === 'error' ||
                                  getUsernameValidationState() === 'loading' || 
                                  getEmailValidationState() === 'loading' || 
                                  getPhoneValidationState() === 'loading'}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  loading || 
                                  getUsernameValidationState() === 'error' || 
                                  getEmailValidationState() === 'error' || 
                                  getPhoneValidationState() === 'error' ||
                                  getUsernameValidationState() === 'loading' || 
                                  getEmailValidationState() === 'loading' || 
                                  getPhoneValidationState() === 'loading'
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {loading ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth" 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 mt-2 pt-4 pb-4"
            ref={mobileMenuRef}
          >
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500">{userData?.email || user.email}</p>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Username</p>
                          <p className="text-sm text-gray-900">{userData?.username || user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <EmailIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{userData?.email || user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900">{userData?.phoneNumber || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter username"
                        />
                        <ValidationIcon 
                          state={getUsernameValidationState()} 
                          onClick={handleValidationClick}
                          field="username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter email"
                        />
                        <ValidationIcon 
                          state={getEmailValidationState()} 
                          onClick={handleValidationClick}
                          field="email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter phone number"
                        />
                        <ValidationIcon 
                          state={getPhoneValidationState()} 
                          onClick={handleValidationClick}
                          field="phoneNumber"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading || 
                          getUsernameValidationState() === 'error' || 
                          getEmailValidationState() === 'error' || 
                          getPhoneValidationState() === 'error' ||
                          getUsernameValidationState() === 'loading' || 
                          getEmailValidationState() === 'loading' || 
                          getPhoneValidationState() === 'loading'}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          loading || 
                          getUsernameValidationState() === 'error' || 
                          getEmailValidationState() === 'error' || 
                          getPhoneValidationState() === 'error' ||
                          getUsernameValidationState() === 'loading' || 
                          getEmailValidationState() === 'loading' || 
                          getPhoneValidationState() === 'loading'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/auth" 
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
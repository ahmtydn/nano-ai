"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial user state
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Handle login event
    const handleLogin = (event) => {
      const userData = event.detail || JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    };

    // Handle storage changes
    const handleStorage = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Add event listeners
    window.addEventListener("userLoggedIn", handleLogin);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("userLoggedIn", handleLogin);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-1/4 h-72 w-72 animate-pulse rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter dark:bg-blue-800 dark:opacity-20"></div>
        <div className="absolute top-40 right-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-xl filter delay-1000 dark:bg-purple-800 dark:opacity-20"></div>
        <div className="absolute bottom-20 left-1/3 h-72 w-72 animate-pulse rounded-full bg-pink-200 opacity-30 mix-blend-multiply blur-xl filter delay-2000 dark:bg-pink-800 dark:opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <div className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Image
                  src="/logo.png"
                  alt="Nano AI Logo"
                  width={24}
                  height={24}
                  className="mr-2 h-6 w-6"
                />
                Next-generation AI education platform
              </div>
              <h1 className="mb-8 text-6xl leading-tight font-black md:text-8xl">
                <span className="block text-gray-900 dark:text-gray-100">Nano Intelligence</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Macro Success
                </span>
              </h1>
              <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-300">
                We create big differences in the smallest details. Achieve{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">macro-level success</span>{" "}
                with nano-level analysis and{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">maximize your potential</span>.
              </p>
            </div>
            
            <div className="animate-fade-in-up mb-16 flex flex-col items-center justify-center gap-4 animation-delay-500 sm:flex-row">
              {user ? (
                <Link
                  href="/home"
                  className="group flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Go to Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="group flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    Get Started Free
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                  <button className="group flex items-center px-8 py-4 text-lg font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-shadow group-hover:shadow-xl dark:bg-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-5 w-5 text-blue-600">
                        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                      </svg>
                    </div>
                    Watch Demo
                  </button>
                </>
              )}
            </div>
            
            {/* Stats Section */}
            <div className="animate-fade-in-up mx-auto grid max-w-4xl grid-cols-2 gap-8 animation-delay-1000 md:grid-cols-4">
              <div className="group text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform group-hover:scale-110 dark:from-blue-900 dark:to-purple-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">100K+</div>
                <div className="font-medium text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              
              <div className="group text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform group-hover:scale-110 dark:from-blue-900 dark:to-purple-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">99.2%</div>
                <div className="font-medium text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              
              <div className="group text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform group-hover:scale-110 dark:from-blue-900 dark:to-purple-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">4.9/5</div>
                <div className="font-medium text-gray-600 dark:text-gray-400">User Rating</div>
              </div>
              
              <div className="group text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform group-hover:scale-110 dark:from-blue-900 dark:to-purple-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="M16 7h6v6"></path>
                    <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                  </svg>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">3x</div>
                <div className="font-medium text-gray-600 dark:text-gray-400">Speed Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              Advanced Features
            </div>
            <h2 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-gray-100">Why Nano AI?</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              We achieve macro-level results with nano-level precision
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 18V5"></path>
                    <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
                    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
                    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
                    <path d="M18 18a4 4 0 0 0 2-7.464"></path>
                    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
                    <path d="M6 18a4 4 0 0 1-2-7.464"></path>
                    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Learning Engine</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Maximize your potential with AI-powered personalized learning experiences.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Precise Assessment</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Advanced analytics that understand each student's unique needs and provide tailored solutions.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Real-time Progress</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Optimize your learning journey with instant feedback and detailed performance analysis.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Rapid Adaptation</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Dynamic content and methodology that instantly adapts to your learning style.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Secure Platform</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Your data security is our priority. 100% secure and encrypted system.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Global Access</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Accessible from anywhere, anytime. Multilingual support and cloud-based infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Our Mission
              </div>
              <h2 className="mb-8 text-5xl font-bold text-gray-900 dark:text-gray-100">Revolutionizing Education</h2>
              <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                We believe every student is unique. That's why we use artificial intelligence technology to provide completely personalized learning experiences.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Personalized Learning</h3>
                    <p className="text-gray-600 dark:text-gray-400">Content adapted to each student's learning style and pace</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-purple-600 dark:text-purple-400">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Real-time Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400">Instant performance tracking and development recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600 dark:text-emerald-400">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">24/7 AI Assistant</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your tireless AI teacher is always by your side</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 p-8 dark:from-blue-900 dark:to-purple-900">
                <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning Statistics</h3>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M16 7h6v6"></path>
                        <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Mathematics</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">92%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Physics</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">88%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: '88%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Chemistry</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">95%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{width: '95%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              User Reviews
            </div>
            <h2 className="mb-6 text-5xl font-bold text-gray-900 dark:text-gray-100">Our Success Stories</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">We've made a difference in thousands of students' lives</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 fill-current text-yellow-400">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                "Thanks to Nano AI, my math grades improved by 40%. Personalized learning really works!"
              </p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Alex Johnson</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">University Student</div>
              </div>
            </div>
            
            <div className="rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 fill-current text-yellow-400">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                "The courses I took to advance my career were very effective. Amazing platform!"
              </p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Sarah Chen</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Software Developer</div>
              </div>
            </div>
            
            <div className="rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 fill-current text-yellow-400">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                "It was my biggest supporter during my SAT preparation process. I definitely recommend it."
              </p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Michael Torres</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">High School Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white">
            <div className="absolute inset-0 rounded-3xl bg-black/10"></div>
            <div className="relative">
              <h2 className="mb-6 text-5xl font-bold">Nano Intelligence, Macro Success</h2>
              <p className="mb-8 text-xl opacity-90">
                Discover your potential with Nano AI, the choice of millions of students
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth"
                  className="flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-colors hover:bg-gray-50"
                >
                  Try Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Link>
                <button className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-blue-600">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                  <Image
                    src="/logo.png"
                    alt="Nano AI Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
                <span className="text-2xl font-bold">Nano AI</span>
              </div>
              <p className="max-w-xs text-gray-400">
                We provide next-generation experiences in education with artificial intelligence technology.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Pricing</a></li>
                <li><a href="#" className="transition-colors hover:text-white">API</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="transition-colors hover:text-white">About Us</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Blog</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="transition-colors hover:text-white">Help Center</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Privacy</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Nano AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
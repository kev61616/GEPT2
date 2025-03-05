'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <header className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-4">
            Testing Interface
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full mb-4"></div>
        </header>

        <div className={`grid md:grid-cols-2 gap-10 transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {/* GEPT Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-lg opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:border-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="h-48 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-60"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern opacity-5"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transform transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">GEPT</h3>
                </div>
              </div>
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">GEPT Interface</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  General English Proficiency Test environment with interactive tools
                </p>
                <Link 
                  href="/gept" 
                  className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-center rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Launch Interface
                </Link>
              </div>
            </div>
          </div>

          {/* SAT Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-lg opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:border-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>
              <div className="h-48 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-50 opacity-60"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern opacity-5"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transform transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-teal-800">SAT</h3>
                </div>
              </div>
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">SAT Interface</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Specialized layout optimized for standardized test preparation
                </p>
                <Link 
                  href="/sat-layout" 
                  className="block w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium text-center rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Launch Interface
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className={`mt-16 text-center text-gray-400 text-sm transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p>© 2025 Testing Interface Hub</p>
        </footer>
      </div>
    </div>
  );
}

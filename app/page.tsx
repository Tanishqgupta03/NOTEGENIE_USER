"use client"

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);

  const handleGetStarted = () => {
    setIsLoadingStart(true);
    // Simulate an async operation (e.g., API call or redirect)
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000); // Adjust the delay as needed
  };

  const handleUpgradeNow = () => {
    setIsLoadingPremium(true);
    // Simulate an async operation (e.g., API call or redirect)
    setTimeout(() => {
      window.location.href = '/pricing';
    }, 1000); // Adjust the delay as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <img src="/images/side_logo.png" alt="NoteGenie Logo" className="h-14" />
          {/* Hide "NoteGenie" text on smaller screens */}
          <span className="hidden sm:block text-white text-xl font-bold">NoteGenie</span>
        </div>
        <nav className="flex space-x-4 sm:space-x-6">
          <Link href="/features" className="text-gray-300 hover:text-blue-500 transition duration-300">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-blue-500 transition duration-300">
            Pricing
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-blue-500 transition duration-300">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-18">
        {/* Large Text "NOTEGENIE" with Gradient */}
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          NOTEGENIE
        </h1>
        
        {/* Smaller Text "AI-Powered Meet Notes" */}
        <p className="text-2xl text-gray-300 mb-12">
          AI-Powered Meet Notes
        </p>
        
        {/* Cards Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-20">
          {/* Card 1: Start Now */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition duration-300 max-w-sm text-left">
            <h2 className="text-2xl font-bold text-white mb-4">
              Start Now <span className="text-blue-500">→</span>
              {isLoadingStart && (
                <div className="ml-2 inline-block">
                  <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </h2>
            <p className="text-gray-300 mb-6">
              Free Access to Note-Genie
            </p>
            <p className="text-gray-400">
              Experience the intelligent model
            </p>
            <button
              onClick={handleGetStarted}
              disabled={isLoadingStart}
              className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Card 2: Unlock Premium */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-purple-500 transition duration-300 max-w-sm text-left">
            <h2 className="text-2xl font-bold text-white mb-4">
              Unlock Premium <span className="text-purple-500">→</span>
              {isLoadingPremium && (
                <div className="ml-2 inline-block">
                  <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </h2>
            <p className="text-gray-300 mb-6">
              Experience beyond intelligence
            </p>
            <p className="text-gray-400">
              Advanced features and insights
            </p>
            <button
              onClick={handleUpgradeNow}
              disabled={isLoadingPremium}
              className="mt-6 inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-700">
        <p className="text-gray-300">
          &copy; {new Date().getFullYear()} NoteGenie. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
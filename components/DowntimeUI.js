import React from 'react';

export default function DowntimeUI({ error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="text-center">
            {/* Maintenance Icon */}
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Under Maintenance
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              We're updating our countdown data to bring you the latest Fortnite season information.
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <p className="text-gray-400 mb-2">What's happening?</p>
              <p className="text-white">
                {error || "We're having trouble fetching the latest season countdown data. This usually happens when Fortnite updates their season schedule."}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400">
                Check back soon or visit these official sources:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.fortnite.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Official Fortnite Site
                </a>
                <a 
                  href="https://twitter.com/FortniteGame" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                >
                  @FortniteGame
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Timenite automatically updates when new season data becomes available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
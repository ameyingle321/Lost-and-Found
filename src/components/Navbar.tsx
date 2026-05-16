import { useState } from 'react';

interface NavbarProps {
  activeTab: 'lost' | 'found';
  setActiveTab: (tab: 'lost' | 'found') => void;
  onOpenModal: () => void;
}

export function Navbar({ activeTab, setActiveTab, onOpenModal }: NavbarProps) {
  return (
    <div className="sticky top-4 z-50 px-4 w-full flex justify-center">
      <nav className="w-full max-w-6xl bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-2">
          {/* Logo / Brand */}
          <span className="text-xl font-bold text-transparent bg-clip-text bg-claro-gradient pl-2">
            Campus Lost & Found
          </span>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'lost'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Lost Feed
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'found'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Found Feed
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button 
            onClick={onOpenModal}
            className="bg-claro-gradient hover:opacity-90 transition-opacity text-white font-medium py-2 px-5 rounded-xl text-sm shadow-lg shadow-purple/20"
          >
            + Log Item
          </button>
        </div>
      </nav>
    </div>
  );
}

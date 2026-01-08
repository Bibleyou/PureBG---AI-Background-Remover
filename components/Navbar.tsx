import React, { useState } from 'react';
import { DeployModal } from './DeployModal';

interface NavbarProps {
  onNavigate: (tab: 'home' | 'tool') => void;
  activeTab: 'home' | 'tool';
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeTab }) => {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">PureBG</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 md:space-x-6">
                <button 
                  onClick={() => onNavigate('home')}
                  className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Início
                </button>
                
                <button 
                  onClick={() => onNavigate('tool')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'tool' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white text-gray-800 border border-gray-200 hover:border-indigo-400'
                  }`}
                >
                  Remover Fundo
                </button>

                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                {/* O FOGUETE DE IMPLANTAÇÃO */}
                <button 
                  title="Guia de Implantação Google Cloud" 
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all border border-indigo-100 shadow-sm"
                  onClick={() => setIsDeployModalOpen(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />
    </>
  );
};
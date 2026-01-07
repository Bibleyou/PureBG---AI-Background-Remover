
import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolSection } from './components/ToolSection';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tool' | 'home'>('home');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={(tab) => setActiveTab(tab)} activeTab={activeTab} />
      
      <main className="flex-grow">
        {activeTab === 'home' ? (
          <>
            <Hero onStart={() => setActiveTab('tool')} />
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    Professional Results in Seconds
                  </h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Why waste hours in Photoshop? PureBG handles the heavy lifting.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Ultra Precise",
                      desc: "Gemini AI understands context to preserve fine details like hair and shadows.",
                      icon: (
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    },
                    {
                      title: "Smart Detection",
                      desc: "Automatically identifies subjects including people, animals, and products.",
                      icon: (
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )
                    },
                    {
                      title: "High Definition",
                      desc: "Download your processed images in full resolution without quality loss.",
                      icon: (
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <ToolSection />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;

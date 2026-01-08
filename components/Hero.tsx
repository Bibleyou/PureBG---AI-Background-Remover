import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-slate-50 pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                Inteligência Artificial de Ponta
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900">Remova fundos</span>
                <span className="block gradient-text">em alta resolução</span>
              </span>
            </h1>
            <p className="mt-4 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              O PureBG usa a rede neural Gemini para isolar objetos com perfeição. Rápido, seguro e profissional.
            </p>
            <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Abrir Ferramenta
                <svg className="ml-2 -mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-[2.5rem] shadow-2xl overflow-hidden group p-2 bg-white ring-1 ring-gray-200">
              <img
                className="w-full h-auto rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                src="https://picsum.photos/id/64/800/600"
                alt="Exemplo de remoção de fundo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
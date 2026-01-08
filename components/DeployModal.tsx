import React from 'react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const deployCommands = [
    { title: "1. Autenticar", cmd: "gcloud auth login" },
    { title: "2. Configurar Projeto", cmd: "gcloud config set project [ID-DO-PROJETO]" },
    { title: "3. Deploy Cloud Run", cmd: "gcloud run deploy purebg --source . --env-vars-update API_KEY=[SUA_CHAVE] --allow-unauthenticated" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Implantar no Google Cloud</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-600">
            Siga estes comandos no seu terminal para colocar o <strong>PureBG</strong> no ar usando o <strong>Google Cloud Run</strong>.
          </p>

          <div className="space-y-4">
            {deployCommands.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{item.title}</span>
                <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center group">
                  <code className="text-indigo-300 font-mono text-sm overflow-x-auto">{item.cmd}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(item.cmd)}
                    className="ml-4 p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <h4 className="flex items-center text-amber-800 font-bold mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dica Pro
            </h4>
            <p className="text-sm text-amber-700">
              Certifique-se de habilitar as APIs do <strong>Cloud Build</strong> e <strong>Generative AI</strong> no Console do Google Cloud antes de começar.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
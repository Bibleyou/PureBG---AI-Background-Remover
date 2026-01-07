
import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

export const ToolSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setResultImage(null);
      try {
        const base64 = await fileToBase64(file);
        setSelectedImage(base64);
      } catch (err) {
        setError("Failed to load image. Please try another one.");
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await removeBackground(selectedImage);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `purebg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Background Remover
            </h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto">
              Upload your photo below. Our AI will automatically detect the subject and remove everything else.
            </p>

            <div className="space-y-8">
              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 rounded-3xl p-12 bg-indigo-50/30 hover:bg-indigo-50 transition-colors cursor-pointer group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-1">Upload an image</p>
                    <p className="text-gray-500">Drag & drop or click to browse</p>
                    <p className="text-xs text-gray-400 mt-4">Supports PNG, JPG, JPEG</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 checkerboard min-h-[300px] flex items-center justify-center">
                    <img 
                      src={showOriginal ? selectedImage : (resultImage || selectedImage)} 
                      alt="Preview" 
                      className={`max-w-full max-h-[500px] object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50 grayscale' : 'opacity-100'}`}
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <span className="text-indigo-800 font-bold tracking-wider uppercase text-xs animate-pulse">
                            Processing Image...
                          </span>
                        </div>
                      </div>
                    )}

                    {resultImage && !isProcessing && (
                      <button 
                        onMouseDown={() => setShowOriginal(true)}
                        onMouseUp={() => setShowOriginal(false)}
                        onMouseLeave={() => setShowOriginal(false)}
                        className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors select-none"
                      >
                        Hold to Compare
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {!resultImage && !isProcessing && (
                      <>
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="px-8 py-3 rounded-full text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleProcess}
                          className="px-8 py-3 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                          Remove Background
                        </button>
                      </>
                    )}

                    {resultImage && !isProcessing && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedImage(null);
                            setResultImage(null);
                          }}
                          className="px-8 py-3 rounded-full text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          Upload New
                        </button>
                        <button 
                          onClick={handleDownload}
                          className="px-8 py-3 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Result
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Privacy matters: We don't store your images permanently. They are processed securely.</p>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface LearningViewerProps {
  onBack: () => void;
}

export function LearningViewer({ onBack }: LearningViewerProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pdfUrl = "https://drive.google.com/file/d/1ALb71JG4cdEM3u6gX9mE6txukU5yoeuu/preview";
  const externalUrl = "https://drive.google.com/file/d/1ALb71JG4cdEM3u6gX9mE6txukU5yoeuu/view?usp=sharing";

  return (
    <div className="w-full notebook-paper rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        <a 
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white bg-[#A9CCE3] hover:bg-[#8AB6D6] transition-colors font-bold px-4 py-2 rounded-full shadow-sm"
        >
          <span>外部ビューアで開く</span>
          <ExternalLink size={18} />
        </a>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50] mb-3">
          学習(インプット)
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-modern">
          資料を読んで基礎知識を身につけましょう
        </p>
      </div>

      <div className="flex-grow w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner border-2 border-gray-200">
        <iframe 
          src={pdfUrl} 
          className="w-full h-full min-h-[600px]" 
          allow="autoplay"
          title="学習資料"
        ></iframe>
      </div>
    </div>
  );
}

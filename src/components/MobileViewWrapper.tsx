import React from 'react';
import { Smartphone, X } from 'lucide-react';

interface MobileViewWrapperProps {
  isMobileMode: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileViewWrapper({ isMobileMode, onClose, children }: MobileViewWrapperProps) {
  if (!isMobileMode) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative flex flex-col items-center my-auto">
        <div className="flex justify-between w-full max-w-[375px] mb-4">
          <div className="text-white font-bold flex items-center gap-2">
            <Smartphone size={20} />
            スマホプレビュー
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-slate-300 transition-colors bg-white/20 rounded-full p-1"
            title="プレビューを閉じる"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Phone Frame */}
        <div className="w-[375px] h-[812px] bg-white border-[14px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative ring-4 ring-slate-900/50 flex flex-col">
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-50"></div>
          
          {/* Content Area */}
          <div className="mobile-view w-full h-full overflow-y-auto overflow-x-hidden pt-6 transform-gpu">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

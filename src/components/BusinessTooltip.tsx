import React from 'react';
import { HelpCircle } from 'lucide-react';

interface BusinessTooltipProps {
  text: string;
}

export default function BusinessTooltip({ text }: BusinessTooltipProps) {
  return (
    <span className="relative group inline-flex items-center ml-1.5 cursor-pointer align-middle select-none">
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-800 text-white text-[10.5px] leading-relaxed font-sans rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 text-center font-normal">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
      </span>
    </span>
  );
}

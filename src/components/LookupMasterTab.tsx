import React from 'react';
import { Sliders, Search, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { LookupGroup } from '../types';
import { LOOKUP_GROUPS } from '../data';

interface LookupMasterTabProps {
  onNavigateToData: (groupKey: string) => void;
}

export default function LookupMasterTab({
  onNavigateToData
}: LookupMasterTabProps) {
  return (
    <div className="space-y-6 select-none">
      {/* Title block */}
      <div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-title-lg text-slate-900 leading-tight">
              Lookup Master Directories
            </h3>
            <p className="text-body-xs text-outline mt-1 font-medium">
              Segment mappings, corporate divisions, base currency records, and transaction indicators
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border px-4 py-2 rounded text-xs text-slate-700 italic flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Click "Configure Specs" on any card to map specific lookup database keys.</span>
        </div>
      </div>

      {/* Grid of Lookups categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LOOKUP_GROUPS.map((lg) => (
          <div 
            key={lg.groupKey}
            className="bg-white border border-outline-variant rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {lg.groupKey}
                </span>
                <span className="text-[11px] text-outline italic font-medium">System Core</span>
              </div>

              <h4 className="font-sans font-extrabold text-body-md text-slate-900 leading-tight">
                {lg.displayName}
              </h4>
              <p className="text-body-xs text-on-surface-variant font-medium mt-1.5 leading-relaxed">
                {lg.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-dashed border-outline-variant flex items-center justify-between">
              <span className="text-[10px] text-outline font-bold truncate max-w-[140px] uppercase tracking-wider" title={lg.neededFor}>
                {lg.neededFor}
              </span>

              <button
                onClick={() => onNavigateToData(lg.groupKey)}
                className="text-primary hover:text-primary-container text-xs font-bold font-sans flex items-center gap-1.5 transition-all"
              >
                <span>Browse Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Calculator, 
  Play, 
  CheckCircle2, 
  Clock, 
  Database, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Asset } from '../FixedAssetsTab';

interface FAMDepreciationRunProps {
  assets: Asset[];
  onAddTransaction: (txn: any) => void;
  onNavigatePage: (page: string) => void;
  onUpdateAssetStatus: (id: string, updates: any) => void;
}

export default function FAMDepreciationRun({ 
  assets, 
  onAddTransaction, 
  onNavigatePage, 
  onUpdateAssetStatus 
}: FAMDepreciationRunProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-06 (June 2026)');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [recomputing, setRecomputing] = useState(false);

  // Filter out assets that are depreciable (In Service, Capitalized, Impaired, etc. excluding CIP, Land, Draft, Disposed)
  const depreciableAssets = assets.filter(a => 
    a.status === 'In Service' || a.status === 'Capitalized' || a.status === 'Impaired'
  ).filter(a => a.assetClass !== 'Land' && a.assetClass !== 'CIP');

  // Compute calculated depreciation for each asset for current single-month execution
  const computedRuns = depreciableAssets.map(a => {
    let monthlyDepr = 0;
    const depreciableBase = a.acquisitionCost - a.residualValue;
    
    if (a.depreciationMethod === 'Straight Line') {
      monthlyDepr = depreciableBase / (a.usefulLifeYears * 12);
    } else {
      // Reducing balance simulation: say 20% annual rate divided by 12 on Net Book Value
      const currentNBV = a.acquisitionCost - a.accumulatedDepreciation;
      const rate = 0.20; // Simulated Reducing Balance pool rate
      monthlyDepr = (currentNBV * rate) / 12;
    }
    
    // Round to nearest Ethiopian penny
    monthlyDepr = Math.round(monthlyDepr * 100) / 100;
    
    return {
      assetId: a.id,
      name: a.name,
      assetClass: a.assetClass,
      costCenter: a.costCenter,
      usefulLife: a.usefulLifeYears,
      carryingValue: a.acquisitionCost - a.accumulatedDepreciation,
      residualValue: a.residualValue,
      method: a.depreciationMethod,
      monthlyDepreciation: monthlyDepr
    };
  });

  const totalDepreciationCharge = computedRuns.reduce((sum, run) => sum + run.monthlyDepreciation, 0);

  const handleSimulateCalculations = () => {
    setRecomputing(true);
    setTimeout(() => {
      setRecomputing(false);
      setIsCalculated(true);
      setShowVoucher(true);
    }, 850);
  };

  const handlePostDepreciationToGL = () => {
    if (!isCalculated) return;
    
    // Post to transactions via callback
    onAddTransaction({
      id: `TXN-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      reference: `DEP-RUN-${selectedPeriod.substring(0, 7)}`,
      description: `Amortization Cycle for Period ${selectedPeriod} - Subledger Batch Post`,
      amount: totalDepreciationCharge,
      status: 'Posted',
      type: 'Depreciation Run',
      journalEntries: [
        { account: '6010 Depreciation Expense Control', debit: totalDepreciationCharge, credit: 0 },
        { account: '1609 Accumulated Depreciation Control', debit: 0, credit: totalDepreciationCharge }
      ]
    });

    // Update individual assets accumulated depreciation & posted period counts
    computedRuns.forEach(run => {
      const assetObj = assets.find(a => a.id === run.assetId);
      if (assetObj) {
        onUpdateAssetStatus(run.assetId, {
          accumulatedDepreciation: assetObj.accumulatedDepreciation + run.monthlyDepreciation,
          depreciationPostedPeriods: assetObj.depreciationPostedPeriods + 1,
          history: [
            ...assetObj.history,
            `${new Date().toISOString().split('T')[0]}: Posted June 2026 periodic depreciation charge of ${run.monthlyDepreciation.toLocaleString()} ETB via system bulk batch run.`
          ]
        });
      }
    });

    setIsPosted(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6" id="fam-depreciation-run-panel">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] bg-slate-900 text-slate-100 font-mono font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
            IAS 16 PERIODIC AMORTIZATION SYSTEM
          </span>
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-1.5 font-sans">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <span>End of Period Depreciation Run Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Calculates individual depreciable asset subledger segments and generates balanced GL writeback journals.
          </p>
        </div>

        <div className="flex gap-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              setIsCalculated(false);
              setIsPosted(false);
              setShowVoucher(false);
            }}
            className="bg-white border rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono text-slate-800 outline-none"
          >
            <option value="2026-06 (June 2026)">June 2026 (Active)</option>
            <option value="2026-07 (July 2026)">July 2026 (Locked)</option>
            <option value="2026-08 (August 2026)">August 2026 (Locked)</option>
          </select>
        </div>
      </div>

      {/* CORE STATS BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block leading-none">Depreciable Assets</span>
          <span className="text-xl font-black text-slate-900 mt-1.5 block">{depreciableAssets.length} <span className="text-xs text-slate-400 font-mono font-medium">Items</span></span>
          <p className="text-[10px] text-slate-500 mt-1 italic font-sans">Excluding CIP & Freehold Land</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block leading-none">Total Book Carrying Val</span>
          <span className="text-xl font-black text-slate-900 mt-1.5 block">
            {depreciableAssets.reduce((sum, a) => sum + (a.acquisitionCost - a.accumulatedDepreciation), 0).toLocaleString()} <span className="text-xs text-slate-400 font-mono font-black">ETB</span>
          </span>
          <p className="text-[10px] text-slate-500 mt-1 italic font-sans font-mono">Closing June 2026 NBV</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block leading-none">Monthly Depreciation Charge</span>
          <span className="text-xl font-black text-indigo-750 mt-1.5 block">
            {totalDepreciationCharge.toLocaleString()} <span className="text-xs text-slate-450 font-mono">ETB</span>
          </span>
          <p className="text-[10px] text-indigo-600 mt-1 font-bold flex items-center gap-1 font-mono">● {computedRuns.filter(r => r.method === 'Straight Line').length} SL / {computedRuns.filter(r => r.method !== 'Straight Line').length} RB Pool</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block leading-none">Subledger Integration</span>
          <span className={`inline-block text-[10px] font-mono leading-none font-black px-2 py-1 rounded border uppercase w-fit mt-1.5 ${
            isPosted ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
            isCalculated ? 'bg-indigo-50 text-indigo-700 border-indigo-150 animate-pulse' :
            'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            {isPosted ? '● GL POSTED & SYNCED' : isCalculated ? '● READY TO COMMITT' : '● IDLE (PENDING RUN)'}
          </span>
          <p className="text-[9.5px] text-slate-450 mt-1">Automatic double entry postings</p>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Assets lists ready to depreciate */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <span className="text-[11px] font-mono font-black text-slate-600 uppercase tracking-wider">Subledger Depreciation Schedule</span>
            <button
              onClick={handleSimulateCalculations}
              disabled={recomputing || isPosted}
              className={`font-mono text-[10.5px] font-black uppercase px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-white cursor-pointer ${
                isPosted ? 'bg-slate-300 pointer-events-none' : 'bg-slate-900 hover:bg-slate-950 shadow-xs'
              }`}
            >
              {recomputing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Ledger Cycles...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isCalculated ? 'Recalculate Run' : 'Simulate June Depreciation Run'}</span>
                </>
              )}
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono font-black text-[9px] uppercase text-slate-450 tracking-wider">
                  <th className="p-3 pl-4">Tag</th>
                  <th className="p-3">Asset Master Name</th>
                  <th className="p-3">Method</th>
                  <th className="p-3 text-right">Carrying NBV</th>
                  <th className="p-3 text-right">Salvage limit</th>
                  <th className="p-3 text-right text-indigo-700">Period Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {computedRuns.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 pl-4 font-mono font-black text-indigo-750">{r.assetId}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900 leading-snug">{r.name}</div>
                      <div className="text-[10px] text-slate-450 mt-0.5">Cost Center: {r.costCenter} • Useful Life: {r.usefulLife} Years</div>
                    </td>
                    <td className="p-3 font-mono text-[9px] font-black text-slate-500 uppercase">{r.method}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-650">{r.carryingValue.toLocaleString()} ETB</td>
                    <td className="p-3 text-right font-mono text-slate-500">{r.residualValue.toLocaleString()} ETB</td>
                    <td className="p-3 text-right font-mono font-black text-indigo-900">
                      {isCalculated ? (
                        <span>+{r.monthlyDepreciation.toLocaleString()} ETB</span>
                      ) : (
                        <span className="text-slate-350 italic">Pending simulation</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Hand: Journal Preview & Commitment */}
        <div className="lg:col-span-4 space-y-4">
          
          {showVoucher && (
            <div className={`border rounded-2xl p-4.5 space-y-4 transition-all ${
              isPosted ? 'bg-emerald-50/30 border-emerald-250' : 'bg-slate-900 border-slate-950 text-slate-100'
            }`}>
              
              <div className="flex justify-between items-center border-b pb-2.5 border-slate-700">
                <span className={`text-[10px] font-mono font-extrabold tracking-widest ${
                  isPosted ? 'text-emerald-800' : 'text-slate-400'
                }`}>
                  JOURNAL VOUCHER PREVIEW
                </span>
                <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                  isPosted ? 'bg-emerald-100 border border-emerald-200 text-emerald-800' : 'bg-indigo-950 border border-indigo-900 text-indigo-400'
                }`}>
                  {isPosted ? 'COMMITTED TO GENERAL LEDGER' : 'BALANCED OUT'}
                </span>
              </div>

              {/* Journal Double Entry rows */}
              <div className="space-y-3 font-mono text-xs">
                
                {/* Row 1: Debit EXPENSE */}
                <div className={`p-3 rounded-xl border flex justify-between items-start ${
                  isPosted ? 'bg-white border-emerald-150 text-emerald-950' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[8px] font-mono font-black uppercase text-indigo-600 block">DEBIT ACCOUNT</span>
                    <span className="font-black text-[11px] block mt-1">6010 Depreciation Expense Control</span>
                    <span className="text-[9.5px] leading-tight text-slate-500 font-sans block mt-0.5">Amortized operations allocations ledger</span>
                  </div>
                  <span className={`font-black text-xs self-center ${isPosted ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    +{totalDepreciationCharge.toLocaleString()} ETB
                  </span>
                </div>

                {/* Row 2: Credit CONTRA ASSET */}
                <div className={`p-3 rounded-xl border flex justify-between items-start ${
                  isPosted ? 'bg-white border-emerald-150 text-emerald-950' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[8px] font-mono font-black uppercase text-rose-500 block">CREDIT ACCOUNT</span>
                    <span className="font-black text-[11px] block mt-1">1609 Accumulated Depreciation Control</span>
                    <span className="text-[9.5px] leading-tight text-slate-500 font-sans block mt-0.5">PP&E Contra Asset Pool subledger</span>
                  </div>
                  <span className="font-black text-rose-450 text-slate-400 text-xs self-center">
                    -{totalDepreciationCharge.toLocaleString()} ETB
                  </span>
                </div>

              </div>

              {/* Action and Sign-off Gating */}
              {isPosted ? (
                <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl text-emerald-850 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black">Success: June 2026 Depreciation Committed</p>
                    <p className="text-[10px] text-emerald-700 leading-normal mt-0.5">
                      Subledger accounts mutated. Individual audit tracks written. Check standard statements to verify synced asset valuations.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[10.5px] text-slate-400 leading-normal font-sans">
                    * Posting locks the June 2026 subledger, advances active periods, and writes cumulative values back into standard reports. This transaction cannot be undone.
                  </p>
                  <button
                    onClick={handlePostDepreciationToGL}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono font-black text-xs uppercase py-3 rounded-xl tracking-wider cursor-pointer shadow-md transition-all flex justify-center items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Post & Lock June Subledgers</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {!showVoucher && (
            <div className="bg-slate-50 border border-dashed rounded-2xl p-6 text-center text-slate-450 font-sans text-xs py-14 space-y-2">
              <AlertCircle className="w-7 h-7 text-slate-350 mx-auto" />
              <p className="font-black text-slate-600">Pending Amortization Run</p>
              <p className="text-slate-400 leading-normal">
                Click <strong>"Simulate June Depreciation Run"</strong> on the left to queue period estimates, evaluate residual values, and preview balanced Double Entry books.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

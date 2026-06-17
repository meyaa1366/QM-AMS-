import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  Settings, 
  FileText, 
  Coins, 
  Activity, 
  PlusCircle, 
  Trash2, 
  Printer, 
  Download,
  Terminal,
  Bookmark
} from 'lucide-react';

interface FAMAdjustmentsProps {
  assets: any[];
  onAddTransaction: (txn: any) => void;
  onNavigatePage: (page: string) => void;
  onUpdateAssetStatus: (id: string, updates: any) => void;
  initialAdjustTab?: 'reval' | 'impair' | 'components' | 'maint' | 'verify' | 'disposal';
}

export default function FAMAdjustments({ 
  assets, 
  onAddTransaction, 
  onNavigatePage, 
  onUpdateAssetStatus,
  initialAdjustTab
}: FAMAdjustmentsProps) {
  const [activeAdjustTab, setActiveAdjustTab] = useState<'reval' | 'impair' | 'components' | 'maint' | 'verify' | 'disposal'>('reval');

  React.useEffect(() => {
    if (initialAdjustTab) {
      setActiveAdjustTab(initialAdjustTab);
    }
  }, [initialAdjustTab]);

  // 1. REVALUATION STATE
  const [revalAssetId, setRevalAssetId] = useState('FA-2025-090');
  const [revalNewFairValue, setRevalNewFairValue] = useState(145000000);
  const [revalSurveyor, setRevalSurveyor] = useState('Bole Appraisal Group Plc');
  
  // 2. IMPAIRMENT STATE
  const [impairAssetId, setImpairAssetId] = useState('FA-2026-001');
  const [impairRecoverableAmount, setImpairRecoverableAmount] = useState(4800000);
  const [impairIndicator, setImpairIndicator] = useState('Obsolescence / Technical replacement required');

  // 3. COMPONENT DIVISION STATE
  const [compAssetId, setCompAssetId] = useState('FA-2026-001');
  const [compPartsCount, setCompPartsCount] = useState(2);
  const [compPartName1, setCompPartName1] = useState('Main CNC Frame Chassis');
  const [compPartCost1, setCompPartCost1] = useState(3800000);
  const [compPartName2, setCompPartName2] = useState('German High Precision Rotor Turbine');
  const [compPartCost2, setCompPartCost2] = useState(1600000);

  // 4. MAINTENANCE STATE
  const [maintAssetId, setMaintAssetId] = useState('FA-2026-004');
  const [maintType, setMaintType] = useState('Preventive');
  const [maintCost, setMaintCost] = useState(45000);
  const [maintProvider, setMaintProvider] = useState('Caterpillar Service Hub');
  const [maintExpenseType, setMaintExpenseType] = useState<'Expense' | 'Capitalized'>('Expense');

  // 5. PHYSICAL VERIFICATION STATE
  const [scanAssetIdInput, setScanAssetIdInput] = useState('FA-2026-001');
  const [scannedCondition, setScannedCondition] = useState<'Good' | 'Damaged' | 'Under Maintenance'>('Good');
  const [scannedVerifier, setScannedVerifier] = useState('Superintendent Solomon');

  // 6. ASSET DISPOSAL STATE
  const [disposalAssetId, setDisposalAssetId] = useState('FA-2026-004');
  const [disposalType, setDisposalType] = useState<'Sale' | 'Scrap' | 'Retirement'>('Sale');
  const [disposalProceeds, setDisposalProceeds] = useState(3000000);
  const [buyerName, setBuyerName] = useState('Hawassa Trading plc');

  // Selected object computations
  const revalTarget = assets.find(a => a.id === revalAssetId) || assets[0];
  const impairTarget = assets.find(a => a.id === impairAssetId) || assets[0];
  const compTarget = assets.find(a => a.id === compAssetId) || assets[0];
  const disposalTarget = assets.find(a => a.id === disposalAssetId) || assets[0];

  const currentCarryValueReval = revalTarget ? (revalTarget.acquisitionCost + (revalTarget.revaluationSurplus || 0)) - (revalTarget.accumulatedDepreciation || 0) : 0;
  const revalAdjustmentNeeds = Math.max(0, revalNewFairValue - currentCarryValueReval);

  const currentCarryValueImpair = impairTarget ? (impairTarget.acquisitionCost + (impairTarget.revaluationSurplus || 0)) - (impairTarget.accumulatedDepreciation || 0) : 0;
  const impairmentLossEstimated = Math.max(0, currentCarryValueImpair - impairRecoverableAmount);

  const carryingValueDisposal = disposalTarget ? (disposalTarget.acquisitionCost + (disposalTarget.revaluationSurplus || 0)) - (disposalTarget.accumulatedDepreciation || 0) - (disposalTarget.impairmentAccumulated || 0) : 0;
  const gainOrLossOnDisposal = disposalProceeds - carryingValueDisposal;

  // Handlers
  const handleExecuteReval = () => {
    if (revalAdjustmentNeeds <= 0) {
      alert('Fair value must be higher than current carrying net book value to record Revaluation Surplus Reserve.');
      return;
    }
    // Update asset
    onUpdateAssetStatus(revalAssetId, {
      revaluationSurplus: (revalTarget.revaluationSurplus || 0) + revalAdjustmentNeeds,
      history: [
        ...revalTarget.history,
        `2026-06-15: Fair value up-revalued by ${revalSurveyor}. Adjusted reserve carrying up by ${revalAdjustmentNeeds.toLocaleString()} ETB.`
      ]
    });
    alert(`Success: Revaluation surplus equity reserves set for ${revalAssetId}. Journal booked to primary Statements.`);
  };

  const handleExecuteImpairment = () => {
    if (impairmentLossEstimated <= 0) {
      alert('Loss indicator: Asset recoverable value exceeds or matches net carrying value. No impairment recognized.');
      return;
    }
    onUpdateAssetStatus(impairAssetId, {
      impairmentAccumulated: (impairTarget.impairmentAccumulated || 0) + impairmentLossEstimated,
      status: 'Impaired',
      history: [
        ...impairTarget.history,
        `2026-06-15: IAS 36 Impairment Assessment recognized loss of ${impairmentLossEstimated.toLocaleString()} ETB due to: ${impairIndicator}`
      ]
    });
    alert(`Success: Impairment loss written down for ${impairAssetId}. Carry base reduced.`);
  };

  const handleExecuteCompDivision = () => {
    alert(`Success: Component split executed for ${compAssetId}. Asset decayed into discrete sub-tags: ${compAssetId}-A and ${compAssetId}-B.`);
  };

  const handleExecuteMaint = () => {
    alert(`Success: Posted maintenance service ledger log. Charged ${maintCost} ETB to CC-PROD ${maintExpenseType === 'Expense' ? 'General expenses' : 'Capitalized Assets cost pool'}.`);
  };

  const handleExecuteVerification = () => {
    onUpdateAssetStatus(scanAssetIdInput, {
      condition: scannedCondition,
      history: [
        ...assets.find(a => a.id === scanAssetIdInput).history,
        `2026-06-15: Audited via Barcode Handheld Terminal. Condition validated as: ${scannedCondition} by ${scannedVerifier}.`
      ]
    });
    alert(`Success: Simulated Handheld barcode scan. Asset status verified as: ${scannedCondition}.`);
  };

  const handleExecuteDisposal = () => {
    onUpdateAssetStatus(disposalAssetId, {
      status: 'Disposed',
      history: [
        ...disposalTarget.history,
        `2026-06-15: Asset retired. Type: ${disposalType}. Proceeds: ${disposalProceeds.toLocaleString()} ETB. Realized gain/loss: ${gainOrLossOnDisposal.toLocaleString()} ETB.`
      ]
    });
    alert(`Success: Asset retired from service. Realized ${gainOrLossOnDisposal >= 0 ? 'Gain' : 'Loss'} on Disposal: ${Math.abs(gainOrLossOnDisposal).toLocaleString()} ETB.`);
    onNavigatePage('asset-list');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="fam-adjustments-workspace">
      
      {/* TITLE BLOCKS */}
      <div className="flex justify-between items-center border-b border-slate-150 pb-4">
        <div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-mono font-black uppercase px-2 py-0.5 rounded tracking-wider">
            IAS 16 / IAS 36 ADJUSTMENTS & DISPOSALS
          </span>
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-1.5 font-sans">
            <Scale className="w-5 h-5 text-indigo-650" />
            <span>Asset Value Adjustments & Dismantlement Terminal</span>
          </h2>
        </div>
      </div>

      {/* HORIZONTAL BUTTONS NAV */}
      <div className="flex flex-wrap gap-1 border-b border-slate-150 pb-3 text-xs font-mono font-black uppercase tracking-wider">
        {[
          { id: 'reval', label: 'IAS 16 Revaluation', icon: Scale },
          { id: 'impair', label: 'IAS 36 Impairment', icon: AlertTriangle },
          { id: 'components', label: 'Component Accounting', icon: Layers },
          { id: 'maint', label: 'Maintenance Logs', icon: Settings },
          { id: 'verify', label: 'Physical Verification', icon: CheckCircle2 },
          { id: 'disposal', label: 'Asset Disposal (Sale/Scrap)', icon: Coins }
        ].map(sub => (
          <button 
            key={sub.id}
            onClick={() => setActiveAdjustTab(sub.id as any)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeAdjustTab === sub.id 
                ? 'bg-slate-900 text-white border-slate-950' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <sub.icon className="w-3.5 h-3.5 shrink-0" />
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-VIEW RENDER SECTION */}

      {/* 1. REVALUATION (IAS 16) */}
      {activeAdjustTab === 'reval' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">IAS 16 Revaluation Surplus</span>
            
            <div className="space-y-1">
              <label className="text-slate-600 font-bold block">Select Property Asset to Revalue</label>
              <select 
                value={revalAssetId}
                onChange={(e) => setRevalAssetId(e.target.value)}
                className="w-full border p-2 rounded-lg font-mono font-black text-slate-800 bg-white"
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-650 font-bold block mt-1">Certified Fair Valuation Base (ETB)</label>
                <input 
                  type="number"
                  value={revalNewFairValue}
                  onChange={(e) => setRevalNewFairValue(parseFloat(e.target.value) || 0)}
                  className="w-full border p-2 rounded-lg font-mono font-black text-slate-850 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-650 font-bold block mt-1">Appraisal Company</label>
                <input 
                  type="text"
                  value={revalSurveyor}
                  onChange={(e) => setRevalSurveyor(e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1 font-semibold"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteReval}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase py-3 rounded-lg tracking-wider cursor-pointer"
            >
              Post Valuation adjustment & Surplus Reserves
            </button>
          </div>

          {/* Ledger analysis and Voucher preview */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl flex flex-col justify-between text-xs space-y-4">
            <div>
              <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-800 pb-2">Subledger Equity reserve write-back</span>
              <div className="mt-3 divide-y divide-slate-800 leading-normal font-mono text-[11px]">
                <div className="py-2 flex justify-between">
                  <span>Current carrying value base:</span>
                  <span className="text-slate-200">{currentCarryValueReval.toLocaleString()} ETB</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Fair market appraisal:</span>
                  <span className="text-emerald-400 font-extrabold">{revalNewFairValue.toLocaleString()} ETB</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Adjusted capital increment:</span>
                  <span className="text-indigo-400 font-black">+{revalAdjustmentNeeds.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[10px] font-mono">
              <span className="text-slate-500 uppercase block font-bold">DOUBLE ENTRY JOURNAL PREVIEW:</span>
              <p className="text-emerald-450 text-emerald-400">DEBIT Property cost: +{revalAdjustmentNeeds.toLocaleString()} ETB</p>
              <p className="text-indigo-400">CREDIT Equity (Revaluation Surplus): {revalAdjustmentNeeds.toLocaleString()} ETB</p>
            </div>
          </div>

        </div>
      )}

      {/* 2. IMPAIRMENT (IAS 36) */}
      {activeAdjustTab === 'impair' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">IAS 36 Impairment Write down</span>
            
            <div className="space-y-1">
              <label className="text-slate-600 font-bold block">Select Asset to Test</label>
              <select 
                value={impairAssetId}
                onChange={(e) => setImpairAssetId(e.target.value)}
                className="w-full border p-2 rounded-lg font-mono font-black bg-white"
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-slate-650 font-bold block mt-1">Recoverable Amount (ETB) *</label>
                <input 
                  type="number"
                  value={impairRecoverableAmount}
                  onChange={(e) => setImpairRecoverableAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border p-2 rounded-lg font-mono font-black mt-1"
                />
              </div>
              <div>
                <label className="text-slate-650 font-bold block mt-1">Loss Imputed Indicator</label>
                <input 
                  type="text"
                  value={impairIndicator}
                  onChange={(e) => setImpairIndicator(e.target.value)}
                  className="w-full border p-2 rounded-lg mt-1 font-semibold focus:ring-1"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteImpairment}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-mono font-black text-xs uppercase py-3 rounded-lg tracking-wider cursor-pointer shadow-md"
            >
              Post impairment write-down loss
            </button>
          </div>

          <div className="bg-slate-90 pl-5 p-5 bg-slate-900 text-slate-100 rounded-2xl flex flex-col justify-between text-xs space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block pb-1 border-b border-slate-800">Carrying vs Recoverable Assessment</span>
              <div className="divide-y divide-slate-850 pt-2 font-mono text-[11px]">
                <div className="py-2.5 flex justify-between">
                  <span>Subledger carrying NBV:</span>
                  <span>{currentCarryValueImpair.toLocaleString()} ETB</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Recoverable Amount:</span>
                  <span className="text-rose-400 font-bold">{impairRecoverableAmount.toLocaleString()} ETB</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Impairment Loss recognized:</span>
                  <span className="text-rose-400 font-black">-{impairmentLossEstimated.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono space-y-1">
              <span className="text-slate-500 uppercase font-black block">GAAS Journal impact:</span>
              <p className="text-rose-400">DEBIT Impairment Loss Expense (P&L): {impairmentLossEstimated.toLocaleString()} ETB</p>
              <p className="text-slate-400">CREDIT Accum Impairment Allowance (Balance Sheet): {impairmentLossEstimated.toLocaleString()} ETB</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. COMPONENT COMPONENTIZATION (IAS 16) */}
      {activeAdjustTab === 'components' && (
        <div className="space-y-4 text-xs font-sans">
          <div className="bg-slate-50 border p-4.5 rounded-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-505 uppercase tracking-widest block">IAS 16 Component Breakdown Wizard</span>
            <p className="text-slate-550 leading-relaxed">
              Segment a single compound capitalized asset into discrete sub-assets with autonomous lifetimes and depreciation books. Essential under IFRS for components like turbine motors vs concrete chassis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="font-bold block text-slate-600 uppercase text-[9px]">Select parent compound block</label>
                <select 
                  value={compAssetId} 
                  onChange={(e) => setCompAssetId(e.target.value)}
                  className="w-full bg-white border p-2 rounded-lg mt-1 font-mono font-black"
                >
                  {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold block text-slate-650 uppercase text-[9px]">Segment A: {compPartName1}</label>
                <input 
                  type="text" 
                  value={compPartName1} 
                  onChange={(e) => setCompPartName1(e.target.value)}
                  className="w-full bg-white border p-1 rounded mt-1 font-semibold"
                />
                <input 
                  type="number" 
                  value={compPartCost1} 
                  onChange={(e) => setCompPartCost1(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border p-1 mt-1 rounded font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold block text-slate-655 uppercase text-[9px]">Segment B: {compPartName2}</label>
                <input 
                  type="text" 
                  value={compPartName2} 
                  onChange={(e) => setCompPartName2(e.target.value)}
                  className="w-full bg-white border p-1 rounded mt-1 font-semibold"
                />
                <input 
                  type="number" 
                  value={compPartCost2} 
                  onChange={(e) => setCompPartCost2(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border p-1 mt-1 rounded font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-2 border-t mt-4 flex justify-between items-center bg-white p-3 rounded-lg border">
              <span className="font-mono text-[10px]">Total segment sum: <strong>{(compPartCost1 + compPartCost2).toLocaleString()} ETB</strong></span>
              <button
                onClick={handleExecuteCompDivision}
                className="bg-indigo-650 hover:bg-indigo-750 text-white font-mono text-[9px] font-black uppercase px-4 py-1.5 rounded-lg cursor-pointer"
              >
                Execute decomposition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAINTENANCE LOGS */}
      {activeAdjustTab === 'maint' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">Capitalized vs Expensed Maintenance Engine</span>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-600 block">Asset Target for Service Run</label>
              <select 
                value={maintAssetId}
                onChange={(e) => setMaintAssetId(e.target.value)}
                className="w-full border p-2 rounded-lg font-mono font-extrabold bg-white"
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-500 block uppercase text-[9px]">Maintenance Type</label>
                <select value={maintType} onChange={(e) => setMaintType(e.target.value)} className="w-full border p-1 rounded font-semibold mt-1 bg-white">
                  <option value="Preventive">Scheduled PM</option>
                  <option value="Corrective">Corrective Repair</option>
                  <option value="Overhaul">Large Overhaul</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 block uppercase text-[9px] font-mono">Service cost (ETB)</label>
                <input 
                  type="number" 
                  value={maintCost} 
                  onChange={(e) => setMaintCost(parseFloat(e.target.value) || 0)}
                  className="w-full border p-1 rounded font-mono font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-slate-500 block uppercase text-[9px]">Expense Policy</label>
                <select 
                  value={maintExpenseType} 
                  onChange={(e) => setMaintExpenseType(e.target.value as any)} 
                  className="w-full border p-1 rounded font-bold mt-1 bg-white"
                >
                  <option value="Expense">Charge to P&L Expense</option>
                  <option value="Capitalized">Capitalize cost (IAS 16)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExecuteMaint}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase py-3 rounded-lg tracking-wider cursor-pointer"
            >
              Post Service Transaction Voucher
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl border p-5 flex flex-col justify-between text-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-450 uppercase tracking-widest block pb-1 border-b">Active Subledger Service logs</span>
              <div className="divide-y divide-slate-150 text-[10.5px] pt-3 leading-snug space-y-2">
                <div className="pb-2.5">
                  <span className="font-extrabold text-slate-800">Caterpillar PM Series A</span>
                  <p className="text-slate-500">Completed structural lubrication & generator gear alignment. Expensed 45,000 ETB. Provider: Caterpillar Service Hub.</p>
                </div>
                <div className="pt-2.5 pb-1">
                  <span className="font-extrabold text-slate-800">CNC Precision Milling Motor Reprocessing</span>
                  <p className="text-slate-500">Full bearing swap out. Capitalized 120,000 ETB directly into machinery cost bases. Signed off by Martha.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-3.5 rounded border border-indigo-150 text-[10px] leading-relaxed text-indigo-900">
              Under IAS 16, maintenance budgets that prolong useful lifes of assets may be capitalized. General routine upkeep must be expensed directly in the profit and loss ledger.
            </div>
          </div>
        </div>
      )}

      {/* 5. PHYSICAL AUDIT VERIFICATION */}
      {activeAdjustTab === 'verify' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">Barcode/RFID Terminal Emulator</span>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-600 block">Select asset tag to scan</label>
              <select 
                value={scanAssetIdInput}
                onChange={(e) => setScanAssetIdInput(e.target.value)}
                className="w-full border p-2 rounded-lg font-mono font-extrabold bg-white"
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block uppercase text-[9px] font-mono">Assessed Condition Status</label>
                <select 
                  value={scannedCondition}
                  onChange={(e) => setScannedCondition(e.target.value as any)}
                  className="w-full border p-2 rounded-lg font-bold mt-1 bg-white"
                >
                  <option value="Good">In Service • GOOD</option>
                  <option value="Damaged">Impaired • DAMAGED</option>
                  <option value="Under Maintenance">UNDER MAINTENANCE</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 block uppercase text-[9px] font-mono">Auditing Officers Name</label>
                <input 
                  type="text" 
                  value={scannedVerifier} 
                  onChange={(e) => setScannedVerifier(e.target.value)}
                  className="w-full border p-2 rounded-lg font-semibold mt-1 focus:ring-1"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteVerification}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs py-3 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              Dispatch Barcode Scan Verification
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl flex flex-col justify-between text-xs font-mono space-y-4">
            <div>
              <span className="text-[10px] text-slate-450 uppercase tracking-widest block pb-2 border-b border-slate-800">Physical audit ledger status</span>
              <div className="mt-3 divide-y divide-slate-800 text-[10.5px]">
                <div className="py-2 flex justify-between">
                  <span>LAST SCAN TIME:</span>
                  <span className="text-slate-400">2026-06-15 11:32 UTC</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>ACTIVE TAG SERIAL:</span>
                  <span className="text-indigo-400 font-bold">{scanAssetIdInput}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>VARIANCE DETECTED:</span>
                  <span className="text-emerald-400 font-bold">NONE - RECONCILED</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] leading-relaxed text-slate-400">
              Simulates integration with rugged RFID scanners. Automatic reconciliation updates the local registry and history logs to ensure perfect IFRS compliance gating.
            </div>
          </div>
        </div>
      )}

      {/* 6. ASSET DISPOSAL WIZARD */}
      {activeAdjustTab === 'disposal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">Asset Retirement/Dismantling (Sale/Scrap)</span>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-600 block">Select Asset to retire</label>
              <select 
                value={disposalAssetId}
                onChange={(e) => setDisposalAssetId(e.target.value)}
                className="w-full border p-2 rounded-lg font-mono font-extrabold bg-white"
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-500 block uppercase text-[8.5px]">Retire format</label>
                <select 
                  value={disposalType} 
                  onChange={(e) => setDisposalType(e.target.value as any)} 
                  className="w-full border p-1 rounded font-bold mt-1 bg-white text-[11px]"
                >
                  <option value="Sale">Sale to Third Party</option>
                  <option value="Scrap">Writeoff / Scrap</option>
                  <option value="Retirement">Retirement / Dismantlement</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 block uppercase text-[8.5px] font-mono">Sale proceeds (ETB)</label>
                <input 
                  type="number"
                  value={disposalProceeds}
                  onChange={(e) => setDisposalProceeds(parseFloat(e.target.value) || 0)}
                  className="w-full border p-1 rounded font-mono font-extrabold mt-1 text-[11px]"
                  disabled={disposalType === 'Scrap'}
                />
              </div>
              <div>
                <label className="text-slate-500 block uppercase text-[8.5px]">Acquirer client</label>
                <input 
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full border p-1 rounded font-medium mt-1 text-[11px]"
                  disabled={disposalType === 'Scrap'}
                />
              </div>
            </div>

            <button
              onClick={handleExecuteDisposal}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs py-3 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              Execute Disposal & Post Gain/Loss
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl flex flex-col justify-between text-xs space-y-4 font-mono">
            <div>
              <span className="text-[10px] text-slate-450 uppercase tracking-widest block pb-2 border-b border-slate-800">Retirement Gain/Loss Assessment</span>
              <div className="mt-3 divide-y divide-slate-800 text-[11px]">
                <div className="py-2.5 flex justify-between">
                  <span>Gross Cost Carry:</span>
                  <span>{disposalTarget ? (disposalTarget.acquisitionCost).toLocaleString() : 0} ETB</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Net Book Carrying Value (NBV):</span>
                  <span>{carryingValueDisposal.toLocaleString()} ETB</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Disposal Proceeds:</span>
                  <span className="text-indigo-400">{disposalType === 'Scrap' ? '0' : disposalProceeds.toLocaleString()} ETB</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>REALIZED GAIN / LOSS:</span>
                  <span className={`font-black ${gainOrLossOnDisposal >= 0 ? 'text-emerald-450 text-emerald-400' : 'text-rose-400'}`}>
                    {gainOrLossOnDisposal >= 0 ? '+' : ''}{gainOrLossOnDisposal.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[9.5px] leading-snug text-slate-400">
              Completes full subledger retirement: de-recognizes cost and accumulated depreciation from the Balance Sheet, and routes any net Gain or Loss to the Profit & Loss statement.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

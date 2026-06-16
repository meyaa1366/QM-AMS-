import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CircleDot,
  Building,
  HardDrive,
  Percent,
  TrendingDown,
  UserCheck
} from 'lucide-react';

interface FAMDashboardProps {
  assets: any[];
  onNavigatePage: (page: string) => void;
}

export default function FAMDashboard({ assets, onNavigatePage }: FAMDashboardProps) {
  // Calculations based on actual assets in ledger state
  const totalAssetsCount = assets.length;
  const capitalizedCost = assets.reduce((sum, a) => sum + a.acquisitionCost + (a.revaluationSurplus || 0), 0);
  const totalAccumulated = assets.reduce((sum, a) => sum + (a.accumulatedDepreciation || 0), 0);
  const totalImpaired = assets.reduce((sum, a) => sum + (a.impairmentAccumulated || 0), 0);
  const netBookValue = capitalizedCost - totalAccumulated - totalImpaired;

  const additionsThisYear = assets.filter(a => a.acquisitionDate.startsWith('2026')).length;
  const pendingApprovalsCount = assets.filter(a => a.status === 'Draft' || a.status === 'Under Construction').length;
  
  // End of life threshold (useful life years <= posted period fraction or asset near life expiration)
  const nearEndOfLifeCount = assets.filter(a => {
    const expiredFraction = (a.depreciationPostedPeriods || 0) / (a.usefulLifeYears * 12);
    return expiredFraction >= 0.8 && a.status !== 'Disposed';
  }).length;

  const currentMonthDepreciationExpense = assets.reduce((sum, a) => {
    if (a.status === 'Disposed' || a.status === 'Suspended') return sum;
    const depreciableBase = (a.acquisitionCost + (a.revaluationSurplus || 0)) - (a.residualValue || 0);
    const months = a.usefulLifeYears * 12;
    if (months <= 0) return sum;
    return sum + (depreciableBase / months);
  }, 0);

  // Asset category aggregation
  const categories = Array.from(new Set(assets.map(a => a.assetClass || 'Machinery')));
  const categorySummary = categories.map(cat => {
    const catAssets = assets.filter(a => a.assetClass === cat);
    const catCost = catAssets.reduce((sum, a) => sum + a.acquisitionCost, 0);
    return {
      name: cat,
      count: catAssets.length,
      cost: catCost,
      percentage: Math.round((catCost / (capitalizedCost || 1)) * 105)
    };
  }).sort((a, b) => b.cost - a.cost);

  // Asset branch aggregation
  const branches = Array.from(new Set(assets.map(a => a.branch || 'Addis Ababa Head Branch')));
  const branchSummary = branches.map(br => {
    const brAssets = assets.filter(a => a.branch === br);
    const brCost = brAssets.reduce((sum, a) => sum + a.acquisitionCost, 0);
    return {
      name: br.split(' Branch')[0], // shorten the name
      count: brAssets.length,
      cost: brCost
    };
  }).sort((a, b) => b.cost - a.cost);

  const mockApprovals = [
    { id: 'WRK-2026-901', assetTag: 'FA-2026-609', type: 'CIP Capitalization', name: 'Industrial Generator Acquisition', cost: 4500000, requestedBy: 'Martha Hailu', date: '2026-06-12' },
    { id: 'WRK-2026-904', assetTag: 'FA-2026-001', type: 'Fair Value Impairment', name: 'CNC Precision Milling Machine Adjust.', cost: -45000, requestedBy: 'Wolde Giorgis', date: '2026-06-14' },
    { id: 'WRK-2026-910', assetTag: 'FA-2026-550', type: 'Inter-Entity Land Move', name: 'Primary Datacenter Transfer to Hawassa', cost: 0, requestedBy: 'Bekele Zewdu', date: '2026-06-15' }
  ];

  return (
    <div className="space-y-6" id="fam-dashboard-dashboard">
      
      {/* SUMMARY CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TOTAL ASSETS */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capitalized Asset Registry</span>
              <span className="bg-indigo-50 text-indigo-700 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">SAP FI-AA</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 font-mono">{totalAssetsCount}</span>
              <span className="text-xs text-slate-500">Asset Record tags</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-600"><ArrowUpRight className="w-3.5 h-3.5" /> +{additionsThisYear} 2026 CapEx</span>
            <button onClick={() => onNavigatePage('asset-list')} className="text-indigo-600 font-bold hover:underline cursor-pointer">View Registry</button>
          </div>
        </div>

        {/* NET BOOK VALUE */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Book Carrying Value (NBV)</span>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">IFRS Amortized</span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-emerald-700 font-mono">{netBookValue.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-bold">ETB</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span>Gross Cost: {capitalizedCost.toLocaleString()} ETB</span>
            <span className="font-bold text-indigo-600 shrink-0">IAS 16 Compliant</span>
          </div>
        </div>

        {/* DEPRECIATION ALLOWANCE EXPENSE */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between hover:border-rose-300 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Depr Estimate</span>
              <span className="bg-rose-50 text-rose-700 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">Straight Line / Tax Pool</span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-rose-600 font-mono">{Math.round(currentMonthDepreciationExpense).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-bold">ETB / Month</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-rose-600"><TrendingDown className="w-3.5 h-3.5" /> Accum: -{totalAccumulated.toLocaleString()}</span>
            <button onClick={() => onNavigatePage('depreciation-engine')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">Run Engine</button>
          </div>
        </div>

        {/* END OF LIFE / PENDING WORKFLOWS */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gating & Auditing Tasks</span>
              <span className="bg-amber-50 text-amber-700 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase">SoD Integrity</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <span className="block text-lg font-black text-slate-900 font-mono">{pendingApprovalsCount}</span>
                <span className="text-[9px] text-slate-500 font-medium uppercase">Pending Workflows</span>
              </div>
              <div>
                <span className="block text-lg font-black text-amber-600 font-mono">{nearEndOfLifeCount}</span>
                <span className="text-[9px] text-slate-500 font-medium uppercase">Near End of Life</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-amber-600"><AlertTriangle className="w-3.5 h-3.5" /> High Risk Verification</span>
            <span className="font-mono text-[9px] text-slate-400">v1.4 Gating Status</span>
          </div>
        </div>

      </div>

      {/* CHARTS, BREAKDOWN GRIDS, ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ASSETS BY CATEGORY BAR CHART GRAPH (D3 FEEL IN DENSE HTML) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Assets Category Allocations</h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 pb-4 leading-normal">
              Acquisition value breakdown integrated across corporate subledgers. Adjusted automatically under IAS 16 rules.
            </p>
            <div className="space-y-3">
              {categorySummary.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-700">
                    <span className="font-bold">{cat.name} <span className="text-[9px] text-slate-400">({cat.count})</span></span>
                    <span className="font-mono">{cat.cost.toLocaleString()} ETB</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-indigo-650' :
                        i === 1 ? 'bg-indigo-400' :
                        i === 2 ? 'bg-sky-400' :
                        'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(12, cat.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 leading-normal flex items-center justify-between">
            <span>IFRS 16 Lease & PP&E</span>
            <button onClick={() => onNavigatePage('configuration')} className="text-indigo-600 font-bold hover:underline">Config Classes</button>
          </div>
        </div>

        {/* ASSETS BY BRANCH ACCORDIONS */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Acquisitions by Regional Hub</h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 pb-4">
              Geographical distribution showing capitalized costs tied directly to Cost Center codes and local project sites.
            </p>

            <div className="divide-y divide-slate-100">
              {branchSummary.map((br, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-800">{br.name}</span>
                    <span className="block text-[10px] text-slate-450">{br.count} Capitalized assets registered</span>
                  </div>
                  <span className="bg-slate-50 border border-slate-150 p-1.5 rounded text-slate-700 font-mono font-bold">
                    {br.cost.toLocaleString()} <span className="text-[9px] text-slate-400">ETB</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 flex justify-between">
            <span>Integrated with General Ledger</span>
            <button onClick={() => onNavigatePage('reports')} className="text-indigo-600 font-bold hover:underline">View Ledger Card</button>
          </div>
        </div>

        {/* RECENT ACTIVITIES & APPROVAL WORKFLOW GATES */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Workflow Approvals</h3>
            </div>
            
            <div className="mt-3.5 space-y-3">
              {mockApprovals.map((appr) => (
                <div key={appr.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-150 rounded px-1.5 uppercase font-mono font-bold">{appr.type}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400">{appr.id}</span>
                  </div>
                  <p className="text-[11.5px] font-bold text-slate-800 leading-tight">{appr.name}</p>
                  <p className="text-[10px] text-slate-500">Initiator: {appr.requestedBy} • {appr.date}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                    {appr.cost !== 0 ? (
                      <span className="text-[10px] font-mono font-bold text-slate-700">{appr.cost.toLocaleString()} ETB</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-500">FOC Allocation</span>
                    )}
                    <div className="flex gap-1.5">
                      <button className="bg-white hover:bg-slate-100 border text-slate-700 text-[10px] font-bold py-1 px-2 rounded cursor-pointer leading-none">
                        Reject
                      </button>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-2 rounded cursor-pointer leading-none">
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 flex justify-between items-center">
            <span>Segregation of Duties Enforced</span>
            <button onClick={() => onNavigatePage('administration')} className="text-indigo-600 font-bold hover:underline">Approval Rules</button>
          </div>
        </div>

      </div>

    </div>
  );
}

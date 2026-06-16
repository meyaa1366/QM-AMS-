import React, { useState } from 'react';
import FAMDashboard from './FAMDashboard';
import FAMAssetList from './FAMAssetList';
import FAMAssetRegister from './FAMAssetRegister';
import FAMOperations from './FAMOperations';
import FAMAdjustments from './FAMAdjustments';
import FAMSpecsExplorer from '../FAMSpecsExplorer';
import FAMDepreciationRun from './FAMDepreciationRun';

import { 
  Activity, 
  Database, 
  PlusCircle, 
  ArrowRightLeft, 
  Layers, 
  Scale, 
  AlertTriangle, 
  Settings, 
  CheckCircle2, 
  Coins, 
  FileText, 
  FolderLock, 
  Grid,
  FileSpreadsheet,
  Download,
  Terminal,
  Bookmark,
  Sparkles,
  Info,
  Calculator
} from 'lucide-react';

interface AdvancedFamSuiteProps {
  assets: any[];
  onAddAsset: (newAsset: any) => void;
  onUpdateAssetStatus: (id: string, updates: any) => void;
  onAddTransaction: (txn: any) => void;
  initialPage?: string;
  onNavigatePage?: (pageId: string, sub?: string) => void;
}

export default function AdvancedFamSuite({ 
  assets, 
  onAddAsset, 
  onUpdateAssetStatus, 
  onAddTransaction,
  initialPage = 'dashboard',
  onNavigatePage
}: AdvancedFamSuiteProps) {
  
  // Current active page inside advanced workspace
  const [activePage, setActivePage] = useState<string>(initialPage);
  
  // Highlighting selected asset card in sidebar detail
  const [selectedAsset, setSelectedAsset] = useState<any>(assets[0]);

  // Reports tab states
  const [selectedReportType, setSelectedReportType] = useState<string>('register');
  const [reconciliationVarianceOnly, setReconciliationVarianceOnly] = useState(false);

  // Navigator links for advanced workdesk sidebar menu
  const menuCategories = [
    {
      label: '3. 🏗️ Fixed Assets',
      items: [
        { id: 'dashboard', label: 'Dashboard & Analysis', icon: Activity },
        { id: 'asset-list', label: 'Asset Master List', icon: Database },
        { id: 'asset-register', label: 'Register Asset', icon: PlusCircle },
        { id: 'capitalization', label: 'Asset Capitalization', icon: Sparkles, target: 'operations', sub: 'capitalization' },
        { id: 'cip', label: 'Work in Progress (CIP)', icon: Layers, target: 'operations', sub: 'cip' },
        { id: 'transfer', label: 'Asset Transfer', icon: ArrowRightLeft, target: 'operations', sub: 'transfer' },
        { id: 'depreciation-run', label: 'Depreciation Run', icon: Calculator },
        { id: 'reval', label: 'Revaluation (IAS 16)', icon: Scale, target: 'adjustments', sub: 'reval' },
        { id: 'impair', label: 'Impairment (IAS 36)', icon: AlertTriangle, target: 'adjustments', sub: 'impair' }
      ]
    },
    {
      label: '⚙️ Auditing & Auxiliary',
      items: [
        { id: 'components', label: 'Component Accounting', icon: Grid, target: 'adjustments', sub: 'components' },
        { id: 'leases', label: 'IFRS 16 Lease Manager', icon: Settings, target: 'operations', sub: 'leases' },
        { id: 'maint', label: 'Maintenance scheduler', icon: Settings, target: 'adjustments', sub: 'maint' },
        { id: 'verify', label: 'Physical verification', icon: CheckCircle2, target: 'adjustments', sub: 'verify' },
        { id: 'disposal', label: 'Asset Retirement (Dispos)', icon: Coins, target: 'adjustments', sub: 'disposal' },
        { id: 'reports', label: 'Ledger Reports Suite', icon: FileText },
        { id: 'administration', label: 'Posting rules & Workflows', icon: FolderLock },
        { id: 'specs-manual', label: 'Implementation Specs', icon: Terminal }
      ]
    }
  ];

  // Helper page navigation that bridges both page switching and operations/adjustments sub-tabbing
  const [operationsSub, setOperationsSub] = useState<'capitalization' | 'cip' | 'transfer' | 'leases'>('capitalization');
  const [adjustmentsSub, setAdjustmentsSub] = useState<'reval' | 'impair' | 'components' | 'maint' | 'verify' | 'disposal'>('reval');

  React.useEffect(() => {
    const adjustmentsSubs = ['reval', 'impair', 'components', 'maint', 'verify', 'disposal'];
    const operationsSubs = ['capitalization', 'cip', 'transfer', 'leases'];

    if (adjustmentsSubs.includes(initialPage)) {
      setActivePage('adjustments');
      setAdjustmentsSub(initialPage as any);
    } else if (operationsSubs.includes(initialPage)) {
      setActivePage('operations');
      setOperationsSub(initialPage as any);
    } else {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  const handleMenuClick = (item: any) => {
    if (item.id === 'asset-register') {
      setSelectedAsset(null);
    }
    if (item.target) {
      setActivePage(item.target);
      if (item.target === 'operations') {
        setOperationsSub(item.sub);
      } else if (item.target === 'adjustments') {
        setAdjustmentsSub(item.sub);
      }
      if (onNavigatePage) {
        onNavigatePage(item.target, item.sub);
      }
    } else {
      setActivePage(item.id);
      if (onNavigatePage) {
        onNavigatePage(item.id);
      }
    }
  };

  const handleNavigatePageDirectly = (pageId: string) => {
    setActivePage(pageId);
    if (onNavigatePage) {
      onNavigatePage(pageId);
    }
  };

  const handleSelectAsset = (asset: any) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="w-full" id="advanced-fam-suite-layout">
      
      {/* PRIMARY CONTENT WINDOW */}
      <div className="space-y-4">
        
        {/* Page Switcher */}
        {activePage === 'dashboard' && (
          <FAMDashboard assets={assets} onNavigatePage={handleNavigatePageDirectly} />
        )}

        {activePage === 'asset-list' && (
          <FAMAssetList 
            assets={assets} 
            onSelectAsset={handleSelectAsset} 
            onNavigatePage={handleNavigatePageDirectly} 
            onEditAsset={(asset) => {
              setSelectedAsset(asset);
              setActivePage('asset-register');
            }} 
          />
        )}

        {activePage === 'asset-register' && (
          <FAMAssetRegister 
            selectedAsset={selectedAsset}
            onAddAsset={onAddAsset} 
            onUpdateAssetStatus={onUpdateAssetStatus} 
            onNavigatePage={handleNavigatePageDirectly} 
          />
        )}

        {activePage === 'depreciation-run' && (
          <FAMDepreciationRun 
            assets={assets}
            onAddTransaction={onAddTransaction}
            onUpdateAssetStatus={onUpdateAssetStatus}
            onNavigatePage={handleNavigatePageDirectly}
          />
        )}

        {activePage === 'operations' && (
          <FAMOperations 
            assets={assets} 
            onAddAsset={onAddAsset} 
            onNavigatePage={handleNavigatePageDirectly} 
            onAddTransaction={onAddTransaction} 
          />
        )}

        {activePage === 'adjustments' && (
          <FAMAdjustments 
            assets={assets} 
            onUpdateAssetStatus={onUpdateAssetStatus} 
            onNavigatePage={handleNavigatePageDirectly} 
            onAddTransaction={onAddTransaction} 
          />
        )}

        {/* 3. REPORTS SUITE (Detailed and Interactive) */}
        {activePage === 'reports' && (
          <div className="bg-white border rounded-2xl p-6 space-y-5" id="fam-reports-page">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] bg-slate-900 text-slate-100 font-mono font-black uppercase px-2 py-0.5 rounded">IFRS / IAS PP&E Statements</span>
                <h3 className="text-base font-black text-slate-900 mt-1 uppercase tracking-tight flex items-center gap-2 font-sans">
                  <FileText className="w-5 h-5 text-indigo-650" />
                  <span>Interactive Fixed Assets Reporting Center</span>
                </h3>
              </div>
              <button 
                onClick={() => alert('PDF export generated for all active cost units.')}
                className="bg-slate-50 hover:bg-slate-100 border text-slate-700 font-mono text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase font-black"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export PDF Registry</span>
              </button>
            </div>

            {/* Reports selectors select bar */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider">
              <button 
                onClick={() => setSelectedReportType('register')}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${selectedReportType === 'register' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                Fixed Asset Register
              </button>
              <button 
                onClick={() => setSelectedReportType('depr')}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${selectedReportType === 'depr' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                Depreciation schedules
              </button>
              <button 
                onClick={() => setSelectedReportType('movement')}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${selectedReportType === 'movement' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                Asset movement grid
              </button>
              <button 
                onClick={() => setSelectedReportType('reconcile')}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${selectedReportType === 'reconcile' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                Subledger reconciliation to GL
              </button>
            </div>

            {/* REPORT TYPE DETAILS GRIDS */}
            {selectedReportType === 'register' && (
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block leading-none">Registered Assets Summary</span>
                <div className="border rounded-xl overflow-hidden font-sans">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b font-mono font-black text-[9.5px] uppercase tracking-widest">
                        <th className="p-3">Asset tag</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Cost basis</th>
                        <th className="p-3 text-right">Rep. Surplus</th>
                        <th className="p-3 text-right">Accum Dep.</th>
                        <th className="p-3 text-right">Net Book Value</th>
                        <th className="p-3">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {assets.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-indigo-750 font-bold">{a.id}</td>
                          <td className="p-3 font-semibold text-slate-900">{a.name}</td>
                          <td className="p-3 text-right font-mono font-bold">{a.acquisitionCost.toLocaleString()} ETB</td>
                          <td className="p-3 text-right font-mono text-emerald-600">+{a.revaluationSurplus?.toLocaleString() || '0'}</td>
                          <td className="p-3 text-right font-mono text-rose-500">-{a.accumulatedDepreciation.toLocaleString()} ETB</td>
                          <td className="p-3 text-right font-mono font-black text-slate-850">
                            {(a.acquisitionCost + (a.revaluationSurplus || 0) - a.accumulatedDepreciation - (a.impairmentAccumulated || 0)).toLocaleString()} ETB
                          </td>
                          <td className="p-3 font-mono text-[10px] font-bold text-slate-505 uppercase">{a.depreciationMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReportType === 'depr' && (
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block leading-none">Multi-Period Amortization Forecasts</span>
                <div className="border rounded-xl p-4 bg-slate-50 font-mono text-xs text-slate-650 space-y-2">
                  <p><strong>IFRS Multi-Book depreciation forecast parameters:</strong> Base currency ETB. Compiling straight-line profiles.</p>
                  <div className="divide-y bg-white border rounded-lg p-2.5 space-y-1.5">
                    {assets.map(a => {
                      const deprYear = Math.round(((a.acquisitionCost - a.residualValue) / a.usefulLifeYears));
                      return (
                        <div key={a.id} className="flex justify-between py-1 text-[11px]">
                          <span>{a.id} • {a.name.substring(0, 32)}...</span>
                          <span className="font-extrabold text-slate-900">Est. Annual depr: {deprYear.toLocaleString()} ETB</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {selectedReportType === 'movement' && (
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block leading-none">Asset Movements & Disposals</span>
                <div className="border rounded-xl p-6 text-center text-slate-500 font-sans text-xs py-12 border-dashed">
                  📊 Asset Movement schedules automatically report capital additions, impairment writedowns, reval gains, and retirements. Select and download full ledger books to render graphs.
                </div>
              </div>
            )}

            {selectedReportType === 'reconcile' && (
              <div className="space-y-4 font-sans">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border font-mono text-[11px]">
                  <span>Subledger Control Accounts Matching:</span>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={reconciliationVarianceOnly}
                      onChange={(e) => setReconciliationVarianceOnly(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Highlight variances only</span>
                  </label>
                </div>

                <div className="border rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b font-mono text-[9.5px] uppercase font-black tracking-widest">
                        <th className="p-3">Control Code</th>
                        <th className="p-3">Subledger balance</th>
                        <th className="p-3">General Ledger balance</th>
                        <th className="p-3 text-right">Net variance</th>
                        <th className="p-3 text-center">Reconciliation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">1601 Land and Buildings control</td>
                        <td className="p-3 font-mono">140,400,000 ETB</td>
                        <td className="p-3 font-mono">140,400,000 ETB</td>
                        <td className="p-3 text-right font-mono text-emerald-600">0.00 ETB</td>
                        <td className="p-3 text-center font-bold text-emerald-600">● MATCHED</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">1605 Heavy Plant Machinery</td>
                        <td className="p-3 font-mono">9,900,000 ETB</td>
                        <td className="p-3 font-mono">9,900,000 ETB</td>
                        <td className="p-3 text-right font-mono text-emerald-600">0.00 ETB</td>
                        <td className="p-3 text-center font-bold text-emerald-600">● MATCHED</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">1610 IT & Office Hardware</td>
                        <td className="p-3 font-mono">1,850,000 ETB</td>
                        <td className="p-3 font-mono">1,854,500 ETB</td>
                        <td className="p-3 text-right font-mono text-rose-500">-4,500.00 ETB</td>
                        <td className="p-3 text-center font-bold text-rose-600">▲ UNRECONCILED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. ADMINISTRATION & CONFIGURATION PARAMETERS */}
        {activePage === 'administration' && (
          <div className="bg-white border rounded-2xl p-6 space-y-6" id="fam-admin-page">
            <span className="text-[10px] bg-slate-900 text-slate-100 font-mono font-black uppercase px-2 py-0.5 rounded tracking-wider">
              D365 / SAP ADMINISTRATIVE RULE BOOK
            </span>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-1.5 font-sans">
              <FolderLock className="w-5 h-5 text-indigo-650" />
              <span>General System Parameters & Signoff Workflows</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
                <span className="font-mono font-black text-[10px] text-slate-500 uppercase tracking-widest block leading-none">Automatic Number Sequences</span>
                <div className="space-y-1.5 divide-y font-mono text-[10.5px]">
                  <div className="py-2 flex justify-between"><span>Capitalized asset IDs:</span> <span className="font-bold text-slate-800">FA-[YEAR]-### (Sequential)</span></div>
                  <div className="py-2 flex justify-between"><span>Leasehold ROU IDs:</span> <span className="font-bold text-slate-800">FA-LE-[YEAR]-###</span></div>
                  <div className="py-2 flex justify-between"><span>Transfer Voucher sequences:</span> <span className="font-bold text-slate-800">WRK-TR-#####</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border rounded-xl space-y-3">
                <span className="font-mono font-black text-[10px] text-slate-500 uppercase tracking-widest block leading-none">Core Depr Engine Parameters</span>
                <div className="space-y-1.5 divide-y font-mono text-[10.5px]">
                  <div className="py-2 flex justify-between"><span>Regulatory Limit:</span> <span className="font-bold text-slate-800">ERCA Pool guidelines</span></div>
                  <div className="py-2 flex justify-between"><span>Capitalization Floor Cost:</span> <span className="font-bold text-slate-850">10,000 ETB (Proclamation rule)</span></div>
                  <div className="py-2 flex justify-between"><span>Acquisition rounding:</span> <span className="font-bold text-slate-800">Rounding to nearest penny (0.01)</span></div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-150 space-y-2 text-xs">
              <span className="font-mono font-black text-[10px] text-indigo-850 uppercase tracking-widest block leading-none">Active Workflow Approver Matrix</span>
              <p className="text-indigo-900 leading-relaxed font-medium">
                Authorization mandates require two verification codes before disposing PP&E. Impairment testing under IAS 36 enforces instant notification alerts to risk and auditing modules.
              </p>
            </div>
          </div>
        )}

        {/* 5. SPECIFICATION Explorer tab */}
        {activePage === 'specs-manual' && (
          <div className="bg-white border rounded-2xl p-6" id="fam-view-specs-manual shadow-sm">
            <FAMSpecsExplorer />
          </div>
        )}

      </div>
    </div>
  );
}

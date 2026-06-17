import React, { useState } from 'react';
import { 
  PlusCircle, 
  ArrowRightLeft, 
  HardDrive, 
  Coins, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Clock, 
  Activity, 
  RefreshCw, 
  FileText, 
  Database,
  Building,
  HardDriveUpload,
  UserCheck
} from 'lucide-react';

interface FAMOperationsProps {
  assets: any[];
  onAddAsset: (newAsset: any) => void;
  onNavigatePage: (page: string) => void;
  onAddTransaction: (txn: any) => void;
  initialOpsSubTab?: 'capitalization' | 'cip' | 'transfer' | 'leases';
}

export default function FAMOperations({ 
  assets, 
  onAddAsset, 
  onNavigatePage, 
  onAddTransaction,
  initialOpsSubTab
}: FAMOperationsProps) {
  const [activeOpsSubTab, setActiveOpsSubTab] = useState<'capitalization' | 'cip' | 'transfer' | 'leases'>('capitalization');

  React.useEffect(() => {
    if (initialOpsSubTab) {
      setActiveOpsSubTab(initialOpsSubTab);
    }
  }, [initialOpsSubTab]);

  // Asset Capitalization Form
  const [capSource, setCapSource] = useState<'AP' | 'Inventory' | 'CIP' | 'Project'>('AP');
  const [invoiceRef, setInvoiceRef] = useState('INV-2026-F8909');
  const [vendorCode, setVendorCode] = useState('VEN-981 (Messebo Cement)');
  const [rawCapitalBase, setRawCapitalBase] = useState(2400000);
  const [capAssetClass, setCapAssetClass] = useState<'Machinery' | 'IT' | 'Vehicles' | 'Furniture' | 'Land'>('Machinery');
  const [capAssetName, setCapAssetName] = useState('Heavy Rotary Kiln Component A');
  const [reconcileGL, setReconcileGL] = useState(true);

  // CIP Register Form
  const [cipProjectName, setCipProjectName] = useState('Hawassa Energy Redundancy Phase I');
  const [cipHistoricalExpenditure, setCipHistoricalExpenditure] = useState(4500000);
  const [newCipTaskAmount, setNewCipTaskAmount] = useState(150000);
  const [selectedCipToCapitalize, setSelectedCipToCapitalize] = useState('FA-2026-609');

  // Asset Transfer wizard
  const [transferAssetId, setTransferAssetId] = useState('FA-2026-004');
  const [transferTargetBranch, setTransferTargetBranch] = useState('Addis Ababa Head Branch');
  const [transferTargetDept, setTransferTargetDept] = useState('Executive Administration');
  const [transferTargetCC, setTransferTargetCC] = useState('CC-ADMIN-HQ');
  const [transferReason, setTransferReason] = useState('Asset redeployment for regional logistics expansion.');
  const [transferApprover, setTransferApprover] = useState('Abebe Demeke');

  // IFRS 16 Lease liability Calculator
  const [leaseTermMonths, setLeaseTermMonths] = useState(36);
  const [monthlyLeasePayment, setMonthlyLeasePayment] = useState(55000);
  const [incrementalBorrowingRate, setIncrementalBorrowingRate] = useState(12); // annual IBR %

  const selectedAssetForTransfer = assets.find(a => a.id === transferAssetId) || assets[0];

  // Calculations for Lease Liabilities ROUs (Compounding NPV)
  const annualRate = incrementalBorrowingRate / 100;
  const monthlyRate = annualRate / 12;
  const presentValueROU = monthlyRate > 0 
    ? monthlyLeasePayment * ((1 - Math.pow(1 + monthlyRate, -leaseTermMonths)) / monthlyRate)
    : monthlyLeasePayment * leaseTermMonths;

  // Capitalize Trigger
  const handleExecuteCapitalization = () => {
    if (!capAssetName.trim()) {
      alert('Asset description is required');
      return;
    }
    const assetTag = `FA-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAsset = {
      id: assetTag,
      name: capAssetName,
      assetClass: capAssetClass,
      groupCode: 'MACH-HVY-101',
      category: 'Capitalized AP Voucher Onboarding',
      acquisitionDate: '2026-06-15',
      acquisitionCost: rawCapitalBase,
      currency: 'ETB',
      exchangeRate: 1.0,
      usefulLifeYears: 10,
      residualValue: Math.round(rawCapitalBase * 0.05),
      depreciationBook: 'All Books' as const,
      depreciationMethod: 'Straight Line' as const,
      branch: 'Addis Ababa Head Branch',
      department: 'Milling & Metal Production',
      costCenter: 'CC-PROD-M1',
      project: 'None',
      custodian: 'Martha Hailu',
      location: 'Hawassa Site B3',
      condition: 'New' as const,
      status: 'In Service' as const,
      accumulatedDepreciation: 0,
      impairmentAccumulated: 0,
      revaluationSurplus: 0,
      depreciationPostedPeriods: 0,
      history: [
        `2026-06-15: Capitalized from ${capSource} Source. Reference: ${invoiceRef}. AP Reconciled: ${reconcileGL}`
      ]
    };
    onAddAsset(newAsset);
    alert(`Success: Asset capitalized. Subledger created with asset tag: ${assetTag}`);
    onNavigatePage('asset-list');
  };

  // Transfer Trigger
  const handleExecuteTransfer = () => {
    alert(`Success: Initiated transfer request WRK-TR-${~~(Math.random()*1000)} for ${transferAssetId}. State changed to pending authorization by ${transferApprover}.`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6" id="fam-operations-suite">
      
      {/* OPERATIONS HEADER BANNER */}
      <div className="flex justify-between items-center border-b border-slate-150 pb-4">
        <div>
          <span className="text-[10px] bg-slate-905 bg-slate-900 text-white font-mono font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
            TRANS-ENGINE PRO-v1.4
          </span>
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-1.5 font-sans">
            <Coins className="w-5 h-5 text-indigo-650" />
            <span>Core Fixed Asset Transactions Workspace</span>
          </h2>
        </div>
      </div>

      {/* HORIZONTAL OPERATIONS SUBMENU BAR */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-150 pb-3 text-xs font-mono font-black uppercase tracking-wider">
        <button 
          onClick={() => setActiveOpsSubTab('capitalization')}
          className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
            activeOpsSubTab === 'capitalization' 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <HardDriveUpload className="w-3.5 h-3.5" />
          <span>Asset Capitalization (AP/INV)</span>
        </button>

        <button 
          onClick={() => setActiveOpsSubTab('cip')}
          className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
            activeOpsSubTab === 'cip' 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Capital Work in Progress (CIP)</span>
        </button>

        <button 
          onClick={() => setActiveOpsSubTab('transfer')}
          className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
            activeOpsSubTab === 'transfer' 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Asset Transfer Wizard</span>
        </button>

        <button 
          onClick={() => setActiveOpsSubTab('leases')}
          className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
            activeOpsSubTab === 'leases' 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Leases & IFRS 16 Schedule</span>
        </button>
      </div>

      {/* OPERATIONS VIEW CONTENT PANELS */}

      {/* 1. CAPITALIZATION FROM OTHER MODULES */}
      {activeOpsSubTab === 'capitalization' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/50 p-4 border border-indigo-150 rounded-xl space-y-2.5">
            <span className="text-[10px] font-mono font-black text-indigo-755 uppercase tracking-wider block">Capitalize Assets from Source Ledgers</span>
            <p className="text-xs text-indigo-900 leading-normal font-sans">
              Accelerate capitalization flows directly from AP Suppliers Bills of Lading, physical raw materials reserves or development project ledgers. Bridges subledger directly inside primary statetments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Form Side */}
            <div className="space-y-4 font-sans text-xs">
              
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Capitalization Source</label>
                  <select 
                    value={capSource} 
                    onChange={(e) => setCapSource(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold mt-1"
                  >
                    <option value="AP">Capitalize from Accounts Payable Invoice</option>
                    <option value="Inventory">Capitalize from Store Inventory Item</option>
                    <option value="CIP">Capitalize from existing CIP project</option>
                    <option value="Project">Capitalize from R&D Development Project</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Source Invoice Ref *</label>
                  <input 
                    type="text"
                    value={invoiceRef}
                    onChange={(e) => setInvoiceRef(e.target.value)}
                    className="w-full border border-slate-205 rounded-lg p-2 font-mono mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Supplier Vendor Code</label>
                  <input 
                    type="text"
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase font-mono">Invoice Capital Base Value (ETB)</label>
                  <input 
                    type="number"
                    value={rawCapitalBase}
                    onChange={(e) => setRawCapitalBase(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-mono font-black text-slate-850 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Capitalized Asset Class</label>
                  <select 
                    value={capAssetClass}
                    onChange={(e) => setCapAssetClass(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold mt-1"
                  >
                    <option value="Machinery">Machinery & Plant Fittings</option>
                    <option value="Vehicles">Fleets and Delivery Haulers</option>
                    <option value="IT">IT Hardware Clusters</option>
                    <option value="Furniture">Fixtures & Desk furniture</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase font-mono">Asset Master Label *</label>
                  <input 
                    type="text"
                    value={capAssetName}
                    onChange={(e) => setCapAssetName(e.target.value)}
                    placeholder="e.g. Caterpillar Diesel Excavator"
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] uppercase font-black text-slate-600">
                <input 
                  type="checkbox"
                  checked={reconcileGL}
                  onChange={(e) => setReconcileGL(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <span>Automatically write back double entry voucher to primary General Ledger</span>
              </div>

              <button
                type="button"
                onClick={handleExecuteCapitalization}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase py-3 rounded-lg cursor-pointer tracking-wider flex justify-center items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Execute Capitalization Ledger Allocation</span>
              </button>

            </div>

            {/* D365 journal preview side */}
            <div className="bg-slate-900 border border-slate-950 rounded-2xl p-5 text-slate-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                  <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest">General Ledger Voucher Preview</span>
                  <span className="text-[8.5px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">BALANCED JOURNAL</span>
                </div>

                <div className="space-y-2.5 font-mono text-[11px]">
                  
                  {/* Row Debit */}
                  <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold block uppercase text-[8px] tracking-wider leading-none">DEBIT account</span>
                      <span className="text-slate-300 font-extrabold block mt-1">1605 Property, Factory & Machinery</span>
                      <span className="text-[9.5px] font-sans text-slate-500">Asset Cost Class Subledger</span>
                    </div>
                    <span className="font-extrabold text-white text-xs self-center">+{rawCapitalBase.toLocaleString()} ETB</span>
                  </div>

                  {/* Row Credit */}
                  <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex justify-between">
                    <div>
                      <span className="text-rose-450 text-rose-400 font-bold block uppercase text-[8px] tracking-wider leading-none">CREDIT account</span>
                      <span className="text-slate-250 font-extrabold block mt-1">
                        {capSource === 'AP' ? '2110 Accounts Payable clearing' : '1501 Raw Materials clearing'}
                      </span>
                      <span className="text-[9.5px] font-sans text-slate-500">GL Source Reconciliation Map</span>
                    </div>
                    <span className="font-extrabold text-white text-xs self-center">-{rawCapitalBase.toLocaleString()} ETB</span>
                  </div>

                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 text-[10.5px] leading-relaxed font-sans text-slate-400 mt-4">
                This transaction adjusts subledger balances under GAAP/IFRS standards, moving the raw inventory capital base directly into the depreciable Property, Plant & Equipment ledger balance asset pool.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. CIP WORK IN PROGRESS */}
      {activeOpsSubTab === 'cip' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="text-xs leading-relaxed font-sans font-medium">
              <strong>Capital Under Construction Assets (IAS 16 CIP):</strong> General rules state construction in progress cannot depreciate. Once build tasks finalize, use this tool to compile, liquidate and capitalize CIP ledger shells.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CIP Dashboard card */}
            <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80 space-y-4">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">CIP Register</span>
              
              <div className="bg-white border rounded-xl p-3.5 flex justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-800 font-serif italic block">Active Shell: FA-2026-609</span>
                  <span className="text-[10px] text-slate-450 font-mono block mt-0.5">Project: {cipProjectName}</span>
                </div>
                <span className="font-mono font-black text-indigo-700 text-xs mt-1 bg-indigo-50 px-2 py-0.5 rounded self-start">
                  {cipHistoricalExpenditure.toLocaleString()} ETB
                </span>
              </div>

              {/* Incremental Exp Form */}
              <div className="space-y-3 pt-2 text-xs font-sans">
                <div>
                  <label className="text-[9.5px] font-mono text-slate-550 block font-bold">Add Capital Build Cost to CIP Pool</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="number"
                      value={newCipTaskAmount}
                      onChange={(e) => setNewCipTaskAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-202 rounded-lg p-2 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCipHistoricalExpenditure(prev => prev + newCipTaskAmount);
                        alert(`Successfully loaded ${newCipTaskAmount.toLocaleString()} ETB structural costs into asset development shell FA-2026-609.`);
                      }}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white font-mono text-[9px] font-black uppercase px-4 py-2 rounded-lg cursor-pointer shrink-0"
                    >
                      POST TO CIP
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Capitalize Transfer Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-205 space-y-4 text-xs font-sans">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">CIP Transfer Capitalized Registry</span>
              
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-slate-600 block">Deploy finished CIP asset block to active service</label>
                <select 
                  value={selectedCipToCapitalize}
                  onChange={(e) => setSelectedCipToCapitalize(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono font-bold"
                >
                  <option value="FA-2026-609">FA-2026-609 | Industrial Caterpillar Generator (4.5M ETB)</option>
                </select>
              </div>

              <div className="bg-indigo-50/40 p-3 rounded-lg border text-[11px] leading-relaxed text-indigo-900 border-indigo-150">
                <strong>Acceptance Signoff:</strong> Capitalization moves the cumulative development budget of <strong>{cipHistoricalExpenditure.toLocaleString()} ETB</strong> out of ledger asset key <i>1501 Construction-in-Progress</i> directly into depreciable plant <i>1605 Property Equipment</i>.
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(`Success: Certified engineering commissioning certificate signed. CIP Asset FA-2026-609 is now capitalized at final cost bases of ${cipHistoricalExpenditure.toLocaleString()} ETB. Double entry journals posted to primarystatements.`);
                }}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase py-2.5 rounded-lg text-center cursor-pointer tracking-wider"
              >
                Sign Commissioning & Capitalize
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ASSET TRANSFER WIZARD */}
      {activeOpsSubTab === 'transfer' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Transfer Fields */}
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Select Asset to relocate</label>
                <select 
                  value={transferAssetId}
                  onChange={(e) => setTransferAssetId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono font-extrabold"
                >
                  {assets.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name.substring(0, 42)}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9.5px] font-mono text-slate-500 block">Target Branch</label>
                  <select 
                    value={transferTargetBranch}
                    onChange={(e) => setTransferTargetBranch(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    <option value="Addis Ababa Head Branch">Addis Ababa HQ</option>
                    <option value="Hawassa Regional Hub">Hawassa Hub</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-mono text-slate-500 block">Target Dept</label>
                  <select 
                    value={transferTargetDept}
                    onChange={(e) => setTransferTargetDept(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    <option value="Executive Administration">Administration</option>
                    <option value="Supply Chain Operations">Supply chain</option>
                    <option value="IT & Digital Enablement">Digital IT</option>
                    <option value="Milling & Metal Production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-mono text-slate-500 block">Target Cost Center</label>
                  <select 
                    value={transferTargetCC}
                    onChange={(e) => setTransferTargetCC(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-mono font-bold"
                  >
                    <option value="CC-ADMIN-HQ">CC-ADMIN-HQ</option>
                    <option value="CC-LOG-HW">CC-LOG-HW</option>
                    <option value="CC-IT-SERVS">CC-IT-SERVS</option>
                    <option value="CC-PROD-M1">CC-PROD-M1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Authorizing Officer (SoD rule limit)</label>
                <input 
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                  placeholder="Justification notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-mono text-slate-500 block">Approving Admin Comptroller</label>
                  <select 
                    value={transferApprover}
                    onChange={(e) => setTransferApprover(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-bold"
                  >
                    <option value="Abebe Demeke">Abebe Demeke (GFO)</option>
                    <option value="Solomon Tesfaye">Solomon Tesfaye (Internal Audit)</option>
                  </select>
                </div>
                <div className="pt-5 shrink-0">
                  <button
                    type="button"
                    onClick={handleExecuteTransfer}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase py-2.5 rounded-lg text-center cursor-pointer tracking-wider"
                  >
                    Dispatch Transfer
                  </button>
                </div>
              </div>

            </div>

            {/* Current details display */}
            <div className="bg-slate-50 rounded-2xl border p-5 flex flex-col justify-between text-xs space-y-4">
              <div>
                <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-widest block pb-2 border-b">Active Subledger Location State</span>
                {selectedAssetForTransfer ? (
                  <div className="mt-3.5 space-y-2.5">
                    <p className="font-serif italic font-extrabold text-slate-800 text-sm leading-tight">{selectedAssetForTransfer.name}</p>
                    <p className="font-mono text-slate-505">Tag Ref: <strong>{selectedAssetForTransfer.id}</strong></p>
                    <div className="divide-y divide-slate-100 bg-white p-3 border rounded-xl font-mono text-[10px]">
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Current cost center:</span>
                        <span className="font-black text-slate-900">{selectedAssetForTransfer.costCenter}</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Current branch:</span>
                        <span className="font-black text-slate-900">{selectedAssetForTransfer.branch}</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Current department:</span>
                        <span className="font-bold text-slate-900">{selectedAssetForTransfer.department}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic mt-3">Select asset class registry card above for transfer analysis.</p>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border text-[10.5px] leading-relaxed text-amber-900 border-amber-200">
                <strong>SoD Control:</strong> Asset transfers require dual validation signatures. Moving between branches triggers automatic updates to geographic location tags inside physical verification sub-registers.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. LEASE INVENTORY AND IFRS 16 CALCULATOR */}
      {activeOpsSubTab === 'leases' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4.5 rounded-xl flex items-center gap-3">
            <Database className="w-5 h-5 text-indigo-700 shrink-0" />
            <p className="text-xs leading-relaxed font-sans font-medium">
              <strong>Right-of-Use Asset Recognition (IFRS 16):</strong> Leases must be capitalized as Right-of-Use (ROU) assets on the Balance Sheet, with an offset lease liability based on the present value of future lease rents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Calculator settings */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 text-xs font-sans">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block border-b pb-1.5">IFRS 16 Lease Capitaliser</span>
              
              <div className="space-y-1">
                <label className="text-[9.5px] font-mono text-slate-500 block font-bold">Lease Contract term (Months)</label>
                <input 
                  type="number"
                  value={leaseTermMonths}
                  onChange={(e) => setLeaseTermMonths(parseInt(e.target.value) || 12)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg font-mono font-bold"
                  min={1}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-mono text-slate-500 block font-bold">Monthly Rent Payment (ETB)</label>
                <input 
                  type="number"
                  value={monthlyLeasePayment}
                  onChange={(e) => setMonthlyLeasePayment(parseFloat(e.target.value) || 1000)}
                  className="w-full bg-white border border-slate-202 p-2 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-mono text-slate-500 block font-bold">Incremental Annual Borrowing Rate (IBR %)</label>
                <input 
                  type="number"
                  value={incrementalBorrowingRate}
                  onChange={(e) => setIncrementalBorrowingRate(parseFloat(e.target.value) || 12)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-lg font-mono font-bold font-black"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const assetTag = `FA-LE-2026-${Math.floor(100 + Math.random()*900)}`;
                  const draftLeaseAsset = {
                    id: assetTag,
                    name: 'ROU Right-of-Use Office Suite Building Bole Code-1',
                    assetClass: 'Land' as const,
                    groupCode: 'PROP-RE-909',
                    category: 'IFRS 16 Leasehold Capital',
                    acquisitionDate: '2026-06-15',
                    acquisitionCost: Math.round(presentValueROU),
                    currency: 'ETB',
                    exchangeRate: 1.0,
                    usefulLifeYears: Math.ceil(leaseTermMonths / 12),
                    residualValue: 0,
                    depreciationBook: 'IFRS' as const,
                    depreciationMethod: 'Straight Line' as const,
                    branch: 'Addis Ababa Head Branch',
                    department: 'Executive Administration',
                    costCenter: 'CC-ADMIN-HQ',
                    project: 'None',
                    custodian: 'Abebe Demeke',
                    location: 'Bole Road Office Block B',
                    condition: 'Good' as const,
                    status: 'In Service' as const,
                    accumulatedDepreciation: 0,
                    impairmentAccumulated: 0,
                    revaluationSurplus: 0,
                    depreciationPostedPeriods: 0,
                    history: [
                      `2026-06-15: Capitalized Right-of-Use Asset PV valuation under IFRS 16 rules. Terminal Lease Base Cost: ${Math.round(presentValueROU).toLocaleString()} ETB.`
                    ]
                  };
                  onAddAsset(draftLeaseAsset);
                  alert(`Success: Created and registered Right-of-Use Leasehold subledger card with tag ID: ${assetTag}`);
                  onNavigatePage('asset-list');
                }}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-mono font-black text-xs uppercase py-2.5 rounded-lg text-center cursor-pointer tracking-wider"
              >
                Capitalize Leasehold & Post ROU Asset
              </button>
            </div>

            {/* Calculations results block */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-950 flex flex-col justify-between text-xs space-y-4">
              <div className="space-y-4">
                <span className="text-[9.5px] font-mono font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-800 pb-2">ROU & Lease Liability Amortisation schedule</span>
                
                <div className="divide-y divide-slate-800 font-mono">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-450 uppercase text-[9px] leading-none block self-center">ROU Asset Base (Capitalised cost)</span>
                    <span className="text-emerald-450 font-black text-sm text-emerald-400">{Math.round(presentValueROU).toLocaleString()} ETB</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-450 uppercase text-[9px] leading-none block self-center">Implicit Monthly rates</span>
                    <span className="text-slate-200 mt-1 font-extrabold">{(monthlyRate * 100).toFixed(4)} % / Month</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-450 uppercase text-[9px] leading-none block self-center">Total contract Rent outlay</span>
                    <span className="text-slate-300 mt-1 font-bold">{(monthlyLeasePayment * leaseTermMonths).toLocaleString()} ETB</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-450 uppercase text-[9px] leading-none block self-center">Imputed Interest Expense</span>
                    <span className="text-rose-400 mt-1 font-black">{Math.round((monthlyLeasePayment * leaseTermMonths) - presentValueROU).toLocaleString()} ETB</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 text-[10.5px] leading-relaxed text-slate-400 font-sans">
                <strong>Schedule Output:</strong> Amortization processes monthly straight-line depreciation of the capitalized ROU asset, while lease liability balance declines using interest-method amortization.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

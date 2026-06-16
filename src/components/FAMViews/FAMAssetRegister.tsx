import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  HelpCircle, 
  Layers, 
  Activity, 
  ShieldCheck, 
  FileSpreadsheet, 
  Paperclip, 
  PlusCircle, 
  FileText, 
  Bookmark, 
  Grid, 
  MapPin, 
  UserCheck, 
  RotateCw,
  Info,
  TrendingDown,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Lock,
  Coins,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
  Undo2
} from 'lucide-react';
import { Asset } from '../FixedAssetsTab';

interface FAMAssetRegisterProps {
  selectedAsset?: Asset | null;
  onAddAsset: (newAsset: any) => void;
  onUpdateAssetStatus?: (id: string, updates: any) => void;
  onNavigatePage: (page: string) => void;
}

export default function FAMAssetRegister({ 
  selectedAsset = null, 
  onAddAsset, 
  onUpdateAssetStatus, 
  onNavigatePage 
}: FAMAssetRegisterProps) {
  
  const isEditing = !!selectedAsset;

  // Active onboarding step / form section 
  const [activeFormTab, setActiveFormTab] = useState<'core' | 'accounting' | 'auxiliary' | 'attachments'>('core');

  // Basic Information State
  const [name, setName] = useState('');
  const [assetClass, setAssetClass] = useState<'Land' | 'Machinery' | 'IT' | 'Vehicles' | 'Furniture' | 'CIP'>('Machinery');
  const [groupCode, setGroupCode] = useState('MACH-HVY-101');
  const [category, setCategory] = useState('Industrial Plant Equipment');
  const [assetType, setAssetType] = useState('Operative PP&E');
  
  // Acquisition Data
  const [acquisitionDate, setAcquisitionDate] = useState('2026-06-15');
  const [acquisitionCost, setAcquisitionCost] = useState(1500000);
  const [currency, setCurrency] = useState('ETB');
  const [exchangeRate, setExchangeRate] = useState(1.0);
  const [vendor, setVendor] = useState('AMCE Industrial Vehicles Share Co.');
  const [manufacturer, setManufacturer] = useState('Caterpillar Inc.');
  const [model, setModel] = useState('CAT-505-S');
  const [acquisitionType, setAcquisitionType] = useState('Purchase');

  // Accounting / Depreciation
  const [depreciationBook, setDepreciationBook] = useState<'IFRS' | 'Tax' | 'Management' | 'All Books'>('All Books');
  const [depreciationMethod, setDepreciationMethod] = useState<'Straight Line' | 'Reducing Balance' | 'Manual'>('Straight Line');
  const [usefulLifeYears, setUsefulLifeYears] = useState(10);
  const [residualValue, setResidualValue] = useState(75000); // 5% base salvage
  const [deprFrequency, setDeprFrequency] = useState('Monthly');
  const [ownershipType, setOwnershipType] = useState('Owned');
  const [postingProfile, setPostingProfile] = useState('PP-MACH-01');

  // Location / Custody
  const [company, setCompany] = useState('Mesfin Industrial Engineering (MIE)');
  const [branch, setBranch] = useState('Addis Ababa Head Branch');
  const [department, setDepartment] = useState('Milling & Metal Production');
  const [costCenter, setCostCenter] = useState('CC-PROD-M1');
  const [project, setProject] = useState('Cen-East Factory Upgrade');
  const [warehouse, setWarehouse] = useState('Addis Hub Store C');
  const [location, setLocation] = useState('Hawassa Factory Site Floor B');
  const [custodian, setCustodian] = useState('Wolde Giorgis');

  // Insurance & Warranty
  const [insuranceProvider, setInsuranceProvider] = useState('Nyangas Insurance Corp');
  const [insuranceStatus, setInsuranceStatus] = useState('Active');
  const [warrantyStatus, setWarrantyStatus] = useState('Under Warranty');

  // Attachments & State
  const [attachments, setAttachments] = useState<string[]>([
    'Customs Clearance Declaration 12-B.pdf',
    'Bill of Lading Freight-4903.pdf'
  ]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newComment, setNewComment] = useState('Onboarding review initiated by project superintendent.');
  const [validationError, setValidationError] = useState('');

  // Prefill Form for Editing Mode
  useEffect(() => {
    if (selectedAsset) {
      setName(selectedAsset.name || '');
      setAssetClass(selectedAsset.assetClass || 'Machinery');
      setGroupCode(selectedAsset.groupCode || '');
      setCategory(selectedAsset.category || '');
      setAcquisitionDate(selectedAsset.acquisitionDate || '');
      setAcquisitionCost(selectedAsset.acquisitionCost || 0);
      setCurrency(selectedAsset.currency || 'ETB');
      setExchangeRate(selectedAsset.exchangeRate || 1.0);
      setDepreciationBook(selectedAsset.depreciationBook || 'All Books');
      setDepreciationMethod(selectedAsset.depreciationMethod || 'Straight Line');
      setUsefulLifeYears(selectedAsset.usefulLifeYears || 5);
      setResidualValue(selectedAsset.residualValue || 0);
      setBranch(selectedAsset.branch || '');
      setDepartment(selectedAsset.department || '');
      setCostCenter(selectedAsset.costCenter || '');
      setProject(selectedAsset.project || '');
      setCustodian(selectedAsset.custodian || '');
      setLocation(selectedAsset.location || '');
      if (selectedAsset.history && selectedAsset.history.length > 0) {
        setNewComment(selectedAsset.history[0]);
      }
    }
  }, [selectedAsset]);

  // Quick sandbox helper to pre-fill test asset
  const handlePrefillSandbox = (modelType: 'machinery' | 'server' | 'vehicle') => {
    if (modelType === 'machinery') {
      setName('Siemens S7 Heavy Heavy Industrial Boiler');
      setAssetClass('Machinery');
      setGroupCode('MACH-HVY-101');
      setCategory('Industrial Plant Heavy Machinery');
      setAcquisitionCost(4800000);
      setUsefulLifeYears(12);
      setResidualValue(240000);
      setDepartment('Milling & Metal Production');
      setCostCenter('CC-PROD-M1');
      setLocation('Hawassa Factory Site Compound C');
      setCustodian('Engineer Solomon');
    } else if (modelType === 'server') {
      setName('HP ProLiant Enterprise Server Stack 2026');
      setAssetClass('IT');
      setGroupCode('COMP-SERV-IT5');
      setCategory('High Performance Computer Hardware');
      setAcquisitionCost(640000);
      setUsefulLifeYears(4);
      setResidualValue(20000);
      setDepartment('IT & Digital Enablement');
      setCostCenter('CC-IT-SERVS');
      setLocation('HQ Server Room Bed 12');
      setCustodian('Martha Hailu');
    } else {
      setName('Toyota Land Cruiser Prado Patrol Fleet v8');
      setAssetClass('Vehicles');
      setGroupCode('VEH-DIST-440');
      setCategory('Executive Field Transport');
      setAcquisitionCost(3200000);
      setUsefulLifeYears(6);
      setResidualValue(150000);
      setDepartment('Executive Administration');
      setCostCenter('CC-ADMIN-HQ');
      setLocation('HQ Executive Staff Yard');
      setCustodian('Abebe Demeke');
    }
  };

  const handleAddNewAttachment = () => {
    if (newAttachmentName.trim()) {
      setAttachments([...attachments, newAttachmentName.trim()]);
      setNewAttachmentName('');
    }
  };

  // Rule Warnings
  const valCostTooLow = acquisitionCost < 10000;
  const valResidualTooHigh = residualValue > (acquisitionCost * 0.1);
  
  // Useful Life Recommendations
  let recommendedLifeMin = 5;
  let recommendedLifeMax = 10;
  if (assetClass === 'IT') { recommendedLifeMin = 3; recommendedLifeMax = 5; }
  else if (assetClass === 'Machinery') { recommendedLifeMin = 8; recommendedLifeMax = 15; }
  else if (assetClass === 'Vehicles') { recommendedLifeMin = 5; recommendedLifeMax = 10; }
  else if (assetClass === 'Land') { recommendedLifeMin = 30; recommendedLifeMax = 50; }
  else if (assetClass === 'Furniture') { recommendedLifeMin = 5; recommendedLifeMax = 8; }

  const lifeOutsideGuidelines = usefulLifeYears < recommendedLifeMin || usefulLifeYears > recommendedLifeMax;

  // Compute live comparative curves for straight line vs reducing balance over continuous years
  const trajectoryYears = Array.from({ length: usefulLifeYears ? Math.min(25, usefulLifeYears + 1) : 6 }, (_, i) => i);
  const slValues: number[] = [];
  const rbValues: number[] = [];

  const slAnnual = usefulLifeYears > 0 ? (acquisitionCost - residualValue) / usefulLifeYears : 0;
  // Reducing Balance with realistic declining balance factor
  const ddbRate = usefulLifeYears > 0 ? 1.5 / usefulLifeYears : 0.20; 

  let rbRunningVal = acquisitionCost;
  for (let y = 0; y < trajectoryYears.length; y++) {
    const slVal = Math.max(residualValue, Math.round(acquisitionCost - y * slAnnual));
    slValues.push(slVal);

    if (y === 0) {
      rbValues.push(acquisitionCost);
    } else {
      const depr = rbRunningVal * ddbRate;
      rbRunningVal = Math.max(residualValue, rbRunningVal - depr);
      rbValues.push(Math.round(rbRunningVal));
    }
  }

  // Double entry calculation
  const debitAccountName = assetClass === 'Land' ? '1501 Freehold Commercial Land' :
                           assetClass === 'Machinery' ? '1605 Property, Factory & Machinery' :
                           assetClass === 'IT' ? '1610 High-Tech Hardware Assets' :
                           assetClass === 'Vehicles' ? '1612 Logistical Transport Fleets' :
                           '1620 General Business Fixtures';

  const creditAccountName = acquisitionType === 'Lease' ? '2205 lease liabilities (IFRS 16)' : '1699 AP Subledger Clearing Account';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation blocks
    if (!name.trim()) {
      setValidationError('Asset Name is an absolute requirement.');
      setActiveFormTab('core');
      return;
    }
    if (acquisitionCost <= 0) {
      setValidationError('Acquisition Cost must possess positive numerical value.');
      setActiveFormTab('accounting');
      return;
    }
    if (residualValue < 0) {
      setValidationError('Residual Salvage cannot be a negative value.');
      setActiveFormTab('accounting');
      return;
    }

    setValidationError('');

    if (isEditing && onUpdateAssetStatus) {
      onUpdateAssetStatus(selectedAsset.id, {
        name: name.trim(),
        assetClass,
        groupCode,
        category,
        acquisitionDate,
        acquisitionCost,
        currency,
        exchangeRate,
        usefulLifeYears,
        residualValue,
        depreciationBook,
        depreciationMethod,
        branch,
        department,
        costCenter,
        project,
        custodian,
        location,
        history: [
          ...selectedAsset.history,
          `${new Date().toISOString().split('T')[0]}: Modified master specifications during onboarding audit. Core bases re-verified.`
        ]
      });
      onNavigatePage('asset-list');
    } else {
      const draftId = `FA-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newAsset = {
        id: draftId,
        name: name.trim(),
        assetClass,
        groupCode,
        category,
        acquisitionDate,
        acquisitionCost,
        currency,
        exchangeRate,
        usefulLifeYears,
        residualValue,
        depreciationBook,
        depreciationMethod,
        branch,
        department,
        costCenter,
        project,
        custodian,
        location,
        condition: 'New' as const,
        status: (assetClass === 'CIP' ? 'Under Construction' : 'Draft') as any,
        accumulatedDepreciation: 0,
        impairmentAccumulated: 0,
        revaluationSurplus: 0,
        depreciationPostedPeriods: 0,
        history: [
          `${new Date().toISOString().split('T')[0]}: Spawned initialized asset envelope. Managed by ${custodian}. Note: ${newComment}`
        ]
      };

      onAddAsset(newAsset);
      onNavigatePage('asset-list');
    }
  };

  return (
    <div className="space-y-6 font-sans" id="fam-asset-register-workdesk">
      
      {/* HEADER CONTROLS Banner */}
      <div className="bg-white border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9.5px] bg-slate-900 text-slate-100 font-mono font-black px-2 py-0.5 rounded tracking-wider uppercase">
            {isEditing ? `Onboarding Audit Terminal • ${selectedAsset?.id}` : 'IAS 16 Asset Registry Workstation'}
          </span>
          <h2 className="text-base font-black text-slate-900 uppercase mt-1.5 flex items-center gap-2">
            <ClipboardCheck className="w-5.5 h-5.5 text-indigo-650" />
            <span>{isEditing ? 'Modify Active Capital Asset Base' : 'Register & Classify Capital Assets'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Builds multi-book regulatory asset shells. Updates amortized profiles dynamically under ERCA Directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <div className="hidden sm:flex p-1 bg-slate-100 rounded-lg gap-1 border">
              <span className="text-[9px] font-mono uppercase font-black text-slate-450 self-center px-1.5">Pre-fill Sandbox:</span>
              <button onClick={() => handlePrefillSandbox('machinery')} className="bg-white hover:bg-slate-50 border p-1 rounded font-mono text-[9.5px] font-bold text-slate-700 cursor-pointer">Heavy Boiler</button>
              <button onClick={() => handlePrefillSandbox('server')} className="bg-white hover:bg-slate-50 border p-1 rounded font-mono text-[9.5px] font-bold text-slate-700 cursor-pointer">Enterprise rack</button>
              <button onClick={() => handlePrefillSandbox('vehicle')} className="bg-white hover:bg-slate-50 border p-1 rounded font-mono text-[9.5px] font-bold text-slate-700 cursor-pointer">Fleet car</button>
            </div>
          )}
          <button 
            type="button"
            onClick={() => onNavigatePage('asset-list')}
            className="bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* DUAL COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: GUIDED FORMS (collapsible tab-panels) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          
          {/* STEPPER NAV BAR */}
          <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 border rounded-xl justify-between">
            {[
              { id: 'core', label: '1. Identity', tip: 'Identification fields' },
              { id: 'accounting', label: '2. Valuation', tip: 'Depreciation rules' },
              { id: 'auxiliary', label: '3. Physical', tip: 'Branch & Custody' },
              { id: 'attachments', label: '4. Compliance', tip: 'Documents checklist' }
            ].map(tab => (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveFormTab(tab.id as any)}
                className={`flex-1 text-center py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer font-sans ${
                  activeFormTab === tab.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {validationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-850 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
              <span>Form error: {validationError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            {/* PANEL 1: IDENTITY & CLASSIFICATION */}
            {activeFormTab === 'core' && (
              <div className="space-y-4">
                <span className="block text-[10.5px] font-mono font-black text-slate-450 uppercase tracking-widest pb-1 border-b">
                  Asset Identity and Regulatory Class
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Dynamic Asset Name *</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Caterpillar Diesel Excavator XL"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/20"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Asset Class Category *</label>
                    <select 
                      value={assetClass}
                      onChange={(e) => {
                        const nextClass = e.target.value as any;
                        setAssetClass(nextClass);
                        if (nextClass === 'IT') {
                          setGroupCode('COMP-SERV-IT5');
                          setCategory('High Performance Computer Hardware');
                          setUsefulLifeYears(4);
                          setPostingProfile('PP-IT-02');
                        } else if (nextClass === 'Vehicles') {
                          setGroupCode('VEH-DIST-440');
                          setCategory('Commercial Cargo Transport Fleet');
                          setUsefulLifeYears(5);
                          setPostingProfile('PP-VH-10');
                        } else if (nextClass === 'Land') {
                          setGroupCode('PROP-RE-909');
                          setCategory('Commercial Real Estate Properties');
                          setUsefulLifeYears(40);
                          setPostingProfile('PP-PROP-01');
                        } else {
                          setGroupCode('MACH-HVY-101');
                          setCategory('Industrial Plant Heavy Machinery');
                          setUsefulLifeYears(10);
                          setPostingProfile('PP-MACH-01');
                        }
                      }}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold bg-white"
                    >
                      <option value="Machinery">Machinery (Industrial Spec)</option>
                      <option value="IT">IT Hardware & Computing</option>
                      <option value="Vehicles">Fleets & Heavy Haulers</option>
                      <option value="Furniture">Fixtures & Business Furniture</option>
                      <option value="Land">Commercial Buildings & Land</option>
                      <option value="CIP">Capital Work-in-Progress (CIP)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Specific Group Code</label>
                    <input 
                      type="text"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Internal Asset Type ID</label>
                    <input 
                      type="text"
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>

                {/* Manufacturer subledger block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
                  <span className="text-[9px] font-mono font-black text-slate-450 uppercase tracking-widest block">Manufacturer Specifications</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[9.5px] font-mono text-slate-500 block leading-none">Manufacturer</label>
                      <input 
                        type="text"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        className="w-full bg-white border rounded-md p-1.5 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-mono text-slate-500 block leading-none">Model Reference</label>
                      <input 
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-white border rounded-md p-1.5 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-mono text-slate-500 block leading-none">Acquisition Type</label>
                      <select 
                        value={acquisitionType} 
                        onChange={(e) => setAcquisitionType(e.target.value)}
                        className="w-full bg-white border rounded border-slate-200 p-1.5 text-xs mt-1 font-semibold"
                      >
                        <option value="Purchase">Direct Purchase</option>
                        <option value="Lease">IFRS 16 Leasehold</option>
                        <option value="CIP Transfer">CIP Capital Transfer</option>
                        <option value="Gift">Grants & Off-exchange</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step Forward buttons */}
                <div className="pt-2 flex justify-between">
                  <span className="text-[10.5px] text-slate-400 self-center font-mono">Step 1 of 4 COMPLETE</span>
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('accounting')}
                    className="bg-slate-900 text-white font-mono text-[10px] font-black uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-950"
                  >
                    <span>Valuation parameters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* PANEL 2: ACCOUNTING & VALUATION BASE */}
            {activeFormTab === 'accounting' && (
              <div className="space-y-4">
                <span className="block text-[10.5px] font-mono font-black text-slate-450 uppercase tracking-widest pb-1 border-b">
                  Corporate Finance and Depreciable Rules
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Acquisition Cost Basis *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] font-mono text-slate-400 font-extrabold">{currency}</span>
                      <input 
                        type="number"
                        value={acquisitionCost}
                        onChange={(e) => setAcquisitionCost(parseFloat(e.target.value) || 0)}
                        className={`w-full border rounded-lg p-2.5 pr-10 text-xs font-mono font-black outline-none ${
                          valCostTooLow ? 'border-rose-300 text-rose-900 bg-rose-50/20' : 'border-slate-200 text-slate-800'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Residual Salvage Value *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] font-mono text-slate-400 font-bold">{currency}</span>
                      <input 
                        type="number"
                        value={residualValue}
                        onChange={(e) => setResidualValue(parseFloat(e.target.value) || 0)}
                        className={`w-full border rounded-lg p-2.5 pr-10 text-xs font-mono font-black outline-none ${
                          valResidualTooHigh ? 'border-amber-300 text-amber-900 bg-amber-50/10' : 'border-slate-200'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 animate-pulse">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase text-indigo-700">Depreciable Base Cost</label>
                    <span className="block border border-indigo-150 bg-indigo-50/20 text-indigo-900 rounded-lg p-2.5 font-mono text-xs font-black">
                      {(acquisitionCost - residualValue).toLocaleString()} {currency}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Depreciation Method</label>
                    <select 
                      value={depreciationMethod}
                      onChange={(e) => setDepreciationMethod(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Straight Line">Straight Line (IAS 16)</option>
                      <option value="Reducing Balance">Reducing Balance (declining pool)</option>
                      <option value="Manual">Manual amortization tables</option>
                    </select>
                  </div>

                  <div className="space-y-1 font-mono">
                    <label className="text-[10px] font-mono font-black text-slate-550 block uppercase">Useful Life Limit (Years)</label>
                    <input 
                      type="number"
                      value={usefulLifeYears}
                      onChange={(e) => setUsefulLifeYears(parseInt(e.target.value) || 1)}
                      className={`w-full border rounded-lg p-2.5 text-xs font-black outline-none ${
                        lifeOutsideGuidelines ? 'border-amber-200' : 'border-slate-00'
                      }`}
                      min={1}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Multi-book Target Ledger</label>
                    <select 
                      value={depreciationBook}
                      onChange={(e) => setDepreciationBook(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold bg-white"
                    >
                      <option value="All Books">All Books Sync (IFRS & Tax)</option>
                      <option value="IFRS">IFRS Amortization Book Only</option>
                      <option value="Tax">Ethiopian ERCA Tax Book</option>
                    </select>
                  </div>
                </div>

                {/* GL posting rule assignment */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-205">
                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block">General Ledger Posting profile</label>
                    <select 
                      value={postingProfile}
                      onChange={(e) => setPostingProfile(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs font-semibold mt-1"
                    >
                      <option value="PP-MACH-01">PP-MACH-01 Heavy Rotary Kilns</option>
                      <option value="PP-VH-10">PP-VH-10 Commercial Fleets Allocation</option>
                      <option value="PP-IT-02">PP-IT-02 Tech Amortization Matrix</option>
                      <option value="PP-PROP-01">PP-PROP-01 Commercial Real Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block">Amortization Run Frequency</label>
                    <select 
                      value={deprFrequency}
                      onChange={(e) => setDeprFrequency(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs font-semibold mt-1"
                    >
                      <option value="Monthly">Monthly calculation runs</option>
                      <option value="Quarterly">Quarterly batch posts</option>
                      <option value="Annually">Annual closing cycle</option>
                    </select>
                  </div>
                </div>

                {/* Step controls */}
                <div className="pt-2 flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('core')}
                    className="text-slate-600 bg-slate-50 border p-2 rounded-lg font-mono text-[10px] font-black uppercase hover:bg-slate-100"
                  >
                    Back to Core
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('auxiliary')}
                    className="bg-slate-900 text-white font-mono text-[10px] font-black uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-950"
                  >
                    <span>Branch & Location</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* PANEL 3: PHYSICAL LOCATION & CUSTODIANSHIP */}
            {activeFormTab === 'auxiliary' && (
              <div className="space-y-4">
                <span className="block text-[10.5px] font-mono font-black text-slate-450 uppercase tracking-widest pb-1 border-b">
                  Physical Placement & Operational Cost Center
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Operational Department</label>
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold bg-white"
                    >
                      <option value="Milling & Metal Production">Milling & Metal Production</option>
                      <option value="IT & Digital Enablement">IT & Digital Enablement</option>
                      <option value="Supply Chain Operations">Supply Chain Operations</option>
                      <option value="Executive Administration">Executive Administration</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-550 block uppercase">Assigned Cost Center (GL-LINK)</label>
                    <select 
                      value={costCenter}
                      onChange={(e) => setCostCenter(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold font-mono bg-white"
                    >
                      <option value="CC-PROD-M1">CC-PROD-M1 Production Floor A</option>
                      <option value="CC-IT-SERVS">CC-IT-SERVS Datacenter 300</option>
                      <option value="CC-LOG-HW">CC-LOG-HW Logistics Hawassa</option>
                      <option value="CC-ADMIN-HQ">CC-ADMIN-HQ Executive Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Primary Custodian Officer</label>
                    <input 
                      type="text"
                      value={custodian}
                      onChange={(e) => setCustodian(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold bg-white"
                      placeholder="e.g. Solomon Hailu"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Associated Investment Project</label>
                    <select 
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold bg-white"
                    >
                      <option value="Cen-East Factory Upgrade">Cen-East Factory Upgrade</option>
                      <option value="Cloud Core Modernization">Cloud Core Modernization</option>
                      <option value="Mesfin HQ Infrastructure">Mesfin HQ Infrastructure</option>
                      <option value="None">None - Standard Operations</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono font-black text-slate-505 block uppercase">Exact Physical Address detail</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                    placeholder="e.g. Hawassa Central Factory Site, Block C, Room 22"
                  />
                </div>

                {/* Step controls */}
                <div className="pt-2 flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('accounting')}
                    className="text-slate-600 bg-slate-50 border p-2 rounded-lg font-mono text-[10px] font-black uppercase hover:bg-slate-100"
                  >
                    Back to Accounting
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('attachments')}
                    className="bg-slate-900 text-white font-mono text-[10px] font-black uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-950"
                  >
                    <span>Audit & Compliance docs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* PANEL 4: ATTACHMENTS & COMMENTS DESIGN */}
            {activeFormTab === 'attachments' && (
              <div className="space-y-4">
                <span className="block text-[10.5px] font-mono font-black text-slate-450 uppercase tracking-widest pb-1 border-b">
                  Corporate Document Verification checklist
                </span>

                <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <span className="text-[9.5px] font-mono font-bold text-slate-450 block uppercase tracking-wider leading-none">Compliance Attachments Upload Box</span>
                  
                  <div className="space-y-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white border p-3 rounded-xl shadow-3xs text-xs font-sans">
                        <span className="flex items-center gap-2 font-black text-slate-700">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>{file}</span>
                        </span>
                        <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-100 font-extrabold px-1.5 py-0.5 rounded text-indigo-750">CLEAR</span>
                      </div>
                    ))}
                  </div>

                  {/* Attachment input tool */}
                  <div className="flex gap-2 bg-white p-1 rounded-xl border">
                    <input 
                      type="text"
                      className="flex-1 text-xs border-0 outline-none pl-2 py-1 placeholder-slate-400 font-medium"
                      placeholder="e.g. Technicians Capitalization Certificate.pdf"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={handleAddNewAttachment}
                      className="bg-slate-900 hover:bg-slate-950 text-white font-mono text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                    >
                      Attach File
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-505 block uppercase">Regulatory Justification Comments *</label>
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Voucher reference codes, engineers clearance, or other mandatory auditing notes."
                    className="w-full border border-slate-200 rounded-lg p-3 text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/15"
                    required
                  />
                </div>

                {/* Submit line */}
                <div className="border-t pt-5 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => setActiveFormTab('auxiliary')}
                    className="text-slate-600 bg-slate-50 border p-2 rounded-lg font-mono text-[10px] font-black uppercase hover:bg-slate-100"
                  >
                    Back to Physical
                  </button>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs uppercase px-6 py-2.5 rounded-xl tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer block shrink-0 flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-4 h-4 text-indigo-200" />
                    <span>{isEditing ? 'Commit Audit Changes' : 'Generate Subledger Asset Tag'}</span>
                  </button>
                </div>

              </div>
            )}

          </form>

        </div>

        {/* RIGHT COLUMN: HIGH FIDELITY SIMULATION AND ERP ANALYTICS PANEL */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* IFRS AUDIT FEEDBACK BULLET BOARD */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-950 shadow-md space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-widest">
                Ledger Calibration feedback
              </span>
              <span className="text-[9px] bg-slate-950 border border-slate-850 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold">
                IFRS / ERCA DOCK
              </span>
            </div>

            {/* Validation items checkmarks */}
            <ul className="space-y-3 text-xs font-sans">
              
              {/* Rule 1: Floor Limit */}
              <li className="flex items-start gap-2.5">
                {valCostTooLow ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`font-extrabold ${valCostTooLow ? 'text-amber-300' : 'text-slate-200'}`}>Capitalization Floor Validation</span>
                  <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">
                    {valCostTooLow 
                      ? "ALERT: Lower than Ethiopian limit of 10,000 ETB. The proclamation advises expensing this directly."
                      : `VALID: Cost of ${acquisitionCost.toLocaleString()} ETB meets standard capital thresholds.`
                    }
                  </p>
                </div>
              </li>

              {/* Rule 2: Salvage Reserve Ceiling */}
              <li className="flex items-start gap-2.5">
                {valResidualTooHigh ? (
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`font-extrabold ${valResidualTooHigh ? 'text-rose-450' : 'text-slate-200'}`}>ERCA Salvage limit Restriction (IAS 16)</span>
                  <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">
                    {valResidualTooHigh 
                      ? `RESTRICTION EXCEEDED: Salvage estimation is ${(residualValue / acquisitionCost * 10).toFixed(1)}%. Revenue rules limit tax salvage estimations to max 10% of gross cost.`
                      : "VALID: Residual salvage estimate matches conservative auditing guidelines."
                    }
                  </p>
                </div>
              </li>

              {/* Rule 3: Useful Life Advisor */}
              <li className="flex items-start gap-2.5">
                {lifeOutsideGuidelines ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-extrabold text-slate-200">{assetClass} Useful Life Alignment</span>
                  <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">
                    Standard amortizing life for <strong>{assetClass}</strong> is {recommendedLifeMin} to {recommendedLifeMax} Years. 
                    {lifeOutsideGuidelines 
                      ? ` This selected envelope is ${usefulLifeYears} Years. Audit justification commentary must specify operating variance.`
                      : " Selected timeline fits recommended parameters."
                    }
                  </p>
                </div>
              </li>

            </ul>

          </div>

          {/* DYNAMIC AMORTIZATION CURVE PLOT (SVG) */}
          <div className="bg-white border rounded-2xl p-5 border-slate-200 space-y-4">
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-widest">
                Asset Amortization Trajectory
              </span>
              <span className="text-[9.5px] font-mono text-indigo-700 font-bold">
                Comparative simulation
              </span>
            </div>

            {/* Trajectory Plot Container */}
            <div className="space-y-4 font-sans text-xs">
              
              {/* Dynamic SVG Drawing chart */}
              <div className="bg-slate-50 border p-3.5 rounded-xl">
                <svg viewBox="0 0 300 140" className="w-[100%] h-auto">
                  
                  {/* Grid Lines */}
                  <line x1="20" y1="10" x2="280" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="40" x2="280" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="80" x2="280" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="20" y1="120" x2="280" y2="120" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="120" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Draw Straight Line Curve */}
                  {(() => {
                    const points = slValues.map((val, idx) => {
                      const x = 20 + idx * (260 / (trajectoryYears.length - 1));
                      const y = 120 - (val / acquisitionCost) * 105;
                      return `${x},${isNaN(y) ? 120 : y}`;
                    }).join(' ');

                    return (
                      <polyline 
                        fill="none" 
                        stroke="#4f46e5" 
                        strokeWidth="2.5" 
                        points={points} 
                      />
                    );
                  })()}

                  {/* Draw Reducing balance Curve */}
                  {(() => {
                    const points = rbValues.map((val, idx) => {
                      const x = 20 + idx * (260 / (trajectoryYears.length - 1));
                      const y = 120 - (val / acquisitionCost) * 105;
                      return `${x},${isNaN(y) ? 120 : y}`;
                    }).join(' ');

                    return (
                      <polyline 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeDasharray="4 2"
                        points={points} 
                      />
                    );
                  })()}

                  {/* Label year ticks on X */}
                  <text x="20" y="132" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="start">Y0</text>
                  <text x="150" y="132" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">Mid-life</text>
                  <text x="280" y="132" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="end">Y{usefulLifeYears}</text>

                  {/* Label costs on Y */}
                  <text x="15" y="15" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="end">Cost</text>
                  <text x="15" y="122" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="end">Salv</text>
                </svg>

                {/* Curve legends */}
                <div className="flex gap-4 justify-center font-mono text-[9.5px] font-black mt-2">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <span className="inline-block w-2.5 h-1 bg-indigo-600 rounded"></span>
                    <span>Straight-Line Range ({depreciationMethod === 'Straight Line' ? 'SELECTED' : 'IFRS Option'})</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="inline-block w-2.5 h-1 border-t-2 border-dashed border-emerald-500"></span>
                    <span>CO-Declining Pool ({depreciationMethod === 'Reducing Balance' ? 'SELECTED' : 'Tax Option'})</span>
                  </span>
                </div>
              </div>

              {/* Live summary numbers */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 divide-y divide-slate-150 text-[11px] font-mono">
                <div className="py-1.5 flex justify-between">
                  <span>Annual SL Amortization:</span>
                  <span className="font-extrabold text-slate-800">
                    {slAnnual.toLocaleString()} ETB / Year
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Declining Factor (IBR equivalent):</span>
                  <span className="font-bold text-slate-800">
                    {(ddbRate * 100).toFixed(1)}% Annual Depletion
                  </span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Expected period closure salvage:</span>
                  <span className="font-black text-slate-900">{residualValue.toLocaleString()} ETB</span>
                </div>
              </div>

            </div>

          </div>

          {/* DRAFT GL JOURNAL DOUBLE ENTRY */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-950 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <span className="text-[10px] font-mono font-black text-slate-450">
                Asset Allocation double entry
              </span>
              <span className="text-[8.5px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                POSTING ENVELOPE DRAFT
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              
              {/* Row DEBIT */}
              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex justify-between">
                <div>
                  <span className="text-emerald-400 font-bold block uppercase text-[8px] tracking-wider leading-none">DEBIT Account (Subledger asset base)</span>
                  <span className="text-slate-300 font-extrabold block mt-1">{debitAccountName}</span>
                </div>
                <span className="font-extrabold text-white text-xs self-center">+{acquisitionCost.toLocaleString()} ETB</span>
              </div>

              {/* Row CREDIT */}
              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex justify-between">
                <div>
                  <span className="text-rose-450 text-rose-400 font-bold block uppercase text-[8px] tracking-wider leading-none">CREDIT Accounts (Clearing voucher)</span>
                  <span className="text-slate-350 font-extrabold block mt-1">{creditAccountName}</span>
                </div>
                <span className="font-extrabold text-white text-xs self-center">-{acquisitionCost.toLocaleString()} ETB</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

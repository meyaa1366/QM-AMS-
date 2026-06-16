import React, { useState } from 'react';
import { Account, PostedTransaction } from '../types';
import BusinessTooltip from './BusinessTooltip';
import AdvancedFamSuite from './FAMViews/AdvancedFamSuite';
import { 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  Coins, 
  Scale, 
  ArrowRightLeft, 
  Activity, 
  Database, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Download, 
  Printer, 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Grid, 
  Compass, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  User,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export interface Asset {
  id: string;
  name: string;
  assetClass: 'Land' | 'Machinery' | 'IT' | 'Vehicles' | 'Furniture' | 'CIP';
  groupCode: string;
  category: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currency: string;
  exchangeRate: number;
  usefulLifeYears: number;
  residualValue: number;
  depreciationBook: 'IFRS' | 'Tax' | 'Management' | 'All Books';
  depreciationMethod: 'Straight Line' | 'Reducing Balance' | 'Manual';
  branch: string;
  department: string;
  costCenter: string;
  project: string;
  custodian: string;
  location: string;
  condition: 'New' | 'Good' | 'Under Maintenance' | 'Damaged' | 'Obsolete';
  status: 'Draft' | 'Capitalized' | 'In Service' | 'Partially Disposed' | 'Disposed' | 'Impaired' | 'Suspended' | 'Under Construction';
  accumulatedDepreciation: number;
  impairmentAccumulated: number;
  revaluationSurplus: number;
  depreciationPostedPeriods: number;
  history: string[];
}

const PRE_SEEDED_ASSETS: Asset[] = [
  {
    id: 'FA-2026-001',
    name: 'CNC Precision Milling Machine - German Spec 2026',
    assetClass: 'Machinery',
    groupCode: 'MACH-HVY-101',
    category: 'Industrial Plant Equipment',
    acquisitionDate: '2026-01-10',
    acquisitionCost: 5400000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    usefulLifeYears: 10,
    residualValue: 270000.00,
    depreciationBook: 'All Books',
    depreciationMethod: 'Straight Line',
    branch: 'Addis Ababa Head Branch',
    department: 'Milling & Metal Production',
    costCenter: 'CC-PROD-M1',
    project: 'None',
    custodian: 'Wolde Giorgis',
    location: 'Hawassa Factory Site Floor B',
    condition: 'New',
    status: 'In Service',
    accumulatedDepreciation: 180000.00,
    impairmentAccumulated: 0,
    revaluationSurplus: 0,
    depreciationPostedPeriods: 4,
    history: [
      '2026-01-10: Asset acquired via LC Trade Credit from AP Clearing.',
      '2026-01-15: Technical capitalization certificate signed by General Superintendent.',
      '2026-03-30: Quarter 1 depreciation loop executed automatically (straight-line format).'
    ]
  },
  {
    id: 'FA-2025-090',
    name: 'HQ Corporate Office Tower (Bole Road Phase II)',
    assetClass: 'Land',
    groupCode: 'PROP-RE-909',
    category: 'Commercial Real Estate',
    acquisitionDate: '2025-06-30',
    acquisitionCost: 125000000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    usefulLifeYears: 50,
    residualValue: 0,
    depreciationBook: 'IFRS',
    depreciationMethod: 'Straight Line',
    branch: 'Addis Ababa Head Branch',
    department: 'Executive Administration',
    costCenter: 'CC-ADMIN-HQ',
    project: 'Mesfin HQ Infrastructure',
    custodian: 'Abebe Demeke (Real Estate)',
    location: 'Bole Road Mall Intersection Block A',
    condition: 'Good',
    status: 'In Service',
    accumulatedDepreciation: 2500000.00,
    impairmentAccumulated: 0,
    revaluationSurplus: 1540000.00,
    depreciationPostedPeriods: 12,
    history: [
      '2025-06-30: Initial property construction registry finalized.',
      '2025-12-31: Land and Building revalued by certified external surveyor (Fair value valuation matching IAS 16).'
    ]
  },
  {
    id: 'FA-2026-550',
    name: 'Primary Enterprise Datacenter Servers (Dell PowerEdge R760)',
    assetClass: 'IT',
    groupCode: 'COMP-SERV-IT5',
    category: 'High Performance Computer Hardware',
    acquisitionDate: '2026-02-15',
    acquisitionCost: 1850000.00,
    currency: 'USD',
    exchangeRate: 54.5,
    usefulLifeYears: 4,
    residualValue: 92500.00,
    depreciationBook: 'All Books',
    depreciationMethod: 'Straight Line',
    branch: 'Addis Ababa Head Branch',
    department: 'IT & Digital Enablement',
    costCenter: 'CC-IT-SERVS',
    project: 'Cloud Core Modernization',
    custodian: 'Martha Hailu',
    location: 'Server Room 302 (Fitted with redundant cooling)',
    condition: 'Good',
    status: 'In Service',
    accumulatedDepreciation: 153125.00,
    impairmentAccumulated: 0,
    revaluationSurplus: 0,
    depreciationPostedPeriods: 3,
    history: [
      '2026-02-15: Acquired and Capitalized via import voucher.'
    ]
  },
  {
    id: 'FA-2026-004',
    name: 'Consolidated Logistics Delivery Trucks (FSR Isuzu)',
    assetClass: 'Vehicles',
    groupCode: 'VEH-DIST-440',
    category: 'Commercial Cargo Transport Fleet',
    acquisitionDate: '2026-04-01',
    acquisitionCost: 3200000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    usefulLifeYears: 5,
    residualValue: 160000.00,
    depreciationBook: 'All Books',
    depreciationMethod: 'Reducing Balance',
    branch: 'Hawassa Regional Hub',
    department: 'Supply Chain Operations',
    costCenter: 'CC-LOG-HW',
    project: 'None',
    custodian: 'Bekele Zewdu',
    location: 'Hawassa Depot Garage Yard',
    condition: 'Good',
    status: 'In Service',
    accumulatedDepreciation: 101333.00,
    impairmentAccumulated: 0,
    revaluationSurplus: 0,
    depreciationPostedPeriods: 2,
    history: [
      '2026-04-01: Asset capitalized from regional fleet lease purchase.'
    ]
  },
  {
    id: 'FA-2026-609',
    name: 'Industrial Generator (Caterpillar 500kVA)',
    assetClass: 'CIP',
    groupCode: 'MACH-GEN-03',
    category: 'Factory Backup Power CIP',
    acquisitionDate: '2026-05-10',
    acquisitionCost: 4500000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    usefulLifeYears: 8,
    residualValue: 225000.00,
    depreciationBook: 'All Books',
    depreciationMethod: 'Straight Line',
    branch: 'Hawassa Regional Hub',
    department: 'Milling & Metal Production',
    costCenter: 'CC-PROD-HW',
    project: 'Hawassa Energy Redundancy Phase I',
    custodian: 'Engineer Solomon',
    location: 'Hawassa Factory Site Compound',
    condition: 'New',
    status: 'Under Construction',
    accumulatedDepreciation: 0,
    impairmentAccumulated: 0,
    revaluationSurplus: 0,
    depreciationPostedPeriods: 0,
    history: [
      '2026-05-10: Created base CIP shell for backup power componentization.',
      '2026-05-25: Capital expenditures from raw import and clearing loaded into CIP account.'
    ]
  }
];

interface FixedAssetsTabProps {
  accounts: Account[];
  onAddTransaction: (txn: PostedTransaction) => void;
  onNavigate?: (tab: string) => void;
  onAddAuditLog: (log: any) => void;
  initialSubTab?: string;
}

export default function FixedAssetsTab({ 
  accounts, 
  onAddTransaction, 
  onNavigate,
  onAddAuditLog,
  initialSubTab = 'fixed-assets-dashboard'
}: FixedAssetsTabProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);
  const [assets, setAssets] = useState<Asset[]>(PRE_SEEDED_ASSETS);
  const [customToast, setCustomToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const triggerLocalToast = (message: string, type: 'success' | 'error' | 'info') => {
    setCustomToast({ message, type });
    setTimeout(() => setCustomToast(null), 5000);
  };

  const handleAddNewAssetLocal = (newAsset: any) => {
    // Adapter to fully map fields if needed
    const mapped: Asset = {
      id: newAsset.id || `FA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newAsset.name || 'Untitled Asset',
      assetClass: newAsset.assetClass || 'Machinery',
      groupCode: newAsset.groupCode || 'GEN-01',
      category: newAsset.category || 'Capital Equipment',
      acquisitionDate: newAsset.acquisitionDate || new Date().toISOString().split('T')[0],
      acquisitionCost: parseFloat(newAsset.acquisitionCost) || 0,
      currency: newAsset.currency || 'ETB',
      exchangeRate: parseFloat(newAsset.exchangeRate) || 1.0,
      usefulLifeYears: parseInt(newAsset.usefulLifeYears) || 5,
      residualValue: parseFloat(newAsset.residualValue) || 0,
      depreciationBook: newAsset.depreciationBook || 'All Books',
      depreciationMethod: newAsset.depreciationMethod || 'Straight Line',
      branch: newAsset.branch || 'Addis Ababa Head Branch',
      department: newAsset.department || 'Production',
      costCenter: newAsset.costCenter || 'CC-PROD-M1',
      project: newAsset.project || 'None',
      custodian: newAsset.custodian || 'System Hub',
      location: newAsset.location || 'Addis Warehouse 1',
      condition: newAsset.condition || 'New',
      status: newAsset.status || 'In Service',
      accumulatedDepreciation: parseFloat(newAsset.accumulatedDepreciation) || 0,
      impairmentAccumulated: parseFloat(newAsset.impairmentAccumulated) || 0,
      revaluationSurplus: parseFloat(newAsset.revaluationSurplus) || 0,
      depreciationPostedPeriods: parseInt(newAsset.depreciationPostedPeriods) || 0,
      history: newAsset.history || ['Onboarded via ERP Master Registry Form']
    };

    setAssets(prev => [...prev, mapped]);
    
    // Add real audit log stream record back to parent system log files
    onAddAuditLog({
      id: `AUD-NEW-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: 'chief_fa_curator',
      action: 'ASSET_ONBOARDING',
      entityType: 'ASSET_LEDGER_CARD',
      entityKey: mapped.id,
      description: `Created new capitalized shell asset tag for ${mapped.name} (~${mapped.acquisitionCost.toLocaleString()} ETB)`
    });

    triggerLocalToast(`Success: Asset ${mapped.id} has been fully capitalized and written to the subledger.`, 'success');
  };

  const handleUpdateAssetLocal = (id: string, updates: any) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    
    triggerLocalToast(`Subledger Updated: Asset ${id} Master Records written to secure statements.`, 'info');

    onAddAuditLog({
      id: `AUD-UP-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: 'chief_fa_curator',
      action: 'ASSET_MASTER_MAINTENANCE',
      entityType: 'ASSET_LEDGER_CARD',
      entityKey: id,
      description: `Modified parameters on Asset ${id}. Written to subledger.`
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* LOCAL TOAST NOTIFICATION STREAMS */}
      {customToast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 border rounded-xl shadow-xl flex items-center gap-2.5 z-[200] ${
          customToast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          customToast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          {customToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {customToast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          {customToast.type === 'info' && <Info className="w-5 h-5 text-indigo-600 shrink-0" />}
          <span className="text-xs font-bold font-mono tracking-tight">{customToast.message}</span>
        </div>
      )}

      {/* Corporate Title Block with multi-sub-tab toggles */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 matches-title">
            <Layers className="w-5.5 h-5.5 text-indigo-650" />
            <span>Fixed Assets Ledger Workdesk</span>
            <BusinessTooltip text="Comprehensive Fixed Assets system. Calculates multi-book straight line & reducing pool depreciations, tracks reevaluations/impairments, physical handovers, and dispatches dynamic IFRS-compliant ledger integrations to the primary statements." />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reconciles Property, Plant & Equipment under IAS 16, IAS 36, and Ethiopian ERCA statutory compliance benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'dashboard', tabId: 'fixed-assets-dashboard', label: 'Dashboard Analysis', icon: Activity },
            { id: 'registry', tabId: 'fixed-assets-registry', label: 'Asset Ledger Hub', icon: Database },
            { id: 'actions', tabId: 'fixed-assets-reval', label: 'Reval & Adjustments', icon: Scale },
            { id: 'spec', tabId: 'fixed-assets-spec', label: 'Implementation Specs (Sections 1-21)', icon: Terminal }
          ].map(tab => {
            const isActive = activeSubTab === tab.tabId || 
              (tab.id === 'registry' && activeSubTab === 'fixed-assets-registry') ||
              (tab.id === 'actions' && [
                'fixed-assets-reval', 'fixed-assets-impair', 'fixed-assets-components', 
                'fixed-assets-leases', 'fixed-assets-maint', 'fixed-assets-verify', 'fixed-assets-disposal'
               ].includes(activeSubTab));
            
            return (
              <button
                id={`fa-sub-tab-${tab.id}`}
                key={tab.id}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(tab.tabId);
                  } else {
                    setActiveSubTab(tab.tabId);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold tracking-tight uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ADVANCED MULTI-PAGE FAM SUITE Cockpit */}
      <AdvancedFamSuite 
        assets={assets} 
        onAddAsset={handleAddNewAssetLocal} 
        onUpdateAssetStatus={handleUpdateAssetLocal} 
        onAddTransaction={onAddTransaction}
        onNavigatePage={(pageId, sub) => {
          if (onNavigate) {
            let targetTab = 'fixed-assets-dashboard';
            if (pageId === 'dashboard') targetTab = 'fixed-assets-dashboard';
            else if (pageId === 'asset-list') targetTab = 'fixed-assets-registry';
            else if (pageId === 'asset-register') targetTab = 'fixed-assets-register';
            else if (pageId === 'depreciation-run') targetTab = 'fixed-assets-depr';
            else if (pageId === 'reports') targetTab = 'fixed-assets-reports';
            else if (pageId === 'administration') targetTab = 'fixed-assets-administration';
            else if (pageId === 'specs-manual') targetTab = 'fixed-assets-spec';
            else if (pageId === 'operations') {
              if (sub === 'capitalization') targetTab = 'fixed-assets-capitalization';
              else if (sub === 'cip') targetTab = 'fixed-assets-cip';
              else if (sub === 'transfer') targetTab = 'fixed-assets-transfer';
              else if (sub === 'leases') targetTab = 'fixed-assets-leases';
            } else if (pageId === 'adjustments') {
              if (sub === 'reval') targetTab = 'fixed-assets-reval';
              else if (sub === 'impair') targetTab = 'fixed-assets-impair';
              else if (sub === 'components') targetTab = 'fixed-assets-components';
              else if (sub === 'maint') targetTab = 'fixed-assets-maint';
              else if (sub === 'verify') targetTab = 'fixed-assets-verify';
              else if (sub === 'disposal') targetTab = 'fixed-assets-disposal';
            }
            onNavigate(targetTab);
          }
        }}
        initialPage={
          activeSubTab === 'fixed-assets-dashboard' ? 'dashboard' :
          activeSubTab === 'fixed-assets-registry' ? 'asset-list' :
          activeSubTab === 'fixed-assets-register' ? 'asset-register' :
          activeSubTab === 'fixed-assets-capitalization' ? 'capitalization' :
          activeSubTab === 'fixed-assets-cip' ? 'cip' :
          activeSubTab === 'fixed-assets-transfer' ? 'transfer' :
          activeSubTab === 'fixed-assets-depr' ? 'depreciation-run' :
          activeSubTab === 'fixed-assets-reval' ? 'reval' :
          activeSubTab === 'fixed-assets-impair' ? 'impair' :
          activeSubTab === 'fixed-assets-components' ? 'components' :
          activeSubTab === 'fixed-assets-leases' ? 'leases' :
          activeSubTab === 'fixed-assets-maint' ? 'maint' :
          activeSubTab === 'fixed-assets-verify' ? 'verify' :
          activeSubTab === 'fixed-assets-disposal' ? 'disposal' :
          activeSubTab === 'fixed-assets-reports' ? 'reports' :
          activeSubTab === 'fixed-assets-administration' ? 'administration' :
          activeSubTab === 'fixed-assets-spec' ? 'specs-manual' :
          'dashboard'
        }
      />

    </div>
  );
}

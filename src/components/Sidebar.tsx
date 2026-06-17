import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Database,
  PlusCircle,
  Upload,
  History,
  Layers,
  Sliders,
  MapPin,
  Scale,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Percent,
  Terminal,
  Settings,
  HelpCircle,
  FileDown,
  Activity,
  Lock,
  FileText,
  Briefcase,
  SlidersHorizontal,
  FileBarChart2,
  FolderLock,
  Calendar,
  Coins,
  ChevronLeft,
  ChevronsRight,
  Boxes,
  BriefcaseIcon,
  Users,
  Clock,
  Landmark,
  ArrowRightLeft,
  Receipt,
  ClipboardList,
  Sparkles,
  Calculator,
  Grid,
  CheckCircle2,
  Banknote,
  FileCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onCreateAccount: () => void;
  onImportCOA: () => void;
  onValidateSetup: () => void;
  onExportSetup: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface MainMenuGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubMenuItem[];
}

export default function Sidebar({ 
  activeTab, 
  onNavigate,
  onCreateAccount,
  onImportCOA,
  onValidateSetup,
  onExportSetup,
  isCollapsed: outerCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isCollapsed = onToggleCollapse ? outerCollapsed : localCollapsed;
  const toggleCollapseActual = onToggleCollapse ? onToggleCollapse : () => setLocalCollapsed(!localCollapsed);

  const [primaryStatementsExpanded, setPrimaryStatementsExpanded] = useState(true);
  const [notesStatementsExpanded, setNotesStatementsExpanded] = useState(true);

  // Grouped Menu Structure as explicitly requested by user
  const mainMenus: MainMenuGroup[] = [
    {
      id: 'finance-setup',
      label: 'Finance Setup',
      icon: Calendar,
      items: [
        { id: 'fiscal-period', label: 'Fiscal Year & Period Setup', icon: Calendar, badge: 'Active' },
        { id: 'ifrs-classification', label: 'IFRS Classification Standards', icon: BookOpen },
        { id: 'ethiopian-tax', label: 'Ethiopian Tax System', icon: Percent }
      ]
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: Briefcase,
      items: [
        { id: 'coa-register', label: 'Chart of Accounts Register', icon: Database },
        { id: 'add-edit-account', label: 'Create / Edit Accounts', icon: PlusCircle },
        { id: 'import-template', label: 'Bulk XLS/CSV Import', icon: Upload }
      ]
    },
    {
      id: 'cash-bank-management',
      label: 'Cash & Bank Management',
      icon: Banknote,
      items: [
        { id: 'voucher-cpv', label: 'Cash Payment Voucher (CPV)', icon: FileText },
        { id: 'voucher-crv', label: 'Cash Receipt Voucher (CRV)', icon: FileText },
        { id: 'voucher-pcv', label: 'Petty Cash Voucher', icon: Receipt },
        { id: 'cash-bank-transactions', label: 'Cash Transaction Register', icon: Coins }
      ]
    },
    {
      id: 'bank-management',
      label: 'Bank Management',
      icon: Landmark,
      items: [
        { id: 'voucher-bpv', label: 'Bank Payment Voucher (BPV)', icon: FileText },
        { id: 'voucher-brv', label: 'Bank Receipt Voucher (BRV)', icon: FileText },
        { id: 'voucher-btv', label: 'Bank Transfer Voucher (BTV)', icon: ArrowRightLeft },
        { id: 'cash-bank-dashboard', label: 'Treasury Dashboard', icon: Activity },
        { id: 'cash-bank-reco', label: 'Bank Reconciliations', icon: ShieldCheck },
        { id: 'cash-bank-cheques', label: 'PDC & Cheque Center', icon: ClipboardList }
      ]
    },
    {
      id: 'ar-module',
      label: 'Accounts Receivable',
      icon: TrendingUp,
      items: [
        { id: 'voucher-ari', label: 'Customer Invoice', icon: FileText },
        { id: 'voucher-arrv', label: 'Customer Receipt Voucher', icon: FileText },
        { id: 'voucher-cnv', label: 'Credit Note', icon: FileText },
        { id: 'apar-customers', label: 'Customer Register', icon: Users },
        { id: 'apar-gating', label: 'Live Compliance Gating', icon: ShieldCheck },
        { id: 'apar-controls', label: 'AR Setup Controls', icon: Settings }
      ]
    },
    {
      id: 'ap-module',
      label: 'Accounts Payable',
      icon: TrendingDown,
      items: [
        { id: 'voucher-api', label: 'Supplier Invoice', icon: FileText },
        { id: 'voucher-appv', label: 'Supplier Payment Voucher', icon: FileText },
        { id: 'voucher-dnv', label: 'Debit Note', icon: FileText },
        { id: 'apar-suppliers', label: 'Supplier Register', icon: Users },
        { id: 'apar-aging', label: 'Accounts Aging Report', icon: Clock },
        { id: 'apar-compliance', label: 'ERCA Tax Compliance', icon: Percent }
      ]
    },
    {
      id: 'gl-module',
      label: 'General Ledger',
      icon: Scale,
      items: [
        { id: 'voucher-jv', label: 'Journal Voucher (JV)', icon: FileCheck },
        { id: 'voucher-ajv', label: 'Adjustment Journal Voucher (AJV)', icon: Sparkles },
        { id: 'journal-register', label: 'Journal Transaction Book', icon: BookOpen },
        { id: 'posting-matrix', label: 'Voucher Posting Matrix', icon: Scale },
        { id: 'budget-setup', label: 'Budget Setup & Controls', icon: Coins }
      ]
    },
    {
      id: 'financial-reporting',
      label: 'Financial Reporting',
      icon: BookOpen,
      items: [
        // Primary financial statements
        { id: 'financial-statements', label: 'Primary Financial Statements', icon: FileText },
        { id: 'balance-sheet', label: '1. Financial Position (BS)', icon: FileText },
        { id: 'income-statement', label: '2. Profit & Loss (P&L)', icon: FileText },
        { id: 'cashflows', label: '3. Statement of Cash Flows', icon: FileText },
        { id: 'changes-equity', label: '4. Changes in Equity', icon: FileText },
        { id: 'ledger-card', label: '6. General Ledger Cards', icon: FileText },
        { id: 'audit-trail', label: 'Continuous Audit Trail', icon: History },
        // Notes to financial statements
        { id: 'note-general-info', label: 'General Information', icon: FileText },
        { id: 'note-compliance-ifrs', label: 'Statement of Compliance with IFRS', icon: FileText },
        { id: 'note-accounting-policies', label: 'Significant Accounting Policies', icon: FileText },
        { id: 'note-judgments-estimates', label: 'Critical Judgments and Estimates', icon: FileText },
        { id: 'note-pos-notes', label: 'Statement of Financial Position Notes', icon: FileText },
        { id: 'note-pl-notes', label: 'Statement of Profit or Loss Notes', icon: FileText },
        { id: 'note-cashflow-reco', label: 'Statement of Cash Flow Notes', icon: FileText },
        { id: 'note-equity-notes', label: 'Statement of Changes in Equity Notes', icon: FileText },
        { id: 'note-risk-management', label: 'Financial Risk Management', icon: FileText },
        { id: 'note-capital-mgmt', label: 'Capital Management', icon: FileText },
        { id: 'note-related-parties', label: 'Related Party Disclosure', icon: FileText },
        { id: 'note-segment-report', label: 'Segment Reporting', icon: FileText },
        { id: 'note-contingencies', label: 'Contingencies and Commitments', icon: FileText },
        { id: 'note-post-balance-events', label: 'Subsequent Events', icon: FileText },
        { id: 'note-going-concern', label: 'Going Concern Disclosure', icon: FileText },
        { id: 'note-consolidation-notes', label: 'Consolidation Notes', icon: FileText },
        { id: 'note-comparatives-check', label: 'Comparative Information', icon: FileText },
        { id: 'note-interactive-builder', label: 'Disclosure Note Builder', icon: FileText },
        { id: 'note-workflow-approval', label: 'Note Review & Signing Workflow', icon: FileText },
        { id: 'note-publication-book', label: 'Notes Publication Compiler', icon: FileText }
      ]
    },
    {
      id: 'fixed-assets-module',
      label: 'Fixed Assets Management',
      icon: Boxes,
      items: [
        { id: 'fixed-assets-dashboard', label: 'FA Dashboard & Analysis', icon: Activity },
        { id: 'fixed-assets-registry', label: 'Asset Master List', icon: Database },
        { id: 'fixed-assets-register', label: 'Register Asset', icon: PlusCircle },
        { id: 'fixed-assets-capitalization', label: 'Asset Capitalization', icon: Sparkles },
        { id: 'fixed-assets-cip', label: 'Work in Progress (CIP)', icon: Layers },
        { id: 'fixed-assets-transfer', label: 'Asset Transfer', icon: ArrowRightLeft },
        { id: 'fixed-assets-depr', label: 'Depreciation Run', icon: Calculator },
        { id: 'fixed-assets-reval', label: 'Revaluation (IAS 16)', icon: Scale },
        { id: 'fixed-assets-impair', label: 'Impairment (IAS 36)', icon: AlertTriangle },
        { id: 'fixed-assets-components', label: 'Component Accounting', icon: Grid },
        { id: 'fixed-assets-leases', label: 'IFRS 16 Lease Manager', icon: Settings },
        { id: 'fixed-assets-maint', label: 'Maintenance Scheduler', icon: Settings },
        { id: 'fixed-assets-verify', label: 'Physical Verification', icon: ShieldCheck },
        { id: 'fixed-assets-disposal', label: 'Asset Retirement', icon: Coins },
        { id: 'fixed-assets-reports', label: 'Ledger Reports Suite', icon: FileText },
        { id: 'fixed-assets-administration', label: 'Posting rules & Workflows', icon: FolderLock }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: FolderLock,
      items: [
        { id: 'subledger-setup', label: 'Subsidiary Ledger Rules', icon: Boxes },
        { id: 'business-rules', label: 'ERCA / IFRS Biz Logic', icon: ShieldCheck },
        { id: 'validation-messages', label: 'Validation Errors Log', icon: AlertTriangle, badge: 'Scan' },
        { id: 'enum-master', label: 'Enum Master Dictionary', icon: Layers },
        { id: 'lookup-master', label: 'Lookup Masters', icon: Sliders },
        { id: 'lookup-data', label: 'Lookup Mapping Data', icon: MapPin },
        { id: 'fixed-assets-spec', label: 'FA Implementation Specs', icon: Terminal, badge: 'D365' },
        { id: 'dev-implementation-guide', label: 'Developer Guide', icon: Terminal, badge: 'ABC' },
        { id: 'api-endpoints', label: 'System ERP API Specs', icon: Terminal }
      ]
    }
  ];

  // Map sub-tabs to their parent groups for default expansion behavior
  const getParentGroupIdOfTab = (tabId: string): string => {
    if (tabId === 'fixed-assets-spec') {
      return 'administration';
    }
    if (tabId.startsWith('fixed-assets-')) {
      return 'fixed-assets-module';
    }
    if (tabId.startsWith('note-') || ['financial-statements', 'balance-sheet', 'income-statement', 'cashflows', 'changes-equity', 'ledger-card', 'audit-trail'].includes(tabId)) {
      return 'financial-reporting';
    }
    if (tabId.startsWith('voucher-')) {
      if (['voucher-cpv', 'voucher-crv', 'voucher-pcv'].includes(tabId)) return 'cash-bank-management';
      if (['voucher-bpv', 'voucher-brv', 'voucher-btv'].includes(tabId)) return 'bank-management';
      if (['voucher-ari', 'voucher-arrv', 'voucher-cnv'].includes(tabId)) return 'ar-module';
      if (['voucher-api', 'voucher-appv', 'voucher-dnv'].includes(tabId)) return 'ap-module';
      if (['voucher-jv', 'voucher-ajv'].includes(tabId)) return 'gl-module';
    }
    for (const group of mainMenus) {
      if (group.items.some(item => {
        if (item.id === 'balance-sheet' && tabId === 'financial-statements') return true;
        return item.id === tabId;
      })) {
        return group.id;
      }
    }
    return 'finance-setup'; // fallback
  };

  // State to track expanded / collapsed main menus
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'finance-setup': true,
    'master-data': false,
    'cash-bank-management': false,
    'bank-management': false,
    'ar-module': false,
    'ap-module': false,
    'gl-module': false,
    'financial-reporting': false,
    'fixed-assets-module': false,
    'administration': false
  });

  // Make sure the active tab's parent group is always expanded when tab shifts externally
  useEffect(() => {
    const parentId = getParentGroupIdOfTab(activeTab);
    setExpandedGroups(prev => ({
      ...prev,
      [parentId]: true
    }));
  }, [activeTab]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <aside 
      id="main-sidebar"
      className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col z-50 select-none text-slate-300 shadow-xl overflow-hidden ${
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Decorative top safety line */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500 w-full shrink-0"></div>

      {/* Corporate Branding Area */}
      <div className="px-4 py-4.5 shrink-0 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-indigo-650 border border-amber-500/40 rounded-xl flex items-center justify-center text-white shadow-lg relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-4 h-4 border border-amber-500 rounded-full translate-x-2 -translate-y-2"></div>
              <span className="font-sans font-black text-xs text-amber-400">QM</span>
            </div>
            <div className="truncate">
              <h1 className="font-sans text-xs font-black text-white tracking-tight uppercase leading-none">
                Enterprise ERP
              </h1>
              <p className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider mt-1 leading-none font-mono">
                Finance Workstation
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center shrink-0">
            <div className="w-8 h-8 bg-indigo-650 border border-amber-500/40 rounded-lg flex items-center justify-center text-white shadow-md font-sans font-black text-[10px] text-amber-400">
              Q
            </div>
          </div>
        )}

        {/* Sidebar Collapse Toggle Button */}
        <button 
          onClick={toggleCollapseActual}
          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1 focus:outline-none hidden sm:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronsRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Compact Network Status HUD */}
      {!isCollapsed && (
        <div className="px-5 py-2 border-b border-slate-800/60 bg-slate-950/40 text-[9px] font-mono flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-medium">Secured Cloud Connection</span>
          </div>
          <span className="text-indigo-400 font-extrabold">IFRS-17</span>
        </div>
      )}

      {/* Quick Access Workstations Section */}
      <div className={`p-3 bg-slate-950/20 border-b border-slate-800/80 space-y-1.5 shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed ? (
          <>
            <span className="px-1 text-[8.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Actions
            </span>
            <button
              onClick={onCreateAccount}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Add GL Account</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onValidateSetup}
                className="bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-750 py-1 px-1.5 rounded-lg font-sans text-[10px] font-semibold flex items-center justify-center gap-1 transition-all truncate cursor-pointer"
                title="Validate ERP Rules"
              >
                <AlertTriangle className="w-3 h-3 shrink-0 text-amber-500" />
                <span>Validate App</span>
              </button>

              <button
                onClick={onExportSetup}
                className="bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-slate-750 py-1 px-1.5 rounded-lg font-sans text-[10px] font-semibold flex items-center justify-center gap-1 transition-all truncate cursor-pointer"
                title="Export Spec File"
              >
                <FileDown className="w-3 h-3 shrink-0 text-emerald-500" />
                <span>Export Specs</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2.5 items-center py-1">
            <button
              onClick={onCreateAccount}
              className="p-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white"
              title="Add GL Account"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onValidateSetup}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400"
              title="Validate ERP Rules"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={onExportSetup}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400"
              title="Export Spec File"
            >
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Hierarchical Navigation Area */}
      <nav id="sidebar-tabs-nav" className="flex-1 space-y-1.5 px-2 py-3 overflow-y-auto min-h-0 select-none custom-scrollbar">
        {mainMenus.map((group) => {
          const isGroupExpanded = !isCollapsed && !!expandedGroups[group.id];
          const GroupIcon = group.icon;
          
          const isChildSelected = group.items.some(item => {
            if (item.id === 'balance-sheet' && activeTab === 'financial-statements') return true;
            return activeTab === item.id;
          });

          return (
            <div key={group.id} className="mb-1">
              {/* Expandable Group Title Tab */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all duration-150 text-left outline-none cursor-pointer ${
                    isChildSelected 
                      ? 'bg-slate-800/80 text-white font-bold'
                      : 'text-slate-450 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GroupIcon className={`w-3.5 h-3.5 shrink-0 ${isChildSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="font-sans text-[11px] font-bold uppercase tracking-wider truncate">
                      {group.label}
                    </span>
                  </div>
                  <div>
                    {isGroupExpanded ? (
                      <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </div>
                </button>
              ) : (
                <div className="flex justify-center py-1">
                  <span className={`p-1.5 rounded-lg ${isChildSelected ? 'bg-indigo-950 text-indigo-400' : 'text-slate-550'}`} title={group.label}>
                    <GroupIcon className="w-4 h-4" />
                  </span>
                </div>
              )}

              {/* Collapsed/Expanded Nested Submenu items */}
              {(isGroupExpanded || isCollapsed) && (
                <div className={`mt-0.5 space-y-0.5 ${!isCollapsed ? 'pl-4 pr-1 border-l border-slate-800/60 ml-3.5' : 'flex flex-col items-center'}`}>
                  {group.id === 'master-data' ? (
                    isCollapsed ? (
                      group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer mt-1 ${
                              isSelected ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                            }`}
                            title={item.label}
                          >
                            <ItemIcon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="space-y-2 mt-1">
                        <div className="px-2 py-0.5 text-[8.5px] font-black text-indigo-400 uppercase tracking-widest block bg-indigo-950/20 rounded pl-1.5">
                          Chart of Accounts
                        </div>
                        <div className="space-y-0.5 pl-1.5">
                          {group.items.slice(0, 3).map((item) => {
                            const ItemIcon = item.icon;
                            const isSelected = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`group w-full flex items-center justify-between px-2 py-1 rounded-md transition-all duration-150 text-left cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-950/70 text-indigo-305 font-bold'
                                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                                  <span className="font-sans text-[11px] tracking-tight truncate">
                                    {item.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {group.items.length > 3 && (
                          <>
                            <div className="px-2 py-0.5 mt-1.5 text-[8.5px] font-black text-indigo-400 uppercase tracking-widest block bg-indigo-950/20 rounded pl-1.5 border-t border-slate-800/30">
                              System Master Mappings
                            </div>
                            <div className="space-y-0.5 pl-1.5">
                              {group.items.slice(3).map((item) => {
                                const ItemIcon = item.icon;
                                const isSelected = activeTab === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`group w-full flex items-center justify-between px-2 py-1 rounded-md transition-all duration-150 text-left cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-950/70 text-indigo-305 font-bold'
                                        : 'text-slate-405 hover:bg-slate-800/40 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                                      <span className="font-sans text-[11px] tracking-tight truncate">
                                        {item.label}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  ) : group.id === 'financial-reporting' ? (
                    isCollapsed ? (
                      <>
                        <button
                          onClick={() => onNavigate('financial-statements')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            activeTab === 'financial-statements' || ['balance-sheet', 'income-statement', 'cashflows', 'changes-equity', 'ledger-card'].includes(activeTab)
                              ? 'bg-indigo-650 text-white' 
                              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                          }`}
                          title="Primary Financial Statements"
                        >
                          <FileBarChart2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('note-general-info')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer mt-1.5 ${
                            activeTab.startsWith('note-') 
                              ? 'bg-indigo-650 text-white' 
                              : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                          }`}
                          title="Notes to Financial Statements"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 mt-1">
                        <div className="px-2.5 py-1 text-[8.5px] font-black text-indigo-400 uppercase tracking-widest block">
                          Primary Statements
                        </div>
                        <div className="space-y-0.5">
                          {[
                            { id: 'financial-statements', label: 'Trial Balance Auditor Spec', icon: FileBarChart2 },
                            { id: 'balance-sheet', label: '1. Financial Position (BS)', icon: FileText },
                            { id: 'income-statement', label: '2. Profit & Loss (P&L)', icon: FileText },
                            { id: 'cashflows', label: '3. Statement of Cash Flows', icon: FileText },
                            { id: 'changes-equity', label: '4. Changes in Equity', icon: FileText },
                            { id: 'ledger-card', label: '6. General Ledger Cards', icon: FileText, badge: 'New' },
                            { id: 'audit-trail', label: 'Continuous Audit Trail', icon: History },
                          ].map((item) => {
                            const isSelected = activeTab === item.id || (item.id === 'balance-sheet' && activeTab === 'financial-statements');
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`group w-full flex items-center justify-between px-2 py-1 rounded-md transition-all duration-150 text-left cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-950/70 text-indigo-305 font-bold'
                                    : 'text-slate-450 hover:bg-slate-800/40 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                                  <span className="font-sans text-[11px] tracking-tight truncate">
                                    {item.label}
                                  </span>
                                </div>
                                {item.badge && (
                                  <span className="text-[8px] font-extrabold px-1 bg-indigo-950/80 text-indigo-400 rounded shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-2.5 py-1 pt-2 text-[8.5px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-between border-t border-slate-800/40 mt-1">
                          <span>IFRS Disclosure Notes</span>
                          <button
                            onClick={() => setNotesStatementsExpanded(!notesStatementsExpanded)}
                            className="text-[9px] text-[#24389c] hover:text-indigo-400 font-mono transition-colors focus:outline-none"
                            title={notesStatementsExpanded ? "Collapse Notes" : "Expand Notes"}
                          >
                            {notesStatementsExpanded ? '[-]' : '[+]'}
                          </button>
                        </div>
                        {notesStatementsExpanded && (
                          <div className="space-y-0.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1 border-l border-slate-800/60 ml-2 pl-2">
                            {[
                              { id: 'note-general-info', label: 'General Information', icon: FileText },
                              { id: 'note-compliance-ifrs', label: 'IFRS Compliance Statement', icon: BookOpen },
                              { id: 'note-accounting-policies', label: 'Significant Accounting Policies', icon: BookOpen },
                              { id: 'note-judgments-estimates', label: 'Critical Judgments & Estimates', icon: Layers },
                              { id: 'note-pos-notes', label: 'Financial Position Details', icon: FileText },
                              { id: 'note-pl-notes', label: 'Profit or Loss Details', icon: FileText },
                              { id: 'note-cashflow-reco', label: 'Cash Flow Footnotes', icon: FileText },
                              { id: 'note-equity-notes', label: 'Changes in Equity Footnotes', icon: FileText },
                              { id: 'note-risk-management', label: 'Financial Risk Management', icon: ShieldCheck },
                              { id: 'note-capital-mgmt', label: 'Capital Management', icon: ShieldCheck },
                              { id: 'note-related-parties', label: 'Related Party Disclosures', icon: Users },
                              { id: 'note-segment-report', label: 'Segment Reporting Matrix', icon: Activity },
                              { id: 'note-contingencies', label: 'Contingencies & Commitments', icon: AlertTriangle },
                              { id: 'note-post-balance-events', label: 'Subsequent Events Note', icon: Calendar },
                              { id: 'note-going-concern', label: 'Going Concern Disclosures', icon: CheckCircle2 },
                              { id: 'note-consolidation-notes', label: 'Consolidation Scope Details', icon: Layers },
                              { id: 'note-comparatives-check', label: 'Comparative Reclassifications', icon: FileText },
                              { id: 'note-interactive-builder', label: 'Disclosure Note Builder Sandbox', icon: Sparkles },
                              { id: 'note-workflow-approval', label: 'Note Review & Signing Workflow', icon: FileText, badge: 'Admin' },
                              { id: 'note-publication-book', label: 'Notes Publication Compiler', icon: FileText, badge: 'Review' },
                            ].map((item) => {
                              const isSelected = activeTab === item.id;
                              const ItemIcon = item.icon;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => onNavigate(item.id)}
                                  className={`group w-full flex items-center justify-between px-2 py-1 rounded-md transition-all duration-150 text-left cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-950/70 text-indigo-305 font-bold'
                                      : 'text-slate-450 hover:bg-slate-800/40 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                                    <span className="font-sans text-[11px] tracking-tight truncate">
                                      {item.label}
                                    </span>
                                  </div>
                                  {item.badge && (
                                    <span className="text-[8px] font-extrabold px-1 bg-indigo-950/80 text-indigo-400 rounded shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isSelected = activeTab === item.id || 
                        (item.id === 'balance-sheet' && activeTab === 'financial-statements');

                      if (isCollapsed) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSelected ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                            }`}
                            title={item.label}
                          >
                            <ItemIcon className="w-3.5 h-3.5" />
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          id={`nav-${item.id}`}
                          onClick={() => onNavigate(item.id)}
                          className={`group w-full flex items-center justify-between px-2 py-1 rounded-md transition-all duration-150 text-left cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-950/70 text-indigo-305 font-bold'
                              : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                            <span className="font-sans text-[11px] tracking-tight truncate">
                              {item.label}
                            </span>
                          </div>

                          {item.badge && (
                            <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded shrink-0 ${
                              item.badge === 'Active' 
                                ? 'bg-emerald-950/80 text-emerald-400' 
                                : 'bg-indigo-950/80 text-indigo-400'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="py-3 bg-slate-950/80 border-t border-slate-800 shrink-0 text-center select-none">
        {!isCollapsed ? (
          <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest leading-none block">
            IFRS AMS • v4.5
          </span>
        ) : (
          <span className="text-[8.5px] font-mono text-slate-500 font-bold">4.5</span>
        )}
      </div>
    </aside>
  );
}

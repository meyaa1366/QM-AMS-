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
  Boxes,
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
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onCreateAccount: () => void;
  onImportCOA: () => void;
  onValidateSetup: () => void;
  onExportSetup: () => void;
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
  onExportSetup
}: SidebarProps) {
  // Main Menu hierarchical structure setup
  const mainMenus: MainMenuGroup[] = [
    {
      id: 'dictionary-lookups',
      label: '1. System Lookups & Dictionaries',
      icon: SlidersHorizontal,
      items: [
        { id: 'enum-master', label: 'Enum Master Dictionary', icon: Layers },
        { id: 'lookup-master', label: 'Lookup Masters', icon: Sliders },
        { id: 'lookup-data', label: 'Lookup Mapping Data', icon: MapPin }
      ]
    },
    {
      id: 'fiscal-period-config',
      label: '2. Fiscal Period Setup',
      icon: Calendar,
      items: [
        { id: 'fiscal-period', label: 'Fiscal Year & Accounting Period Setup', icon: Calendar, badge: 'Active' }
      ]
    },
    {
      id: 'ledger-registry',
      label: '3. Chart of Accounts Registry',
      icon: Briefcase,
      items: [
        { id: 'coa-register', label: 'Chart of Accounts Register', icon: Database },
        { id: 'add-edit-account', label: 'Create/Edit Accounts', icon: PlusCircle },
        { id: 'import-template', label: 'Bulk XLS/CSV Import', icon: Upload },
        { id: 'audit-trail', label: 'Continuous Audit Trail', icon: History }
      ]
    },
    {
      id: 'control-policies',
      label: '4. Control & Auditing Rules',
      icon: FolderLock,
      items: [
        { id: 'subledger-setup', label: 'Subsidiary Ledger Rules', icon: Boxes },
        { id: 'posting-matrix', label: 'Voucher posting Matrix', icon: Scale },
        { id: 'business-rules', label: 'ERCA/IFRS Biz Logic', icon: ShieldCheck },
        { id: 'validation-messages', label: 'Validation Errors Log', icon: AlertTriangle, badge: 'Scan' }
      ]
    },
    {
      id: 'financial-reports',
      label: '5. Compliant Statements & Books',
      icon: FileBarChart2,
      items: [
        { id: 'balance-sheet', label: '1. Financial Position (BS)', icon: FileText },
        { id: 'income-statement', label: '2. Profit & Loss (P&L)', icon: FileText },
        { id: 'cashflows', label: '3. Statement of Cash Flows', icon: FileText },
        { id: 'changes-equity', label: '4. Changes in Equity', icon: FileText },
        { id: 'financial-statements', label: '5. Trial Balance Auditor Spec', icon: FileText },
        { id: 'ledger-card', label: '6. General Ledger Cards', icon: FileText, badge: 'New' },
        { id: 'journal-register', label: '7. Journal Transaction Book', icon: BookOpen }
      ]
    },
    {
      id: 'specifications',
      label: '6. Compliance Mappings & APIs',
      icon: ShieldCheck,
      items: [
        { id: 'ifrs-classification', label: 'IFRS Classification Standards', icon: BookOpen },
        { id: 'ethiopian-tax', label: 'Ethiopian Tax System', icon: Percent },
        { id: 'api-endpoints', label: 'System ERP API Specs', icon: Terminal },
        { id: 'dev-implementation-guide', label: 'Developer Implementation Guide', icon: Terminal, badge: 'Qelem' }
      ]
    }
  ];

  // Map sub-tabs to their parent groups for default expansion behavior
  const getParentGroupIdOfTab = (tabId: string): string => {
    for (const group of mainMenus) {
      if (group.items.some(item => item.id === tabId)) {
        return group.id;
      }
    }
    return 'dictionary-lookups'; // fallback
  };

  // State to track expanded / collapsed main menus
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'dictionary-lookups': true,
    'fiscal-period-config': true,
    'ledger-registry': true
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
      className="fixed left-0 top-0 h-full w-[280px] bg-[#0c142c] border-r border-[#1e2e61] flex flex-col z-50 select-none text-slate-300 shadow-xl overflow-hidden"
    >
      {/* Dynamic top safety line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-full shrink-0"></div>

      {/* Corporate Branding Area */}
      <div className="px-6 py-5 shrink-0 bg-[#070b1b] border-b border-[#1b2a59] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#24389c] border border-amber-500/60 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#24389c]/40 shrink-0 relative overflow-hidden">
            {/* Gold Accent Arc */}
            <div className="absolute top-0 right-0 w-5 h-5 border border-amber-500 rounded-full translate-x-2.5 -translate-y-2.5"></div>
            <span className="font-sans font-black text-xs text-amber-400">QM</span>
          </div>
          <div>
            <h1 className="font-sans text-sm font-black text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>QELEM MEDA ERP</span>
            </h1>
            <p className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mt-1.5 leading-none font-mono">
              IFRS Certified • v4.1
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Telemetry HUD - Compact */}
      <div className="px-5 py-2.5 border-b border-[#131b35] bg-[#090f23] text-[9px] font-mono flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-400">Ledger Status:</span>
          <span className="text-emerald-400 font-extrabold uppercase">Live Connection</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Lock className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-slate-400">SSL Encrypted</span>
        </div>
      </div>

      {/* Quick Access Workstations Section */}
      <div className="px-4 py-3.5 border-b border-[#1b2a59] bg-[#070b1b]/50 space-y-2 shrink-0">
        <span className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
          Central Workspaces
        </span>
        <button
          onClick={onCreateAccount}
          className="w-full bg-[#24389c] hover:bg-[#1f3085] text-white py-1.8 h-8 px-3 rounded-lg font-sans text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-950/20"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">Add Account Node</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onImportCOA}
            className="bg-[#121c42] border border-[#1e2a5c] text-cyan-400 hover:bg-[#182554] hover:text-cyan-300 py-1.5 px-2.5 rounded-lg font-sans text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all truncate"
            title="Import Excel Template"
          >
            <Upload className="w-3 h-3 shrink-0" />
            <span>Excel Imp</span>
          </button>

          <button
            onClick={onValidateSetup}
            className="bg-[#121c42] border border-[#1e2a5c] text-amber-400 hover:bg-[#1c243f] hover:text-amber-300 py-1.5 px-2.5 rounded-lg font-sans text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all truncate"
            title="Validate Schema Rules"
          >
            <AlertTriangle className="w-3 h-3 shrink-0 text-amber-500" />
            <span>Validate Rules</span>
          </button>
        </div>

        <button
          onClick={onExportSetup}
          className="w-full bg-[#0d163a]/50 hover:bg-[#121d4c] border border-[#1a275a] text-emerald-400 py-1.5 px-3 rounded-lg font-sans text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 mt-1"
        >
          <FileDown className="w-3 h-3 shrink-0 text-emerald-500" />
          <span>Export Schema Spec (JSON)</span>
        </button>
      </div>

      {/* Main Hierarchical Navigation Area */}
      <nav id="sidebar-tabs-nav" className="flex-1 space-y-2 px-3 py-4 overflow-y-auto min-h-0 select-none scrollbar-thin scrollbar-thumb-slate-800">
        {mainMenus.map((group) => {
          const isGroupExpanded = !!expandedGroups[group.id];
          const GroupIcon = group.icon;
          
          // Check if any of children inside this group is selected
          const isChildSelected = group.items.some(item => {
            if (item.id === 'balance-sheet' && activeTab === 'financial-statements') return true;
            return activeTab === item.id;
          });

          return (
            <div key={group.id} className="border border-[#172554]/40 bg-[#0d1633]/60 rounded-xl overflow-hidden shadow-xs">
              {/* Expandable Group Title Tab */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-all duration-150 text-left outline-none ${
                  isChildSelected 
                    ? 'bg-indigo-950/40 text-cyan-400 border-l-[3.5px] border-cyan-400/80 font-black'
                    : 'text-slate-350 hover:bg-[#111936] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GroupIcon className={`w-4 h-4 shrink-0 transition-transform ${isChildSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider truncate">
                    {group.label}
                  </span>
                </div>
                <div>
                  {isGroupExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>
              </button>

              {/* Collapsed/Expanded Nested Submenu items */}
              {isGroupExpanded && (
                <div className="bg-[#090f23]/90 border-t border-[#131d42] py-1.5 pl-2 pr-1 space-y-0.5 animate-fadeIn">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    // Handle specific sub-routes matching (e.g. balance sheet can be a specific view inside statements, or activeTab map)
                    const isSelected = activeTab === item.id || 
                      (item.id === 'balance-sheet' && activeTab === 'financial-statements');

                    return (
                      <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => onNavigate(item.id)}
                        className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 text-left ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-950 to-[#0e163b] text-white font-extrabold border-l-2 border-indigo-400 pl-4.5 shadow-inner'
                            : 'text-slate-400 hover:bg-[#111936] hover:text-white pl-4'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                          <span className="font-sans text-xs tracking-tight truncate leading-none">
                            {item.label}
                          </span>
                        </div>

                        {item.badge && (
                          <span className={`text-[8px] font-black uppercase tracking-widest font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            item.badge === 'Active' 
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/60' 
                              : 'bg-amber-950/80 text-amber-400 border border-amber-900/60'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="py-4 bg-[#070b1b] border-t border-[#132049]/40 shrink-0 text-center select-none">
        <span className="text-[9px] font-mono font-extrabold text-indigo-500/50 uppercase tracking-widest">
          QM AMS WORKSPACE • © 2026
        </span>
      </div>
    </aside>
  );
}

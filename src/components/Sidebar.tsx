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
  Users
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
        { id: 'import-template', label: 'Bulk XLS/CSV Import', icon: Upload },
        { id: 'enum-master', label: 'Enum Master Dictionary', icon: Layers },
        { id: 'lookup-master', label: 'Lookup Masters', icon: Sliders },
        { id: 'lookup-data', label: 'Lookup Mapping Data', icon: MapPin }
      ]
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: SlidersHorizontal,
      items: [
        { id: 'journal-register', label: 'Journal Transaction Book', icon: BookOpen },
        { id: 'budget-setup', label: 'Budget Setup & Controls', icon: Coins, badge: 'Active' },
        { id: 'posting-matrix', label: 'Voucher posting Matrix', icon: Scale }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileBarChart2,
      items: [
        { id: 'financial-statements', label: 'Trial Balance Auditor Spec', icon: FileText },
        { id: 'balance-sheet', label: '1. Financial Position (BS)', icon: FileText },
        { id: 'income-statement', label: '2. Profit & Loss (P&L)', icon: FileText },
        { id: 'cashflows', label: '3. Statement of Cash Flows', icon: FileText },
        { id: 'changes-equity', label: '4. Changes in Equity', icon: FileText },
        { id: 'ledger-card', label: '6. General Ledger Cards', icon: FileText, badge: 'New' },
        { id: 'audit-trail', label: 'Continuous Audit Trail', icon: History }
      ]
    },
    {
      id: 'apar-subledger',
      label: 'AP & AR Subledger',
      icon: Briefcase,
      items: [
        { id: 'apar-overview', label: 'AP / AR Dashboard', icon: FileText },
        { id: 'apar-suppliers', label: 'Supplier Registry', icon: Users },
        { id: 'apar-customers', label: 'Customer Registry', icon: Users },
        { id: 'apar-gating', label: 'Live Compliance Gating', icon: ShieldCheck },
        { id: 'apar-controls', label: 'AP / AR Setup Controls', icon: Settings },
        { id: 'apar-compliance', label: 'ERCA Tax Compliance', icon: Percent }
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
        { id: 'api-endpoints', label: 'System ERP API Specs', icon: Terminal },
        { id: 'dev-implementation-guide', label: 'Developer Guide', icon: Terminal, badge: 'ABC' }
      ]
    }
  ];

  // Map sub-tabs to their parent groups for default expansion behavior
  const getParentGroupIdOfTab = (tabId: string): string => {
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
    'master-data': true,
    'transactions': true,
    'apar-subledger': true
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
            <span className="text-slate-400 font-medium">Secured Node Connection</span>
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
                  {group.items.map((item) => {
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
                  })}
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

import React from 'react';
import { Search, Bell, HelpCircle, Plus, FileDown, Layers, Settings } from 'lucide-react';

interface HeaderProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewEntryOpen: () => void;
  onExport: (format: 'PDF' | 'Excel') => void;
  notificationsCount: number;
  onNotificationsClick: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({
  activeScreen,
  onScreenChange,
  searchQuery,
  onSearchChange,
  onNewEntryOpen,
  onExport,
  notificationsCount,
  onNotificationsClick,
  sidebarCollapsed = false
}: HeaderProps) {
  // Check if current screen is under the reporting umbrella
  // Any of the financial statement pages count as reporting
  const isReporting = ['financial-statements', 'cashflows', 'balance-sheet', 'income-statement', 'changes-equity'].includes(activeScreen);

  const reports = [
    { id: 'balance-sheet', label: 'Financial Position' },
    { id: 'income-statement', label: 'Comprehensive Income' },
    { id: 'cashflows', label: 'Cash Flows' },
    { id: 'changes-equity', label: 'Changes in Equity' },
    { id: 'financial-statements', label: 'Trial Balance Verification' }
  ];

  return (
    <header className={`flex items-center justify-between h-16 px-6 bg-slate-50 border-b border-slate-200 fixed top-0 left-0 z-40 transition-all duration-300 select-none ${
      sidebarCollapsed ? 'ml-[72px] w-[calc(100%-72px)]' : 'ml-[280px] w-[calc(100%-280px)]'
    }`}>
      {/* Search Bar & Primary Report Switches */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="relative flex items-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-[#c5c6cd] dark:border-slate-705 shadow-xs shrink-0">
          <Search className="text-[#75777d] h-3.5 w-3.5 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-[#1b1b1d] dark:text-slate-100 placeholder:text-[#75777d] w-48 lg:w-64 focus:ring-0 font-sans"
            placeholder="Search accounts, codes or systems..."
          />
        </div>

        {/* Dynamic Report Horizontal Navigation (Shown when viewing reports) */}
        {isReporting && (
          <nav className="hidden lg:flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-4 h-8 overflow-x-auto">
            {reports.map((report) => {
              const active = activeScreen === report.id || 
                (report.id === 'balance-sheet' && activeScreen === 'financial-statements');
              return (
                <button
                  key={report.id}
                  onClick={() => onScreenChange(report.id)}
                  className={`text-xs font-bold px-3 py-1.5 transition-all rounded duration-150 cursor-pointer text-nowrap ${
                    active
                      ? 'text-[#0051d5] dark:text-[#b4c5ff] bg-slate-200/60 dark:bg-slate-800'
                      : 'text-slate-600 hover:text-[#0051d5] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {report.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Export Actions & Notification Elements */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Export Buttons */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onExport('PDF')}
            className="flex items-center gap-1.5 text-xs text-[#45474c] hover:text-[#0051d5] dark:text-slate-300 dark:hover:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Download PDF statement"
          >
            <FileDown className="h-4 w-4 text-rose-500" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => onExport('Excel')}
            className="flex items-center gap-1.5 text-xs text-[#45474c] hover:text-[#0051d5] dark:text-slate-300 dark:hover:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Download Excel spreadsheet"
          >
            <FileDown className="h-4 w-4 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={onNotificationsClick}
            className="p-1.5 rounded-full text-[#45474c] dark:text-slate-300 hover:bg-slate-105 dark:hover:bg-slate-800 transition-all cursor-pointer relative"
          >
            <Bell className="h-4.5 w-4.5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-650 rounded-full border-2 border-slate-50 dark:border-slate-900" />
            )}
          </button>
        </div>

        {/* System Settings */}
        <button
          onClick={() => alert("All security configs are controlled in process.env. Locked under key.")}
          className="flex items-center gap-1.5 text-xs text-[#45474c] hover:text-[#0051d5] dark:text-slate-300 dark:hover:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
          title="System settings"
        >
          <Settings className="h-4.5 w-4.5 text-slate-500" />
          <span className="hidden xl:inline">System Settings</span>
        </button>

        {/* User Manual Doc */}
        <button 
          onClick={() => alert("Central ERP validation rules: contact security admin or view user instruction guide.")}
          className="flex items-center gap-1.5 text-xs text-[#45474c] hover:text-[#0051d5] dark:text-slate-300 dark:hover:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
          title="User Manual Doc"
        >
          <HelpCircle className="h-4.5 w-4.5 text-slate-500" />
          <span className="hidden xl:inline">User Manual Doc</span>
        </button>

        {/* New Entry CTA */}
        <button
          onClick={onNewEntryOpen}
          className="bg-slate-950 hover:bg-slate-800 text-white dark:bg-blue-620 dark:hover:bg-blue-530 px-3 py-2 rounded-lg font-bold text-xs transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Entry</span>
        </button>

        {/* Separator before profile */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* Auditor User Profile Info */}
        <div className="flex items-center gap-2 pl-1 select-none">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-650 text-white flex items-center justify-center text-xs font-black font-mono shadow-inner">
              LA
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 shadow-md animate-pulse" title="System Online"></span>
          </div>
          <div className="hidden lg:block text-left leading-none">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Lead Auditor</p>
            <p className="text-[9px] text-[#0051d5] dark:text-indigo-400 font-extrabold uppercase tracking-wider font-mono mt-0.5 leading-none">
              Lead Fin Auditor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

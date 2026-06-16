import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Edit3, 
  History, 
  ChevronRight,
  ChevronDown,
  Database,
  Building2,
  FileCheck,
  MapPin,
  Folder,
  FolderOpen,
  FileText,
  Lock,
  Compass,
  ArrowRight,
  ListFilter,
  Layers,
  Settings2,
  Columns,
  Grid
} from 'lucide-react';
import { Account, AccountType, AccountStatus, ApprovalStatus } from '../types';
import { COMPANIES, BRANCHES, ACCOUNT_TYPES } from '../data';
import BusinessTooltip from './BusinessTooltip';

interface COARegisterTabProps {
  accounts: Account[];
  onEditAccount: (account: Account) => void;
  onSubmitAccount: (id: string) => void;
  onApproveAccount: (id: string) => void;
  onRejectAccount: (id: string) => void;
  onUpdateStatus: (id: string, status: AccountStatus) => void;
  onViewAuditTrail: (code: string) => void;
  searchQuery: string;
}

export default function COARegisterTab({
  accounts,
  onEditAccount,
  onSubmitAccount,
  onApproveAccount,
  onRejectAccount,
  onUpdateStatus,
  onViewAuditTrail,
  searchQuery: initialSearchQuery
}: COARegisterTabProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewDetailAccount, setViewDetailAccount] = useState<Account | null>(null);

  // View modes: 'tree' (premium nested folder layout) or 'table' (flat columns layout)
  const [viewLayout, setViewLayout] = useState<'tree' | 'table'>('tree');
  // Secondary toggle for technical specs inside view mode
  const [viewMode, setViewMode] = useState<'business' | 'developer'>('business');

  // Expanded nodes state for interactive tree structures (defaults some main root groups to open!)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    '1000': true,
    '1100': true,
    '2000': true,
    '3000': true,
    '4000': true,
    '5000': true,
    '6000': true
  });

  const toggleNode = (code: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    accounts.forEach(a => {
      allExpanded[a.code] = true;
    });
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const query = localSearch || initialSearchQuery;

  // --- STAGE 1: PERFECT HIERARCHICAL SEQUENCE SORTING ---
  // Recursively traverses root nodes and nested children to guarantee perfect sequence by numerical code & tree relationship
  const sequencedAllAccounts = useMemo(() => {
    const roots = accounts.filter(a => !a.parentAccount || a.parentAccount === 'None');
    // Sort top levels numerically by code
    roots.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

    const result: Account[] = [];

    const traverse = (parentCode: string) => {
      const children = accounts.filter(a => a.parentAccount === parentCode);
      // Sort children numerically by code under parent
      children.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

      for (const child of children) {
        result.push(child);
        traverse(child.code);
      }
    };

    for (const root of roots) {
      result.push(root);
      traverse(root.code);
    }

    // Capture orphans (accounts with parental ties that became decoupled)
    const orphans = accounts.filter(a => !result.some(r => r.id === a.id));
    if (orphans.length > 0) {
      orphans.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
      result.push(...orphans);
    }

    return result;
  }, [accounts]);

  // --- STAGE 2: ADAPTIVE FILTERS ---
  const filteredAccounts = useMemo(() => {
    return sequencedAllAccounts.filter(acc => {
      const matchesSearch = 
        acc.code.toLowerCase().includes(query.toLowerCase()) ||
        acc.name.toLowerCase().includes(query.toLowerCase()) ||
        acc.ifrsClass.toLowerCase().includes(query.toLowerCase()) ||
        (acc.subgroup && acc.subgroup.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCompany = selectedCompany === 'All' || acc.company === selectedCompany;
      const matchesBranch = selectedBranch === 'All' || acc.branch === selectedBranch;
      const matchesType = selectedType === 'All' || acc.accountType === selectedType;
      const matchesStatus = selectedStatus === 'All' || acc.status === selectedStatus;

      return matchesSearch && matchesCompany && matchesBranch && matchesType && matchesStatus;
    });
  }, [sequencedAllAccounts, query, selectedCompany, selectedBranch, selectedType, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === 'Active').length,
      pending: accounts.filter(a => a.status === 'Pending Approval' || a.approvalStatus === 'Submitted').length,
      draft: accounts.filter(a => a.status === 'Draft' || a.approvalStatus === 'Not Submitted').length,
    };
  }, [accounts]);

  // Helper inside tree to determine if parent is collapsed
  const isNodeHiddenByParent = (acc: Account): boolean => {
    if (query) return false; // Never hide in search results so everything matches
    let parentCode = acc.parentAccount;
    while (parentCode && parentCode !== 'None') {
      if (expandedNodes[parentCode] === false) {
        return true;
      }
      const parentNode = accounts.find(a => a.code === parentCode);
      parentCode = parentNode ? parentNode.parentAccount : 'None';
    }
    return false;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header Card */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 matches-title">
              <span>Chart of Accounts</span>
              <BusinessTooltip text="The structured register of all ledger accounts in the financial system. Organizes assets, liabilities, equity, revenues, and expenses for comprehensive company records." />
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Review and structure your corporate financial accounts using standard compliance parameters, custom branches, and subledgers. All entries automatically maintain sequencing checks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
            Active Workspace
          </span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-colors">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total COA Accounts</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Sequenced registry
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Active & Unlocked */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-colors">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active & Unlocked</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</h3>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready for posting
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50/50 border border-emerald-100/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Awaiting Reviews */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-colors">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Review</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</h3>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Requires audit sign-off
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50/50 border border-amber-100/50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Draft & Returned */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-colors">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draft / Setup</p>
            <h3 className="text-2xl font-black text-slate-600 mt-1">{stats.draft}</h3>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Incomplete rules
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Spreadsheet Filter Control Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Internal search filter */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input 
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 font-sans"
              placeholder="Search code, name or class..."
            />
          </div>

          <div className="flex items-center gap-1">
            <Building2 className="w-3 text-slate-400 shrink-0" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-700 font-bold cursor-pointer"
            >
              <option value="All">All Companies</option>
              {COMPANIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3 text-slate-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-700 font-bold cursor-pointer"
            >
              <option value="All">All Branches</option>
              {BRANCHES.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <ListFilter className="w-3 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-700 font-bold cursor-pointer"
            >
              <option value="All">All Types</option>
              {ACCOUNT_TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <FileCheck className="w-3 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-700 font-bold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Pending Approval">Awaiting Approval</option>
              <option value="Draft">Drafts</option>
              <option value="Inactive">Frozen/Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Dynamic Display Multi-Layout Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Main Layout Selector */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 text-[10px] font-bold">
            <button
              onClick={() => setViewLayout('tree')}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${viewLayout === 'tree' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="Interactive folding ledger folder tree"
            >
              <Compass className="w-3 h-3" />
              <span>Interactive Tree</span>
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`px-3 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${viewLayout === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="Spreadsheet linear database view"
            >
              <Columns className="w-3 h-3" />
              <span>Spreadsheet Grid</span>
            </button>
          </div>

          {/* Business vs Dev Mode Toggle */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 text-[10px] font-bold">
            <button
              onClick={() => setViewMode('business')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${viewMode === 'business' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Business Specs
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${viewMode === 'developer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              System Fields
            </button>
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 rounded border px-2 py-1">
            {filteredAccounts.length} item{filteredAccounts.length !== 1 ? 's' : ''} listed
          </div>
        </div>
      </div>

      {/* --- ACTIVE WORKSPACE: INTERACTIVE TREE VIEW --- */}
      {viewLayout === 'tree' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Interactive Hierarchical Tree Workspace</span>
              <BusinessTooltip text="Click folders to expand or collapse child accounts. Guidelines draw the vertical parent-child inheritance trace." />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={expandAll}
                className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer"
              >
                Expand All
              </button>
              <button 
                onClick={collapseAll}
                className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {filteredAccounts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-semibold italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                No General Ledger hierarchy accounts found matching the criteria.
              </div>
            ) : (
              // Filter active listed elements
              filteredAccounts.map(acc => {
                const isHidden = isNodeHiddenByParent(acc);
                if (isHidden) return null;

                const hasChildren = accounts.some(a => a.parentAccount === acc.code);
                const isExpanded = expandedNodes[acc.code] !== false;
                const isSummaryNode = !acc.postingAllowed;
                const levelIndent = (acc.level - 1) * 28;

                return (
                  <div
                    key={acc.id}
                    className={`group relative flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                      isSummaryNode 
                        ? 'bg-slate-50/50 border-slate-200 hover:bg-slate-50' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                    style={{ marginLeft: `${levelIndent}px` }}
                  >
                    {/* Visual guidelines guide trace */}
                    {acc.level > 1 && (
                      <div 
                        className="absolute top-0 bottom-0 border-l border-dashed border-indigo-200/60" 
                        style={{ left: `-${14}px` }}
                      />
                    )}

                    {/* Account Ident details */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Interactive Expand Drop Trigger */}
                      {isSummaryNode && hasChildren ? (
                        <button
                          onClick={() => toggleNode(acc.code)}
                          className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {acc.level > 1 && <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                        </div>
                      )}

                      {/* Folder / File icon identifier */}
                      <span className={`p-1.5 rounded-lg shrink-0 ${isSummaryNode ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                        {isSummaryNode ? (
                          isExpanded ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </span>

                      {/* Numerical Code */}
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/60 shrink-0">
                        {acc.code}
                      </span>

                      {/* Name & Mappings */}
                      <div className="truncate min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`truncate text-xs ${isSummaryNode ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-800'}`}>
                            {acc.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-405 shrink-0">
                            {isSummaryNode ? '• Folder' : '• Direct Post'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                          <span className="font-medium text-slate-600">{acc.company.replace('QM AMS ', '')}</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-mono">{acc.branch}</span>
                          {!isSummaryNode && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-500 truncate font-mono max-w-[220px]" title={acc.ifrsClass}>{acc.ifrsClass}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata column parameters */}
                    <div className="mt-3 md:mt-0 flex flex-wrap items-center justify-end gap-3 shrink-0 pl-7 md:pl-0">
                      {/* Classification types */}
                      <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border ${
                        acc.accountType === 'Asset' ? 'bg-blue-50/60 text-blue-700 border-blue-150' :
                        acc.accountType === 'Liability' ? 'bg-red-50/60 text-red-700 border-red-150' :
                        acc.accountType === 'Equity' ? 'bg-indigo-50/60 text-indigo-700 border-indigo-150' :
                        acc.accountType === 'Revenue' ? 'bg-emerald-50/60 text-emerald-700 border-emerald-150' :
                        acc.accountType === 'Cost of Sales' ? 'bg-amber-50/60 text-amber-700 border-amber-150' :
                        'bg-slate-50 text-slate-705 border-slate-150'
                      }`}>
                        {acc.accountType}
                      </span>

                      {/* Normal Bal */}
                      <span className="text-[10px] font-mono font-bold text-slate-650 bg-slate-50 border px-1.5 py-0.5 rounded">
                        {acc.balance}
                      </span>

                      {/* Active Status Badge */}
                      <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        acc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        acc.status === 'Draft' ? 'bg-slate-50 text-slate-600 border border-slate-200' :
                        acc.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-250'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${acc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span>{acc.status === 'Pending Approval' ? 'REVIEW' : acc.status.toUpperCase()}</span>
                      </span>

                      {/* Actions Cluster */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewDetailAccount(acc)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                          title="View Specifications"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditAccount(acc)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg transition-all cursor-pointer"
                          title="Modify Account"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Submit to review */}
                        {acc.approvalStatus === 'Not Submitted' && (
                          <button
                            onClick={() => onSubmitAccount(acc.id)}
                            className="px-2 py-1 bg-cyan-50 hover:bg-cyan-600 hover:text-white text-cyan-700 text-[10px] font-black rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                          >
                            Submit
                          </button>
                        )}

                        {/* Approve & Reject commands */}
                        {acc.approvalStatus === 'Submitted' && (
                          <>
                            <button
                              onClick={() => onApproveAccount(acc.id)}
                              className="p-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer"
                              title="Approve Account"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onRejectAccount(acc.id)}
                              className="p-1 text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all cursor-pointer"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* Freeze & Activation adjustments */}
                        {acc.status === 'Active' ? (
                          <button
                            onClick={() => onUpdateStatus(acc.id, 'Inactive')}
                            className="px-2 py-0.8 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg border border-amber-200 transition-all cursor-pointer"
                            title="Deactivate postings"
                          >
                            Freeze
                          </button>
                        ) : (
                          acc.status === 'Inactive' && (
                            <button
                              onClick={() => onUpdateStatus(acc.id, 'Active')}
                              className="px-2 py-0.8 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 hover:bg-emerald-605 hover:text-white rounded-lg border border-emerald-200 transition-all cursor-pointer"
                            >
                              Unlock
                            </button>
                          )
                        )}

                        {/* Auditor Logs audit jump */}
                        <button
                          onClick={() => onViewAuditTrail(acc.code)}
                          className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer"
                          title="View log sequence"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* --- STANDBY: LARGE SPREADSHEET TABLE GRID VIEW --- */}
      {viewLayout === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table id="coa-register-grid" className="w-full text-left border-collapse min-w-[1500px] table-fixed">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-white select-none">
                  <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Account Code</th>
                  <th className="w-[280px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Account Name</th>
                  <th className="w-[190px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Corporate Unit</th>
                  {viewMode === 'business' ? (
                    <>
                      <th className="w-[140px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Classification Type</th>
                      <th className="w-[300px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">IFRS IAS Mapped Standard</th>
                      <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-right">Normal Bal</th>
                      <th className="w-[140px] px-3 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Posting Mode</th>
                      <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Audit Authority</th>
                    </>
                  ) : (
                    <>
                      <th className="w-[140px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Sublist Type</th>
                      <th className="w-[100px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Depth Level</th>
                      <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Rollup Parent</th>
                      <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Ctrl Lead</th>
                      <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Sec Flags</th>
                      <th className="w-[110px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Local Tax Code</th>
                    </>
                  )}
                  <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Active Status</th>
                  <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Approval State</th>
                  <th className="w-[205px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Ledger Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-705">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-16 text-center text-slate-400 text-sm font-semibold italic bg-slate-50/50">
                      No General Ledger accounts found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const levelIndent = (acc.level - 1) * 16;
                    const isSummaryNode = !acc.postingAllowed;
                    return (
                      <tr 
                        key={acc.id} 
                        className={`hover:bg-slate-50/80 transition-colors group align-middle ${isSummaryNode ? 'bg-slate-50/30' : ''}`}
                      >
                        {/* Code */}
                        <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-700 select-all">
                          {acc.code}
                        </td>
  
                        {/* Name with hierarchical spacing */}
                        <td className="px-4 py-3 truncate" title={acc.name}>
                          <div className="flex items-center" style={{ paddingLeft: `${levelIndent}px` }}>
                            {acc.level > 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />}
                            <span className={`truncate ${acc.postingAllowed ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-950 uppercase text-[10.5px] bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-150/50'}`}>
                              {acc.name}
                            </span>
                          </div>
                        </td>
  
                        {/* Company / Branch combo */}
                        <td className="px-4 py-3 text-xs text-slate-600 truncate">
                          <div className="font-semibold">{acc.company.replace('QM AMS ', '')}</div>
                          <div className="text-[10px] text-slate-450 font-mono mt-0.5">{acc.branch}</div>
                        </td>
  
                        {viewMode === 'business' ? (
                          <>
                            {/* Classification Type */}
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.8 rounded border ${
                                acc.accountType === 'Asset' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                                acc.accountType === 'Liability' ? 'bg-red-50 text-red-700 border-red-150' :
                                acc.accountType === 'Equity' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                                acc.accountType === 'Revenue' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                                acc.accountType === 'Cost of Sales' ? 'bg-amber-50 text-amber-700 border-amber-150' :
                                'bg-slate-50 text-slate-700 border-slate-150'
                              }`}>
                                {acc.accountType}
                              </span>
                            </td>
  
                            {/* IFRS Standard Mapped */}
                            <td className="px-4 py-3 text-xs text-slate-600 truncate font-medium" title={acc.ifrsClass}>
                              {acc.ifrsClass}
                            </td>
  
                            {/* Normal Balance */}
                            <td className="px-4 py-3 text-xs font-mono font-bold text-right text-slate-900">
                              {acc.balance}
                            </td>
  
                            {/* Posting Allowed Badges */}
                            <td className="px-3 py-3 text-center1">
                              <div className="flex justify-center">
                                {acc.postingAllowed ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-750 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-150 px-2 py-0.5 rounded">
                                    General Ledger
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-extrabold text-[9px] uppercase tracking-wider border border-indigo-150 px-2 py-0.5 rounded">
                                    Summary Node
                                  </span>
                                )}
                              </div>
                            </td>
  
                            {/* Auditor ID */}
                            <td className="px-4 py-3 text-[11px] text-slate-500 font-mono text-center">
                              {acc.createdBy ? acc.createdBy.replace('mzerihun01@gmail.com', 'Lead Auditor') : 'System'}
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Subgroup */}
                            <td className="px-4 py-3 text-xs text-slate-600 font-mono truncate" title={acc.subgroup}>
                              {acc.subgroup || '—'}
                            </td>
  
                            {/* Depth Level */}
                            <td className="px-4 py-3 text-center font-mono font-bold text-slate-500">
                              L{acc.level}
                            </td>
  
                            {/* Parent Code */}
                            <td className="px-4 py-3 font-mono text-xs text-slate-500 uppercase truncate">
                              {acc.parentAccount === 'None' ? <span className="text-slate-405 italic text-[10px]">Root Group</span> : acc.parentAccount}
                            </td>
  
                            {/* Control Account */}
                            <td className="px-4 py-3 text-center">
                              {acc.controlAccount ? (
                                <span className="bg-purple-100 text-purple-800 font-black text-[9px] px-1.5 py-0.5 rounded">
                                  CONTROL
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded">
                                  DIRECT
                                </span>
                              )}
                            </td>
  
                            {/* Security flags: system posting only / manual allowed */}
                            <td className="px-4 py-3 text-center">
                              {acc.systemPostingOnly ? (
                                <span className="text-[9px] text-[#0051d5] font-black uppercase tracking-wider font-mono">Sys ONLY</span>
                              ) : (
                                <span className="text-[9px] text-slate-500 font-medium font-mono">Manual OK</span>
                              )}
                            </td>
  
                            {/* Local Ethiopian Tax Code mapping */}
                            <td className="px-4 py-3 text-xs text-slate-500 font-mono truncate">
                              {acc.ethiopianTaxCategory || 'VAT-EXEMPT'}
                            </td>
                          </>
                        )}
  
                        {/* Active Status */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            acc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            acc.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                            acc.status === 'Pending Approval' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span>{acc.status === 'Pending Approval' ? 'PENDING' : acc.status.toUpperCase()}</span>
                          </span>
                        </td>
  
                        {/* Approval Status */}
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.8 rounded-md border ${
                            acc.approvalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                            acc.approvalStatus === 'Submitted' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                            acc.approvalStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-250' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {acc.approvalStatus === 'Submitted' ? 'REVIEWING' : acc.approvalStatus}
                          </span>
                        </td>
  
                        {/* Actions Cluster Column */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View specs */}
                            <button
                              onClick={() => setViewDetailAccount(acc)}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                              title="Expand Specification Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
  
                            {/* Edit node */}
                            <button
                              onClick={() => onEditAccount(acc)}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg transition-all cursor-pointer"
                              title="Modify Account Specifications"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
  
                            {/* Submit to review */}
                            {acc.approvalStatus === 'Not Submitted' && (
                              <button
                                onClick={() => onSubmitAccount(acc.id)}
                                className="px-2 py-1 bg-cyan-50 hover:bg-cyan-600 hover:text-white text-cyan-700 text-[10px] font-black rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                                title="Submit general ledger node to auditor validation queue"
                              >
                                Submit
                              </button>
                            )}
  
                            {/* Approve */}
                            {acc.approvalStatus === 'Submitted' && (
                              <button
                                onClick={() => onApproveAccount(acc.id)}
                                className="p-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer"
                                title="Approve node rules and open ledger"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
  
                            {/* Reject */}
                            {acc.approvalStatus === 'Submitted' && (
                              <button
                                onClick={() => onRejectAccount(acc.id)}
                                className="p-1 text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all cursor-pointer"
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
  
                            {/* Freeze / Active toggle buttons */}
                            {acc.status === 'Active' ? (
                              <button
                                onClick={() => onUpdateStatus(acc.id, 'Inactive')}
                                className="px-2 py-1 text-[10px] font-black uppercase text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg border border-amber-200 transition-all cursor-pointer"
                                title="Deactivate ledger postings"
                              >
                                Freeze
                              </button>
                            ) : (
                              acc.status === 'Inactive' && (
                                <button
                                  onClick={() => onUpdateStatus(acc.id, 'Active')}
                                  className="px-2 py-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 hover:bg-emerald-605 hover:text-white rounded-lg border border-emerald-250 transition-all cursor-pointer"
                                  title="Unfreeze and activate"
                                >
                                  Unlock
                                </button>
                              )
                            )}
  
                            {/* Jump to Audit page */}
                            <button
                              onClick={() => onViewAuditTrail(acc.code)}
                              className="p-1 text-slate-400 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              title="Inspect audit trail"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ACCOUNT SPECIFICATION DISPLAY OVERLAY MODAL --- */}
      {viewDetailAccount && (
        <div id="full-viewer-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white select-none">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-400">Account Specifications</span>
                <h4 className="font-sans font-black text-lg text-white mt-1 leading-none truncate flex items-center gap-2">
                  <span className="bg-indigo-650 px-2 py-0.5 rounded text-xs select-all text-indigo-100">{viewDetailAccount.code}</span>
                  <span className="truncate">{viewDetailAccount.name}</span>
                </h4>
              </div>
              <button 
                onClick={() => setViewDetailAccount(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-805 transition-all text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Double Column Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Structural Position */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Structural Position</span>
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Normal Balance:</span> 
                      <span className="font-bold font-mono text-slate-900">{viewDetailAccount.balance}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Hierarchical Level:</span> 
                      <span className="font-bold font-mono text-slate-900">L{viewDetailAccount.level}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Rollup Parent:</span> 
                      <span className="font-bold font-mono text-slate-800">{viewDetailAccount.parentAccount || 'None'}</span>
                    </p>
                    <p className="flex justify-between pb-0.5">
                      <span className="text-slate-500">Company & Unit:</span> 
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{viewDetailAccount.company}</span>
                    </p>
                  </div>
                </div>

                {/* Compliance & Standards */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Compliance & IFRS Mapping</span>
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">IFRS Classification:</span> 
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{viewDetailAccount.ifrsClass}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Financial Line:</span> 
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{viewDetailAccount.financialStatementLine || 'Unspecified'}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Tax Class category:</span> 
                      <span className="font-semibold text-slate-700 font-mono">{viewDetailAccount.ethiopianTaxCategory || 'VAT-EXEMPT'}</span>
                    </p>
                    <p className="flex justify-between pb-0.5">
                      <span className="text-slate-500">VAT Scoping:</span> 
                      <span className="font-bold text-slate-800 font-mono">{viewDetailAccount.vatCode || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Posting Configuration Indicators */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">General Ledger Journal Permission Flags</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.postingAllowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-450 mb-1">Allows Postings</span>
                    <span className="font-bold">{viewDetailAccount.postingAllowed ? 'YES (LEDGER)' : 'NO (SUMMARY)'}</span>
                  </div>
                  
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.controlAccount ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-450 mb-1">Control Account</span>
                    <span className="font-bold">{viewDetailAccount.controlAccount ? 'YES (TIED SL)' : 'NO (DIRECT)'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.manualJournalAllowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-450 mb-1">Manual Entry OK</span>
                    <span className="font-bold">{viewDetailAccount.manualJournalAllowed ? 'ACCEPTED' : 'BLOCKED'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.systemPostingOnly ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-450 mb-1">System Forced</span>
                    <span className="font-bold">{viewDetailAccount.systemPostingOnly ? 'AUTO ONLY' : 'USER & AUTO'}</span>
                  </div>
                </div>
              </div>

              {/* Dimensionality Validation Criteria */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Mandatory Dimension Tags Validation Rule</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 text-center text-[10px] leading-tight">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Cost Center</span>
                    <span className="text-slate-800 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.costCenter}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Department</span>
                    <span className="text-slate-800 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.department}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Project node</span>
                    <span className="text-slate-850 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.project}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Segment unit</span>
                    <span className="text-slate-850 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.segment}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Profit Center</span>
                    <span className="text-slate-850 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.profitCenter || 'Optional'}</span>
                  </div>
                </div>
              </div>

              {/* Audit Footprint Notes */}
              {viewDetailAccount.auditTrailNotes && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 select-none">
                  <span className="text-[10px] font-bold uppercase text-slate-410 tracking-wider font-mono block">Auditor Attestation Note</span>
                  <p className="text-xs text-slate-700 italic font-mono bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    "{viewDetailAccount.auditTrailNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 select-none">
              <button
                onClick={() => setViewDetailAccount(null)}
                className="bg-slate-900 border border-slate-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-slate-850 transition-all cursor-pointer"
              >
                Close Specifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

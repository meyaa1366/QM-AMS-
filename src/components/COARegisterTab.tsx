import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Send, 
  Eye, 
  Edit3, 
  History, 
  Play, 
  SlidersHorizontal,
  ChevronRight,
  Database,
  Building2,
  FileCheck,
  MapPin
} from 'lucide-react';
import { Account, AccountType, AccountStatus, ApprovalStatus } from '../types';
import { COMPANIES, BRANCHES, ACCOUNT_TYPES } from '../data';

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

  const query = localSearch || initialSearchQuery;

  // Filter accounts accurately
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
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
  }, [accounts, query, selectedCompany, selectedBranch, selectedType, selectedStatus]);

  const [viewMode, setViewMode] = useState<'business' | 'developer'>('business');

  // Statistics
  const stats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === 'Active').length,
      pending: accounts.filter(a => a.status === 'Pending Approval' || a.approvalStatus === 'Submitted').length,
      draft: accounts.filter(a => a.status === 'Draft' || a.approvalStatus === 'Not Submitted').length,
    };
  }, [accounts]);

  return (
    <div className="space-y-6 font-sans">
      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="relative group overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-xs transition-all duration-200 hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-600"></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total COA Accounts</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1.5 leading-none">{stats.total}</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Consolidated registry nodes
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 transition-transform duration-200 group-hover:scale-105">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Active & Unlocked */}
        <div className="relative group overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-xs transition-all duration-200 hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active & Unlocked</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1.5 leading-none">{stats.active}</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Ready for journal posting
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 transition-transform duration-200 group-hover:scale-105">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Awaiting Reviews */}
        <div className="relative group overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-xs transition-all duration-200 hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Awaiting Review</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1.5 leading-none">{stats.pending}</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Auditor validation required
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 transition-transform duration-200 group-hover:scale-105">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Draft & Returned */}
        <div className="relative group overflow-hidden bg-white hover:bg-slate-50/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-xs transition-all duration-200 hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500"></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Drafts / Blocks</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1.5 leading-none">{stats.draft}</h3>
            <p className="text-[10px] font-semibold text-slate-500 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Incomplete structure rules
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 transition-transform duration-200 group-hover:scale-105">
            <Edit3 className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Spreadsheet Filter Control Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Internal search filter */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.8 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-none text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 font-sans"
              placeholder="Search code, name or class..."
            />
          </div>

          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg bg-white px-2 py-1.8 focus:outline-none font-sans text-slate-700 font-medium"
            >
              <option value="All">All Companies</option>
              {COMPANIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg bg-white px-2 py-1.8 focus:outline-none font-sans text-slate-700 font-medium"
            >
              <option value="All">All Branches</option>
              {BRANCHES.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg bg-white px-2 py-1.8 focus:outline-none font-sans text-slate-700 font-medium"
            >
              <option value="All">All Types</option>
              {ACCOUNT_TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg bg-white px-2 py-1.8 focus:outline-none font-sans text-slate-700 font-medium"
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

        {/* Switch View modes */}
        <div className="flex items-center gap-4 shrink-0 pl-1">
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200">
            <button
              onClick={() => setViewMode('business')}
              className={`px-2.5 py-1 font-bold text-[10px] rounded uppercase tracking-wider transition-all cursor-pointer ${viewMode === 'business' ? 'bg-white text-[#24389c] shadow-xs font-black' : 'text-slate-500'}`}
            >
              Business View
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={`px-2.5 py-1 font-bold text-[10px] rounded uppercase tracking-wider transition-all cursor-pointer ${viewMode === 'developer' ? 'bg-white text-[#24389c] shadow-xs font-black' : 'text-slate-500'}`}
            >
              Developer Specs
            </button>
          </div>
          <div className="text-[11px] font-mono font-bold text-slate-500">
            {filteredAccounts.length} / {accounts.length} nodes
          </div>
        </div>
      </div>

      {/* Large Scrollable Ledger Sheet Block */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-w-full">
          <table id="coa-register-grid" className="w-full text-left border-collapse min-w-[1550px] table-fixed">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-950 text-white select-none">
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
                    <th className="w-[140px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Sub-element Type</th>
                    <th className="w-[100px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Depth Lvl</th>
                    <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Rollup Parent</th>
                    <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Ctrl Lead</th>
                    <th className="w-[120px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center font-mono">Sec Rules</th>
                    <th className="w-[110px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans">Local Tax Code</th>
                  </>
                )}
                <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Active Status</th>
                <th className="w-[130px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Approval State</th>
                <th className="w-[210px] px-4 py-3.5 text-xs font-black uppercase tracking-wider font-sans text-center">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-700">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={20} className="py-16 text-center text-slate-400 text-sm font-semibold italic bg-slate-50/50">
                    No General Ledger accounts found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const levelIndent = (acc.level - 1) * 20;
                  return (
                    <tr 
                      key={acc.id} 
                      className="hover:bg-slate-50/80 transition-colors group align-middle"
                    >
                      {/* Code */}
                      <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600 select-all">
                        {acc.code}
                      </td>
 
                      {/* Name with hierarchical spacing */}
                      <td className="px-4 py-3 truncate" title={acc.name}>
                        <div className="flex items-center" style={{ paddingLeft: `${levelIndent}px` }}>
                          {acc.level > 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />}
                          <span className={`truncate ${acc.postingAllowed ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-950 uppercase text-[11px] bg-slate-100 px-1 py-0.5 rounded'}`}>
                            {acc.name}
                          </span>
                        </div>
                      </td>
 
                      {/* Company / Branch combo */}
                      <td className="px-4 py-3 text-xs text-slate-600 truncate">
                        <div className="font-semibold">{acc.company.replace('QM AMS ', '')}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{acc.branch}</div>
                      </td>
 
                      {viewMode === 'business' ? (
                        <>
                          {/* Classification Type */}
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                              acc.accountType === 'Asset' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                              acc.accountType === 'Liability' ? 'bg-red-50 text-red-700 border border-red-150' :
                              acc.accountType === 'Equity' ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' :
                              acc.accountType === 'Revenue' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                              acc.accountType === 'Cost of Sales' ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                              'bg-slate-50 text-slate-700 border border-slate-150'
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
                          <td className="px-3 py-3 text-center">
                            {acc.postingAllowed ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-750 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-150 px-2 py-0.5 rounded">
                                General Ledger
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold text-[9px] uppercase tracking-wider border border-amber-150 px-2 py-0.5 rounded">
                                Summary Node
                              </span>
                            )}
                          </td>
 
                          {/* Auditor ID */}
                          <td className="px-4 py-3 text-[11px] text-slate-500 font-mono text-center">
                            {acc.createdBy ? acc.createdBy.replace('mzerihun01@gmail.com', 'M.Zerihun') : 'System'}
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
                            {acc.parentAccount === 'None' ? <span className="text-slate-400 italic text-[10px]">Root Group</span> : acc.parentAccount}
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
 
                          {/* Security rules: system posting only / manual allowed */}
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
                          acc.approvalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          acc.approvalStatus === 'Submitted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          acc.approvalStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {acc.approvalStatus === 'Submitted' ? 'REVIEWING' : acc.approvalStatus}
                        </span>
                      </td>
 
                      {/* Professional Admin Control Tools Column */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setViewDetailAccount(acc)}
                            className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                            title="Expand Field Specification Checklist"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
 
                          {/* Edit Node */}
                          <button
                            onClick={() => onEditAccount(acc)}
                            className="p-1 px-1.5 bg-slate-100 hover:bg-[#0051d5] hover:text-white text-slate-700 rounded-lg transition-all cursor-pointer"
                            title="Modify Account Node attributes"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
 
                          {/* Submit to review */}
                          {acc.approvalStatus === 'Not Submitted' && (
                            <button
                              onClick={() => onSubmitAccount(acc.id)}
                              className="px-2 py-1 bg-cyan-50 hover:bg-cyan-600 hover:text-white text-cyan-700 text-[10px] font-black rounded-lg transition-all cursor-pointer uppercase tracking-widest"
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
                              title="Reject rules and return to draft"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
 
                          {/* Freeze / Active Toggle buttons */}
                          {acc.status === 'Active' ? (
                            <button
                              onClick={() => onUpdateStatus(acc.id, 'Inactive')}
                              className="px-2 py-1 text-[10px] font-black uppercase text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg border border-amber-200 transition-all cursor-pointer"
                              title="Freeze ledger postings"
                            >
                              Freeze
                            </button>
                          ) : (
                            acc.status === 'Inactive' && (
                              <button
                                onClick={() => onUpdateStatus(acc.id, 'Active')}
                                className="px-2 py-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-200 transition-all cursor-pointer"
                                title="Set active and unlock"
                              >
                                Unlock
                              </button>
                            )
                          )}
 
                          {/* Jump to Audit page */}
                          <button
                            onClick={() => onViewAuditTrail(acc.code)}
                            className="p-1 text-slate-400 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Inspect continuous audit trail"
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

      {/* Account Full Viewer Overlay Modal */}
      {viewDetailAccount && (
        <div id="full-viewer-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white select-none">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#cbd5e1]">Account Specifications</span>
                <h4 className="font-sans font-black text-lg text-white mt-1 leading-none truncate">
                  {viewDetailAccount.code} • {viewDetailAccount.name}
                </h4>
              </div>
              <button 
                onClick={() => setViewDetailAccount(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Double Column Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Structural Position */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Structural Position</span>
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                    <p className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Normal Balance:</span> 
                      <span className="font-bold font-mono text-slate-900">{viewDetailAccount.balance}</span>
                    </p>
                    <p className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Hierarchical Level:</span> 
                      <span className="font-bold font-mono text-slate-900">L{viewDetailAccount.level}</span>
                    </p>
                    <p className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Rollup Parent:</span> 
                      <span className="font-bold font-mono text-slate-800">{viewDetailAccount.parentAccount || 'None'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Company & Unit:</span> 
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{viewDetailAccount.company}</span>
                    </p>
                  </div>
                </div>

                {/* Compliance & Standards */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Compliance & IFRS Mapping</span>
                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                    <p className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">IFRS Classification:</span> 
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{viewDetailAccount.ifrsClass}</span>
                    </p>
                    <p className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Financial Line:</span> 
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{viewDetailAccount.financialStatementLine || 'Unspecified'}</span>
                    </p>
                    <p className="flex justify-between border-b pb-1 text-slate-600">
                      <span className="text-slate-500">Tax Class category:</span> 
                      <span className="font-semibold text-slate-700 font-mono">{viewDetailAccount.ethiopianTaxCategory || 'VAT-EXEMPT'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">VAT Scoping:</span> 
                      <span className="font-bold text-slate-800 font-mono">{viewDetailAccount.vatCode || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Posting Configuration Indicators */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">General Ledger Journal Permission Flags</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.postingAllowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-550 mb-1">Allows Postings</span>
                    <span className="font-bold">{viewDetailAccount.postingAllowed ? 'YES (LEDGER)' : 'NO (SUMMARY)'}</span>
                  </div>
                  
                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.controlAccount ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-550 mb-1">Control Account</span>
                    <span className="font-bold">{viewDetailAccount.controlAccount ? 'YES (TIED SL)' : 'NO (DIRECT)'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.manualJournalAllowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-550 mb-1">Manual Entry OK</span>
                    <span className="font-bold">{viewDetailAccount.manualJournalAllowed ? 'ACCEPTED' : 'BLOCKED'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${viewDetailAccount.systemPostingOnly ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-550 mb-1">System Forced</span>
                    <span className="font-bold">{viewDetailAccount.systemPostingOnly ? 'AUTO ONLY' : 'USER & AUTO'}</span>
                  </div>
                </div>
              </div>

              {/* Dimensionality Validation Criteria */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Mandatory Dimension Tags Validation Rule</span>
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
                    <span className="text-slate-800 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.project}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Segment unit</span>
                    <span className="text-slate-800 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.segment}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono">Profit Center</span>
                    <span className="text-slate-800 font-bold uppercase tracking-wider mt-1.5 inline-block bg-white border px-1.5 py-0.5 rounded text-[9px]">{viewDetailAccount.profitCenter || 'Optional'}</span>
                  </div>
                </div>
              </div>

              {/* Audit Footprint Notes */}
              {viewDetailAccount.auditTrailNotes && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 select-none">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block">Auditor Attestation Note</span>
                  <p className="text-xs text-slate-700 italic font-mono bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed shadow-3xs">
                    "{viewDetailAccount.auditTrailNotes}"
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 select-none">
              <button
                onClick={() => setViewDetailAccount(null)}
                className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Specification Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

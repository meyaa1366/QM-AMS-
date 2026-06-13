import React, { useState } from 'react';
import { 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ArrowLeftRight, 
  FileText, 
  Check, 
  Lock, 
  Unlock, 
  Settings, 
  HelpCircle, 
  ShieldAlert, 
  RotateCw,
  FileDown,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityKey: string;
  description: string;
}

interface FiscalPeriodTabProps {
  onAddAuditLog?: (log: AuditLog) => void;
}

export default function FiscalPeriodTab({ onAddAuditLog }: FiscalPeriodTabProps) {
  // Simple state for tabs
  const [activeSubTab, setActiveSubTab] = useState<'years' | 'periods' | 'checklist' | 'reopen' | 'specs'>('years');
  const [selectedFyCode, setSelectedFyCode] = useState<string>('FY2026');

  // Dynamic state for Toast message
  const [localToasts, setLocalToasts] = useState<{ id: number; text: string; type: 'success' | 'warn' | 'info' }[]>([]);
  const addToast = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    const id = Date.now();
    setLocalToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setLocalToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleTriggerAudit = (action: string, key: string, desc: string) => {
    if (onAddAuditLog) {
      onAddAuditLog({
        id: `AUD-FP-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        user: 'mzerihun01@gmail.com',
        action,
        entityType: 'FISCAL_PERIOD_SETUP',
        entityKey: key,
        description: desc
      });
    }
  };

  // Seed Data: Fiscal Years
  const [fiscalYears, setFiscalYears] = useState([
    { code: 'FY2025', name: 'Fiscal Year 2025', company: 'MS-PLC', startDate: '2025-01-01', endDate: '2025-12-31', basis: 'IFRS', calendarType: 'Gregorian', periodsCount: 15, status: 'Closed' },
    { code: 'FY2026', name: 'Fiscal Year 2026', company: 'MS-PLC', startDate: '2026-01-01', endDate: '2026-12-31', basis: 'IFRS', calendarType: 'Gregorian', periodsCount: 15, status: 'Active' },
    { code: 'FY2027', name: 'Fiscal Year 2027 (Planning)', company: 'MS-PLC', startDate: '2027-01-01', endDate: '2027-12-31', basis: 'IFRS', calendarType: 'Gregorian', periodsCount: 0, status: 'Planning' }
  ]);

  // Seed Data: Accounting Periods
  const [periods, setPeriods] = useState([
    { code: 'FY2026-OPEN', name: 'Opening Balances Framework', order: 0, type: 'Opening Period', startDate: '2026-01-01', endDate: '2026-01-01', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', fy: 'FY2026' },
    { code: 'FY2026-P01', name: 'January 2026', order: 1, type: 'Monthly', startDate: '2026-01-01', endDate: '2026-01-31', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', fy: 'FY2026' },
    { code: 'FY2026-P02', name: 'February 2026', order: 2, type: 'Monthly', startDate: '2026-02-01', endDate: '2026-02-28', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', fy: 'FY2026' },
    { code: 'FY2026-P03', name: 'March 2026', order: 3, type: 'Monthly', startDate: '2026-03-01', endDate: '2026-03-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P04', name: 'April 2026', order: 4, type: 'Monthly', startDate: '2026-04-01', endDate: '2026-04-30', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P05', name: 'May 2026', order: 5, type: 'Monthly', startDate: '2026-05-01', endDate: '2026-05-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P06', name: 'June 2026', order: 6, type: 'Monthly', startDate: '2026-06-01', endDate: '2026-06-30', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P07', name: 'July 2026', order: 7, type: 'Monthly', startDate: '2026-07-01', endDate: '2026-07-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P08', name: 'August 2026', order: 8, type: 'Monthly', startDate: '2026-08-01', endDate: '2026-08-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P09', name: 'September 2026', order: 9, type: 'Monthly', startDate: '2026-09-01', endDate: '2026-09-30', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P10', name: 'October 2026', order: 10, type: 'Monthly', startDate: '2026-10-01', endDate: '2026-10-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P11', name: 'November 2026', order: 11, type: 'Monthly', startDate: '2026-11-01', endDate: '2026-11-30', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-P12', name: 'December 2026', order: 12, type: 'Monthly', startDate: '2026-12-01', endDate: '2026-12-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-ADJ', name: 'IFRS Adjustment Period', order: 13, type: 'Adjustment Period', startDate: '2026-12-31', endDate: '2026-12-31', gl: 'Open', ap: 'Closed', ar: 'Closed', tax: 'Open', status: 'Open', fy: 'FY2026' },
    { code: 'FY2026-CLOSE', name: 'Year-End Closing Ledger Period', order: 14, type: 'Closing Period', startDate: '2026-12-31', endDate: '2026-12-31', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', fy: 'FY2026' }
  ]);

  // Checklist for closing month
  const [checklist, setChecklist] = useState([
    { code: 'CCL-01', name: 'Reconcile petty cash accounts and physically count vault ledger nodes', status: 'Completed', owner: 'Treasury Lead', validated: true },
    { code: 'CCL-02', name: 'Validate VAT Output vs Sales Register (ERCA Compliance Gate)', status: 'Completed', owner: 'Tax Auditor', validated: true },
    { code: 'CCL-03', name: 'Run system Depreciation Engine on Fixed Asset Subledgers', status: 'Completed', owner: 'Asset Controller', validated: true },
    { code: 'CCL-04', name: 'Process Month-End Accruals, Prepayments, and Amortizations', status: 'In Progress', owner: 'General Accountant', validated: false },
    { code: 'CCL-05', name: 'Confirm Subledger to GL Trial Balance Matching (Diff = 0.00 ETB)', status: 'Pending', owner: 'Finance Manager', validated: false },
    { code: 'CCL-06', name: 'Complete Intercompany Accounts Reconciliation matrix', status: 'Pending', owner: 'Controller', validated: false }
  ]);

  // Reopen Request History
  const [reopenRequests, setReopenRequests] = useState([
    { id: 'REOP-2026-001', periodCode: 'FY2026-P03', requester: 'finance.lead@mesfinplc.com', date: '2026-06-10', reason: 'Audit Correction - Amortization correction requested by external auditor', durationDays: 3, status: 'Approved', approvedBy: 'FIN_MANAGER' },
    { id: 'REOP-2026-002', periodCode: 'FY2026-P02', requester: 'finance.lead@mesfinplc.com', date: '2026-06-08', reason: 'Supplier Invoice reversal requested due to GRN mismatch', durationDays: 2, status: 'Completed', approvedBy: 'FIN_MANAGER' }
  ]);

  // Form states for creating a new Fiscal Year
  const [newFyCode, setNewFyCode] = useState('FY2027');
  const [newFyName, setNewFyName] = useState('Fiscal Year 2027');
  const [newFyCompany, setNewFyCompany] = useState('MS-PLC');
  const [newFyStart, setNewFyStart] = useState('2027-01-01');
  const [newFyEnd, setNewFyEnd] = useState('2027-12-31');
  const [newFyBasis, setNewFyBasis] = useState('IFRS');
  const [newCalendarType, setNewCalendarType] = useState('Gregorian');

  // Form state for creating a new Period Reopen Request
  const [reqPeriodCode, setReqPeriodCode] = useState('FY2026-P03');
  const [reqReason, setReqReason] = useState('Retroactive corrections for auditor review');
  const [reqLength, setReqLength] = useState('5');

  // Toggle checks in close checklist
  const toggleChecklistStep = (code: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.code === code) {
        const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...item, status: newStatus, validated: newStatus === 'Completed' };
      }
      return item;
    }));
    addToast(`Close checklist step ${code} status modified!`, 'info');
  };

  // Auto periods generator logic
  const handleAutoGeneratePeriods = (fyCode: string) => {
    const matchingFy = fiscalYears.find(f => f.code === fyCode);
    if (!matchingFy) return;

    const baseYear = parseInt(matchingFy.startDate.split('-')[0]) || 2027;
    const isEthiopian = matchingFy.basis.toLowerCase().includes('ethiopian');
    
    const generated = Array.from({ length: 12 }).map((_, i) => {
      const monthNum = i + 1;
      const displayMonth = new Date(baseYear, i, 1).toLocaleString('default', { month: 'long' });
      const codeSuffix = monthNum < 10 ? `P0${monthNum}` : `P${monthNum}`;
      
      const startStr = `${baseYear}-${monthNum < 10 ? '0' + monthNum : monthNum}-01`;
      const endStr = `${baseYear}-${monthNum < 10 ? '0' + monthNum : monthNum}-${new Date(baseYear, monthNum, 0).getDate()}`;
      
      return {
        code: `${fyCode}-${codeSuffix}`,
        name: isEthiopian ? `EFY Month ${monthNum}` : `${displayMonth} ${baseYear}`,
        order: monthNum,
        type: 'Monthly',
        startDate: startStr,
        endDate: endStr,
        gl: 'Open',
        ap: 'Open',
        ar: 'Open',
        tax: 'Open',
        status: 'Open',
        fy: fyCode
      };
    });

    const standardAndAux = [
      { code: `${fyCode}-OPEN`, name: 'Year Opening Balances Framework', order: 0, type: 'Opening Period', startDate: matchingFy.startDate, endDate: matchingFy.startDate, gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: fyCode },
      ...generated,
      { code: `${fyCode}-ADJ`, name: 'IFRS Statutory Adjustment Run', order: 13, type: 'Adjustment Period', startDate: matchingFy.endDate, endDate: matchingFy.endDate, gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', fy: fyCode },
      { code: `${fyCode}-CLOSE`, name: 'Year-End Closing Ledger Journal Balance', order: 14, type: 'Closing Period', startDate: matchingFy.endDate, endDate: matchingFy.endDate, gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', fy: fyCode }
    ];

    setPeriods(prev => {
      const filtered = prev.filter(p => p.fy !== fyCode);
      return [...filtered, ...standardAndAux];
    });

    setFiscalYears(prev => prev.map(f => f.code === fyCode ? { ...f, periodsCount: 15, status: 'Active' } : f));
    addToast(`Automated period template registered for ${fyCode} (12 monthly bounds + auxiliary steps).`, 'success');
    handleTriggerAudit('PERIOD_GENERATION', fyCode, `Auto-generated 15 calendar intervals for ${fyCode}`);
  };

  // Submit new fiscal year Form
  const handleAddNewFY = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFyCode || !newFyName) {
      addToast('Validation Error: Code and Name are mandatory!', 'warn');
      return;
    }

    if (fiscalYears.some(f => f.code === newFyCode)) {
      addToast(`Conflict: A Fiscal Year with code ${newFyCode} already exists.`, 'warn');
      return;
    }

    const item = {
      code: newFyCode,
      name: newFyName,
      company: newFyCompany,
      startDate: newFyStart,
      endDate: newFyEnd,
      basis: newFyBasis,
      calendarType: newCalendarType,
      periodsCount: 0,
      status: 'Planning' as const
    };

    setFiscalYears([...fiscalYears, item]);
    addToast(`Success: Fiscal Year ${newFyCode} registered. Proceed to generate sub-periods.`, 'success');
    handleTriggerAudit('FISCAL_YEAR_CREATED', newFyCode, `Added new ledger calendar ${newFyName} basis: ${newFyBasis}`);
    
    // Auto clear form defaults
    setNewFyCode('FY2028');
    setNewFyName('Fiscal Year 2028');
  };

  // Toggle specific gate lock
  const handleToggleGate = (periodCode: string, gate: 'gl' | 'ap' | 'ar' | 'tax') => {
    setPeriods(prev => prev.map(p => {
      if (p.code === periodCode) {
        const current = p[gate];
        const nextState = current === 'Open' ? 'Closed' : 'Open';
        return { ...p, [gate]: nextState };
      }
      return p;
    }));
    addToast(`Subledger gate ${gate.toUpperCase()} toggled on period ${periodCode}.`, 'info');
    handleTriggerAudit('GATE_CONTROL_UPDATE', periodCode, `Toggled gate ${gate.toUpperCase()} on period ${periodCode}`);
  };

  // Submit period reopen request
  const handleReopenRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPeriodCode || !reqReason) {
      addToast('Validation Error: Target Period and Reason are mandatory fields.', 'warn');
      return;
    }

    const nItem = {
      id: `REOP-2026-${Math.floor(Math.random() * 900) + 100}`,
      periodCode: reqPeriodCode,
      requester: 'finance.lead@mesfinplc.com',
      date: new Date().toISOString().split('T')[0],
      reason: reqReason,
      durationDays: parseInt(reqLength) || 3,
      status: 'Pending',
      approvedBy: ''
    };

    setReopenRequests([nItem, ...reopenRequests]);
    addToast('Request Submitted: Sent to Finance Director for verification.', 'success');
    handleTriggerAudit('REOPEN_REQUEST', reqPeriodCode, `Submitted grace reopen request: ${reqReason}`);
    setReqReason('');
  };

  // Approve Reopen Request
  const handleApproveReopen = (id: string, periodCode: string) => {
    setReopenRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', approvedBy: 'FIN_MANAGER' } : r));
    setPeriods(prev => prev.map(p => {
      if (p.code === periodCode) {
        return { ...p, status: 'Open', gl: 'Open', ap: 'Open', ar: 'Open' };
      }
      return p;
    }));
    addToast(`Request approved! Period ${periodCode} has been temporarily reopened.`, 'success');
    handleTriggerAudit('REOPEN_APPROVED', periodCode, `Approved temporary grace edit window on period ${periodCode}`);
  };

  // Filter periods related to selected FY
  const filteredPeriods = periods.filter(p => p.fy === selectedFyCode);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast notifications HUD */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {localToasts.map(t => (
          <div key={t.id} className={`p-4 rounded-xl border shadow-xl flex items-center gap-2.5 animate-bounce-short text-xs font-black text-white pointer-events-auto ${
            t.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
            t.type === 'warn' ? 'bg-amber-500 border-amber-600' : 'bg-slate-800 border-slate-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Header View */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-xs shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Accounting Period & Fiscal Setup</h2>
            <p className="text-xs text-slate-500 font-medium">Control ledgers, open/close periods, lock transactions and manage tax calendars.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Stats */}
          <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered Years</span>
            <span className="text-xs font-black text-slate-700 leading-normal">{fiscalYears.length}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Selected Year</span>
            <span className="text-xs font-black text-blue-600 leading-normal">{selectedFyCode}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Periods Status</span>
            <span className="text-xs font-black text-emerald-600 leading-normal">
              {periods.filter(p => p.fy === selectedFyCode && p.status === 'Open').length} Open
            </span>
          </div>
        </div>
      </div>

      {/* Quick Switch Sub-Navigation tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSubTab('years')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'years' 
              ? 'border-blue-600 text-blue-600 font-black bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          1. Fiscal Year Registry
        </button>
        <button
          onClick={() => setActiveSubTab('periods')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'periods' 
              ? 'border-blue-600 text-blue-600 font-black bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          2. Accounting Periods Control
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'checklist' 
              ? 'border-blue-600 text-blue-600 font-black bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          3. Month-End Close Checklist
        </button>
        <button
          onClick={() => setActiveSubTab('reopen')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'reopen' 
              ? 'border-blue-600 text-blue-600 font-black bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          4. Grace Reopen Protocols
        </button>
        <button
          onClick={() => setActiveSubTab('specs')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'specs' 
              ? 'border-blue-600 text-blue-600 font-black bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          5. Mappings & Tech Specs
        </button>
      </div>

      {/* Tab Contents */}
      
      {/* 1. FISCAL YEAR REGISTRY */}
      {activeSubTab === 'years' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Fiscal Year Form Grid Card */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Register new Fiscal Year</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Initialize base accounting parameters for a new financial period cycle.</p>
            </div>

            <form onSubmit={handleAddNewFY} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Fiscal Year Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFyCode}
                  onChange={(e) => setNewFyCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. FY2027"
                  required
                />
                <p className="text-[9px] text-slate-450 mt-1">Unique standard alphanumeric identifier code.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Calendar Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFyName}
                  onChange={(e) => setNewFyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  placeholder="e.g. Fiscal Year 2027"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Associated Legal Entity
                </label>
                <input
                  type="text"
                  value={newFyCompany}
                  onChange={(e) => setNewFyCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs text-slate-400 focus:outline-none"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">StartDate</label>
                  <input
                    type="date"
                    value={newFyStart}
                    onChange={(e) => setNewFyStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">EndDate</label>
                  <input
                    type="date"
                    value={newFyEnd}
                    onChange={(e) => setNewFyEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Accounting Basis</label>
                  <select
                    value={newFyBasis}
                    onChange={(e) => setNewFyBasis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-bold"
                  >
                    <option value="IFRS">IFRS (Standard)</option>
                    <option value="Ethiopian Tax">GAAP/Tax Laws</option>
                    <option value="IFRS & Ethiopian Tax Mixed">Dual Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Calendar Type</label>
                  <select
                    value={newCalendarType}
                    onChange={(e) => setNewCalendarType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-bold"
                  >
                    <option value="Gregorian">Gregorian Calendar</option>
                    <option value="Ethiopian">EC (13 Months)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-colors"
              >
                Create Fiscal Year Node
              </button>
            </form>
          </div>

          {/* Registered fiscal years list */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-900">Configured Ledger Calendars</h3>
              <p className="text-[10px] text-slate-450">Select a fiscal year to populate and control its accounting sub-periods.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-250">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans">FY Code</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans">Calendar Label</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans text-center">Standards</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans text-center">Periods Count</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans text-center">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 font-sans text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fiscalYears.map((fy) => {
                    const isSelected = selectedFyCode === fy.code;
                    return (
                      <tr 
                        key={fy.code} 
                        onClick={() => setSelectedFyCode(fy.code)}
                        className={`hover:bg-slate-50/70 transition-all cursor-pointer ${
                          isSelected ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-xs text-blue-600">{fy.code}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-800">{fy.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 text-center font-bold">
                          <span className="px-1.5 py-0.5 bg-slate-100/80 border border-slate-200 text-[10px] rounded text-slate-700 font-mono">
                            {fy.basis} • {fy.calendarType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-800 text-center font-bold">
                          {fy.periodsCount > 0 ? (
                            <span className="text-emerald-600">{fy.periodsCount} Intervals Active</span>
                          ) : (
                            <span className="text-amber-600">Pending Setup</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            fy.status === 'Closed' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                            fy.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-amber-50 text-amber-700 border border-amber-250 animate-pulse'
                          }`}>
                            {fy.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          {fy.periodsCount === 0 ? (
                            <button
                              onClick={() => handleAutoGeneratePeriods(fy.code)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer ml-auto transition-colors"
                            >
                              <RotateCw className="w-3 h-3 text-white spin-slow" />
                              <span>Autogen Periods</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Periods Active</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACCOUNTING PERIODS CONTROL */}
      {activeSubTab === 'periods' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Selected Calendar Bounds: {selectedFyCode} sub-intervals</span>
              </h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Locks specific transactional subledgers (Accounts Payable/Receivable, GL and Tax entries) for audited periods.</p>
            </div>
            
            {filteredPeriods.length === 0 && (
              <button
                onClick={() => handleAutoGeneratePeriods(selectedFyCode)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Initialize periods for {selectedFyCode}</span>
              </button>
            )}
          </div>

          {filteredPeriods.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-250">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                    <th className="px-4 py-3 font-sans">Period Code</th>
                    <th className="px-4 py-3 font-sans">Name Reference</th>
                    <th className="px-4 py-3 font-sans text-center">Start Date</th>
                    <th className="px-4 py-3 font-sans text-center">End Date</th>
                    <th className="px-4 py-3 font-sans text-center bg-blue-50/30">GL Status</th>
                    <th className="px-4 py-3 font-sans text-center bg-blue-50/30">AP Ledger</th>
                    <th className="px-4 py-3 font-sans text-center bg-blue-50/30">AR Ledger</th>
                    <th className="px-4 py-3 font-sans text-center bg-blue-50/30">Tax Book</th>
                    <th className="px-4 py-3 font-sans text-right">Operational Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs">
                  {filteredPeriods.map((p) => (
                    <tr key={p.code} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-black text-blue-600">{p.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{p.name}</td>
                      <td className="px-4 py-3 text-center text-slate-550 font-mono">{p.startDate}</td>
                      <td className="px-4 py-3 text-center text-slate-550 font-mono">{p.endDate}</td>
                      
                      {/* GL */}
                      <td className="px-4 py-3 text-center bg-blue-50/10">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                          p.gl === 'Open' ? 'bg-emerald-50 text-emerald-700 hover:opacity-85' : 'bg-rose-50 text-rose-700'
                        }`}>
                          ● {p.gl.toUpperCase()}
                        </span>
                      </td>

                      {/* AP */}
                      <td className="px-4 py-3 text-center bg-blue-50/10">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                          p.ap === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          ● {p.ap.toUpperCase()}
                        </span>
                      </td>

                      {/* AR */}
                      <td className="px-4 py-3 text-center bg-blue-50/10">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                          p.ar === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          ● {p.ar.toUpperCase()}
                        </span>
                      </td>

                      {/* TAX */}
                      <td className="px-4 py-3 text-center bg-blue-50/10">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                          p.tax === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          ● {p.tax.toUpperCase()}
                        </span>
                      </td>

                      {/* Toggle Subledger Locks */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 select-none">
                          <button
                            onClick={() => handleToggleGate(p.code, 'gl')}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded text-[9px] font-black cursor-pointer uppercase transition-all active:scale-95"
                            title="Toggle GL Entry Lock"
                          >
                            GL Gate
                          </button>
                          <button
                            onClick={() => handleToggleGate(p.code, 'ap')}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded text-[9px] font-black cursor-pointer uppercase transition-all"
                            title="Toggle AP Entry Lock"
                          >
                            AP
                          </button>
                          <button
                            onClick={() => handleToggleGate(p.code, 'ar')}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded text-[9px] font-black cursor-pointer uppercase transition-all"
                            title="Toggle AR Entry Lock"
                          >
                            AR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-600">No Accounting Periods generated for {selectedFyCode} yet.</p>
              <p className="text-xs text-slate-400 mt-1">Select standard setup or click below to generate compliance intervals according to standards choice.</p>
              <button
                onClick={() => handleAutoGeneratePeriods(selectedFyCode)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs tracking-wide"
              >
                Instantly Auto-Generate 15 Periods
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. MONTH-END CLOSE CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase text-slate-900">Period Close Framework</h3>
              <p className="text-[10px] text-slate-450 mt-1">Audit processes requiring manual sign-off before closing an accounting interval.</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200/50 rounded-xl p-4.5 text-xs space-y-3">
              <h4 className="font-bold text-indigo-800 uppercase flex items-center gap-1 text-[11px]">
                <ShieldAlert className="w-4 h-4" />
                <span>Closing Sign-off Integrity</span>
              </h4>
              <p className="text-slate-600 leading-normal text-[11px]">
                Ethiopian Ministry of Revenue guidelines require that all transactions, including reverse accruals and tax VAT filings, are certified before sealing periods permanently.
              </p>
              <div className="pt-2">
                <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Balanced Integrity Status</span>
                <span className="text-sm font-mono font-black text-indigo-700">Balanced (Diff = 0)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Sign-off Steps & Signatory Approvals</h3>
                <p className="text-[10px] text-slate-400">Certify matching indices and complete ledger reconciliations.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 px-2 py-1 text-[10px] font-black rounded-lg">
                IFRS Gate Secure
              </span>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div 
                  key={item.code} 
                  className={`p-3.5 border rounded-xl transition-all flex items-start sm:items-center justify-between gap-3 ${
                    item.status === 'Completed' 
                      ? 'border-slate-200 bg-slate-50/50 text-slate-700' 
                      : 'border-amber-200 bg-amber-50/10 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleChecklistStep(item.code)}
                      className="mt-0.5 shrink-0"
                    >
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border border-slate-400 hover:border-slate-600 cursor-pointer"></div>
                      )}
                    </button>

                    <div>
                      <span className="text-[9.5px] font-mono leading-none bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border font-semibold">
                        {item.code}
                      </span>
                      <p className="text-xs font-bold mt-1 text-slate-800 leading-normal">{item.name}</p>
                      <p className="text-[9.5px] text-slate-450 mt-0.5">Assigned To: <span className="font-bold text-slate-600">{item.owner}</span></p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold shrink-0 ${
                    item.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. GRACE REOPEN PROTOCOLS */}
      {activeSubTab === 'reopen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
                <span>Period Reopening Token</span>
              </h3>
              <p className="text-[10px] text-slate-450 mt-1">Submit audit justification to request temporary grace reopening of locked ledger books.</p>
            </div>

            <form onSubmit={handleReopenRequestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Period Code <span className="text-red-500">*</span></label>
                <select
                  value={reqPeriodCode}
                  onChange={(e) => setReqPeriodCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-800"
                >
                  {periods.filter(p => p.fy === 'FY2026').map(p => (
                    <option key={p.code} value={p.code}>{p.code} ({p.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Justification Reason <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  placeholder="e.g. Reconciliation discrepancy discovered by Board Auditors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Window (Days) <span className="text-red-500">*</span></label>
                <select
                  value={reqLength}
                  onChange={(e) => setReqLength(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-bold"
                >
                  <option value="1">1 Day Token</option>
                  <option value="2">2 Days Token</option>
                  <option value="3">3 Days Token</option>
                  <option value="5">5 Days Token</option>
                  <option value="10">10 Days Max</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 leading-normal font-bold">
                🔒 Note: Temporary tokens auto-lock after specified duration. All changes will be logged in the continuous security audit ledger.
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs uppercase cursor-pointer"
              >
                Submit Reopen Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-900">Reopen Authorizations Logs</h3>
              <p className="text-[10px] text-slate-450">Track formal audit requests and manager signatures.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-250">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                    <th className="px-4 py-3 font-sans">Token ID</th>
                    <th className="px-4 py-3 font-sans">Period</th>
                    <th className="px-4 py-3 font-sans">Reason Summary</th>
                    <th className="px-4 py-3 font-sans text-center">Window</th>
                    <th className="px-4 py-3 font-sans text-center">Status</th>
                    <th className="px-4 py-3 font-sans text-right">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {reopenRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-slate-500 font-semibold">{r.id}</td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{r.periodCode}</td>
                      <td className="px-4 py-3 text-slate-700 font-semibold max-w-xs truncate" title={r.reason}>{r.reason}</td>
                      <td className="px-4 py-3 text-center text-slate-600 font-bold">{r.durationDays} Days</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                          r.status === 'Completed' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                          'bg-amber-50 text-amber-700 border-amber-250 animate-pulse'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === 'Pending' ? (
                          <button
                            onClick={() => handleApproveReopen(r.id, r.periodCode)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Approve Reopen
                          </button>
                        ) : r.approvedBy ? (
                          <span className="text-[10px] text-slate-450 font-mono italic">sig: {r.approvedBy}</span>
                        ) : (
                          <span className="text-[10px] text-slate-450 italic">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAPPINGS & TECHNICAL SPECS */}
      {activeSubTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>IFRS System Specifications & Mapping Metadata</span>
            </h3>
            <p className="text-[10px] text-slate-450 mt-1">Developer-readiness payloads and relational schemas for general ledger synchronization.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 text-slate-250 font-mono text-[10.5px] p-4 rounded-xl leading-relaxed border border-slate-800 overflow-x-auto space-y-2">
              <span className="text-[10px] font-extrabold text-indigo-400 block uppercase border-b border-slate-800 pb-1.5 font-mono">
                JSON DB Entity Payload Schema
              </span>
              <pre>{JSON.stringify({
                entityKey: "FISCAL_YEAR_NODES",
                dataModel: {
                  fyId: "VARCHAR(12) PRIMARY KEY",
                  entityId: "VARCHAR(10)",
                  startDate: "DATE",
                  endDate: "DATE",
                  basis: "ENUM('IFRS', 'ETHIOPIAN_TAX', 'DUAL')",
                  periods: "ARRAY[ORGANIZED_INTERVAL_SCHEMAS]"
                }
              }, null, 2)}</pre>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200 text-xs">
              <span className="text-[10px] font-black text-slate-600 block uppercase tracking-wide">Standard Compliance Mappings</span>
              <p className="text-slate-500 leading-relaxed font-semibold">
                Ethiopian Tax Proclamation No. 979/2016 prescribes standard calendar periodizing. Reopening closed years is restricted unless a custom audit token holds registered administrative authorization code.
              </p>
              
              <div className="pt-2">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">API Endpoint Schema Binding</span>
                <code className="bg-slate-100 border text-blue-600 px-2 py-1 rounded font-mono text-[10.5px] font-bold block truncate">
                  POST /api/v1/periods/reopen-token
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

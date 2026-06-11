import React, { useState } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  Building2, 
  RotateCw, 
  Sliders, 
  Layers, 
  Users, 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Workflow, 
  Database,
  Lock, 
  CheckSquare, 
  AlertTriangle, 
  ChevronRight, 
  FileText, 
  Info,
  Clock,
  ArrowRightLeft,
  Settings
} from 'lucide-react';

interface FiscalPeriodTabProps {
  onAddAuditLog?: (log: any) => void;
}

export default function FiscalPeriodTab({ onAddAuditLog }: FiscalPeriodTabProps) {
  // Spreadsheet Tabs matching the 21 Excel Sheets requested
  const SHEETS = [
    { id: 'S1', name: '1. README' },
    { id: 'S2', name: '2. Fiscal_Year_Reg' },
    { id: 'S3', name: '3. FY_Add_Edit' },
    { id: 'S4', name: '4. Period_Reg' },
    { id: 'S5', name: '5. Period_Add_Edit' },
    { id: 'S6', name: '6. Period_Gen_Setup' },
    { id: 'S7', name: '7. Module_Control' },
    { id: 'S8', name: '8. Close_Checklist' },
    { id: 'S9', name: '9. Reopen_Setup' },
    { id: 'S10', name: '10. Field_Spec' },
    { id: 'S11', name: '11. Enum_Master' },
    { id: 'S12', name: '12. Lookup_Master' },
    { id: 'S13', name: '13. Lookup_Data' },
    { id: 'S14', name: '14. Backend_Rules' },
    { id: 'S15', name: '15. Error_Messages' },
    { id: 'S16', name: '16. Import_Template' },
    { id: 'S17', name: '17. Sample_Setup' },
    { id: 'S18', name: '18. API_Model' },
    { id: 'S19', name: '19. API_Endpoints' },
    { id: 'S20', name: '20. User_Stories' },
    { id: 'S21', name: '21. Dev_Checklist' }
  ];

  const [activeSheet, setActiveSheet] = useState<string>('S1');

  // Interactive state: Fiscal Years list
  const [fiscalYears, setFiscalYears] = useState([
    {
      code: 'FY2026',
      name: 'Fiscal Year 2026 - Gregorian',
      company: 'Qelem Meda Technologies (QMT)',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      periodsCount: 12,
      basis: 'IFRS',
      status: 'Active',
      closingStatus: 'In Progress',
      approvalStatus: 'Approved',
      createdBy: 'mzerihun01@gmail.com',
      createdDate: '2025-11-15'
    },
    {
      code: 'EFY2018',
      name: 'Ethiopian Fiscal Year 2018',
      company: 'Qelem Meda Technologies (QMT)',
      startDate: '2025-07-08',
      endDate: '2026-07-07',
      periodsCount: 13,
      basis: 'Local Statutory',
      status: 'Active',
      closingStatus: 'Not Started',
      approvalStatus: 'Approved',
      createdBy: 'mzerihun01@gmail.com',
      createdDate: '2025-06-20'
    },
    {
      code: 'FY2027',
      name: 'Fiscal Year 2027 - Advanced',
      company: 'Qelem Meda Technologies Subsidiary 01',
      startDate: '2027-01-01',
      endDate: '2027-12-31',
      periodsCount: 12,
      basis: 'IFRS',
      status: 'Draft',
      closingStatus: 'Not Started',
      approvalStatus: 'Not Submitted',
      createdBy: 'mzerihun01@gmail.com',
      createdDate: '2026-06-01'
    }
  ]);

  // Interactive state: Accounting Periods list
  const [periods, setPeriods] = useState([
    { code: 'FY2026-P01', name: 'January 2026', order: 1, type: 'Monthly', startDate: '2026-01-01', endDate: '2026-01-31', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', approval: 'Approved' },
    { code: 'FY2026-P02', name: 'February 2026', order: 2, type: 'Monthly', startDate: '2026-02-01', endDate: '2026-02-28', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', approval: 'Approved' },
    { code: 'FY2026-P03', name: 'March 2026', order: 3, type: 'Monthly', startDate: '2026-03-01', endDate: '2026-03-31', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', approval: 'Approved' },
    { code: 'FY2026-P04', name: 'April 2026', order: 4, type: 'Monthly', startDate: '2026-04-01', endDate: '2026-04-30', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', approval: 'Approved' },
    { code: 'FY2026-P05', name: 'May 2026', order: 5, type: 'Monthly', startDate: '2026-05-01', endDate: '2026-05-31', gl: 'Open', ap: 'Open', ar: 'Open', tax: 'Open', status: 'Open', approval: 'Approved' },
    { code: 'FY2026-P06', name: 'June 2026', order: 6, type: 'Monthly', startDate: '2026-06-01', endDate: '2026-06-30', gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Future', approval: 'Not Submitted' },
    { code: 'FY2026-P12', name: 'December 2026', order: 12, type: 'Monthly', startDate: '2026-12-01', endDate: '2026-12-31', gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Future', approval: 'Not Submitted' },
    { code: 'FY2026-OPEN', name: 'Year Opening Balances', order: 0, type: 'Opening Period', startDate: '2026-01-01', endDate: '2026-01-01', gl: 'Closed', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Closed', approval: 'Approved' },
    { code: 'FY2026-ADJ', name: 'IFRS Adjustments Period', order: 13, type: 'Adjustment Period', startDate: '2026-12-31', endDate: '2026-12-31', gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Future', approval: 'Not Submitted' },
    { code: 'FY2026-CLOSE', name: 'Year-End Close Entry', order: 14, type: 'Closing Period', startDate: '2026-12-31', endDate: '2026-12-31', gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Future', approval: 'Not Submitted' }
  ]);

  // Checklist verification list
  const [checklist, setChecklist] = useState([
    { code: 'CCL-01', name: 'Ensure all general ledger manual vouchers are posted or deleted', status: 'Completed', owner: 'Senior Accountant', validated: true },
    { code: 'CCL-02', name: 'Validate trial balance debits match credits perfectly', status: 'Completed', owner: 'Chief Accountant', validated: true },
    { code: 'CCL-03', name: 'Validate Bank accounts reconciliations in ERP Cash Module', status: 'Completed', owner: 'Treasury Officer', validated: true },
    { code: 'CCL-04', name: 'Validate AP Aging sub-ledger matches GL accounts control totals', status: 'In Progress', owner: 'AP Officer', validated: false },
    { code: 'CCL-05', name: 'Validate AR Aging sub-ledger matches GL accounts control totals', status: 'Pending', owner: 'AR_OFFICER', validated: false },
    { code: 'CCL-06', name: 'Post Ethiopian Tax authorities Withholding & VAT schedules', status: 'Pending', owner: 'Tax Officer', validated: false }
  ]);

  // Controlled Reopen Requests Log
  const [reopenRequests, setReopenRequests] = useState([
    { id: 'REOP-2026-001', periodCode: 'FY2026-P03', requester: 'mzerihun01@gmail.com', date: '2026-06-10', reason: 'Audit Adjustment - Amortization Correction requested by external auditor', durationDays: 3, status: 'Approved', approvedBy: 'FIN_MANAGER' },
    { id: 'REOP-2026-002', periodCode: 'FY2026-P02', requester: 'mzerihun01@gmail.com', date: '2026-06-08', reason: 'Supplier Invoice reversal requested due to GRN correction', durationDays: 2, status: 'Completed & Reclosed', approvedBy: 'FIN_MANAGER' }
  ]);

  // Form states for creating a new Fiscal Year
  const [newFyCode, setNewFyCode] = useState('FY2027');
  const [newFyName, setNewFyName] = useState('Fiscal Year 2027');
  const [newFyCompany, setNewFyCompany] = useState('Qelem Meda Technologies (QMT)');
  const [newFxStart, setNewFxStart] = useState('2027-01-01');
  const [newFxEnd, setNewFxEnd] = useState('2027-12-31');
  const [newFyBasis, setNewFyBasis] = useState('IFRS');
  const [newFyType, setNewFyType] = useState('MONTHLY');

  // Form state for creating a new Period Reopen Request
  const [reqPeriodCode, setReqPeriodCode] = useState('FY2026-P03');
  const [reqReason, setReqReason] = useState('Audit Adjustment');
  const [reqLength, setReqLength] = useState('3');
  const [reqExplanation, setReqExplanation] = useState('Correcting amortization schedule.');

  // Simulation handlers
  const handleAddNewFY = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFyCode || !newFyName) {
      alert('Kindly configure both Code and Name for compliance validation.');
      return;
    }
    const exists = fiscalYears.some(f => f.code.toUpperCase() === newFyCode.toUpperCase());
    if (exists) {
      alert(`BR-FY-01 Rule Violation: Code [${newFyCode}] is already registered in this Entity sequence.`);
      return;
    }

    const item = {
      code: newFyCode,
      name: newFyName,
      company: newFyCompany,
      startDate: newFxStart,
      endDate: newFxEnd,
      periodsCount: 12,
      basis: newFyBasis,
      status: 'Draft',
      closingStatus: 'Not Started',
      approvalStatus: 'Not Submitted',
      createdBy: 'mzerihun01@gmail.com',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setFiscalYears([...fiscalYears, item]);
    alert(`Success: Fiscal Year Draft [${newFyCode}] entered. Proceed to Period Generation.`);
  };

  const handleGeneratePeriods = (fyCode: string) => {
    const matchingFy = fiscalYears.find(f => f.code === fyCode);
    if (!matchingFy) return;

    // Generate simulated periods
    const baseYear = parseInt(matchingFy.startDate.split('-')[0]) || 2026;
    const generated = Array.from({ length: 12 }).map((_, i) => {
      const monthNum = i + 1;
      const displayMonth = new Date(baseYear, i, 1).toLocaleString('default', { month: 'long' });
      const codeSuffix = monthNum < 10 ? `P0${monthNum}` : `P${monthNum}`;
      const startStr = `${baseYear}-${monthNum < 10 ? '0' + monthNum : monthNum}-01`;
      const endStr = `${baseYear}-${monthNum < 10 ? '0' + monthNum : monthNum}-${new Date(baseYear, monthNum, 0).getDate()}`;
      return {
        code: `${fyCode}-${codeSuffix}`,
        name: `${displayMonth} ${baseYear}`,
        order: monthNum,
        type: 'Monthly',
        startDate: startStr,
        endDate: endStr,
        gl: 'Future',
        ap: 'Closed',
        ar: 'Closed',
        tax: 'Future',
        status: 'Future',
        approval: 'Not Submitted'
      };
    });

    const standardAndAux = [
      { code: `${fyCode}-OPEN`, name: 'Year Opening Balances', order: 0, type: 'Opening Period', startDate: matchingFy.startDate, endDate: matchingFy.startDate, gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Closed', status: 'Draft', approval: 'Not Submitted' },
      ...generated,
      { code: `${fyCode}-ADJ`, name: 'IFRS Adjustments Period', order: 13, type: 'Adjustment Period', startDate: matchingFy.endDate, endDate: matchingFy.endDate, gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Draft', approval: 'Not Submitted' },
      { code: `${fyCode}-CLOSE`, name: 'Year-End Close Entry', order: 14, type: 'Closing Period', startDate: matchingFy.endDate, endDate: matchingFy.endDate, gl: 'Future', ap: 'Closed', ar: 'Closed', tax: 'Future', status: 'Draft', approval: 'Not Submitted' }
    ];

    setPeriods(prev => {
      const filtered = prev.filter(p => !p.code.startsWith(fyCode));
      return [...filtered, ...standardAndAux];
    });

    setFiscalYears(prev => prev.map(f => f.code === fyCode ? { ...f, periodsCount: 15 } : f));
    alert(`Audit Generation Success: Created 12 Monthly periods + 3 auxiliary accounting cycles for Fiscal Year: ${fyCode}`);
  };

  const handlePostReopen = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `REOP-2026-00${reopenRequests.length + 1}`,
      periodCode: reqPeriodCode,
      requester: 'mzerihun01@gmail.com',
      date: new Date().toISOString().split('T')[0],
      reason: `${reqReason} - ${reqExplanation}`,
      durationDays: parseInt(reqLength) || 3,
      status: 'Approved',
      approvedBy: 'FIN_MANAGER'
    };

    setReopenRequests([newReq, ...reopenRequests]);
    // Set matching period to unlocked/reopened
    setPeriods(prev => prev.map(p => p.code === reqPeriodCode ? { ...p, status: 'Reopened', gl: 'Open' } : p));
    alert(`Success: Reopen Request [${newReq.id}] processed & approved under ERCA and IFRS-15 control limits.`);
  };

  const toggleChecklist = (code: string) => {
    setChecklist(prev => prev.map(c => {
      if (c.code === code) {
        const nextStatus = c.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...c, status: nextStatus, validated: nextStatus === 'Completed' };
      }
      return c;
    }));
  };

  const changePeriodStatus = (code: string, field: 'gl' | 'ap' | 'ar' | 'tax', nextVal: string) => {
    setPeriods(prev => prev.map(p => {
      if (p.code === code) {
        return { ...p, [field]: nextVal };
      }
      return p;
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col min-h-[700px] text-white shadow-2xl relative select-none">
      
      {/* Dynamic top safety line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-full shrink-0"></div>

      {/* Header Banner */}
      <div className="px-6 py-5 bg-[#0b0f19] border-b border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-400/20 rounded-xl flex items-center justify-center text-indigo-400">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="font-sans font-black text-slate-100 text-sm md:text-base leading-none">
              Fiscal Year & Accounting Period Setup
            </h2>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono uppercase tracking-widest">
              IFRS COMPLIANCE CONTROL SYSTEM • ET STATUTORY ARCHITECTURE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-1 bg-emerald-950 text-emerald-400 rounded-md border border-emerald-900 font-extrabold uppercase animate-pulse">
            ● Active Ledger Frame
          </span>
        </div>
      </div>

      {/* Sheet Content Workspace Viewport */}
      <div className="flex-1 p-5 md:p-6 overflow-y-auto max-h-[660px] bg-[#0c1220]">
        
        {/* TAB 1: README SHEET */}
        {activeSheet === 'S1' && (
          <div className="max-w-4xl mx-auto space-y-6 antialiased leading-relaxed">
            <div className="p-4 bg-gradient-to-r from-indigo-950/40 to-blue-950/40 border border-indigo-900/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Info className="w-5 h-5 shrink-0" />
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Workbook Purpose & Architecture</h3>
              </div>
              <p className="text-xs text-slate-300">
                This workbook serves as the final, complete, developer-ready specification for implementing the Fiscal Year & Accounting Period setups. It aligns the **where** of transactions (Chart of Accounts definitions) with the **when** (authorized post boundaries under IFRS standards and Ethiopian Ministry of Revenue customs dictates).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-mono font-black text-indigo-400">Intended Audience Usage</span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li><strong className="text-slate-200">Developers:</strong> Treat as precise blueprint for database entity structures, API endpoint requirements and client constraints.</li>
                  <li><strong className="text-slate-200">Finance Controllers:</strong> Learn how periods open, lock and support adjustment runs for financial disclosures.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-mono font-black text-emerald-400">Golden Accounting Priority Rule</span>
                <p className="text-xs text-slate-400">
                  A balanced Chart of Accounts defines <code className="text-emerald-400 font-mono">WHERE</code> postings occur. The Fiscal Period Register dictates <code className="text-indigo-400 font-mono">WHEN</code> ledger write triggers can run securely. Neither may be bypassed.
                </p>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-900/20 p-4 rounded-xl">
              <h4 className="font-sans font-black text-xs text-slate-300 uppercase tracking-wider mb-3">Required System setup Sequence</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-center font-bold">
                {[
                  '1. Company / Entity Setup', '2. Branch Setup', '3. Currency Setup',
                  '4. Fiscal Year Setup', '5. Accounting Period Setup', '6. Module Period Setup',
                  '7. Chart of Accounts Setup', '8. Opening Balance Setup', '9. Journal Posting Rules',
                  '10. Period Close Checklist', '11. Reopen Process Flow'
                ].map((seq, idx) => (
                  <div key={idx} className="p-2 border border-slate-800 bg-slate-900 rounded-lg text-slate-300 font-mono text-[10px] uppercase flex items-center justify-center">
                    {seq}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FISCAL YEAR REGISTER PAGE */}
        {activeSheet === 'S2' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="font-sans font-black text-base text-slate-100">Fiscal Years Registry</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">Multi-Entity General Ledger Bounds</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setActiveSheet('S3')} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fiscal Year</span>
                </button>
                <button 
                  onClick={() => handleGeneratePeriods('FY2026')} 
                  className="border border-indigo-400/20 hover:bg-slate-800 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Autogen FY26 Periods</span>
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Entity / Code</th>
                    <th className="p-3">Calendar / Dates</th>
                    <th className="p-3">Basis / Count</th>
                    <th className="p-3">Approval</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {fiscalYears.map((fy, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3">
                        <div className="font-bold text-white font-mono">{fy.code}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{fy.name}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-200">{fy.company.slice(0,25)}...</div>
                        <div className="font-mono text-[10px] text-indigo-400">{fy.startDate} • {fy.endDate}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-300 mr-2">{fy.basis}</span>
                        <span className="font-mono">{fy.periodsCount} periods</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          fy.approvalStatus === 'Approved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/60' : 'bg-amber-950/85 text-amber-400 border border-amber-900/50'
                        }`}>
                          {fy.approvalStatus}
                        </span>
                      </td>
                      <td className="p-3 space-x-1">
                        <button 
                          onClick={() => alert(`Starting period initialization rules for [${fy.code}]...`)}
                          className="bg-indigo-950 text-indigo-400 hover:bg-indigo-900 hover:text-white px-2 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                        >
                          Generate
                        </button>
                        <button 
                          onClick={() => alert(`Closing routine requirements initialized for [${fy.code}]`)}
                          className="bg-slate-850 text-slate-200 hover:bg-slate-800 px-2 py-1 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FY ADD EDIT FORM */}
        {activeSheet === 'S3' && (
          <form onSubmit={handleAddNewFY} className="max-w-2xl mx-auto bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-sans font-black text-sm text-indigo-300 uppercase tracking-widest pb-2 border-b border-slate-800">
              Configure New Fiscal Year Entity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Legal Entity *</label>
                <select 
                  value={newFyCompany} 
                  onChange={(e) => setNewFyCompany(e.target.value)}
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-100"
                >
                  <option>Qelem Meda Technologies (QMT)</option>
                  <option>QMT-SUB01 - Subsidiary 01</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Fiscal Year Code *</label>
                <input 
                  type="text" 
                  value={newFyCode} 
                  onChange={(e) => setNewFyCode(e.target.value)}
                  placeholder="e.g. FY2027" 
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-blue-400 font-mono font-black placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Name / Description *</label>
                <input 
                  type="text" 
                  value={newFyName} 
                  onChange={(e) => setNewFyName(e.target.value)}
                  placeholder="e.g. Fiscal Year 2027 - Standard" 
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-100" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Reporting Basis *</label>
                <select 
                  value={newFyBasis} 
                  onChange={(e) => setNewFyBasis(e.target.value)}
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-100"
                >
                  <option value="IFRS">IFRS Compliant Standards</option>
                  <option value="IFRS_SME">IFRS For SMEs</option>
                  <option value="Local Statutory">Ethiopian Statutory Audit basis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Start Date *</label>
                <input 
                  type="date" 
                  value={newFxStart} 
                  onChange={(e) => setNewFxStart(e.target.value)}
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-indigo-400 font-mono" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">End Date *</label>
                <input 
                  type="date" 
                  value={newFxEnd} 
                  onChange={(e) => setNewFxEnd(e.target.value)}
                  className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-indigo-400 font-mono" 
                  required
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded border border-slate-850 space-y-2 text-[11px] leading-relaxed">
              <span className="font-extrabold uppercase font-mono block text-amber-500">System Constraint: Period Structure</span>
              <p className="text-slate-400 font-sans">
                By default, saving this Fiscal Year configures 12 standard monthly periods + 3 structural entries (Opening balance frame, Adjustments loop, Closing ledger wash).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button 
                type="button" 
                onClick={() => setActiveSheet('S2')}
                className="bg-slate-800 hover:bg-slate-705 text-white px-3.5 py-2 rounded font-bold cursor-pointer transition-colors"
              >
                Back To Registries
              </button>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4.5 py-2 rounded font-bold cursor-pointer transition-all hover:scale-98"
              >
                Assemble FY Schema Draft
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: ACCOUNTING PERIOD REGISTER PAGE */}
        {activeSheet === 'S4' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="font-sans font-black text-sm text-slate-100">Accounting Periods State Mapping</h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase mt-1">Status controls by active General Ledger periods</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveSheet('S8')}
                  className="bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Close Checklist ({checklist.filter(c=>c.status==='Completed').length}/6)</span>
                </button>
                <button 
                  onClick={() => setActiveSheet('S9')}
                  className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-900/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Request Reopen</span>
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Period Code / Range</th>
                    <th className="p-2">Period Type</th>
                    <th className="p-2">GL Post</th>
                    <th className="p-2">AP Post</th>
                    <th className="p-2">AR Post</th>
                    <th className="p-2">Tax Post</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {periods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3">
                        <div className="font-bold text-white font-mono flex items-center gap-1.5">
                          <span>{p.code}</span>
                          {p.status === 'Reopened' && (
                            <span className="bg-amber-950 text-amber-400 px-1 py-0.2 rounded text-[8px] font-bold">REOPENED</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{p.name} • <span className="font-mono text-slate-500 text-[9px]">{p.startDate} to {p.endDate}</span></div>
                      </td>
                      <td className="p-2 text-[11px] font-semibold text-slate-300">{p.type}</td>
                      <td className="p-2">
                        <select 
                          value={p.gl} 
                          onChange={(e) => changePeriodStatus(p.code, 'gl', e.target.value)}
                          className={`bg-slate-950 font-mono text-[10px] border border-slate-800 rounded p-1 ${p.gl === 'Closed' ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Future">Future</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select 
                          value={p.ap} 
                          onChange={(e) => changePeriodStatus(p.code, 'ap', e.target.value)}
                          className={`bg-slate-950 font-mono text-[10px] border border-slate-800 rounded p-1 ${p.ap === 'Closed' ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Future">Future</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select 
                          value={p.ar} 
                          onChange={(e) => changePeriodStatus(p.code, 'ar', e.target.value)}
                          className={`bg-slate-950 font-mono text-[10px] border border-slate-800 rounded p-1 ${p.ar === 'Closed' ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Future">Future</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select 
                          value={p.tax} 
                          onChange={(e) => changePeriodStatus(p.code, 'tax', e.target.value)}
                          className={`bg-slate-950 font-mono text-[10px] border border-slate-800 rounded p-1 ${p.tax === 'Closed' ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Future">Future</option>
                        </select>
                      </td>
                      <td className="p-2 text-right">
                        <button 
                          onClick={() => alert(`Reviewing period checklist logs for ${p.code}`)}
                          className="bg-indigo-950 text-indigo-400 hover:bg-indigo-900 border border-indigo-950 px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Checklist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PERIOD ADD EDIT FORM */}
        {activeSheet === 'S5' && (
          <div className="max-w-2xl mx-auto bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-sans font-black text-sm text-indigo-300 uppercase tracking-widest pb-2 border-b border-slate-800">
              Manual Period Addition Form
            </h3>
            <div className="text-xs text-amber-500 bg-amber-950/20 p-3.5 border border-amber-900/30 rounded-lg leading-relaxed">
              <strong>IFRS Standard Rule Reminder:</strong> Manual period overrides are only recommended for custom/unusual fiscal years. It is highly advised to first use Sheet 6 "Period Generation Setup" to maintain strict mathematical date continuity.
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Fiscal Year Context</label>
                <input type="text" value="FY2026" disabled className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-500 font-mono font-bold" />
              </div>
              <div>
                <label className="block text-slate-450 font-bold mb-1">Period Code *</label>
                <input type="text" defaultValue="FY2026-P13" className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-indigo-400 font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Period Start Date</label>
                <input type="date" defaultValue="2026-12-31" className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-200" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Period End Date</label>
                <input type="date" defaultValue="2026-12-31" className="w-full bg-[#0c1322] border border-slate-800 rounded p-2 text-slate-200" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveSheet('S4')} className="bg-slate-800 text-xs px-3.5 py-1.8 rounded font-semibold">Cancel</button>
              <button onClick={() => alert('Validation failed: Accounting Period creation requires system admin privilege tier.')} className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white px-4 py-1.8 rounded font-black cursor-pointer">Register Period Override</button>
            </div>
          </div>
        )}

        {/* TAB 6: PERIOD GENERATION SETUP */}
        {activeSheet === 'S6' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">Standard Generating Logic Schema</span>
              <h3 className="font-sans font-black text-slate-100 text-sm mt-1 mb-2">Configure Automatic Generation Rules</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Ensures exact zero-gap, zero-overlap compliance bounds. The engine auto-allocates 12 continuous months plus auxiliary close cycles within structural boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#090f1b] border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Parameters & Naming Masks</h4>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span>Default Code Format:</span>
                    <strong className="font-mono text-white">FY[YYYY]-P[NN]</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span>Opening Balances Rule:</span>
                    <strong className="text-emerald-400 font-mono">FY[YYYY]-OPEN (0-Day)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-850">
                    <span>Adjustments Module:</span>
                    <strong className="text-indigo-400 font-mono">FY[YYYY]-ADJ (1-Day)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Year-End closes Module:</span>
                    <strong className="text-rose-400 font-mono">FY[YYYY]-CLOSE (0-Day)</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#090f1b] border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">Gap Prevention Validation</h4>
                <div className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                  <p>• Day boundaries are checked using Gregorian dates.</p>
                  <p>• Ethiopian Fiscal calendar automatically sets 13 periods (12 standard months of 30 days + Pagumiye month of 5/6 days).</p>
                  <p>• Error triggered when end date of Period [N] differs from start date of Period [N+1] by &gt; 1 day.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MODULE PERIOD CONTROL */}
        {activeSheet === 'S7' && (
          <div className="space-y-4 select-none">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Sub-Ledger Segregations</span>
              <h3 className="font-sans font-black text-slate-100 text-sm mt-1">Interlock Posting Matrix by Ledger Module</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Controls which subledger components can write into general journal tables. Sub-ledger closing routines must complete and lock prior to closing the parent General Ledger period.
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Module Name</th>
                    <th className="p-3 font-mono">Backend Key</th>
                    <th className="p-3">Required Dependency Before Close</th>
                    <th className="p-3">Postings Allowed When Locked</th>
                    <th className="p-3">Controlled Auditor Reopen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {[
                    { name: 'General Ledger', key: 'GL', dep: 'All Sub-ledgers locks verified', lock: 'NO (Critical Block)', reop: 'Requires CFO workflow Approval' },
                    { name: 'Accounts Payable', key: 'AP', dep: 'GRN accruals reconciled', lock: 'NO', reop: 'Allowed via supervisor card' },
                    { name: 'Accounts Receivable', key: 'AR', dep: 'Invoice streams balanced', lock: 'NO', reop: 'Allowed via supervisor card' },
                    { name: 'Cash & Bank', key: 'CB', dep: 'Statement reconcile matched', lock: 'NO', reop: 'CFO override keys' },
                    { name: 'Fixed Assets', key: 'FA', dep: 'Depreciation runoff completed', lock: 'NO', reop: 'Not Allowed after GL close' },
                    { name: 'Tax / ERCA Reports', key: 'TAX', dep: 'Withholding & VAT schedules filed', lock: 'NO', reop: 'Requires Compliance approval' }
                  ].map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{m.name}</td>
                      <td className="p-3 font-mono text-blue-400">{m.key}</td>
                      <td className="p-3 text-[11px] font-medium text-slate-400">{m.dep}</td>
                      <td className="p-3 font-mono text-rose-400 font-bold text-[10px]">{m.lock}</td>
                      <td className="p-3 text-[11px] font-medium text-indigo-400">{m.reop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: CLOSE CHECKLIST SETUP */}
        {activeSheet === 'S8' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-500 font-black uppercase">Process Control Center</span>
                <h3 className="font-sans font-black text-slate-100 text-sm mt-1">Period-End Closing Checklists</h3>
                <p className="text-xs text-slate-440 mt-1">Checklist items must complete before locking is accepted by system validations.</p>
              </div>
              <span className="bg-amber-950 text-amber-400 font-mono text-xs font-black px-2.5 py-1 rounded border border-amber-900/60">
                COMPLETED: {checklist.filter(c => c.status === 'Completed').length} / {checklist.length}
              </span>
            </div>

            {/* Checklist Items list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {checklist.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleChecklist(item.code)}
                  className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    item.status === 'Completed' 
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 text-slate-350'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.status === 'Completed'} 
                    onChange={() => {}} // toggled by clicking card
                    className="mt-1 h-3.5 w-3.5 rounded text-emerald-500 cursor-pointer" 
                  />
                  <div>
                    <div className="font-bold font-mono text-[10px] uppercase text-indigo-400 leading-none mb-1">{item.code} • {item.owner}</div>
                    <div className="text-xs font-semibold leading-snug">{item.name}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        item.status === 'Completed' ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CONTROLLED REOPEN SETUP */}
        {activeSheet === 'S9' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Request Form */}
            <form onSubmit={handlePostReopen} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
              <h3 className="font-sans font-black text-sm text-indigo-300 uppercase tracking-widest pb-1 border-b border-slate-800">
                Submit Period Reopen Voucher
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Closed Period *</label>
                  <select 
                    value={reqPeriodCode} 
                    onChange={(e) => setReqPeriodCode(e.target.value)}
                    className="w-full bg-[#0c1322] border border-slate-800 p-2 rounded text-slate-200 font-mono"
                  >
                    <option value="FY2026-P01">FY2026-P01 (Closed)</option>
                    <option value="FY2026-P02">FY2026-P02 (Closed)</option>
                    <option value="FY2026-P03">FY2026-P03 (Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Reason Category *</label>
                  <select 
                    value={reqReason} 
                    onChange={(e) => setReqReason(e.target.value)}
                    className="w-full bg-[#0c1322] border border-slate-800 p-2 rounded text-slate-200"
                  >
                    <option>Audit Adjustment</option>
                    <option>Bank Reconciliation Correction</option>
                    <option>Tax Schedule Modification</option>
                    <option>Year-End Allocations corrective run</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Target Duration (Days)</label>
                    <input 
                      type="number" 
                      value={reqLength} 
                      onChange={(e) => setReqLength(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 p-2 rounded text-indigo-400 font-mono" 
                      max="10" 
                      min="1" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-450 font-bold mb-1">Authorizer Role</label>
                    <input type="text" value="FIN_MANAGER" disabled className="w-full bg-[#0c1322]/40 border border-slate-810 p-2 rounded text-slate-500 font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-450 mb-1 font-bold">Reason Statement Details *</label>
                  <textarea 
                    value={reqExplanation} 
                    onChange={(e) => setReqExplanation(e.target.value)}
                    rows={2} 
                    className="w-full bg-[#0c1322] border border-slate-800 p-2.5 rounded text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="Enter thorough business justification..."
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase py-2 rounded shadow transition-all hover:scale-98 cursor-pointer">
                Issue Reopen & Grant Grace Token
              </button>
            </form>

            {/* Requests Log */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-90/40 border border-slate-800 rounded-xl">
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">Grace Tokens Audit Trail Log</h4>
                <p className="text-[11px] text-slate-450 mt-1">Tracks authorized period exposures for post audits.</p>
              </div>

              <div className="space-y-2">
                {reopenRequests.map((req, i) => (
                  <div key={i} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono select-none">
                      <span className="font-black text-indigo-400">{req.id}</span>
                      <span className="text-slate-400">{req.date}</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">Period: <span className="font-mono text-amber-400">{req.periodCode}</span></p>
                    <p className="text-[11px] text-slate-400 font-medium font-sans italic">"{req.reason}"</p>
                    <div className="flex items-center gap-2 pt-1 text-[9px] font-mono font-black uppercase">
                      <span className="bg-indigo-950 text-indigo-400 px-1 py-0.2 rounded">Dur: {req.durationDays} Days</span>
                      <span className="text-slate-500">Appr: {req.approvedBy}</span>
                      <span className="ml-auto bg-emerald-950 text-emerald-400 px-1.5 rounded">{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 10: FIELD SPECIFICATION */}
        {activeSheet === 'S10' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Technical Blueprint</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">System Field Architectural Specs</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-[#090f1b]">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#0b101c] text-indigo-405 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Field Key</th>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Default / ENUM</th>
                    <th className="p-3">Validation rules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-semibold">
                  {[
                    { key: 'company_code', type: 'VARCHAR(100)', req: 'YES', def: 'QMT', rule: 'Must match Legal entity directory key.' },
                    { key: 'fiscal_year_code', type: 'VARCHAR(30)', req: 'YES (Unique)', def: 'None', rule: 'Alpha-numeric, starts with EFY or FY.' },
                    { key: 'start_date', type: 'DATE', req: 'YES', def: 'None', rule: 'Must pre-date end_date mathematically.' },
                    { key: 'reporting_basis', type: 'VARCHAR(50)', req: 'YES', def: 'IFRS', rule: 'Choice: IFRS | IFRS_SME | STATUTORY' },
                    { key: 'period_status_status', type: 'VARCHAR(40)', req: 'YES', def: 'Draft', rule: 'Choice: Draft | Future | Open | Closed | Locked' },
                    { key: 'reopen_grace_expiry', type: 'TIMESTAMP', req: 'NO', def: 'Null', rule: 'Required if period is Reopened.' }
                  ].map((f, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-white font-bold">{f.key}</td>
                      <td className="p-3 font-mono text-indigo-400">{f.type}</td>
                      <td className="p-3">
                        <span className={`px-1 rounded text-[9px] font-black ${f.req.includes('YES') ? 'bg-indigo-950 text-indigo-400' : 'text-slate-500'}`}>{f.req}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{f.def}</td>
                      <td className="p-3 text-[11px] font-medium text-slate-300 max-w-xs truncate">{f.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 11: ENUM MASTER */}
        {activeSheet === 'S11' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Metadata Dictionaries</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">System Enum Value Master Registry</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Enum Group</th>
                    <th className="p-3">Backend Code / Key</th>
                    <th className="p-3">Business Value Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {[
                    { group: 'Fiscal Calendar Type', key: 'GREGORIAN | ETHIOPIAN | CUSTOM', desc: 'Determines period boundaries and standard Pagumiye rules' },
                    { group: 'Reporting Basis', key: 'IFRS | IFRS_SME | STATUTORY | MANAGEMENT', desc: 'Classification controls for financial disclosures' },
                    { group: 'Period Status', key: 'DRAFT | FUTURE | OPEN | SOFT_CLOSED | CLOSED | LOCKED', desc: 'Sequence posting permissions parameters' },
                    { group: 'Reopen Scope', key: 'FULL_PERIOD | MODULE_ONLY | READ_ONLY_REVIEW', desc: 'Allows granularity limiting write exposure during corrections' }
                  ].map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{e.group}</td>
                      <td className="p-3 font-mono text-blue-400 font-bold text-[11px]">{e.key}</td>
                      <td className="p-3 text-[11px] font-medium text-slate-400 leading-normal">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 12: LOOKUP MASTER */}
        {activeSheet === 'S12' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Referential Integrity</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Lookup Masters Architecture</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Lookup Table</th>
                    <th className="p-3">Foreign Key Target</th>
                    <th className="p-3">Business Intent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-semibold">
                  {[
                    { name: 'Legal Entity', fk: 'company_id', rule: 'Links accounting balances to statutory legal entity corporate bodies.' },
                    { name: 'Branch Locations', fk: 'branch_id', rule: 'Allocates regional postings (Addis Ababa, Adama, Bahir Dar).' },
                    { name: 'Audit User Directory', fk: 'user_id', rule: 'Validates operational staff credentials for reopening Closed periods.' }
                  ].map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{l.name}</td>
                      <td className="p-3 font-mono text-indigo-400">{l.fk}</td>
                      <td className="p-3 text-slate-400 font-medium text-xs leading-normal">{l.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 13: LOOKUP DATA */}
        {activeSheet === 'S13' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Sample Masters seed Records</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Legal Entities & Regional Branches Directories</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-405 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Code / Key</th>
                    <th className="p-3">Display Label</th>
                    <th className="p-3">Audit Role / Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {[
                    { cat: 'Company / Entity', code: 'QMT', label: 'Qelem Meda Technologies', role: 'Full Consolidation Parent' },
                    { cat: 'Branch Location', code: 'HQ', label: 'Addis Ababa - Head Office', role: 'HQ Segment Operations' },
                    { cat: 'Branch Location', code: 'BD_01', label: 'Bahir Dar Branch Region', role: 'Regional Retail Node' },
                    { cat: 'Financial Role', code: 'FIN_MANAGER', label: 'Finance Controller', role: 'Subledgers lock authorized' },
                    { cat: 'Financial Role', code: 'CHIEF_ACCOUNTANT', label: 'Chief Accountant', role: 'Period closing checklist signer' }
                  ].map((d, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 text-indigo-400 font-semibold">{d.cat}</td>
                      <td className="p-3 font-mono text-white font-bold">{d.code}</td>
                      <td className="p-3 font-bold text-slate-200">{d.label}</td>
                      <td className="p-3 text-[11px] text-slate-400 font-sans font-medium">{d.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 14: BACKEND BUSINESS RULES */}
        {activeSheet === 'S14' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Control Core rules Engine</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">ERP Multi-Entity Interlock Business Logic</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Rule ID</th>
                    <th className="p-3">Check Trigger Event</th>
                    <th className="p-3">Condition Check Logic</th>
                    <th className="p-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-semibold">
                  {[
                    { id: 'BR-FY-01', trigger: 'FY Creation', cond: 'Code must be unique across Entity domain.', sev: 'CRITICAL BLOCK' },
                    { id: 'BR-FY-03', trigger: 'Period Closing', cond: 'GL Period cannot close while unposted Journal ledger lines exist in draft queues.', sev: 'CRITICAL BLOCK' },
                    { id: 'BR-FY-04', trigger: 'Subledger interlocks', cond: 'General Ledger central accounts cannot close before AP, AR and Cash sub-journals are finalized and locked.', sev: 'CRITICAL BLOCK' },
                    { id: 'BR-REOP-02', trigger: 'Period Reopen Request', cond: 'Mandatory Reopen Reason and authorized FIN_MANAGER supervisor token duration required.', sev: 'CRITICAL' },
                    { id: 'BR-POST-01', trigger: 'Voucher Post Try', cond: 'Write operation rejected if target period state is CLOSED or LOCKED (IFRS compliance override safeguard).', sev: 'HARD BLOCK' }
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-black text-indigo-450">{r.id}</td>
                      <td className="p-3 text-slate-200">{r.trigger}</td>
                      <td className="p-3 text-[11px] text-slate-400 leading-normal font-medium">{r.cond}</td>
                      <td className="p-3">
                        <span className="bg-rose-950 text-rose-450 px-2 py-0.5 rounded font-bold text-[9px]">{r.sev}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 15: ERROR MESSAGES */}
        {activeSheet === 'S15' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-405 font-black uppercase">Validation Exceptions Mapping</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Friendly Diagnostic Messages</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Error Code</th>
                    <th className="p-3">User-Facing Standard Message</th>
                    <th className="p-3">Suggested corrective Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-medium">
                  {[
                    { code: 'ERR_FY_OVERLAP', msg: 'Accounting periods overlap with existing registered dates context.', act: 'Review dates range parameters of adjacent months to guarantee zero overlap.' },
                    { code: 'ERR_UNPOSTED_VOUCHERS', msg: 'Period cannot close: unposted manual journals remain in draft queue.', act: 'Post the outstanding Draft vouchers or delete them from Journal Registry Tab.' },
                    { code: 'ERR_SUBLEDGER_OPEN', msg: 'General Ledger closing routine failed: Accounts Payable subledger remains open.', act: 'Validate checklist signoff under Sheet 8 and soft-close Accounts Payable subledger first.' }
                  ].map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-rose-400 font-black">{e.code}</td>
                      <td className="p-3 text-slate-100 font-semibold">{e.msg}</td>
                      <td className="p-3 text-slate-400 text-[11px] leading-normal font-medium">{e.act}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 16: IMPORT TEMPLATE */}
        {activeSheet === 'S16' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">Mass Seeding Automation</span>
                <h3 className="font-sans font-black text-slate-100 text-sm mt-1">Excel XLS/CSV Import Schema</h3>
                <p className="text-xs text-slate-400 mt-1">Specifies bulk column structure for automatic data transfer configurations.</p>
              </div>
              <button 
                onClick={() => alert('Downloading standard Bulk period Import Template configuration XLS...')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold px-3 py-1.8 rounded flex items-center gap-1.5 transition-all text-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get Sample XLS</span>
              </button>
            </div>

            {/* Structured Table Rows */}
            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-[#090f1b]">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Company Code</th>
                    <th className="p-3">Fiscal Year Code</th>
                    <th className="p-3">Period Code</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">GL Posting Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-350 font-mono text-[11px] font-semibold">
                  {[
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-OPEN', s: '2026-01-01', e: '2026-01-01', st: 'Closed' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P01', s: '2026-01-01', e: '2026-01-31', st: 'Closed' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P02', s: '2026-02-01', e: '2026-02-28', st: 'Closed' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P03', s: '2026-03-01', e: '2026-03-31', st: 'Closed' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P04', s: '2026-04-01', e: '2026-04-30', st: 'Open' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P05', s: '2026-05-01', e: '2026-05-31', st: 'Open' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-P12', s: '2026-12-01', e: '2026-12-31', st: 'Future' },
                    { c: 'QMT', fy: 'FY2026', p: 'FY2026-ADJ', s: '2026-12-31', e: '2026-12-31', st: 'Future' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold font-sans text-white">{row.c}</td>
                      <td className="p-3 text-slate-200">{row.fy}</td>
                      <td className="p-3 font-bold text-indigo-400">{row.p}</td>
                      <td className="p-3">{row.s}</td>
                      <td className="p-3">{row.e}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-1 rounded text-[9px] font-black uppercase ${
                          row.st === 'Closed' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>{row.st}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 17: SAMPLE SETUP */}
        {activeSheet === 'S17' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Baseline configurations Seed</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Sample Fiscal Calendar 2026</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Pre-reconciled monthly calendar configuration conforming fully to EFY boundaries and international GAAP frameworks. Standard setup seeds 12 calendar segments plus structural buffers.
            </p>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-405 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Period Identifier</th>
                    <th className="p-3">Normal Name</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Primary Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-350 font-sans font-semibold">
                  {[
                    { id: 'FY2026-OPEN', name: 'Year Opening Balances', s: '2026-01-01', e: '2026-01-01', use: 'First-day openings only, locked post balance confirmation' },
                    { id: 'FY2026-P01', name: 'January 2026 Cycle', s: '2026-01-01', e: '2026-01-31', use: 'Standard Operational sales & purchases cycle' },
                    { id: 'FY2026-P06', name: 'June Mid-Year', s: '2026-06-01', e: '2026-06-30', use: 'Semi-annual reporting audit disclosure frame' },
                    { id: 'FY2026-ADJ', name: 'Adjustments Period', s: '2026-12-31', e: '2026-12-31', use: 'Audit Adjustments, tax adjustments reserves' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 text-white font-mono font-black">{row.id}</td>
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3 font-mono text-[11px] text-indigo-455">{row.s}</td>
                      <td className="p-3 font-mono text-[11px] text-indigo-455">{row.e}</td>
                      <td className="p-3 text-slate-400 font-medium text-[11px]">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 18: API BACKEND MODEL */}
        {activeSheet === 'S18' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Framework Data Dictionary</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Database Schema & Relational Keys</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#090f1b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Entity Table Name</th>
                    <th className="p-3">Relations / Key Fields</th>
                    <th className="p-3">Description / System Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-sans font-semibold">
                  {[
                    { tab: 'fiscal_years', keys: 'PK: fiscal_year_code | FK: company_code', desc: 'Saves base bounds, start/end dates, approval states and corporate reporting basis.' },
                    { tab: 'accounting_periods', keys: 'PK: period_code | FK: fiscal_year_code', desc: 'Registers specific periods with overall and ledger module-wise post locking switches.' },
                    { tab: 'period_close_checklists', keys: 'PK: checklist_id | FK: period_code', desc: 'Audit checklists required before sealing and locking GL period streams.' },
                    { tab: 'period_reopen_requests', keys: 'PK: request_id | FK: period_code', desc: 'Tracks CFO-authorized reopening grace windows, stating audit triggers and duration limits.' }
                  ].map((db, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white font-mono">{db.tab}</td>
                      <td className="p-3 font-mono text-blue-450 leading-normal max-w-xs truncate text-[11px]">{db.keys}</td>
                      <td className="p-3 text-slate-400 text-[11px] leading-relaxed font-sans font-medium">{db.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 19: API ENDPOINT SPEC */}
        {activeSheet === 'S19' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Web Services API Specs</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">JSON REST Endpoints Documentation</h3>
            
            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-[#090f1b]">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Endpoint</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Request payload Outline</th>
                    <th className="p-3">Authorization Layer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-mono font-medium text-[11px]">
                  {[
                    { endpoint: '/api/fiscal-years', m: 'POST', req: '{ code: "FY2026", basis: "IFRS" }', auth: 'FIN_ADMIN' },
                    { endpoint: '/api/fiscal-years/:code/generate', m: 'POST', req: 'Empty (Auto calculation run)', auth: 'FIN_ADMIN' },
                    { endpoint: '/api/periods/:id/module-status', m: 'PUT', req: '{ module: "AP", status: "Closed" }', auth: 'CHIEF_ACCOUNTANT' },
                    { endpoint: '/api/periods/reopen-request', m: 'POST', req: '{ period: "FY26-P01", reason: "Audit" }', auth: 'FIN_MANAGER' }
                  ].map((api, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{api.endpoint}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          api.m === 'POST' ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-950 text-amber-400'
                        }`}>{api.m}</span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] font-semibold">{api.req}</td>
                      <td className="p-3 text-sans font-bold text-slate-300 text-[11px]">{api.auth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 20: USER STORIES */}
        {activeSheet === 'S20' && (
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Functional Acceptance Criteria</span>
            <h3 className="font-sans font-black text-slate-100 text-sm">Business User Stories</h3>
            
            <div className="divide-y divide-slate-850 bg-[#090f1b] rounded-xl border border-slate-800 overflow-hidden">
              {[
                { title: 'Story 1: Automated Calendar Allocator', as: 'Finance Administrator', want: 'automatically generate 12 operational months + openings and audit closing auxiliary cycles', benefit: 'ensure strict mathematical date continuity with zero date gap overlap errors' },
                { title: 'Story 2: Granular Subledger Interlocks', as: 'Chief Accountant', want: 'temporarily lock or soft-close the Accounts Payable module while keeping General Ledger open', benefit: 'conclude supplier entries while allowing adjustments on core journal runs' },
                { title: 'Story 3: Regulated Auditing Corrections', as: 'External Auditor', want: 'request CFO authorization to grant a 3-day grace period for modifying a closed period', benefit: 'enforce strict audit-trail tracing of retroactive corrections without compromising compliance' }
              ].map((story, i) => (
                <div key={i} className="p-4 space-y-2 select-none hover:bg-slate-900/20">
                  <span className="text-[10px] font-mono font-black text-indigo-400">US-OP-0{i+1} • {story.title}</span>
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    As a <span className="text-indigo-400 font-bold">{story.as}</span>, I want to {story.want} so that I can {story.benefit}.
                  </p>
                  <div className="bg-slate-950/40 p-2 border border-slate-850 rounded text-[11px] text-slate-450 leading-relaxed font-sans">
                    <strong className="text-slate-300 font-mono">Acceptance Rule:</strong> System rejects lock release if the structural dependencies mapped under Sheet 8 are checked as incomplete.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 21: DEV CHECKLIST */}
        {activeSheet === 'S21' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">Implementation Milestones</span>
              <h3 className="font-sans font-black text-slate-100 text-sm mt-1">Developer Priority Checklist</h3>
              <p className="text-xs text-slate-440 mt-1">Guides full engineering cycle from schema definition to user acceptance runs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#090f1b] border border-slate-800 p-4 rounded-xl space-y-2.5 text-xs">
                <span className="text-[10px] uppercase font-mono font-black text-rose-455">1. Database Schemes</span>
                <ul className="text-slate-400 space-y-1.5 font-medium list-disc pl-4.5">
                  <li className="text-emerald-400">Seed 'fiscal_years' tables</li>
                  <li className="text-emerald-400">Seed 'accounting_periods'</li>
                  <li>Link audit log foreign keys</li>
                </ul>
              </div>

              <div className="bg-[#090f1b] border border-slate-800 p-4 rounded-xl space-y-2.5 text-xs">
                <span className="text-[10px] uppercase font-mono font-black text-amber-500">2. Backend Rules Validation</span>
                <ul className="text-slate-400 space-y-1.5 font-medium list-disc pl-4.5">
                  <li>Write overlap checks services</li>
                  <li>Write check for unposted vouchers</li>
                  <li>Incorporate ERCA tax constraints</li>
                </ul>
              </div>

              <div className="bg-[#090f1b] border border-slate-800 p-4 rounded-xl space-y-2.5 text-xs">
                <span className="text-[10px] uppercase font-mono font-black text-blue-400">3. Frontend UI Controls</span>
                <ul className="text-slate-400 space-y-1.5 font-medium list-disc pl-4.5">
                  <li>Period generators panels</li>
                  <li>Module-wise toggles cards</li>
                  <li>Reopen forms & grace tokens log</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER AREA: Spreadsheet Tab Selector (Excel Style Bottom Switcher) */}
      <div className="bg-[#080d17] border-t border-slate-800 shrink-0 select-none pb-2">
        <div className="px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="font-extrabold flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Active Workbook Tabs Panel (Click to swap Sheet views):</span>
          </span>
          <div className="text-slate-500">
            Current Sheet: <span className="text-indigo-400 font-bold">{SHEETS.find(s => s.id === activeSheet)?.name}</span>
          </div>
        </div>
        
        {/* Horizontal Scrolling Sheets Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {SHEETS.map((sh) => {
            const isActive = activeSheet === sh.id;
            return (
              <button
                key={sh.id}
                type="button"
                id={`workbook-sheet-${sh.id}`}
                onClick={() => {
                  setActiveSheet(sh.id);
                  if (onAddAuditLog) {
                    onAddAuditLog({
                      id: `AUD-FP-${Date.now().toString().slice(-4)}`,
                      timestamp: new Date().toISOString(),
                      user: 'mzerihun01@gmail.com',
                      action: 'WORKBOOK_NAVIGATION',
                      entityType: 'FISCAL_PERIOD_SHEET',
                      entityKey: sh.id,
                      description: `Browsed to Excel Workbook sheet: ${sh.name}`
                    });
                  }
                }}
                className={`py-1.5 px-3 rounded text-[11px] font-mono font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  isActive 
                    ? 'bg-[#121a2e] text-indigo-400 border-indigo-500 shadow-inner' 
                    : 'bg-[#0a0f1c]/80 text-slate-450 border-slate-850 hover:bg-[#0c1223] hover:text-slate-350'
                }`}
              >
                📊 {sh.name}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

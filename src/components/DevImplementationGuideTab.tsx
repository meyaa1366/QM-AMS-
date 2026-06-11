import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Workflow, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Code,
  BookOpen,
  Link,
  Layers,
  Settings,
  AlertCircle,
  FileText,
  Boxes,
  CheckCircle2,
  Lock,
  RefreshCw,
  Coins,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DevImplementationGuideTabProps {
  accounts?: any[];
}

export default function DevImplementationGuideTab({ accounts = [] }: DevImplementationGuideTabProps) {
  const [selectedTopic, setSelectedTopic] = useState<'architecture' | 'coa-linkage' | 'backend-rules' | 'api-integration' | 'qelem-branding'>('architecture');
  const [payloadAccountType, setPayloadAccountType] = useState('Asset');
  const [payloadAccountCode, setPayloadAccountCode] = useState('11010');
  const [payloadIsControl, setPayloadIsControl] = useState(true);
  const [payloadSlType, setPayloadSlType] = useState('Customer');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Simulated transaction boundary validation playground
  const [txPeriodCode, setTxPeriodCode] = useState('FY2026-P03');
  const [txAccountCode, setTxAccountCode] = useState('11200'); // Trade Receivables (Control)
  const [txSlCode, setTxSlCode] = useState('CUST-401'); // QELEM Subsidiary customer
  const [txJournalType, setTxJournalType] = useState('AR_INVOICE');
  const [txValidationResult, setTxValidationResult] = useState<any>(null);

  const simulateCoaValidation = () => {
    setIsValidating(true);
    setValidationResult(null);
    setTimeout(() => {
      const codeStart = payloadAccountCode.trim().slice(0, 1);
      const errors: string[] = [];
      const warnings: string[] = [];

      // BR-COA-02 Check
      if (payloadAccountType === 'Asset' && codeStart !== '1') {
        errors.push(`BR-COA-02 violation: Assets must start with code "1" in Qelem Meda ERP structure. Found: "${codeStart}"`);
      } else if (payloadAccountType === 'Liability' && codeStart !== '2') {
        errors.push(`BR-COA-02 violation: Liabilities must start with code "2". Found: "${codeStart}"`);
      } else if (payloadAccountType === 'Equity' && codeStart !== '3') {
        errors.push(`BR-COA-02 violation: Equity must start with code "3". Found: "${codeStart}"`);
      } else if (payloadAccountType === 'Revenue' && codeStart !== '4') {
        errors.push(`BR-COA-02 violation: Revenue must start with code "4". Found: "${codeStart}"`);
      } else if (payloadAccountType === 'Expense' && codeStart !== '5') {
        errors.push(`BR-COA-02 violation: Expenses must start with code "5". Found: "${codeStart}"`);
      }

      // BR-COA-06: Control Account missing subledger
      if (payloadIsControl && payloadSlType === 'None') {
        errors.push(`BR-COA-06 violation: A master Control Account [${payloadAccountCode}] must specify an active Subsidiary Ledger mapping type (Supplier, Customer, Bank, Stock etc) to guard reconciliation routes.`);
      }

      // BR-COA-07 & 08: Accounts Receivable / Payable controls
      if (payloadAccountCode.startsWith('112') && payloadIsControl && payloadSlType !== 'Customer') {
        warnings.push(`BR-COA-07 warning: Receivables Control Node [${payloadAccountCode}] is normally assigned to Customer Subsidiary Ledger type. Found: "${payloadSlType}"`);
      }
      if (payloadAccountCode.startsWith('210') && payloadIsControl && payloadSlType !== 'Supplier') {
        warnings.push(`BR-COA-08 warning: Payables Control Node [${payloadAccountCode}] normally maps to Supplier subsidiary ledger. Found: "${payloadSlType}"`);
      }

      setValidationResult({
        success: errors.length === 0,
        errors,
        warnings,
        message: errors.length === 0 ? "Account metadata conforms perfectly to Qelem Meda backend schemas (v4.1)." : "Schemas evaluation failed with severe block policies."
      });
      setIsValidating(false);
    }, 600);
  };

  const simulateTransactionRules = () => {
    // Check Posting Boundaries (Where vs When Integration)
    // FY2026-P03 is SOFT_CLOSED/REOPENED_TEMPORARILY
    // AR_INVOICE posting to 11200 (Control) needs an active Customer SL code
    const logs: string[] = [];
    let passed = true;

    logs.push(`[1] Fetching boundary validation context for location period: ${txPeriodCode}...`);
    if (txPeriodCode === 'FY2026-P01' || txPeriodCode === 'FY2026-P02') {
      logs.push(`⚠️ Rule BR-PER-03 Block: Target accounting period ${txPeriodCode} is officially LOCKED for posting GL writes.`);
      passed = false;
    } else if (txPeriodCode === 'FY2026-P03') {
      logs.push(`ℹ️ Context: Period is TEMPORARILY REOPENED via certified auditor token.`);
    }

    logs.push(`[2] Verifying chart destination metadata for account: ${txAccountCode}...`);
    const isControlAccount = txAccountCode === '11200' || txAccountCode === '21000';
    if (isControlAccount) {
      logs.push(`ℹ️ Context Account is marked as General Ledger CONTROL account.`);
      if (!txSlCode || txSlCode.trim() === '') {
        logs.push(`❌ Rule BR-SL-01 Violation: Post attempts on Control account ${txAccountCode} without explicit subledger identifier blocked from compiling entry.`);
        passed = false;
      } else {
        logs.push(`✅ Passed: Subsidiary reference [${txSlCode}] parsed & matched successfully.`);
      }
    }

    logs.push(`[3] Checking functional module-level status in period matrix...`);
    if (txPeriodCode === 'FY2026-P06') {
      logs.push(`❌ Rule BR-MOD-04 Violation: Accounts Receivable subledger module is CLOSED in Period ${txPeriodCode}. Please post in next open period.`);
      passed = false;
    } else {
      logs.push(`✅ Passed: AR Subledger posting registry is marked OPEN for selected period frame.`);
    }

    setTxValidationResult({
      success: passed,
      logs,
      message: passed ? "Double-entry rules passed. Transaction authorized to write to ledger databases." : "Post attempt REJECTED in pre-flight compliance parser."
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col min-h-[700px] text-slate-100 shadow-2xl relative select-none">
      
      {/* Brand Header */}
      <div className="px-6 py-5 bg-[#0b0f19] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Qelem Meda Emblem */}
          <div className="w-12 h-12 bg-indigo-650/15 border-2 border-indigo-500 rounded-2xl flex items-center justify-center text-[#24389c] relative overflow-hidden shrink-0">
            {/* Gold curve overlay */}
            <div className="absolute top-0 right-0 w-6 h-6 border-2 border-amber-500 rounded-full translate-x-3 -translate-y-3"></div>
            <span className="font-sans font-black text-lg text-indigo-400">QM</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black text-slate-100 text-sm md:text-base leading-none">
                QELEM MEDA ERP FINANCE • IMPLEMENTATION MANUAL
              </h2>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                v4.1 spec
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono uppercase tracking-widest">
              A comprehensive technical integration manual for full-stack developers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#24389c]/20 border border-[#24389c] text-indigo-300 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Building2Icon className="w-4 h-4 text-amber-500" />
            <span>Meda System Integrators Core</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-[550px] bg-[#0c1220]">
        
        {/* Left Topics menu panel */}
        <div className="w-full lg:w-72 bg-[#090f1b] border-r border-slate-805 p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-mono text-amber-500 font-black uppercase tracking-wider mb-3 px-2">
            Technical Specs Manual
          </div>
          <button 
            onClick={() => setSelectedTopic('architecture')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left cursor-pointer transition-all ${
              selectedTopic === 'architecture' 
                ? 'bg-[#24389c] text-white border-l-4 border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4 shrink-0 text-amber-450" />
            <span>1. System Architecture</span>
          </button>

          <button 
            onClick={() => setSelectedTopic('coa-linkage')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left cursor-pointer transition-all ${
              selectedTopic === 'coa-linkage' 
                ? 'bg-[#24389c] text-white border-l-4 border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Link className="w-4 h-4 shrink-0 text-amber-450" />
            <span>2. Dynamic COA Linkages</span>
          </button>

          <button 
            onClick={() => setSelectedTopic('backend-rules')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left cursor-pointer transition-all ${
              selectedTopic === 'backend-rules' 
                ? 'bg-[#24389c] text-white border-l-4 border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-450" />
            <span>3. Backend Validation Rules</span>
          </button>

          <button 
            onClick={() => setSelectedTopic('api-integration')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left cursor-pointer transition-all ${
              selectedTopic === 'api-integration' 
                ? 'bg-[#24389c] text-white border-l-4 border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4 shrink-0 text-amber-450" />
            <span>4. REST APIs Specs</span>
          </button>

          <button 
            onClick={() => setSelectedTopic('qelem-branding')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left cursor-pointer transition-all ${
              selectedTopic === 'qelem-branding' 
                ? 'bg-[#24389c] text-white border-l-4 border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-amber-450" />
            <span>5. Qelem Meda Branding Guide</span>
          </button>

          {/* Guide Note Box */}
          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] leading-relaxed text-slate-450 px-2 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold uppercase">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>COA Golden Rule</span>
            </div>
            <p>
              Chart of Accounts specifies <strong>WHERE</strong> posting maps. Fiscal calendar manages <strong>WHEN</strong> ledger write is permitted.
            </p>
          </div>
        </div>

        {/* Right workspace Viewport */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto max-h-[660px] bg-[#0c1220]">
          
          {/* TOPIC 1: SYSTEM ARCHITECTURE */}
          {selectedTopic === 'architecture' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <h3 className="font-sans font-black text-lg text-slate-100 flex items-center gap-2 uppercase">
                  <Workflow className="text-amber-500 w-5.5 h-5.5" />
                  ERP Double Entry & Subledger Integrity Architecture
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  In the Qelem Meda Accounting Management System, transactions are handled as standard ledger posts with explicit module segregation controls. All data follows strict validation routes to secure clean financial statements.
                </p>
              </div>

              {/* Diagrams block */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-amber-500 uppercase font-mono tracking-wider">
                  Transaction Post Pipeline Validation Sequence
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-center text-[11px] font-sans">
                  <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg">
                    <span className="block font-mono text-indigo-400 font-bold mb-1">STEP 1</span>
                    <strong className="text-slate-200">User Input Request</strong>
                    <span className="text-[10px] text-slate-400 block mt-1">Payload structure check</span>
                  </div>
                  <div className="flex items-center justify-center text-indigo-500 font-bold font-mono">→</div>
                  <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg">
                    <span className="block font-mono text-amber-500 font-bold mb-1">STEP 2</span>
                    <strong className="text-slate-200">Fiscal Period check</strong>
                    <span className="text-[10px] text-slate-400 block mt-1">Status mapping rules</span>
                  </div>
                  <div className="flex items-center justify-center text-indigo-500 font-bold font-mono">→</div>
                  <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg">
                    <span className="block font-mono text-emerald-500 font-bold mb-1">STEP 3</span>
                    <strong className="text-slate-200">COA Metadata check</strong>
                    <span className="text-[10px] text-slate-400 block mt-1">Control / SL type logic</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  * Any failure in any step aborts the transaction immediately using database transaction isolation rollbacks, returning a standardized business-friendly error code.
                </p>
              </div>

              {/* Database Schema and structure mapping */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" />
                  Compulsory Relational Schemas Table
                </h4>
                
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0b101c] text-indigo-400 border-b border-slate-850 font-bold font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Entity Name</th>
                        <th className="p-3">Primary Key / Key Columns</th>
                        <th className="p-3">Foreign Key Bounds</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-sans">
                      <tr>
                        <td className="p-3 font-bold font-mono text-white">chart_of_accounts</td>
                        <td className="p-3 font-mono">account_code (PK)</td>
                        <td className="p-3 font-mono text-slate-400">entity_id</td>
                        <td className="p-3 text-slate-400 text-[11px]">Sub-ledger control mappings, reporting classifications (Assets, Liabilities, Equity)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold font-mono text-white">fiscal_years</td>
                        <td className="p-3 font-mono">fiscal_year_code (PK)</td>
                        <td className="p-3 font-mono text-slate-400">entity_id</td>
                        <td className="p-3 text-slate-405 text-[11px]">Start/End Gregorian/Ethiopian dates, approval status, reporting basis</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold font-mono text-white">accounting_periods</td>
                        <td className="p-3 font-mono">period_code (PK)</td>
                        <td className="p-3 font-mono text-amber-500">fiscal_year_code</td>
                        <td className="p-3 text-slate-400 text-[11px]">Period status controls, soft closures, lock expiration markers</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold font-mono text-white">journal_entries</td>
                        <td className="p-3 font-mono">entry_id (PK)</td>
                        <td className="p-3 font-mono text-indigo-400">account_code, period_code</td>
                        <td className="p-3 text-slate-400 text-[11px]">Active posting vouchers ledger entries, audits references</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 2: DYNAMIC COA LINKAGES */}
          {selectedTopic === 'coa-linkage' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <h3 className="font-sans font-black text-lg text-slate-100 flex items-center gap-2 uppercase">
                  <Link className="text-amber-500 w-5.5 h-5.5" />
                  Dynamic Chart of Accounts Linkages Map
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Our system architecture enforces tight data synchronization where the Chart of Accounts accounts link directly to every operational view. Explore how edits in the COA affect downstream ledgers and compliant reporting sheets in real-time.
                </p>
              </div>

              {/* COA Linkages grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>Financial Statements & Balance Sheets Linkages</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Reporting categories (e.g., Asset, Liability) roll up directly to financial statements. Edits to any ledger account balances immediately recalculate Trial Balance, comprehensively feeding Profit & Loss (P&L) and Statement of Financial Positions without manual sync steps.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Boxes className="w-4 h-4 text-amber-500" />
                    <span>Subsidiary Ledger (SL) Dynamic Sync</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Control Accounts (e.g., Accounts Payable Control 21000) are flagged at COA registry time. Our ledger posting process forbids direct post attempts unless accompanied by valid subledger customer/supplier indexes.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Lock className="w-4 h-4 text-rose-500" />
                    <span>Module-Wise Posting Restrictive Interlocks</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    When module period matrices (Accounts Payable, Purchasing) is flagged CLOSED, any voucher attempted with Accounts Payable ledger targets is automatically BLOCKED at the backend server.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Lookup Mapping Data & Master Alignment</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Enums (Currency, Branch etc) provide parameters to control accounts. This ensures structured dimensions can be added to standard ledger entries while ensuring total double-entry balancing.
                  </p>
                </div>
              </div>

              {/* Visual Playground for boundary posting verification */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-body-xs font-black text-indigo-300 font-mono uppercase tracking-widest">
                      Developer Posting Compliance Simulator
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Check a transaction's legality across both Chart of Accounts rules and Fiscal Period boundaries before DB write.
                    </p>
                  </div>
                  <button 
                    onClick={simulateTransactionRules}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Simulate Post Check</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Fiscal Period</label>
                    <select 
                      value={txPeriodCode} 
                      onChange={(e) => setTxPeriodCode(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                    >
                      <option value="FY2026-P01">FY2026-P01 (Closed)</option>
                      <option value="FY2026-P03">FY2026-P03 (Reopened)</option>
                      <option value="FY2026-P04">FY2026-P04 (Open)</option>
                      <option value="FY2026-P06">FY2026-P06 (AR Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">GL Account Destination</label>
                    <select 
                      value={txAccountCode} 
                      onChange={(e) => setTxAccountCode(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                    >
                      <option value="11200">11200 Trade Receivables (Control)</option>
                      <option value="21000">21000 Trade Payables (Control)</option>
                      <option value="11010">11010 Cash / Bank Standard Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Subsidiary Index Code</label>
                    <input 
                      type="text" 
                      value={txSlCode} 
                      onChange={(e) => setTxSlCode(e.target.value)}
                      placeholder="e.g. CUST-401" 
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-indigo-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-405 mb-1">Subledger Module Context</label>
                    <select 
                      value={txJournalType} 
                      onChange={(e) => setTxJournalType(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-slate-200"
                    >
                      <option value="AR_INVOICE">Accounts Receivable Invoice</option>
                      <option value="AP_INVOICE">Accounts Payable Invoice</option>
                      <option value="GL_JOURNAL">Manual General Journal</option>
                    </select>
                  </div>
                </div>

                {txValidationResult && (
                  <div className="bg-[#090f1b]/80 border border-slate-800 p-4 rounded-lg space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${txValidationResult.success ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <strong className={`text-xs ${txValidationResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {txValidationResult.message}
                      </strong>
                    </div>
                    <div className="space-y-1 mt-2.5">
                      {txValidationResult.logs.map((log: string, i: number) => (
                        <p key={i} className="font-mono text-[10px] text-slate-400 leading-relaxed pl-3 border-l border-slate-800">
                          {log}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOPIC 3: BACKEND VALIDATION RULES */}
          {selectedTopic === 'backend-rules' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <h3 className="font-sans font-black text-lg text-slate-100 flex items-center gap-2 uppercase">
                  <ShieldCheck className="text-amber-500 w-5.5 h-5.5" />
                  Compulsory Backend COA & Period Validation Rules
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  All write controllers (Express API routes) must enforce this suite of business policies. Failure to validate will instantly corrupt financial positions.
                </p>
              </div>

              {/* Rules List table */}
              <div className="space-y-3.5">
                {[
                  { id: 'BR-COA-01', name: 'Account Code Uniqueness', desc: 'Checks database uniqueness for active legal records. Duplicate codes are critical blockage.', severity: 'CRITICAL' },
                  { id: 'BR-COA-02', name: 'Standard Account Code Ranges', desc: 'Validates type prefixes: Asset starts with "1", Liability "2", Equity "3", Revenue "4", Expense "5".', severity: 'CRITICAL' },
                  { id: 'BR-COA-06', name: 'Control Account Subledger Mapping', desc: 'If control Account check is set YES, active Subsidiary Ledger mapping type (Supplier, Customer etc) must be provided.', severity: 'CRITICAL' },
                  { id: 'BR-PER-01', name: 'Period Continuous Continuity', desc: 'Period date ranges cannot have overlap. Checks start date of P[N+1] matches P[N] + 1 day.', severity: 'CRITICAL' },
                  { id: 'BR-PER-03', name: 'Closed Period Blockage', desc: 'When overall posting status is CLOSED or LOCKED, direct write queries fail immediately with error.', severity: 'CRITICAL' }
                ].map((rule) => (
                  <div key={rule.id} className="bg-slate-900 border border-slate-800 p-4.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/40">
                          {rule.id}
                        </span>
                        <h4 className="font-sans font-extrabold text-sm text-slate-200">{rule.name}</h4>
                      </div>
                      <span className="text-[9px] font-mono font-black bg-rose-950 text-rose-450 px-2 py-0.5 rounded border border-rose-900/60">
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive Validation Simulator */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <span className="text-[10px] uppercase font-mono font-black text-amber-500">Integrity Sandbox</span>
                <h4 className="text-sm font-black text-slate-200">Interactive COA Schema Validator</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Account Type</label>
                    <select 
                      value={payloadAccountType} 
                      onChange={(e) => setPayloadAccountType(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-slate-200"
                    >
                      <option value="Asset">Asset</option>
                      <option value="Liability">Liability</option>
                      <option value="Revenue">Revenue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Proposed Code</label>
                    <input 
                      type="text" 
                      value={payloadAccountCode} 
                      onChange={(e) => setPayloadAccountCode(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-indigo-400 font-mono font-black placeholder-slate-700" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Is Control Account?</label>
                    <div className="flex gap-4 mt-2">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" checked={payloadIsControl} onChange={() => setPayloadIsControl(true)} />
                        <span>Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" checked={!payloadIsControl} onChange={() => setPayloadIsControl(false)} />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Subledger Target</label>
                    <select 
                      value={payloadSlType} 
                      onChange={(e) => setPayloadSlType(e.target.value)}
                      className="w-full bg-[#0c1322] border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Supplier">Supplier</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={simulateCoaValidation}
                    disabled={isValidating}
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning rules...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Run Metadata Test</span>
                      </>
                    )}
                  </button>
                </div>

                {validationResult && (
                  <div className={`p-4 border rounded-xl space-y-2 animate-fadeIn ${
                    validationResult.success 
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                      : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${validationResult.success ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <strong className="text-xs">{validationResult.message}</strong>
                    </div>
                    {validationResult.errors.map((err: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono pl-3 border-l border-rose-800 text-rose-450 leading-relaxed">
                        {err}
                      </p>
                    ))}
                    {validationResult.warnings.map((warn: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono pl-3 border-l border-amber-800 text-amber-400 leading-relaxed">
                        {warn}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOPIC 4: REST APIS SPECS */}
          {selectedTopic === 'api-integration' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <h3 className="font-sans font-black text-lg text-slate-100 flex items-center gap-2 uppercase">
                  <Code className="text-amber-500 w-5.5 h-5.5" />
                  Certified Developer REST API Specifications
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  All transactional integrations (posting journals, creating accounts, modifying statuses, fetching reports) must run through this standardized JSON schema specifications base, validating double-entry rules.
                </p>
              </div>

              {/* API Route breakdown card */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <span className="font-mono text-[#24389c] text-xs font-black bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/30">
                    POST /api/v1/journal-entries
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono bg-[#0c1220] px-2 py-0.5 rounded">
                    Ledger writer spec
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="text-xs text-slate-350 leading-relaxed">
                    <strong>Endpoint Purpose:</strong> Accept a transaction bundle containing debit and credit schedules, verify overall period status bounds, apply balance equality rules, and write securely to ledger database.
                  </div>

                  <div className="space-y-2">
                    <span className="block font-sans font-bold text-xs text-slate-300">Payload Schema Reference (JSON):</span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-rose-400 font-mono text-[10px] overflow-x-auto leading-normal">
{`{
  "period_code": "FY2026-P03",
  "voucher_type": "AR_INVOICE",
  "transaction_date": "2026-03-25",
  "lines": [
    {
      "account_code": "11200", 
      "subsidiary_code": "CUST-401",
      "debit_amount": 15000.00,
      "credit_amount": 0.00,
      "description": "Debit Trade Receivables - Bole Plaza sales"
    },
    {
      "account_code": "41010",
      "subsidiary_code": null,
      "debit_amount": 0.00,
      "credit_amount": 15000.00,
      "description": "Credit Standard revenue - Bole Plaza sales"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 5: BRAnDING AND THEME */}
          {selectedTopic === 'qelem-branding' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <h3 className="font-sans font-black text-lg text-[#24389c] dark:text-indigo-400 flex items-center gap-2 uppercase">
                  <Sparkles className="text-amber-500 w-5.5 h-5.5" />
                  Qelem Meda Brand Design & Colors System
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  The visual identity of Qelem Meda Accounting Management System relies on precise harmony of Deep Royal Blue (#24389c) and warm Yellow Gold. Together, these convey security, precision, and compliance.
                </p>
              </div>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-800 bg-[#090f1b] rounded-xl flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#24389c] rounded-lg shadow-inner shrink-0 relative border border-slate-700">
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/70 font-bold">#24389C</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-sans">1. Meda Royal Blue (Primary)</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">
                      Our signature corporate blue. Dominates headers, primary utility buttons, active tab states, and database lock frames.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-slate-800 bg-[#090f1b] rounded-xl flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-lg shadow-inner shrink-0 relative border border-slate-700">
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-900/70 font-bold">#F5A623</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-sans">2. Qelem Amber Gold (Accent)</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">
                      The golden accent. Highlights warning flags, scan badges, active workflow states, and branding borders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Branding Showcase Card */}
              <div className="p-5 border border-indigo-900 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 rounded-xl space-y-3.5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#24389c]/10 rounded-full blur-2xl"></div>
                <div className="absolute left-0 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                
                <span className="text-[10px] font-mono text-amber-500 font-black uppercase tracking-widest block">
                  BRAND SYMBOL SHOWCASE
                </span>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  Notice the subtle usage: all primary buttons hover into Meda Royal Blue, and check buttons pulse with a warm gold ring. Look out for the Qelem Meda compliance watermark in page corners!
                </p>

                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="bg-[#24389c] text-white px-2 py-1 rounded">Meda Blue Frame</span>
                  <span className="bg-amber-500 text-slate-950 px-2 py-1 rounded">Qelem Accent Badge</span>
                  <span className="border border-slate-700 px-2 py-1 rounded text-slate-400">Carbon Slate</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

// Inline fallback icon components
function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  Save, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  Workflow, 
  Coins, 
  MapPin, 
  Grid3X3, 
  CheckSquare 
} from 'lucide-react';
import { Account, AccountType, AccountStatus, ApprovalStatus, SLType, DimensionControl, BalanceType } from '../types';
import BusinessTooltip from './BusinessTooltip';
import { 
  COMPANIES, 
  BRANCHES, 
  ACCOUNT_TYPES, 
  GROUPS, 
  SUBGROUPS, 
  IFRS_CLASSES, 
  FINANCIAL_STATEMENT_LINES, 
  VAT_CODES, 
  WHT_CODES, 
  ETHIOPIAN_TAX_CATEGORIES 
} from '../data';

const CATEGORIES_BY_TYPE: Record<AccountType, string[]> = {
  Asset: [
    'Current Asset',
    'Non-Current Asset',
    'Cash and Cash Equivalents',
    'Trade and Other Receivables',
    'Inventory',
    'Prepayment',
    'Property, Plant and Equipment',
    'Intangible Asset'
  ],
  Liability: [
    'Current Liability',
    'Non-Current Liability',
    'Trade and Other Payables',
    'Tax Payable',
    'Borrowings',
    'Lease Liability',
    'Accrued Expense'
  ],
  Equity: [
    'Share Capital',
    'Retained Earnings',
    'Legal Reserve',
    'Revaluation Reserve',
    'Current Year Profit or Loss'
  ],
  Revenue: [
    'Sales Revenue',
    'Service Revenue',
    'Other Income',
    'Finance Income'
  ],
  'Cost of Sales': [
    'Cost of Goods Sold',
    'Cost of Services',
    'Direct Cost',
    'Production Cost'
  ],
  Expense: [
    'Administrative Expense',
    'Selling and Distribution Expense',
    'Employee Benefit Expense',
    'Depreciation Expense',
    'Finance Cost',
    'Tax Expense',
    'Other Expense'
  ]
};

const getAccountTypeLabel = (type: string) => {
  if (type === 'Revenue') return 'Income';
  if (type === 'Cost of Sales') return 'Cost';
  return type;
};

interface AddEditAccountTabProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSave: (account: Account) => void;
  onCancel: () => void;
}

export default function AddEditAccountTab({
  accounts,
  selectedAccount,
  onSave,
  onCancel
}: AddEditAccountTabProps) {
  // State for form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [parentAccount, setParentAccount] = useState('None');
  const [level, setLevel] = useState(1);
  const [company, setCompany] = useState(COMPANIES[0]);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [accountType, setAccountType] = useState<AccountType>('Asset');
  const [group, setGroup] = useState('');
  const [subgroup, setSubgroup] = useState('');
  const [ifrsClass, setIfrsClass] = useState(IFRS_CLASSES[0]);
  const [financialStatementLine, setFinancialStatementLine] = useState(FINANCIAL_STATEMENT_LINES[0]);
  
  // Posting Controls
  const [postingAllowed, setPostingAllowed] = useState(true);
  const [isHeaderAccount, setIsHeaderAccount] = useState(false);
  const [controlAccount, setControlAccount] = useState(false);
  const [manualJournalAllowed, setManualJournalAllowed] = useState(true);
  const [systemPostingOnly, setSystemPostingOnly] = useState(false);

  // Subsidiary Ledger
  const [slType, setSlType] = useState<SLType>('None');
  const [slRequired, setSlRequired] = useState(false);
  const [slMappingCode, setSlMappingCode] = useState('');

  // Tax & Compliance
  const [vatCode, setVatCode] = useState(VAT_CODES[4]); // N/A
  const [whtCode, setWhtCode] = useState(WHT_CODES[3]); // N/A
  const [ethiopianTaxCategory, setEthiopianTaxCategory] = useState(ETHIOPIAN_TAX_CATEGORIES[0]);

  // Currency
  const [currency, setCurrency] = useState('ETB');
  const [multiCurrency, setMultiCurrency] = useState(false);
  const [revaluationRequired, setRevaluationRequired] = useState(false);

  // Reporting Dimensions
  const [costCenter, setCostCenter] = useState<DimensionControl>('Optional');
  const [department, setDepartment] = useState<DimensionControl>('Optional');
  const [project, setProject] = useState<DimensionControl>('Optional');
  const [segment, setSegment] = useState<DimensionControl>('Mandatory');
  const [profitCenter, setProfitCenter] = useState<DimensionControl>('Optional');

  // Workflow & Status
  const [status, setStatus] = useState<AccountStatus>('Draft');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Not Submitted');
  const [balance, setBalance] = useState<BalanceType>('Debit');
  const [createdBy, setCreatedBy] = useState('mzerihun01@gmail.com');
  const [approvedBy, setApprovedBy] = useState('');
  const [auditTrailNotes, setAuditTrailNotes] = useState('');

  // Real-time compliance warnings array
  const [warnings, setWarnings] = useState<string[]>([]);

  // Step indicator state for easy wizard step follow-up
  const [step, setStep] = useState<number>(1);

  // Load account for editing
  useEffect(() => {
    if (selectedAccount) {
      setCode(selectedAccount.code);
      setName(selectedAccount.name);
      setParentAccount(selectedAccount.parentAccount || 'None');
      setLevel(selectedAccount.level || 1);
      setCompany(selectedAccount.company || COMPANIES[0]);
      setBranch(selectedAccount.branch || BRANCHES[0]);
      setAccountType(selectedAccount.accountType || 'Asset');
      setGroup(selectedAccount.group || '');
      setSubgroup(selectedAccount.subgroup || '');
      setIfrsClass(selectedAccount.ifrsClass || IFRS_CLASSES[0]);
      setFinancialStatementLine(selectedAccount.financialStatementLine || FINANCIAL_STATEMENT_LINES[0]);
      
      setPostingAllowed(selectedAccount.postingAllowed);
      setIsHeaderAccount(!selectedAccount.postingAllowed);
      setControlAccount(selectedAccount.controlAccount);
      setManualJournalAllowed(selectedAccount.manualJournalAllowed);
      setSystemPostingOnly(selectedAccount.systemPostingOnly);

      setSlType(selectedAccount.slType || 'None');
      setSlRequired(selectedAccount.slType !== 'None');
      setSlMappingCode(selectedAccount.slMappingCode || '');

      setVatCode(selectedAccount.vatCode || VAT_CODES[4]);
      setWhtCode(selectedAccount.whtCode || WHT_CODES[3]);
      setEthiopianTaxCategory(selectedAccount.ethiopianTaxCategory || ETHIOPIAN_TAX_CATEGORIES[0]);

      setCostCenter(selectedAccount.costCenter || 'Optional');
      setDepartment(selectedAccount.department || 'Optional');
      setProject(selectedAccount.project || 'Optional');
      setSegment(selectedAccount.segment || 'Mandatory');
      setProfitCenter(selectedAccount.profitCenter || 'Optional');

      setStatus(selectedAccount.status || 'Draft');
      setApprovalStatus(selectedAccount.approvalStatus || 'Not Submitted');
      setBalance(selectedAccount.balance || 'Debit');
      setCreatedBy(selectedAccount.createdBy || 'mzerihun01@gmail.com');
      setApprovedBy(selectedAccount.approvedBy || '');
      setAuditTrailNotes(selectedAccount.auditTrailNotes || 'Opening modification for adjustments.');
    } else {
      resetForm();
    }
  }, [selectedAccount]);

  // Adjust level based on selected Parent Account
  useEffect(() => {
    if (parentAccount === 'None') {
      setLevel(1);
    } else {
      const p = accounts.find(a => a.code === parentAccount);
      if (p) {
        setLevel((p.level || 1) + 1);
        setCompany(p.company); // Inherit company from parent
      }
    }
  }, [parentAccount, accounts]);

  // Sync Posting Allowed with Header Account Helper
  useEffect(() => {
    if (isHeaderAccount) {
      setPostingAllowed(false);
      setManualJournalAllowed(false);
    } else {
      setPostingAllowed(true);
      setManualJournalAllowed(true);
    }
  }, [isHeaderAccount]);

  // Sync SL Required value with SL Type
  useEffect(() => {
    setSlRequired(slType !== 'None');
  }, [slType]);

  // Auto-set Group and Category when Account Type changes
  useEffect(() => {
    const availableGroups = GROUPS[accountType] || [];
    if (selectedAccount && selectedAccount.accountType === accountType) {
      // Keep edit values
    } else {
      if (availableGroups.length > 0) {
        setGroup(availableGroups[0]);
      } else {
        setGroup('');
      }
      const availableSubgroups = CATEGORIES_BY_TYPE[accountType] || [];
      if (availableSubgroups.length > 0) {
        setSubgroup(availableSubgroups[0]);
      } else {
        setSubgroup('');
      }
    }

    // Default balance by type
    if (accountType === 'Asset' || accountType === 'Expense' || accountType === 'Cost of Sales') {
      setBalance('Debit');
    } else {
      setBalance('Credit');
    }
  }, [accountType]);

  // Conduct real-time compliance audits on change
  useEffect(() => {
    const arr: string[] = [];

    // Rule 2: Code must match mask range
    if (code) {
      const start = code.slice(0, 1);
      if (accountType === 'Asset' && start !== '1') {
        arr.push('BR-COA-02: Assets should start with code "1" for accounting consistency.');
      } else if (accountType === 'Liability' && start !== '2') {
        arr.push('BR-COA-02: Liabilities should start with code "2".');
      } else if (accountType === 'Equity' && start !== '3') {
        arr.push('BR-COA-02: Equity accounts should start with code "3".');
      } else if (accountType === 'Revenue' && start !== '4') {
        arr.push('BR-COA-02: Revenue accounts should start with code "4".');
      } else if (accountType === 'Cost of Sales' && start !== '5') {
        arr.push('BR-COA-02: Cost of Sales must start with code "5".');
      } else if (accountType === 'Expense' && start !== '6' && start !== '5') {
        arr.push('BR-COA-02: Expenses should start with code "6" (or "5" for factory overheads).');
      }
    }

    // Rule 4: Parent accounts shouldn't be posting
    if (parentAccount !== 'None') {
      const p = accounts.find(a => a.code === parentAccount);
      if (p && p.postingAllowed) {
        arr.push(`BR-COA-04: Header parent [${parentAccount}] has Posting Enabled. Please turn off Posting Allowed on the parent first.`);
      }
    }

    // Rule 6: Control accounts require SL type
    if (controlAccount && slType === 'None') {
      arr.push('BR-COA-06: Control accounts require specifying a Subsidiary Ledger type.');
    }

    // Rule 7: Receivables AR require customer subledger
    if (code.startsWith('112') && controlAccount && slType !== 'Customer') {
      arr.push('BR-COA-07: Standard Receivables (AR) must map. Set SL Type to Customer instead.');
    }

    // Rule 8: Payables AP require supplier subledger
    if (code.startsWith('210') && controlAccount && slType !== 'Supplier') {
      arr.push('BR-COA-08: Standard Payables (AP) must map. Set SL Type to Supplier instead.');
    }

    // Rule 10: Tax Account and Tax mappings
    if (subgroup === 'VAT Payable' && vatCode === 'Not Applicable') {
      arr.push('BR-COA-10: Tax payable registers require declaring a specific VAT output code.');
    }

    setWarnings(arr);
  }, [code, accountType, parentAccount, controlAccount, slType, subgroup, vatCode, accounts]);

  const resetForm = () => {
    setCode('');
    setName('');
    setParentAccount('None');
    setLevel(1);
    setCompany(COMPANIES[0]);
    setBranch(BRANCHES[0]);
    setAccountType('Asset');
    setGroup(GROUPS.Asset[0]);
    setSubgroup(SUBGROUPS[GROUPS.Asset[0]][0]);
    setIfrsClass(IFRS_CLASSES[0]);
    setFinancialStatementLine(FINANCIAL_STATEMENT_LINES[0]);
    setPostingAllowed(true);
    setIsHeaderAccount(false);
    setControlAccount(false);
    setManualJournalAllowed(true);
    setSystemPostingOnly(false);
    setSlType('None');
    setSlRequired(false);
    setSlMappingCode('');
    setVatCode(VAT_CODES[4]);
    setWhtCode(WHT_CODES[3]);
    setEthiopianTaxCategory(ETHIOPIAN_TAX_CATEGORIES[0]);
    setCurrency('ETB');
    setMultiCurrency(false);
    setRevaluationRequired(false);
    setCostCenter('Optional');
    setDepartment('Optional');
    setProject('Optional');
    setSegment('Mandatory');
    setProfitCenter('Optional');
    setStatus('Draft');
    setApprovalStatus('Not Submitted');
    setBalance('Debit');
    setCreatedBy('mzerihun01@gmail.com');
    setApprovedBy('');
    setAuditTrailNotes('');
    setWarnings([]);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      alert('Validation Failure: Please specify both Account Code and Account Name.');
      return;
    }

    const saved: Account = {
      id: code,
      code,
      name,
      parentAccount,
      level,
      company,
      branch,
      accountType,
      group,
      subgroup,
      ifrsClass,
      financialStatementLine,
      postingAllowed,
      controlAccount,
      manualJournalAllowed,
      systemPostingOnly,
      slType,
      slMappingCode: slType !== 'None' ? `MAP-${slType.toUpperCase()}-${code}` : undefined,
      vatCode,
      whtCode,
      ethiopianTaxCategory,
      costCenter,
      department,
      project,
      segment,
      profitCenter,
      status: selectedAccount ? selectedAccount.status : 'Draft',
      approvalStatus: selectedAccount ? selectedAccount.approvalStatus : 'Not Submitted',
      balance,
      createdBy,
      approvedBy,
      auditTrailNotes: auditTrailNotes || 'Registered or adjusted via dynamic web form.'
    };

    onSave(saved);
  };

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      alert('Validation Failure: Please specify both Account Code and Account Name.');
      return;
    }

    const saved: Account = {
      id: code,
      code,
      name,
      parentAccount,
      level,
      company,
      branch,
      accountType,
      group,
      subgroup,
      ifrsClass,
      financialStatementLine,
      postingAllowed,
      controlAccount,
      manualJournalAllowed,
      systemPostingOnly,
      slType,
      vatCode,
      whtCode,
      ethiopianTaxCategory,
      costCenter,
      department,
      project,
      segment,
      profitCenter,
      status: 'Pending Approval',
      approvalStatus: 'Submitted',
      balance,
      createdBy,
      approvedBy: '',
      auditTrailNotes: auditTrailNotes || 'Direct submission to auditor queue.'
    };

    onSave(saved);
  };

  // List of accounts available as parents (folders)
  const parentOptions = useMemo(() => {
    return accounts.filter(a => !a.postingAllowed);
  }, [accounts]);

  return (
    <form className="space-y-4 max-w-5xl mx-auto pb-12 select-none">
      {/* Title block */}
      <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0051d5] shrink-0 border border-blue-100">
            <PlusCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-[#111827] text-base leading-none flex items-center gap-1.5 matches-title">
              <span>{selectedAccount ? "Account Settings Form" : "Account Registry Form"}</span>
              <BusinessTooltip text="Central utility to define, edit, and configure Chart of Accounts elements. Assigns account categories, IFRS balance sheet lines, tax categories, and active subledger settings." />
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-medium font-sans">
              Define IFRS-aligned ledger accounts with local Ethiopian tax parameters, active posting policies, and controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setStep(1);
            }}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.8 rounded-lg font-bold font-sans flex items-center gap-1 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Form
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.8 rounded-lg font-bold font-sans transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Compliance Warnings Banner */}
      {warnings.length > 0 && (
        <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 flex gap-2 text-amber-850 shadow-3xs max-w-full">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-[11px] font-medium space-y-1">
            <p className="font-bold underline">Real-Time Validation Warnings Found ({warnings.length}):</p>
            <ul className="list-disc pl-3.5 space-y-0.5">
              {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Easy Step Follow Up: Multi-Step Navigation Header */}
      <div className="bg-slate-900 text-white rounded-xl p-2.5 flex items-center justify-between shadow-xs select-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full text-center">
          {[
            { s: 1, name: '1. Account Identity' },
            { s: 2, name: '2. Posting & Subledger Control' },
            { s: 3, name: '3. Tax, Currency & Reporting Dimensions' },
            { s: 4, name: '4. Review, Workflow & Audit' }
          ].map((item) => {
            const isActive = step === item.s;
            const isCompleted = step > item.s;
            return (
              <button
                key={item.s}
                type="button"
                onClick={() => {
                  if (item.s > 1 && (!code || !name)) {
                    alert('Please enter both Account Code and Account Name before changing steps.');
                    return;
                  }
                  setStep(item.s);
                }}
                className={`py-2 px-1.5 rounded-lg transition-all text-[11px] font-black cursor-pointer flex items-center justify-center gap-1.5 ${
                  isActive 
                    ? 'bg-blue-600 text-white border border-blue-500 shadow-sm' 
                    : isCompleted 
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                      : 'bg-transparent text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${
                  isActive ? 'bg-white text-blue-600 font-bold' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? '✓' : item.s}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Layout containers */}
      <div className="space-y-4">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: Company & Account Identity */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Company, Account Identity & IFRS Classification</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Company / Legal Entity</label>
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-850 font-semibold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {COMPANIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Branch / Operating Location</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-850 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {BRANCHES.map((b, i) => <option key={i} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 font-sans">Account Code *</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9-]/g, ''))}
                      disabled={!!selectedAccount}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-mono font-black text-blue-600 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Example: 1110, 2110, 4110"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 font-sans">Account Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-bold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none font-sans"
                      placeholder="Example: Cash on Hand, Trade Payables, Sales Revenue"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Parent Account</label>
                    <select
                      value={parentAccount}
                      onChange={(e) => setParentAccount(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-705 font-semibold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="None">None — Top-Level Account</option>
                      {parentOptions.map((po, i) => (
                        <option key={i} value={po.code}>[{po.code}] {po.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Account Hierarchy Level</label>
                    <input
                      type="text"
                      value={level === 1 ? 'Level 1 — Main Account Class' : `Level ${level} — Sub-Account`}
                      disabled
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-100 text-slate-550 font-bold font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Account Classification */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Grid3X3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Accounting Classification</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-850 mb-1 font-sans">Account Type</label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as AccountType)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-indigo-700 font-extrabold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {ACCOUNT_TYPES.map((t, i) => (
                        <option key={i} value={t}>
                          {getAccountTypeLabel(t)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Normal Balance</label>
                    <select
                      value={balance}
                      onChange={(e) => setBalance(e.target.value as BalanceType)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-semibold text-slate-750 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="Debit">Debit Normal Balance</option>
                      <option value="Credit">Credit Normal Balance</option>
                      <option value="Debit or Credit">Debit or Credit (clearing)</option>
                      <option value="None">None (statistical)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Financial Statement Section</label>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {(GROUPS[accountType] || []).map((g, i) => <option key={i} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Account Category</label>
                    <select
                      value={subgroup}
                      onChange={(e) => setSubgroup(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {(CATEGORIES_BY_TYPE[accountType] || []).map((sg, i) => <option key={i} value={sg}>{sg}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block font-bold text-slate-500 mb-1 font-sans">IFRS Standard Reference</label>
                   <select
                     value={ifrsClass}
                     onChange={(e) => setIfrsClass(e.target.value)}
                     className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                   >
                     {IFRS_CLASSES.map((ic, i) => <option key={i} value={ic}>{ic}</option>)}
                   </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 3: Posting Control Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Posting Control Matrix</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 bg-slate-55 p-2.5 rounded-xl border border-slate-200/80">
                    <input
                      type="checkbox"
                      id="chk-folder"
                      checked={isHeaderAccount}
                      onChange={(e) => setIsHeaderAccount(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="chk-folder" className="cursor-pointer select-none">
                      <span className="font-extrabold block text-slate-800">Summary Folder Node (No Direct Postings)</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block leading-tight">
                        Defines a summary parent account. Direct postings are blocked; balances represent the aggregated rollup of child accounts.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-55 p-2.5 rounded-xl border border-slate-200/80">
                    <input
                      type="checkbox"
                      id="chk-control"
                      checked={controlAccount}
                      onChange={(e) => setControlAccount(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="chk-control" className="cursor-pointer select-none">
                      <span className="font-extrabold block text-slate-800">Reconciliation Control Account</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block leading-tight">
                        Designates this as a subledger control point (e.g., Accounts Receivable or Accounts Payable) to enforce subledger-to-GL reconciliation integrity.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-slate-700 font-medium">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="font-sans text-slate-500">Direct posting status:</span>
                    <span className={`font-sans text-xs font-bold ${postingAllowed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {postingAllowed ? 'Allowed (Transaction Account)' : 'Blocked (Summary Folder)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="font-sans text-slate-500">Allow manual journal entries</span>
                    <input
                      type="checkbox"
                      checked={manualJournalAllowed}
                      disabled={isHeaderAccount}
                      onChange={(e) => setManualJournalAllowed(e.target.checked)}
                      className="h-4.5 w-4.5 rounded text-blue-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-sans text-slate-500">System automated postings only</span>
                    <input
                      type="checkbox"
                      checked={systemPostingOnly}
                      onChange={(e) => setSystemPostingOnly(e.target.checked)}
                      className="h-4.5 w-4.5 rounded text-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: Subsidiary Ledger Mapping */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Coins className="w-3.5 h-3.5 text-blue-600" />
                <span>Subledger & Reconciliation Controls</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">Subsidiary ledger type *</label>
                  <select
                    value={slType}
                    onChange={(e) => setSlType(e.target.value as SLType)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 outline-none font-bold text-indigo-700 cursor-pointer font-sans truncate pr-8"
                  >
                    <option value="None">None (Direct General Ledger Bookings)</option>
                    <option value="Customer">Customer Ledger (Accounts Receivable)</option>
                    <option value="Supplier">Supplier Ledger (Accounts Payable)</option>
                    <option value="Bank">Bank Account</option>
                    <option value="Cash">Cash Register</option>
                    <option value="Inventory">Inventory (Goods Materials Stock)</option>
                    <option value="Fixed Asset">Fixed Asset (Buildings / Plant Assets)</option>
                    <option value="Tax Authority">Tax Authority (ERCA compliance pools)</option>
                    <option value="Employee">Employee Register</option>
                  </select>
                </div>

                {slRequired ? (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-150 text-blue-900 space-y-2 mt-2 leading-relaxed font-sans">
                    <span className="font-black text-[10px] uppercase text-blue-800 tracking-wider font-sans block">Subledger control mapping active</span>
                    <p className="text-[10px] font-medium text-slate-600">
                      Voucher transactions will require matching subledger postings. Transactions will be validated against this interface key.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-blue-200 flex justify-between items-center mt-1">
                      <span className="font-sans text-[9px] font-bold text-slate-400">Reconciliation key:</span>
                      <code className="text-[11px] font-mono font-black text-blue-700 bg-blue-50/40 px-1.5 py-0.5 rounded border border-blue-100">
                        {`MAP-${slType.toUpperCase()}-${code || 'XXXX'}`}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 text-center text-[10px] text-slate-450 font-medium italic mt-2 font-sans">
                    Defaulting to simple direct general ledger bookings block. No nested side-ledger mapped.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 5: Tax Mapping & Currency */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Coins className="w-3.5 h-3.5 text-blue-600" />
                <span>Taxation & Currency Controls</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">VAT rate *</label>
                    <select
                      value={vatCode}
                      onChange={(e) => setVatCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {VAT_CODES.map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Withholding tax (WHT) rate</label>
                    <select
                      value={whtCode}
                      onChange={(e) => setWhtCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {WHT_CODES.map((w, i) => <option key={i} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Ethiopian taxpayer category *</label>
                    <select
                      value={ethiopianTaxCategory}
                      onChange={(e) => setEthiopianTaxCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      {ETHIOPIAN_TAX_CATEGORIES.map((et, i) => <option key={i} value={et}>{et}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Base currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-black text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-multicurrency"
                      checked={multiCurrency}
                      onChange={(e) => setMultiCurrency(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600 cursor-pointer text-xs"
                    />
                    <label htmlFor="chk-multicurrency" className="font-bold text-slate-700 cursor-pointer select-none font-sans text-xs">Enable multi-currency transactions</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-reval"
                      checked={revaluationRequired}
                      onChange={(e) => setRevaluationRequired(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600 cursor-pointer text-xs"
                    />
                    <label htmlFor="chk-reval" className="font-bold text-slate-700 cursor-pointer select-none font-sans text-xs">Revaluation required (IAS 21)</label>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 6: Reporting Dimensions */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Reporting Dimensions Setup</span>
              </h4>
              <div className="space-y-3 text-xs text-slate-700 font-medium font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Cost center segment</label>
                    <select
                      value={costCenter}
                      onChange={(e) => setCostCenter(e.target.value as DimensionControl)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Optional">Optional</option>
                      <option value="Mandatory">Mandatory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Project segment</label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value as DimensionControl)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Optional">Optional</option>
                      <option value="Mandatory">Mandatory</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Department segment</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as DimensionControl)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Optional">Optional</option>
                      <option value="Mandatory">Mandatory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Geographical region segment (IAS 14)</label>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value as DimensionControl)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 font-bold text-slate-850 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Optional">Optional</option>
                      <option value="Mandatory">Mandatory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans text-xs">Profit center segment</label>
                  <select
                    value={profitCenter}
                    onChange={(e) => setProfitCenter(e.target.value as DimensionControl)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                  >
                    <option value="Not Required">Not Required</option>
                    <option value="Optional">Optional</option>
                    <option value="Mandatory">Mandatory</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {/* Dynamic Combined summary review panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3 select-none">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Account Specification Review</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-tight">
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] font-bold block mb-1 font-sans">Account code and name:</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px] block truncate">[{code}] {name}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] font-bold block mb-1 font-sans">Hierarchy level and type:</span>
                  <span className="font-bold text-slate-800 block font-sans">L{level} — {getAccountTypeLabel(accountType)} Group ({balance})</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] font-bold block mb-1 font-sans">Subledger control mapping:</span>
                  <span className="font-bold text-indigo-650 font-mono block uppercase text-[10px]">{slType === 'None' ? 'None (Direct Booking)' : `${slType} Linked`}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] font-bold block mb-1 font-sans">Taxation controls mapping:</span>
                  <span className="font-mono font-bold text-slate-700 block truncate text-[10px]">{ethiopianTaxCategory} ({vatCode})</span>
                </div>
              </div>
            </div>

            {/* CARD 7: Workflow & Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-4">
              <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Workflow className="w-3.5 h-3.5 text-blue-600" />
                <span>Workflow & Audit Settings</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">System posting status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AccountStatus)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-850 font-bold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Active">Active / Approved</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">Workflow approval stage</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus)}
                    className="w-full border border-slate-200 p-2.5 rounded-lg bg-white text-slate-850 font-bold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer font-sans truncate pr-8"
                  >
                    <option value="Not Submitted">Not Submitted</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Returned">Returned / Needs Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">Created by user</label>
                  <input
                    type="text"
                    value={createdBy}
                    disabled
                    className="w-full border border-slate-200 p-2.5 bg-slate-100 rounded-lg text-slate-500 font-mono font-bold"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-850 mb-1 font-sans">Internal audit explanation notes *</label>
                  <textarea
                    value={auditTrailNotes}
                    onChange={(e) => setAuditTrailNotes(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 text-xs font-sans font-medium"
                    placeholder="Enter the professional business rationale justifying this account's mapping and IFRS conformance."
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Navigation Bar & Actions Block (Inline - No Floating Fixed Space Overlap) */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        {/* Helper layout indicators */}
        <div className="text-[11px] font-bold text-slate-550 font-mono">
          {warnings.length > 0 ? (
            <span className="text-amber-600 block animate-pulse">⚠️ {warnings.length} compliance checklist alerts outstanding</span>
          ) : (
            <span className="text-emerald-600 font-sans">✔ Validation checks conform perfectly</span>
          )}
        </div>

        {/* Dynamic Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 font-sans font-bold text-xs text-slate-700 rounded-lg transition-all cursor-pointer shadow-3xs"
            >
              ⭠ Previous Step
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                // Verify core identity inputs before step change
                if (step === 1) {
                  if (!code) {
                    alert('Validation error: Account Code is required to progress.');
                    return;
                  }
                  if (!name) {
                    alert('Validation error: Account Name is required to progress.');
                    return;
                  }
                }
                setStep(prev => prev + 1);
              }}
              className="px-5 py-2 bg-slate-900 border border-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-lg hover:bg-slate-850 transition-all cursor-pointer shadow-xs"
            >
              Proceed to Step {step + 1} ➔
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="border border-[#0051d5] text-[#0051d5] hover:bg-[#0051d5]/5 px-4 py-2 rounded-lg text-xs font-sans font-black flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Save Draft Account</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitForReview}
                className="bg-[#0051d5] text-white hover:bg-[#0042b4] px-5 py-2 rounded-lg text-xs font-sans font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Submit for Review</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

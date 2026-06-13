import React, { useState, useMemo } from 'react';
import { Account, AuditLogEntry, PostedTransaction } from '../types';
import BusinessTooltip from './BusinessTooltip';
import { 
  Printer, 
  Download, 
  BookOpen, 
  Search, 
  CheckCircle, 
  SlidersHorizontal, 
  ArrowDownUp, 
  PlusCircle, 
  Trash2, 
  AlertTriangle,
  Layers,
  Database,
  Tag,
  Coins,
  History,
  Info
} from 'lucide-react';

interface JournalRegisterTabProps {
  accounts: Account[];
  auditLogs: AuditLogEntry[];
  onAddAuditLog?: (log: AuditLogEntry) => void;
  isDeveloperView?: boolean;
  globalTransactions?: PostedTransaction[];
  onAddTransaction?: (txn: PostedTransaction) => void;
}

interface BalancedJournalEntry {
  id: string;
  timestamp: string;
  voucherNo: string;
  debitAccountCode: string;
  debitAccountName: string;
  creditAccountCode: string;
  creditAccountName: string;
  amount: number;
  memo: string;
  postedBy: string;
  status: 'POSTED_BALANCED' | 'PENDING_AUDIT';
  company?: string;
  branch?: string;
  fiscalYear?: string;
  period?: string;
}

// Ledger Line entry interface
interface VoucherLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  taxCode: string;
  costCenter: string;
  department: string;
  project: string;
  description: string;
}

export default function JournalRegisterTab({ 
  accounts, 
  auditLogs,
  onAddAuditLog,
  isDeveloperView = false,
  globalTransactions,
  onAddTransaction
}: JournalRegisterTabProps) {
  const [localSearch, setLocalSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('All');
  const [showWorkdesk, setShowWorkdesk] = useState<boolean>(true);

  // Form Header States
  const [company, setCompany] = useState('QM AMS Ethiopia division');
  const [branch, setBranch] = useState('Addis Ababa Central');
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [period, setPeriod] = useState('Q2-2026');
  const [voucherType, setVoucherType] = useState('JV'); // JV, CP, CR
  const [transactionType, setTransactionType] = useState('Operating Cost Posting');
  const [voucherDate, setVoucherDate] = useState('2026-06-10');
  const [postingDate, setPostingDate] = useState('2026-06-10');
  const [referenceNo, setReferenceNo] = useState('REF-ET-92019');
  const [voucherNotes, setVoucherNotes] = useState('Standard period journal adjustments.');

  // Form Ledger Lines State
  const [lines, setLines] = useState<VoucherLine[]>([
    {
      id: 'LINE-1',
      accountCode: '5110', // Direct Cost of Sales - Raw Materials
      accountName: 'Direct Cost of Sales - Raw Materials',
      debit: 45000,
      credit: 0,
      taxCode: 'VAT-15 (Standard Local Input)',
      costCenter: 'CC-MANUF-01',
      department: 'Factory Operations',
      project: 'PRJ-MAIN-2026',
      description: 'Factory raw steel imports clearing costs'
    },
    {
      id: 'LINE-2',
      accountCode: '1110', // Cash and Bank Equivalents
      accountName: 'Cash and Bank Equivalents',
      debit: 0,
      credit: 45000,
      taxCode: 'Exempt',
      costCenter: 'CC-FIN-HQ',
      department: 'Finance',
      project: 'None',
      description: 'Settlement draft from CBE commercial account'
    }
  ]);

  // Seed baseline posted entries
  const [customPostedEntries, setCustomPostedEntries] = useState<BalancedJournalEntry[]>([]);

  const baseSeededEntries: BalancedJournalEntry[] = useMemo(() => {
    return [
      {
        id: 'JRN-2026-001',
        timestamp: '2026-06-10T10:14:00Z',
        voucherNo: 'REC-ETH-2026-001x',
         debitAccountCode: '1110',
        debitAccountName: 'Cash and Bank Equivalents',
        creditAccountCode: '4000',
        creditAccountName: 'Revenue / Operating Revenue',
        amount: 8540200.50,
        memo: 'Consolidated commercial operating export revenue transfer',
        postedBy: 'mzerihun01@gmail.com',
        status: 'POSTED_BALANCED'
      },
      {
        id: 'JRN-2026-002',
        timestamp: '2026-06-10T11:42:00Z',
        voucherNo: 'V-25-102',
        debitAccountCode: '1120',
        debitAccountName: 'Trade Receivables (Intercompany)',
        creditAccountCode: '1110',
        creditAccountName: 'Cash and Bank Equivalents',
        amount: 320000.00,
        memo: 'Intercompany short-term credit facility clearance',
        postedBy: 'senior_auditor@fincorp.com',
        status: 'POSTED_BALANCED'
      },
      {
        id: 'JRN-2026-003',
        timestamp: '2026-06-10T14:15:20Z',
        voucherNo: 'V-25-302',
        debitAccountCode: '2210',
        debitAccountName: 'VAT Payable (ERCA Input)',
        creditAccountCode: '1110',
        creditAccountName: 'Cash and Bank Equivalents',
        amount: 1673133.24,
        memo: 'Monthly ERCA tax filing return settlement',
        postedBy: 'mzerihun01@gmail.com',
        status: 'POSTED_BALANCED'
      },
      {
        id: 'JRN-2026-004',
        timestamp: '2026-06-10T16:05:00Z',
        voucherNo: 'JV-2026-90',
        debitAccountCode: '5110',
        debitAccountName: 'Direct Cost of Sales - Raw Materials',
        creditAccountCode: '2110',
        creditAccountName: 'Trade Payables (Accts Payable)',
        amount: 1450000.50,
        memo: 'Raw materials import consignment clearance matching voucher',
        postedBy: 'mzerihun01@gmail.com',
        status: 'POSTED_BALANCED'
      }
    ];
  }, []);

  // Merge Custom newly posted ones + base seeded entries
  const journalEntries = useMemo(() => {
    if (globalTransactions) {
      return globalTransactions
        .filter(t => t.source === 'JOURNAL')
        .map(t => {
          const debitLine = t.lines.find(l => l.debit > 0);
          const creditLine = t.lines.find(l => l.credit > 0);
          return {
            id: t.id,
            timestamp: new Date(t.date).toISOString(),
            voucherNo: t.voucherNo,
            debitAccountCode: debitLine ? debitLine.accountCode : 'Unknown',
            debitAccountName: debitLine ? debitLine.accountName : 'Debit Account',
            creditAccountCode: creditLine ? creditLine.accountCode : 'Unknown',
            creditAccountName: creditLine ? creditLine.accountName : 'Credit Account',
            amount: debitLine ? debitLine.debit : 0,
            memo: t.description,
            postedBy: t.postedBy,
            status: 'POSTED_BALANCED' as const
          };
        });
    }
    return [...customPostedEntries, ...baseSeededEntries];
  }, [globalTransactions, customPostedEntries, baseSeededEntries]);

  // Filter logs
  const filteredJournals = useMemo(() => {
    return journalEntries.filter(e => {
      const query = localSearch.toLowerCase();
      const matchText = 
        e.voucherNo.toLowerCase().includes(query) ||
        e.memo.toLowerCase().includes(query) ||
        e.debitAccountCode.includes(query) ||
        e.creditAccountCode.includes(query) ||
        e.debitAccountName.toLowerCase().includes(query) ||
        e.creditAccountName.toLowerCase().includes(query);

      if (filterType === 'All') return matchText;
      if (filterType === 'Large') return matchText && e.amount >= 1000000;
      if (filterType === 'Medium') return matchText && e.amount >= 100000 && e.amount < 1000000;
      if (filterType === 'Small') return matchText && e.amount < 100000;
      return matchText;
    });
  }, [journalEntries, localSearch, filterType]);

  // Form Real-time Totals Check
  const formTotals = useMemo(() => {
    let deb = 0;
    let cred = 0;
    lines.forEach(l => {
      deb += Number(l.debit || 0);
      cred += Number(l.credit || 0);
    });

    const difference = Math.abs(deb - cred);
    const taxValue = deb * 0.15; // Estimated hypothetical standard VAT
    const whtValue = deb * 0.02; // Standard Goods WHT deduction
    const netValue = deb - whtValue + taxValue;

    return {
      totalDebit: deb,
      totalCredit: cred,
      difference,
      taxValue,
      whtValue,
      netValue,
      isBalanced: difference < 0.01 && deb > 0
    };
  }, [lines]);

  // Add line to form
  const handleAddLine = () => {
    const freshLine: VoucherLine = {
      id: `LINE-${Date.now()}`,
      accountCode: '',
      accountName: 'Select GL Account Node...',
      debit: 0,
      credit: 0,
      taxCode: 'Exempt',
      costCenter: 'CC-ADMIN-HQ',
      department: 'Corporate Admin',
      project: 'None',
      description: 'Debit/Credit reconciliation line entry'
    };
    setLines([...lines, freshLine]);
  };

  // Remove line
  const handleRemoveLine = (lineId: string) => {
    if (lines.length <= 2) {
      alert('IFRS compliant double-entry transactions must consist of at least 2 distinct accounting lines.');
      return;
    }
    setLines(lines.filter(l => l.id !== lineId));
  };

  // Handle line account selection
  const handleLineAccountChange = (lineId: string, code: string) => {
    const selectedAcc = accounts.find(a => a.code === code);
    setLines(lines.map(l => {
      if (l.id === lineId) {
        return {
          ...l,
          accountCode: code,
          accountName: selectedAcc ? selectedAcc.name : 'Unknown Account'
        };
      }
      return l;
    }));
  };

  const handleLineValueChange = (lineId: string, field: 'debit' | 'credit' | 'description' | 'taxCode' | 'costCenter' | 'project' | 'department', val: any) => {
    setLines(lines.map(l => {
      if (l.id === lineId) {
        // Exclude credit value if debit is keyed, and vice versa, to guarantee standard ledger formatting
        if (field === 'debit' && Number(val) > 0) {
          return { ...l, debit: Number(val), credit: 0 };
        }
        if (field === 'credit' && Number(val) > 0) {
          return { ...l, credit: Number(val), debit: 0 };
        }
        return { ...l, [field]: val };
      }
      return l;
    }));
  };

  // Simulate Post Transaction
  const handlePostTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTotals.isBalanced) {
      alert(`Ledger Out-of-Balance! IFRS system entries must balance perfectly. Debit: ${formTotals.totalDebit} ETB | Credit: ${formTotals.totalCredit} ETB. Discrepancy: ${formTotals.difference} ETB`);
      return;
    }

    // Secondary validations: postingAllowed must be checked on all lines
    const restrictedLinesArr: string[] = [];
    lines.forEach(l => {
      const dbAcc = accounts.find(a => a.code === l.accountCode);
      if (dbAcc && !dbAcc.postingAllowed) {
        restrictedLinesArr.push(l.accountCode);
      }
    });

    if (restrictedLinesArr.length > 0) {
      alert(`Ledger validation error: Accounts [${restrictedLinesArr.join(', ')}] are configured as Parent/Group headers. Direct transaction posting is prohibited (postingAllowed=false). Please select lower child leaves.`);
      return;
    }

    // Extract debit and credit nodes to format standard double entry summary
    const debitLine = lines.find(l => l.debit > 0);
    const creditLine = lines.find(l => l.credit > 0);

    const generatedVoucherID = `VCH-${voucherType}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newJournal: BalancedJournalEntry = {
      id: `JRN-REG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      voucherNo: generatedVoucherID,
      debitAccountCode: debitLine ? debitLine.accountCode : 'Unknown',
      debitAccountName: debitLine ? debitLine.accountName : 'Dynamic Debits',
      creditAccountCode: creditLine ? creditLine.accountCode : 'Unknown',
      creditAccountName: creditLine ? creditLine.accountName : 'Dynamic Credits',
      amount: formTotals.totalDebit,
      memo: `${transactionType} - ${referenceNo}. Memo: ${lines[0]?.description || voucherNotes}`,
      postedBy: 'senior_accountant@abc.et',
      status: 'POSTED_BALANCED',
      company,
      branch,
      fiscalYear,
      period
    };

    // Append to posted
    setCustomPostedEntries([newJournal, ...customPostedEntries]);

    if (onAddTransaction) {
      onAddTransaction({
        id: newJournal.id,
        source: 'JOURNAL',
        voucherNo: generatedVoucherID,
        voucherType: voucherType,
        description: newJournal.memo,
        date: postingDate,
        postedBy: newJournal.postedBy,
        lines: lines.map(l => ({
          accountCode: l.accountCode,
          accountName: l.accountName,
          debit: l.debit,
          credit: l.credit,
          description: l.description,
          costCenter: l.costCenter,
          department: l.department,
          project: l.project
        }))
      });
    }

    // Generate Audit Log
    if (onAddAuditLog) {
      onAddAuditLog({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'senior_accountant@abc.et',
        action: 'POST_JOURNAL_ENTRY',
        entityType: 'Transactional Voucher',
        entityKey: generatedVoucherID,
        description: `Posted balanced IFRS journal entry. Company: ${company}, Branch: ${branch}, Period: ${period}. DR: ${newJournal.debitAccountCode}, CR: ${newJournal.creditAccountCode}. Value: ${formTotals.totalDebit} ETB.`
      });
    }

    alert(`Successfully validated and posted Balanced Journal Voucher! Serial reference ID: ${generatedVoucherID}`);
    
    // Reset form lines
    setLines([
      {
        id: 'LINE-1',
        accountCode: '5110',
        accountName: 'Direct Cost of Sales - Raw Materials',
        debit: 0,
        credit: 0,
        taxCode: 'VAT-15 (Standard Local Input)',
        costCenter: 'CC-MANUF-01',
        department: 'Factory Operations',
        project: 'None',
        description: ''
      },
      {
        id: 'LINE-2',
        accountCode: '1110',
        accountName: 'Cash and Bank Equivalents',
        debit: 0,
        credit: 0,
        taxCode: 'Exempt',
        costCenter: 'CC-FIN-HQ',
        department: 'Finance',
        project: 'None',
        description: ''
      }
    ]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCSVExport = () => {
    const headers = ['Voucher Reference', 'Time', 'Debit Account', 'Credit Account', 'Amt (ETB)', 'Description', 'PostedBy', 'Compliance Status'];
    const rows = filteredJournals.map(e => [
      e.voucherNo,
      e.timestamp,
      `[${e.debitAccountCode}] ${e.debitAccountName}`,
      `[${e.creditAccountCode}] ${e.creditAccountName}`,
      e.amount.toFixed(2),
      e.memo.replace(/,/g, ';'),
      e.postedBy,
      e.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "General_Ledger_Journal_Voucher_Book.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Title block with Workdesk Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-xs gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5 matches-title">
            <Coins className="w-5 h-5 text-indigo-600" />
            <span>General Journal Register</span>
            <BusinessTooltip text="The chronological record of double-entry financial bookings. Consolidates general ledger transfers, debit/credit matching checkpoints, and auditable operational logs." />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard journal voucher booking deck with real-time balance checks, ERCA tax validations, and multi-cost-center segment assignment.
          </p>
        </div>

        <button
          onClick={() => setShowWorkdesk(!showWorkdesk)}
          className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider border cursor-pointer select-none transition-all ${
            showWorkdesk 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          {showWorkdesk ? 'Hide Voucher Entry Console' : 'Open Voucher Entry Console'}
        </button>
      </div>

      {/* 1. Transaction Entry Workdesk Form */}
      {showWorkdesk && (
        <form onSubmit={handlePostTransaction} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden select-none">
          {/* Section banner */}
          <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#94a3b8]">Live Journal Entry Booking desk</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/60 font-sans">
              Balanced Equation Engine: ACTIVE
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Form Header area */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Company Legal Entity</label>
                <select 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs border border-slate-250 rounded p-1.8 font-sans font-semibold outline-none"
                >
                  <option value="QM AMS Global Holding">QM AMS Global Holding</option>
                  <option value="QM AMS Ethiopia division">QM AMS Ethiopia division</option>
                  <option value="QM AMS East Africa Division">QM AMS East Africa Division</option>
                  <option value="QM AMS Manufacturing Plc">QM AMS Manufacturing Plc</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Operating Branch</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs border border-slate-255 rounded p-1.8 font-sans font-semibold outline-none"
                >
                  <option value="Addis Ababa Central">Addis Ababa Central</option>
                  <option value="Dubai Trade Hub">Dubai Trade Hub</option>
                  <option value="Adama Branch">Adama Branch</option>
                  <option value="Bahir Dar Hub">Bahir Dar Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fiscal Year</label>
                <select 
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  className="w-full text-xs border border-[#cbd5e1] rounded p-1.8 font-sans outline-none font-bold"
                >
                  <option value="2025">Year 2025 (EC 2017)</option>
                  <option value="2026">Year 2026 (EC 2018)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Accounting Period</label>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full text-xs border border-[#cbd5e1] rounded p-1.8 font-sans outline-none font-bold"
                >
                  <option value="Q1-2026">Q1 (July - Sept)</option>
                  <option value="Q2-2026">Q2 (Oct - Dec)</option>
                  <option value="Q3-2026">Q3 (Jan - Mar)</option>
                  <option value="Q4-2026">Q4 (Apr - June)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Voucher Series Class</label>
                <select 
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value)}
                  className="w-full text-xs border border-slate-255 rounded p-1.8 font-sans outline-none font-bold text-indigo-700 bg-slate-50"
                >
                  <option value="JV">JV - Journal Voucher</option>
                  <option value="CP">CP - Cash Payment</option>
                  <option value="CR">CR - Cash Receipt</option>
                  <option value="BP">BP - Bank Payment</option>
                  <option value="BR">BR - Bank Receipt</option>
                  <option value="PY">PY - Payroll Voucher</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Posting Category Type</label>
                <input 
                  type="text" 
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded p-2 bg-white"
                  placeholder="e.g. Accruals, Adjustments..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Voucher Date</label>
                <input 
                  type="date" 
                  value={voucherDate}
                  onChange={(e) => setVoucherDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded p-1.8 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">GL Posting Date</label>
                <input 
                  type="date" 
                  value={postingDate}
                  onChange={(e) => setPostingDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded p-1.8 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Generated Serial VCH</label>
                <input 
                  type="text" 
                  value={`AUTO-GEN-${voucherType}`}
                  disabled
                  className="w-full text-xs border border-slate-200 bg-slate-100 rounded p-2 text-slate-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-800 mb-1">External Reference Ref *</label>
                <input 
                  type="text" 
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full text-xs border border-slate-250 hover:border-slate-350 rounded p-2 font-mono font-semibold"
                  placeholder="e.g. L/C / Invoice Ref"
                  required
                />
              </div>
            </div>

            {/* Line Grid Subtable */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/50 p-1">
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-xs text-left border-collapse min-w-[1100px] table-fixed font-sans">
                  <thead>
                    <tr className="bg-slate-800 border-b border-slate-900 text-white font-black uppercase">
                      <th className="w-[50px] px-3 py-2 text-center text-[10px]">#</th>
                      <th className="w-[300px] px-3 py-2 text-[10px]">Select GL Account Leaf Node *</th>
                      <th className="w-[140px] px-3 py-2 text-right text-[10px]">Debit (ETB)</th>
                      <th className="w-[140px] px-3 py-2 text-right text-[10px]">Credit (ETB)</th>
                      <th className="w-[120px] px-3 py-2 text-[10px]">Tax Flag</th>
                      <th className="w-[125px] px-3 py-2 text-[10px]">Cost Center</th>
                      <th className="w-[125px] px-3 py-2 text-[10px]">Project Hub</th>
                      <th className="w-[200px] px-3 py-2 text-[10px]">Description Comment</th>
                      <th className="w-[55px] px-3 py-2 text-center text-[10px]">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 bg-white">
                    {lines.map((line, index) => {
                      return (
                        <tr key={line.id} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-500 text-[11px]">
                            {index + 1}
                          </td>

                          {/* GL Account selection dropdown */}
                          <td className="px-2 py-2">
                            <select
                              value={line.accountCode}
                              onChange={(e) => handleLineAccountChange(line.id, e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 font-mono text-[11px]"
                            >
                              <option value="">-- Choose posting account --</option>
                              {accounts.map(a => (
                                <option key={a.code} value={a.code}>
                                  {a.code} - {a.name} {!a.postingAllowed ? ' (GROUP ACC)' : ''}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-slate-450 truncate font-mono text-slate-400 ml-1.5 block leading-none mt-1">
                              {line.accountName}
                            </span>
                          </td>

                          {/* Debit */}
                          <td className="px-2 py-2">
                            <input 
                              type="number"
                              min={0}
                              value={line.debit || ''}
                              onChange={(e) => handleLineValueChange(line.id, 'debit', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 text-right font-mono font-bold text-slate-900 focus:bg-amber-50/20"
                              placeholder="0.00"
                            />
                          </td>

                          {/* Credit */}
                          <td className="px-2 py-2">
                            <input 
                              type="number"
                              min={0}
                              value={line.credit || ''}
                              onChange={(e) => handleLineValueChange(line.id, 'credit', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 text-right font-mono font-bold text-slate-900 focus:bg-amber-50/20"
                              placeholder="0.00"
                            />
                          </td>

                          {/* Tax Code */}
                          <td className="px-2 py-2">
                            <select
                              value={line.taxCode}
                              onChange={(e) => handleLineValueChange(line.id, 'taxCode', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 text-[10.5px]"
                            >
                              <option value="Exempt">Exempt / Zero</option>
                              <option value="VAT-15 (Standard Local Input)">VAT Input 15%</option>
                              <option value="VAT-15 (Standard Local Output)">VAT Output 15%</option>
                              <option value="WHT-2 (Standard 2%)">WHT 2% Goods</option>
                              <option value="WHT-3 (Standard 3%)">WHT 3% Services</option>
                            </select>
                          </td>

                          {/* Cost Center */}
                          <td className="px-2 py-2">
                            <select
                              value={line.costCenter}
                              onChange={(e) => handleLineValueChange(line.id, 'costCenter', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 text-[10.5px]"
                            >
                              <option value="CC-ADMIN-HQ">CC-ADMIN-HQ</option>
                              <option value="CC-MANUF-01">CC-MANUF-Adama</option>
                              <option value="CC-DIST-01">CC-DIST-AA</option>
                              <option value="None">None</option>
                            </select>
                          </td>

                          {/* Project code */}
                          <td className="px-2 py-2">
                            <input 
                              type="text"
                              value={line.project}
                              onChange={(e) => handleLineValueChange(line.id, 'project', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 font-mono text-[10.5px]"
                              placeholder="e.g. PRJ-X"
                            />
                          </td>

                          {/* Description */}
                          <td className="px-2 py-2">
                            <input 
                              type="text"
                              value={line.description}
                              onChange={(e) => handleLineValueChange(line.id, 'description', e.target.value)}
                              className="w-full border border-slate-200 rounded p-1.5 text-[11px]"
                              placeholder="Voucher text description memo"
                            />
                          </td>

                          {/* Removal btn */}
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(line.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-table actions */}
            <div className="flex justify-between items-center select-none pt-1">
              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-lg border transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-slate-500" />
                <span>Add Double-Entry Matching Row</span>
              </button>

              <p className="text-[10px] text-slate-450 text-slate-400 italic">
                ℹ️ Standard double-entry ledger rule: At least one Debit (DR) and Credit (CR) account row must represent values.
              </p>
            </div>

            {/* Footer Summary Blocks */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row justify-between items-stretch gap-6 select-none">
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-white border border-slate-150 rounded-lg">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest leading-none font-mono">Consolidated Debits</span>
                  <p className="text-sm font-black text-slate-900 mt-2 font-mono">
                    {formTotals.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-slate-500 font-sans">ETB</span>
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-150 rounded-lg">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest leading-none font-mono">Consolidated Credits</span>
                  <p className="text-sm font-black text-slate-900 mt-2 font-mono">
                    {formTotals.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-slate-500 font-sans">ETB</span>
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-150 rounded-lg">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest leading-none font-mono">Voucher out-of-balance</span>
                  <p className={`text-sm font-black mt-2 font-mono ${formTotals.difference > 0.01 ? 'text-rose-650' : 'text-emerald-600'}`}>
                    {formTotals.difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-sans">ETB</span>
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-150 rounded-lg">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest leading-none font-mono">Estimated VAT Link</span>
                  <p className="text-xs font-bold text-slate-400 mt-2 font-mono">
                    VAT(15%): {formTotals.taxValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB
                  </p>
                </div>
              </div>

              {/* Action and compliance check */}
              <div className="w-full md:w-80 flex flex-col justify-between items-stretch p-4 bg-slate-900 text-white rounded-xl border border-slate-950">
                <div className="flex gap-2 items-start leading-tight">
                  {formTotals.isBalanced ? (
                    <CheckCircle className="w-4 h-4 text-emerald-450 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Equation conformance</span>
                    <p className="text-xs font-bold mt-1">
                      {formTotals.isBalanced 
                        ? 'Voucher equation balances perfectly. Ready to finalize.' 
                        : 'Voucher discrepancy detected. Check Dr / Cr alignments.'}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formTotals.isBalanced}
                  className={`w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-center mt-4 transition-all shadow-md select-none ${
                    formTotals.isBalanced 
                      ? 'bg-emerald-550 bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 text-white cursor-pointer' 
                      : 'bg-slate-850 bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Post Voucher (Submit GL)
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 2. Posted General Journal Book */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Posted General Journal Register Book</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Secure audited ledger journal audit trails. Entries mapped inside are fully locked under non-alterable ERP serial rules.
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans select-none self-end shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.8 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs border cursor-pointer border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Ledger Book</span>
            </button>
            
            <button
              onClick={handleCSVExport}
              className="flex items-center gap-1 px-3 py-1.8 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Journal CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between select-none">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.8 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-none text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search by voucher ID, narrative, account code..."
            />
          </div>

          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg bg-white px-2.5 py-1.8 text-slate-700 font-medium outline-none"
            >
              <option value="All">All Transaction Volumes</option>
              <option value="Large">Large-Scale Postings (≥1M ETB)</option>
              <option value="Medium">Mid-tier Postings (100K-1M ETB)</option>
              <option value="Small">Micro-level Postings (&lt;100K ETB)</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-xs text-left border-collapse min-w-[1050px] table-fixed">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-950 text-white select-none">
                <th className="w-[180px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px]">Timestamp / ID</th>
                <th className="w-[140px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px]">Voucher Reference</th>
                <th className="w-[230px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px]">Debit Account Node</th>
                <th className="w-[230px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px]">Credit Account Node</th>
                <th className="w-[140px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px] text-right">Amount Value (ETB)</th>
                <th className="w-[280px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px]">Narrative Description / Reference Ledger</th>
                <th className="w-[120px] px-4 py-3.5 font-black uppercase tracking-wider text-[10.5px] text-center">Audited Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-700 bg-white">
              {filteredJournals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-sm font-semibold italic bg-slate-50/50">
                    No General Journal entries posted or found.
                  </td>
                </tr>
              ) : (
                filteredJournals.map((entry) => {
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800 font-mono">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="text-[9.5px] text-indigo-600 font-extrabold uppercase mt-0.5 tracking-wider font-mono">
                          {entry.id}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono font-black text-indigo-700 select-all">
                        {entry.voucherNo}
                      </td>

                      <td className="px-4 py-3.5 bg-slate-50/20">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 py-0.2 rounded font-mono shrink-0">
                            DR
                          </span>
                          <span className="font-extrabold text-slate-900 font-mono text-[11.5px] shrink-0">
                            {entry.debitAccountCode} 
                          </span>
                          <span className="truncate text-slate-600 font-medium text-[11px]" title={entry.debitAccountName}>
                            - {entry.debitAccountName}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 bg-slate-50/20">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black bg-rose-50 text-rose-800 border border-rose-100 px-1 py-0.2 rounded font-mono shrink-0">
                            CR
                          </span>
                          <span className="font-extrabold text-slate-900 font-mono text-[11.5px] shrink-0">
                            {entry.creditAccountCode}
                          </span>
                          <span className="truncate text-slate-600 font-medium text-[11px]" title={entry.creditAccountName}>
                            - {entry.creditAccountName}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-black text-slate-950 text-xs bg-slate-50/30">
                        {entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3.5 font-sans font-medium text-slate-500 truncate" title={entry.memo}>
                        {entry.memo}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-[9px] px-2 py-0.6 rounded-md uppercase tracking-widest pointer-events-none">
                          Balanced
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Tab Specs (SQL / JSON payloads) */}
      {isDeveloperView && (
        <div className="bg-slate-900 border border-slate-950 p-5 rounded-2xl font-mono text-[11px] text-slate-300 space-y-3 shadow-lg select-all">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 select-none">
            <span className="text-cyan-400 font-black uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Database Table Schema: journal_voucher_batches & ledger_lines</span>
            </span>
            <span className="text-[10px] text-slate-500">IFRS Category: DOUBLE-ENTRY GENERAL LEDGER (GL)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed text-left">
            <div>
              <p className="text-slate-500 font-bold mb-1">// DDL Declarations</p>
              <pre className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-cyan-350">
{`CREATE TABLE journal_voucher_batches (
  batch_id VARCHAR(40) PRIMARY KEY,
  company_name VARCHAR(150),
  branch_name VARCHAR(100),
  fiscal_year INT,
  period_key VARCHAR(15),
  voucher_class VARCHAR(10),
  reference_no VARCHAR(100) NOT NULL,
  total_debit NUMERIC(19,4) NOT NULL,
  posted_by VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_entry_lines (
  line_id VARCHAR(40) PRIMARY KEY,
  batch_id VARCHAR(40) REFERENCES journal_voucher_batches(batch_id),
  gl_account_code VARCHAR(20) REFERENCES chart_of_accounts(code),
  debit_amount NUMERIC(19,4) CHECK (debit_amount >= 0),
  credit_amount NUMERIC(19,4) CHECK (credit_amount >= 0),
  cost_center_code VARCHAR(30),
  project_hub VARCHAR(40),
  line_description TEXT
);`}
              </pre>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-1">// Active API REST Spec Contract Payload</p>
              <pre className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-emerald-300">
{`// POST /api/v1/ledger/transactions/voucher
{
  "header": {
    "company": "${company}",
    "branch": "${branch}",
    "fiscalYear": "${fiscalYear}",
    "period": "${period}",
    "voucherType": "${voucherType}",
    "referenceNo": "${referenceNo}",
    "voucherNotes": "${voucherNotes}"
  },
  "lines": ${JSON.stringify(lines, null, 2)}
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

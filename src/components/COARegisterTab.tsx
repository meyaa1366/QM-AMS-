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
  Columns, 
  Grid,
  Settings,
  HelpCircle,
  Coins,
  Activity,
  BookOpen,
  Scale,
  GitFork,
  Boxes,
  Briefcase,
  AlertTriangle,
  Upload,
  Download
} from 'lucide-react';
import { Account, AccountType, AccountStatus, ApprovalStatus, SLType } from '../types';
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
  onBulkImport?: (importedAccounts: Account[]) => void;
}

// Phase 5 - Subledger Mapping Specifications Data
interface SubledgerSpec {
  module: string;
  controlAccountCode: string;
  controlAccountName: string;
  postingRules: string;
  autoJournalRules: string;
  recoRules: string;
  errorRules: string;
}

const SUBLEDGER_MODULES_SPECS: SubledgerSpec[] = [
  {
    module: 'Accounts Receivable',
    controlAccountCode: '1120',
    controlAccountName: 'Trade Accounts Receivable',
    postingRules: 'Strict subledger ledger rules restrict postings solely to validated Customer Invoice (ARI) and Customer Receipt Vouchers (ARRV). Central GL override postings are rejected.',
    autoJournalRules: 'Confirmation of AR subledger sales ledger generates automated double entries in ERP journals: Debit Trade AR Control (1120) / Credit Operating Revenue (4100).',
    recoRules: 'Daily automated reconciliation sweeps balance active customer subledger balances against control account 1120 balance. Tolerance rule holds zero-difference limit.',
    errorRules: 'Suspense mitigation routing splits out-of-balance entries immediately. Direct auto-alert of transaction ID to clearing operations desk and quarantine of voucher.'
  },
  {
    module: 'Accounts Payable',
    controlAccountCode: '2100',
    controlAccountName: 'Trade Accounts Payable',
    postingRules: 'Postings permitted solely via verified Supplier Invoice (API) vouchers and Cash/Bank payments. Standard 2% withholding tax applies automatically on services >= ETB 10,000.',
    autoJournalRules: 'On supplier voucher execution, trigger automated credit to AP Control (2100), debit to inventory or administrative expense, and write withholding liabilities.',
    recoRules: 'Reconciliation process validates and flags vendor sub-totals against master supplier statements on weekly runs. Exception report automatically compiled.',
    errorRules: 'Price/quantity mismatches exceeding 2% trigger automated voucher lock. Escalates invoice status to supervisor approval queue and routes variance to audit queue.'
  },
  {
    module: 'Payroll',
    controlAccountCode: '2145',
    controlAccountName: 'Staff Payroll Liabilities',
    postingRules: 'Postings reserved to confirmed monthly HR payroll registers and pension/withholding deductions. Manual entries on ledger 2145 trigger critical alert.',
    autoJournalRules: 'HR payroll clearance triggers automated direct posting: Debit Salaries Expense (6010) / Credit WHT Employee Deductions (2210) & Pension liabilities & AP payroll.',
    recoRules: 'Automated bank clearing matching verifies net salary escrow totals match direct bank salary deposit records. Absolute zero-tolerance matching rule applies.',
    errorRules: 'If federal tax percentages or pension formulas exceed regulatory limit (e.g. employee pensions > 7% base), payrun is frozen and status reports generate.'
  },
  {
    module: 'Inventory',
    controlAccountCode: '1300',
    controlAccountName: 'Material/Inventory Control',
    postingRules: 'Inventory accounts operate solely via automated Warehouse Receipt Vouchers (GRN), delivery notes, and COGS calculations. Real-time cost averaging updates apply.',
    autoJournalRules: 'On warehouse intake, system writes: Debit Material Inventory Control (1300) / Credit Accrued Liabilities. On sales matching: Debit COGS (5100) / Credit Inventory (1300).',
    recoRules: 'Periodic cycle counts or physical inventories automatically post adjustments. Reconciles theoretical system storage index values to actual physical index.',
    errorRules: 'Negative inventory balance logic blocks ledger operations. Automatically triggers purchase order review and sends urgent stock level warnings to materials planner.'
  },
  {
    module: 'Fixed Assets',
    controlAccountCode: '1500',
    controlAccountName: 'Capitalized Equipment & Plant',
    postingRules: 'Asset ledger values correspond to automated capital acquisition vouchers. Monthly depreciation runs utilize straight-line IAS-16 compliance calculations.',
    autoJournalRules: 'Monthly depreciation batch run generates: Debit Accumulated Depreciation (1510) and Credit Depreciation Expenses (6250) across asset branches.',
    recoRules: 'Annual barcoded visual asset register tracking and system reconcile. Compares structural physical registry tags directly with asset balance sheets.',
    errorRules: 'Dual-disposal flags lock relevant entries. Duplicate writes or negative residual valuations trigger immediate freeze, routing assets to board assessment.'
  },
  {
    module: 'Treasury',
    controlAccountCode: '1110',
    controlAccountName: 'Cash and Bank Assets',
    postingRules: 'All bank ledgers enforce voucher validation matching (CPV, CRV, BPV, BRV, BTV). Exchange rate revaluation runs utilize official CBE daily base exchange rates.',
    autoJournalRules: 'Electronic funds transfer automatically generates journal vouchers posting exchange rate variances directly to gain/loss on foreign exchange accounts.',
    recoRules: 'Daily MT940 bank file imports trigger automated transaction matching against ledger bank records; unmatched cash is posted to unallocated clearing.',
    errorRules: 'Discrepancies exceeding margin limit of ETB 500 trigger automated supervisor review; physical registers lock until cash count discrepancy is resolved.'
  },
  {
    module: 'Investment Management',
    controlAccountCode: '1600',
    controlAccountName: 'Corporate Securities Portfolio',
    postingRules: 'Securities trading registers post following compliance checks on authorized board capex templates. Mapped directly across fair value classification brackets.',
    autoJournalRules: 'Periodic FVTPL or Amortized Cost calculations write fair-value adjustments to investments: Debit Investment Asset (1600) / Credit Unrealized Gains/Losses.',
    recoRules: 'Investment portfolios are validated against custodian broker transaction records on a weekly automatic API verification check.',
    errorRules: 'Unusual volatility triggers automatic audit status flags. System restricts further acquisitions or settlements on that specific ticker code recursively.'
  },
  {
    module: 'Pension Administration',
    controlAccountCode: '2147',
    controlAccountName: 'Regulatory Pension Escrows',
    postingRules: 'Strict employer (11%) and employee (7%) calculations aligned to official Ethiopian pension proclamation directives. External modifications are disabled.',
    autoJournalRules: 'Monthly payroll postings generate automatic liabilities: Credit Pension Escrows (2147) / Debit Salaries overhead and employee gross salaries accounts.',
    recoRules: 'Monthly balance matching verifies that pension subledger payroll accruals match the official electronic ERCA declaration submission receipt.',
    errorRules: 'Calculation disparities or delinquent pension clearance schedules block standard company tax files; late payments calculate a 2% monthly penalty.'
  },
  {
    module: 'Revenue Management',
    controlAccountCode: '4100',
    controlAccountName: 'Trade Sales Revenue Control',
    postingRules: 'Revenue recognition strictly aligns to IFRS 15 five-step standard. Revenue ledger updates trigger automatically on invoice validation or deposit conversion.',
    autoJournalRules: 'Invoice clearing generates: Credit Revenue Control (4100) and Debit Customer AR Control / Bank, while logging standard VAT output (15%) liabilities.',
    recoRules: 'Daily sales audit matches invoice registers, physical point of sale receipts, and credit card/telebirr settlement slips. Discrepancy report aggregates nightly.',
    errorRules: 'Unallocated payments are held in customer advances (2120) and are barred from revenue realization until specific shipping vouchers are verified in system.'
  }
];

export default function COARegisterTab({
  accounts,
  onEditAccount,
  onSubmitAccount,
  onApproveAccount,
  onRejectAccount,
  onUpdateStatus,
  onViewAuditTrail,
  searchQuery: initialSearchQuery,
  onBulkImport
}: COARegisterTabProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewDetailAccount, setViewDetailAccount] = useState<Account | null>(null);

  // Peachtree Trial Balance & Bulk Import State
  const [dragActive, setDragActive] = useState(false);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  const { totalDr, totalCr, diffVal, outOfBalance } = useMemo(() => {
    let tDr = 0;
    let tCr = 0;
    accounts.forEach(acc => {
      tDr += acc.openingBalanceDebit || 0;
      tCr += acc.openingBalanceCredit || 0;
    });
    const dVal = Math.abs(tDr - tCr);
    const oob = dVal > 0.01;
    return { totalDr: tDr, totalCr: tCr, diffVal: dVal, outOfBalance: oob };
  }, [accounts]);

  // Safe CSV split logic
  const parseCSVLines = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell.trim());
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
    if (cell || row.length > 0) {
      row.push(cell.trim());
      lines.push(row);
    }
    return lines;
  };

  const handleCreateBulkAccountsFromCSV = (csvText: string) => {
    try {
      const parsed = parseCSVLines(csvText);
      if (parsed.length <= 1) {
        setImportFeedback('Error: The uploaded CSV file is empty or missing data rows.');
        return;
      }

      const headers = parsed[0].map(h => h.toLowerCase().replace(/["'\s-_]/g, ''));
      const codeIdx = headers.findIndex(h => h.includes('code') || h.includes('id') || h.includes('accountid'));
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('desc') || h.includes('description'));
      const typeIdx = headers.findIndex(h => h.includes('type'));
      const parentIdx = headers.findIndex(h => h.includes('parent'));
      const subledgerIdx = headers.findIndex(h => h.includes('subledger') || h.includes('mapping'));
      const drIdx = headers.findIndex(h => h.includes('debit') || h.includes('dr') || h.includes('openingdebit'));
      const crIdx = headers.findIndex(h => h.includes('credit') || h.includes('cr') || h.includes('openingcredit'));
      const noteIdx = headers.findIndex(h => h.includes('audit') || h.includes('note') || h.includes('explanation'));

      if (codeIdx === -1 || nameIdx === -1) {
        setImportFeedback('Error: Could not locate required columns ("Account ID/Code" and "Account Name/Description") in the CSV headers.');
        return;
      }

      const newAccounts: Account[] = [];
      const dataRows = parsed.slice(1);

      dataRows.forEach((row) => {
        if (row.length < 2) return;
        const codeVal = row[codeIdx]?.trim();
        const nameVal = row[nameIdx]?.trim();
        if (!codeVal || !nameVal) return;

        const rawType = row[typeIdx]?.trim() || '';
        let matchedType: AccountType = 'Asset';
        if (/expense/i.test(rawType)) matchedType = 'Expense';
        else if (/liab/i.test(rawType)) matchedType = 'Liability';
        else if (/eq/i.test(rawType)) matchedType = 'Equity';
        else if (/rev/i.test(rawType) || /sales/i.test(rawType)) matchedType = 'Revenue';
        else if (/cost/i.test(rawType)) matchedType = 'Cost';

        const parentVal = (parentIdx !== -1 && row[parentIdx]) ? row[parentIdx].trim() : 'None';
        const subledgerVal = (subledgerIdx !== -1 && row[subledgerIdx]) ? row[subledgerIdx].trim() : 'None';
        const debitVal = (drIdx !== -1 && row[drIdx]) ? parseFloat(row[drIdx].replace(/[^\d.]/g, '')) || 0 : 0;
        const creditVal = (crIdx !== -1 && row[crIdx]) ? parseFloat(row[crIdx].replace(/[^\d.]/g, '')) || 0 : 0;
        const notesVal = (noteIdx !== -1 && row[noteIdx]) ? row[noteIdx].trim() : 'Bulk uploaded via Peachtree accounting model.';

        newAccounts.push({
          id: codeVal,
          code: codeVal,
          name: nameVal,
          parentAccount: parentVal,
          level: parentVal === 'None' ? 1 : 2,
          company: 'QM Ethiopian Logistics Hub',
          branch: 'Addis Ababa Central Branch',
          accountType: matchedType,
          group: matchedType === 'Asset' ? 'Current Assets' : matchedType === 'Liability' ? 'Current Liabilities' : matchedType === 'Equity' ? 'Corporate Equity' : 'Operating Expenses',
          subgroup: 'General Ledger Operations',
          ifrsClass: matchedType === 'Asset' ? 'Cash & Bank Balances' : 'Operating Expenses',
          financialStatementLine: matchedType === 'Asset' ? 'Notes receivable' : 'Operating expenses',
          postingAllowed: true,
          controlAccount: false,
          manualJournalAllowed: true,
          systemPostingOnly: false,
          slType: subledgerVal as SLType,
          vatCode: 'VAT-EXEMPT',
          whtCode: 'WHT-N/A',
          ethiopianTaxCategory: 'VAT Exempt Services',
          costCenter: 'Not Required',
          department: 'Not Required',
          project: 'Not Required',
          segment: 'Not Required',
          profitCenter: 'Not Required',
          status: 'Active',
          approvalStatus: 'Approved',
          balance: debitVal >= creditVal ? 'Debit' : 'Credit',
          openingBalanceDebit: debitVal,
          openingBalanceCredit: creditVal,
          createdBy: 'mzerihun01@gmail.com',
          auditTrailNotes: notesVal
        });
      });

      if (newAccounts.length === 0) {
        setImportFeedback('Error: Loaded CSV did not parse to any correct ledger accounts.');
        return;
      }

      if (onBulkImport) {
        onBulkImport(newAccounts);
        setImportFeedback(`Success: Successfully uploaded and integrated ${newAccounts.length} accounts!`);
        setTimeout(() => setImportFeedback(null), 8000);
      } else {
        setImportFeedback('Error: Bulk import is currently disabled by application container.');
      }
    } catch (e: any) {
      setImportFeedback(`Error during parser execution: ${e.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) handleCreateBulkAccountsFromCSV(text);
    };
    reader.readAsText(file);
  };

  const handleExportCOATemplate = () => {
    const headers = [
      'Account ID',
      'Account Description',
      'Account Type',
      'Active Status',
      'Parent Account ID',
      'Subsidiary Ledger Mapping',
      'Opening Debit Balance',
      'Opening Credit Balance',
      'Audit Explanation Note'
    ];
    
    const sampleRows = [
      ['1111', 'Main Vault Float', 'Asset', 'Active', 'None', 'Cash', '150000.00', '0.00', 'Initial physical cash vault opening balance.'],
      ['1120', 'Trade Accounts Receivable', 'Asset', 'Active', 'None', 'Customer', '45000.00', '0.00', 'Previously created customer accounts outstanding.'],
      ['2100', 'Trade Accounts Payable', 'Liability', 'Active', 'None', 'Supplier', '0.00', '110000.00', 'Previously created supplier payables.'],
      ['3100', 'Paid-In Share Capital', 'Equity', 'Active', 'None', 'None', '0.00', '85000.00', 'Primary capital investment.'],
      ['6120', 'Locomotive Fuel Dispatch', 'Expense', 'Active', 'None', 'None', '0.00', '0.00', 'Fuel procurement expense accounts.']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Peachtree_Bulk_COA_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrentCOA = () => {
    const headers = [
      'Account ID',
      'Account Description',
      'Account Type',
      'Active Status',
      'Parent Account ID',
      'Subsidiary Ledger Mapping',
      'Opening Debit Balance',
      'Opening Credit Balance',
      'Audit Explanation Note'
    ];
    
    const rows = accounts.map(acc => [
      acc.code,
      acc.name,
      acc.accountType,
      acc.status,
      acc.parentAccount || 'None',
      acc.slType || 'None',
      (acc.openingBalanceDebit || 0).toFixed(2),
      (acc.openingBalanceCredit || 0).toFixed(2),
      acc.auditTrailNotes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Exported_Chart_Of_Accounts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unified Workspace Inner Tab: 'registry' (Phase 3), 'hierarchy' (Phase 4), 'subledger' (Phase 5)
  const [workspaceTab, setWorkspaceTab] = useState<'registry' | 'hierarchy' | 'subledger'>('registry');

  // Interactive configurations inside Registry table layout
  const [viewLayout, setViewLayout] = useState<'tree' | 'table'>('table');
  
  // Expanded Nodes representing collapsible systems
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    '1000': true,
    '1100': true,
    '2000': true,
    '3000': true,
    '4000': true,
    '5000': true,
    '6000': true
  });

  // Collapsible hierarchy group categories (Phase 4)
  const [expandedHierarchy, setExpandedHierarchy] = useState<Record<string, boolean>>({
    'assets': true,
    'assets-current': true,
    'assets-noncurrent': true,
    'liabilities': true,
    'liabilities-current': true,
    'liabilities-noncurrent': true,
    'equity': true,
    'revenue': true,
    'revenue-operating': true,
    'revenue-nonoperating': true,
    'expenses': true,
    'expenses-operating': true,
    'expenses-admin': true,
    'expenses-finance': true,
    'expenses-other': true
  });

  // Selected subledger module under the mapping views (Phase 5)
  const [selectedSubledgerModule, setSelectedSubledgerModule] = useState<string>('Accounts Receivable');

  const toggleNode = (code: string) => {
    setExpandedNodes(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const toggleHierarchy = (key: string) => {
    setExpandedHierarchy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    accounts.forEach(a => { allExpanded[a.code] = true; });
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const query = localSearch || initialSearchQuery;

  // --- STAGE 1: SEQUENCE SORTING ---
  const sequencedAllAccounts = useMemo(() => {
    const roots = accounts.filter(a => !a.parentAccount || a.parentAccount === 'None');
    roots.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

    const result: Account[] = [];

    const traverse = (parentCode: string) => {
      const children = accounts.filter(a => a.parentAccount === parentCode);
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

    const orphans = accounts.filter(a => !result.some(r => r.id === a.id));
    if (orphans.length > 0) {
      orphans.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
      result.push(...orphans);
    }

    return result;
  }, [accounts]);

  // --- STAGE 2: FILTERED ACCOUNTS ---
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

  // Determine if a node is hidden by its parent folding
  const isNodeHiddenByParent = (acc: Account): boolean => {
    if (query) return false;
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

  // Dynamic helper to produce CF mappings or fallback specs to cover Phase 3
  const getAccountSpecs = (acc: Account) => {
    // 24 Attributes Generator corresponding directly to Phase 3 requirements:
    const code = acc.code;
    const name = acc.name;
    const desc = acc.auditTrailNotes || `General ledger control representative of ${acc.name} transactions.`;
    const type = acc.accountType;
    const parent = acc.parentAccount || 'None (Root Node)';
    const lvl = acc.level || 1;
    const ifrs = acc.ifrsClass || 'IAS 1 - Presentation of Financial Statements';
    const fsMap = acc.financialStatementLine || 'Balance Sheet / Income Statement line';
    const balance = acc.balance || 'Debit';
    const currency = acc.company.includes('Global') ? 'USD / ETB (Multi-Currency)' : 'ETB Only';
    const postingAllowed = acc.postingAllowed ? 'Yes' : 'No';
    const manualJournalAllowed = acc.manualJournalAllowed ? 'Yes' : 'No';
    const reconciliationRequired = acc.controlAccount || acc.slType !== 'None' ? 'Yes' : 'No';
    const controlAccountIndicator = acc.controlAccount ? 'Yes' : 'No';
    const subsidiaryLedgerMapping = acc.slType !== 'None' ? `${acc.slType} (Auto-matched)` : 'None';
    const budgetControlIndicator = (acc.costCenter === 'Mandatory' || acc.project === 'Mandatory') ? 'Yes (Strict)' : 'No';
    
    // Derived Cash Flow Category
    let cfCategory = 'Operating Cash Flow';
    if (type === 'Asset' && parseInt(code) >= 1500) {
      cfCategory = 'Investing Cash Flow';
    } else if ((type === 'Liability' && parseInt(code) >= 2500) || type === 'Equity') {
      cfCategory = 'Financing Cash Flow';
    }
    const activeStatus = acc.status;
    const effectiveDate = '2026-01-01';
    const expiryDate = 'Active (No Expiry)';
    const approvalStatus = acc.approvalStatus;
    const createdBy = acc.createdBy || 'system_initiator@ethio.erp';
    const lastModifiedBy = 'controller_desk@ethio.erp';
    const auditTrailRef = `TRAIL-COA-${code}-908`;

    return {
      code, name, desc, type, parent, lvl, ifrs, fsMap, balance, currency,
      postingAllowed, manualJournalAllowed, reconciliationRequired,
      controlAccountIndicator, subsidiaryLedgerMapping, budgetControlIndicator,
      cfCategory, activeStatus, effectiveDate, expiryDate, approvalStatus,
      createdBy, lastModifiedBy, auditTrailRef
    };
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md text-white select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-1.5 matches-title">
              <span>Dynamic Chart of Accounts Workspace</span>
              <BusinessTooltip text="Central control representing Phase 3 (Account Registry), Phase 4 (Hierarchical trees) and Phase 5 (Subledger Mappings) in modern simplified layouts." />
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Redesigned master center with micro-labels and hovering context menus. Quickly toggle registers, collapsible folder structures, and automated posting rules.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-900 px-3 py-1.5 rounded-lg">
            Compliance Version 2.4-CJS
          </span>
        </div>
      </div>

      {/* THREE-PHASE SWITCHER DECK */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setWorkspaceTab('registry')}
          className={`flex-1 sm:flex-initial px-6 py-3 border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-bold ${
            workspaceTab === 'registry' 
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10' 
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Account Registry</span>
        </button>
        <button 
          onClick={() => setWorkspaceTab('hierarchy')}
          className={`flex-1 sm:flex-initial px-6 py-3 border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-bold ${
            workspaceTab === 'hierarchy' 
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10' 
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Account Hierarchy</span>
        </button>
        <button 
          onClick={() => setWorkspaceTab('subledger')}
          className={`flex-1 sm:flex-initial px-6 py-3 border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-bold ${
            workspaceTab === 'subledger' 
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10' 
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Subledger Registry</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 📋 PHASE 3: ACCOUNT REGISTRY WORKSPACE                  */}
      {/* ======================================================== */}
      {workspaceTab === 'registry' && (
        <div className="space-y-6">
          {/* Visual Analytics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Ledger Accounts</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Status</p>
                <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{stats.active}</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Audit Review</p>
                <h3 className="text-xl font-bold text-amber-600 mt-0.5">{stats.pending}</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draft Setup</p>
                <h3 className="text-xl font-bold text-slate-600 mt-0.5">{stats.draft}</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📤 BULK IMPORT & EXPORT OPERATIONS                     */}
          {/* ======================================================== */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Bulk Import & Export Center</span>
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-tight">
                Import multiple General Ledger positions instantly using a structured CSV file, or export the active registry chart of accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCOATemplate}
                className="px-3 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 hover:text-slate-900 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download CSV Template</span>
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload CSV"
                />
                <button
                  type="button"
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Upload COA CSV</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportCurrentCOA}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Export Active Registry Chart</span>
              </button>
            </div>
          </div>

          {importFeedback && (
            <div className={`p-3 rounded-lg text-xs leading-normal font-semibold ${
              importFeedback.startsWith('Success') 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {importFeedback}
            </div>
          )}

          {/* Spreadsheet Filter Control Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input 
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                  placeholder="Search code, name, IFRS class..."
                />
              </div>

              <div className="flex items-center gap-1">
                <Building2 className="w-3 text-slate-400 shrink-0" />
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 font-sans text-slate-700 cursor-pointer"
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
                  className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 font-sans text-slate-700 cursor-pointer"
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
                  className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 font-sans text-slate-700 cursor-pointer"
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
                  className="text-[11px] border border-slate-200 rounded-lg bg-white px-2 py-1.5 font-sans text-slate-700 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending Approval">Pending</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Layout switch for Phase 3 views */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-medium">Layout:</span>
              <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 text-[10px] font-bold">
                <button
                  onClick={() => setViewLayout('table')}
                  className={`px-3 py-1 rounded flex items-center gap-1 cursor-pointer transition-all ${viewLayout === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'}`}
                >
                  <Columns className="w-3 h-3" />
                  <span>Column Grid</span>
                </button>
                <button
                  onClick={() => setViewLayout('tree')}
                  className={`px-3 py-1 rounded flex items-center gap-1 cursor-pointer transition-all ${viewLayout === 'tree' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'}`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Interactive Tree</span>
                </button>
              </div>
            </div>
          </div>

          {/* --- VIEW: COMPACT COLUMN GRID --- */}
          {viewLayout === 'table' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse min-w-[1440px] table-fixed">
                  <thead>
                    <tr className="bg-slate-900 text-white select-none border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider">
                      <th className="w-[100px] px-4 py-3 font-sans">Code</th>
                      <th className="w-[200px] px-4 py-3 font-sans">Account Name</th>
                      <th className="w-[120px] px-4 py-3 font-sans">Type</th>
                      <th className="w-[100px] px-4 py-3 font-sans text-center">Depth</th>
                      <th className="w-[120px] px-4 py-3 font-sans">Parent Code</th>
                      <th className="w-[110px] px-4 py-3 font-sans text-center">Indicators</th>
                      <th className="w-[150px] px-4 py-3 font-sans">IFRS Standard</th>
                      <th className="w-[130px] px-4 py-3 font-sans text-right">Opg Debit</th>
                      <th className="w-[130px] px-4 py-3 font-sans text-right">Opg Credit</th>
                      <th className="w-[110px] px-4 py-3 font-sans text-center">Status</th>
                      <th className="w-[150px] px-4 py-3 font-sans text-center">Approval</th>
                      <th className="w-[160px] px-4 py-3 font-sans text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-sans text-slate-700">
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-400 italic">No ledger accounts match criteria.</td>
                      </tr>
                    ) : (
                      filteredAccounts.map((acc) => {
                        const isSummaryNode = !acc.postingAllowed;
                        const sp = getAccountSpecs(acc);

                        // Master HTML Hover Tooltip showing all 24 attributes cleanly
                        const hoverTitle = `ACCOUNT REGISTRY FILE SPECIFICATIONS:
1. Account Code: ${sp.code}
2. Account Name: ${sp.name}
3. Account Description: ${sp.desc}
4. Account Type: ${sp.type}
5. Parent Account: ${sp.parent}
6. Account Level: ${sp.lvl}
7. IFRS Class: ${sp.ifrs}
8. Fin Statement Map: ${sp.fsMap}
9. Balance Type: ${sp.balance}
10. Currency Scheme: ${sp.currency}
11. Posting Allowed: ${sp.postingAllowed}
12. Manual Journal Allowed: ${sp.manualJournalAllowed}
13. Reconciliation Required: ${sp.reconciliationRequired}
14. Control Account Indicator: ${sp.controlAccountIndicator}
15. Subsidiary Ledger Mapping: ${sp.subsidiaryLedgerMapping}
16. Budget Control Indicator: ${sp.budgetControlIndicator}
17. Cash Flow Category: ${sp.cfCategory}
18. Active Status: ${sp.activeStatus}
19. Effective Date: ${sp.effectiveDate}
20. Expiry Date: ${sp.expiryDate}
21. Approval Status: ${sp.approvalStatus}
22. Created By: ${sp.createdBy}
23. Last Modified By: ${sp.lastModifiedBy}
24. Audit Trail Reference: ${sp.auditTrailRef} (HOVER OVER CELLS FOR DETAILS)`;

                        return (
                          <tr 
                            key={acc.id} 
                            title={hoverTitle}
                            className={`hover:bg-indigo-50/40 transition-colors align-middle cursor-help ${isSummaryNode ? 'bg-slate-50/40 text-slate-500' : ''}`}
                          >
                            <td className="px-4 py-3 font-mono font-bold text-indigo-700 select-all">{acc.code}</td>
                            
                            <td className="px-4 py-3 font-semibold text-slate-900 truncate" title={`Description: ${sp.desc}`}>{acc.name}</td>
                            
                            <td className="px-4 py-3">
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                                acc.accountType === 'Asset' ? 'bg-blue-50/60 text-blue-700 border-blue-200/50' :
                                acc.accountType === 'Liability' ? 'bg-red-50/60 text-red-700 border-red-200/50' :
                                acc.accountType === 'Equity' ? 'bg-indigo-50/60 text-indigo-700 border-indigo-200/50' :
                                acc.accountType === 'Revenue' ? 'bg-emerald-50/60 text-emerald-700 border-emerald-200/50' :
                                acc.accountType === 'Cost of Sales' ? 'bg-amber-50/60 text-amber-700 border-amber-200/50' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {acc.accountType}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center font-mono text-xs">{acc.level}</td>
                            
                            <td className="px-4 py-3 font-mono text-slate-500 text-xs">{acc.parentAccount || 'None'}</td>
                            
                            {/* Shortened concise indicators icons with cell specific hovering titles */}
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center items-center gap-1.5 select-none">
                                <span 
                                  className={`text-[9px] font-bold px-1 rounded cursor-help ${acc.postingAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                                  title={`Posting: ${acc.postingAllowed ? 'Allowed' : 'Blocked'}`}
                                >
                                  P
                                </span>
                                <span 
                                  className={`text-[9px] font-bold px-1 rounded cursor-help ${acc.manualJournalAllowed ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'}`}
                                  title={`Manual Journal: ${acc.manualJournalAllowed ? 'Allowed' : 'System Only'}`}
                                >
                                  M
                                </span>
                                <span 
                                  className={`text-[9px] font-bold px-1 rounded cursor-help ${acc.controlAccount ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'}`}
                                  title={`Control Account: ${acc.controlAccount ? 'Yes (Tied SL)' : 'No (Direct Post)'}`}
                                >
                                  C
                                </span>
                                <span 
                                  className={`text-[9px] font-bold px-1 rounded cursor-help ${acc.slType !== 'None' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}
                                  title={`Subledger Mapped: ${acc.slType}`}
                                >
                                  S
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-slate-500 truncate" title={`${sp.ifrs}\nMapping: ${sp.fsMap}`}>{sp.ifrs.split('-')[0]}</td>
                            
                            <td className="px-4 py-3 text-right font-mono text-[10px] font-bold text-emerald-700">
                              {acc.openingBalanceDebit && acc.openingBalanceDebit > 0 
                                ? `ETB ${acc.openingBalanceDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                                : '—'}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-[10px] font-bold text-amber-600">
                              {acc.openingBalanceCredit && acc.openingBalanceCredit > 0
                                ? `ETB ${acc.openingBalanceCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                : '—'}
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                acc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                acc.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                acc.status === 'Draft' ? 'bg-slate-50 text-slate-600 border border-slate-200' :
                                'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${acc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-450'}`}></span>
                                <span>{acc.status}</span>
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                acc.approvalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                                acc.approvalStatus === 'Submitted' ? 'bg-amber-50 text-amber-750 border-amber-150' :
                                'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                                {acc.approvalStatus === 'Submitted' ? 'AWAITING' : acc.approvalStatus}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center" title="Click buttons to configure/review ledger state">
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setViewDetailAccount(acc); }}
                                  className="p-1 px-1.5 bg-slate-150 hover:bg-slate-250 rounded transition-all"
                                  title="View Specifications"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onEditAccount(acc); }}
                                  className="p-1 px-1.5 bg-slate-150 hover:bg-indigo-600 hover:text-white rounded transition-all"
                                  title="Modify Specifications"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {acc.approvalStatus === 'Not Submitted' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onSubmitAccount(acc.id); }}
                                    className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-[9px] font-bold rounded uppercase transition-all"
                                    title="Submit node for review"
                                  >
                                    Submit
                                  </button>
                                )}
                                {acc.approvalStatus === 'Submitted' && (
                                  <div className="flex items-center gap-0.5">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onApproveAccount(acc.id); }}
                                      className="p-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-all"
                                      title="Approve"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onRejectAccount(acc.id); }}
                                      className="p-1 text-white bg-rose-600 hover:bg-rose-700 rounded transition-all"
                                      title="Reject"
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
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

          {/* --- VIEW: INTERACTIVE STRUCTURAL COMPASS TREE --- */}
          {viewLayout === 'tree' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-650 shrink-0"></span>
                  Interactive Folder Ledger Pipeline
                </span>
                <div className="flex gap-2">
                  <button onClick={expandAll} className="text-[10px] bg-slate-100 hover:bg-slate-200 border px-2 py-1 rounded font-bold">Expand All</button>
                  <button onClick={collapseAll} className="text-[10px] bg-slate-100 hover:bg-slate-200 border px-2 py-1 rounded font-bold">Collapse All</button>
                </div>
              </div>

              <div className="space-y-1.5">
                {filteredAccounts.map(acc => {
                  if (isNodeHiddenByParent(acc)) return null;

                  const hasChildren = accounts.some(a => a.parentAccount === acc.code);
                  const isExpanded = expandedNodes[acc.code] !== false;
                  const isSummaryNode = !acc.postingAllowed;
                  const levelIndent = (acc.level - 1) * 24;

                  return (
                    <div
                      key={acc.id}
                      className={`relative flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSummaryNode ? 'bg-slate-50/50 border-slate-200/60 font-semibold' : 'bg-white border-slate-250/80 hover:shadow-xs hover:border-slate-350'
                      }`}
                      style={{ marginLeft: `${levelIndent}px` }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isSummaryNode && hasChildren ? (
                          <button
                            onClick={() => toggleNode(acc.code)}
                            className="w-4 h-4 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-indigo-600" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        ) : (
                          <div className="w-4 h-4 flex items-center justify-center">
                            {acc.level > 1 && <div className="w-1 h-1 bg-slate-400 rounded-full" />}
                          </div>
                        )}

                        <span className={`p-1 rounded ${isSummaryNode ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                          {isSummaryNode ? (isExpanded ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />) : <FileText className="w-3.5 h-3.5" />}
                        </span>

                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-150">{acc.code}</span>
                        <span className="truncate text-xs font-semibold text-slate-900">{acc.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold text-slate-400">{acc.accountType}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${acc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {acc.status}
                        </span>
                        <button 
                          onClick={() => setViewDetailAccount(acc)}
                          className="p-1 hover:bg-slate-10s rounded hover:text-indigo-600"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌳 PHASE 4: ACCOUNT HIERARCHY EXPLORER                  */}
      {/* ======================================================== */}
      {workspaceTab === 'hierarchy' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="border-b pb-3 border-slate-150">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase">
              <GitFork className="w-4 h-4 text-indigo-600" />
              Complete Financial Statement Hierarchical Trees
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click folders dynamically to inspect individual general ledger accounts belonging under each financial statement category and sub-category.
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs select-none">
            {/* 1. ASSETS ROOT */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div 
                onClick={() => toggleHierarchy('assets')} 
                className="bg-slate-900 text-white p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-805"
              >
                <div className="flex items-center gap-2 font-bold">
                  {expandedHierarchy['assets'] ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <Folder className="w-4 h-4 text-blue-400 fill-blue-500/25" />
                  <span>1000 - Assets</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900 font-extrabold">Active GAAP Folders</span>
              </div>

              {expandedHierarchy['assets'] && (
                <div className="p-4 bg-slate-50/50 space-y-2 border-t">
                  
                  {/* CURRENT ASSETS SUBSECTION */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('assets-current')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['assets-current'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                        <span>1100 - Current Assets</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Liquid Units</span>
                    </div>
                    {expandedHierarchy['assets-current'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Asset' && parseInt(a.code) >= 1100 && parseInt(a.code) < 1500).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium truncate max-w-[200px]">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NON-CURRENT ASSETS SUBSECTION */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('assets-noncurrent')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['assets-noncurrent'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                        <span>1500 - Non-Current Assets</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Long Term</span>
                    </div>
                    {expandedHierarchy['assets-noncurrent'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Asset' && parseInt(a.code) >= 1500 && parseInt(a.code) <= 1999).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium truncate max-w-[200px]">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* 2. LIABILITIES ROOT */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div 
                onClick={() => toggleHierarchy('liabilities')} 
                className="bg-slate-900 text-white p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-805"
              >
                <div className="flex items-center gap-2 font-bold">
                  {expandedHierarchy['liabilities'] ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <Folder className="w-4 h-4 text-rose-400 fill-rose-500/25" />
                  <span>2000 - Liabilities</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900 font-extrabold">Active GAAP Folders</span>
              </div>

              {expandedHierarchy['liabilities'] && (
                <div className="p-4 bg-slate-50/50 space-y-2 border-t">
                  
                  {/* CURRENT LIABILITIES */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('liabilities-current')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['liabilities-current'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        <span>2100 - Current Liabilities</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Obligations</span>
                    </div>
                    {expandedHierarchy['liabilities-current'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Liability' && parseInt(a.code) >= 2100 && parseInt(a.code) < 2500).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium truncate max-w-[200px]">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NON-CURRENT LIABILITIES */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('liabilities-noncurrent')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['liabilities-noncurrent'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        <span>2500 - Non-Current Liabilities</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Long-Term</span>
                    </div>
                    {expandedHierarchy['liabilities-noncurrent'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Liability' && parseInt(a.code) >= 2500 && parseInt(a.code) <= 2999).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium truncate max-w-[200px]">{a.financialStatementLine}</span>
                          </div>
                        ))}
                        {accounts.filter(a => a.accountType === 'Liability' && parseInt(a.code) >= 2500).length === 0 && (
                          <div className="py-2 pl-6 text-slate-400 italic text-[10px]">No Long-term Liabilities registered. Mapped in draft config modules.</div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* 3. EQUITY ROOT */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div 
                onClick={() => toggleHierarchy('equity')} 
                className="bg-slate-900 text-white p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-805"
              >
                <div className="flex items-center gap-2 font-bold">
                  {expandedHierarchy['equity'] ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <Folder className="w-4 h-4 text-amber-500 fill-amber-500/25" />
                  <span>3000 - Equity</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900 font-extrabold">Capital Stock</span>
              </div>

              {expandedHierarchy['equity'] && (
                <div className="p-4 bg-slate-50/50 space-y-2 border-t">
                  <div className="bg-white border rounded-lg p-3 divide-y divide-slate-100">
                    {accounts.filter(a => a.accountType === 'Equity').map(a => (
                      <div key={a.id} className="py-2 pl-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-indigo-600 font-bold">{a.code}</span>
                          <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                        </div>
                        <span className="text-[9.5px] text-slate-400 italic font-medium">{a.financialStatementLine}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. REVENUE ROOT */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div 
                onClick={() => toggleHierarchy('revenue')} 
                className="bg-slate-900 text-white p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-805"
              >
                <div className="flex items-center gap-2 font-bold">
                  {expandedHierarchy['revenue'] ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <Folder className="w-4 h-4 text-emerald-400 fill-emerald-500/25" />
                  <span>4000 - Revenue</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900 font-extrabold">Top Line</span>
              </div>

              {expandedHierarchy['revenue'] && (
                <div className="p-4 bg-slate-50/50 space-y-2 border-t">
                  
                  {/* OPERATING REVENUE */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('revenue-operating')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['revenue-operating'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                        <span>4100 - Operating Revenue</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Core Trade</span>
                    </div>
                    {expandedHierarchy['revenue-operating'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Revenue' && parseInt(a.code) < 4500).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NON-OPERATING REVENUE */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('revenue-nonoperating')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['revenue-nonoperating'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                        <span>4500 - Non-Operating Revenue</span>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">Secondary</span>
                    </div>
                    {expandedHierarchy['revenue-nonoperating'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Revenue' && parseInt(a.code) >= 4500).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic font-medium">{a.financialStatementLine}</span>
                          </div>
                        ))}
                        {accounts.filter(a => a.accountType === 'Revenue' && parseInt(a.code) >= 4500).length === 0 && (
                          <div className="py-2 pl-6 text-slate-400 italic text-[10px]">No Non-Operating revenue accounts registered yet. Managed on ledger extensions.</div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* 5. EXPENSES ROOT */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div 
                onClick={() => toggleHierarchy('expenses')} 
                className="bg-slate-900 text-white p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-805"
              >
                <div className="flex items-center gap-2 font-bold">
                  {expandedHierarchy['expenses'] ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <Folder className="w-4 h-4 text-purple-400 fill-purple-500/25" />
                  <span>5000 / 6000 - Expenses</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900 font-extrabold">Operating & Overhead</span>
              </div>

              {expandedHierarchy['expenses'] && (
                <div className="p-4 bg-slate-50/50 space-y-2 border-t">
                  
                  {/* OPERATING EXPENSES & COGS */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('expenses-operating')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['expenses-operating'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                        <span>5000 - Operating Expenses / COGS</span>
                      </div>
                    </div>
                    {expandedHierarchy['expenses-operating'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => (a.accountType === 'Expense' || a.accountType === 'Cost of Sales') && parseInt(a.code) >= 5000 && parseInt(a.code) < 6000).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ADMINISTRATIVE EXPENSES */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('expenses-admin')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['expenses-admin'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                        <span>6000 - Administrative Expenses</span>
                      </div>
                    </div>
                    {expandedHierarchy['expenses-admin'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Expense' && parseInt(a.code) >= 6000 && parseInt(a.code) < 7000).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FINANCIAL EXPENSES */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('expenses-finance')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['expenses-finance'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                        <span>7000 - Financial Expenses</span>
                      </div>
                    </div>
                    {expandedHierarchy['expenses-finance'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Expense' && parseInt(a.code) >= 7000 && parseInt(a.code) < 8000).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic">{a.financialStatementLine}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* OTHER EXPENSES */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div 
                      onClick={() => toggleHierarchy('expenses-other')}
                      className="bg-slate-100 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        {expandedHierarchy['expenses-other'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <Folder className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                        <span>8000 - Other Expenses</span>
                      </div>
                    </div>
                    {expandedHierarchy['expenses-other'] && (
                      <div className="p-3 divide-y divide-slate-100">
                        {accounts.filter(a => a.accountType === 'Expense' && parseInt(a.code) >= 8000).map(a => (
                          <div key={a.id} className="py-2 pl-6 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-indigo-600 font-bold">{a.code}</span>
                              <span className="text-slate-800 font-sans font-semibold">{a.name}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 italic">{a.financialStatementLine}</span>
                          </div>
                        ))}
                        {accounts.filter(a => a.accountType === 'Expense' && parseInt(a.code) >= 8000).length === 0 && (
                          <div className="py-2 pl-6 text-slate-400 italic text-[10px]">No auxiliary expenses registered in range.</div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ⚙️ PHASE 5: SUBSIDIARY LEDGER MAPPING REGISTRY          */}
      {/* ======================================================== */}
      {workspaceTab === 'subledger' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="border-b pb-3 border-slate-150">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase">
              <Boxes className="w-4 h-4 text-indigo-600" />
              Subledger Integration Control & Mapping Registry
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review real-time transaction postings and double-entry reconciliation controls across the 9 primary operational auxiliary modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Direct selector for the 9 modules */}
            <div className="space-y-1 md:col-span-1 border-r border-slate-100 pr-4">
              <span className="text-[10px] font-black uppercase text-slate-405 block pb-2">Operational Modules</span>
              {SUBLEDGER_MODULES_SPECS.map(sm => (
                <button
                  key={sm.module}
                  onClick={() => setSelectedSubledgerModule(sm.module)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    selectedSubledgerModule === sm.module 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{sm.module}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedSubledgerModule === sm.module ? 'text-indigo-400' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            {/* Complete rules layout display */}
            <div className="md:col-span-2 space-y-4">
              {(() => {
                const activeSpec = SUBLEDGER_MODULES_SPECS.find(sm => sm.module === selectedSubledgerModule);
                if (!activeSpec) return <div className="text-slate-400 italic text-xs">No module spec found</div>;

                return (
                  <div className="space-y-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded border border-indigo-100 font-mono">Subledger Target Module</span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{activeSpec.module}</h4>
                      </div>
                      <div className="text-left sm:text-right font-mono text-xs">
                        <span className="text-[10px] text-slate-400 block font-bold font-sans">CONTROL ACCOUNT MAPPED:</span>
                        <span className="text-indigo-700 font-bold bg-white border border-slate-200 px-2.5 py-1 rounded inline-block mt-0.5">
                          {activeSpec.controlAccountCode} — {activeSpec.controlAccountName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-705">
                      {/* postingRules */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-250 hover:border-slate-350 transition-colors">
                        <div className="flex items-center gap-1.5 font-bold text-slate-950 pb-1.5 border-b mb-1.5">
                          <Scale className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Posting Rules</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{activeSpec.postingRules}</p>
                      </div>

                      {/* autoJournalRules */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-250 hover:border-slate-350 transition-colors">
                        <div className="flex items-center gap-1.5 font-bold text-slate-950 pb-1.5 border-b mb-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Automatic Journal Rules</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{activeSpec.autoJournalRules}</p>
                      </div>

                      {/* recoRules */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-250 hover:border-slate-350 transition-colors">
                        <div className="flex items-center gap-1.5 font-bold text-slate-950 pb-1.5 border-b mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Reconciliation Rules</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{activeSpec.recoRules}</p>
                      </div>

                      {/* errorRules */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-250 hover:border-slate-350 transition-colors">
                        <div className="flex items-center gap-1.5 font-bold text-slate-950 pb-1.5 border-b mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Error & Variance Handling Rules</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{activeSpec.errorRules}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- ACCOUNT SPECIFICATION DISPLAY OVERLAY MODAL --- */}
      {/* ======================================================== */}
      {viewDetailAccount && (
        <div id="full-viewer-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white select-none border-b border-indigo-950">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-indigo-300">Phase 3 Specs Panel</span>
                <h4 className="font-black text-base text-white mt-1 leading-none truncate flex items-center gap-2">
                  <span className="bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded text-xs select-all text-indigo-100">{viewDetailAccount.code}</span>
                  <span className="truncate">{viewDetailAccount.name}</span>
                </h4>
              </div>
              <button 
                onClick={() => setViewDetailAccount(null)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll area containing standard 24 fields */}
            {(() => {
              const sp = getAccountSpecs(viewDetailAccount);
              return (
                <div className="px-6 py-5 overflow-y-auto space-y-6 text-xs text-slate-707">
                  {/* Visual Indicators Banner */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${viewDetailAccount.postingAllowed ? 'bg-emerald-50 border-emerald-100 text-emerald-850' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">11. Posting Allowed</span>
                      <strong className="text-xs font-black mt-1 inline-block">{sp.postingAllowed}</strong>
                    </div>

                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${viewDetailAccount.manualJournalAllowed ? 'bg-indigo-50 border-indigo-100 text-indigo-850' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">12. Manual Journals</span>
                      <strong className="text-xs font-black mt-1 inline-block">{sp.manualJournalAllowed}</strong>
                    </div>

                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${sp.reconciliationRequired === 'Yes' ? 'bg-purple-50 border-purple-100 text-purple-850' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">13. Recon Required</span>
                      <strong className="text-xs font-black mt-1 inline-block">{sp.reconciliationRequired}</strong>
                    </div>

                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${viewDetailAccount.controlAccount ? 'bg-pink-50 border-pink-100 text-pink-850' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400">14. Control Account</span>
                      <strong className="text-xs font-black mt-1 inline-block">{sp.controlAccountIndicator}</strong>
                    </div>
                  </div>

                  {/* Core Parameters Section */}
                  <div className="space-y-3.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1 text-[11px] uppercase tracking-wider">I. Core Registry Specifications</h5>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">1. Account Code</span>
                        <span className="font-mono text-xs font-bold text-slate-900">{sp.code}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">2. Account Name</span>
                        <span className="text-xs font-semibold text-slate-900">{sp.name}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold">3. Account Description</span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed font-semibold">{sp.desc}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">4. Account Type</span>
                        <span className="text-xs font-bold text-slate-900">{sp.type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">5. Parent Account</span>
                        <span className="font-mono text-xs font-bold text-slate-900">{sp.parent}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">6. Account Level</span>
                        <span className="text-xs font-mono font-bold text-slate-900">Level {sp.lvl}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">9. Balance Type</span>
                        <span className="text-xs font-bold text-slate-950 font-mono">{sp.balance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance, Reporting & Control section */}
                  <div className="space-y-3.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1 text-[11px] uppercase tracking-wider">II. Compliance, Reporting & Control</h5>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold">7. IFRS Classification Mapping</span>
                        <span className="text-xs font-semibold text-slate-900">{sp.ifrs}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold">8. Financial Statement Mapping</span>
                        <span className="text-xs font-semibold text-slate-900">{sp.fsMap}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">10. Currency Type</span>
                        <span className="text-xs font-bold text-slate-900">{sp.currency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">15. Subsidiary Ledger Target</span>
                        <span className="text-xs font-bold text-indigo-700">{sp.subsidiaryLedgerMapping}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">16. Budget Control Indicator</span>
                        <span className="text-xs font-bold text-slate-900">{sp.budgetControlIndicator}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">17. Cash Flow Category</span>
                        <span className="text-xs font-bold text-emerald-700">{sp.cfCategory}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status, Dates & Audit Trails */}
                  <div className="space-y-3.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1 text-[11px] uppercase tracking-wider">III. Dates, Status & Auditing</h5>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">18. Active Status</span>
                        <span className="text-xs font-bold text-slate-900">{sp.activeStatus}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">21. Approval Status</span>
                        <span className="text-xs font-bold text-slate-900">{sp.approvalStatus}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">19. Effective Date</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{sp.effectiveDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">20. Expiry Date</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{sp.expiryDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">22. Created By</span>
                        <span className="text-xs font-mono text-slate-600 font-semibold">{sp.createdBy}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">23. Last Modified By</span>
                        <span className="text-xs font-mono text-slate-600 font-semibold">{sp.lastModifiedBy}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold">24. Audit Trail Reference</span>
                        <span className="text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 pr-2 pl-2 rounded inline-block mt-0.5 font-bold">
                          {sp.auditTrailRef}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Modal Actions Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t select-none">
              <button 
                onClick={() => setViewDetailAccount(null)}
                className="px-4 py-2 bg-slate-205 border border-slate-300 rounded-xl hover:bg-slate-300 font-bold transition text-xs"
              >
                Close Profile
              </button>
              <button 
                onClick={() => { onEditAccount(viewDetailAccount); setViewDetailAccount(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition text-xs flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modify Specifications</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

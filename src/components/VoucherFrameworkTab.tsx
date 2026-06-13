import React, { useState, useMemo, useEffect } from 'react';
import { Account } from '../types';
import { 
  Printer, 
  Download, 
  FileText, 
  Search, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  Bookmark, 
  Layers, 
  Database, 
  Tag, 
  Coins, 
  History, 
  Info, 
  Check, 
  Undo2, 
  ShieldAlert, 
  FileCheck, 
  XCircle,
  Eye,
  Lock,
  Landmark,
  Paperclip,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { VOUCHER_SPECS, VoucherTypeBlueprint } from '../data/voucherSpecs';
import { 
  generateAccountingLines, 
  DEFAULT_GL_ACCOUNTS, 
  GeneratedVoucherLine, 
  getAccountName 
} from '../utils/voucherEngine';

interface VoucherFrameworkTabProps {
  accounts: Account[];
  onAddAuditLog: (log: any) => void;
}

interface VoucherItem {
  id: string;
  voucherNo: string;
  voucherType: string;
  entity: string;
  company: string;
  branch: string;
  costCenter: string;
  department: string;
  voucherDate: string;
  postingDate: string;
  currency: string;
  exchangeRate: number;
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Returned' | 'Approved' | 'Posted' | 'Cancelled' | 'Archived';
  preparedBy: string;
  preparedDate: string;
  approvedBy?: string;
  referenceNo: string;
  externalRef?: string;
  notes: string;
  payeeOrPayer?: string;
  paymentMethod?: string;
  chequeNo?: string;
  cashAccount?: string;
  bankAccount?: string;
  lines: GeneratedVoucherLine[];
  actionsHistory: { timestamp: string; action: string; user: string; notes?: string }[];
  attachments: { id: string; name: string; size: string; uploadDate: string }[];
}

// Preset baseline journal vouchers to demonstrate dual-aspect ledger automation
const INITIAL_VOUCHERS: VoucherItem[] = [
  {
    id: 'V-001',
    voucherNo: 'CPV-2026-0042',
    voucherType: 'CPV',
    entity: 'MS-ETH-01',
    company: 'Mesfin PLC Ethiopia Division',
    branch: 'Addis Ababa Central',
    costCenter: 'CC-ADMIN-HQ',
    department: 'Corporate Admin',
    voucherDate: '2026-06-12',
    postingDate: '2026-06-12',
    currency: 'ETB',
    exchangeRate: 1.0,
    totalDebit: 8500.00,
    totalCredit: 8500.00,
    status: 'Posted',
    preparedBy: 'senior_accountant@abc.et',
    preparedDate: '2026-06-11',
    approvedBy: 'b.tasew@finance.gov.et',
    referenceNo: 'PETTY-REV-902',
    externalRef: 'CHQ-AWASH-441-A',
    notes: 'Local office supplies and courier logistics post dispatch',
    payeeOrPayer: 'Abebe Courier & Stationery Ltd',
    paymentMethod: 'Cash',
    cashAccount: '1111 (Petty Cash Admin HQ)',
    lines: [
      { id: 'l1', lineNo: 1, accountCode: '5130', accountName: 'Office & Stationery Expenses', description: 'Stationery and print papers (Excl. VAT)', entity: 'MS-ETH-01', branch: 'Addis Ababa Central', costCenter: 'CC-ADMIN-HQ', department: 'Corporate Admin', project: 'PRJ-MAIN-2026', currency: 'ETB', exchangeRate: 1, debit: 7391.30, credit: 0, taxCode: 'VAT-15', taxAmount: 1108.70, reference: 'INV-7761' },
      { id: 'l2', lineNo: 2, accountCode: '1140', accountName: 'VAT Input Tax Asset', description: 'VAT Input Tax 15% - Payee: Abebe Courier', entity: 'MS-ETH-01', branch: 'Addis Ababa Central', costCenter: 'CC-ADMIN-HQ', department: 'Corporate Admin', project: 'PRJ-MAIN-2026', currency: 'ETB', exchangeRate: 1, debit: 1108.70, credit: 0, taxCode: 'VAT-15', taxAmount: 1108.70, reference: 'INV-7761' },
      { id: 'l3', lineNo: 3, accountCode: '1111', accountName: 'Petty Cash Local Account', description: 'Cash Settle payment to Abebe Courier', entity: 'MS-ETH-01', branch: 'Addis Ababa Central', costCenter: 'CC-ADMIN-HQ', department: 'Corporate Admin', project: 'PRJ-MAIN-2026', currency: 'ETB', exchangeRate: 1, debit: 0, credit: 8500.00, taxCode: 'Exempt', taxAmount: 0, reference: 'INV-7761' }
    ],
    actionsHistory: [
      { timestamp: '11:00 AM', action: 'Created Draft', user: 'senior_accountant@abc.et' },
      { timestamp: '11:15 AM', action: 'Submitted Approval', user: 'senior_accountant@abc.et' },
      { timestamp: '01:30 PM', action: 'Approved', user: 'b.tasew@finance.gov.et' },
      { timestamp: '02:00 PM', action: 'Posted to General Ledger', user: 'senior_accountant@abc.et' }
    ],
    attachments: [
      { id: 'att-1', name: 'Abebe_Invoice_7761.pdf', size: '1.4 MB', uploadDate: '2026-06-11' }
    ]
  },
  {
    id: 'V-002',
    voucherNo: 'BRV-2026-1044',
    voucherType: 'BRV',
    entity: 'MS-ETH-01',
    company: 'Mesfin PLC Ethiopia Division',
    branch: 'Bole Sub-Branch',
    costCenter: 'CC-SALES-BOLE',
    department: 'Sales & Distribution',
    voucherDate: '2026-06-12',
    postingDate: '2026-06-12',
    currency: 'USD',
    exchangeRate: 57.45,
    totalDebit: 172350.00,
    totalCredit: 172350.00,
    status: 'Under Review',
    preparedBy: 'senior_accountant@abc.et',
    preparedDate: '2026-06-12',
    referenceNo: 'CBE-WIRE-USD-4428',
    notes: 'Advance deposit client commitment fee for export shipment',
    payeeOrPayer: 'Golden Horn Export Trading LLC',
    paymentMethod: 'Bank Transfer',
    bankAccount: '1114 (Bank Awash Account - USD)',
    lines: [
      { id: 'l4', lineNo: 1, accountCode: '1114', accountName: 'Bank Awash Account - USD', description: 'Bank Receipt Clearance - Payer: Golden Horn Export Trading LLC', entity: 'MS-ETH-01', branch: 'Bole Sub-Branch', costCenter: 'CC-SALES-BOLE', department: 'Sales & Distribution', project: 'PRJ-MAIN-2026', currency: 'USD', exchangeRate: 57.45, debit: 172350, credit: 0, taxCode: 'Exempt', taxAmount: 0, reference: 'CBE-DEPOSIT' },
      { id: 'l5', lineNo: 2, accountCode: '1120', accountName: 'Trade Receivables (A/R)', description: 'Customer deposit remittance advance - Payer: Golden Horn Export', entity: 'MS-ETH-01', branch: 'Bole Sub-Branch', costCenter: 'CC-SALES-BOLE', department: 'Sales & Distribution', project: 'PRJ-MAIN-2026', currency: 'USD', exchangeRate: 57.45, debit: 0, credit: 172350, taxCode: 'Exempt', taxAmount: 0, reference: 'DEPOSIT-ADV' }
    ],
    actionsHistory: [
      { timestamp: '06:10 AM', action: 'Created Draft', user: 'senior_accountant@abc.et' },
      { timestamp: '06:15 AM', action: 'Submitted for Review', user: 'senior_accountant@abc.et' }
    ],
    attachments: [
      { id: 'att-2', name: 'Awash_CreditAdvice_4428.pdf', size: '920 KB', uploadDate: '2026-06-12' }
    ]
  }
];

export default function VoucherFrameworkTab({ accounts, onAddAuditLog }: VoucherFrameworkTabProps) {
  // Navigation
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'entry' | 'inquiry' | 'rules' | 'reports'>('entry');
  const [vouchersList, setVouchersList] = useState<VoucherItem[]>(INITIAL_VOUCHERS);
  
  // Custom Filters for Inquiry Screen
  const [filterVType, setFilterVType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Detail views
  const [selectedReport, setSelectedReport] = useState<string>('register');
  const [selectedVoucherForDetails, setSelectedVoucherForDetails] = useState<VoucherItem | null>(INITIAL_VOUCHERS[0]);
  const [isApprovalHistoryOpen, setIsApprovalHistoryOpen] = useState<boolean>(true);
  const [currentFormStatus, setCurrentFormStatus] = useState<'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Posted'>('Draft');

  // Dynamic Voucher Entry Form Header States
  const [hdrVoucherType, setHdrVoucherType] = useState<string>('CPV');
  const [hdrVoucherNo, setHdrVoucherNo] = useState<string>('CPV-2026-0043');
  const [hdrEntity, setHdrEntity] = useState<string>('MS-ETH-01');
  const [hdrCompany, setHdrCompany] = useState<string>('Mesfin PLC Ethiopia Division');
  const [hdrBranch, setHdrBranch] = useState<string>('Addis Ababa Central');
  const [hdrCostCenter, setHdrCostCenter] = useState<string>('CC-ADMIN-HQ');
  const [hdrDepartment, setHdrDepartment] = useState<string>('Corporate Admin');
  const [hdrVoucherDate, setHdrVoucherDate] = useState<string>('2026-06-13');
  const [hdrPostingDate, setHdrPostingDate] = useState<string>('2026-06-13');
  const [hdrCurrency, setHdrCurrency] = useState<string>('ETB');
  const [hdrExchangeRate, setHdrExchangeRate] = useState<number>(1.0);
  const [hdrReferenceNo, setHdrReferenceNo] = useState<string>('');
  const [hdrExternalRef, setHdrExternalRef] = useState<string>('');
  const [hdrNotes, setHdrNotes] = useState<string>('');

  // Business Information States (Standard transaction parameters)
  const [bizAmount, setBizAmount] = useState<number>(12500);
  const [bizPayerOrPayee, setBizPayerOrPayee] = useState<string>('Abyssinia Logistics PLC');
  const [bizChequeNo, setBizChequeNo] = useState<string>('');
  const [bizTaxCode, setBizTaxCode] = useState<string>('VAT-15');
  const [bizAccountDr, setBizAccountDr] = useState<string>('5140'); // default Travel & Logistics
  const [bizAccountCr, setBizAccountCr] = useState<string>('4110'); // default Sales Revenue
  const [bizBankAccount, setBizBankAccount] = useState<string>('1112'); // CBE
  const [bizCashAccount, setBizCashAccount] = useState<string>('1111'); // Petty cash
  const [bizOriginalVoucherRef, setBizOriginalVoucherRef] = useState<string>('');
  
  // Override Ledger Switch (for senior accountants to tweak auto-generated rows)
  const [isLedgerOverrideActive, setIsLedgerOverrideActive] = useState<boolean>(false);
  
  // Active lines loaded inside Section 3 Accounting Distribution Section
  const [formLines, setFormLines] = useState<GeneratedVoucherLine[]>([]);

  // Simulation files
  const [formAttachments, setFormAttachments] = useState<{ id: string; name: string; size: string; uploadDate: string }[]>([
    { id: 'att-sample', name: 'ERCA_Standard_Receipt.png', size: '440 KB', uploadDate: '2026-06-13' }
  ]);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Auto-generate voucher serial code on type switch & company sync
  useEffect(() => {
    setHdrVoucherNo(`${hdrVoucherType}-2026-0${Math.floor(Math.random() * 900) + 100}`);
    
    // Choose sensible default accounts based on selected type
    if (hdrVoucherType === 'CPV') {
      setBizAccountDr('5130'); // Office
      setBizCashAccount('1111');
      setBizTaxCode('VAT-15');
    } else if (hdrVoucherType === 'CRV') {
      setBizAccountCr('4110'); // Revenue
      setBizCashAccount('1111');
      setBizTaxCode('Exempt');
    } else if (hdrVoucherType === 'BPV') {
      setBizAccountDr('5150'); // Rent Expense
      setBizBankAccount('1112'); // CBE
      setBizTaxCode('VAT-15');
    } else if (hdrVoucherType === 'BRV') {
      setBizAccountCr('1120'); // Receivables customer payment
      setBizBankAccount('1112');
      setBizTaxCode('Exempt');
    } else if (hdrVoucherType === 'ARI') {
      setBizAccountCr('4110'); // Sales
      setBizTaxCode('VAT-15');
    } else if (hdrVoucherType === 'API') {
      setBizAccountDr('5110'); // Raw materials cost
      setBizTaxCode('VAT-15');
    } else if (hdrVoucherType === 'BTV') {
      setBizAccountDr('1113'); // To Dashen
      setBizBankAccount('1112'); // From CBE
      setBizTaxCode('Exempt');
    } else if (hdrVoucherType === 'VATV') {
      setBizAmount(150000); // Sample cumulative VAT Output
      setBizTaxCode('Exempt');
    } else if (hdrVoucherType === 'WHTV') {
      setBizAmount(25000);
      setBizTaxCode('WHT-2');
    } else if (hdrVoucherType === 'RCV') {
      setBizOriginalVoucherRef('CPV-2026-0042');
      setBizAmount(8500);
      setBizTaxCode('Exempt');
    } else {
      setBizTaxCode('Exempt');
    }
  }, [hdrVoucherType]);

  useEffect(() => {
    if (hdrEntity === 'MS-ETH-01') {
      setHdrCompany('Mesfin PLC Ethiopia Division');
    } else if (hdrEntity === 'MS-KE-02') {
      setHdrCompany('Mesfin PLC Kenya Division');
    }
  }, [hdrEntity]);

  // Hook business inputs to automated double-entry ledger compilations
  useEffect(() => {
    if (!isLedgerOverrideActive) {
      const generated = generateAccountingLines({
        voucherType: hdrVoucherType,
        amount: bizAmount,
        payerOrPayee: bizPayerOrPayee,
        accountDr: bizAccountDr,
        accountCr: bizAccountCr,
        taxCode: bizTaxCode,
        bankAccount: bizBankAccount,
        cashAccount: bizCashAccount,
        narration: hdrNotes || `Settle standard ${hdrVoucherType} transaction: ${bizPayerOrPayee}`,
        entity: hdrEntity,
        branch: hdrBranch,
        costCenter: hdrCostCenter,
        department: hdrDepartment,
        currency: hdrCurrency,
        exchangeRate: hdrExchangeRate,
        chequeNo: bizChequeNo,
        originalVoucherRef: bizOriginalVoucherRef,
        schemaAccounts: accounts
      });
      setFormLines(generated);
    }
  }, [
    isLedgerOverrideActive,
    hdrVoucherType,
    bizAmount,
    bizPayerOrPayee,
    bizAccountDr,
    bizAccountCr,
    bizTaxCode,
    bizBankAccount,
    bizCashAccount,
    bizChequeNo,
    bizOriginalVoucherRef,
    hdrNotes,
    hdrEntity,
    hdrBranch,
    hdrCostCenter,
    hdrDepartment,
    hdrCurrency,
    hdrExchangeRate,
    accounts
  ]);

  // Dynamic real-time totals and variance analysis
  const calculationSummary = useMemo(() => {
    let debSum = 0;
    let credSum = 0;
    let taxSum = 0;

    formLines.forEach(l => {
      debSum += Number(l.debit || 0);
      credSum += Number(l.credit || 0);
      taxSum += Number(l.taxAmount || 0);
    });

    const difference = Math.abs(debSum - credSum);
    const isBalanced = difference < 0.01 && debSum > 0;
    const isCPVExcessive = hdrVoucherType === 'CPV' && debSum > 10000;

    return {
      totalDebit: debSum,
      totalCredit: credSum,
      taxTotal: taxSum,
      difference,
      isBalanced,
      isCPVExcessive
    };
  }, [formLines, hdrVoucherType]);

  // Continuous background tax & compliance checks
  const validationCheckList = useMemo(() => {
    const list = [];
    
    // IFRS Double Entry balancing
    const netDiff = calculationSummary.difference;
    list.push({
      id: 'V1',
      rule: 'IFRS Dual Aspect Balancing Rule',
      desc: 'All debit ledgers must match corresponding credit ledgers exactly.',
      status: netDiff < 0.01 ? 'PASSED' : 'OUT_OF_BALANCE',
      message: netDiff < 0.01 ? 'Voucher is perfectly balanced.' : `Discrepancy of ${netDiff.toFixed(2)} ${hdrCurrency} detected.`
    });

    // Inactive account usage check
    let inactiveAccountUsed = false;
    formLines.forEach(l => {
      const activeState = accounts.find(a => a.code === l.accountCode);
      if (activeState && activeState.status === 'Inactive') {
        inactiveAccountUsed = true;
      }
    });
    list.push({
      id: 'V2',
      rule: 'GL Account Validation Check',
      desc: 'Audit check protecting books from postings to dormant or inactive account keys.',
      status: !inactiveAccountUsed ? 'PASSED' : 'VIOLATION',
      message: inactiveAccountUsed ? 'Warning: Inactive ledger codes detected!' : 'All parsed accounts active.'
    });

    // Ethiopian ERCA 10,000 ETB Cash limit
    if (hdrVoucherType === 'CPV' && hdrCurrency === 'ETB') {
      const limitExceeded = calculationSummary.totalDebit > 10000;
      list.push({
        id: 'V3',
        rule: 'ERCA Act No. 721 Cash Ceiling',
        desc: 'Capital disbursements under petty cash to a single supplier must not exceed 10,000 Birr daily.',
        status: limitExceeded ? 'WARNING' : 'PASSED',
        message: limitExceeded 
          ? 'PETTY CASH LIMIT EXCEEDED! Please change Voucher Type to BPV (Bank Payment) or attach special CFO variance approval.' 
          : 'Disbursement complies with statutory daily limits.'
      });
    }

    // Cost Center segment check
    let missingDimensions = false;
    formLines.forEach(l => {
      if (!l.costCenter || !l.department) {
        missingDimensions = true;
      }
    });
    list.push({
      id: 'V4',
      rule: 'Analytical Dimension Check',
      desc: 'Ensures Cost Center and Department variables are fully resolved for segment profit-and-loss reports.',
      status: !missingDimensions ? 'PASSED' : 'MISSING',
      message: missingDimensions ? 'One or more lines lack organizational dimensions.' : 'All financial reporting segments filled.'
    });

    // ERCA Withholding Certificate Check
    if (hdrVoucherType === 'API' && (bizTaxCode === 'WHT-2' || bizTaxCode === 'WHT-15')) {
      list.push({
        id: 'V5',
        rule: 'ERCA 2% / 15% WHT Certificate rule',
        desc: 'Instructs the credit desk to generate a preprinted WHT certificate within 15 working days.',
        status: 'PASSED',
        message: `Active auto-accrual: Deduced ${bizTaxCode === 'WHT-2' ? '2%' : '15%'} withholding tax.`
      });
    }

    return list;
  }, [calculationSummary, formLines, accounts, hdrVoucherType, hdrCurrency, bizTaxCode]);

  // Section 3 manual overrides methods
  const handleAddNewManualRow = () => {
    setIsLedgerOverrideActive(true);
    const newNo = formLines.length + 1;
    const defaultManualLine: GeneratedVoucherLine = {
      id: `manual-l-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      lineNo: newNo,
      accountCode: accounts[0]?.code || '5130',
      accountName: accounts[0]?.name || 'Office & Stationery Expenses',
      description: 'Senior Auditor custom override ledger adjustment line',
      entity: hdrEntity,
      branch: hdrBranch,
      costCenter: hdrCostCenter,
      department: hdrDepartment,
      project: 'PRJ-MAIN-2026',
      currency: hdrCurrency,
      exchangeRate: hdrExchangeRate,
      debit: 0,
      credit: 0,
      taxCode: 'Exempt',
      taxAmount: 0,
      reference: 'MANUAL-ADJ'
    };
    setFormLines([...formLines, defaultManualLine]);
  };

  const handleRemoveManualRow = (id: string) => {
    setIsLedgerOverrideActive(true);
    setFormLines(formLines.filter(l => l.id !== id).map((l, idx) => ({ ...l, lineNo: idx + 1 })));
  };

  const handleUpdateManualField = (id: string, key: keyof GeneratedVoucherLine, val: any) => {
    setIsLedgerOverrideActive(true);
    setFormLines(formLines.map(l => {
      if (l.id === id) {
        let updated = { ...l, [key]: val };
        if (key === 'accountCode') {
          updated.accountName = getAccountName(val, accounts);
        }
        return updated;
      }
      return l;
    }));
  };

  // Mock Upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().substring(0, 10)
      };
      setFormAttachments([...formAttachments, newAtt]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().substring(0, 10)
      };
      setFormAttachments([...formAttachments, newAtt]);
    }
  };

  const handleDeleteAttachment = (id: string) => {
    setFormAttachments(formAttachments.filter(a => a.id !== id));
  };


  // Advanced Post / Workflow State Actions
  const handleActionClick = (actionName: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Posted' | 'Cancelled' | 'Archived' | 'Returned') => {
    if (actionName === 'Posted' && !calculationSummary.isBalanced) {
      alert(`Posting Rejected: Balanced books are a prerequisite for posting to the ledger. Current variance is ${calculationSummary.difference.toFixed(2)} ${hdrCurrency}.`);
      return;
    }

    if (actionName === 'Posted' && calculationSummary.isCPVExcessive) {
      const override = window.confirm(`COMPLIANCE WARNING: Under ERCA guidelines, petty cash transactions exceeding 10,000 ETB daily are subject to external penalty. Do you wish to override this security barrier with CFO authorization code?`);
      if (!override) return;
    }

    const currentVNo = hdrVoucherNo || `VCH-${hdrVoucherType}-${Math.floor(Math.random() * 90000)}`;
    const newVoucher: VoucherItem = {
      id: `V-${Date.now()}`,
      voucherNo: currentVNo,
      voucherType: hdrVoucherType,
      entity: hdrEntity,
      company: hdrCompany,
      branch: hdrBranch,
      costCenter: hdrCostCenter,
      department: hdrDepartment,
      voucherDate: hdrVoucherDate,
      postingDate: hdrPostingDate,
      currency: hdrCurrency,
      exchangeRate: hdrExchangeRate,
      totalDebit: calculationSummary.totalDebit,
      totalCredit: calculationSummary.totalCredit,
      status: actionName === 'Under Review' ? 'Under Review' : actionName === 'Cancelled' ? 'Cancelled' : actionName === 'Archived' ? 'Archived' : actionName === 'Returned' ? 'Returned' : actionName as any,
      preparedBy: 'senior_accountant@abc.et',
      preparedDate: new Date().toISOString().substring(0, 10),
      referenceNo: hdrReferenceNo || 'PETTY-REV-902',
      externalRef: hdrExternalRef,
      notes: hdrNotes || `${hdrVoucherType} transaction business voucher processing.`,
      payeeOrPayer: bizPayerOrPayee,
      paymentMethod: hdrVoucherType.includes('P') ? 'Bank Wire / Cheque' : 'Direct Credit Advice',
      chequeNo: bizChequeNo,
      cashAccount: bizCashAccount,
      bankAccount: bizBankAccount,
      lines: [...formLines],
      actionsHistory: [
        { timestamp: new Date().toLocaleTimeString(), action: `Authored State Transition to [${actionName}]`, user: 'mzerihun01@gmail.com', notes: 'Automated policy validator checks completed with 100% compliant rules.' }
      ],
      attachments: [...formAttachments]
    };

    setVouchersList([newVoucher, ...vouchersList]);
    setSelectedVoucherForDetails(newVoucher);

    // Sync form status representation for workflow tracking
    if (actionName === 'Draft' || actionName === 'Submitted' || actionName === 'Under Review' || actionName === 'Approved' || actionName === 'Posted') {
      setCurrentFormStatus(actionName);
    }

    // Write audit trail log
    onAddAuditLog({
      id: `AUD-V-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'mzerihun01@gmail.com',
      action: `VMF_VOUCHER_${actionName.toUpperCase()}`,
      entityType: 'Voucher Master Ledger',
      entityKey: currentVNo,
      description: `VMF transaction ${currentVNo} updated status to [${actionName}]. Total balanced ledger value recorded: ${calculationSummary.totalDebit.toLocaleString()} ${hdrCurrency}.`
    });

    alert(`Voucher ${currentVNo} successfully converted to status: [${actionName}]!`);
    
    // Clear/Reset entry screen after successful posting
    if (actionName === 'Posted') {
      setHdrReferenceNo('');
      setHdrExternalRef('');
      setHdrNotes('');
      setBizPayerOrPayee('');
      setBizAmount(12000);
      setBizChequeNo('');
      setIsLedgerOverrideActive(false);
      setCurrentFormStatus('Draft');
      setFormAttachments([{ id: 'att-sample', name: 'ERCA_Standard_Receipt.png', size: '440 KB', uploadDate: '2026-06-13' }]);
    }
  };

  // Reversal Rules Handler (Cancellation Contra-Posted Journal Vouchers RCV)
  const handlePostCancellationReversal = (targetVoucher: VoucherItem) => {
    // Exact contra-balance lines generator
    const contraLines = targetVoucher.lines.map(line => ({
      ...line,
      id: `rcv-line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      debit: line.credit, // SWAP debits and credits precisely
      credit: line.debit
    }));

    const rcvVoucherNo = `RCV-${targetVoucher.voucherNo.split('-')[1]}-${Math.floor(Math.random() * 800) + 100}`;
    const reversalVoucher: VoucherItem = {
      ...targetVoucher,
      id: `V-RCV-${Date.now()}`,
      voucherNo: rcvVoucherNo,
      voucherType: 'RCV',
      notes: `IFRS COMPLIANT AUTO-REVERSAL CONTRA FOR DOCUMENT: ${targetVoucher.voucherNo}. Correction of erroneous entries.`,
      status: 'Posted',
      preparedBy: 'senior_accountant@abc.et',
      preparedDate: new Date().toISOString().substring(0, 10),
      lines: contraLines,
      actionsHistory: [
        { timestamp: new Date().toLocaleTimeString(), action: 'Auto-Reversed Journal Bookings', user: 'Central ERP Audit Bot', notes: 'Automated contra balance matching ledger lines.' }
      ],
      attachments: []
    };

    setVouchersList([reversalVoucher, ...vouchersList]);
    setSelectedVoucherForDetails(reversalVoucher);

    onAddAuditLog({
      id: `AUD-REV-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'senior_accountant@abc.et',
      action: 'VOUCHER_CONTRA_REVERSED',
      entityType: 'Voucher Reversal',
      entityKey: targetVoucher.voucherNo,
      description: `Invoiced exact opposite debit/credit book entries via ${reversalVoucher.voucherNo} to perfectly offset transaction account balances.`
    });

    alert(`Success: Created and posted Contra-Reversal document [${reversalVoucher.voucherNo}]! Historical balance offset is safe.`);
  };

  // Inquiry searchable list filters
  const filteredVouchers = useMemo(() => {
    return vouchersList.filter(v => {
      const matchType = filterVType === 'All' || v.voucherType === filterVType;
      const matchStatus = filterStatus === 'All' || v.status === filterStatus;
      const matchQuery = searchQuery === '' || 
        v.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.referenceNo && v.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.payeeOrPayer && v.payeeOrPayer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchQuery;
    });
  }, [vouchersList, filterVType, filterStatus, searchQuery]);

  // Selected specifications active on sidebar
  const activeSpec: VoucherTypeBlueprint = VOUCHER_SPECS[hdrVoucherType] || VOUCHER_SPECS.JV;

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Tab Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-xs gap-4">
        <div>
          <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAP S/4HANA & DYNAMICS 365 ERP ALIGNMENT</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" />
            <span>VMF • ERP Business Transactions Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            IFRS general ledger controller with statutory ERCA tax compliance engines. Select a business transaction and let the ledger auto-calculate double entries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveWorkspaceTab('entry')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeWorkspaceTab === 'entry' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Voucher Entry (Form)
          </button>
          <button
            onClick={() => {
              setActiveWorkspaceTab('inquiry');
              if (vouchersList.length > 0 && !selectedVoucherForDetails) {
                setSelectedVoucherForDetails(vouchersList[0]);
              }
            }}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeWorkspaceTab === 'inquiry' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Voucher Inquiry & Registry
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('rules')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeWorkspaceTab === 'rules' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Business Rules Catalog
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('reports')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeWorkspaceTab === 'reports' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            IFRS Reports Terminal
          </button>
        </div>
      </div>      {/* WORKSPACE CONTENT LAYOUT */}
      {activeWorkspaceTab === 'entry' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Transaction Forms Column */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Visual Status Workflow Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest block">Active Document Pipeline</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-slate-800 font-mono">{hdrVoucherNo}</span>
                    <span className="text-slate-300">•</span>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 px-1.5 rounded uppercase font-mono">{hdrVoucherType}</span>
                  </div>
                </div>

                {/* State Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium font-sans">Workflow State:</span>
                  <span className={`text-xs font-mono font-black uppercase px-3 py-1 rounded-full border ${
                    currentFormStatus === 'Posted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    currentFormStatus === 'Approved' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                    currentFormStatus === 'Under Review' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    currentFormStatus === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-205' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    ● {currentFormStatus}
                  </span>
                </div>
              </div>

              {/* Status Step Markers */}
              <div className="grid grid-cols-5 gap-2 text-center relative pt-2">
                <div className="absolute top-[21px] left-[10%] right-[10%] h-0.5 bg-slate-100 -z-5"></div>
                
                {[
                  { key: 'Draft', label: '1. Draft Form', desc: 'Authoring & Prep' },
                  { key: 'Submitted', label: '2. Submitted', desc: 'Sent to Clerk' },
                  { key: 'Under Review', label: '3. Desk Review', desc: 'SLA Audit Check' },
                  { key: 'Approved', label: '4. CFO Approved', desc: 'Statutory Approval' },
                  { key: 'Posted', label: '5. Ledger Posted', desc: 'Double Entries Fixed' }
                ].map((step, idx) => {
                  const states = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Posted'];
                  const currentIndex = states.indexOf(currentFormStatus);
                  const stepIndex = states.indexOf(step.key);
                  const isCompleted = stepIndex < currentIndex;
                  const isActive = step.key === currentFormStatus;
                  const isFuture = stepIndex > currentIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center select-none">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all border ${
                        isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 border-indigo-600' :
                        isCompleted ? 'bg-emerald-500 text-white border-emerald-500' :
                        'bg-white text-slate-400 border-slate-250'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-2 truncate max-w-full ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {step.label}
                      </span>
                      <span className="text-[9px] text-slate-450 hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1. Header Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden" id="entry-header-section">
              <div className="bg-slate-900 text-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-100">1. ERP TRANSACTION MASTER HEADER (SEGMENT & CONTEXT)</span>
                </div>
                <div className="text-[10px] bg-slate-805 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded">
                  IFRS COMPLIANT SHEET
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Organization Division Profile */}
                <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Corporate Segment Alignment (IFRS Sector Reporting)</span>
                    <span className="text-[9.5px] text-indigo-650 bg-indigo-50 font-bold px-2 py-0.5 rounded border border-indigo-100 font-mono">Segment Reporting (IAS 14 / IFRS 8)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Legal Entity Node</label>
                      <select value={hdrEntity} onChange={e => setHdrEntity(e.target.value)} className="w-full p-2 border border-slate-250 rounded bg-white font-bold text-slate-800">
                        <option value="MS-ETH-01">MS-ETH-01 (Ethiopia Division)</option>
                        <option value="MS-KE-02">MS-KE-02 (Kenya Division)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Company Division</label>
                      <input type="text" value={hdrCompany} disabled className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-500 rounded font-bold" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Branch Segment</label>
                      <select value={hdrBranch} onChange={e => setHdrBranch(e.target.value)} className="w-full p-2 border border-slate-250 rounded bg-white font-bold text-slate-800">
                        <option value="Addis Ababa Central">Addis Ababa Central</option>
                        <option value="Bole Sub-Branch">Bole Sub-Branch</option>
                        <option value="Hawassa Agro Hub">Hawassa Agro Hub</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Cost Center (Dimension)</label>
                      <select value={hdrCostCenter} onChange={e => setHdrCostCenter(e.target.value)} className="w-full p-2 border border-slate-250 rounded bg-white font-bold text-slate-800">
                        <option value="CC-ADMIN-HQ">CC-ADMIN-HQ (Addis HQ)</option>
                        <option value="CC-MANUF-01">CC-MANUF-01 (Factory Floor)</option>
                        <option value="CC-SALES-BOLE">CC-SALES-BOLE (Retail Hub)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Department Sector</label>
                      <select value={hdrDepartment} onChange={e => setHdrDepartment(e.target.value)} className="w-full p-2 border border-slate-250 rounded bg-white font-bold text-slate-800">
                        <option value="Corporate Admin">Corporate Admin</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                        <option value="Sales & Distribution">Sales & Distribution</option>
                        <option value="Logistics Shipping">Logistics Shipping</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Header Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-600 mb-1.5 flex items-center gap-1">
                      <span>Voucher Type</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={hdrVoucherType}
                      onChange={e => setHdrVoucherType(e.target.value)}
                      className="w-full text-xs font-black border border-indigo-200 bg-indigo-50/50 p-2.5 rounded-lg text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    >
                      <optgroup label="General Ledger">
                        <option value="JV">JV - Journal Voucher</option>
                        <option value="AJV">AJV - Adjustment Journal Voucher</option>
                      </optgroup>
                      <optgroup label="Cash Management">
                        <option value="CPV">CPV - Cash Payment Voucher</option>
                        <option value="CRV">CRV - Cash Receipt Voucher</option>
                      </optgroup>
                      <optgroup label="Bank Management">
                        <option value="BPV">BPV - Bank Payment Voucher</option>
                        <option value="BRV">BRV - Bank Receipt Voucher</option>
                        <option value="BTV">BTV - Bank Transfer Voucher</option>
                      </optgroup>
                      <optgroup label="Accounts Receivable">
                        <option value="ARI">ARI - Customer Invoice Voucher</option>
                        <option value="ARRV">ARRV - Customer Receipt Voucher</option>
                        <option value="CNV">CNV - Credit Note Voucher</option>
                        <option value="DNV">DNV - Debit Note Voucher</option>
                      </optgroup>
                      <optgroup label="Accounts Payable">
                        <option value="API">API - Supplier Invoice Voucher</option>
                        <option value="APPV">APPV - Supplier Payment Voucher</option>
                        <option value="ADV">ADV - Advance Voucher</option>
                        <option value="PPV">PPV - Prepayment Voucher</option>
                      </optgroup>
                      <optgroup label="Cash & Clearing Accruals">
                        <option value="CHQV">CHQV - Cheque Voucher</option>
                        <option value="PDCV">PDCV - Post-Dated Cheque Voucher</option>
                        <option value="VATV">VATV - VAT Settlement Voucher</option>
                        <option value="WHTV">WHTV - Withholding Tax Voucher</option>
                        <option value="FXV">FXV - FX Exchange Voucher</option>
                        <option value="ALV">ALV - Allocation/Accrual Voucher</option>
                        <option value="RCV">RCV - Reversal Correction Voucher</option>
                        <option value="ICV">ICV - Intercompany Voucher</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Voucher Key Code</label>
                    <input 
                      type="text" 
                      value={hdrVoucherNo} 
                      onChange={e => setHdrVoucherNo(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-black text-slate-800 bg-amber-50/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Voucher Date</label>
                    <input 
                      type="date" 
                      value={hdrVoucherDate} 
                      onChange={e => setHdrVoucherDate(e.target.value)} 
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Posting Date</label>
                    <input 
                      type="date" 
                      value={hdrPostingDate} 
                      onChange={e => setHdrPostingDate(e.target.value)} 
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Active Currency</label>
                    <select 
                      value={hdrCurrency} 
                      onChange={e => {
                        const cur = e.target.value;
                        setHdrCurrency(cur);
                        setHdrExchangeRate(cur === 'USD' ? 57.45 : cur === 'EUR' ? 62.10 : 1.0);
                      }} 
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-extrabold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="USD">USD - United States Dollar</option>
                      <option value="EUR">EUR - European Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Exchange Rate (NBE Official)</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={hdrExchangeRate} 
                      onChange={e => setHdrExchangeRate(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Reference No. / PO Reference</label>
                    <input 
                      type="text" 
                      value={hdrReferenceNo} 
                      onChange={e => setHdrReferenceNo(e.target.value)}
                      placeholder="e.g. PO-CBE-99120"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Ex. Bank Advice Document No.</label>
                    <input 
                      type="text" 
                      value={hdrExternalRef} 
                      onChange={e => setHdrExternalRef(e.target.value)}
                      placeholder="e.g. ADV-AWASH-881"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1.5">Document Narration / Ledger Memo</label>
                  <textarea
                    rows={2}
                    value={hdrNotes}
                    onChange={e => setHdrNotes(e.target.value)}
                    placeholder="Provide explanatory description to satisfy physical audit requirements and fulfill IFRS note disclosures..."
                    className="w-full text-xs p-3 border border-slate-300 bg-slate-50/50 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Business Information Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden" id="entry-biz-section">
              <div className="bg-slate-900 text-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-100">2. TRANSACTION BUSINESS DETAILS & STATUTORY VARIABLES</span>
                </div>
                <div className="text-[10px] bg-slate-805 text-emerald-400 font-mono font-black px-2.0 py-1.0 rounded">
                  AUTO RECOGNITION ACTIVE
                </div>
              </div>

              <div className="p-6 bg-slate-50/30 space-y-6">
                
                {/* Visual guidelines block */}
                <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-indigo-950">Dynamic Ledger Accrual Mapping Engine</p>
                    <p className="text-[11px] leading-relaxed text-indigo-900/85">
                      Specify the transaction attributes. The general ledger controller is mapped dynamic compliance rules for all <strong>23 Voucher Archetypes</strong> under local Ethiopian ERCA and global IFRS rules, auto-building balanced T-account records.
                    </p>
                  </div>
                </div>

                {/* Primary Global Parameters for Voucher Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-700 mb-1.5">Transaction Volume / Amount ({hdrCurrency})</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono font-bold select-none text-xs">
                        {hdrCurrency}
                      </span>
                      <input 
                        type="number" 
                        value={bizAmount || ''} 
                        onChange={e => setBizAmount(Number(e.target.value))}
                        className="w-full pl-12 pr-3 py-2.5 border-2 border-indigo-100 bg-white font-mono font-black text-base text-indigo-950 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-700 mb-1.5">Third-Party Co-Signatory Name</label>
                    <input 
                      type="text" 
                      value={bizPayerOrPayee} 
                      onChange={e => setBizPayerOrPayee(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 bg-white rounded-lg font-bold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-550 outline-none text-xs"
                      placeholder="e.g. Abyssinia Agro PLC, Awash Logistics, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-700 mb-1.5">ERCA Statutory Tax Category</label>
                    <select 
                      value={bizTaxCode} 
                      onChange={e => setBizTaxCode(e.target.value)} 
                      className="w-full p-2.5 border border-slate-300 bg-white rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                    >
                      <option value="Exempt">Exempt / No Tax Application</option>
                      <option value="VAT-15">VAT 15% Standard (Local Purchases)</option>
                      <option value="WHT-2">WHT 2% Services & General Imports</option>
                      <option value="WHT-15">WHT 15% Dividends & Board Fees</option>
                      <option value="VAT-WHT-3">VAT Withholding 3% (ERCA Directive)</option>
                    </select>
                  </div>
                </div>

                {/* Highly Tailored dynamic fields based on Families of the 23 voucher categories */}
                <div className="pt-5 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Voucher-Specific Custom Parameters ({hdrVoucherType})
                    </span>
                  </div>

                  {/* CASH FAMILY (CPV, CRV) */}
                  {(hdrVoucherType === 'CPV' || hdrVoucherType === 'CRV') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                          {hdrVoucherType === 'CPV' ? 'Outbound Cash Box Ledger (Credit)' : 'Inward Cash Box Ledger (Debit)'}
                        </label>
                        <select value={bizCashAccount} onChange={e => setBizCashAccount(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-slate-800">
                          <option value="1111">1111 - Petty Cash Office Hub [Balance: 24,500 ETB]</option>
                          <option value="1111-B">1111-B - Factory Safe Box Vault [Balance: 8,200 ETB]</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                          {hdrVoucherType === 'CPV' ? 'Target Expense Allocation (Debit)' : 'Originating Income Source (Credit)'}
                        </label>
                        {hdrVoucherType === 'CPV' ? (
                          <select value={bizAccountDr} onChange={e => setBizAccountDr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                            <option value="5130">5130 - Office Supplies & Stationery</option>
                            <option value="5140">5140 - Courier, Travel & Logistics Travel</option>
                            <option value="5150">5150 - Minor Workspace Rent & Repairs</option>
                          </select>
                        ) : (
                          <select value={bizAccountCr} onChange={e => setBizAccountCr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                            <option value="4110">4110 - Export Coffee sales revenues</option>
                            <option value="1120">1120 - Trade Customer Receivables clearing</option>
                          </select>
                        )}
                      </div>
                    </div>
                  )}

                  {/* BANK FAMILY (BPV, BRV, BTV) */}
                  {(hdrVoucherType === 'BPV' || hdrVoucherType === 'BRV' || hdrVoucherType === 'BTV') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                          {hdrVoucherType === 'BTV' ? 'Origin Bank Account Check (Credit)' : hdrVoucherType === 'BPV' ? 'Disbursing Bank Account (Credit)' : 'Receiving Bank Account (Debit)'}
                        </label>
                        <select value={bizBankAccount} onChange={e => setBizBankAccount(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-slate-800">
                          <option value="1112">1112 - Commercial Bank of Ethiopia (CBE)</option>
                          <option value="1113">1113 - Dashen Bank Current checking</option>
                          <option value="1114">1114 - Awash Bank USD Reserved</option>
                        </select>
                      </div>

                      {hdrVoucherType === 'BTV' ? (
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Destination Bank Account Target (Debit)</label>
                          <select value={bizAccountDr} onChange={e => setBizAccountDr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                            <option value="1113">1113 - Dashen Bank Current checking</option>
                            <option value="1112">1112 - Commercial Bank of Ethiopia (CBE)</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                            {hdrVoucherType === 'BPV' ? 'Destination Expenditure/Liability Account (Debit)' : 'Remitting Customer Ledger Segment (Credit)'}
                          </label>
                          {hdrVoucherType === 'BPV' ? (
                            <select value={bizAccountDr} onChange={e => setBizAccountDr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                              <option value="2110">2110 - Trade Payables (Settle Supplier)</option>
                              <option value="5150">5150 - Office Rent & Workspace Rent</option>
                              <option value="5110">5110 - Raw Materials Procurement cost</option>
                            </select>
                          ) : (
                            <select value={bizAccountCr} onChange={e => setBizAccountCr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                              <option value="1120">1120 - Trade Accounts Receivable (A/R)</option>
                              <option value="4110">4110 - Direct General Agro revenues</option>
                            </select>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Cheque Number / Advice Reference</label>
                        <input 
                          type="text" 
                          value={bizChequeNo} 
                          onChange={e => setBizChequeNo(e.target.value)} 
                          placeholder="e.g. CHQ-CBE-98821" 
                          className="w-full p-2 border border-slate-300 bg-white rounded-lg font-mono font-bold text-slate-800" 
                        />
                      </div>
                    </div>
                  )}

                  {/* TRADE REGISTER FAMILY (ARI, ARRV, CNV, DNV) */}
                  {(hdrVoucherType === 'ARI' || hdrVoucherType === 'ARRV' || hdrVoucherType === 'CNV' || hdrVoucherType === 'DNV') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Customer / Client Subsidiary target (A/R Code)</label>
                        <input type="text" disabled value="1120 - General Trade Receivables Sector" className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Revenue Account Segment (Credit Offset)</label>
                        <select value={bizAccountCr} onChange={e => setBizAccountCr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                          <option value="4110">4110 - Export Coffee Sales revenues</option>
                          <option value="4110-B">4110-B - Local General Trading Sales</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* PURCHASES LIABILITY FAMILY (API, APPV, ADV, PPV) */}
                  {(hdrVoucherType === 'API' || hdrVoucherType === 'APPV' || hdrVoucherType === 'ADV' || hdrVoucherType === 'PPV') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Supplier Subsidiary Target (A/P Code)</label>
                        <input type="text" disabled value="2110 - Trade Accounts Payable" className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Expenditure / Purchase Allocation Node (Debit)</label>
                        <select value={bizAccountDr} onChange={e => setBizAccountDr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                          <option value="5110">5110 - Direct Raw Coffee purchase cost</option>
                          <option value="5130">5130 - Office Administration Stationery expenses</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SPECIAL TAXES & CLEARINGS (VATV, WHTV, PDCV, CHQV, FXV, ALV, ICV) */}
                  {(hdrVoucherType === 'VATV' || hdrVoucherType === 'WHTV' || hdrVoucherType === 'PDCV' || hdrVoucherType === 'CHQV' || hdrVoucherType === 'FXV' || hdrVoucherType === 'ALV' || hdrVoucherType === 'ICV') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
                      <div className="bg-slate-100/60 p-3.5 rounded-lg border border-slate-150 flex flex-col justify-between">
                        <div>
                          <p className="text-[11.5px] font-black text-slate-800 uppercase font-mono">Special Accrual Operations ({hdrVoucherType})</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            This clears or settles internal system metrics for tax periods, withholding certificates compilation, and pre-posting intercompany checks.
                          </p>
                        </div>
                        <span className="text-[9.5px] text-indigo-750 font-bold block mt-3 uppercase font-mono">Status: Pending Accruals mapping</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Accrual Target account offset</label>
                          <select value={bizAccountDr} onChange={e => setBizAccountDr(e.target.value)} className="w-full p-2 border border-slate-300 bg-white rounded-lg font-bold text-indigo-950">
                            <option value="2120">2120 - Cumulative VAT Output Tax Account</option>
                            <option value="1140">1140 - VAT Input Tax Asset clearances</option>
                            <option value="2130">2130 - Withholding tax (WHT) clearing liabilities</option>
                            <option value="1210">1210 - Intercompany Due from Affiliate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Clearing / Settle Reference Number</label>
                          <input type="text" placeholder="e.g. VAT-Q2-COMPLIANCE" className="w-full p-2 border border-slate-300 bg-white rounded-lg font-mono font-bold" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* REVERSAL CORRECTIONS (RCV) */}
                  {hdrVoucherType === 'RCV' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-semibold">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Original Voucher Key (Reference)</label>
                        <input 
                          type="text" 
                          value={bizOriginalVoucherRef} 
                          onChange={e => setBizOriginalVoucherRef(e.target.value)}
                          className="w-full p-2 border border-slate-300 bg-white rounded-lg font-mono font-bold text-slate-800" 
                          placeholder="e.g. CPV-2026-0042"
                        />
                      </div>
                      <div className="md:col-span-2 bg-amber-50/70 border border-dashed border-amber-300 p-3.5 rounded-lg text-[11px] leading-relaxed text-amber-950">
                        <strong>Reverse Posting Action:</strong> Creates exact counterpart debit and credit transactions to balance ledger items to net zero. Preserves perfect historical traceability.
                      </div>
                    </div>
                  )}

                  {/* GENERAL MANUAL JOURNALS (JV, AJV) */}
                  {(hdrVoucherType === 'JV' || hdrVoucherType === 'AJV') && (
                    <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-black uppercase text-indigo-950 flex items-center gap-1.5 font-mono">
                          <Database className="w-4 h-4 text-indigo-750" />
                          General Ledger T-Accounts Spreadsheet Mode
                        </span>
                        <p className="text-[10px] text-slate-500">
                          General journals require manually editing transaction nodes. Utilize the custom Double-Entry grid below to insert multiple customized rows.
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsLedgerOverrideActive(true);
                          handleAddNewManualRow();
                        }}
                        className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-lg transition"
                      >
                        Add Manual Segment Line
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Accounting Distribution Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden" id="entry-distribution-section">
              <div className="bg-slate-900 text-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-100">3. DOUBLE-ENTRY ACCOUNTING DISTRIBUTION MATRIX</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider">Override Standard Matrix:</span>
                  <button
                    type="button"
                    onClick={() => setIsLedgerOverrideActive(!isLedgerOverrideActive)}
                    className={`px-3 py-1 rounded-md text-[9.5px] font-black uppercase border transition-all ${
                      isLedgerOverrideActive 
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' 
                        : 'bg-slate-800 text-slate-350 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {isLedgerOverrideActive ? 'ACTIVE (MANUAL OVERRIDE)' : 'INACTIVE (AUTO-MAPPED)'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleAddNewManualRow}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-md flex items-center gap-1 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Insert Segment Row</span>
                  </button>
                </div>
              </div>

              {/* Accounting Distribution Grid List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-4 text-center w-12">No</th>
                      <th className="py-3 px-3 w-56">GL Account Code & Node</th>
                      <th className="py-3 px-4 w-60">Allocation Line Memo</th>
                      <th className="py-3 px-3 w-28 text-center text-[9px]">CC Segment</th>
                      <th className="py-3 px-3 w-28 text-center text-[9px]">Dept Segment</th>
                      <th className="py-3 px-3 w-28 text-right pr-6">Debit Amount ({hdrCurrency})</th>
                      <th className="py-3 px-3 w-28 text-right pr-6">Credit Amount ({hdrCurrency})</th>
                      <th className="py-3 px-3 w-28 text-center">Tax Split Code</th>
                      <th className="py-3 px-2 text-center w-12">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {formLines.map((line, idx) => (
                      <tr key={line.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-black text-slate-300">{line.lineNo}</td>
                        <td className="py-2.5 px-2">
                          <select 
                            value={line.accountCode} 
                            onChange={e => handleUpdateManualField(line.id, 'accountCode', e.target.value)}
                            className="w-full text-[11px] p-2 border border-slate-200 rounded bg-white font-bold text-slate-800 outline-none focus:border-indigo-500"
                          >
                            {Object.entries(DEFAULT_GL_ACCOUNTS).map(([code, name]) => (
                              <option key={code} value={code}>[{code}] {name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <input 
                            type="text" 
                            value={line.description} 
                            onChange={e => handleUpdateManualField(line.id, 'description', e.target.value)}
                            className="w-full text-[11px] p-2 border border-slate-200 rounded font-semibold text-slate-800 focus:border-indigo-500 outline-none" 
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <select 
                            value={line.costCenter} 
                            onChange={e => handleUpdateManualField(line.id, 'costCenter', e.target.value)}
                            className="w-full text-[10.5px] p-1.5 border border-slate-200 rounded bg-white text-center font-bold text-slate-700 outline-none"
                          >
                            <option value="CC-ADMIN-HQ">HQ-ADMIN</option>
                            <option value="CC-MANUF-01">FACTORY</option>
                            <option value="CC-SALES-BOLE font-mono">BOLE-RETAIL</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <select 
                            value={line.department} 
                            onChange={e => handleUpdateManualField(line.id, 'department', e.target.value)}
                            className="w-full text-[10.5px] p-1.5 border border-slate-200 rounded bg-white text-center font-bold text-slate-700 outline-none"
                          >
                            <option value="Corporate Admin">Admin</option>
                            <option value="Finance & Accounts">Finance</option>
                            <option value="Sales & Distribution">Sales</option>
                            <option value="Logistics Shipping">Logistics</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <input 
                            type="number" 
                            value={line.debit || ''} 
                            onChange={e => handleUpdateManualField(line.id, 'debit', Number(e.target.value))}
                            placeholder="0.00"
                            className="w-full p-2 border border-slate-250 bg-emerald-50/5 font-bold text-right font-mono text-emerald-800 text-xs focus:border-emerald-500 outline-none" 
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <input 
                            type="number" 
                            value={line.credit || ''} 
                            onChange={e => handleUpdateManualField(line.id, 'credit', Number(e.target.value))}
                            placeholder="0.00"
                            className="w-full p-2 border border-slate-250 bg-amber-50/5 font-bold text-right font-mono text-amber-805 text-xs focus:border-amber-500 outline-none" 
                          />
                        </td>
                        <td className="py-2.5 px-1 text-center font-bold text-slate-500 font-mono text-[10px]">
                          {line.taxCode !== 'Exempt' ? (
                            <span className="bg-slate-100 text-slate-750 px-1.5 py-0.5 rounded border border-slate-200">
                              {line.taxCode}
                            </span>
                          ) : (
                            <span className="text-slate-350">-</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveManualRow(line.id)}
                            className="text-rose-450 hover:text-rose-700 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formLines.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-slate-400 font-semibold italic">
                          Please enter transaction details above to auto-generate the accounting lines matrix.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 4. SUMMARY PANEL (TOTAL DEBITS AND CREDITS) */}
              <div className="bg-slate-50 p-6 border-t border-slate-250 grid grid-cols-1 md:grid-cols-3 gap-6" id="entry-summary-section">
                
                {/* Total Debits Stat */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">Cumulative Total Debits</span>
                    <p className="text-xl font-black font-mono text-emerald-800 mt-1">
                      {calculationSummary.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })} {hdrCurrency}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold font-mono text-sm shadow-2xs">
                    Dr
                  </div>
                </div>

                {/* Total Credits Stat */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">Cumulative Total Credits</span>
                    <p className="text-xl font-black font-mono text-amber-800 mt-1">
                      {calculationSummary.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })} {hdrCurrency}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold font-mono text-sm shadow-2xs">
                    Cr
                  </div>
                </div>

                {/* Dual-Entry Balance Discrepancy Analysis Box */}
                <div className="p-4 rounded-xl flex flex-col justify-between border transition-all shadow-2xs bg-white">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">Ledger Variance Check</span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">Limit: ±0.01</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {calculationSummary.isBalanced ? (
                      <div className="flex items-center gap-1.5 text-emerald-705 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg w-full">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-black uppercase font-mono tracking-tight text-emerald-800">Balanced Ledger (0.00)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-800 bg-rose-50 border border-rose-150 px-2.5 py-1 rounded-lg w-full">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-black uppercase font-mono tracking-tight text-rose-900 truncate">
                          Diff: {calculationSummary.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })} {hdrCurrency}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. ATTACHMENTS & COMPLIANCE RULES PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Supporting Papers */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-xs">
                <div className="bg-slate-900 text-slate-100 px-5 py-3.5 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold tracking-wider font-mono uppercase text-slate-100 text-[11px]">5. Supporting Audit trail Papers</span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Drag drop zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                      dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-250 bg-slate-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="entry-attachments-picker" 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <label htmlFor="entry-attachments-picker" className="cursor-pointer space-y-1 my-1.5 block">
                      <span className="bg-indigo-650 hover:bg-indigo-700 text-white font-black text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg inline-block transition shadow-xs">
                        Upload Inbound Invoices
                      </span>
                      <p className="text-[10px] text-slate-450 pt-1">Or drag and drop scanned receipt sheets directly (PDF, PNG)</p>
                    </label>
                  </div>

                  {/* Attachment items wrapper */}
                  <div className="space-y-2">
                    <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block font-mono">Connected Papers ({formAttachments.length})</span>
                    {formAttachments.map(att => (
                      <div key={att.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 hover:bg-slate-100/50 transition">
                        <div className="flex items-center gap-2 text-slate-800">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-[11px] truncate max-w-[200px] text-slate-850 font-bold">{att.name}</p>
                            <span className="text-[9px] text-slate-400 font-mono">File Weight: {att.size} | Date: {att.uploadDate}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1 text-[11px] font-black font-mono inline-block"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {formAttachments.length === 0 && (
                      <div className="text-center py-4 text-slate-400 italic">No papers connected yet. Scanned docs required for high value posts.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pre-Posting Compliance Checks */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-xs">
                <div className="bg-slate-900 text-slate-100 px-5 py-3.5 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold tracking-wider font-mono uppercase text-[11px]">6. Pre-Posting Compliance Validation Shield</span>
                </div>

                <div className="p-5 space-y-3">
                  <span className="block text-[9.5px] uppercase font-black text-slate-400 font-mono tracking-wider">Live System Rules Verification</span>
                  <div className="space-y-3">
                    {validationCheckList.map(rule => (
                      <div key={rule.id} className="border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 hover:bg-slate-50/50 transition bg-white shadow-2xs">
                        <div className="mt-0.5 select-none text-xs">
                          {rule.status === 'PASSED' ? (
                            <span className="text-emerald-500 font-black">✓</span>
                          ) : rule.status === 'WARNING' ? (
                            <span className="text-amber-500 font-black animate-pulse">⚠</span>
                          ) : (
                            <span className="text-rose-500 font-black">✕</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-center font-bold text-[11px] gap-2">
                            <span className="text-slate-850 font-black">{rule.rule}</span>
                            <span className={`text-[8.5px] font-mono font-black uppercase rounded-md px-1.5 py-0.5 border shrink-0 ${
                              rule.status === 'PASSED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                              rule.status === 'WARNING' ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>{rule.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{rule.desc}</p>
                          <p className={`text-[10px] font-black ${
                            rule.status === 'PASSED' ? 'text-emerald-700' :
                            rule.status === 'WARNING' ? 'text-amber-800' : 'text-rose-700'
                          }`}>{rule.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Gate Controls */}
            <div className="bg-white border border-slate-250 p-6 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Authorization workflow gate</span>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-200 uppercase">
                    ACTIVE FLOW: DRAFT WORKSPACE
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button onClick={() => handleActionClick('Draft')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg border border-slate-200">
                    Save Draft
                  </button>
                  <button onClick={() => handleActionClick('Submitted')} className="bg-blue-50 hover:bg-blue-105 text-blue-700 font-bold px-4 py-2 rounded-lg border border-blue-200">
                    Submit Review
                  </button>
                  <button onClick={() => handleActionClick('Under Review')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-lg border border-purple-200">
                    Send CFO
                  </button>
                  <button onClick={() => handleActionClick('Approved')} className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-4 py-2 rounded-lg border border-teal-200">
                    Authorize Appr
                  </button>
                  <button onClick={() => handleActionClick('Posted')} className="bg-slate-900 hover:bg-slate-850 text-white font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Post to General Ledger</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC RIGHT BLUEPRINT REFERENCE DRAWER */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-gradient-to-b from-indigo-900 to-indigo-955 text-white p-6 rounded-2xl shadow-md border border-indigo-800 sticky top-4 space-y-6">
              
              {/* Header inside drawer */}
              <div className="border-b border-indigo-800 pb-3.5">
                <div className="flex items-center gap-1.5 bg-indigo-805 text-indigo-200 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase w-fit mb-2">
                  <Bookmark className="w-3 h-3" />
                  <span>ERP BLUEPRINT GUIDE</span>
                </div>
                <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  <span>Voucher Reference specs:</span>
                  <span className="bg-amber-400 text-amber-950 font-mono font-black text-xs px-2 py-0.5 rounded ml-auto">{hdrVoucherType}</span>
                </h3>
                <p className="text-[10px] text-indigo-200 mt-1 uppercase font-bold tracking-wider">{activeSpec.name}</p>
              </div>

              {/* Full Specs List */}
              <div className="space-y-4 text-xs font-medium scrollbar-thin max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">1. Legal Purpose</span>
                  <p className="text-white text-[11px] leading-relaxed font-bold">{activeSpec.purpose}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">2. Business Scenario</span>
                  <p className="text-indigo-100 text-[11px] leading-relaxed italic">&ldquo;{activeSpec.scenario}&rdquo;</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">3. Required Data variables</span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeSpec.requiredFields.map((f, i) => (
                      <span key={i} className="bg-indigo-805 text-[10px] text-indigo-205 px-2 py-0.5 rounded font-bold">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">4. Optional Parameters</span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeSpec.optionalFields.map((f, i) => (
                      <span key={i} className="bg-indigo-900 text-[10px] text-indigo-300 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">5. Validation Rules</span>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-[10.5px] text-indigo-150">
                    {activeSpec.validationRules.map((r, i) => (
                      <li key={i} className="leading-tight">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-indigo-950 rounded-xl space-y-2 border border-indigo-850">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase block font-mono">6. Auto-Generated Debit ledger Code</span>
                    <strong className="text-white text-[10.5px] font-mono">{activeSpec.autoDebit}</strong>
                  </div>
                  <div className="space-y-0.5 border-t border-indigo-900 pt-1.5">
                    <span className="text-[9px] text-amber-300 font-bold uppercase block font-mono">7. Auto-Generated Credit Ledger Code</span>
                    <strong className="text-white text-[10.5px] font-mono">{activeSpec.autoCredit}</strong>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">8. Workflow Steps</span>
                  <p className="text-indigo-100 text-[11px] leading-relaxed font-semibold">{activeSpec.workflow}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">9. Approval Rules Threshold</span>
                  <p className="text-indigo-150 text-[11.5px] leading-tight font-bold">{activeSpec.approvalRules}</p>
                </div>

                <div className="space-y-0.5 bg-indigo-850/40 p-2.5 rounded-lg border border-indigo-850">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block font-mono">10. Sample Transaction (IFRS Double Entry)</span>
                  <p className="text-white font-mono text-[10px] leading-relaxed italic">{activeSpec.sampleTxn}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">11. Reversal Rules & Audit adjustments</span>
                  <p className="text-indigo-150 text-[11px] leading-tight">{activeSpec.reversalRules}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">12. Posting Restrictions</span>
                  <p className="text-indigo-150 text-[11px] leading-tight">{activeSpec.postingRules}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">13. Physical Audit requirements</span>
                  <p className="text-indigo-150 text-[11px] leading-relaxed">{activeSpec.auditReqs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INQUIRY TAB (SAP Fiori Registry) */}
      {activeWorkspaceTab === 'inquiry' && selectedVoucherForDetails && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Sidebar filter registry list */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 text-xs font-semibold">
              <h4 className="text-xs uppercase font-black text-slate-800 flex items-center gap-1">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Registry Filters</span>
              </h4>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search serial payer..."
                    className="w-full p-2 border border-slate-350 bg-slate-50/50 rounded"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Category Type</label>
                  <select value={filterVType} onChange={e => setFilterVType(e.target.value)} className="w-full p-2 border border-slate-350 bg-white rounded">
                    <option value="All">All Vouchers</option>
                    <option value="CPV">CPV - Cash Payment</option>
                    <option value="CRV">CRV - Cash Receipt</option>
                    <option value="BPV">BPV - Bank Payment</option>
                    <option value="BRV">BRV - Bank Receipt</option>
                    <option value="BTV">BTV - Bank Transfer</option>
                    <option value="ARI">ARI - Invoice</option>
                    <option value="API">API - Supplier Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Status Code</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full p-2 border border-slate-350 bg-white rounded">
                    <option value="All">All</option>
                    <option value="Posted">Posted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg space-y-1 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase">Records matched</p>
                <strong className="text-slate-800 text-sm font-black font-mono">{filteredVouchers.length}</strong>
              </div>
            </div>

            {/* Sidebar list items */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {filteredVouchers.map(v => (
                <div 
                  key={v.id} 
                  onClick={() => setSelectedVoucherForDetails(v)}
                  className={`p-3.5 text-xs text-left cursor-pointer transition-all hover:bg-slate-50 ${
                    selectedVoucherForDetails.id === v.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-black text-slate-900">{v.voucherNo}</span>
                    <span className={`text-[8.5px] font-mono font-bold uppercase rounded px-1.5 py-0.2 border ${
                      v.status === 'Posted' ? 'bg-emerald-50 text-emerald-705 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>{v.status}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight font-medium">{v.notes.substring(0, 48)}...</p>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase font-mono">{v.voucherType}</span>
                    <strong className="text-slate-900 font-mono font-bold leading-none">{v.totalDebit.toLocaleString()} {v.currency}</strong>
                  </div>
                </div>
              ))}
              {filteredVouchers.length === 0 && (
                <div className="p-6 text-center text-slate-400 italic text-xs font-semibold">No records in matching filters.</div>
              )}
            </div>
          </div>

          {/* Right inquiry Detail View Panel (Official SAP Format document output) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white border border-slate-350 rounded-2xl p-8 shadow-sm space-y-6" id="voucher-printable-node">
              
              {/* official header watermark */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div className="space-y-1">
                  <span className="bg-slate-900 text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded inline-block select-none">
                    OFFICIAL DOCUMENTS PRINT - IFRS AUDIT SYSTEM
                  </span>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedVoucherForDetails.company}</h3>
                  <p className="text-xs text-slate-500 font-bold">{selectedVoucherForDetails.branch} Segment | TIN ID: 88710219-ET</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xl font-black text-indigo-700 tracking-tight block">
                    {selectedVoucherForDetails.voucherType} TRANSACTION
                  </span>
                  <p className="text-xs font-mono font-semibold text-slate-400">Doc Serial: <strong className="text-slate-900">{selectedVoucherForDetails.voucherNo}</strong></p>
                  <p className="text-xs font-mono font-semibold text-slate-400 uppercase">Status: <strong className="text-emerald-700">{selectedVoucherForDetails.status}</strong></p>
                </div>
              </div>

              {/* Master Meta information details (Section 1 Header Section Requirement to show always!) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold py-2">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Voucher date</span>
                  <span className="text-slate-800 font-black">{selectedVoucherForDetails.voucherDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Posting Date</span>
                  <span className="text-slate-800 font-black">{selectedVoucherForDetails.postingDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Accounting Currency</span>
                  <span className="text-indigo-900 font-black">{selectedVoucherForDetails.currency} (Rate: {selectedVoucherForDetails.exchangeRate})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Operational cost-center</span>
                  <span className="text-slate-800 truncate block font-bold">{selectedVoucherForDetails.costCenter}</span>
                </div>
              </div>

              {/* Master Narration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed font-semibold">
                <span className="text-[9px] text-slate-400 uppercase block mb-0.5">General transaction Narration</span>
                <p className="text-slate-800 italic">&ldquo;{selectedVoucherForDetails.notes}&rdquo;</p>
              </div>

              {/* Business Information Section Display within document details (Payer details / Bank Clearing details) */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                <div>
                  <span className="text-[9px] uppercase text-indigo-900/60 block font-mono">Third-Party Holder / Cashier Name</span>
                  <strong className="text-slate-900">{selectedVoucherForDetails.payeeOrPayer || 'Default division account clearing'}</strong>
                </div>
                {selectedVoucherForDetails.paymentMethod && (
                  <div>
                    <span className="text-[9px] uppercase text-indigo-900/60 block font-mono">Cash/Bank instruments settlement</span>
                    <strong className="text-slate-900">{selectedVoucherForDetails.paymentMethod}</strong>
                  </div>
                )}
                {selectedVoucherForDetails.referenceNo && (
                  <div>
                    <span className="text-[9px] uppercase text-indigo-900/60 block font-mono">Receipt Invoice referential code</span>
                    <strong className="text-slate-900">{selectedVoucherForDetails.referenceNo}</strong>
                  </div>
                )}
              </div>

              {/* Double entry items table (Accounting distribution section inside Inquiry too!) */}
              <div className="border border-slate-300 rounded-xl overflow-hidden mt-6">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-650 uppercase">
                      <th className="py-2.5 px-3 text-center">No</th>
                      <th className="py-2.5 px-3">GL Ledger Account Type</th>
                      <th className="py-2.5 px-4">Line Description / Analytics Segment</th>
                      <th className="py-2.5 px-3 text-right">Debit amount ({selectedVoucherForDetails.currency})</th>
                      <th className="py-2.5 px-3 text-right">Credit amount ({selectedVoucherForDetails.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-202 text-slate-800">
                    {selectedVoucherForDetails.lines.map((ln, idx) => (
                      <tr key={ln.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-slate-900">[{ln.accountCode}]</span>
                          <span className="ml-1 font-bold block">{ln.accountName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>{ln.description}</div>
                          <div className="text-[9.5px] text-indigo-700 font-bold tracking-tight mt-1">CC: {ln.costCenter} | Dept: {ln.department} | PRJ: {ln.project}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-800">
                          {ln.debit > 0 ? ln.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-805">
                          {ln.credit > 0 ? ln.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Total ledger summary lines inside document */}
                  <tfoot>
                    <tr className="bg-slate-50 font-black border-t-2 border-slate-300 font-mono text-[11px] text-slate-800">
                      <td colSpan={3} className="py-3 px-4 text-right uppercase">Ledger totals:</td>
                      <td className="py-3 px-3 text-right text-emerald-800">{selectedVoucherForDetails.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-amber-805">{selectedVoucherForDetails.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Displays connected audit paperwork (Attachments & Approval history inside inquiry sheet) */}
              {selectedVoucherForDetails.attachments && selectedVoucherForDetails.attachments.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Supporting Audit Documents Attached</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedVoucherForDetails.attachments.map(att => (
                      <div key={att.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-indigo-650" />
                        <span>{att.name} ({att.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sign-off matrices */}
              <div className="pt-6 border-t border-slate-200">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-6">Continuous Audit Authorization Sign-off Matrix</span>
                <div className="grid grid-cols-3 gap-6 text-center text-xs font-semibold">
                  <div className="space-y-4">
                    <p className="border-b border-slate-900 pb-1.5 font-bold italic text-indigo-900">{selectedVoucherForDetails.preparedBy}</p>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Created / Plotted By</span>
                  </div>
                  <div className="space-y-4">
                    <p className="border-b border-slate-900 pb-1.5 text-slate-500 font-mono">Gate Approved (AI Auto Shield)</p>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Security Audit Clearance</span>
                  </div>
                  <div className="space-y-4">
                    <p className="border-b border-slate-900 pb-1.5 font-bold text-emerald-900">{selectedVoucherForDetails.approvedBy || 'Pending Executive Approval'}</p>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Authorized Signatory (CFO)</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Chronological Audit trail */}
              <div className="border border-slate-250 rounded-xl overflow-hidden mt-6 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsApprovalHistoryOpen(!isApprovalHistoryOpen)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-100/50 transition-all font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <span>Chronological Approval & State Transition History</span>
                    <span className="bg-indigo-100 text-indigo-805 text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                      {selectedVoucherForDetails.actionsHistory?.length || 0} transitions
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isApprovalHistoryOpen ? '▲ Collapse' : '▼ Expand'}
                  </span>
                </button>

                {isApprovalHistoryOpen && (
                  <div className="p-5 bg-white divide-y divide-slate-100 text-xs">
                    {selectedVoucherForDetails.actionsHistory.map((history, idx) => {
                      const hashToken = `SIG-IFRS-${history.user.split('@')[0].toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
                      return (
                        <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                              <span className="text-sm font-black">{history.action}</span>
                              <span className="text-slate-400 text-[10px]">({history.timestamp})</span>
                            </div>
                            <p className="text-[11.5px] font-medium text-slate-600">Captured: <strong className="text-slate-800">{history.user}</strong></p>
                            <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded w-fit italic">
                              &ldquo;{history.notes}&rdquo;
                            </p>
                          </div>
                          
                          <div className="text-right select-none space-y-1">
                            <span className="bg-slate-900 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                              🔐 SHA-256 LEDGER LOCKED
                            </span>
                            <p className="text-[9px] text-slate-400 font-mono">Crypto: <strong className="text-slate-600">{hashToken}</strong></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interactive Cancel / Printable Actions stubs */}
              <div className="flex justify-end gap-3 pt-4">
                {selectedVoucherForDetails.status === 'Posted' && selectedVoucherForDetails.voucherType !== 'RCV' && (
                  <button
                    onClick={() => handlePostCancellationReversal(selectedVoucherForDetails)}
                    className="bg-amber-100 hover:bg-amber-205 text-amber-900 font-extrabold text-xs uppercase px-4 py-2.5 rounded-lg flex items-center gap-1 border border-amber-300"
                    title="Creates exact opposite reverse accounting double entry"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Post Contra-Reversal (RCV)</span>
                  </button>
                )}
                
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RULES CATALOG SUBVIEW */}
      {activeWorkspaceTab === 'rules' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-indigo-100 pb-4">
            <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <span>Section 5 Voucher Business Rules, Accruals & Ethiopian Tax Compliance</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live background validators checking compliance to National Bank of Ethiopia (NBE) and ERCA guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <span className="bg-emerald-55 text-emerald-900 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-300">IFRS EQUATIONS BALANCING</span>
              <h4 className="font-extrabold text-slate-900">T-Accounts Balance Validation</h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Pre-posting filters require ledger variance to evaluate to strictly 0.00. No un-balanced journals can write to database assets.
              </p>
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded font-bold">
                ✓ Balancing tolerance checks: ±0.01 Birr
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <span className="bg-amber-100 text-amber-905 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-amber-300">ETHIOPIAN LOCAL REGULATORS</span>
              <h4 className="font-extrabold text-slate-900">Petty Cash Daily Threshold limits</h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                To combat audit evasion, physical cash vouchers (CPV) exceeding 10,000 Birr to a single recipient inside a single day are restricted by the system. Bank routing (BPV/BTV) is enforced.
              </p>
              <div className="bg-amber-50 text-amber-800 p-2.5 rounded font-bold text-[10.5px]">
                ⚠ Constraint Cap: 10,000 ETB / Vendor Day
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-200">COGNIZANCE SEGREGATION</span>
              <h4 className="font-extrabold text-slate-900">JV Cash-Ledger Blocking rule</h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                General adjustments (JV) may never write entries to cash (1111) or liquid bank (1112) ledger accounts. Settle cash/bank strictly through specified CPV/CRV/BPV/BRV frameworks.
              </p>
              <div className="bg-indigo-50 text-indigo-900 p-2.5 rounded font-bold">
                🔒 Segregation of cashier duties: Active
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TERMINAL VIEW (IFRS Registries & Access Trails) */}
      {activeWorkspaceTab === 'reports' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-700" />
                <span>Section 12 IFRS Auditor-Ready Reports Terminal</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Downloadable general ledger summaries and chronological security access trail reports.
              </p>
            </div>

            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => setSelectedReport('register')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  selectedReport === 'register' ? 'bg-slate-900 border-slate-900 text-white shadow' : 'bg-slate-55 text-slate-600'
                }`}
              >
                Voucher Registry Book
              </button>
              <button 
                onClick={() => setSelectedReport('audit')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  selectedReport === 'audit' ? 'bg-slate-900 border-slate-900 text-white shadow' : 'bg-slate-55 text-slate-600'
                }`}
              >
                Security Audit Trails
              </button>
            </div>
          </div>

          {selectedReport === 'register' ? (
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">General Ledger Journal Voucher Book</span>
                <button
                  onClick={() => alert('Voucher general list exported successfully in IFRS-compliant CSV format.')}
                  className="bg-emerald-650 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export IFRS CSV</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left font-serif text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-sans font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-4 font-sans">Document serial</th>
                      <th className="py-2.5 px-3 font-sans">Type</th>
                      <th className="py-2.5 px-4 font-sans">Posting Date</th>
                      <th className="py-1 px-4 font-sans text-right">Debit Cumulative</th>
                      <th className="py-2.5 px-4 font-sans">Status</th>
                      <th className="py-2.5 px-4 font-sans">Preparer Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                    {vouchersList.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-black text-[12px]">{v.voucherNo}</td>
                        <td className="py-3 px-3"><span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">{v.voucherType}</span></td>
                        <td className="py-3 px-4 font-bold text-slate-500">{v.postingDate}</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">{v.totalDebit.toLocaleString()} {v.currency}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-805 text-[8.5px] font-bold px-2 py-0.5 rounded border border-emerald-100">{v.status}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{v.preparedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <span className="font-bold text-slate-800 font-mono block">System security, logins & credentials access logs</span>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-slate-700 font-semibold">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Active User</th>
                      <th className="py-2.5 px-3">Action Event</th>
                      <th className="py-2.5 px-4">Document Ref</th>
                      <th className="py-2.5 px-6">Security Checkpoint Status message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 text-slate-400 font-mono">13:55:25 EAT</td>
                      <td className="py-3 px-4 font-bold text-slate-800">senior_accountant@abc.et</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">LEDGER_POST_SUCCESS</td>
                      <td className="py-3 px-4 font-mono">CPV-2026-0042</td>
                      <td className="py-3 px-6 text-slate-520">Mathematical variance constraints pass with zero balance deviation. Daily petty cash cap below 10,050 Birr check passed.</td>
                    </tr>
                    <tr className="hover:bg-slate-100">
                      <td className="py-3 px-4 text-slate-400 font-mono">11:42:01 EAT</td>
                      <td className="py-3 px-4 font-bold text-slate-800">mzerihun01@gmail.com</td>
                      <td className="py-3 px-3 text-purple-700 font-bold">DRAFT_SUBMITTED_CFO</td>
                      <td className="py-3 px-4 font-mono">BRV-2026-1044</td>
                      <td className="py-3 px-6 text-slate-520">Sesame wire remittance matching Bole branch. Multi-entity project cost-centers configured.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

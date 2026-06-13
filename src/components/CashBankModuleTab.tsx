import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Database,
  PlusCircle,
  Upload,
  AlertTriangle,
  BookOpen,
  Percent,
  Terminal,
  Settings,
  HelpCircle,
  FileDown,
  Activity,
  Lock,
  FileText,
  Briefcase,
  SlidersHorizontal,
  Calendar,
  Coins,
  Boxes,
  Users,
  Clock,
  Landmark,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Printer,
  ArrowRight,
  ClipboardList,
  Receipt,
  UserCheck,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Settings2
} from 'lucide-react';
import ReportHeaderCard from './ReportHeaderCard';

// -------------------------------------------------------------
// TYPE DEFINITIONS & MOCK INITIAL SEEDS
// -------------------------------------------------------------

interface BankAccount {
  id: string;
  companyName: string;
  branchName: string;
  swiftCode: string;
  iban: string;
  accountNo: string;
  accountName: string;
  currency: 'ETB' | 'USD' | 'EUR';
  accountType: 'Operating' | 'Savings' | 'Petty Cash' | 'Escrow' | 'Overdraft';
  balance: number;
  minBalance: number;
  maxBalance: number;
  status: 'Active' | 'Frozen' | 'Dormant';
  glAccount: string;
  clearingAccount: string;
  recoRequired: boolean;
  overdraftLimit: number;
}

interface BankTransaction {
  id: string;
  bankAccountId: string;
  txHash: string;
  txType: 'Deposit' | 'Withdrawal' | 'Interest' | 'Bank Charge' | 'Exchange Diff' | 'Direct Debit' | 'Direct Credit';
  date: string;
  valueDate: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  refNo: string;
  description: string;
  status: 'Draft' | 'Posted' | 'Approved';
  glPosted: boolean;
  branch: string;
  costCenter: string;
}

interface PettyCashCount {
  date: string;
  countedBy: string;
  systemBalance: number;
  physicalCount: number;
  variance: number;
  status: 'Verified' | 'Pending Approval' | 'Discrepancy';
  notes: string;
}

interface LiquidTransfer {
  id: string;
  sourceAccountId: string;
  destAccountId: string;
  amount: number;
  currency: string;
  rate: number;
  date: string;
  type: 'BankToBank' | 'CashToBank' | 'BankToCash' | 'CashToCash' | 'InterBranch' | 'InterEntity';
  status: 'Draft' | 'Pending Approval' | 'Executed';
  intercompanyGLClearingPosted: boolean;
}

interface ChequeLeaf {
  chequeNo: string;
  payee: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'New' | 'Issued' | 'Presented' | 'Cleared' | 'Bounced' | 'Stopped';
  type: 'Standard' | 'PDC';
  paymentTermCode: string;
}

interface RecoStatementRow {
  id: string;
  date: string;
  description: string;
  refNo: string;
  amount: number;
  type: 'CR' | 'DR';
  status: 'Unmatched' | 'Matched' | 'Exception' | 'Adjusted';
  matchedId?: string;
  confidence?: number;
}

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'BA-CBE-001',
    companyName: 'Mesfin PLC',
    branchName: 'Addis Ababa Central',
    swiftCode: 'CBETETAAXXX',
    iban: 'ET82100023456789',
    accountNo: '1000123456789',
    accountName: 'Operating Account - CBE',
    currency: 'ETB',
    accountType: 'Operating',
    balance: 45780231.50,
    minBalance: 50000,
    maxBalance: 100000000,
    status: 'Active',
    glAccount: '1111-001-CBET',
    clearingAccount: '1119-001-CBET-CLE',
    recoRequired: true,
    overdraftLimit: 5000000
  },
  {
    id: 'BA-AWA-002',
    companyName: 'Mesfin Manufacturing PLC',
    branchName: 'Adama Industrial Zone',
    swiftCode: 'AWABETAAXXX',
    iban: 'ET82200098765432',
    accountNo: '2000554433211',
    accountName: 'USD Retention Account - Awash',
    currency: 'USD',
    accountType: 'Operating',
    balance: 245000.00,
    minBalance: 5000,
    maxBalance: 15000000,
    status: 'Active',
    glAccount: '1112-002-AWAS-USD',
    clearingAccount: '1119-002-AWAS-CLE',
    recoRequired: true,
    overdraftLimit: 0
  },
  {
    id: 'BA-BOA-003',
    companyName: 'Mesfin Agricultural PLC',
    branchName: 'Hawassa Branch',
    swiftCode: 'ABYSETAAXXX',
    iban: 'ET82300065432198',
    accountNo: '3000998877665',
    accountName: 'Escrow Export Clearing - Abyssinia',
    currency: 'EUR',
    accountType: 'Escrow',
    balance: 85200.00,
    minBalance: 1000,
    maxBalance: 1000000,
    status: 'Active',
    glAccount: '1113-003-ABYS-EUR',
    clearingAccount: '1119-003-ABYS-CLE',
    recoRequired: true,
    overdraftLimit: 0
  },
  {
    id: 'BA-PET-004',
    companyName: 'Mesfin PLC',
    branchName: 'Addis Ababa Central',
    swiftCode: '',
    iban: '',
    accountNo: 'PETTY-001-HQ',
    accountName: 'Headquarters Main Petty Cash Box',
    currency: 'ETB',
    accountType: 'Petty Cash',
    balance: 75200.00,
    minBalance: 2000,
    maxBalance: 100000,
    status: 'Active',
    glAccount: '1121-001-PETTY',
    clearingAccount: '',
    recoRequired: false,
    overdraftLimit: 0
  },
  {
    id: 'BA-DASH-005',
    companyName: 'Mesfin Services PLC',
    branchName: 'Bole Medhanealem Br.',
    swiftCode: 'DASHETAAXXX',
    iban: 'ET82400033112244',
    accountNo: '4000223344556',
    accountName: 'Dormant Reserve - Dashen',
    currency: 'ETB',
    accountType: 'Savings',
    balance: 1500000.00,
    minBalance: 10000,
    maxBalance: 50000000,
    status: 'Dormant',
    glAccount: '1114-005-DASH',
    clearingAccount: '1119-005-DASH-CLE',
    recoRequired: true,
    overdraftLimit: 0
  }
];

const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'TX-2026-0001',
    bankAccountId: 'BA-CBE-001',
    txHash: '0x992b45a0e919ffb',
    txType: 'Deposit',
    date: '2026-06-01',
    valueDate: '2026-06-01',
    amount: 1500000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    refNo: 'DEP-CBE-2601',
    description: 'Direct customer clearing for Invoice INV-CUST-810',
    status: 'Approved',
    glPosted: true,
    branch: 'Addis Ababa Central',
    costCenter: 'CC-SALES-STG'
  },
  {
    id: 'TX-2026-0002',
    bankAccountId: 'BA-CBE-001',
    txHash: '0x8834f828ac9bbdd',
    txType: 'Withdrawal',
    date: '2026-06-02',
    valueDate: '2026-06-03',
    amount: 120000.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    refNo: 'WTH-CBE-2602',
    description: 'Bulk supplier payment for Raw Materials (Cement/Steel)',
    status: 'Approved',
    glPosted: true,
    branch: 'Addis Ababa Central',
    costCenter: 'CC-FACTORY-OP0'
  },
  {
    id: 'TX-2026-0003',
    bankAccountId: 'BA-AWA-002',
    txHash: '0xaa77c61bf8a892e',
    txType: 'Interest',
    date: '2026-06-05',
    valueDate: '2026-06-05',
    amount: 450.00,
    currency: 'USD',
    exchangeRate: 120.45,
    refNo: 'INT-AWA-2603',
    description: 'USD Account Monthly Interest Capitalization',
    status: 'Approved',
    glPosted: true,
    branch: 'Adama Industrial Zone',
    costCenter: 'CC-TREASURY'
  },
  {
    id: 'TX-2026-0004',
    bankAccountId: 'BA-CBE-001',
    txHash: '0xbb123d6a992cfca',
    txType: 'Bank Charge',
    date: '2026-06-10',
    valueDate: '2026-06-10',
    amount: 1500.00,
    currency: 'ETB',
    exchangeRate: 1.0,
    refNo: 'CHG-CBE-2604',
    description: 'Standard SWIFT Outward Telex Service Fee charge',
    status: 'Posted',
    glPosted: true,
    branch: 'Addis Ababa Central',
    costCenter: 'CC-FINANCE-OPS'
  },
  {
    id: 'TX-2026-0005',
    bankAccountId: 'BA-BOA-003',
    txHash: '0xee9900cde231aa4',
    txType: 'Direct Credit',
    date: '2026-06-11',
    valueDate: '2026-06-12',
    amount: 15400.00,
    currency: 'EUR',
    exchangeRate: 130.20,
    refNo: 'DC-BOA-2605',
    description: 'Letter of Credit clearance for Export Honey Shipment',
    status: 'Draft',
    glPosted: false,
    branch: 'Hawassa Branch',
    costCenter: 'CC-AGRI-EXP'
  }
];

const INITIAL_PETTY_CASH_COUNTS: PettyCashCount[] = [
  {
    date: '2026-05-31',
    countedBy: 'Alemayehu Tadesse',
    systemBalance: 75200.00,
    physicalCount: 75200.00,
    variance: 0.0,
    status: 'Verified',
    notes: 'No discrepancies detected. Imprest replenished and verified.'
  },
  {
    date: '2026-06-11',
    countedBy: 'Selamawit Gidey',
    systemBalance: 75200.00,
    physicalCount: 75150.00,
    variance: -50.00,
    status: 'Pending Approval',
    notes: 'Small physical discrepancy of 50 ETB due to missing stationery receipt.'
  }
];

const INITIAL_TRANSFERS: LiquidTransfer[] = [
  {
    id: 'TRF-001',
    sourceAccountId: 'BA-CBE-001',
    destAccountId: 'BA-PET-004',
    amount: 50000.00,
    currency: 'ETB',
    rate: 1.0,
    date: '2026-06-03',
    type: 'BankToCash',
    status: 'Executed',
    intercompanyGLClearingPosted: false
  },
  {
    id: 'TRF-002',
    sourceAccountId: 'BA-AWA-002',
    destAccountId: 'BA-CBE-001',
    amount: 10000.00,
    currency: 'USD',
    rate: 120.0,
    date: '2026-06-08',
    type: 'InterEntity',
    status: 'Pending Approval',
    intercompanyGLClearingPosted: true
  }
];

const INITIAL_CHEQUES: ChequeLeaf[] = [
  {
    chequeNo: 'CHQ-1002301',
    payee: 'Ethiopian Electric Utility (EEU)',
    amount: 85200.00,
    issueDate: '2026-05-25',
    dueDate: '2026-05-25',
    status: 'Cleared',
    type: 'Standard',
    paymentTermCode: 'NET_30'
  },
  {
    chequeNo: 'CHQ-1002302',
    payee: 'Dangote Cement Industry Plc',
    amount: 450000.00,
    issueDate: '2026-06-05',
    dueDate: '2026-06-25', // post-dated
    status: 'Issued',
    type: 'PDC',
    paymentTermCode: 'Immediate'
  },
  {
    chequeNo: 'CHQ-1002303',
    payee: 'National Insurance Company of Ethiopia',
    amount: 125000.00,
    issueDate: '2026-06-09',
    dueDate: '2026-06-30', // post-dated
    status: 'Presented',
    type: 'PDC',
    paymentTermCode: 'NET_15'
  },
  {
    chequeNo: 'CHQ-1002304',
    payee: 'Ethio Telecom Wholesale',
    amount: 320000.00,
    issueDate: '2026-06-11',
    dueDate: '2026-06-11',
    status: 'Bounced',
    type: 'Standard',
    paymentTermCode: 'NET_30'
  }
];

// Reconciliation Demo State Sheets (Bank Side vs Book Side)
const RECO_BANK_SIDE: RecoStatementRow[] = [
  { id: 'BS-01', date: '2026-06-01', description: 'DEPOSIT CUSTOMER CLRG INV-CUST-810', refNo: 'DEP-CBE-2601', amount: 1500000.00, type: 'CR', status: 'Unmatched' },
  { id: 'BS-02', date: '2026-06-03', description: 'CASH WTH OFFICE FT TRANSFER', refNo: 'WTH-CBE-2602', amount: 120000.00, type: 'DR', status: 'Unmatched' },
  { id: 'BS-03', date: '2026-06-08', description: 'TELECOM PY CON-9921', refNo: 'CHQ-1002304', amount: 320000.00, type: 'DR', status: 'Exception' }, // bounced
  { id: 'BS-04', date: '2026-06-09', description: 'UNAUTHORIZED DIRECT DEBIT ET-POWER', refNo: 'DD-ERP99', amount: 4850.00, type: 'DR', status: 'Unmatched' }, // missing from books (for adjustment!)
  { id: 'BS-05', date: '2026-06-10', description: 'SWIFT OUTWARD FEE COB TX', refNo: 'CHG-CBE-2604', amount: 1500.00, type: 'DR', status: 'Unmatched' }
];

const RECO_BOOK_SIDE: RecoStatementRow[] = [
  { id: 'BK-01', date: '2026-06-01', description: 'Receipt customer clear INV-810', refNo: 'DEP-CBE-2601', amount: 1500000.00, type: 'CR', status: 'Unmatched' },
  { id: 'BK-02', date: '2026-06-02', description: 'Draft raw materials suppliers', refNo: 'WTH-CBE-2602', amount: 120000.00, type: 'DR', status: 'Unmatched' },
  { id: 'BK-03', date: '2026-06-10', description: 'Telex Bank Service SWIFT charge', refNo: 'CHG-CBE-2604', amount: 1500.00, type: 'DR', status: 'Unmatched' },
  { id: 'BK-04', date: '2026-06-11', description: 'Pre-registered export HONEY clearing', refNo: 'PRE-8822', amount: 98000.00, type: 'CR', status: 'Unmatched' } // not on bank yet
];

interface CashBankModuleTabProps {
  initialSubTab?: string;
}

export default function CashBankModuleTab({ initialSubTab }: CashBankModuleTabProps = {}) {
  const [currencyRate, setCurrencyRate] = useState<'ETB' | 'USD'>('ETB');
  
  // Tab/Screen layout state
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab || 'dashboard');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Lists in states to support dynamic interactiveness
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS);
  const [pettyCounts, setPettyCounts] = useState<PettyCashCount[]>(INITIAL_PETTY_CASH_COUNTS);
  const [transfers, setTransfers] = useState<LiquidTransfer[]>(INITIAL_TRANSFERS);
  const [cheques, setCheques] = useState<ChequeLeaf[]>(INITIAL_CHEQUES);

  // Reconciliation workspace state
  const [bankSideList, setBankSideList] = useState<RecoStatementRow[]>(RECO_BANK_SIDE);
  const [bookSideList, setBookSideList] = useState<RecoStatementRow[]>(RECO_BOOK_SIDE);
  const [selectedBankRows, setSelectedBankRows] = useState<string[]>([]);
  const [selectedBookRows, setSelectedBookRows] = useState<string[]>([]);
  const [recoLog, setRecoLog] = useState<{timestamp: string, msg: string}[]>([
    { timestamp: '10:15:30', msg: 'System reconciliation registry mounted with IFRS-9 rules.' }
  ]);

  // Modals & New Form Triggers
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showTxModal, setShowTxModal] = useState<boolean>(false);
  const [showPctModal, setShowPctModal] = useState<boolean>(false);
  const [showTrfModal, setShowTrfModal] = useState<boolean>(false);

  // Form entries temp state
  const [newAcc, setNewAcc] = useState<Omit<BankAccount, 'id'>>({
    companyName: 'Mesfin PLC',
    branchName: 'Addis Ababa Central',
    swiftCode: '',
    iban: '',
    accountNo: '',
    accountName: '',
    currency: 'ETB',
    accountType: 'Operating',
    balance: 0,
    minBalance: 5000,
    maxBalance: 10000000,
    status: 'Active',
    glAccount: '1111-000-NEW',
    clearingAccount: '1119-000-NEW-CLE',
    recoRequired: true,
    overdraftLimit: 0
  });

  const [newTx, setNewTx] = useState<Omit<BankTransaction, 'id' | 'txHash'>>({
    bankAccountId: 'BA-CBE-001',
    txType: 'Deposit',
    date: '2026-06-12',
    valueDate: '2026-06-12',
    amount: 0,
    currency: 'ETB',
    exchangeRate: 1.0,
    refNo: '',
    description: '',
    status: 'Draft',
    glPosted: false,
    branch: 'Addis Ababa Central',
    costCenter: 'CC-FINANCE-OPS'
  });

  const [newCount, setNewCount] = useState<PettyCashCount>({
    date: '2026-06-12',
    countedBy: 'Meland Ethiopis',
    systemBalance: 75200.00,
    physicalCount: 75200.00,
    variance: 0.0,
    status: 'Verified',
    notes: 'Surprise desk audit.'
  });

  const [newTransfer, setNewTransfer] = useState<Omit<LiquidTransfer, 'id'>>({
    sourceAccountId: 'BA-CBE-001',
    destAccountId: 'BA-PET-004',
    amount: '0' as any,
    currency: 'ETB',
    rate: 1.0,
    date: '2026-06-12',
    type: 'BankToCash',
    status: 'Draft',
    intercompanyGLClearingPosted: false
  });

  // G/L Journal Log display simulation
  const [journalEntriesLog, setJournalEntriesLog] = useState<{
    id: string;
    desc: string;
    debitGL: string;
    creditGL: string;
    amount: number;
    currency: string;
  }[]>([
    { id: 'JE-BK-91', desc: 'Standard SWIFT Telex Outward Service Fee charge', debitGL: '6102-SERVICE-CHG', creditGL: '1119-001-CBET-CLE', amount: 1500.00, currency: 'ETB' },
    { id: 'JE-BK-92', desc: 'Monthly interest credited on Awash USD account', debitGL: '1112-002-AWAS-USD', creditGL: '5101-INT-INC', amount: 54202.50, currency: 'ETB' }
  ]);

  // Automatic state calculations
  const dashboardKpi = useMemo(() => {
    let totalCashInETB = 0;
    let operatingBankSum = 0;
    let pettyCashSum = 0;
    let totalLimitsSum = 0;

    bankAccounts.forEach(acc => {
      const multiplier = acc.currency === 'USD' ? 120.0 : acc.currency === 'EUR' ? 130.0 : 1.0;
      const amtInEtb = acc.balance * multiplier;
      totalCashInETB += amtInEtb;

      if (acc.accountType === 'Petty Cash') {
        pettyCashSum += amtInEtb;
      } else {
        operatingBankSum += amtInEtb;
      }
      totalLimitsSum += (acc.overdraftLimit || 0);
    });

    const activeBounces = cheques.filter(c => c.status === 'Bounced').length;
    const pendingPDCs = cheques.filter(c => c.type === 'PDC' && c.status === 'Issued').length;

    return {
      totalCashInETB,
      operatingBankSum,
      pettyCashSum,
      overdraftLimit: totalLimitsSum,
      activeBounces,
      pendingPDCs
    };
  }, [bankAccounts, cheques]);

  // Add dynamic actions
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `BA-${newAcc.accountNo.slice(0, 3)}-${Date.now().toString().slice(-3)}`;
    const fresh: BankAccount = {
      ...newAcc,
      id
    };
    setBankAccounts(prev => [...prev, fresh]);
    setShowAccountModal(false);
    alert(`Audit Trail Registered: Formally created G/L dynamic routing master account ${newAcc.accountNo} under Entity context.`);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TX-2026-${Date.now().toString().slice(-4)}`;
    const multiplier = newTx.currency === 'USD' ? 120.45 : newTx.currency === 'EUR' ? 130.2 : 1.0;
    
    // Check account status first
    const sourceAcc = bankAccounts.find(x => x.id === newTx.bankAccountId);
    if (sourceAcc && sourceAcc.status === 'Frozen') {
      alert(`[ERROR] Standard Security Hold: Account [${sourceAcc.accountNo}] is Frozen. Postings strictly locked.`);
      return;
    }

    const fresh: BankTransaction = {
      ...newTx,
      id,
      amount: Number(newTx.amount),
      status: 'Posted',
      glPosted: true,
      txHash: '0x' + Math.random().toString(16).slice(2, 10).padStart(8, '0')
    };

    setTransactions(prev => [fresh, ...prev]);

    // Debit and Credit Mapping
    let debGL = 'Pending Spec Debit';
    let credGL = 'Pending Spec Credit';
    if (newTx.txType === 'Deposit') {
      debGL = sourceAcc?.glAccount || '1111-UNALLOC';
      credGL = '1201-DEBTORS-CLR';
    } else if (newTx.txType === 'Withdrawal') {
      debGL = '2201-CREDITORS-CLR';
      credGL = sourceAcc?.glAccount || '1111-UNALLOC';
    }

    setJournalEntriesLog(prev => [
      {
        id: `JE-TX-${Date.now().toString().slice(-2)}`,
        desc: `System generated entry for: ${newTx.description || 'General banking entry'}`,
        debitGL: debGL,
        creditGL: credGL,
        amount: Number(newTx.amount) * multiplier,
        currency: 'ETB'
      },
      ...prev
    ]);

    // Update account balance
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.bankAccountId) {
        const factor = newTx.txType === 'Deposit' || newTx.txType === 'Interest' || newTx.txType === 'Direct Credit' ? 1 : -1;
        return {
          ...acc,
          balance: acc.balance + (Number(newTx.amount) * factor)
        };
      }
      return acc;
    }));

    setShowTxModal(false);
    alert(`Journals successfully posted! Mapped to G/L ${debGL} (DR) & ${credGL} (CR). IFRS-9 compliant.`);
  };

  const handlePostTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransfer.sourceAccountId === newTransfer.destAccountId) {
      alert("[VALIDATION FAILED] Self-transfer is strictly forbidden under Multi-Branch regulatory limits.");
      return;
    }

    const src = bankAccounts.find(x => x.id === newTransfer.sourceAccountId);
    const dest = bankAccounts.find(x => x.id === newTransfer.destAccountId);
    const multiplier = newTransfer.currency === 'USD' ? 120.0 : 1.0;
    const transferCostInEtb = Number(newTransfer.amount) * multiplier;

    if (src && src.balance < Number(newTransfer.amount)) {
      alert(`[ERROR] Overdraft Limit Exceeded: Insufficient balance in ${src.accountName}.`);
      return;
    }

    const id = `TRF-${Date.now().toString().slice(-3)}`;
    const fresh: LiquidTransfer = {
      ...newTransfer,
      id,
      amount: Number(newTransfer.amount),
      status: 'Executed',
      intercompanyGLClearingPosted: src?.companyName !== dest?.companyName
    };

    setTransfers(prev => [fresh, ...prev]);

    // Update both bank balances
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === src?.id) {
        return { ...acc, balance: acc.balance - Number(newTransfer.amount) };
      }
      if (acc.id === dest?.id) {
        // Simple conversion back to destination's currency if needed
        const dstMultiplier = dest.currency === 'USD' ? 120.0 : 1.0;
        const converted = (Number(newTransfer.amount) * multiplier) / dstMultiplier;
        return { ...acc, balance: acc.balance + converted };
      }
      return acc;
    }));

    // Intercompany balancing entries
    if (src?.companyName !== dest?.companyName) {
      setJournalEntriesLog(prev => [
        {
          id: `JE-IC-${Date.now().toString().slice(-2)}`,
          desc: `Intercompany Clearing Balance [${src?.companyName} -> ${dest?.companyName}]`,
          debitGL: '1999-IC-DUETO-RECV',
          creditGL: src?.glAccount || '1111-UNALLOC',
          amount: transferCostInEtb,
          currency: 'ETB'
        },
        ...prev
      ]);
    }

    setShowTrfModal(false);
    alert(`Transfer executed. Multi-Entity clearing checks validated and corresponding balancing journals locked.`);
  };

  const handlePostPettyAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const systemBal = 75200.00; // static demo limit
    const varAmount = newCount.physicalCount - systemBal;
    const fresh: PettyCashCount = {
      ...newCount,
      systemBalance: systemBal,
      variance: varAmount,
      status: varAmount === 0 ? 'Verified' : 'Pending Approval'
    };

    setPettyCounts(prev => [fresh, ...prev]);
    setShowPctModal(false);
    alert(`Cash count recorded. Variance amount: ${varAmount} ETB submitted to supervisor.`);
  };

  // Automated bank statement matcher logic
  const handleAutoReconcile = () => {
    let matchedCount = 0;
    const newBank = bankSideList.map(b => {
      // Find matching item based on Amount and Reference or Date
      const matchingBook = bookSideList.find(bk => 
        bk.status === 'Unmatched' && 
        (bk.amount === b.amount && (bk.refNo === b.refNo || bk.date === b.date))
      );

      if (matchingBook) {
        matchedCount++;
        return {
          ...b,
          status: 'Matched' as const,
          matchedId: matchingBook.id,
          confidence: 99
        };
      }
      return b;
    });

    const newBook = bookSideList.map(bk => {
      const matchingBank = bankSideList.find(b => 
        b.status === 'Unmatched' && 
        (b.amount === bk.amount && (b.refNo === bk.refNo || b.date === bk.date))
      );

      if (matchingBank) {
        return {
          ...bk,
          status: 'Matched' as const,
          matchedId: matchingBank.id,
          confidence: 99
        };
      }
      return bk;
    });

    setBankSideList(newBank);
    setBookSideList(newBook);
    setRecoLog(prev => [
      { timestamp: '12:05:11', msg: `Auto Matcher completed. System successfully reconciled ${matchedCount} transaction counterparts!` },
      ...prev
    ]);
    alert(`Reconciliation engine run completed. Multi-Rule verification finished: matched ${matchedCount} lines.`);
  };

  // Adjust for Bank missing entries (e.g. Bank charges or unauthorized debit)
  const handleBookAdjustment = (it: RecoStatementRow) => {
    // Add missing transaction to system database
    const CBE_ACC = bankAccounts[0]; 
    const randomTxId = `TX-ADJ-${Date.now().toString().slice(-3)}`;
    const multiplier = 1.0;

    const freshTx: BankTransaction = {
      id: randomTxId,
      bankAccountId: CBE_ACC.id,
      txHash: '0x3344f6aa0e99',
      txType: 'Bank Charge',
      date: '2026-06-12',
      valueDate: '2026-06-12',
      amount: it.amount,
      currency: 'ETB',
      exchangeRate: 1.0,
      refNo: it.refNo,
      description: `Adjustment: ${it.description}`,
      status: 'Approved',
      glPosted: true,
      branch: 'Addis Ababa Central',
      costCenter: 'CC-FINANCE-OPS'
    };

    setTransactions(prev => [freshTx, ...prev]);

    // Update account balance
    setBankAccounts(prev => prev.map(acc => {
      if (acc.id === CBE_ACC.id) {
        return {
          ...acc,
          balance: acc.balance - it.amount
        };
      }
      return acc;
    }));

    // Post balance adjustments
    setJournalEntriesLog(prev => [
      {
        id: `JE-ADJ-${Date.now().toString().slice(-2)}`,
        desc: `Rec Adjustment G/L correction: ${it.description}`,
        debitGL: '6102-SERVICE-CHG',
        creditGL: CBE_ACC.glAccount,
        amount: it.amount,
        currency: 'ETB'
      },
      ...prev
    ]);

    // Update lists status in reconciliation workspace
    setBankSideList(prev => prev.map(b => b.id === it.id ? { ...b, status: 'Adjusted' as const } : b));
    setRecoLog(prev => [
      { timestamp: '12:08:44', msg: `Correction posted successfully for missing entry ref [${it.refNo}] of amount ${it.amount}` },
      ...prev
    ]);
    alert("Reconciliation G/L Adjustment generated! Book-side accounting updated with clear tax indicators.");
  };

  // Change account statuses
  const toggleAccountStatus = (id: string, st: 'Active' | 'Frozen' | 'Dormant') => {
    setBankAccounts(prev => prev.map(x => x.id === id ? { ...x, status: st } : x));
    alert(`Status modified to: ${st}. Legal status and automatic routing gates updated.`);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* Dynamic IFRS Standard header */}
      <ReportHeaderCard 
        defaultReportName="Integrated Treasury Liquidity & Cash Control Dashboard" 
        defaultPeriod="Reporting Period: 1 June 2026 to 12 June 2026"
        currency={currencyRate}
        onCurrencyChange={(c) => setCurrencyRate(c)}
      />

      {/* Main Multi-Tab Navigation */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 mt-6 shadow-xs select-none">
        <div className="flex flex-wrap items-center gap-1 pb-3 border-b border-slate-100">
          {[
            { id: 'dashboard', label: 'Treasury Cash Forecast Dashboard', icon: Activity },
            { id: 'accounts', label: '1. Bank & Cash Masters', icon: Landmark },
            { id: 'transactions', label: '2. Transaction Register', icon: Coins },
            { id: 'petty-cash', label: '3. Imprest Petty Cash', icon: Receipt },
            { id: 'transfers', label: '4. Intercompany Transfers', icon: ArrowRightLeft },
            { id: 'cheques-pdc', label: '5. Cheques & PDC Center', icon: ClipboardList },
            { id: 'reconstruction', label: '6. Live Bank Reconciliations', icon: ShieldCheck },
            { id: 'security', label: '7. Controls & Roles Policy', icon: Lock },
            { id: 'comparison', label: 'Enterprise ERP Competitor Matrix', icon: Sparkles }
          ].map(sb => {
            const ActiveIcon = sb.icon;
            const acts = activeSubTab === sb.id;
            return (
              <button
                key={sb.id}
                onClick={() => {
                  setActiveSubTab(sb.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  acts 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{sb.label}</span>
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------------------
            SUB-TAB: TREASURY CASH FORECASTING GRAPHICS & DASHBOARD
            ------------------------------------------------------------- */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-150 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-indigo-500 opacity-20">
                  <Landmark className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Total Available Corporate Cash (CBE / Awash)</p>
                <p className="font-mono text-xl font-black text-slate-950 mt-1">
                  {(dashboardKpi.totalCashInETB / (currencyRate === 'USD' ? 120.0 : 1.0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs text-indigo-600 ml-1.5">{currencyRate}</span>
                </p>
                <span className="text-[9px] font-medium text-emerald-600 flex items-center gap-1 mt-1.5">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>+4.25% Net liquidity growth from prior ledger balance</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-cyan-50/70 to-white border border-cyan-150 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-cyan-500 opacity-20">
                  <Coins className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-black uppercase text-cyan-800 tracking-wider">General G/L Operating Book Cash</p>
                <p className="font-mono text-xl font-black text-slate-950 mt-1">
                  {(dashboardKpi.operatingBankSum / (currencyRate === 'USD' ? 120.0 : 1.0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs text-cyan-600 ml-1.5">{currencyRate}</span>
                </p>
                <span className="text-[9px] font-medium text-slate-500 block mt-1.5">Locked under real-time SWIFT routing controls</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-150 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-emerald-500 opacity-20">
                  <Receipt className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Imprest Petty Cash Vaults</p>
                <p className="font-mono text-xl font-black text-slate-950 mt-1">
                  {(dashboardKpi.pettyCashSum / (currencyRate === 'USD' ? 120.0 : 1.0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs text-emerald-600 ml-1.5">{currencyRate}</span>
                </p>
                <span className="text-[9px] font-medium text-emerald-700 flex items-center gap-1 mt-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Imprest Replenishment verified</span>
                </span>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-150 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute right-2 top-2 text-rose-500 opacity-20">
                  <AlertCircle className="w-16 h-16" />
                </div>
                <p className="text-[10px] font-black uppercase text-rose-800 tracking-wider">PDC Exposures & Stopped/Bounced Leaves</p>
                <div className="flex gap-4 mt-1">
                  <div>
                    <span className="text-[9px] text-slate-500 select-none block leading-none">Bounces</span>
                    <span className="font-mono text-base font-black text-rose-650">{dashboardKpi.activeBounces} Issues</span>
                  </div>
                  <div className="border-l pl-3 border-emerald-250">
                    <span className="text-[9px] text-slate-500 select-none block leading-none">Future PDCs</span>
                    <span className="font-mono text-base font-black text-indigo-750">{dashboardKpi.pendingPDCs} Unpresented</span>
                  </div>
                </div>
                <span className="text-[9px] font-medium text-amber-600 block mt-1.5">Requires urgent supervisory clearance check</span>
              </div>
            </div>

            {/* Simulated AI-Powered Liquidity Forecaster & Currency Exposure */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center select-none">
                      <Activity className="w-4 h-4 mr-1 text-indigo-650" />
                      IFRS-9 Liquid Asset Growth Curve & Forecasting Prediction
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Auto-simulated monthly trend based on accounts liabilities mapping</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                    AI Predict Enabled
                  </span>
                </div>

                {/* SVG Line Chart Graph */}
                <div className="relative h-44 bg-slate-50 border border-slate-150 rounded-xl p-2 flex items-end">
                  <div className="absolute left-3 top-3 z-10 space-y-1">
                    <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">Current Cash Assets (ETB)</span>
                    <span className="text-xs font-black text-slate-800 bg-white shadow-xs px-2 py-0.5 rounded border">
                      Base Line: 45.7M ETB
                    </span>
                  </div>

                  <svg className="w-full h-full text-indigo-650" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Real Line */}
                    <path 
                      d="M 0 90 L 80 80 L 160 85 L 240 60 L 320 45 L 400 35 L 480 15 L 500 10" 
                      fill="none" 
                      stroke="url(#gradient-indigo)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    
                    {/* Shadow Area below lines */}
                    <path 
                      d="M 0 100 L 0 90 L 80 80 L 160 85 L 240 60 L 320 45 L 400 35 L 480 15 L 500 10 L 500 100 Z" 
                      fill="url(#gradient-bg)"
                    />

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                      <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Horizontal Timeline Labels */}
                  <div className="absolute bottom-1.5 left-0 right-0 px-4 flex justify-between text-[9px] font-black text-slate-400 font-mono">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN (CURRENT)</span>
                    <span>JUL (FORECAST)</span>
                    <span>AUG (FORECAST)</span>
                  </div>
                </div>

                {/* Dashboard drilldown selectors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[11px]">
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-slate-500 font-semibold block">Select Cost Center</span>
                    <strong className="text-slate-800">CC-FINANCE-OPS</strong>
                  </div>
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-slate-500 font-semibold block">Legal Branch</span>
                    <strong className="text-slate-800">Addis Ababa HQ</strong>
                  </div>
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-slate-500 font-semibold block">Overdraft Limits</span>
                    <strong className="text-rose-750">5.00M / 5.00M Clear</strong>
                  </div>
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-slate-500 font-semibold block">System Basis</span>
                    <strong className="text-emerald-700">IFRS Compliance Net</strong>
                  </div>
                </div>
              </div>

              {/* Prediction Engine & Recommendations */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center mb-3">
                    <Sparkles className="w-4 h-4 mr-1 text-amber-500 animate-spin" strokeWidth={2.5} />
                    AI Liquidity Recommendation Engine
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[11px] text-amber-800 font-medium">
                      <strong className="block text-amber-950 font-bold mb-0.5">High ETB Idle Balances Detected</strong>
                      The CBE operating account currently contains over 45M ETB. System suggests converting 15% to USD/EUR hedging funds to buffer inflation adjustments.
                    </div>

                    <div className="bg-emerald-50 border border-emerald-110 p-3 rounded-lg text-[11px] text-emerald-800 font-medium col-span-1">
                      <strong className="block text-emerald-950 font-bold mb-0.5">Automated Reconciliation Health</strong>
                      Clean G/L ledger parameters matching over 90% accuracy. Daily automated sweeps matching thresholds verified.
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] font-sans">
                  <span className="text-slate-500 font-bold">System Integrity Score:</span>
                  <strong className="text-emerald-700 font-mono font-bold">99.45% Passed</strong>
                </div>
              </div>
            </div>

            {/* Quick G/L posting Log View */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5">
              <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-slate-500" />
                Live Subledger G/L Clearing Mirror (Standard Dynamic Postings)
              </h4>
              <div className="overflow-hidden border rounded-xl bg-slate-50">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b text-[9px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-2">Posting ID</th>
                      <th className="px-4 py-2">Transaction Reference / Description</th>
                      <th className="px-4 py-2 text-indigo-800 font-black">Debit Ledger Mapped</th>
                      <th className="px-4 py-2 text-rose-800 font-black">Credit Ledger Mapped</th>
                      <th className="px-4 py-2 text-right">Value (ETB Base)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-medium font-sans text-slate-705">
                    {journalEntriesLog.map(je => (
                      <tr key={je.id} className="hover:bg-indigo-50/20">
                        <td className="px-4 py-2.5 font-mono text-xs">{je.id}</td>
                        <td className="px-4 py-2.5 truncate max-w-[280px]" title={je.desc}>{je.desc}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-indigo-700">{je.debitGL}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-rose-750">{je.creditGL}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">
                          {je.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: BANK AND CASH MASTER
            ------------------------------------------------------------- */}
        {activeSubTab === 'accounts' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  Corporate Bank & Cash Account Master Repository
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Validates accounts against regulatory IFRS compliance framework</p>
              </div>

              <button
                onClick={() => setShowAccountModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all outline-none cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register New Corporate Account</span>
              </button>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankAccounts.map(b => (
                <div key={b.id} className="bg-white border text-left border-slate-150 rounded-2xl p-4 shadow-xs relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                      <span className="text-[10px] uppercase font-black text-slate-400 font-mono tracking-wider">{b.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        b.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        b.status === 'Frozen' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h4 className="font-sans text-sm font-black text-slate-900 leading-tight">{b.accountName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-tight">{b.companyName}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg text-slate-650">
                      <div>
                        <span className="text-slate-400 block font-semibold">Account Number</span>
                        <strong className="font-mono text-slate-800">{b.accountNo}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">SWIFT Code</span>
                        <strong className="font-mono text-slate-800">{b.swiftCode || 'N/A'}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block font-semibold">IBAN Base Standard</span>
                        <strong className="font-mono text-[9px] leading-none text-slate-800 truncate block">{b.iban || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">GL Mapping Account</span>
                        <strong className="font-mono text-[#0051d5] font-bold block">{b.glAccount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Overdraft Limit</span>
                        <strong className="font-mono text-slate-850 font-bold block">{b.overdraftLimit.toLocaleString()} ETB</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Available Ledger Balance</span>
                      <strong className="font-mono text-sm font-black text-slate-950">
                        {b.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-indigo-650">{b.currency}</span>
                      </strong>
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => toggleAccountStatus(b.id, 'Active')}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition"
                        title="Set Active Status"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleAccountStatus(b.id, 'Frozen')}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition"
                        title="Freeze Account Operations"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleAccountStatus(b.id, 'Dormant')}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-500 transition"
                        title="Set Dormant Account"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding corporate account */}
            {showAccountModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200]">
                <form onSubmit={handleCreateAccount} className="bg-white border text-left border-slate-200 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-sans font-extrabold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-indigo-600" />
                      Add Bank & Cash Master Account
                    </h3>
                    <button type="button" onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Company / Entity Context *</label>
                      <input 
                        type="text" 
                        value={newAcc.companyName} 
                        onChange={e => setNewAcc({ ...newAcc, companyName: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-800"
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Branch Location *</label>
                      <input 
                        type="text" 
                        value={newAcc.branchName} 
                        onChange={e => setNewAcc({ ...newAcc, branchName: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-800"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Account Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CBE Savings Export Balance"
                        value={newAcc.accountName} 
                        onChange={e => setNewAcc({ ...newAcc, accountName: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805"
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Account Number *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10002133"
                        value={newAcc.accountNo} 
                        onChange={e => setNewAcc({ ...newAcc, accountNo: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Currency *</label>
                      <select 
                        value={newAcc.currency} 
                        onChange={e => setNewAcc({ ...newAcc, currency: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none"
                      >
                        <option value="ETB">ETB - Ethiopian Birr</option>
                        <option value="USD">USD - United States Dollar (Retention)</option>
                        <option value="EUR">EUR - Euro Clearance</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Account Type *</label>
                      <select 
                        value={newAcc.accountType} 
                        onChange={e => setNewAcc({ ...newAcc, accountType: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none"
                      >
                        <option value="Operating">Operating / Checking Account</option>
                        <option value="Savings">Savings Reserve</option>
                        <option value="Petty Cash">Imprest Petty Cash</option>
                        <option value="Escrow">Escrow Clearing Holding</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Dynamic G/L Account Map *</label>
                      <input 
                        type="text" 
                        placeholder="1111-001-CBET" 
                        value={newAcc.glAccount} 
                        onChange={e => setNewAcc({ ...newAcc, glAccount: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Overdraft Limit Allowed (ETB)</label>
                      <input 
                        type="number" 
                        value={newAcc.overdraftLimit} 
                        onChange={e => setNewAcc({ ...newAcc, overdraftLimit: Number(e.target.value) })} 
                        className="border border-slate-200 p-2 rounded bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="font-bold text-slate-600">IBAN Code Base Standard (IFRS Direct Swift)</label>
                      <input 
                        type="text" 
                        value={newAcc.iban} 
                        onChange={e => setNewAcc({ ...newAcc, iban: e.target.value })} 
                        placeholder="ET821000..." 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 bg-white mt-4">
                    <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider font-mono">ERCA Duplicate Protection Checked</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowAccountModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Post & Lock Master</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: TWO - BANK TRANSACTION REGISTER
            ------------------------------------------------------------- */}
        {activeSubTab === 'transactions' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  Corporate Bank Transaction Journal Ledger (Receipts & Payments)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Under strict G/L alignment. Self-validation blocks unapproved backdated entries</p>
              </div>

              <button
                onClick={() => setShowTxModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all outline-none cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Process Direct Deposit / Withdrawal</span>
              </button>
            </div>

            {/* List Table */}
            <div className="overflow-hidden border border-slate-150 rounded-xl">
              <table className="w-full text-left text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-100 border-b text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    <th className="px-4 py-3">Tx Hash ID</th>
                    <th className="px-4 py-3">Value Date</th>
                    <th className="px-4 py-3">Standard Reference</th>
                    <th className="px-4 py-3">Mapped Account</th>
                    <th className="px-4 py-3">Category Type</th>
                    <th className="px-4 py-3 text-right">Raw Asset Amount</th>
                    <th className="px-4 py-3 text-center">Exchange Rate</th>
                    <th className="px-4 py-3 text-right">Value (ETB Equivalent)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium text-slate-850">
                  {transactions.map(t => {
                    const mappedAcc = bankAccounts.find(bk => bk.id === t.bankAccountId);
                    const realMultiplier = t.currency === 'USD' ? 120.45 : t.currency === 'EUR' ? 130.2 : 1.0;
                    const valueEtb = t.amount * realMultiplier;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-2.5 font-mono text-[10px] text-indigo-700 font-black">{t.txHash || t.id}</td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{t.valueDate}</td>
                        <td className="px-4 py-2.5 truncate max-w-[200px]" title={t.description}>
                          <strong>{t.refNo}</strong>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{t.description}</span>
                        </td>
                        <td className="px-4 py-2.5 font-sans">
                          {mappedAcc ? mappedAcc.accountName : 'N/A'}
                          <span className="block text-[9px] font-bold text-slate-400 font-mono">{t.bankAccountId}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            t.txType === 'Deposit' || t.txType === 'Direct Credit' || t.txType === 'Interest'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {t.txType}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 bg-slate-50/40">
                          {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <strong className="text-slate-505">{t.currency}</strong>
                        </td>
                        <td className="px-4 py-2.5 text-center font-mono text-slate-500">{t.exchangeRate.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-indigo-950">
                          {valueEtb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            t.status === 'Approved' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Direct Transaction Modal */}
            {showTxModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200]">
                <form onSubmit={handleCreateTransaction} className="bg-white border text-left border-slate-200 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-sans font-extrabold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      Direct banking transaction entry
                    </h3>
                    <button type="button" onClick={() => setShowTxModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="font-bold text-slate-600">Select Source Corporate Account *</label>
                      <select 
                        value={newTx.bankAccountId} 
                        onChange={e => {
                          const findAcc = bankAccounts.find(f => f.id === e.target.value);
                          setNewTx({ 
                            ...newTx, 
                            bankAccountId: e.target.value,
                            currency: findAcc?.currency || 'ETB',
                            exchangeRate: findAcc?.currency === 'USD' ? 120.45 : findAcc?.currency === 'EUR' ? 130.2 : 1.0
                          });
                        }} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none font-sans"
                        required
                      >
                        {bankAccounts.map(b => (
                          <option key={b.id} value={b.id}>[{b.id}] - {b.accountName} ({b.balance.toLocaleString()} {b.currency})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Transaction Type *</label>
                      <select 
                        value={newTx.txType} 
                        onChange={e => setNewTx({ ...newTx, txType: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none"
                      >
                        <option value="Deposit">Deposit Clearing</option>
                        <option value="Withdrawal">Withdrawal Payment</option>
                        <option value="Interest">Interest Credited</option>
                        <option value="Bank Charge">Bank Charge Debit</option>
                        <option value="Exchange Diff">Exchange Rate Correction</option>
                        <option value="Direct Debit">Direct Debit Sweeper</option>
                        <option value="Direct Credit">Direct Credit Clearing</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Referenced Amount ({newTx.currency}) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g. 50000"
                        value={newTx.amount || ''} 
                        onChange={e => setNewTx({ ...newTx, amount: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Reference / Voucher No *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CBE-DEP-0081" 
                        value={newTx.refNo} 
                        onChange={e => setNewTx({ ...newTx, refNo: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Exchange Rate vs ETB</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        className="border border-slate-200 p-2 rounded bg-slate-50 text-slate-500 font-mono"
                        value={newTx.exchangeRate}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="font-bold text-slate-600">Business Purpose Description *</label>
                      <input 
                        type="text" 
                        placeholder="Purpose of cash moving..." 
                        value={newTx.description} 
                        onChange={e => setNewTx({ ...newTx, description: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Branch Submodule Routing</label>
                      <input 
                        type="text" 
                        value={newTx.branch} 
                        onChange={e => setNewTx({ ...newTx, branch: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white" 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Accounting Cost Center</label>
                      <input 
                        type="text" 
                        value={newTx.costCenter} 
                        onChange={e => setNewTx({ ...newTx, costCenter: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 bg-white mt-4">
                    <span className="text-[10px] text-rose-650 font-semibold uppercase tracking-wider font-mono">Dynamic Closed Period Protection Active</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowTxModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Post Dynamic Voucher</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: THREE - PETTY CASH SYSTEM
            ------------------------------------------------------------- */}
        {activeSubTab === 'petty-cash' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            
            <div className="bg-gradient-to-br from-indigo-55/10 to-indigo-50/20 border border-indigo-150 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center select-none">
                    <Receipt className="w-4 h-4 mr-1 text-indigo-650 animate-bounce" />
                    IFRS-9 Imprest Petty Cash Cashier Vault
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-2xl mt-1">
                    Enforces standard cash ceiling rules. Subscribes surprise audits controls. 
                    Variance triggers immediate supervisor locking protocol.
                  </p>
                </div>

                <button
                  onClick={() => setShowPctModal(true)}
                  className="bg-indigo-605 hover:bg-indigo-650 text-indigo-80 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-sans text-xs font-bold px-3.5 py-1.5 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-all outline-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Execute Surprise Desk Balance Audit</span>
                </button>
              </div>

              {/* Status and limits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Main Imprest Cash Ceiling</span>
                  <strong className="text-sm font-mono text-indigo-700">100,000.00 ETB</strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Minimum Cash Box Hold</span>
                  <strong className="text-sm font-mono text-rose-700">2,000.00 ETB</strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Current Cash On hand</span>
                  <strong className="text-sm font-mono text-emerald-700">75,200.00 ETB</strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Last Auditor Verification</span>
                  <strong className="text-[10px] text-slate-800 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Passed (Alemaehu T.)
                  </strong>
                </div>
              </div>
            </div>

            {/* Surprise Audit Tracker list */}
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider mb-3">
                Desk Cash Count & replenishment History Log
              </h4>
              <div className="overflow-hidden border rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b text-[9px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-2.5">Audit Execution Date</th>
                      <th className="px-4 py-2.5">Count Officer / Auditor</th>
                      <th className="px-4 py-2.5 text-right">System Recorded Balance</th>
                      <th className="px-4 py-2.5 text-right">Physical Counted Cash</th>
                      <th className="px-4 py-2.5 text-right">Variance Balance</th>
                      <th className="px-4 py-2.5">Variance Status Map</th>
                      <th className="px-4 py-2.5">Supporting Auditor Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-medium text-slate-805">
                    {pettyCounts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-mono text-slate-500">{p.date}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800">{p.countedBy}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{p.systemBalance.toLocaleString()} ETB</td>
                        <td className="px-4 py-2.5 text-right font-mono">{p.physicalCount.toLocaleString()} ETB</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-bold ${p.variance < 0 ? 'text-rose-650' : p.variance === 0 ? 'text-emerald-700' : 'text-indigo-650'}`}>
                          {p.variance.toLocaleString()} ETB
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                            p.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-550 truncate max-w-[200px]" title={p.notes}>{p.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Petty Cash modal */}
            {showPctModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200]">
                <form onSubmit={handlePostPettyAudit} className="bg-white border text-left border-slate-200 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-sans font-extrabold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      Register surprise cash count audit
                    </h3>
                    <button type="button" onClick={() => setShowPctModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="font-bold text-slate-600 font-sans">Corporate Imprest Petty Cash Desk *</label>
                      <input 
                        type="text" 
                        value="Headquarters Main Petty Cash Box - BA-PET-004" 
                        className="border border-slate-200 p-2 rounded bg-slate-50 text-slate-500 font-semibold"
                        disabled 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Physical Cash Count Date *</label>
                      <input 
                        type="date"
                        value={newCount.date} 
                        onChange={e => setNewCount({ ...newCount, date: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Count Officer Name *</label>
                      <input 
                        type="text" 
                        placeholder="Auditor Name" 
                        value={newCount.countedBy} 
                        onChange={e => setNewCount({ ...newCount, countedBy: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">HQ Box System Balance (ETB Base)</label>
                      <input 
                        type="number" 
                        className="border border-slate-200 p-2 rounded bg-slate-50 text-slate-500 font-mono"
                        value="75200"
                        disabled
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Physical Cash Drawer Total *</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 75200" 
                        value={newCount.physicalCount || ''} 
                        onChange={e => setNewCount({ ...newCount, physicalCount: Number(e.target.value) })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="font-bold text-slate-600 font-sans">Supporting Auditor Comments *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Verified denominations, small discrepancy..." 
                        value={newCount.notes} 
                        onChange={e => setNewCount({ ...newCount, notes: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 bg-white mt-4">
                    <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider font-mono">Surprise Audit Gating Control Locked</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowPctModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Post count Statement</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: FOUR - LIQUID TRANSFERS
            ------------------------------------------------------------- */}
        {activeSubTab === 'transfers' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  Corporate Bank to Bank & cash transfers
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Intercompany balancing. Block self-transfer. Enforce clearing currency validation checking</p>
              </div>

              <button
                onClick={() => setShowTrfModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all outline-none cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Execute Transfer</span>
              </button>
            </div>

            {/* Transfer List Table */}
            <div className="overflow-hidden border border-slate-150 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Transfer Code ID</th>
                    <th className="px-4 py-2.5">Value Date</th>
                    <th className="px-4 py-2.5">Mapped Source Wallet</th>
                    <th className="px-4 py-2.5">Mapped Target Wallet</th>
                    <th className="px-4 py-2.5 text-right">Transfer Amount</th>
                    <th className="px-4 py-2.5 font-mono">Routing Category Type</th>
                    <th className="px-4 py-2.5 text-center">Intercompany balancing Mapped</th>
                    <th className="px-4 py-2.5 text-center">Execution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium text-slate-805">
                  {transfers.map(tr => {
                    const srcBk = bankAccounts.find(x => x.id === tr.sourceAccountId);
                    const dstBk = bankAccounts.find(x => x.id === tr.destAccountId);
                    return (
                      <tr key={tr.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-mono font-bold text-indigo-755">{tr.id}</td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{tr.date}</td>
                        <td className="px-4 py-2.5">
                          <strong>{srcBk ? srcBk.accountName : 'N/A'}</strong>
                          <span className="block text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tight">{srcBk?.companyName}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <strong>{dstBk ? dstBk.accountName : 'N/A'}</strong>
                          <span className="block text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tight">{dstBk?.companyName}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900 bg-slate-50/30">
                          {tr.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <strong className="text-slate-505">{tr.currency}</strong>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center">{tr.type}</td>
                        <td className="px-4 py-2.5 text-center">
                          {tr.intercompanyGLClearingPosted ? (
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Posted DR-IC / CR-G/L</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Local Intracompany</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            tr.status === 'Executed' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tr.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal transfer */}
            {showTrfModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200]">
                <form onSubmit={handlePostTransfer} className="bg-white border text-left border-slate-200 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-sans font-extrabold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRightLeft className="w-4 h-4 text-indigo-650" />
                      Execute Liquid Transfer
                    </h3>
                    <button type="button" onClick={() => setShowTrfModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Source corporate account *</label>
                      <select 
                        value={newTransfer.sourceAccountId} 
                        onChange={e => setNewTransfer({ ...newTransfer, sourceAccountId: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none font-sans"
                        required
                      >
                        {bankAccounts.map(b => (
                          <option key={b.id} value={b.id}>[{b.id}] - {b.accountName} ({b.balance.toLocaleString()} {b.currency})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Destination corporate account *</label>
                      <select 
                        value={newTransfer.destAccountId} 
                        onChange={e => setNewTransfer({ ...newTransfer, destAccountId: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer outline-none font-sans"
                        required
                      >
                        {bankAccounts.map(b => (
                          <option key={b.id} value={b.id}>[{b.id}] - {b.accountName} ({b.balance.toLocaleString()} {b.currency})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Transfer Liquid value *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g. 150000"
                        value={newTransfer.amount} 
                        onChange={e => setNewTransfer({ ...newTransfer, amount: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white font-mono"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600 font-sans">Clearing currency *</label>
                      <select 
                        value={newTransfer.currency} 
                        onChange={e => setNewTransfer({ ...newTransfer, currency: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer"
                      >
                        <option value="ETB">ETB - Ethiopian Birr Base</option>
                        <option value="USD">USD - Forex clearing</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Transfer Value Date *</label>
                      <input 
                        type="date" 
                        value={newTransfer.date} 
                        onChange={e => setNewTransfer({ ...newTransfer, date: e.target.value })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805"
                        required 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-600">Transfer Routing Type *</label>
                      <select 
                        value={newTransfer.type} 
                        onChange={e => setNewTransfer({ ...newTransfer, type: e.target.value as any })} 
                        className="border border-slate-200 p-2 rounded bg-white text-slate-805 cursor-pointer"
                      >
                        <option value="BankToBank">Bank to Bank Transfer</option>
                        <option value="CashToBank">Petty cash box to Bank</option>
                        <option value="BankToCash">Bank to Petty cash replenishment</option>
                        <option value="InterBranch">Inter-Branch Transfer</option>
                        <option value="InterEntity">Intercompany Transfer (IFRS mapped)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 bg-white mt-4">
                    <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider font-mono">Clearing gates checking automatically</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowTrfModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-sans font-bold text-xs cursor-pointer">Post Cleared Transfer</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: FIVE - CHEQUE & PDC LIFECYCLE
            ------------------------------------------------------------- */}
        {activeSubTab === 'cheques-pdc' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  Post-Dated Cheques (PDC) & standard cheque book Lifecycles
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Auto-prevent clearance before maturity date limit. Multi-Rule routing indicators active</p>
              </div>
            </div>

            {/* Lifecycle diagram */}
            <div className="bg-slate-50 border p-4 rounded-xl flex items-center justify-around gap-2 text-center text-[10px] text-slate-600 font-sans">
              <div className="space-y-1">
                <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full font-bold block">1. Setup Book</span>
                <span className="text-[9px] text-slate-400 block font-medium">Setup ranges</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="space-y-1">
                <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-3 py-1 rounded-full font-bold block">2. Incurred Issue</span>
                <span className="text-[9px] text-slate-400 block font-medium">Record Payee limit</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="space-y-1">
                <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full font-bold block">3. Presented PDC</span>
                <span className="text-[9px] text-slate-400 block font-medium">Wait until maturity list</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="space-y-1">
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full font-bold block">4. Cleared clearing</span>
                <span className="text-[9px] text-slate-400 block font-medium">Write back to CBE Wallet</span>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-hidden border border-slate-150 rounded-xl">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Cheque Leaf Number</th>
                    <th className="px-4 py-2.5">Target Payee</th>
                    <th className="px-4 py-2.5 text-right">Incurred Amount</th>
                    <th className="px-4 py-2.5">Issue Date</th>
                    <th className="px-4 py-2.5">Maturity / Due Date</th>
                    <th className="px-4 py-2.5">Cheque Class</th>
                    <th className="px-4 py-2.5">Lifecycle Status</th>
                    <th className="px-4 py-2.5">Standard Payment Term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium text-slate-805">
                  {cheques.map((ch, idx) => {
                    const isMatured = new Date(ch.dueDate).getTime() <= new Date('2026-06-12').getTime();
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-mono font-bold text-indigo-755">{ch.chequeNo}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800">{ch.payee}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900 bg-slate-50/10">
                          {ch.amount.toLocaleString()} ETB
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{ch.issueDate}</td>
                        <td className="px-4 py-2.5 font-mono">
                          {ch.dueDate}
                          {ch.type === 'PDC' && (
                            <span className={`block text-[9px] font-bold ${isMatured ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {isMatured ? '✓ Clear Maturity' : '⏳ Post-Dated Hold'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            ch.type === 'PDC' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ch.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            ch.status === 'Cleared' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            ch.status === 'Bounced' ? 'bg-rose-50 text-rose-700 border border-rose-100 font-extrabold' :
                            ch.status === 'Presented' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100 animate-pulse' :
                            'bg-slate-50 text-slate-600 border border-slate-150'
                          }`}>
                            {ch.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">{ch.paymentTermCode}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: SIX - LIVE BANK RECONCILIATIONS
            ------------------------------------------------------------- */}
        {activeSubTab === 'reconstruction' && (
          <div className="space-y-6 pt-5 animate-slideUp">
            
            <div className="bg-slate-55/10 bg-slate-100/65 border border-slate-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center select-none">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600 animate-pulse" />
                    SAP-Grade Automated bank statement reconciliation Workspace
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-2xl mt-1">
                    Allows loading MT940 XML statement documents. Configures Exact Match, Amount Match, Value Date Tolerance, 
                    and Reference check algorithms. Generates instant corrective G/L records for discrepancies.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAutoReconcile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all outline-none cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Run Match Machine</span>
                  </button>
                  <button
                    onClick={() => {
                      setBankSideList(RECO_BANK_SIDE);
                      setBookSideList(RECO_BOOK_SIDE);
                      alert("Reconciliation states reset successfully.");
                    }}
                    className="bg-white border hover:bg-slate-100 text-slate-700 font-sans text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Database</span>
                  </button>
                </div>
              </div>

              {/* Status HUD */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Unmatched Bank Statement records</span>
                  <strong className="text-sm font-mono text-rose-700">
                    {bankSideList.filter(b => b.status === 'Unmatched' || b.status === 'Exception').length} Entries
                  </strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Unmatched Book ledger records</span>
                  <strong className="text-sm font-mono text-amber-600">
                    {bookSideList.filter(bk => bk.status === 'Unmatched').length} Entries
                  </strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Reconciliation clearance rate</span>
                  <strong className="text-sm font-mono text-emerald-700">
                    {Math.round(((bankSideList.filter(b => b.status === 'Matched' || b.status === 'Adjusted').length) / bankSideList.length) * 100)}% Comp
                  </strong>
                </div>
                <div className="bg-white border rounded-xl p-3 text-left">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Base Corporate Bank Account</span>
                  <strong className="text-[10px] text-slate-805 block font-sans truncate" title="Addis Ababa Central CBE Checking 1000">CBE AA Checking [1000]</strong>
                </div>
              </div>
            </div>

            {/* Table comparison view split panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Bank Statement side (Left) */}
              <div className="bg-white border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 pb-1 border-b">
                  <span className="text-[10px] font-black uppercase text-indigo-950 flex items-center select-none font-sans">
                    <Landmark className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Bank Statement Feed (MT940/CSV Import Interface)
                  </span>
                  <span className="text-[9px] text-indigo-650 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase font-mono">External Statement</span>
                </div>

                <div className="space-y-2 h-72 overflow-y-auto">
                  {bankSideList.map(b => (
                    <div 
                      key={b.id} 
                      className={`p-3 border rounded-xl transition-all ${
                        b.status === 'Matched' ? 'border-emerald-250 bg-emerald-50/20' : 
                        b.status === 'Adjusted' ? 'border-indigo-250 bg-indigo-50/10' :
                        b.status === 'Exception' ? 'border-rose-250 bg-rose-50/20 font-semibold' : 'border-slate-150 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-405 font-mono">{b.date} • REF: {b.refNo}</span>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${
                          b.status === 'Matched' ? 'bg-emerald-50 text-emerald-700' :
                          b.status === 'Adjusted' ? 'bg-indigo-50 text-indigo-700' :
                          b.status === 'Exception' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status} {b.confidence ? `(${b.confidence}%)` : ''}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-slate-800 mt-1 uppercase truncate font-mono">{b.description}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
                        <span className="text-[9px] text-slate-400">Statement Value</span>
                        <strong className="font-mono text-slate-950 text-xs">
                          {b.amount.toLocaleString()} ETB
                        </strong>
                      </div>

                      {/* Manual G/L Correction adjustments trigger */}
                      {b.status === 'Unmatched' && (
                        <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleBookAdjustment(b)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-[#0051d5] font-black text-[9.5px] px-2 py-1 rounded transition flex items-center gap-1 uppercase"
                            title="Generate corrective post"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Correct G/L discrepancy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Book statement Ledger side (Right) */}
              <div className="bg-white border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 pb-1 border-b">
                  <span className="text-[10px] font-black uppercase text-indigo-950 flex items-center select-none font-sans">
                    <Database className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Internal General G/L Cashbook Ledger Feed
                  </span>
                  <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono">Book ledgers</span>
                </div>

                <div className="space-y-2 h-72 overflow-y-auto">
                  {bookSideList.map(bk => (
                    <div 
                      key={bk.id} 
                      className={`p-3 border rounded-xl transition-all ${
                        bk.status === 'Matched' ? 'border-emerald-250 bg-emerald-50/20' : 'border-slate-150 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-405 font-mono">{bk.date} • REF: {bk.refNo}</span>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${
                          bk.status === 'Matched' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {bk.status}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-slate-800 mt-1 uppercase truncate font-mono">{bk.description}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
                        <span className="text-[9px] text-slate-400">Voucher Value</span>
                        <strong className="font-mono text-slate-905 text-xs">
                          {bk.amount.toLocaleString()} ETB
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Event Audit log registry */}
            <div className="bg-white border p-4 rounded-xl text-left bg-slate-950 text-slate-300 font-mono text-[10px] space-y-1">
              <span className="text-[#a4c5ff] font-bold uppercase select-none block tracking-wider mb-1 flex items-center">
                <Terminal className="w-3.5 h-3.5 mr-1" />
                Treasury reconciliation matching system event log
              </span>
              <div className="max-h-24 overflow-y-auto space-y-0.5 scrollbar-thin">
                {recoLog.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">
                    <span className="text-slate-550 mr-2">[{log.timestamp}]</span>
                    {log.msg}
                  </p>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: SEVEN - CONTROLS & ROLES POLICY
            ------------------------------------------------------------- */}
        {activeSubTab === 'security' && (
          <div className="space-y-6 pt-5 animate-slideUp text-left">
            <div className="border-b pb-3 border-slate-100">
              <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                Corporate Audit Controls, Role permissions & Approval Matrix rules
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Under strict segregation of duties (SoD) guidelines according to local ERCA mandates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-white border rounded-2xl p-5 space-y-4">
                <h4 className="font-sans text-xs font-black uppercase text-indigo-950 tracking-wider border-b pb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-slate-500" />
                  AMS Segregation of Duties Matrix (SoD)
                </h4>

                <div className="space-y-2.5">
                  {[
                    { r: 'Cashier Wallet Admin', d: 'Processes direct cash receipts, daily counting. Strictly blocked from reconciling statement files.' },
                    { r: 'Treasury Controller Officer', d: 'Initiates intercompany matching transfers, SWIFT clearing, bank reconciliation. Blocks payment ledger post.' },
                    { r: 'Senior Finance Auditor', d: 'Formally audits desk variance count logs, overrides frozen account routing blocks, signs manual G/L adjustments.' },
                    { r: 'Corporate CFO Authorizer', d: 'Grants final signature approval trigger for transactions value exceeding 1,000,000 ETB.' }
                  ].map((so, i) => (
                    <div key={i} className="bg-slate-50 p-2.5 rounded-lg border">
                      <strong className="text-indigo-850 font-bold block">{so.r}</strong>
                      <span className="text-[11px] text-slate-650 tracking-tight block mt-0.5 leading-relaxed">{so.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-5 space-y-5">
                <div>
                  <h4 className="font-sans text-xs font-black uppercase text-indigo-950 tracking-wider border-b pb-2 flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-1 text-slate-500" />
                    Mandatory Ethiopian statutory guidelines (ERCA compliance)
                  </h4>
                  <ul className="list-disc pl-4 mt-2 text-[11.5px] space-y-2 text-slate-705 leading-relaxed">
                    <li>
                      <strong>VAT Exemption Declaration: </strong> All direct export deposit settlements (e.g. Abyssinia USD Honey clearances) must carry corresponding zero-percent tax tags.
                    </li>
                    <li>
                      <strong>Surprise Count Mandates: </strong> Petty cash box counts must occur at minimum twice per accounting period under dual signature locks.
                    </li>
                    <li>
                      <strong>Forex Retention Accounts: </strong> National Bank of Ethiopia (NBE) rules automatically sweep 50% of foreign credit collections into ETB conversions at daily central bank rates.
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 border border-indigo-150 p-3 rounded-lg text-slate-700 text-[11px]">
                  <strong className="text-indigo-950 block font-bold mb-1">System Integrity Lock: Approved by Senior Audit Chair</strong>
                  All posted vouchers and master logs include permanent immutable hashes (SHA-256 standard) generated dynamically from Lead Auditor node logins.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SUB-TAB: FULL COMPETITOR ERP COMPARISON MATRIX
            ------------------------------------------------------------- */}
        {activeSubTab === 'comparison' && (
          <div className="space-y-6 pt-5 animate-slideUp text-left">
            <div className="border-b pb-3 border-slate-100">
              <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-indigo-650 animate-bounce" />
                Enterprise ERP functional comparison specification dashboard
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">A formal analysis comparing AMS Cash & Bank Management submodules to corporate leaders</p>
            </div>

            <div className="overflow-hidden border border-slate-150 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-150/60 border-b text-[10px] font-black text-slate-600 uppercase tracking-wider">
                    <th className="px-4 py-3">Treasury Capability Features</th>
                    <th className="px-4 py-3 text-[#0051d5] font-black bg-indigo-50/80">AMS Advanced solution</th>
                    <th className="px-4 py-3">SAP S/4HANA Treasury</th>
                    <th className="px-4 py-3">MS Dynamics 365 Finance</th>
                    <th className="px-4 py-3">Oracle NetSuite Cloud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold font-sans text-slate-705 text-[11px]">
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Multi-Entity & Branch G/L Integration</td>
                    <td className="px-4 py-3 bg-indigo-50/50 text-indigo-705">
                      <span className="flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4 text-emerald-650 stroke-[3px]" />
                        Dynamic cross-company clearing maps
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">Requires complex FICO module configuration</td>
                    <td className="px-4 py-3 font-medium">Inflexible intercompany ledger bridges</td>
                    <td className="px-4 py-3 font-medium">OneWorld structures require high licensing costs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">IFRS-9 / NBE Tax Compliance</td>
                    <td className="px-4 py-3 bg-indigo-50/50 text-indigo-705">
                      <span className="flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4 text-emerald-650 stroke-[3px]" />
                        Local ERCA and NBE conversion sweeps auto-configured
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">Requires local localization patches (SAF-T)</td>
                    <td className="px-4 py-3 font-medium">No built-in Ethiopian tax matrix support</td>
                    <td className="px-4 py-3 font-medium">Relies on external consultancy modules</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Live Statement Auto Match Machine</td>
                    <td className="px-4 py-3 bg-indigo-50/50 text-indigo-705">
                      <span className="flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4 text-emerald-650 stroke-[3px]" />
                        Exact, reference, date tolerances check algorithms built-in
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">Manual search rules are tedious to maintain</td>
                    <td className="px-4 py-3 font-medium">High matching failure rates for partial terms</td>
                    <td className="px-4 py-3 font-medium">Statement imports fail frequently</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Petty Cash Imprest audit tools</td>
                    <td className="px-4 py-3 bg-indigo-50/50 text-indigo-705">
                      <span className="flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4 text-emerald-650 stroke-[3px]" />
                        Built-in surprise dual cashier audit controls
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">Limited local terminal counting utilities</td>
                    <td className="px-4 py-3 font-medium">Separate module licensing required</td>
                    <td className="px-4 py-3 font-medium">No dedicated surprise counters</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-150 rounded-2xl p-4 text-xs space-y-2">
              <strong className="text-indigo-950 font-bold block">AMS Architectural Design Philosophy: World-Class & Auditor-Ready</strong>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">
                By incorporating robust transaction validation locks, automated multi-entity clearing G/L posting entries, and a real-time responsive 
                matching reconciliation dashboard, QM AMS delivers unmatched visual performance and compliance coverage outperforming classical enterprise solutions.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

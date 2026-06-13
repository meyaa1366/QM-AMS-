import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Users,
  Settings,
  ShieldCheck,
  ClipboardList,
  Layers,
  Sliders,
  MapPin,
  AlertTriangle,
  Upload,
  Search,
  Filter,
  Plus,
  Eye,
  Check,
  X,
  RefreshCw,
  Percent,
  Download,
  Terminal,
  ShieldAlert,
  Boxes,
  Briefcase,
  HelpCircle,
  BookOpen,
  DollarSign,
  ChevronRight,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  DownloadCloud,
  Send,
  Building
} from 'lucide-react';

import {
  INITIAL_SUPPLIERS,
  INITIAL_CUSTOMERS,
  FIELD_SPECS,
  ENUM_MASTER,
  LOOKUP_MASTER,
  LOOKUP_DATA,
  BACKEND_RULES,
  VALIDATION_MESSAGES,
  AP_REPORTS,
  AR_REPORTS,
  TAX_MAPPINGS,
  USER_STORIES,
  DEVELOPER_ITEMS,
  SupplierRecord,
  CustomerRecord
} from './aparData';

import ReportHeaderCard from './ReportHeaderCard';

// --- Date calculation & Aging Report helpers ---
function getPaymentTermDays(term: string): number {
  if (!term) return 30;
  const lower = term.toLowerCase();
  if (lower.includes('immediate')) return 0;
  if (lower.includes('15')) return 15;
  if (lower.includes('30')) return 30;
  if (lower.includes('45')) return 45;
  if (lower.includes('60')) return 60;
  if (lower.includes('90')) return 90;
  return 30; // default to Net 30
}

function parseCutoffDate(dateStr: string): Date {
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    
    const months: Record<string, number> = {
      january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
      sep: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
      dec: 11, december: 11
    };
    
    const month = months[monthStr] !== undefined ? months[monthStr] : 11;
    return new Date(year, month, day);
  }
  return new Date(2026, 11, 31);
}

interface InvoiceItem {
  invoiceNo: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  daysOverdue: number;
}

function generateOutstandingInvoices(
  code: string,
  balance: number,
  paymentTerm: string,
  cutoffDate: Date
): InvoiceItem[] {
  if (balance <= 0) return [];

  const termDays = getPaymentTermDays(paymentTerm);
  
  // Deterministic count based on vendor/customer code string
  const charSum = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const invoiceCount = (charSum % 3) + 2; // generates 2, 3, or 4 invoices
  
  const invoices: InvoiceItem[] = [];
  let remainingAmount = balance;
  
  // Custom delays in days before cutoff from most recent to oldest
  // This distributes outstanding amounts to current vs overdue categories
  const targetDelays = [10, 40, 70, 110]; 
  
  // Distribute percentages. Total = 100%
  const targetPct = [0.40, 0.35, 0.15, 0.10];

  for (let i = 0; i < invoiceCount; i++) {
    const isLast = i === invoiceCount - 1;
    let invAmount = 0;
    
    if (isLast) {
      invAmount = remainingAmount;
    } else {
      invAmount = Math.round((balance * targetPct[i]) * 100) / 100;
      if (invAmount > remainingAmount) {
        invAmount = remainingAmount;
      }
    }
    
    if (invAmount <= 0.01) break;
    remainingAmount = Math.max(0, remainingAmount - invAmount);
    
    // Offset in days before cutoff date to place invoice date
    const delay = targetDelays[i % targetDelays.length];
    
    const invoiceDate = new Date(cutoffDate.getTime() - delay * 24 * 60 * 60 * 1000);
    const dueDate = new Date(invoiceDate.getTime() + termDays * 24 * 60 * 60 * 1000);
    
    const diffTime = cutoffDate.getTime() - dueDate.getTime();
    const daysOverdue = Math.max(0, Math.ceil(diffTime / (24 * 60 * 60 * 1000)));

    const seq = i + 1;
    invoices.push({
      invoiceNo: `INV-${code.replace('SUPP-', '').replace('CUST-', '')}-26${seq.toString().padStart(2, '0')}`,
      invoiceDate,
      dueDate,
      amount: invAmount,
      daysOverdue: daysOverdue
    });
  }
  
  return invoices;
}

function formatDateString(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function APARSubmoduleTab({
  initialCategory,
  initialSheet
}: {
  initialCategory?: string;
  initialSheet?: string;
}) {
  // Category navigation & Sub-sheet state
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'Overview');
  const [activeSheet, setActiveSheet] = useState<string>(initialSheet || 'README');

  useEffect(() => {
    setActiveCategory(initialCategory || 'Overview');
    setActiveSheet(initialSheet || 'README');
  }, [initialCategory, initialSheet]);

  // Multi-entity simulation list states
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  
  // Developer Checklist state
  const [checklist, setChecklist] = useState(DEVELOPER_ITEMS);

  // Forms buffers and overlays
  const [isFormOpen, setIsFormOpen] = useState<'Supplier' | 'Customer' | null>(null);
  const [supplierForm, setSupplierForm] = useState<Partial<SupplierRecord>>({});
  const [customerForm, setCustomerForm] = useState<Partial<CustomerRecord>>({});
  const [formSearch, setFormSearch] = useState('');
  const [formFilterGroup, setFormFilterGroup] = useState('All');

  // Aging state parameters
  const [agingCurrency, setAgingCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [agingDate, setAgingDate] = useState<string>('31 December 2026');
  const [agingSearch, setAgingSearch] = useState<string>('');
  const [agingBranch, setAgingBranch] = useState<string>('Addis Ababa Central');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Gating simulation tester states
  const [gateTestType, setGateTestType] = useState<'Supplier Invoice' | 'Customer Invoice' | 'Supplier Payment' | 'Sales Order'>('Supplier Invoice');
  const [selectedGateEntity, setSelectedGateEntity] = useState<string>('SUPP-001');
  const [gateTestResult, setGateTestResult] = useState<any>(null);

  // Notification feedbacks
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const triggerToast = (msg: string) => {
    setFeedbacks(prev => [msg, ...prev].slice(0, 5));
  };

  // Helper stats
  const apOutstanding = useMemo(() => suppliers.reduce((s, x) => s + x.balance, 0), [suppliers]);
  const arOutstanding = useMemo(() => customers.reduce((s, x) => s + x.balance, 0), [customers]);
  const activeS = useMemo(() => suppliers.filter(s => s.activeStatus === 'Active').length, [suppliers]);
  const activeC = useMemo(() => customers.filter(c => c.activeStatus === 'Active').length, [customers]);

  // Handle Developer Checklist Toggles
  const handleToggleChecklist = (idx: number) => {
    setChecklist(prev => prev.map((item, id) => id === idx ? { ...item, completed: !item.completed } : item));
    triggerToast(`Checklist item status updated!`);
  };

  // Checklist completion percentage
  const checklistPercent = useMemo(() => {
    const done = checklist.filter(c => c.completed).length;
    return Math.round((done / checklist.length) * 100);
  }, [checklist]);

  // Categories definition mapping several sheets
  const CATEGORIES = [
    { id: 'Overview', label: '📖 Introduction & Dashboard', sheets: ['README', 'AP_AR_Module_Dashboard'] },
    { id: 'Suppliers', label: '🚚 Supplier Registry', sheets: ['Supplier_Register_Page', 'Supplier_Add_Edit_Form'] },
    { id: 'Customers', label: '🤝 Customer Registry', sheets: ['Customer_Register_Page', 'Customer_Add_Edit_Form'] },
    { id: 'Aging', label: '⏳ Aging Reports', sheets: ['AP_Aging_Report', 'AR_Aging_Report'] },
    { id: 'Control', label: '⚙️ Setup Controls', sheets: ['AP_Setup_Control', 'AR_Setup_Control'] },
    { id: 'Gating', label: '🛑 Gating Rules', sheets: ['Supplier_Transaction_Gating', 'Customer_Transaction_Gating'] },
    { id: 'Enums', label: '📚 Master Lists', sheets: ['Field_Specification', 'Enum_Master', 'Lookup_Master', 'Lookup_Data'] },
    { id: 'Rules', label: '🛡️ Backend Rules', sheets: ['Backend_Business_Rules', 'Validation_Error_Messages'] },
    { id: 'Compliance', label: '📋 Compliance & Reports', sheets: ['AP_Report_Types', 'AR_Report_Types', 'Tax_Compliance_Mapping'] },
    { id: 'Import', label: '💾 bulk template Data', sheets: ['Import_Template_Suppliers', 'Import_Template_Customers', 'Sample_Supplier_Master_Data', 'Sample_Customer_Master_Data'] },
    { id: 'Devs', label: '💻 Developer Spec', sheets: ['API_Backend_Model', 'API_Endpoint_Spec', 'User_Stories', 'Developer_Checklist'] }
  ];

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  const selectCategory = (catId: string) => {
    setActiveCategory(catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat && cat.sheets.length > 0) {
      setActiveSheet(cat.sheets[0]);
    }
  };

  // Trigger gating validations
  const executeGateCheck = () => {
    if (gateTestType.startsWith('Supplier')) {
      const v = suppliers.find(s => s.code === selectedGateEntity);
      if (!v) {
        setGateTestResult({ status: 'Error', message: 'Supplier code not found.' });
        return;
      }
      let checks = [];
      const isApproved = v.approvalStatus === 'Approved';
      const isActive = v.activeStatus === 'Active';
      const isOnHold = v.paymentHold !== 'No Hold';
      const hasPayableAcct = !!v.payableAccount;
      const validTIN = v.tin.length === 10;

      checks.push({ name: 'Active Registration Check', status: isActive ? 'PASS' : 'FAIL', desc: isActive ? 'Supplier active.' : 'Registration inactive.' });
      checks.push({ name: 'Approval Framework', status: isApproved ? 'PASS' : 'FAIL', desc: isApproved ? 'Approved by auditor.' : 'Invoice requires audit approval.' });
      checks.push({ name: 'Legal TIN Rule Checked', status: validTIN ? 'PASS' : 'FAIL', desc: validTIN ? 'TIN format valid.' : 'TIN digits must be exactly 10.' });
      checks.push({ name: 'AP Control Account Mapped', status: hasPayableAcct ? 'PASS' : 'FAIL', desc: hasPayableAcct ? 'Mapped to trade payables.' : 'Missing GL mapping.' });
      checks.push({ name: 'Accounting Period Calendar Open', status: 'PASS', desc: 'Period P04 is currently active.' });

      if (gateTestType === 'Supplier Payment') {
        checks.push({ name: 'Payment Hold Evaluator', status: !isOnHold ? 'PASS' : 'BLOCK', desc: !isOnHold ? 'No payment holds.' : `Blocked: ${v.paymentHoldReason}` });
      }

      const blockedCount = checks.filter(c => c.status === 'FAIL' || c.status === 'BLOCK').length;
      setGateTestResult({
        targetName: v.name,
        checks,
        outcome: blockedCount > 0 ? 'BLOCKED' : 'ALLOWED',
        date: new Date().toLocaleTimeString(),
        notes: blockedCount > 0 ? 'Gating rules blocked posting. Settle error codes.' : 'Validation cleared. Transaction unlocked for postings.'
      });

    } else {
      const c = customers.find(x => x.code === selectedGateEntity);
      if (!c) {
        setGateTestResult({ status: 'Error', message: 'Customer code not found.' });
        return;
      }
      let checks = [];
      const isActive = c.activeStatus === 'Active';
      const isApproved = c.approvalStatus === 'Approved';
      const isHold = c.creditHold !== 'No Hold';
      const withinCreditLimit = c.balance <= c.creditLimit;

      checks.push({ name: 'Active Status Checked', status: isActive ? 'PASS' : 'FAIL', desc: isActive ? 'Active account.' : 'Inactive Customer.' });
      checks.push({ name: 'Audit Approval Gate', status: isApproved ? 'PASS' : 'FAIL', desc: isApproved ? 'Approved.' : 'Form requires approval.' });
      checks.push({ name: 'Credit Limit Evaluator', status: withinCreditLimit ? 'PASS' : 'WARNING', desc: withinCreditLimit ? 'Exposure within limits.' : `Exceeds Credit limit: Balance ETB ${c.balance.toLocaleString()} > Limit ETB ${c.creditLimit.toLocaleString()}` });
      checks.push({ name: 'Operational Credit Hold Block', status: !isHold ? 'PASS' : 'BLOCK', desc: !isHold ? 'Cleared' : `Hold Active: ${c.creditHoldReason}` });

      const blockedCount = checks.filter(c => c.status === 'FAIL' || c.status === 'BLOCK').length;
      setGateTestResult({
        targetName: c.name,
        checks,
        outcome: blockedCount > 0 ? 'BLOCKED' : 'ALLOWED',
        date: new Date().toLocaleTimeString(),
        notes: blockedCount > 0 ? 'Credit policies triggered block.' : 'AR compliance rules cleared. Generation allowed.'
      });
    }
  };

  // Form Submissions
  const saveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.tin) {
      alert('TIN and Supplier Name are required!');
      return;
    }
    if (supplierForm.tin.length !== 10) {
      alert('Ethiopian TIN must be exactly 10 digits!');
      return;
    }

    const payload: SupplierRecord = {
      company: 'MS-PLC',
      code: supplierForm.code || `SUPP-0${suppliers.length + 1}`,
      name: supplierForm.name,
      shortName: supplierForm.shortName || supplierForm.name.slice(0, 10),
      type: supplierForm.type || 'Goods Supplier',
      group: supplierForm.group || 'Local Supplier',
      tin: supplierForm.tin,
      vatNumber: supplierForm.vatNumber || `VAT-AUTO-${Date.now().toString().slice(-4)}`,
      vatStatus: supplierForm.vatStatus || 'VAT Registered',
      whtStatus: supplierForm.whtStatus || 'Withholding Applicable',
      currency: supplierForm.currency || 'ETB',
      paymentTerm: supplierForm.paymentTerm || 'Net 30 Days',
      payableAccount: supplierForm.payableAccount || '2110 (Trade Payables)',
      advanceAccount: supplierForm.advanceAccount || '2120 (Supplier Advances)',
      bankName: supplierForm.bankName || 'Commercial Bank of Ethiopia (CBE)',
      bankBranch: supplierForm.bankBranch || 'Bole',
      bankAccount: supplierForm.bankAccount || '',
      beneficiaryName: supplierForm.beneficiaryName || supplierForm.name,
      matchingType: supplierForm.matchingType || 'Three-Way Matching',
      paymentHold: supplierForm.paymentHold || 'No Hold',
      paymentHoldReason: supplierForm.paymentHoldReason || '',
      activeStatus: supplierForm.activeStatus || 'Active',
      approvalStatus: supplierForm.approvalStatus || 'Approved',
      balance: supplierForm.balance || 0,
      city: supplierForm.city || 'Addis Ababa',
      phone: supplierForm.phone || '',
      email: supplierForm.email || ''
    };

    if (suppliers.some(s => s.code === payload.code)) {
      setSuppliers(prev => prev.map(s => s.code === payload.code ? payload : s));
      triggerToast(`Successfully modified Supplier profile [${payload.code}]!`);
    } else {
      setSuppliers(prev => [...prev, payload]);
      triggerToast(`Onboarded new Supplier master profile [${payload.code}]!`);
    }
    setIsFormOpen(null);
    setActiveSheet('Supplier_Register_Page');
  };

  const saveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.tin) {
      alert('TIN and Customer Name are required.');
      return;
    }
    if (customerForm.tin.length !== 10) {
      alert('Ethiopian TIN must be exactly 10 digits!');
      return;
    }

    const payload: CustomerRecord = {
      company: 'MS-PLC',
      code: customerForm.code || `CUST-0${customers.length + 1}`,
      name: customerForm.name,
      shortName: customerForm.shortName || customerForm.name.slice(0, 10),
      type: customerForm.type || 'Company',
      group: customerForm.group || 'Local Customer',
      tin: customerForm.tin,
      vatNumber: customerForm.vatNumber || `VAT-AUTO-${Date.now().toString().slice(-4)}`,
      vatStatus: customerForm.vatStatus || 'VAT Registered',
      whtStatus: customerForm.whtStatus || 'Withholding Applicable',
      currency: customerForm.currency || 'ETB',
      paymentTerm: customerForm.paymentTerm || 'Net 30 Days',
      receivableAccount: customerForm.receivableAccount || '1120 (Trade Receivables)',
      advanceAccount: customerForm.advanceAccount || '1130 (Customer Advances)',
      creditLimit: Number(customerForm.creditLimit || 5000000),
      creditRisk: customerForm.creditRisk || 'Medium',
      creditHold: customerForm.creditHold || 'No Hold',
      creditHoldReason: customerForm.creditHoldReason || '',
      activeStatus: customerForm.activeStatus || 'Active',
      approvalStatus: customerForm.approvalStatus || 'Approved',
      balance: customerForm.balance || 0,
      city: customerForm.city || 'Addis Ababa',
      phone: customerForm.phone || '',
      email: customerForm.email || ''
    };

    if (customers.some(c => c.code === payload.code)) {
      setCustomers(prev => prev.map(c => c.code === payload.code ? payload : c));
      triggerToast(`Modified Customer profile [${payload.code}] successfully!`);
    } else {
      setCustomers(prev => [...prev, payload]);
      triggerToast(`Registered new Customer profile [${payload.code}] successfully!`);
    }
    setIsFormOpen(null);
    setActiveSheet('Customer_Register_Page');
  };

  // Filter lists in register tabs
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(formSearch.toLowerCase()) || s.code.toLowerCase().includes(formSearch.toLowerCase()) || s.tin.includes(formSearch);
      const matchGrp = formFilterGroup === 'All' || s.group === formFilterGroup;
      return matchSearch && matchGrp;
    });
  }, [suppliers, formSearch, formFilterGroup]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(formSearch.toLowerCase()) || c.code.toLowerCase().includes(formSearch.toLowerCase()) || c.tin.includes(formSearch);
      const matchGrp = formFilterGroup === 'All' || c.group === formFilterGroup;
      return matchSearch && matchGrp;
    });
  }, [customers, formSearch, formFilterGroup]);

  // Generic render function for Excel sheets
  const renderExcelGrid = (title: string, subtitle: string, headers: string[], rows: any[][], summaryText?: string) => {
    return (
      <div className="bg-white border select-none rounded-2xl overflow-hidden shadow-xs border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex justify-between items-center">
          <div>
            <h4 className="font-sans font-black text-sm tracking-wide uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              Sheet View: {title}
            </h4>
            <p className="text-[11px] text-slate-300 font-medium mt-1">{subtitle}</p>
          </div>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + [headers.join(",")].concat(rows.map(e => e.map(x => `"${(x || '').toString().replace(/"/g, '""')}"`).join(","))).join("\n");
              const encodeUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodeUri);
              link.setAttribute("download", `${title}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerToast(`Downloaded ${title}.csv as spreadsheet replica data!`);
            }}
            className="bg-emerald-700 hover:bg-emerald-600 transition text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-white shadow-xs"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            Download CSV Workbook
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans table-auto">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-600 border-b border-slate-200">
                <th className="px-5 py-3 text-center text-slate-400 border-r w-[40px]">#</th>
                {headers.map((h, i) => (
                  <th key={i} className="px-5 py-3 border-r border-slate-250 font-sans">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs text-slate-800 font-medium">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/15 even:bg-slate-50/40">
                  <td className="px-5 py-2.5 text-center text-[10px] font-bold text-slate-400 border-r">{idx + 1}</td>
                  {row.map((val, idy) => {
                    let textClass = "font-sans text-slate-800 text-[11px]";
                    if (val === 'Active' || val === 'PASS' || val === 'Approved' || val === 'Compliant' || val === 'No Hold' || val === 'ALLOWED') {
                      return (
                        <td key={idy} className="px-5 py-2.5 border-r font-sans">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">{val}</span>
                        </td>
                      );
                    }
                    if (val === 'BLOCKED' || val === 'FAIL' || val === 'Critical' || val === 'BLOCK' || val === 'Non-Compliant') {
                      return (
                        <td key={idy} className="px-5 py-2.5 border-r font-sans">
                          <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">{val}</span>
                        </td>
                      );
                    }
                    if (val === 'Warning' || val === 'Warning Only' || val === 'Pending Review' || val === 'Standard 15%') {
                      return (
                        <td key={idy} className="px-5 py-2.5 border-r font-sans">
                          <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[10px]">{val}</span>
                        </td>
                      );
                    }
                    if (typeof val === 'string' && (val.includes('SUPP-') || val.includes('CUST-') || val.includes('ERR-') || val.includes('BR-'))) {
                      textClass = "font-mono font-black text-blue-600 text-[10px]";
                    } else if (val && typeof val === 'number') {
                      textClass = "font-mono font-bold text-slate-900 text-[11px] text-right";
                      return (
                        <td key={idy} className="px-5 py-2.5 border-r text-right font-sans">
                          <span className={textClass}>{val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </td>
                      );
                    }
                    return (
                      <td key={idy} className="px-5 py-2.5 border-r text-slate-700 font-sans truncate max-w-[280px]" title={val}>
                        <span className={textClass}>{val}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {summaryText && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-[11px] font-sans font-semibold text-slate-600">
            {summaryText}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3.5 rounded-2xl text-white shadow-md">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-2">
              AP & AR Submodule Setup Workspace
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase">
                Enterprise Spec (Mesfin PLC)
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Fully interactive mockup workbook designed for compliant Ethiopian trade transactions, tax reporting, and IFRS subledgers.
            </p>
          </div>
        </div>

        {/* RECENT FEEDBACK BAR */}
        <div className="w-full md:w-auto self-stretch md:self-auto bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 min-w-[280px] flex flex-col justify-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State Log Feeds</span>
          {feedbacks.length === 0 ? (
            <span className="text-[11px] font-semibold text-slate-500 italic block">No active session alerts</span>
          ) : (
            <span className="text-[11px] font-bold text-sky-600 block animate-pulse">● {feedbacks[0]}</span>
          )}
        </div>
      </div>

      {/* COMPACT WORKBOOK SHEET MANAGER TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT NAV PANEL - CATEGORIES */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <h5 className="font-sans font-black text-[11px] tracking-widest uppercase text-slate-400 px-3 mb-2">Workbook Chapters</h5>
          {CATEGORIES.map(cat => {
            const isSel = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`w-full text-left font-sans text-xs font-bold px-4 py-3 rounded-xl transition flex justify-between items-center ${isSel ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span>{cat.label}</span>
                <ChevronRight className={`w-4.5 h-4.5 transition-transform ${isSel ? 'rotate-90 text-emerald-400' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* RIGHT SHEET VIEWER */}
        <div className="lg:col-span-9 space-y-4">
          {/* SHEET TAB BUTTONS RENDER (Excel Style) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200">
            {currentCategory.sheets.map(sheet => {
              const isSel = sheet === activeSheet;
              return (
                <button
                  key={sheet}
                  onClick={() => setActiveSheet(sheet)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition flex items-center gap-1.5 ${isSel ? 'bg-emerald-600 text-white shadow-sm font-extrabold' : 'bg-transparent text-slate-600 hover:bg-white'}`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  {sheet.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>

          {/* RENDERING CURRENT CHOSEN SHEET */}
          {activeSheet === 'README' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-sans">Workbook Purpose & AP/AR Lifecycle Architecture</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Welcome to the central design specification framework for the Mesfin PLC Financial Submodule ledger system.</p>
                </div>
                <span className="text-[11px] font-mono font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">Sheet #1</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-slate-700">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 font-sans text-sm border-l-4 border-emerald-500 pl-2">System Context Definitions</h4>
                  <p>
                    <strong>Accounts Payable (AP)</strong> controls outbound obligations to suppliers. Every invoice entered must process regulatory checks (TIN match, VAT eligibility, Withholding thresholds) and verify purchase order matching.
                  </p>
                  <p>
                    <strong>Accounts Receivable (AR)</strong> tracks claims from customers. Credit controls must instantly evaluate active credit risk parameters, preventing billing triggers to frozen business entities.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 font-sans text-sm border-l-4 border-emerald-500 pl-2">Setup Dependency Sequence</h4>
                  <p className="italic text-slate-500 mb-1">Strict implementation order for financial auditors:</p>
                  <ol className="list-decimal list-inside space-y-1.5 font-medium">
                    <li>Company Operating Node (Mesfin PLC Framework)</li>
                    <li>Operational Branches Registry (e.g. AA-01, AD-01)</li>
                    <li>Fiscal Year & Period Structure (P01 to P12 Open)</li>
                    <li>Chart of Accounts (General Ledger Root Nodes)</li>
                    <li>Tax Code Registries (VAT 15%, Withholding)</li>
                    <li>Dynamic Subsidiary Ledger (SL) Mapping Setup</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* AP AGING REPORT FOR INTEGRATED SUBLEDGER */}
          {activeSheet === 'AP_Aging_Report' && (() => {
            const rate = agingCurrency === 'USD' ? 120 : 1;
            const cutoff = parseCutoffDate(agingDate);
            const updatedItems = suppliers.map(s => {
              const bal = s.balance;
              const invoices = generateOutstandingInvoices(s.code, bal, s.paymentTerm, cutoff);
              
              let currentVal = 0;
              let age30Val = 0;
              let age60Val = 0;
              let age90Val = 0;
              let age120Val = 0;
              
              invoices.forEach(inv => {
                const amt = inv.amount / rate;
                if (inv.daysOverdue <= 0) {
                  currentVal += amt;
                } else if (inv.daysOverdue <= 30) {
                  age30Val += amt;
                } else if (inv.daysOverdue <= 60) {
                  age60Val += amt;
                } else if (inv.daysOverdue <= 90) {
                  age90Val += amt;
                } else {
                  age120Val += amt;
                }
              });

              const total = bal / rate;

              return {
                ...s,
                total,
                current: currentVal,
                age30: age30Val,
                age60: age60Val,
                age90: age90Val,
                age120: age120Val,
                invoices
              };
            }).filter(s => {
              const matchSearch = s.name.toLowerCase().includes(agingSearch.toLowerCase()) ||
                                  s.code.toLowerCase().includes(agingSearch.toLowerCase()) ||
                                  s.tin.includes(agingSearch);
              return matchSearch;
            });

            const grandTotal = updatedItems.reduce((acc, val) => acc + val.total, 0);
            const sumCurrent = updatedItems.reduce((acc, val) => acc + val.current, 0);
            const sum30 = updatedItems.reduce((acc, val) => acc + val.age30, 0);
            const sum60 = updatedItems.reduce((acc, val) => acc + val.age60, 0);
            const sum90 = updatedItems.reduce((acc, val) => acc + val.age90, 0);
            const sum120 = updatedItems.reduce((acc, val) => acc + val.age120, 0);

            const pctCurrent = grandTotal > 0 ? (sumCurrent / grandTotal) * 100 : 0;
            const pct30 = grandTotal > 0 ? (sum30 / grandTotal) * 100 : 0;
            const pct60 = grandTotal > 0 ? (sum60 / grandTotal) * 100 : 0;
            const pct90 = grandTotal > 0 ? (sum90 / grandTotal) * 100 : 0;
            const pct120 = grandTotal > 0 ? (sum120 / grandTotal) * 100 : 0;

            const handleExportCSV = () => {
              let csvContent = "data:text/csv;charset=utf-8,";
              csvContent += "Supplier Code,Supplier Name,TIN Number,Branch,Currency,Total Outstanding,Current (0-30),1-30 Days,31-60 Days,61-90 Days,Over 90 Days,Payment Hold Status\r\n";
              
              updatedItems.forEach(s => {
                csvContent += `"${s.code}","${s.name}","${s.tin}","${agingBranch}","${agingCurrency}",${s.total.toFixed(2)},${s.current.toFixed(2)},${s.age30.toFixed(2)},${s.age60.toFixed(2)},${s.age90.toFixed(2)},${s.age120.toFixed(2)},"${s.paymentHold}"\r\n`;
              });

              csvContent += `"-TOTAL-","-","-","-","${agingCurrency}",${grandTotal.toFixed(2)},${sumCurrent.toFixed(2)},${sum30.toFixed(2)},${sum60.toFixed(2)},${sum90.toFixed(2)},${sum120.toFixed(2)},"-"\r\n`;

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `AP_Aging_Report_${agingDate.replace(/ /g, '_')}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerToast("Success: AP Aging Report exported to CSV registry format successfully.");
            };

            const handlePrint = () => {
              window.print();
            };

            return (
              <div className="space-y-6">
                <ReportHeaderCard
                  defaultReportName="AP Aging Report"
                  defaultPeriod={`As of ${agingDate}`}
                  defaultBranch={agingBranch}
                  currency={agingCurrency}
                  onCurrencyChange={(c) => setAgingCurrency(c)}
                  onPrint={handlePrint}
                  onExportExcel={handleExportCSV}
                />

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Search Vendor / Code</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 animate-pulse" />
                      <input
                        type="text"
                        value={agingSearch}
                        onChange={(e) => setAgingSearch(e.target.value)}
                        placeholder="Filter by code, TIN, name..."
                        className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Aging Baseline Cutoff</label>
                    <select
                      value={agingDate}
                      onChange={(e) => setAgingDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-sans text-slate-800"
                    >
                      <option value="31 December 2026">31 December 2026 (YTD End)</option>
                      <option value="30 September 2026">30 September 2026 (Q3 End)</option>
                      <option value="30 June 2026">30 June 2026 (Q2 End)</option>
                      <option value="31 March 2026">31 March 2026 (Q1 End)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Operating Branch</label>
                    <select
                      value={agingBranch}
                      onChange={(e) => setAgingBranch(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-sans text-slate-800"
                    >
                      <option value="All Operating Branches">All Operating Branches</option>
                      <option value="Addis Ababa Central">Addis Ababa Central Branch</option>
                      <option value="Hawassa Hub">Hawassa Hub Branch</option>
                      <option value="Gondar West">Gondar West Branch</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => { setAgingSearch(''); setAgingCurrency('ETB'); setAgingBranch('Addis Ababa Central'); }}
                      className="w-full bg-slate-50 border hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition text-xs font-bold py-2 rounded-xl"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">Current (0-30 Days)</span>
                    <span className="text-sm font-black text-emerald-700 font-mono mt-1">{agingCurrency} {sumCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${pctCurrent}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">1 - 30 Days Past</span>
                    <span className="text-sm font-black text-indigo-700 font-mono mt-1">{agingCurrency} {sum30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${pct30}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">31 - 60 Days Past</span>
                    <span className="text-sm font-black text-sky-700 font-mono mt-1">{agingCurrency} {sum60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${pct60}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">61 - 90 Days Past</span>
                    <span className="text-sm font-black text-amber-700 font-mono mt-1">{agingCurrency} {sum90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${pct90}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between col-span-2 md:col-span-1">
                    <span className="text-[9px] font-black uppercase text-rose-500">Over 90 Days Critical</span>
                    <span className="text-sm font-black text-rose-700 font-mono mt-1">{agingCurrency} {sum120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${pct120}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">IFRS Trade payables aging subledger (IAS 1/39)</h4>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">Summary ledger representing actual age distribution of outstanding balances owed to business vendors.</p>
                    </div>
                    <span className="text-[10.5px] font-mono bg-slate-100 font-semibold px-2.5 py-1 rounded text-slate-600 border border-slate-200">
                      Total Active Segments: {updatedItems.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-sans table-auto">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-650 border-b border-slate-200">
                          <th className="px-4 py-3 text-center text-slate-400 border-r w-[40px]">#</th>
                          <th className="px-4 py-3 border-r">Vendor Code</th>
                          <th className="px-4 py-3 border-r">Supplier Name</th>
                          <th className="px-4 py-3 border-r">TIN Number</th>
                          <th className="px-4 py-3 text-right border-r">Total Outstanding</th>
                          <th className="px-4 py-3 text-right border-r">Current (0-30d)</th>
                          <th className="px-4 py-3 text-right border-r">1 - 30 Days</th>
                          <th className="px-4 py-3 text-right border-r">31 - 60 Days</th>
                          <th className="px-4 py-3 text-right border-r">61 - 90 Days</th>
                          <th className="px-4 py-3 text-right border-r">Over 90 Days</th>
                          <th className="px-4 py-3 text-center">Hold Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-[11px] text-slate-850 font-medium">
                        {updatedItems.map((s, idx) => (
                          <React.Fragment key={s.code}>
                            <tr 
                              className={`hover:bg-slate-50/70 transition cursor-pointer ${expandedRow === s.code ? 'bg-indigo-55/20 font-semibold' : ''}`}
                              onClick={() => setExpandedRow(expandedRow === s.code ? null : s.code)}
                            >
                              <td className="px-4 py-2.5 text-center text-[10px] font-bold text-slate-400 border-r">{idx + 1}</td>
                              <td className="px-4 py-2.5 border-r font-mono text-indigo-700 font-black flex items-center gap-1">
                                <span className="p-0.5 hover:bg-slate-200 rounded transition text-indigo-500">
                                  {expandedRow === s.code ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </span>
                                {s.code}
                              </td>
                              <td className="px-4 py-2.5 border-r truncate max-w-[140px]" title={s.name}>{s.name}</td>
                              <td className="px-4 py-2.5 border-r font-mono">{s.tin}</td>
                              <td className="px-4 py-2.5 border-r text-right font-mono font-bold text-slate-900 bg-slate-50/40">
                                {s.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-emerald-700">
                                {s.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-indigo-700">
                                {s.age30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-sky-700">
                                {s.age60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-amber-700">
                                {s.age90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-rose-700 font-bold">
                                {s.age120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                {s.paymentHold === 'No Hold' ? (
                                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Cleared</span>
                                ) : (
                                  <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider" title={s.paymentHoldReason}>Hold</span>
                                )}
                              </td>
                            </tr>

                            {expandedRow === s.code && (
                              <tr className="bg-slate-50/40 border-b">
                                <td colSpan={11} className="px-6 py-4">
                                  <div className="bg-white border text-left border-indigo-200 rounded-2xl p-4 shadow-xs max-w-4xl">
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                      <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider flex items-center">
                                        <ClipboardList className="w-3.5 h-3.5 mr-1 text-indigo-650 animate-pulse" />
                                        Itemized Outstanding Invoices supporting subledger balance ({s.code})
                                      </span>
                                      <span className="text-[10px] font-sans text-slate-500">
                                        Payment Term: <strong className="text-slate-800">{s.paymentTerm}</strong>
                                      </span>
                                    </div>
                                    <div className="overflow-hidden border border-slate-150 rounded-xl">
                                      <table className="w-full text-left text-[11px] font-sans">
                                        <thead>
                                          <tr className="bg-slate-100/75 border-b border-slate-150 text-[9px] font-black text-slate-500 uppercase">
                                            <th className="px-3 py-2">Invoice No</th>
                                            <th className="px-3 py-2 text-center">Invoice Date</th>
                                            <th className="px-3 py-2 text-center">Due Date</th>
                                            <th className="px-3 py-2 text-center">Term Grace</th>
                                            <th className="px-3 py-2 text-center">Days Overdue</th>
                                            <th className="px-3 py-2">Overdue Status</th>
                                            <th className="px-3 py-2 text-right">Outstanding Amount ({agingCurrency})</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-150 text-slate-800 font-semibold">
                                          {s.invoices && s.invoices.length > 0 ? (
                                            s.invoices.map((inv: any) => {
                                              const termDays = getPaymentTermDays(s.paymentTerm);
                                              const isOverdue = inv.daysOverdue > 0;
                                              return (
                                                <tr key={inv.invoiceNo} className="hover:bg-slate-50/50">
                                                  <td className="px-3 py-2 font-mono text-indigo-700 font-black">{inv.invoiceNo}</td>
                                                  <td className="px-3 py-2 text-center text-slate-500">{formatDateString(inv.invoiceDate)}</td>
                                                  <td className="px-3 py-2 text-center text-slate-700 font-bold">{formatDateString(inv.dueDate)}</td>
                                                  <td className="px-3 py-2 text-center text-slate-500">{termDays} Days</td>
                                                  <td className={`px-3 py-2 text-center font-mono ${isOverdue ? 'text-rose-600 font-black' : 'text-slate-400 font-medium'}`}>
                                                    {isOverdue ? `${inv.daysOverdue} Days` : '0 Days'}
                                                  </td>
                                                  <td className="px-3 py-2">
                                                    {isOverdue ? (
                                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                        inv.daysOverdue <= 30 ? 'bg-indigo-50 text-indigo-700' :
                                                        inv.daysOverdue <= 60 ? 'bg-sky-50 text-sky-700' :
                                                        inv.daysOverdue <= 90 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                      }`}>
                                                        Overdue {inv.daysOverdue}d
                                                      </span>
                                                    ) : (
                                                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                                        Within Term
                                                      </span>
                                                    )}
                                                  </td>
                                                  <td className="px-3 py-2 text-right font-mono font-black text-slate-900">
                                                    {(inv.amount / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </td>
                                                </tr>
                                              );
                                            })
                                          ) : (
                                            <tr>
                                              <td colSpan={7} className="text-center text-xs text-slate-400 py-3">No outstanding invoices</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}

                        <tr className="bg-indigo-50/45 font-bold text-slate-950 text-xs border-t-2 border-slate-300">
                          <td className="px-4 py-3 text-center border-r">Σ</td>
                          <td className="px-4 py-3 border-r font-sans" colSpan={3}>Report Summary Totals ({agingCurrency})</td>
                          <td className="px-4 py-3 border-r text-right font-mono font-black text-indigo-950 bg-indigo-50/90 outline outline-1 outline-indigo-250">
                            {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-emerald-800">
                            {sumCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-indigo-850">
                            {sum30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-sky-850">
                            {sum60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-amber-850">
                            {sum90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-rose-800">
                            {sum120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-center text-[10px] uppercase text-slate-500 font-sans">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-amber-50/55 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed font-sans">
                  <h5 className="font-bold uppercase tracking-wider text-[10.5px] text-amber-800 mb-1">🔍 Auditor Guidance Regarding Trade Accounts Payable</h5>
                  <p>
                    Under IFRS 9 Financial Instruments framework, payables are initially valued at fair price less transaction expenditures. Watch out for overdue periods surpassing 90 days as they prompt localized trade review protocols and risk regulatory audit adjustments. Ensure withholding tax amounts (2% for services, 3% for items) are accrued correctly in connection with applicable local supplier registries.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* AR AGING REPORT FOR INTEGRATED SUBLEDGER */}
          {activeSheet === 'AR_Aging_Report' && (() => {
            const rate = agingCurrency === 'USD' ? 120 : 1;
            const cutoff = parseCutoffDate(agingDate);
            const updatedItems = customers.map(c => {
              const bal = c.balance;
              const invoices = generateOutstandingInvoices(c.code, bal, c.paymentTerm, cutoff);
              
              let currentVal = 0;
              let age30Val = 0;
              let age60Val = 0;
              let age90Val = 0;
              let age120Val = 0;
              
              invoices.forEach(inv => {
                const amt = inv.amount / rate;
                if (inv.daysOverdue <= 0) {
                  currentVal += amt;
                } else if (inv.daysOverdue <= 30) {
                  age30Val += amt;
                } else if (inv.daysOverdue <= 60) {
                  age60Val += amt;
                } else if (inv.daysOverdue <= 90) {
                  age90Val += amt;
                } else {
                  age120Val += amt;
                }
              });

              const total = bal / rate;

              return {
                ...c,
                total,
                current: currentVal,
                age30: age30Val,
                age60: age60Val,
                age90: age90Val,
                age120: age120Val,
                invoices
              };
            }).filter(c => {
              const matchSearch = c.name.toLowerCase().includes(agingSearch.toLowerCase()) ||
                                  c.code.toLowerCase().includes(agingSearch.toLowerCase()) ||
                                  c.tin.includes(agingSearch);
              return matchSearch;
            });

            const grandTotal = updatedItems.reduce((acc, val) => acc + val.total, 0);
            const sumCurrent = updatedItems.reduce((acc, val) => acc + val.current, 0);
            const sum30 = updatedItems.reduce((acc, val) => acc + val.age30, 0);
            const sum60 = updatedItems.reduce((acc, val) => acc + val.age60, 0);
            const sum90 = updatedItems.reduce((acc, val) => acc + val.age90, 0);
            const sum120 = updatedItems.reduce((acc, val) => acc + val.age120, 0);

            const pctCurrent = grandTotal > 0 ? (sumCurrent / grandTotal) * 100 : 0;
            const pct30 = grandTotal > 0 ? (sum30 / grandTotal) * 100 : 0;
            const pct60 = grandTotal > 0 ? (sum60 / grandTotal) * 100 : 0;
            const pct90 = grandTotal > 0 ? (sum90 / grandTotal) * 100 : 0;
            const pct120 = grandTotal > 0 ? (sum120 / grandTotal) * 100 : 0;

            const handleExportCSV = () => {
              let csvContent = "data:text/csv;charset=utf-8,";
              csvContent += "Customer Code,Customer Name,TIN Number,Branch,Currency,Credit Risk,Credit Limit,Total AR Outstanding,Current,1-30 Days,31-60 Days,61-90 Days,Over 90 Days,Credit Hold Status\r\n";
              
              updatedItems.forEach(c => {
                csvContent += `"${c.code}","${c.name}","${c.tin}","${agingBranch}","${agingCurrency}","${c.creditRisk}",${(c.creditLimit / rate).toFixed(2)},${c.total.toFixed(2)},${c.current.toFixed(2)},${c.age30.toFixed(2)},${c.age60.toFixed(2)},${c.age90.toFixed(2)},${c.age120.toFixed(2)},"${c.creditHold}"\r\n`;
              });

              csvContent += `"-TOTAL-","-","-","-","${agingCurrency}","-","-",${grandTotal.toFixed(2)},${sumCurrent.toFixed(2)},${sum30.toFixed(2)},${sum60.toFixed(2)},${sum90.toFixed(2)},${sum120.toFixed(2)},"-"\r\n`;

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `AR_Aging_Report_${agingDate.replace(/ /g, '_')}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerToast("Success: AR Aging Report exported to CSV registry format successfully.");
            };

            const handlePrint = () => {
              window.print();
            };

            return (
              <div className="space-y-6">
                <ReportHeaderCard
                  defaultReportName="AR Aging Report"
                  defaultPeriod={`As of ${agingDate}`}
                  defaultBranch={agingBranch}
                  currency={agingCurrency}
                  onCurrencyChange={(c) => setAgingCurrency(c)}
                  onPrint={handlePrint}
                  onExportExcel={handleExportCSV}
                />

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Search Customer / TIN</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 animate-pulse" />
                      <input
                        type="text"
                        value={agingSearch}
                        onChange={(e) => setAgingSearch(e.target.value)}
                        placeholder="Filter by code, TIN, name..."
                        className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Aging Baseline Cutoff</label>
                    <select
                      value={agingDate}
                      onChange={(e) => setAgingDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white font-sans text-slate-800"
                    >
                      <option value="31 December 2026">31 December 2026 (YTD End)</option>
                      <option value="30 September 2026">30 September 2026 (Q3 End)</option>
                      <option value="30 June 2026">30 June 2026 (Q2 End)</option>
                      <option value="31 March 2026">31 March 2026 (Q1 End)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Operating Branch</label>
                    <select
                      value={agingBranch}
                      onChange={(e) => setAgingBranch(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white font-sans text-slate-800"
                    >
                      <option value="All Operating Branches">All Operating Branches</option>
                      <option value="Addis Ababa Central">Addis Ababa Central Branch</option>
                      <option value="Hawassa Hub">Hawassa Hub Branch</option>
                      <option value="Gondar West">Gondar West Branch</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => { setAgingSearch(''); setAgingCurrency('ETB'); setAgingBranch('Addis Ababa Central'); }}
                      className="w-full bg-slate-50 border hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition text-xs font-bold py-2 rounded-xl"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">Current (0-30 Days)</span>
                    <span className="text-sm font-black text-emerald-700 font-mono mt-1">{agingCurrency} {sumCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${pctCurrent}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">1 - 30 Days Past</span>
                    <span className="text-sm font-black text-indigo-700 font-mono mt-1">{agingCurrency} {sum30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${pct30}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">31 - 60 Days Past</span>
                    <span className="text-sm font-black text-sky-700 font-mono mt-1">{agingCurrency} {sum60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${pct60}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400">61 - 90 Days Past</span>
                    <span className="text-sm font-black text-amber-700 font-mono mt-1">{agingCurrency} {sum90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${pct90}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-50 border p-4 rounded-2xl flex flex-col justify-between col-span-2 md:col-span-1">
                    <span className="text-[9px] font-black uppercase text-rose-500">Over 90 Days Critical</span>
                    <span className="text-sm font-black text-rose-700 font-mono mt-1">{agingCurrency} {sum120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${pct120}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">IFRS Trade receivables aging subledger (IAS 1/32)</h4>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">Summary ledger representing actual age distribution of outstanding balances claimed from business customers.</p>
                    </div>
                    <span className="text-[10.5px] font-mono bg-slate-100 font-semibold px-2.5 py-1 rounded text-slate-600 border border-slate-200">
                      Total Active Segments: {updatedItems.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-sans table-auto">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-650 border-b border-slate-200">
                          <th className="px-4 py-3 text-center text-slate-400 border-r w-[40px]">#</th>
                          <th className="px-4 py-3 border-r">Customer Code</th>
                          <th className="px-4 py-3 border-r">Customer Name</th>
                          <th className="px-4 py-3 border-r">TIN Number</th>
                          <th className="px-4 py-3 border-r">Risk Level</th>
                          <th className="px-4 py-3 text-right border-r">Credit Limit</th>
                          <th className="px-4 py-3 text-right border-r">Total Balance</th>
                          <th className="px-4 py-3 text-right border-r">Current (0-30d)</th>
                          <th className="px-4 py-3 text-right border-r">1 - 30 Days</th>
                          <th className="px-4 py-3 text-right border-r">31 - 60 Days</th>
                          <th className="px-4 py-3 text-right border-r">61 - 90 Days</th>
                          <th className="px-4 py-3 text-right border-r">Over 90 Days</th>
                          <th className="px-4 py-3 text-center">Credit Hold</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-[11px] text-slate-850 font-medium">
                        {updatedItems.map((c, idx) => (
                          <React.Fragment key={c.code}>
                            <tr 
                              className={`hover:bg-slate-50/70 transition cursor-pointer ${expandedRow === c.code ? 'bg-indigo-55/20 font-semibold' : ''}`}
                              onClick={() => setExpandedRow(expandedRow === c.code ? null : c.code)}
                            >
                              <td className="px-4 py-2.5 text-center text-[10px] font-bold text-slate-400 border-r">{idx + 1}</td>
                              <td className="px-4 py-2.5 border-r font-mono text-blue-700 font-black flex items-center gap-1">
                                <span className="p-0.5 hover:bg-slate-200 rounded transition text-blue-500">
                                  {expandedRow === c.code ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </span>
                                {c.code}
                              </td>
                              <td className="px-4 py-2.5 border-r truncate max-w-[130px]" title={c.name}>{c.name}</td>
                              <td className="px-4 py-2.5 border-r font-mono">{c.tin}</td>
                              <td className="px-4 py-2.5 border-r">
                                <span className={`px-2 py-0.5 font-bold rounded-full text-[9px] ${
                                  c.creditRisk === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                                  c.creditRisk === 'Medium' ? 'bg-blue-50 text-blue-700' :
                                  c.creditRisk === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {c.creditRisk}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-slate-500">
                                {(c.creditLimit / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono font-bold text-slate-900 bg-slate-50/40">
                                {c.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-emerald-700">
                                {c.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-indigo-700">
                                {c.age30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-sky-700">
                                {c.age60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-amber-700">
                                {c.age90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 border-r text-right font-mono text-rose-700 font-bold">
                                {c.age120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                {c.creditHold === 'No Hold' ? (
                                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">Cleared</span>
                                ) : (
                                  <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider" title={c.creditHoldReason}>Hold</span>
                                )}
                              </td>
                            </tr>

                            {expandedRow === c.code && (
                              <tr className="bg-slate-50/40 border-b">
                                <td colSpan={13} className="px-6 py-4">
                                  <div className="bg-white border text-left border-blue-200 rounded-2xl p-4 shadow-xs max-w-4xl">
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                      <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider flex items-center">
                                        <ClipboardList className="w-3.5 h-3.5 mr-1 text-blue-600 animate-pulse" />
                                        Itemized Outstanding Invoices supporting subledger balance ({c.code})
                                      </span>
                                      <span className="text-[10px] font-sans text-slate-500">
                                        Payment Term: <strong className="text-slate-800">{c.paymentTerm}</strong>
                                      </span>
                                    </div>
                                    <div className="overflow-hidden border border-slate-150 rounded-xl">
                                      <table className="w-full text-left text-[11px] font-sans">
                                        <thead>
                                          <tr className="bg-slate-100/75 border-b border-slate-150 text-[9px] font-black text-slate-500 uppercase">
                                            <th className="px-3 py-2">Invoice No</th>
                                            <th className="px-3 py-2 text-center">Invoice Date</th>
                                            <th className="px-3 py-2 text-center">Due Date</th>
                                            <th className="px-3 py-2 text-center">Term Grace</th>
                                            <th className="px-3 py-2 text-center">Days Overdue</th>
                                            <th className="px-3 py-2">Overdue Status</th>
                                            <th className="px-3 py-2 text-right">Outstanding Amount ({agingCurrency})</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-150 text-slate-800 font-semibold">
                                          {c.invoices && c.invoices.length > 0 ? (
                                            c.invoices.map((inv: any) => {
                                              const termDays = getPaymentTermDays(c.paymentTerm);
                                              const isOverdue = inv.daysOverdue > 0;
                                              return (
                                                <tr key={inv.invoiceNo} className="hover:bg-slate-50/50">
                                                  <td className="px-3 py-2 font-mono text-blue-700 font-black">{inv.invoiceNo}</td>
                                                  <td className="px-3 py-2 text-center text-slate-500">{formatDateString(inv.invoiceDate)}</td>
                                                  <td className="px-3 py-2 text-center text-slate-700 font-bold">{formatDateString(inv.dueDate)}</td>
                                                  <td className="px-3 py-2 text-center text-slate-500">{termDays} Days</td>
                                                  <td className={`px-3 py-2 text-center font-mono ${isOverdue ? 'text-rose-600 font-black' : 'text-slate-400 font-medium'}`}>
                                                    {isOverdue ? `${inv.daysOverdue} Days` : '0 Days'}
                                                  </td>
                                                  <td className="px-3 py-2">
                                                    {isOverdue ? (
                                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                        inv.daysOverdue <= 30 ? 'bg-indigo-50 text-indigo-700' :
                                                        inv.daysOverdue <= 60 ? 'bg-sky-50 text-sky-700' :
                                                        inv.daysOverdue <= 90 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                      }`}>
                                                        Overdue {inv.daysOverdue}d
                                                      </span>
                                                    ) : (
                                                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                                        Within Term
                                                      </span>
                                                    )}
                                                  </td>
                                                  <td className="px-3 py-2 text-right font-mono font-black text-slate-900">
                                                    {(inv.amount / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </td>
                                                </tr>
                                              );
                                            })
                                          ) : (
                                            <tr>
                                              <td colSpan={7} className="text-center text-xs text-slate-400 py-3">No outstanding invoices</td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}

                        <tr className="bg-blue-50/45 font-bold text-slate-950 text-xs border-t-2 border-slate-300">
                          <td className="px-4 py-3 text-center border-r">Σ</td>
                          <td className="px-4 py-3 border-r font-sans" colSpan={5}>Report Summary Totals ({agingCurrency})</td>
                          <td className="px-4 py-3 border-r text-right font-mono font-black text-blue-950 bg-blue-50/90 outline outline-1 outline-blue-250">
                            {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-emerald-800">
                            {sumCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-indigo-850">
                            {sum30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-sky-850">
                            {sum60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-amber-850">
                            {sum90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 border-r text-right font-mono text-rose-800">
                            {sum120.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-center text-[10px] uppercase text-slate-500 font-sans">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50/55 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed font-sans">
                  <h5 className="font-bold uppercase tracking-wider text-[10.5px] text-blue-800 mb-1">🔍 Credit Controlling Guideline Regarding Accounts Receivable</h5>
                  <p>
                    According to IFRS 9 impairment guidelines, companies must calculate Expected Credit Losses (ECL) on aging receivables. If a customer displays a "High" credit risk designation coupled with past-due aging values over 60 days, credit limits must immediately undergo locking scrutiny, preventing additional billing releases. Track TIN registration carefully for statutory reporting.
                  </p>
                </div>
              </div>
            );
          })()}

          {activeSheet === 'AP_AR_Module_Dashboard' && (
            <div className="space-y-6">
              {/* STATS COUNT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users className="w-6 h-6" /></div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-slate-405 uppercase tracking-wider block">Active Suppliers</span>
                    <span className="text-xl font-mono font-black text-slate-900">{activeS}</span>
                  </div>
                </div>
                <div className="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl"><Users className="w-6 h-6" /></div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-slate-405 uppercase tracking-wider block">Active Customers</span>
                    <span className="text-xl font-mono font-black text-slate-900">{activeC}</span>
                  </div>
                </div>
                <div className="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-slate-405 uppercase tracking-wider block">AR Outstanding</span>
                    <span className="text-base font-mono font-black text-slate-900">ETB {arOutstanding.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-slate-405 uppercase tracking-wider block">AP Outstanding</span>
                    <span className="text-base font-mono font-black text-slate-900">ETB {apOutstanding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS PANEL */}
              <div className="bg-white border rounded-3xl p-6">
                <h4 className="text-sm font-sans font-black text-slate-900 uppercase tracking-wider mb-4">Quick Module Launcher</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button onClick={() => { setSupplierForm({}); setIsFormOpen('Supplier'); setActiveSheet('Supplier_Add_Edit_Form'); }} className="p-4 bg-slate-50 border hover:bg-slate-100 transition rounded-2xl text-left">
                    <span className="block font-black text-xs text-slate-800">Add Supplier</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Register new vendor</span>
                  </button>
                  <button onClick={() => { setCustomerForm({}); setIsFormOpen('Customer'); setActiveSheet('Customer_Add_Edit_Form'); }} className="p-4 bg-slate-50 border hover:bg-slate-100 transition rounded-2xl text-left">
                    <span className="block font-black text-xs text-slate-800">Add Customer</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Onboard new debtor</span>
                  </button>
                  <button onClick={() => selectCategory('Gating')} className="p-4 bg-slate-50 border hover:bg-slate-100 transition rounded-2xl text-left">
                    <span className="block font-black text-xs text-slate-800">Gating Tester</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Dry-run validation checks</span>
                  </button>
                  <button onClick={() => selectCategory('Devs')} className="p-4 bg-slate-50 border hover:bg-slate-100 transition rounded-2xl text-left">
                    <span className="block font-black text-xs text-slate-800">Dev Progress</span>
                    <span className="block text-[10px] text-slate-400 mt-1">{checklistPercent}% specs built</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSheet === 'Supplier_Register_Page' && (
            <div className="space-y-4">
              <div className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      className="w-full border p-2 pl-9 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      placeholder="Search Suppliers by code/tin/name..."
                      value={formSearch}
                      onChange={(e) => setFormSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="border p-2 rounded-xl text-xs font-sans"
                    value={formFilterGroup}
                    onChange={(e) => setFormFilterGroup(e.target.value)}
                  >
                    <option value="All">All Groups</option>
                    <option value="Local Supplier">Local Supplier</option>
                    <option value="Utility Supplier">Utility Supplier</option>
                    <option value="Goods Supplier">Goods Supplier</option>
                    <option value="Fixed Asset Supplier">Fixed Asset Supplier</option>
                    <option value="Service Supplier">Service Supplier</option>
                  </select>
                </div>
                <button
                  onClick={() => { setSupplierForm({}); setIsFormOpen('Supplier'); setActiveSheet('Supplier_Add_Edit_Form'); }}
                  className="bg-slate-900 hover:bg-slate-800 transition text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 w-full md:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" /> Create Supplier
                </button>
              </div>

              {renderExcelGrid(
                'Supplier_Register_Page',
                'Comprehensive list of registered suppliers, regulatory status, and outstanding liability ledger',
                ['Supplier Code', 'Supplier Name', 'Type', 'Group', 'TIN Number', 'VAT Status', 'Default Currency', 'Outstanding Payables', 'Active Status', 'Approval Status'],
                filteredSuppliers.map(s => [s.code, s.name, s.type, s.group, s.tin, s.vatStatus, s.currency, s.balance, s.activeStatus, s.approvalStatus]),
                `Total Suppliers found: ${filteredSuppliers.length}`
              )}
            </div>
          )}

          {activeSheet === 'Customer_Register_Page' && (
            <div className="space-y-4">
              <div className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      className="w-full border p-2 pl-9 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      placeholder="Search Customers by name/code..."
                      value={formSearch}
                      onChange={(e) => setFormSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="border p-2 rounded-xl text-xs font-sans"
                    value={formFilterGroup}
                    onChange={(e) => setFormFilterGroup(e.target.value)}
                  >
                    <option value="All">All Groups</option>
                    <option value="Corporate Customer">Corporate Customer</option>
                    <option value="Local Customer">Local Customer</option>
                    <option value="Government Customer">Government Customer</option>
                    <option value="Retail Customer">Retail Customer</option>
                  </select>
                </div>
                <button
                  onClick={() => { setCustomerForm({}); setIsFormOpen('Customer'); setActiveSheet('Customer_Add_Edit_Form'); }}
                  className="bg-slate-900 hover:bg-slate-800 transition text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 w-full md:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" /> Create Customer
                </button>
              </div>

              {renderExcelGrid(
                'Customer_Register_Page',
                'Comprehensive list of billing accounts, credit terms, risk indicators, and outstanding debtors ledger',
                ['Customer Code', 'Customer Name', 'Type', 'Group', 'TIN Number', 'Credit Limit', 'Credit Exposure', 'Credit Hold Status', 'Active Status', 'Approval Status'],
                filteredCustomers.map(c => [c.code, c.name, c.type, c.group, c.tin, c.creditLimit, c.balance, c.creditHold, c.activeStatus, c.approvalStatus]),
                `Total Customers found: ${filteredCustomers.length}`
              )}
            </div>
          )}

          {activeSheet === 'Supplier_Add_Edit_Form' && (
            <div className="bg-white border rounded-3xl p-6">
              <div className="border-b pb-4 mb-6">
                <h4 className="text-md font-black text-slate-900 font-sans">Supplier Account Creation Profile Form</h4>
                <p className="text-[11px] text-slate-500 font-medium">Input bank, TIN compliance details, address information, and automatic AP gl maps.</p>
              </div>

              <form onSubmit={saveSupplier} className="space-y-6 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Company Entity</label>
                    <select className="w-full border p-2 rounded-xl" value={supplierForm.company || 'MS-PLC'} onChange={e => setSupplierForm({ ...supplierForm, company: e.target.value })}>
                      <option value="MS-PLC">Mesfin PLC Head Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Supplier Code</label>
                    <input type="text" className="w-full border p-2 bg-slate-50 rounded-xl" placeholder="SUPP-022" disabled />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Supplier Business Name *</label>
                    <input type="text" className="w-full border p-2 rounded-xl" placeholder="Enter formal company listing" required value={supplierForm.name || ''} onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Taxpayer TIN (Ethiopian Legal Requirement) *</label>
                    <input type="text" className="w-full border p-2 rounded-xl" placeholder="10 numeric digits" required value={supplierForm.tin || ''} onChange={e => setSupplierForm({ ...supplierForm, tin: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Default AP Control Account</label>
                    <select className="w-full border p-2 rounded-xl" value={supplierForm.payableAccount || '2110 (Trade Payables)'} onChange={e => setSupplierForm({ ...supplierForm, payableAccount: e.target.value })} >
                      <option value="2110 (Trade Payables)">2110 (Trade Payables Control Account)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Default Operating Currency</label>
                    <select className="w-full border p-2 rounded-xl" value={supplierForm.currency || 'ETB'} onChange={e => setSupplierForm({ ...supplierForm, currency: e.target.value })} >
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Payment Hold Status</label>
                    <select className="w-full border p-2 rounded-xl" value={supplierForm.paymentHold || 'No Hold'} onChange={e => setSupplierForm({ ...supplierForm, paymentHold: e.target.value })} >
                      <option value="No Hold">No Hold</option>
                      <option value="Hold Payment">Hold Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Audit Status</label>
                    <select className="w-full border p-2 rounded-xl animate-pulse" value={supplierForm.approvalStatus || 'Approved'} onChange={e => setSupplierForm({ ...supplierForm, approvalStatus: e.target.value })} >
                      <option value="Approved">Formally Approved</option>
                      <option value="Draft">Draft Profiles</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-5 py-2.5 rounded-xl font-bold">
                    Save Profile & Sync Ledger
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSheet === 'Customer_Add_Edit_Form' && (
            <div className="bg-white border rounded-3xl p-6">
              <div className="border-b pb-4 mb-6">
                <h4 className="text-md font-black text-slate-900 font-sans">Customer Registry Profile Form</h4>
                <p className="text-[11px] text-slate-500 font-medium">Input customer profile information, risk definitions, billing models, and tax category mapping.</p>
              </div>

              <form onSubmit={saveCustomer} className="space-y-6 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Company Site</label>
                    <select className="w-full border p-2 rounded-xl" value={customerForm.company || 'MS-PLC'} onChange={e => setCustomerForm({ ...customerForm, company: e.target.value })}>
                      <option value="MS-PLC">Mesfin PLC Primary Legal Node</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Customer Code</label>
                    <input type="text" className="w-full border p-2 bg-slate-50 rounded-xl" placeholder="CUST-022" disabled />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Customer Formal Name *</label>
                    <input type="text" className="w-full border p-2 rounded-xl" placeholder="Full legal name" required value={customerForm.name || ''} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Taxpayer TIN (Ethiopian Legal Requirement) *</label>
                    <input type="text" className="w-full border p-2 rounded-xl" placeholder="10 numeric digits" required value={customerForm.tin || ''} onChange={e => setCustomerForm({ ...customerForm, tin: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-550 font-bold mb-1">Credit Limit (ETB Exposure Cap)</label>
                    <input type="number" className="w-full border p-2 rounded-xl" value={customerForm.creditLimit || ''} onChange={e => setCustomerForm({ ...customerForm, creditLimit: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Credit Risk Classification</label>
                    <select className="w-full border p-2 rounded-xl" value={customerForm.creditRisk || 'Medium'} onChange={e => setCustomerForm({ ...customerForm, creditRisk: e.target.value })} >
                      <option value="Low">Low Risk Segment</option>
                      <option value="Medium">Medium Risk Segment</option>
                      <option value="High">High Risk Segment</option>
                      <option value="Critical">Critical Risk Segment</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <button type="submit" className="bg-slate-900 hover:bg-slate-800 transition text-white px-5 py-2.5 rounded-xl font-bold">
                    Save Client & Map AR
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSheet === 'AP_Setup_Control' && renderExcelGrid(
              'AP_Setup_Control',
              'Global settings profile verifying accounts payable matching rules and system authorizations',
              ['Control Field Key', 'Business Meaning / Description', 'Enforce Status', 'System Default value', 'Backend Business Rules Rule Mapping'],
              [
                ['Default AP Account', 'Control Summary Connection Account', 'Active Map', '2110 (Trade Payables)', 'BR-01 Unique validation control'],
                ['Prepayment Account', 'Supplier advances control node', 'Active Map', '2120 (Supplier Advances)', 'Must direct to active account'],
                ['Invoice Approval Flow', 'Authorize voucher postings', 'Strict Lock', 'Required above 50,000 ETB', 'Prevent un-audited ledger exposure'],
                ['Duplicate Invoice block', 'Verify prior bookkeeping invoices', 'Strict Lock', 'Blocked', 'BR-04 Duplicate invoice number preventer'],
                ['Matching Type Tolerance', 'Three-way check tolerance gap threshold', 'Threshold Block', '±1.50 %', 'Block variance exceeding margin']
              ]
            )}

          {activeSheet === 'AR_Setup_Control' && renderExcelGrid(
              'AR_Setup_Control',
              'Global settings profile checking debtor billing rules, cash receipt matches and credit parameters',
              ['Control Option Key', 'System Operational Function', 'Risk level', 'Active Default Value', 'Security Rule Applied'],
              [
                ['Default AR Account', 'Summary general ledger node connection', 'Strict Map', '1120 (Trade Receivables)', 'Automatic balancing'],
                ['Advance Received Node', 'Downpayments received and unbilled receipts', 'Strict Map', '1130 (Customer Advances)', 'Unearned revenue rules'],
                ['Credit Limit Enforcement', 'Prevent billing trigger on frozen entities', 'Strict Warning', 'Enabled (±10% Tolerance Gap)', 'BR-05 Credit exposure check'],
                ['Maximum Overdue Terms', 'Block orders if client has aged payments', 'Strict block', 'Allowed 45 Days Past Due', 'Force collections review prior to next order']
              ]
            )}

          {activeCategory === 'Gating' && (
            <div className="space-y-4">
              <div className="bg-white border rounded-2xl p-5 shadow-xs font-sans text-xs">
                <h4 className="font-sans font-black text-slate-900 uppercase mb-3">Live Gating Rules Compliance Optimizer</h4>
                <p className="text-slate-500 mb-4 font-medium">Verify your registered master entities against legal ERCA codes, tax status, and credit limits prior to committing postings.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Transaction Target Type</label>
                    <select
                      className="w-full border p-2 rounded-xl text-xs"
                      value={gateTestType}
                      onChange={e => {
                        setGateTestType(e.target.value as any);
                        setSelectedGateEntity(e.target.value.startsWith('Supplier') ? suppliers[0].code : customers[0].code);
                        setGateTestResult(null);
                      }}
                    >
                      <option value="Supplier Invoice">Supplier Bill Submission</option>
                      <option value="Supplier Payment">Supplier Payment Execution</option>
                      <option value="Sales Order">Customer Sales Order Trigger</option>
                      <option value="Customer Invoice">Customer Invoice Booking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Choose Account Profile</label>
                    <select
                      className="w-full border p-2 rounded-xl text-xs"
                      value={selectedGateEntity}
                      onChange={e => { setSelectedGateEntity(e.target.value); setGateTestResult(null); }}
                    >
                      {gateTestType.startsWith('Supplier') ? (
                        suppliers.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)
                      ) : (
                        customers.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)
                      )}
                    </select>
                  </div>
                  <button
                    onClick={executeGateCheck}
                    className="bg-emerald-600 hover:bg-emerald-500 transition text-white font-extrabold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    Run Gating Validator
                  </button>
                </div>

                {gateTestResult && (
                  <div className="bg-slate-50 border rounded-2xl p-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-slate-900">Entity: {gateTestResult.targetName} ({selectedGateEntity})</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${gateTestResult.outcome === 'ALLOWED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                        OUTCOME: {gateTestResult.outcome}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {gateTestResult.checks.map((check: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] font-medium py-1 border-b border-dashed">
                          <span className="text-slate-600">{check.name}</span>
                          <div className="flex gap-2 items-center">
                            <span className="text-slate-400 font-normal italic">{check.desc}</span>
                            <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm ${check.status === 'PASS' ? 'bg-emerald-100/80 text-emerald-800' : check.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                              {check.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-1 bg-slate-100 p-2 rounded-lg border">
                      <strong>Audit Log (Timestamp {gateTestResult.date}):</strong> {gateTestResult.notes}
                    </p>
                  </div>
                )}
              </div>

              {activeSheet === 'Supplier_Transaction_Gating' && renderExcelGrid(
                  'Supplier_Transaction_Gating',
                  'Trigger-based compliance matrices evaluating and blocking erroneous supplier transactions',
                  ['Gate Id', 'Compliance Rule Description', 'Trigger Point', 'Pass Criteria', 'Block Action Behavior'],
                  [
                    ['Gate-AP-01', 'TIN Registration Check', 'Supplier Invoicing', 'TIN must be 10 valid digits in local database', 'Block bill creation completely'],
                    ['Gate-AP-02', 'Audit Clearance Gate', 'Supplier Pay Run', 'Approval Status is Approved', 'Block payments. Require accountant correction.'],
                    ['Gate-AP-03', 'Duplicate Invoice Match', 'Invoice Inputting', 'No recorded reference for supplier ID', 'Hard Block bookkeeping entry']
                  ]
                )}

              {activeSheet === 'Customer_Transaction_Gating' && renderExcelGrid(
                  'Customer_Transaction_Gating',
                  'Trigger-based credit checks blocking shipping and booking of outstanding trade debentures',
                  ['Gate Id', 'Security Evaluation Rule', 'Trigger Point', 'Accept Term', 'Policy Trigger Block'],
                  [
                    ['Gate-AR-01', 'Overdue Days Evaluation', 'Invoice Post / Order Save', 'No invoices older than 45 past terms', 'Block shipping release order'],
                    ['Gate-AR-02', 'Credit Cap check', 'Sales Booking / Billing', 'Exposure stays below credit limit', 'Block invoice or request override authorization'],
                    ['Gate-AR-03', 'Compliance Freeze check', 'Draft Order Save', 'Active Status matches Active', 'Full entity lock. Suspend collection activities.']
                  ]
                )}
            </div>
          )}

          {/* STATIC DATAGRIDS PROGRAMMATIC RENDER */}
          {activeSheet === 'Field_Specification' && renderExcelGrid(
              'Field_Specification',
              'Master properties definition mapping backend fields, lengths, and validation errors',
              ['View Section', 'Property Field Name', 'JSON Key', 'Data Schema', 'Control Format', 'Required?', 'System Default value', 'Validation Exception Message'],
              FIELD_SPECS.map(f => [f.section, f.name, f.key, f.type, f.ctrlType, f.req ? 'Yes' : 'No', f.defVal, f.validation])
            )}

          {activeSheet === 'Enum_Master' && renderExcelGrid(
              'Enum_Master',
              'Operational variables mapping dictionary dropdown options and code keys',
              ['Enum Group Category', 'Display Name', 'Database Enforced Key', 'Option Description', 'Initial Default?'],
              ENUM_MASTER.map(e => [e.group, e.name, e.visual, e.desc, e.def])
            )}

          {activeSheet === 'Lookup_Master' && renderExcelGrid(
              'Lookup_Master_Register',
              'System directories referencing parent tables and dynamic mapping keys',
              ['Operational Entity Directory', 'Source Database Table', 'Functional Purpose', 'Map Key', 'Display Label Field', 'Strictly required?'],
              LOOKUP_MASTER.map(l => [l.name, l.src, l.purpose, l.keyField, l.dispField, l.req])
            )}

          {activeSheet === 'Lookup_Data' && renderExcelGrid(
              'Lookup_Data_Seeds',
              'Validated options mapping operational branches, currencies, tax types, and CBE branches',
              ['Directory Entity', 'System Code Code', 'Display Name Designation', 'Lookup Notes'],
              LOOKUP_DATA.map(l => [l.group, l.code, l.name, l.desc])
            )}

          {activeSheet === 'Backend_Business_Rules' && renderExcelGrid(
              'Backend_Business_Rules',
              'Technical logic layers enforcing system integrity at save and post actions',
              ['Rule Code', 'Technical Rule Designation', 'System Description', 'Action Point Trigger', 'Condition Evaluated', 'Enforcement Logic'],
              BACKEND_RULES.map(b => [b.id, b.name, b.desc, b.trigger, b.condition, b.behavior])
            )}

          {activeSheet === 'Validation_Error_Messages' && renderExcelGrid(
              'Validation_Error_Messages',
              'Custom descriptive error messages mapped back to financial triggers',
              ['Error Code', 'Descriptive Warning Message Logged', 'Underlying Mismatch Failure', 'Accountant Action Suggesion'],
              VALIDATION_MESSAGES.map(v => [v.code, v.text, v.meaning, v.suggest])
            )}

          {activeSheet === 'AP_Report_Types' && renderExcelGrid(
              'AP_Report_Types',
              'Prebuilt financial operational statements mapped for AP accounting',
              ['Report Code', 'Statement Designation Name', 'Target Objective', 'Intended User Profile', 'Output Export Class'],
              AP_REPORTS.map(r => [r.code, r.name, r.purpose, r.user, r.format])
            )}

          {activeSheet === 'AR_Report_Types' && renderExcelGrid(
              'AR_Report_Types',
              'Prebuilt collection and billing analysis reports and registers',
              ['Report Code', 'Statement/Register Designation', 'Target Objective', 'Primary Accountant Profile', 'Output File Formats'],
              AR_REPORTS.map(r => [r.code, r.name, r.purpose, r.user, r.format])
            )}

          {activeSheet === 'Tax_Compliance_Mapping' && renderExcelGrid(
              'Tax_Compliance_Mapping',
              'Tax regulations configured according to Ethiopian Revenue Authority guidelines and withholding thresholds',
              ['Map Code Code', 'Supplier/Customer Classification Type', 'Policy Mapping Rule', 'Dynamic Target GL account'],
              TAX_MAPPINGS.map(t => [t.code, t.type, t.rule, t.account])
            )}

          {activeSheet === 'Import_Template_Suppliers' && renderExcelGrid(
              'Import_Template_Suppliers',
              'Formatted headers and copy-paste schemas to bulk import supplier lists',
              ['Company Code', 'Branch Code', 'Supplier Code', 'Supplier Name', 'TIN Number', 'VAT Status', 'Default Currency', 'Payable Account', 'Active Status'],
              [
                ['MS-PLC', 'AA-01', 'SUPP-001', 'Nile Petroleum PLC', '0012457890', 'VAT Registered', 'ETB', '2110 (Trade Payables)', 'Active'],
                ['MS-PLC', 'AA-01', 'SUPP-002', 'EEP Utilities', '0003445582', 'VAT Registered', 'ETB', '2110 (Trade Payables)', 'Active']
              ]
            )}

          {activeSheet === 'Import_Template_Customers' && renderExcelGrid(
              'Import_Template_Customers',
              'Formatted headers and copy-paste schemas to bulk import customer accounts',
              ['Company Code', 'Branch Code', 'Customer Code', 'Customer Name', 'TIN Number', 'Receivable Account', 'Credit Limit', 'Active Status'],
              [
                ['MS-PLC', 'AA-01', 'CUST-001', 'Alpha Education PLC', '0041234567', '1120 (Trade Receivables)', '2500000', 'Active'],
                ['MS-PLC', 'AA-01', 'CUST-002', 'Midroc Investment Group', '0000105432', '1120 (Trade Receivables)', '12000000', 'Active']
              ]
            )}

          {activeSheet === 'Sample_Supplier_Master_Data' && renderExcelGrid(
              'Sample_Supplier_Master_Data',
              'Database replications pre-populated with active entities',
              ['Supplier Code', 'Supplier Name', 'TIN Number', 'VAT Status', 'Operating Currency', 'Target Control GL Node', 'Settle Terms', 'Active Balance', 'Hold State'],
              suppliers.map(s => [s.code, s.name, s.tin, s.vatStatus, s.currency, s.payableAccount, s.paymentTerm, s.balance, s.paymentHold])
            )}

          {activeSheet === 'Sample_Customer_Master_Data' && renderExcelGrid(
              'Sample_Customer_Master_Data',
              'Database replications pre-populated with debtors entities',
              ['Customer Code', 'Customer Name', 'TIN Number', 'VAT Status', 'Operating Currency', 'Receivable Account', 'Debtor Balance', 'Active Hold State'],
              customers.map(c => [c.code, c.name, c.tin, c.vatStatus, c.currency, c.receivableAccount, c.balance, c.creditHold])
            )}

          {activeSheet === 'API_Backend_Model' && renderExcelGrid(
              'API_Backend_Model',
              'TypeScript structures design specs mapping PostgreSQL column typings',
              ['Design Entity Name', 'Property Field Name', 'JSON Key Key', 'Data Schema Class', 'Nullability?', 'Unique Key constraint?', 'Relation Index Map'],
              [
                ['suppliers', 'ID primary key', 'id', 'VARCHAR(50)', 'NOT NULL', 'Primary Key', 'Self unique'],
                ['suppliers', 'Supplier code', 'code', 'VARCHAR(50)', 'NOT NULL', 'Unique Key', 'Self index'],
                ['suppliers', 'Taxpayer TIN', 'tin', 'VARCHAR(10)', 'NOT NULL', 'Unique constraint', 'Audit index'],
                ['suppliers', 'Payable Control account', 'payableAccount', 'VARCHAR(50)', 'NOT NULL', 'Non-Unique key', 'references accounts(code)'],
                ['customers', 'Customer code', 'code', 'VARCHAR(50)', 'NOT NULL', 'Unique Key', 'Self index'],
                ['customers', 'Credit Limit cap', 'creditLimit', 'DECIMAL(15,2)', 'NOT NULL', 'Non-Unique', 'None']
              ]
            )}

          {activeSheet === 'API_Endpoint_Spec' && renderExcelGrid(
              'API_Endpoint_Spec',
              'REST API contracts and version mappings for ERP operations',
              ['Method', 'Endpoint Uri', 'Purpose Designation', 'Request JSON Payload Keys', 'Pass Response Keys', 'Security Check required'],
              [
                ['POST', '/api/suppliers', 'Create new supplier profile', '{name, tin, payableAccount}', '{id, code, status}', 'Yes (accounting_post)'],
                ['GET', '/api/suppliers/:id', 'Retrieve supplier info by code', 'None', '{code, name, tin, balance}', 'Yes (accounting_read)'],
                ['POST', '/api/customers', 'Register customer profile', '{name, tin, receivableAccount}', '{id, code, creditLimit}', 'Yes (accounting_post)'],
                ['GET', '/api/customers/aging', 'Calculate AR balance aging report', '{branchCode, ageDate}', '{current, age30, age60}', 'Yes (cfo_reports)']
              ]
            )}

          {activeSheet === 'User_Stories' && renderExcelGrid(
              'User_Stories',
              'Comprehensive agile stories describing core finance tasks, goals, and conditions to compile',
              ['Story ID', 'Epic Title Category', 'Operational User Role', 'Goal Target Request', 'Business Benefit Outcome'],
              USER_STORIES.map(u => [u.id, u.epic, u.role, u.goal, u.benefit])
            )}

          {activeSheet === 'Developer_Checklist' && (
            <div className="bg-white border rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
                <div>
                  <h4 className="text-md font-black text-slate-900 font-sans">Submodule Technical Backlog Integrator</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Check off completed development sprints. Real-time implementation gauge fills below.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Completion Gauge</span>
                  <span className="text-xl font-mono font-black text-emerald-600 block">{checklistPercent}% Built</span>
                </div>
              </div>

              {/* BAR GAUGE */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-500" style={{ width: `${checklistPercent}%` }} />
              </div>

              {/* LIST */}
              <div className="space-y-2 mt-4 text-xs font-medium font-sans">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 border hover:bg-slate-100/50 transition p-3 rounded-xl">
                    <div className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(idx)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 font-sans">{item.name}</span>
                        <div className="flex gap-2 items-center text-[10px]">
                          <span className="bg-slate-200/80 text-slate-600 px-2.1 py-0.5 rounded-md font-sans">{item.area}</span>
                          <span className={`px-1.5 py-0.5 rounded-md font-bold ${item.prio === 'P0' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>{item.prio}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold ${item.completed ? 'text-emerald-600' : 'text-slate-400 italic'}`}>
                      {item.completed ? 'COMPLETED' : 'IN_SPRINT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

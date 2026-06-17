import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database,
  Building2,
  Sparkles,
  Check,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  Layers,
  Save,
  Clock,
  Briefcase,
  Coins
} from 'lucide-react';
import { Account, AccountType, AccountStatus, ApprovalStatus, SLType, BalanceType, DimensionControl } from '../types';
import { COMPANIES, BRANCHES } from '../data';

interface AddEditAccountTabProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSave: (account: Account) => void;
  onCancel: () => void;
}

// 1. Map of Account Types to standard Normal Balances (Auto-selected based on Account Type)
const TYPE_TO_BALANCE: Record<AccountType, BalanceType> = {
  'Asset': 'Debit',
  'Liability': 'Credit',
  'Equity': 'Credit',
  'Revenue': 'Credit',
  'Cost of Sales': 'Debit',
  'Expense': 'Debit',
  'Statistical': 'Debit',
  'Memorandum / Off-Balance Sheet': 'Credit',
  'Cost': 'Debit'
};

// 2. Real standard-compliant group categorization list based on each Account Type (Categorize in other way for each account type)
const ACCOUNT_TYPE_CATEGORIES: Record<AccountType, string[]> = {
  'Asset': [
    'Cash & Bank Balances',
    'Trade Receivables',
    'Inventory Stocks',
    'Prepayments & Advances',
    'Property, Plant & Equipment',
    'Intangible Assets',
    'Deferred Tax Assets',
    'Other Current Assets'
  ],
  'Liability': [
    'Trade Payables',
    'Short-Term Borrowings',
    'Tax Authorities Liability',
    'Accrued Liabilities & Provisions',
    'Long-Term Debt Obligations',
    'Deferred Tax Liabilities',
    'Employee Benefit Obligation'
  ],
  'Equity': [
    'Paid-In Share Capital',
    'Share Premium Reserves',
    'Retained Earnings Accumulation',
    'Legal & Statutory Reserves',
    'Property Revaluation Reserves'
  ],
  'Revenue': [
    'Operating Service Revenues',
    'Commercial Sales Revenue',
    'Financial Interest Income',
    'Asset Disposal Gain Dividends',
    'Other Operating Income'
  ],
  'Cost of Sales': [
    'Direct Material Costs',
    'Direct Labor Salaries',
    'Production Overheads Allocation',
    'Subcontractor Procurement',
    'Import Duties & Port Charges'
  ],
  'Expense': [
    'Employee Work Compensation',
    'Administrative Overheads Cost',
    'Depreciation of Fixed Assets',
    'Amortization of Intangibles',
    'Finance & Bank Service Charge',
    'Selling & Distribution cost'
  ],
  'Cost': [
    'Raw Factory Production Overheads',
    'Research & Development Spend',
    'Project Phase Fulfillment Cost'
  ],
  'Statistical': [
    'FTE Employee Headcount Measures',
    'Physical Operational Capacity Keys',
    'Production Volume Counters'
  ],
  'Memorandum / Off-Balance Sheet': [
    'Guarantee Liabilities Issued',
    'Letters of Credit Commitments',
    'Pledged Bank Deposit Securities'
  ]
};

// 3. Subgroups categorization list for each Classification Group (Enables a 100% full dropdown list)
const GROUP_SUB_CATEGORIES: Record<string, string[]> = {
  'Cash & Bank Balances': ['Vault Cash Floating', 'Operational Cheque Balances', 'Foreign Currency Deposits', 'Petty Cash Accounts'],
  'Trade Receivables': ['Trade Debtors Active', 'Direct Credit Receivables', 'Inter-Company Receivables', 'Staff Advances Ledger'],
  'Inventory Stocks': ['Raw Goods Materials', 'Work In Progress Stock', 'Finished Production Inventory', 'Spares & Consumables'],
  'Prepayments & Advances': ['Prepaid Corporate Rent', 'Prepaid Insurance Premiums', 'Advances Paid to Contractors'],
  'Property, Plant & Equipment': ['Locomotives Machinery', 'Railway Steel Railing', 'Administrative Buildings', 'Office IT hardware'],
  'Intangible Assets': ['Enterprise ERP Licences', 'Corporate Trade Patents', 'Aquired Business Goodwill'],
  'Deferred Tax Assets': ['Deferred Corporate Tax Asset', 'Unutilized Tax Credits'],
  'Other Current Assets': ['Deposits For Utility Services', 'General Suspense Account'],
  'Trade Payables': ['Trade Vendors Active', 'Supplier Retention Payables', 'Due to Holding Entities'],
  'Short-Term Borrowings': ['Commercial Bank Overdraft', 'Bridge Loan Credit Facilities'],
  'Tax Authorities Liability': ['VAT 15% Payable', 'Withholding Direct Tax Payable', 'Corporate Income Tax Accrual'],
  'Accrued Liabilities & Provisions': ['Accrued Utility Invoices', 'Provision for Litigations', 'Auditing Fee Accrual'],
  'Long-Term Debt Obligations': ['Development Finance Loans', 'Corporate Bonds Outstanding'],
  'Deferred Tax Liabilities': ['Temporary Asset Difference Liability'],
  'Employee Benefit Obligation': ['Accrued Staff Severance', 'Pension Funds Withholding', 'Provisions for Annual Leave'],
  'Paid-In Share Capital': ['Ordinary Voting Capital', 'Preferred Non-Voting Capital'],
  'Share Premium Reserves': ['Capital Premium Realized', 'Additional Paid-In Surplus'],
  'Retained Earnings Accumulation': ['Prior Year Retained Funds', 'Current Year Retained Margin'],
  'Legal & Statutory Reserves': ['Committed Statutory Reserves', 'Legal Risk Funding Reserve'],
  'Property Revaluation Reserves': ['Asset Value Reset Adjustments'],
  'Operating Service Revenues': ['Locomotive Transport Earnings', 'Cargo Storage Revenue', 'Passenger Ticket Income'],
  'Commercial Sales Revenue': ['Direct Wholesale Income', 'Ancillary Material Sales'],
  'Financial Interest Income': ['Deposit Account Credits', 'Inter-Entity Interest Charge'],
  'Asset Disposal Gain Dividends': ['Gain on Retiring Locomotives', 'Dividends Received'],
  'Other Operating Income': ['Scrap Metal Sale Contracts', 'Warehouse Rent Income', 'Consultation Ticket Income'],
  'Direct Material Costs': ['Heavy Locomotive Diesel', 'Lubricants & Engine Oil', 'Spare Parts Installed'],
  'Direct Labor Salaries': ['Locomotive Operator Wages', 'Station Guard Salaries', 'Maintenance Technicians wages'],
  'Production Overheads Allocation': ['Machine Power Consumption', 'Factory Storage Utilities', 'Quality Inspection Cost'],
  'Subcontractor Procurement': ['Third-Party Mechanics', 'External Logistic Operators'],
  'Import Duties & Port Charges': ['ERCA Customs Customs Duties', 'Port Djibouti Fees', 'Freight Clearing Agency Cost'],
  'Employee Work Compensation': ['Administrative Staff Salary', 'Management Bonus Benefits', 'Medical Insurance Premiums'],
  'Administrative Overheads Cost': ['Office Rental Expense', 'Telecom & Internet Invoices', 'Stationery Supplies Spend'],
  'Depreciation of Fixed Assets': ['Depreciation-Rolling Stock', 'Depreciation-Buildings', 'Depreciation-Equipment'],
  'Amortization of Intangibles': ['Amortization-Software Licenses', 'Amortization-Patents'],
  'Finance & Bank Service Charge': ['Bank Guarantee Charges', 'Letter of Credit Opening fee', 'Foreign Exchange Loss'],
  'Selling & Distribution cost': ['Corporate Marketing Campaign', 'Client Entertainment Accounts'],
  'Raw Factory Production Overheads': ['Workplace Safety Spend', 'Production Tool Overheads'],
  'Research & Development Spend': ['Locomotive Upgrade Studies', 'Pilot Track Layout Design'],
  'Project Phase Fulfillment Cost': ['Adama Hub Civil Works', 'Dire Dawa Extension Planning'],
  'FTE Employee Headcount Measures': ['Core Operations Full Time staff', 'Temporary Technical Helpers'],
  'Physical Operational Capacity Keys': ['Locomotive Passenger Seats Count', 'Freight Wagon Load Capacity Tons'],
  'Production Volume Counters': ['Monthly Trip Miles Covered', 'Total Fuel Litres Burned'],
  'Guarantee Liabilities Issued': ['Performance Bonds Guaranteed', 'Standard Tender Bid Bonds'],
  'Letters of Credit Commitments': ['Documentary Credits Opened', 'Import Payment Commitments'],
  'Pledged Bank Deposit Securities': ['Margin Accounts Restrained', 'Collateral Frozen Deposits']
};

interface LabelTooltipProps {
  label: string;
  tooltipText: string;
  className?: string;
}

function LabelTooltip({ label, tooltipText, className = "" }: LabelTooltipProps) {
  return (
    <div className={`group relative inline-flex items-center gap-1.5 ${className}`}>
      <span className="block text-[11px] font-bold text-slate-700 uppercase cursor-help">{label}</span>
      <div className="inline-flex cursor-help text-slate-400 hover:text-indigo-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Tooltip Popup container */}
      <div className="absolute bottom-full left-0 mb-2.5 hidden group-hover:block z-50 w-64 p-2.5 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium tracking-normal normal-case leading-normal rounded shadow-xl animate-in fade-in slide-in-from-bottom-1 select-none pointer-events-none">
        <div className="relative">
          {tooltipText}
          <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
        </div>
      </div>
    </div>
  );
}

export default function AddEditAccountTab({
  accounts,
  selectedAccount,
  onSave,
  onCancel
}: AddEditAccountTabProps) {
  // --- FORM STATES ---
  const [accountType, setAccountType] = useState<AccountType>('Asset');
  const [ifrsClass, setIfrsClass] = useState<string>('Cash & Bank Balances');
  const [accountCategory, setAccountCategory] = useState<string>('Vault Cash Floating');

  const [openingBalanceDebit, setOpeningBalanceDebit] = useState<number>(0);
  const [openingBalanceCredit, setOpeningBalanceCredit] = useState<number>(0);

  const [code, setCode] = useState<string>('');
  const [isAutoCode, setIsAutoCode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [nameAmharic, setNameAmharic] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Classification & Hierarchy
  const [parentAccount, setParentAccount] = useState<string>('None');
  const [parentSearch, setParentSearch] = useState<string>('');
  const [showParentDropdown, setShowParentDropdown] = useState<boolean>(false);
  const [branchDetail, setBranchDetail] = useState<string>('Addis Ababa Central Branch');

  // Control options and mapping
  const [isControlAccount, setIsControlAccount] = useState<boolean>(false);
  const [allowDirectPosting, setAllowDirectPosting] = useState<boolean>(true);
  const [reconciliationRequired, setReconciliationRequired] = useState<boolean>(false);
  const [subledger, setSubledger] = useState<string>('None');

  // Taxes, reference & dimensions
  const [ethiopianTaxTreatment, setEthiopianTaxTreatment] = useState<string>('VAT 15% Standard');
  const [ifrsRef, setIfrsRef] = useState<string>('IFRS 9 - Financial Instruments Standard');
  
  const [dimensionCCRequired, setDimensionCCRequired] = useState<boolean>(true);
  const [dimensionProjectRequired, setDimensionProjectRequired] = useState<boolean>(false);
  const [dimensionBURequired, setDimensionBURequired] = useState<boolean>(true);

  // Administrative
  const [status, setStatus] = useState<AccountStatus>('Active');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Automatically select the normal balance based on Account Type
  const balance = useMemo<BalanceType>(() => {
    return TYPE_TO_BALANCE[accountType] || 'Debit';
  }, [accountType]);

  // 5. Dynamic dropdown option data updates
  const availableGroups = useMemo<string[]>(() => {
    return ACCOUNT_TYPE_CATEGORIES[accountType] || ['Cash & Bank Balances'];
  }, [accountType]);

  const availableCategories = useMemo<string[]>(() => {
    return GROUP_SUB_CATEGORIES[ifrsClass] || ['Vault Cash Floating'];
  }, [ifrsClass]);

  // Sync classification dropdowns on type or group changes
  useEffect(() => {
    const defaultGroup = availableGroups[0] || 'Cash & Bank Balances';
    setIfrsClass(defaultGroup);
  }, [accountType, availableGroups]);

  useEffect(() => {
    const defaultCat = availableCategories[0] || 'Vault Cash Floating';
    setAccountCategory(defaultCat);
  }, [ifrsClass, availableCategories]);

  // Dynamic next account code sequence suggestions
  const suggestedNextCode = useMemo<string>(() => {
    let prefix = '1';
    if (accountType === 'Asset') prefix = '1';
    else if (accountType === 'Liability') prefix = '2';
    else if (accountType === 'Equity') prefix = '3';
    else if (accountType === 'Revenue') prefix = '4';
    else if (accountType === 'Cost of Sales') prefix = '5';
    else if (accountType === 'Expense') prefix = '6';
    else if (accountType === 'Statistical') prefix = '7';
    else if (accountType === 'Memorandum / Off-Balance Sheet') prefix = '8';
    else if (accountType === 'Cost') prefix = '9';

    if (parentAccount && parentAccount !== 'None') {
      prefix = parentAccount;
    }

    const siblingCodes = accounts
      .filter(a => a.parentAccount === parentAccount && a.code.startsWith(prefix))
      .map(a => parseInt(a.code, 10))
      .filter(num => !isNaN(num));

    if (siblingCodes.length > 0) {
      const maxCode = Math.max(...siblingCodes);
      return (maxCode + 1).toString();
    } else {
      return (parentAccount && parentAccount !== 'None') ? `${parentAccount}01` : `${prefix}1000`;
    }
  }, [accountType, parentAccount, accounts]);

  useEffect(() => {
    if (isAutoCode && suggestedNextCode && !selectedAccount) {
      setCode(suggestedNextCode);
    }
  }, [isAutoCode, suggestedNextCode, selectedAccount]);

  // Filter parents to those matching the current type
  const availableParents = useMemo(() => {
    return [...accounts]
      .filter(a => a.accountType === accountType)
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  }, [accounts, accountType]);

  const searchedParents = useMemo(() => {
    if (!parentSearch) return availableParents;
    return availableParents.filter(p => 
      p.code.includes(parentSearch) || 
      p.name.toLowerCase().includes(parentSearch.toLowerCase())
    );
  }, [availableParents, parentSearch]);

  const parentNodeObj = useMemo(() => {
    return accounts.find(a => a.code === parentAccount);
  }, [parentAccount, accounts]);

  const computedLevel = useMemo(() => {
    if (parentAccount === 'None') return 1;
    return parentNodeObj ? (parentNodeObj.level || 1) + 1 : 1;
  }, [parentAccount, parentNodeObj]);

  const hierarchyPath = useMemo(() => {
    if (parentAccount === 'None') {
      return `Root Master Account ➔ ${code || '?'}_${name || 'GL Account Name'}`;
    }
    const path: string[] = [];
    let currentCode = parentAccount;
    let limit = 0;
    while (currentCode && currentCode !== 'None' && limit < 6) {
      const node = accounts.find(a => a.code === currentCode);
      if (node) {
        path.unshift(`${node.code} ${node.name.split(' (')[0]}`);
        currentCode = node.parentAccount;
      } else {
        break;
      }
      limit++;
    }
    path.push(`${code || '?'}_${name || 'GL Account'}`);
    return path.join(' ➔ ');
  }, [parentAccount, code, name, accounts]);

  // Edit load handler
  useEffect(() => {
    if (selectedAccount) {
      setAccountType(selectedAccount.accountType);
      setIfrsClass(selectedAccount.ifrsClass || selectedAccount.group || 'Cash & Bank Balances');
      setAccountCategory(selectedAccount.subgroup || 'Vault Cash Floating');
      setCode(selectedAccount.code);
      
      const cleanName = selectedAccount.name || '';
      const parts = cleanName.match(/(.*?)\s*\((.*?)\)$/);
      if (parts) {
        setName(parts[1]);
        setNameAmharic(parts[2]);
      } else {
        setName(cleanName);
        setNameAmharic('');
      }
      
      setDescription(selectedAccount.auditTrailNotes || '');
      setIsControlAccount(selectedAccount.controlAccount || false);
      setAllowDirectPosting(selectedAccount.postingAllowed);
      setParentAccount(selectedAccount.parentAccount || 'None');
      setBranchDetail(selectedAccount.branch || 'Addis Ababa Central Branch');
      setStatus(selectedAccount.status || 'Active');
      
      if (selectedAccount.slType && selectedAccount.slType !== 'None') {
        setSubledger(selectedAccount.slType);
      } else {
        setSubledger('None');
      }
      
      setEthiopianTaxTreatment(selectedAccount.ethiopianTaxCategory || 'VAT 15% Standard');
      setOpeningBalanceDebit(selectedAccount.openingBalanceDebit || 0);
      setOpeningBalanceCredit(selectedAccount.openingBalanceCredit || 0);
    } else {
      handleQuickFill('cash');
      setOpeningBalanceDebit(0);
      setOpeningBalanceCredit(0);
    }
  }, [selectedAccount]);

  // Live validator
  const validations = useMemo(() => {
    const isEditing = !!selectedAccount;
    const isDup = accounts.some(a => a.code === code && (!isEditing || a.code !== selectedAccount?.code));
    return {
      codeEmpty: !code,
      codeFormatWrong: code ? !/^\d{3,10}$/.test(code) : false,
      codeDuplicate: isDup,
      nameEmpty: !name.trim(),
      allValid: !(!code || isDup || !name.trim() || !/^\d{3,10}$/.test(code))
    };
  }, [code, name, accounts, selectedAccount]);

  // Handle Preset Prefill Events
  const handleQuickFill = (preset: 'cash' | 'transport' | 'fuel') => {
    if (preset === 'cash') {
      setAccountType('Asset');
      setIfrsClass('Cash & Bank Balances');
      setAccountCategory('Vault Cash Floating');
      setParentAccount('None');
      setCode('1111');
      setName('Main Vault Float');
      setNameAmharic('ጥሬ ገንዘብ በካዝና');
      setDescription('Unrestricted physical cash vault counts. Managed inside the main offices.');
      setBranchDetail('Addis Ababa Central Branch');
      setIsControlAccount(false);
      setAllowDirectPosting(true);
      setReconciliationRequired(true);
      setSubledger('Cash');
      setEthiopianTaxTreatment('VAT Exempt Services');
      setIfrsRef('IFRS 9 - Financial Instruments Standard');
      showToast('Prefilled Cash at Hand standard settings.');
    } else if (preset === 'transport') {
      setAccountType('Revenue');
      setIfrsClass('Operating Service Revenues');
      setAccountCategory('Locomotive Transport Earnings');
      setParentAccount('None');
      setCode('4110');
      setName('Train Logistics Revenue');
      setNameAmharic('የባቡር ትራንስፖርት አገልግሎት ገቢ');
      setDescription('Operating revenues generated from commercial rail operations.');
      setBranchDetail('Dire Dawa Regional Branch');
      setIsControlAccount(false);
      setAllowDirectPosting(true);
      setReconciliationRequired(false);
      setSubledger('None');
      setEthiopianTaxTreatment('VAT 15% Standard');
      setIfrsRef('IFRS 15 - Revenue from Contracts Standard');
      showToast('Prefilled Train Service Revenue standard settings.');
    } else if (preset === 'fuel') {
      setAccountType('Expense');
      setIfrsClass('Employee Work Compensation');
      setAccountCategory('Employee Work Compensation');
      setParentAccount('None');
      setCode('6120');
      setName('Locomotive Fuel Dispatch');
      setNameAmharic('የባቡር ነዳጅ ወጪ');
      setDescription('Procurement of heavy heavy-duty locomotive diesel fuels.');
      setBranchDetail('Addis Ababa Central Branch');
      setIsControlAccount(false);
      setAllowDirectPosting(true);
      setReconciliationRequired(false);
      setSubledger('None');
      setEthiopianTaxTreatment('Withholding Tax 2% (Goods)');
      setIfrsRef('IAS 1 - Presentation of Financial Statements');
      showToast('Prefilled Locomotive Fuel Expense standard settings.');
    }
  };

  // Build accounting payload & fire callbacks
  const compilePayload = (): Account | null => {
    if (validations.codeEmpty) {
      showToast('Error: Please enter a registry Account Code.');
      return null;
    }
    if (validations.codeFormatWrong) {
      showToast('Error: Account Code must be between 3 and 10 digits.');
      return null;
    }
    if (validations.codeDuplicate) {
      showToast('Error: Account Code is already in active use.');
      return null;
    }
    if (validations.nameEmpty) {
      showToast('Error: English Account Name is required.');
      return null;
    }

    return {
      id: code,
      code,
      name: nameAmharic ? `${name} (${nameAmharic})` : name,
      parentAccount,
      level: computedLevel,
      company: COMPANIES[0],
      branch: branchDetail,
      accountType,
      group: ifrsClass,
      subgroup: accountCategory,
      ifrsClass,
      financialStatementLine: ifrsClass,
      postingAllowed: allowDirectPosting,
      controlAccount: isControlAccount,
      manualJournalAllowed: !isControlAccount,
      systemPostingOnly: isControlAccount,
      slType: subledger as SLType,
      vatCode: ethiopianTaxTreatment.includes('VAT 15%') ? 'VAT-15' : 'VAT-EXEMPT',
      whtCode: ethiopianTaxTreatment.includes('Withholding') ? 'WHT-2' : 'WHT-N/A',
      ethiopianTaxCategory: ethiopianTaxTreatment,
      costCenter: dimensionCCRequired ? 'Mandatory' : 'Optional',
      department: 'Optional',
      project: dimensionProjectRequired ? 'Mandatory' : 'Optional',
      segment: dimensionBURequired ? 'Mandatory' : 'Optional',
      profitCenter: 'Optional',
      status: status,
      approvalStatus: 'Approved', // Save & Close / Save & New bypass draft review flow
      balance,
      openingBalanceDebit: openingBalanceDebit || 0,
      openingBalanceCredit: openingBalanceCredit || 0,
      createdBy: 'mzerihun01@gmail.com',
      auditTrailNotes: description || `Pre-configured via standard accounting template.`
    };
  };

  const handleSaveAndNew = () => {
    const payload = compilePayload();
    if (!payload) return;
    onSave(payload);
    showToast(`Successfully registered account ${payload.code} - ${name}! Preparing fresh form...`);
    
    // Clear for fresh entry
    setCode(suggestedNextCode);
    setName('');
    setNameAmharic('');
    setDescription('');
    setIsControlAccount(false);
    setAllowDirectPosting(true);
    setReconciliationRequired(false);
    setSubledger('None');
    setOpeningBalanceDebit(0);
    setOpeningBalanceCredit(0);
  };

  const handleSaveAndClose = () => {
    const payload = compilePayload();
    if (!payload) return;
    onSave(payload);
    showToast(`Successfully registered account ${payload.code}! Closing...`);
    setTimeout(() => {
      onCancel();
    }, 800);
  };

  return (
    <div className="bg-[#f1f5f9] text-slate-800 min-h-screen p-3 md:p-4 font-sans space-y-3.5">
      
      {/* Dynamic Slide Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean low-profile title header */}
      <div className="flex justify-between items-center bg-white px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm">
        <h1 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-indigo-600" />
          {selectedAccount ? `Configure GL Code: ${selectedAccount.code}` : 'Register New Ledger Position'}
        </h1>
        <button
          onClick={onCancel}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider border border-slate-200 px-3 py-1 rounded transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Split Compact Layout to prevent unneeded screen consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* main Form Content column */}
        <div className="lg:col-span-2 space-y-3">
          
          <div className="bg-white border border-slate-200 rounded-lg p-3 md:p-4 shadow-sm space-y-3.5">
            
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-450" />
              Primary Core Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Account type selector - No brackets */}
              <div>
                <LabelTooltip label="Account Type" tooltipText="The physical asset, liability, equity, or operational revenue/expense class. Controls normal balance behavior & default groupings." className="mb-1" />
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Cost of Sales">Cost of Sales</option>
                  <option value="Expense">Expense</option>
                  <option value="Cost">Cost</option>
                  <option value="Statistical">Statistical</option>
                  <option value="Memorandum / Off-Balance Sheet">Memorandum / Off-Balance Sheet</option>
                </select>
              </div>

              {/* Account Code field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <LabelTooltip label="Account Code" tooltipText="The unique registry number for this general ledger account. Can be manual or auto-sequenced based on parent guidelines." />
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id="auto-gen-check"
                      checked={isAutoCode}
                      onChange={(e) => setIsAutoCode(e.target.checked)}
                      className="w-3 h-3 rounded text-slate-600 focus:ring-opacity-0 focus:ring-0"
                    />
                    <label htmlFor="auto-gen-check" className="text-[10px] text-slate-500 cursor-pointer">Auto Sequence</label>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isAutoCode}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1020"
                    className="w-full text-xs p-2 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono tracking-wider"
                  />
                  {!isAutoCode && suggestedNextCode && (
                    <button
                      type="button"
                      onClick={() => setCode(suggestedNextCode)}
                      title="Insert system sequenced suggestion to bypass manual code errors"
                      className="absolute right-2 top-2 text-[9.5px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5 font-bold"
                    >
                      <RefreshCw className="w-2.5 h-2.5 animate-spin-hover" />
                      Suggest
                    </button>
                  )}
                </div>
                {validations.codeDuplicate && (
                  <span className="text-[10px] text-rose-600 font-bold block mt-1">Code already reserved inside general chart!</span>
                )}
              </div>

              {/* Dynamic Group Grouping (Categorize in other way for each account type requested) */}
              <div>
                <LabelTooltip label="Functional Group Classification" tooltipText="Dynamic primary group classifications mapped with IFRS guidelines for structural reporting lines." className="mb-1" />
                <select
                  value={ifrsClass}
                  onChange={(e) => setIfrsClass(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {availableGroups.map((groupOpt) => (
                    <option key={groupOpt} value={groupOpt}>{groupOpt}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Categorization */}
              <div>
                <LabelTooltip label="Subgroup Subcategory" tooltipText="The secondary subcategory level that aggregates specific transactional lines in reports." className="mb-1" />
                <select
                  value={accountCategory}
                  onChange={(e) => setAccountCategory(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {availableCategories.map((subOpt) => (
                    <option key={subOpt} value={subOpt}>{subOpt}</option>
                  ))}
                </select>
              </div>

              {/* English Account Name */}
              <div>
                <LabelTooltip label="GL Account Name (English)" tooltipText="Official English name description of this ledger account, e.g., Cash or Cash equivalents." className="mb-1" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Accounts Receivable Main"
                  className="w-full text-xs p-2 bg-white border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
              </div>

              {/* Amharic Account Name */}
              <div>
                <LabelTooltip label="የሂሳብ መደብ ስም (Amharic)" tooltipText="The exact Amharic equivalent translation name for local Ethiopian banking audits and tax filings." className="mb-1" />
                <input
                  type="text"
                  value={nameAmharic}
                  onChange={(e) => setNameAmharic(e.target.value)}
                  placeholder="Amharic layout input representation"
                  className="w-full text-xs p-2 bg-white border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans text-slate-800"
                />
              </div>

              {/* Parent account selector */}
              <div className="md:col-span-2 relative">
                <LabelTooltip label="Parent Account" tooltipText="The parent account under which this new child account falls. Used to generate consolidated multi-level trial balances." className="mb-1" />
                <div 
                  onClick={() => setShowParentDropdown(!showParentDropdown)}
                  className="flex items-center justify-between border border-slate-250 bg-slate-50 p-2 text-xs rounded shadow-inner cursor-pointer hover:bg-slate-100/70 transition"
                >
                  <span className="font-medium text-slate-750">
                    {parentAccount === 'None' ? 'None (Top Level Root Account Node)' : `${parentAccount} - ${accounts.find(a => a.code === parentAccount)?.name || ''}`}
                  </span>
                  <span className="text-[10px] text-indigo-700 font-bold underline">
                    {showParentDropdown ? 'Hide List' : 'Select Parent Account'}
                  </span>
                </div>

                {showParentDropdown && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg p-2.5 max-h-52 overflow-y-auto space-y-1 shadow-lg ring-1 ring-black/5">
                    <input
                      type="text"
                      placeholder="Search master list hierarchies by digits or codes..."
                      value={parentSearch}
                      onChange={(e) => setParentSearch(e.target.value)}
                      className="w-full p-1.5 text-[10.5px] border border-slate-200 rounded bg-slate-50 focus:outline-none"
                    />
                    <div className="space-y-0.5 pt-1">
                      <div 
                        onClick={() => {
                          setParentAccount('None');
                          setShowParentDropdown(false);
                        }}
                        className={`p-1.5 text-[10px] rounded cursor-pointer leading-tight transition ${parentAccount === 'None' ? 'bg-indigo-50 border border-indigo-200 font-bold text-indigo-700' : 'hover:bg-slate-50 text-slate-650'}`}
                      >
                        None (Independent Root Entity Node Level-1)
                      </div>
                      {searchedParents.map(parentItem => (
                        <div 
                          key={parentItem.code}
                          onClick={() => {
                            setParentAccount(parentItem.code);
                            setShowParentDropdown(false);
                          }}
                          className={`p-1.5 text-[10px] rounded cursor-pointer leading-tight border transition ${parentAccount === parentItem.code ? 'bg-indigo-50 border-indigo-200 font-bold text-indigo-700' : 'border-transparent hover:bg-slate-50 text-slate-700'}`}
                        >
                          <span className="font-mono font-semibold text-slate-500 mr-2">[{parentItem.code}]</span>
                          {parentItem.name.split(' (')[0]}
                        </div>
                      ))}
                      {searchedParents.length === 0 && (
                        <p className="text-[10px] text-slate-400 font-medium text-center py-2">No matching parent accounts available for current type selection.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Standard text description */}
              <div className="md:col-span-2">
                <LabelTooltip label="Explanation Note" tooltipText="Detailed justification log for audit reviews. Notes here appear in ledger history logs." className="mb-1" />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Record compliance reasonings or explanation notes for future audit review checklists..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 leading-normal"
                />
              </div>

            </div>

          </div>

          {/* Compliance, tax & auxiliary fields (Tighter styling, small space-y) */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 md:p-4 shadow-sm space-y-3">
            
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-450" />
              Auxiliary Compliance & ERCA Tax rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Branch Selection */}
              <div>
                <LabelTooltip label="Branch Facility Designation" tooltipText="The specific enterprise branch or warehouse location that owns this general ledger account position." className="mb-1" />
                <select
                  value={branchDetail}
                  onChange={(e) => setBranchDetail(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="Addis Ababa Central Branch">Addis Ababa Central Branch</option>
                  <option value="Dire Dawa Regional Branch">Dire Dawa Regional Branch</option>
                  <option value="Hawassa Southern Branch">Hawassa Southern Branch</option>
                  <option value="Adama Eastern Branch">Adama Eastern Branch</option>
                  <option value="Bahir Dar Northern Branch">Bahir Dar Northern Branch</option>
                  <option value="Mekelle District Branch">Mekelle District Branch</option>
                  <option value="Dessie Hub Branch">Dessie Hub Branch</option>
                  <option value="Gondar North-West Branch">Gondar North-West Branch</option>
                </select>
              </div>

              {/* Subsidiary Ledger map */}
              <div>
                <LabelTooltip label="Subledger Mapping Controls" tooltipText="Ties this account to an auxiliary register (such as Vendor, Bank, or Customer) to enforce strict sub-ledger reconciliation." className="mb-1" />
                <select
                  value={subledger}
                  onChange={(e) => setSubledger(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="None">None (Standard direct Ledger posting allowed)</option>
                  <option value="Customer">Customer (Enforces auxiliary trade debtors ledger tracking)</option>
                  <option value="Supplier">Supplier (Enforces auxiliary trade creditors ledger tracking)</option>
                  <option value="Fixed Asset">Fixed Asset (Binds registry item directly to plant machinery catalog)</option>
                  <option value="Inventory">Inventory (Ties movement accounts with storage log files)</option>
                  <option value="Bank">Bank (Enforces monthly bank statement reconciliations)</option>
                  <option value="Cash">Cash (Physical general vault accounts reconciliation constraints)</option>
                  <option value="Employee">Employee (Direct payables mapping configurations)</option>
                  <option value="Tax Authority">Tax Authority (Required withholding & VAT records tracking)</option>
                </select>
              </div>

              {/* Ethiopian tax categorization */}
              <div>
                <LabelTooltip label="ERCA Tax Standard Level" tooltipText="Controls the automated tax calculation mappings to conform directly to Ethiopian Revenue & Customs Authority guidelines." className="mb-1" />
                <select
                  value={ethiopianTaxTreatment}
                  onChange={(e) => setEthiopianTaxTreatment(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="VAT 15% Standard">VAT 15% Standard Rate</option>
                  <option value="VAT Exempt Services">VAT Exempt Transactions</option>
                  <option value="Withholding Tax 2% (Goods)">Withholding 2% standard Goods Tax</option>
                  <option value="Withholding Tax 3% (Services)">Withholding 3% standard Services Tax</option>
                  <option value="Direct Tax Exempt">Direct Income Exemption Treatment</option>
                  <option value="Zero-Rated VAT Revenue">VAT Zero-Rated Export Revenue</option>
                </select>
              </div>

              {/* IFRS standard reference list */}
              <div>
                <LabelTooltip label="Global IFRS IAS Audit Reference" tooltipText="The precise standard (e.g., IFRS 9 or IAS 16) used to govern asset valuation, recognition thresholds, and presentations." className="mb-1" />
                <select
                  value={ifrsRef}
                  onChange={(e) => setIfrsRef(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-250 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="IFRS 9 - Financial Instruments Standard">IFRS 9 - Standard Financial Instruments Definition</option>
                  <option value="IFRS 15 - Revenue from Contracts Standard">IFRS 15 - Five Step Contract Revenue Standard</option>
                  <option value="IAS 16 - Property, Plant and Equipment">IAS 16 - Material Asset Valuation And Depreciation</option>
                  <option value="IAS 2 - Inventories Valuation">IAS 2 - Raw Stock Valuation Standards Criteria</option>
                  <option value="IAS 1 - Presentation of Financial Statements">IAS 1 - Overall Ledger Report Classification Standards</option>
                  <option value="IAS 37 - Provisions and Contingent Liabilities">IAS 37 - Accruals & Pending Legal Provisions Standard</option>
                  <option value="IAS 12 - Income Taxes Regulatory Class">IAS 12 - Standard Deferred Tax Disclosing Criteria</option>
                  <option value="IFRS 16 - Leases Recognition">IFRS 16 - Right-of-Use Leased Assets Disclosings</option>
                </select>
              </div>

            </div>

            {/* Posting and Dimension toggles layout (Tighter padding) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 justify-center">
                <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">Posting Constraints</span>
                
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="posting-allowed"
                    checked={allowDirectPosting}
                    onChange={(e) => setAllowDirectPosting(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="posting-allowed" className="text-slate-700 font-semibold cursor-pointer">Allow Direct manual journal uploads</label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="is-control"
                    checked={isControlAccount}
                    onChange={(e) => setIsControlAccount(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="is-control" className="text-slate-700 font-semibold cursor-pointer">Mark as System-Posting Control Account</label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id="reconcile"
                    checked={reconciliationRequired}
                    onChange={(e) => setReconciliationRequired(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="reconcile" className="text-slate-700 font-semibold cursor-pointer">Require transaction audit reconcile checks</label>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">Active Audit Dimensions Required</span>
                
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dimensionCCRequired}
                      onChange={(e) => setDimensionCCRequired(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Cost Center</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dimensionProjectRequired}
                      onChange={(e) => setDimensionProjectRequired(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Project ID</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dimensionBURequired}
                      onChange={(e) => setDimensionBURequired(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Business Unit</span>
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 block italic leading-normal">
                  Downstream journal postings will block automatically if toggled dimensions are blank or missing valid metadata fields.
                </span>
              </div>

            </div>

          </div>

          {/* 💵 PEACHTREE-STYLE OPENING BALANCE CONTROL CARD */}
          <div className="bg-amber-50/45 border border-amber-200/80 rounded-lg p-3 md:p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-amber-900 uppercase border-b border-amber-200/60 pb-1.5 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Peachtree-Style Ledger Opening Balance Configurator</span>
            </h3>
            <p className="text-[10px] text-amber-850/90 leading-tight">
              Enter the initial layout balance for this specific General Ledger account. For previously created accounts and newly initialized ones, setting this updates the absolute beginning trial balances.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelTooltip label="Opening Debit Balance (ETB)" tooltipText="Starting Debit balance in Ethiopian Birr (ETB). Standard Asset and Expense accounts carry Debit opening positions." className="mb-1 text-slate-800" />
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-[10px] font-black text-slate-400">ETB</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={openingBalanceDebit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setOpeningBalanceDebit(val);
                      if (val > 0) setOpeningBalanceCredit(0);
                    }}
                    placeholder="0.00"
                    className="w-full text-xs pl-10 p-2 bg-white border border-slate-250 rounded shadow-inner font-mono focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>
              </div>
              <div>
                <LabelTooltip label="Opening Credit Balance (ETB)" tooltipText="Starting Credit balance in Ethiopian Birr (ETB). Standard Liability, Equity and Revenue accounts carry Credit opening positions." className="mb-1 text-slate-800" />
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-[10px] font-black text-slate-400">ETB</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={openingBalanceCredit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setOpeningBalanceCredit(val);
                      if (val > 0) setOpeningBalanceDebit(0);
                    }}
                    placeholder="0.00"
                    className="w-full text-xs pl-10 p-2 bg-white border border-slate-250 rounded shadow-inner font-mono focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/60 p-2.5 rounded-lg border border-amber-200/50 text-[9.5px] text-amber-900 leading-tight">
              <strong>Balance Note:</strong> Normal corporate accounting principles specify that accounts hold a net opening balance on one side (either Debit or Credit). Entering a value in either side will automatically clear out the other side to remain strict-compliant.
            </div>
          </div>

          {/* Rapid Action Buttons instead of draft split layout */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap gap-2.5 justify-end shadow-inner">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 border border-slate-200 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndNew}
              disabled={!validations.allValid}
              className="px-4 py-2 text-xs font-bold bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Save & Create New
            </button>
            <button
              onClick={handleSaveAndClose}
              disabled={!validations.allValid}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Close Panel
            </button>
          </div>

        </div>

        {/* Dynamic Context Panel and Real-time Auditing rules list */}
        <div className="space-y-3 col-span-1">
          
          {/* Card 1: Hierarchy Tree path */}
          <div className="bg-slate-900 text-white rounded-lg p-3.5 space-y-2 border border-slate-800 shadow">
            <h4 className="text-[10.5px] font-bold text-indigo-300 uppercase tracking-widest">
              Live hierarchy Tree positioning
            </h4>
            <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
              <span className="text-[11px] font-mono block text-emerald-450 whitespace-pre-wrap leading-tight">
                {hierarchyPath}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div>
                <span className="text-slate-400 block border-b border-slate-800 pb-0.5">Assigned Level</span>
                <span className="font-bold text-slate-100 font-mono">Level {computedLevel} Node</span>
              </div>
              <div>
                <span className="text-slate-400 block border-b border-slate-800 pb-0.5">Ledger Status</span>
                <span className="font-bold text-slate-100">{status}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Auto validation rules panel (Replaces visual tooltips helper text requested) */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-indigo-550" />
              Computed Balances & Rules
            </h4>

            <div className="space-y-2 text-[11px] text-slate-650">
              
              <div className="flex items-center justify-between p-1 bg-slate-50 rounded">
                <span>Account Code Audit:</span>
                {validations.codeEmpty ? (
                  <span className="text-rose-600 font-bold bg-rose-50 px-1 rounded">Required</span>
                ) : validations.codeFormatWrong ? (
                  <span className="text-rose-700 font-bold bg-rose-50 px-1 rounded">3-10 Digits</span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">Valid Code format</span>
                )}
              </div>

              <div className="flex items-center justify-between p-1 bg-slate-50 rounded">
                <span>English Name Definition:</span>
                {validations.nameEmpty ? (
                  <span className="text-rose-600 font-bold bg-rose-50 px-1 rounded">Required</span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">Identified</span>
                )}
              </div>

              <div className="flex items-center justify-between p-1 bg-slate-50 rounded">
                <span>Normal Balance Rule:</span>
                <span className="text-indigo-700 font-bold bg-indigo-50 px-1 rounded font-mono">
                  {balance === 'Debit' ? 'DEBIT (Asset/Expense)' : 'CREDIT (Liability/Equity/Revenue)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-1 bg-slate-50 rounded">
                <span>Ethiopian Tax treatment:</span>
                <span className="text-slate-700 font-mono font-bold bg-slate-100 px-1 rounded-sm">
                  {ethiopianTaxTreatment}
                </span>
              </div>

            </div>

            <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
              Normal balance is dynamic and locked. Changing the primary Account Type will instantly recalculate downstream trial balance properties.
            </p>
          </div>

          {/* Card 3: Form Status Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Administrative History
            </h4>
            <div className="space-y-1 text-[10.5px] text-slate-500">
              <div className="flex justify-between">
                <span>Registry Owner:</span>
                <span className="font-mono text-slate-700">mzerihun01@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Enterprise Host:</span>
                <span className="text-slate-700 font-semibold">QM ERP Node AWS</span>
              </div>
              <div className="flex justify-between">
                <span>Ledger Standard:</span>
                <span className="text-slate-700">IFRS 15 / IFRS 9 System</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

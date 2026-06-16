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
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Info,
  Lock,
  Unlock,
  Copy,
  Plus,
  Search,
  FileSpreadsheet,
  Check,
  Trash2,
  Settings,
  Layers,
  Sparkles,
  AlertTriangle,
  Activity,
  CornerDownRight
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

interface AddEditAccountTabProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSave: (account: Account) => void;
  onCancel: () => void;
}

// Security Roles for Enterprise Governance
type ERPRole = 'Viewer' | 'Accountant' | 'Senior Accountant' | 'Finance Manager' | 'Administrator';

export default function AddEditAccountTab({
  accounts,
  selectedAccount,
  onSave,
  onCancel
}: AddEditAccountTabProps) {
  // --- SUB-TABS ON THE WIZARD WORKSPACE ---
  const [wizardMode, setWizardMode] = useState<'single' | 'bulk' | 'import' | 'templates'>('single');

  // --- SECURITY / ROLE-BASED ACTIVE STATE ---
  const [currentRole, setCurrentRole] = useState<ERPRole>('Finance Manager');

  // --- WIZARD FORM STATE ---
  const [step, setStep] = useState<number>(1);
  const [company, setCompany] = useState<string>(COMPANIES[0]);
  const [branch, setBranch] = useState<string>(BRANCHES[0]);
  const [accountType, setAccountType] = useState<AccountType | ''>('');
  const [group, setGroup] = useState<string>(''); // Financial Statement Section
  const [subgroup, setSubgroup] = useState<string>(''); // Account Category
  const [parentAccount, setParentAccount] = useState<string>('None');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [nameAmharic, setNameAmharic] = useState<string>('');
  
  // Posting Controls
  const [postingAllowed, setPostingAllowed] = useState<boolean>(true);
  const [isHeaderAccount, setIsHeaderAccount] = useState<boolean>(false);
  const [controlAccount, setControlAccount] = useState<boolean>(false);
  const [manualJournalAllowed, setManualJournalAllowed] = useState<boolean>(true);
  const [systemPostingOnly, setSystemPostingOnly] = useState<boolean>(false);

  // Subledger
  const [slType, setSlType] = useState<SLType>('None');

  // Tax, Compliance & Currency
  const [vatCode, setVatCode] = useState<string>(VAT_CODES[4]); // N/A
  const [whtCode, setWhtCode] = useState<string>(WHT_CODES[3]); // N/A
  const [ethiopianTaxCategory, setEthiopianTaxCategory] = useState<string>(ETHIOPIAN_TAX_CATEGORIES[0]);
  const [currency, setCurrency] = useState<string>('ETB');
  const [multiCurrency, setMultiCurrency] = useState<boolean>(false);
  const [revaluationRequired, setRevaluationRequired] = useState<boolean>(false);

  // Reporting Dimensions Configuration state (configurable by Admin)
  const [dimensionConfigs, setDimensionConfigs] = useState<Record<string, 'Mandatory' | 'Optional' | 'Not Required'>>({
    costCenter: 'Optional',
    project: 'Optional',
    department: 'Optional',
    region: 'Optional',
    profitCenter: 'Optional',
    businessUnit: 'Optional'
  });

  // Selected values for dimensions
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('CC-DEFAULT');
  const [selectedProject, setSelectedProject] = useState<string>('PRJ-NA');

  // Collapsible accordion triggers for advanced controls page
  const [showPostingControls, setShowPostingControls] = useState<boolean>(true);
  const [showTaxCurrency, setShowTaxCurrency] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);

  // Audit and status
  const [status, setStatus] = useState<AccountStatus>('Draft');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Not Submitted');
  const [balance, setBalance] = useState<BalanceType>('Debit');
  const [auditTrailNotes, setAuditTrailNotes] = useState<string>('');
  const [ifrsClass, setIfrsClass] = useState<string>(IFRS_CLASSES[0]);

  // Loading States for auto check / step changes
  const [isValidatingCode, setIsValidatingCode] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  // Search filter for parents
  const [parentSearch, setParentSearch] = useState<string>('');

  // Bulk creation state
  const [bulkRows, setBulkRows] = useState<Array<{ code: string; name: string; type: AccountType; group: string; subgroup: string }>>([
    { code: '', name: '', type: 'Asset', group: 'Current Assets', subgroup: 'Cash at Hand' }
  ]);

  // Excel Import state
  const [importText, setImportText] = useState<string>('');
  const [importPreview, setImportPreview] = useState<Array<{ code: string; name: string; type: AccountType; error?: string }>>([]);

  // --- DRAFT MECHANISM (Exit & Resume Later) ---
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // Load selected account if editing
  useEffect(() => {
    if (selectedAccount) {
      setCompany(selectedAccount.company || COMPANIES[0]);
      setBranch(selectedAccount.branch || BRANCHES[0]);
      setAccountType(selectedAccount.accountType);
      setGroup(selectedAccount.group || '');
      setSubgroup(selectedAccount.subgroup || '');
      setParentAccount(selectedAccount.parentAccount || 'None');
      setCode(selectedAccount.code);
      setName(selectedAccount.name);
      setPostingAllowed(selectedAccount.postingAllowed);
      setIsHeaderAccount(!selectedAccount.postingAllowed);
      setControlAccount(selectedAccount.controlAccount || false);
      setManualJournalAllowed(selectedAccount.manualJournalAllowed);
      setSystemPostingOnly(selectedAccount.systemPostingOnly || false);
      setSlType(selectedAccount.slType || 'None');
      setVatCode(selectedAccount.vatCode || VAT_CODES[4]);
      setWhtCode(selectedAccount.whtCode || WHT_CODES[3]);
      setEthiopianTaxCategory(selectedAccount.ethiopianTaxCategory || ETHIOPIAN_TAX_CATEGORIES[0]);
      setStatus(selectedAccount.status || 'Draft');
      setApprovalStatus(selectedAccount.approvalStatus || 'Not Submitted');
      setBalance(selectedAccount.balance || 'Debit');
      setIfrsClass(selectedAccount.ifrsClass || IFRS_CLASSES[0]);
      setAuditTrailNotes(selectedAccount.auditTrailNotes || '');
    } else {
      // Check local storage for exit & resume draft
      const saved = localStorage.getItem('qm_coa_wizard_draft');
      if (saved) {
        setHasSavedDraft(true);
      }
    }
  }, [selectedAccount]);

  const loadSavedDraft = () => {
    const saved = localStorage.getItem('qm_coa_wizard_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setCompany(d.company || COMPANIES[0]);
        setBranch(d.branch || BRANCHES[0]);
        setAccountType(d.accountType || '');
        setGroup(d.group || '');
        setSubgroup(d.subgroup || '');
        setParentAccount(d.parentAccount || 'None');
        setCode(d.code || '');
        setName(d.name || '');
        setPostingAllowed(d.postingAllowed !== undefined ? d.postingAllowed : true);
        setIsHeaderAccount(d.isHeaderAccount || false);
        setControlAccount(d.controlAccount || false);
        setSlType(d.slType || 'None');
        setStatus(d.status || 'Draft');
        setApprovalStatus(d.approvalStatus || 'Not Submitted');
        setBalance(d.balance || 'Debit');
        setHasSavedDraft(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // --- SECURITY ACTIONS & ROLE CHECKS ---
  const isReadOnly = currentRole === 'Viewer';
  const canEditCode = currentRole === 'Senior Accountant' || currentRole === 'Finance Manager' || currentRole === 'Administrator';
  const canDeleteOrDeactivate = currentRole === 'Finance Manager' || currentRole === 'Administrator';
  const canApprove = currentRole === 'Finance Manager' || currentRole === 'Administrator';

  // --- DYNAMIC SELECTION DEPENDENCIES & PREREQUISITES ---
  // Steps completion metrics
  const completionPercentage = useMemo(() => {
    let score = 0;
    let total = 8;
    if (company) score++;
    if (branch) score++;
    if (accountType) score++;
    if (group) score++;
    if (subgroup) score++;
    if (parentAccount) score++;
    if (code) score++;
    if (name) score++;
    return Math.floor((score / total) * 100);
  }, [company, branch, accountType, group, subgroup, parentAccount, code, name]);

  // Determine unlocked sequence level for Step 1
  const activeInputLevel = useMemo(() => {
    if (!company) return 0;
    if (!branch) return 1;
    if (!accountType) return 2;
    if (!group) return 3;
    if (!subgroup) return 4;
    if (!parentAccount) return 5;
    if (!code) return 6;
    if (!name) return 7;
    return 8;
  }, [company, branch, accountType, group, subgroup, parentAccount, code, name]);

  // Clear children if account type changes
  const handleAccountTypeChange = (newType: AccountType) => {
    setAccountType(newType);
    setGroup('');
    setSubgroup('');
    setParentAccount('None');
    setCode('');
    
    // Automatically default Normal Balance
    if (newType === 'Asset' || newType === 'Expense' || newType === 'Cost of Sales') {
      setBalance('Debit');
    } else {
      setBalance('Credit');
    }
  };

  // Synchronize state from Parent Account when selected
  const handleParentSelection = (pCode: string) => {
    setParentAccount(pCode);
    if (pCode && pCode !== 'None') {
      const pNode = accounts.find(a => a.code === pCode);
      if (pNode) {
        if (pNode.accountType) setAccountType(pNode.accountType);
        if (pNode.group) setGroup(pNode.group);
        if (pNode.subgroup) setSubgroup(pNode.subgroup);
        if (pNode.company) setCompany(pNode.company);
        if (pNode.branch) setBranch(pNode.branch);
        if (pNode.balance) setBalance(pNode.balance);
      }
    }
  };

  // Automatically default IFRS Reference based on Section & Category
  useEffect(() => {
    if (!accountType) return;
    if (accountType === 'Asset') {
      if (subgroup.includes('Cash')) {
        setIfrsClass('IAS 7 - Statement of Cash Flows');
      } else if (subgroup.includes('Inventories')) {
        setIfrsClass('IAS 2 - Inventories');
      } else if (subgroup.includes('Fixed')) {
        setIfrsClass('IAS 16 - Property, Plant and Equipment');
      } else {
        setIfrsClass('IFRS 9 - Financial Instruments');
      }
    } else if (accountType === 'Revenue') {
      setIfrsClass('IFRS 15 - Revenue from Contracts with Customers');
    } else if (subgroup.includes('Tax')) {
      setIfrsClass('IAS 12 - Income Taxes');
    } else {
      setIfrsClass('IAS 1 - Presentation of Financial Statements');
    }
  }, [accountType, group, subgroup]);

  // Filter groups based on Account Type
  const availableGroups = useMemo(() => {
    if (!accountType) return [];
    return GROUPS[accountType] || [];
  }, [accountType]);

  // Filter subgroups based on selected Group Section (Financial Statement Section)
  const availableSubgroups = useMemo(() => {
    if (!group) return [];
    return SUBGROUPS[group] || [];
  }, [group]);

  // Filters parent options (Lists previously registered accounts of the same type, or all if none selected yet, sorted numerically by code)
  const availableParents = useMemo(() => {
    const list = !accountType ? accounts : accounts.filter(a => a.accountType === accountType);
    return [...list].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
  }, [accounts, accountType]);

  // Search filtered parents
  const searchedParents = useMemo(() => {
    if (!parentSearch) return availableParents;
    return availableParents.filter(p => p.code.includes(parentSearch) || p.name.toLowerCase().includes(parentSearch.toLowerCase()));
  }, [availableParents, parentSearch]);

  // Calculate full hierarchy path dynamically
  const computedHierarchyPath = useMemo(() => {
    if (!accountType) return 'Unassigned';
    let path = getAccountTypeLabel(accountType);
    if (group) path += ` > ${group}`;
    if (subgroup) path += ` > ${subgroup}`;
    if (parentAccount && parentAccount !== 'None') {
      const pAcc = accounts.find(a => a.code === parentAccount);
      if (pAcc) {
        path += ` > ${pAcc.name}`;
      }
    }
    if (name) path += ` > ${name}`;
    return path;
  }, [accountType, group, subgroup, parentAccount, name, accounts]);

  // Calculate and suggest next available account code
  const suggestedNextCode = useMemo(() => {
    if (!accountType) return '';
    let prefix = '1';
    if (accountType === 'Asset') prefix = '1';
    if (accountType === 'Liability') prefix = '2';
    if (accountType === 'Equity') prefix = '3';
    if (accountType === 'Revenue') prefix = '4';
    if (accountType === 'Cost of Sales') prefix = '5';
    if (accountType === 'Expense') prefix = '6';

    if (parentAccount && parentAccount !== 'None') {
      prefix = parentAccount;
    }

    const siblingCodes = accounts
      .filter(a => a.parentAccount === parentAccount && a.code.startsWith(prefix))
      .map(a => parseInt(a.code, 10))
      .filter(num => !isNaN(num));

    if (siblingCodes.length > 0) {
      const maxCode = Math.max(...siblingCodes);
      return (maxCode + 10).toString();
    } else {
      return (parentAccount && parentAccount !== 'None') ? `${parentAccount}10` : `${prefix}100`;
    }
  }, [accountType, parentAccount, accounts]);

  // Automatic Hierarchy Level Calculation
  const computedLevel = useMemo(() => {
    if (parentAccount === 'None') return 1;
    const parentNode = accounts.find(a => a.code === parentAccount);
    return parentNode ? (parentNode.level || 1) + 1 : 1;
  }, [parentAccount, accounts]);

  // Circular Reference Checker
  const checkCircularReference = (parentCode: string): boolean => {
    if (selectedAccount && parentCode === selectedAccount.code) return true;
    let currentParentCode = parentCode;
    while (currentParentCode && currentParentCode !== 'None') {
      const parentNode = accounts.find(a => a.code === currentParentCode);
      if (!parentNode) break;
      if (selectedAccount && parentNode.parentAccount === selectedAccount.code) {
        return true; // Circular reference detected
      }
      currentParentCode = parentNode.parentAccount;
    }
    return false;
  };

  // --- VALIDATION AND SYSTEM AUDIT ---
  useEffect(() => {
    const warns: string[] = [];
    const errors: Record<string, string> = {};

    if (code) {
      // Validate uniqueness
      const isDuplicated = accounts.some(a => a.code === code && (!selectedAccount || a.id !== selectedAccount.id));
      if (isDuplicated) {
        errors.code = 'Account code already registered inside ERP system.';
        warns.push('Code duplication failure.');
      }

      // Range check
      const firstDigit = code.charAt(0);
      const expectedDigit = accountType === 'Asset' ? '1' : 
                            accountType === 'Liability' ? '2' :
                            accountType === 'Equity' ? '3' :
                            accountType === 'Revenue' ? '4' :
                            accountType === 'Cost of Sales' ? '5' : '6';
      if (accountType && firstDigit !== expectedDigit) {
        warns.push(`Standard ERP logic error: ${accountType} codes should start with "${expectedDigit}"`);
      }
    }

    // Name uniqueness inside same parent
    if (name && parentAccount) {
      const isNameDuplicated = accounts.some(
        a => a.name.toLowerCase() === name.toLowerCase() && 
        a.parentAccount === parentAccount && 
        (!selectedAccount || a.id !== selectedAccount.id)
      );
      if (isNameDuplicated) {
        errors.name = 'This account name already exists inside the same parent account group.';
        warns.push('Rule BR-COA-09: Prevent duplicated child names.');
      }
    }

    // Normal balance incompatibilities
    if (accountType === 'Revenue' && balance === 'Debit') {
      warns.push('Incompatible Configuration: Revenues usually maintain Credit Normal Balances.');
    }
    if ((accountType === 'Asset' || accountType === 'Expense') && balance === 'Credit') {
      warns.push('Incompatible Configuration: Assets/Expenses usually maintain Debit Normal Balances.');
    }

    // Reconciliation controls requiring Subledger Type
    if (controlAccount && slType === 'None') {
      warns.push('Subledger Mapping Required: Reconciliation control accounts require mapping details.');
    }

    // Circularity checks
    if (parentAccount !== 'None' && checkCircularReference(parentAccount)) {
      errors.parentAccount = 'Circular hierarchy detected! This parent account loops directly with this account.';
      warns.push('Circular reference failure.');
    }

    setWarnings(warns);
    setInlineErrors(errors);
  }, [code, name, accountType, balance, parentAccount, controlAccount, slType, company]);

  // Trigger loading state for styling/wizard feel
  const handleNextStep = () => {
    // Validate prerequisites before proceeding
    if (step === 1) {
      if (!accountType || !code || !name) {
        alert('All basic mandatory fields (Account Type, Code, and Name) must be specified.');
        return;
      }
      if (Object.keys(inlineErrors).length > 0) {
        alert('Please resolve any validation errors with the inputs before proceeding.');
        return;
      }
    }
    if (step === 2) {
      if (!group || !subgroup || !company || !branch) {
        alert('Please fill in the financial classification inputs (Statement Section, Group Category, Company, and Branch Segment).');
        return;
      }
    }

    setIsValidatingCode(true);
    setTimeout(() => {
      setIsValidatingCode(false);
      setStep(prev => prev + 1);
    }, 450);
  };

  // Safe Exit and Draft Persistence
  const handleExitAndResumeLater = () => {
    const draftPayload = {
      company, branch, accountType, group, subgroup, parentAccount, code, name,
      postingAllowed, isHeaderAccount, controlAccount, slType, status, approvalStatus, balance
    };
    localStorage.setItem('qm_coa_wizard_draft', JSON.stringify(draftPayload));
    triggerNotification('Draft saved to hardware storage. You can safely resume later.', 'success');
    onCancel();
  };

  // Save/Submit Form Action
  const handleFinalSubmit = (subType: 'Draft' | 'Submit') => {
    if (!code || !name) {
      alert('Please specify the account identity.');
      return;
    }

    const itemStatus: AccountStatus = subType === 'Draft' ? 'Draft' : 'Pending Approval';
    const itemApproval: ApprovalStatus = subType === 'Draft' ? 'Not Submitted' : 'Submitted';

    const cleanAccount: Account = {
      id: code,
      code,
      name,
      parentAccount,
      level: computedLevel,
      company,
      branch,
      accountType: accountType as AccountType,
      group,
      subgroup,
      ifrsClass,
      financialStatementLine: subgroup || FINANCIAL_STATEMENT_LINES[0],
      postingAllowed: !isHeaderAccount,
      controlAccount,
      manualJournalAllowed,
      systemPostingOnly,
      slType,
      slMappingCode: slType !== 'None' ? `MAP-${slType.toUpperCase()}-${code}` : undefined,
      vatCode,
      whtCode,
      ethiopianTaxCategory,
      costCenter: dimensionConfigs.costCenter,
      department: dimensionConfigs.department,
      project: dimensionConfigs.project,
      segment: dimensionConfigs.businessUnit,
      profitCenter: dimensionConfigs.profitCenter,
      status: itemStatus,
      approvalStatus: itemApproval,
      balance,
      createdBy: 'mzerihun01@gmail.com',
      auditTrailNotes: auditTrailNotes || 'Registered account via premium wizard.'
    };

    localStorage.removeItem('qm_coa_wizard_draft');
    onSave(cleanAccount);
  };

  // Templates
  const applyTemplate = (tpl: string) => {
    if (tpl === 'bank') {
      setAccountType('Asset');
      setGroup('Current Assets');
      setSubgroup('Bank Balances');
      setBalance('Debit');
      setPostingAllowed(true);
      setIsHeaderAccount(false);
      setControlAccount(true);
      setSlType('Bank');
      setName('Commercial Bank of Ethiopia - Operating');
    } else if (tpl === 'supplier') {
      setAccountType('Liability');
      setGroup('Current Liabilities');
      setSubgroup('Trade Payables');
      setBalance('Credit');
      setPostingAllowed(true);
      setIsHeaderAccount(false);
      setControlAccount(true);
      setSlType('Supplier');
      setName('Accounts Payable Control Ledger');
    } else if (tpl === 'revenue') {
      setAccountType('Revenue');
      setGroup('Operating Revenue');
      setSubgroup('Domestic Sales');
      setBalance('Credit');
      setPostingAllowed(true);
      setIsHeaderAccount(false);
      setControlAccount(false);
      setSlType('None');
      setName('Sales Revenue - Regional Division');
    }
    triggerNotification(`Applied ${tpl.toUpperCase()} Template`, 'info');
  };

  // Drag and drop spreadsheet mockup parser
  const handleSimulateImport = () => {
    if (!importText) {
      alert('Please paste some CSV text block into the zone.');
      return;
    }
    const lines = importText.split('\n');
    const records: typeof importPreview = [];
    lines.forEach(l => {
      if (!l.trim()) return;
      const parts = l.split(',');
      if (parts.length < 3) return;
      
      const parsedCode = parts[0]?.trim();
      const parsedName = parts[1]?.trim();
      const parsedType = (parts[2]?.trim() || 'Asset') as AccountType;
      
      // Real-time pre-validation checks inside simulated parser
      let err: string | undefined;
      if (accounts.some(a => a.code === parsedCode)) {
        err = 'Duplicate Account Code present inside system.';
      } else if (!parsedCode || parsedCode.length < 3) {
        err = 'Invalid format for system code.';
      }

      records.push({
        code: parsedCode,
        name: parsedName,
        type: parsedType,
        error: err
      });
    });
    setImportPreview(records);
    triggerNotification(`Parsed ${records.length} Excel rows, status check finalized.`, 'info');
  };

  // Perform bulk account injection
  const handleExecuteImport = () => {
    const errorCount = importPreview.filter(p => p.error).length;
    if (errorCount > 0) {
      alert('Please remove rows that fail ERP validation rules before injecting.');
      return;
    }
    importPreview.forEach(p => {
      const mock: Account = {
        id: p.code,
        code: p.code,
        name: p.name,
        parentAccount: 'None',
        level: 1,
        company: COMPANIES[0],
        branch: BRANCHES[0],
        accountType: p.type,
        group: GROUPS[p.type]?.[0] || 'Current Assets',
        subgroup: SUBGROUPS[GROUPS[p.type]?.[0]]?.[0] || 'Cash at Hand',
        ifrsClass: IFRS_CLASSES[0],
        financialStatementLine: FINANCIAL_STATEMENT_LINES[0],
        postingAllowed: true,
        controlAccount: false,
        manualJournalAllowed: true,
        systemPostingOnly: false,
        slType: 'None',
        vatCode: VAT_CODES[4],
        whtCode: WHT_CODES[3],
        ethiopianTaxCategory: ETHIOPIAN_TAX_CATEGORIES[0],
        costCenter: 'Optional',
        department: 'Optional',
        project: 'Optional',
        segment: 'Optional',
        profitCenter: 'Optional',
        status: 'Active',
        approvalStatus: 'Approved',
        balance: (p.type === 'Asset' || p.type === 'Expense') ? 'Debit' : 'Credit',
        createdBy: 'mzerihun01@gmail.com'
      };
      onSave(mock);
    });
    setImportPreview([]);
    setImportText('');
    setWizardMode('single');
    triggerNotification('Excel entries imported successfully!', 'success');
  };

  // Bulk Grid Add Row
  const handleAddBulkRow = () => {
    setBulkRows([...bulkRows, { code: '', name: '', type: 'Asset', group: 'Current Assets', subgroup: 'Cash at Hand' }]);
  };

  const handleBulkFieldUpdate = (idx: number, field: string, val: any) => {
    const fresh = [...bulkRows];
    fresh[idx] = { ...fresh[idx], [field]: val };
    
    // Auto sync Section/Category on Type update
    if (field === 'type') {
      const autoGrp = GROUPS[val as AccountType]?.[0] || '';
      fresh[idx].group = autoGrp;
      fresh[idx].subgroup = SUBGROUPS[autoGrp]?.[0] || '';
    } else if (field === 'group') {
      fresh[idx].subgroup = SUBGROUPS[val]?.[0] || '';
    }
    
    setBulkRows(fresh);
  };

  const handleExecuteBulkSave = () => {
    let invalidCount = 0;
    bulkRows.forEach(r => {
      if (!r.code || !r.name) invalidCount++;
    });

    if (invalidCount > 0) {
      alert('All rows must have codes and names before bulk generation.');
      return;
    }

    bulkRows.forEach(p => {
      const item: Account = {
        id: p.code,
        code: p.code,
        name: p.name,
        parentAccount: 'None',
        level: 1,
        company: COMPANIES[0],
        branch: BRANCHES[0],
        accountType: p.type,
        group: p.group,
        subgroup: p.subgroup,
        ifrsClass: IFRS_CLASSES[0],
        financialStatementLine: FINANCIAL_STATEMENT_LINES[0],
        postingAllowed: true,
        controlAccount: false,
        manualJournalAllowed: true,
        systemPostingOnly: false,
        slType: 'None',
        vatCode: VAT_CODES[4],
        whtCode: WHT_CODES[3],
        ethiopianTaxCategory: ETHIOPIAN_TAX_CATEGORIES[0],
        costCenter: 'Optional',
        department: 'Optional',
        project: 'Optional',
        segment: 'Optional',
        profitCenter: 'Optional',
        status: 'Active',
        approvalStatus: 'Approved',
        balance: (p.type === 'Asset' || p.type === 'Expense') ? 'Debit' : 'Credit',
        createdBy: 'mzerihun01@gmail.com'
      };
      onSave(item);
    });

    setBulkRows([{ code: '', name: '', type: 'Asset', group: 'Current Assets', subgroup: 'Cash at Hand' }]);
    setWizardMode('single');
    triggerNotification('Bulk accounts registry processed successfully!', 'success');
  };

  // Helper notice
  const triggerNotification = (msg: string, variant: 'success' | 'info' = 'success') => {
    alert(`ERP Status Center: ${msg}`);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 select-none">
      
      {/* 1. ERP SECURE REGISTRY BANNER WITH ROLE TOGGLE */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-950/65 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900">
                SECURED ACCESS
              </span>
              <span className="text-xs font-mono text-slate-400">v4.12 ERP Release</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-100 font-sans tracking-tight leading-normal">
              COA Authorization Gating Controls
            </h3>
          </div>
        </div>

        {/* Dynamic Governance Roles Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium font-sans">Active Persona Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as ERPRole)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs py-1.5 px-3 text-emerald-400 font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Viewer">Viewer (Read Only Gated)</option>
            <option value="Accountant">Accountant (No Code Edit/Approve)</option>
            <option value="Senior Accountant">Senior Accountant (No Approve/Delete)</option>
            <option value="Finance Manager">Finance Manager (Executive Controller)</option>
            <option value="Administrator">Administrator (System Bypass)</option>
          </select>
        </div>
      </div>

      {/* Draft Resume Bar */}
      {hasSavedDraft && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-655 w-4.5 h-4.5 shrink-0" />
            <span className="text-xs font-bold">You have an incomplete Chart of Accounts layout draft stored in safe memory.</span>
          </div>
          <button
            onClick={loadSavedDraft}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded px-3 py-1 text-xs font-black"
          >
            Retrieve Draft
          </button>
        </div>
      )}

      {/* 2. TABBED WORKSPACE: Single entry, templates, excel, bulk */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-3xs max-w-full overflow-x-auto gap-1">
        <button
          onClick={() => setWizardMode('single')}
          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer truncate ${wizardMode === 'single' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <PlusCircle className="w-4 h-4" />
            <span>Interactive Wizard Creator</span>
          </div>
        </button>
        <button
          onClick={() => setWizardMode('templates')}
          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer truncate ${wizardMode === 'templates' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Enterprise Templates</span>
          </div>
        </button>
        <button
          onClick={() => setWizardMode('bulk')}
          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer truncate ${wizardMode === 'bulk' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Grid3X3 className="w-4 h-4" />
            <span>Bulk Rapid Input Grid</span>
          </div>
        </button>
        <button
          onClick={() => setWizardMode('import')}
          className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer truncate ${wizardMode === 'import' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel Map</span>
          </div>
        </button>
      </div>

      {/* --- RENDER BULK CREATION MODE --- */}
      {wizardMode === 'bulk' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-850">COA Rapid Bulk Creation Grid</h4>
              <p className="text-[10px] text-slate-500">Insert multiple ledger accounts simultaneously. Validates against standard numbering sequences instantly.</p>
            </div>
            <button
              onClick={handleAddBulkRow}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.8 rounded font-black flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ledger Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-2.5">Account Code</th>
                  <th className="p-2.5">Account Name</th>
                  <th className="p-2.5">Account Type</th>
                  <th className="p-2.5">Statement Section</th>
                  <th className="p-2.5">Account Category</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {bulkRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/40">
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.code}
                        onChange={(e) => handleBulkFieldUpdate(idx, 'code', e.target.value.replace(/[^0-9]/g, ''))}
                        className="border border-slate-200 p-1.5 rounded w-28 font-mono text-center font-bold text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. 1111"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleBulkFieldUpdate(idx, 'name', e.target.value)}
                        className="border border-slate-200 p-1.5 rounded w-full font-bold text-slate-800"
                        placeholder="e.g. Petty Cash Adama"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.type}
                        onChange={(e) => handleBulkFieldUpdate(idx, 'type', e.target.value as AccountType)}
                        className="border border-slate-200 p-1.5 rounded w-36 bg-white shrink-0"
                      >
                        {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={row.group}
                        onChange={(e) => handleBulkFieldUpdate(idx, 'group', e.target.value)}
                        className="border border-slate-200 p-1.5 rounded w-36 bg-white shrink-0"
                      >
                        {(GROUPS[row.type] || []).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={row.subgroup}
                        onChange={(e) => handleBulkFieldUpdate(idx, 'subgroup', e.target.value)}
                        className="border border-slate-200 p-1.5 rounded w-36 bg-white shrink-0"
                      >
                        {(SUBGROUPS[row.group] || []).map(sg => <option key={sg} value={sg}>{sg}</option>)}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          if (bulkRows.length === 1) return;
                          setBulkRows(bulkRows.filter((_, i) => i !== idx));
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setWizardMode('single')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded font-black text-xs"
            >
              Cancel Bulk Entry
            </button>
            <button
              onClick={handleExecuteBulkSave}
              className="bg-indigo-650 hover:bg-indigo-700 text-white px-5 py-2 rounded font-black text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Bulk Ledgers
            </button>
          </div>
        </div>
      )}

      {/* --- RENDER TEMPLATE SELECTION MODE --- */}
      {wizardMode === 'templates' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-850">Pre-Configured GAAP & IFRS Account Templates</h4>
            <p className="text-[10px] text-slate-500">Pick any standardized corporate template block below. It will automatically populate the field mappings inside the interactive wizard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between" onClick={() => applyTemplate('bank')}>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ASSET STANDARD</span>
                <h5 className="font-extrabold text-xs text-slate-900 mt-2">Bank Equivalents Ledger</h5>
                <p className="text-[11px] text-slate-500 mt-1">Sets up a reconciliation control account, linking subledger control automatically for bank check matching.</p>
              </div>
              <button className="mt-4 bg-slate-900 text-white text-[11px] font-bold py-1.5 rounded hover:bg-indigo-600 transition">Apply This Layout</button>
            </div>

            <div className="border border-slate-200 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between" onClick={() => applyTemplate('supplier')}>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">LIABILITY CLASS</span>
                <h5 className="font-extrabold text-xs text-slate-900 mt-2">Trade Payables Ledger (AP)</h5>
                <p className="text-[11px] text-slate-500 mt-1">Configures a supplier control account that requires Subsidiary Ledger mapping. Direct manual journals are restricted.</p>
              </div>
              <button className="mt-4 bg-slate-900 text-white text-[11px] font-bold py-1.5 rounded hover:bg-emerald-600 transition">Apply This Layout</button>
            </div>

            <div className="border border-slate-200 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between" onClick={() => applyTemplate('revenue')}>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">INCOME CLASS</span>
                <h5 className="font-extrabold text-xs text-slate-900 mt-2">Operating Sales Revenue</h5>
                <p className="text-[11px] text-slate-500 mt-1">Configures sales ledger, mapping standard tax VAT requirements suited for export or domestic trades.</p>
              </div>
              <button className="mt-4 bg-slate-900 text-white text-[11px] font-bold py-1.5 rounded hover:bg-purple-600 transition">Apply This Layout</button>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-500 border border-slate-200 text-center font-medium italic">
            Applying templates will redirect you into the main wizard view with the properties configured.
          </div>
        </div>
      )}

      {/* --- RENDER EXCEL IMPORT SIMULATOR --- */}
      {wizardMode === 'import' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileSpreadsheet className="text-[#0051d5] w-5 h-5 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-slate-850">COA Excel / CSV Text Parser</h4>
              <p className="text-[10px] text-slate-500">Provide comma-separated values of the desired accounts below. Format: Code, Name, Account Type</p>
            </div>
          </div>

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full font-mono text-xs p-3 border border-slate-250 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="1115, Cash on Hand Regional Office-A, Asset&#10;2112, Vendor Supplier Pool-B, Liability&#10;5115, Direct Subcontracting Cost, Cost of Sales"
            rows={5}
          />

          <div className="flex justify-between items-center py-2">
            <span className="text-[10px] text-slate-450 italic">Paste text directly into block, click validate.</span>
            <button
              onClick={handleSimulateImport}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-black"
            >
              Parse & Validate Setup List
            </button>
          </div>

          {importPreview.length > 0 && (
            <div className="pt-2 space-y-2">
              <h5 className="font-extrabold text-xs text-slate-800">Parsed Records Pending Import Approval ({importPreview.length})</h5>
              <div className="border border-slate-200 rounded-lg max-h-56 overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 uppercase text-[9px] font-black text-slate-500">
                    <tr className="border-b border-slate-200">
                      <th className="p-2">Code</th>
                      <th className="p-2">Proposed Name</th>
                      <th className="p-2">Type</th>
                      <th className="p-2 text-right">Pre-Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 text-slate-705">
                        <td className="p-2 font-mono font-bold text-blue-600">{item.code}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 font-semibold text-slate-500">{item.type}</td>
                        <td className="p-2 text-right font-bold text-xs">
                          {item.error ? (
                            <span className="text-red-500">⚠️ {item.error}</span>
                          ) : (
                            <span className="text-emerald-500">✓ Ready to load</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setImportPreview([])}
                  className="bg-slate-100 text-slate-705 px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Clear Parsed Entries
                </button>
                <button
                  onClick={handleExecuteImport}
                  className="bg-[#0051d5] text-white px-4 py-1.5 rounded text-xs font-black"
                >
                  Commit Validated Accounts
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- RENDER SINGLE ACCOUNT INTERACTIVE WIZARD MODE --- */}
      {wizardMode === 'single' && (
        <form className="space-y-4">
          
          {/* Header block with Completion Metrics */}
          <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-xl shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0051d5] shrink-0 border border-blue-100">
                <Grid3X3 className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-[#111827] text-sm leading-none flex items-center gap-1.5 matches-title">
                  <span>{selectedAccount ? "Modify Ledger Account" : "Standard IFRS Account Setup Wizard"}</span>
                  <BusinessTooltip text="Central utility to define, edit, and configure Chart of Accounts elements. Assigns account categories, IFRS balance sheet lines, tax categories, and active subledger settings." />
                </h3>
                <p className="text-[10px] text-slate-550 mt-1 font-medium font-sans">
                  Dynamic field generation ensures valid, un-orphaned hierarchies aligned with ERP conventions and accounting criteria.
                </p>
              </div>
            </div>

            {/* Completion Percentage Panel */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
              <div>
                <div className="flex justify-between text-[10px] font-extrabold text-slate-500 mb-1">
                  <span>Wizard Form Completion</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-32 bg-slate-200 h-1.8 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${completionPercentage}%` }}></div>
                </div>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={handleExitAndResumeLater}
                  className="bg-transparent text-slate-650 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-1 text-[10px] font-black rounded-lg"
                >
                  Exit & Resume
                </button>
              </div>
            </div>
          </div>

          {/* Compliance warnings block */}
          {warnings.length > 0 && (
            <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 flex gap-2 text-amber-850 shadow-3xs">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-amber-600 mt-0.5" />
              <div className="text-[11px] font-medium space-y-1">
                <p className="font-bold underline">ERP Real-Time Validation Warnings ({warnings.length}):</p>
                <ul className="list-disc pl-3.5 space-y-0.5 text-[10px]">
                  {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Multi-Step Horizontal Indicators */}
          <div className="bg-slate-950 text-white rounded-xl p-2.5 flex items-center justify-between shadow-xs select-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full text-center">
              {[
                { s: 1, name: '1. Basic Information' },
                { s: 2, name: '2. Classification' },
                { s: 3, name: '3. Advanced Controls' }
              ].map((item) => {
                const isActive = step === item.s;
                const isCompleted = step > item.s;
                return (
                  <button
                    key={item.s}
                    type="button"
                    onClick={() => {
                      if (item.s > 1 && (!code || !name || !accountType)) {
                        alert('Basic account identity inputs (Account Type, Code, and Name) must be specified first.');
                        return;
                      }
                      if (item.s > 2 && (!group || !subgroup)) {
                        alert('Financial statements mapping classification (Section & Category) must be selected.');
                        return;
                      }
                      setStep(item.s);
                    }}
                    className={`py-2 px-1.5 rounded-lg transition-all text-[11px] font-black cursor-pointer flex items-center justify-center gap-1.5 ${
                      isActive 
                        ? 'bg-indigo-650 text-white border border-indigo-500' 
                        : isCompleted 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                          : 'bg-transparent text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- STEP 1: BASIC INFORMATION --- */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Form Input fields */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4 md:col-span-2">
                <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>IDENTITY MATRIX FOR GAAP / IFRS COMPLIANCE</span>
                  <span className="text-[10px] text-slate-400 font-normal">Gating Stage 1</span>
                </h4>

                <div className="space-y-4 text-xs">
                  
                  {/* Sequence 1: Parent Account (Circular prevent checks active) */}
                  <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-850 font-sans flex items-center gap-1.5">
                        <span className="text-indigo-600 font-extrabold mr-1">1.</span>
                        <span>Parent Account Header *</span>
                      </label>
                      <span className="text-[10px] text-indigo-600 font-extrabold bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                        Auto-fills Type, Balance, Section & Category
                      </span>
                    </div>

                    <div className="space-y-2">
                      <select
                        value={parentAccount}
                        onChange={(e) => handleParentSelection(e.target.value)}
                        className="w-full border border-slate-250 rounded-lg p-2.5 bg-white text-slate-855 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="None">None - Top Level Header</option>
                        {availableParents.map(po => {
                          const isCircularRef = checkCircularReference(po.code);
                          return (
                            <option
                              key={po.code}
                              value={po.code}
                              disabled={isCircularRef}
                            >
                              [{po.code}] {po.name} ({po.accountType} - {po.group}) {isCircularRef ? ' [Circular Warning]' : ''}
                            </option>
                          );
                        })}
                      </select>

                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={parentSearch}
                          onChange={(e) => setParentSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          placeholder="Quick search & select parent dynamically..."
                        />
                      </div>

                      {(parentSearch || parentAccount !== 'None') && (
                        <div className="border border-slate-200 rounded-lg max-h-36 overflow-y-auto p-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white">
                          <button
                            type="button"
                            onClick={() => {
                              handleParentSelection('None');
                              setParentSearch('');
                            }}
                            className={`p-2 rounded text-left border flex items-center justify-between text-xs ${parentAccount === 'None' ? 'bg-indigo-50 border-indigo-300 font-extrabold text-indigo-900' : 'bg-white border-slate-150 hover:bg-slate-50'}`}
                          >
                            <span>None - Top Level Header</span>
                            {parentAccount === 'None' && <Check className="w-3.5 h-3.5" />}
                          </button>
                          {searchedParents.map(po => {
                            const isCircularRef = checkCircularReference(po.code);
                            const isSel = parentAccount === po.code;
                            return (
                              <button
                                key={po.code}
                                type="button"
                                disabled={isCircularRef}
                                onClick={() => {
                                  handleParentSelection(po.code);
                                  setParentSearch('');
                                }}
                                className={`p-2 rounded text-left border flex items-center justify-between text-xs font-sans truncate ${isCircularRef ? 'opacity-30 cursor-not-allowed bg-slate-100' : isSel ? 'bg-indigo-50 border-indigo-300 font-extrabold text-indigo-900' : 'bg-white border-slate-150 hover:bg-slate-50'}`}
                              >
                                <span className="truncate">[{po.code}] {po.name}</span>
                                {isSel && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {inlineErrors.parentAccount && (
                      <p className="text-red-550 font-bold text-[10px] mt-1">{inlineErrors.parentAccount}</p>
                    )}
                  </div>

                  {/* Sequence 2: Account Type Dropdown */}
                  <div>
                    <label className="block font-bold text-slate-855 mb-1.5 font-sans flex items-center gap-1.5">
                      <span className="text-indigo-600 font-extrabold mr-1">2.</span>
                      <span>Account Type *</span>
                      <BusinessTooltip text="Specifies primary classification class. Assets, Liabilities and Equity affect Balance Sheets directly." />
                    </label>
                    <select
                      value={accountType}
                      disabled={isReadOnly}
                      onChange={(e) => handleAccountTypeChange(e.target.value as AccountType)}
                      className="w-full border border-slate-250 rounded-lg p-2.5 bg-white text-slate-855 font-extrabold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Account Type (Select Dropdown) --</option>
                      {ACCOUNT_TYPES.map(t => (
                        <option key={t} value={t}>
                          {t} ({t === 'Asset' || t === 'Expense' || t === 'Cost of Sales' ? 'Debit Normal Balance' : 'Credit Normal Balance'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sequence 3 & 4: Account Code and Account Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-slate-800 font-sans">
                          <span className="text-indigo-600 font-extrabold mr-1">3.</span>
                          Account Code *
                        </label>
                        {suggestedNextCode && (
                          <button
                            type="button"
                            onClick={() => setCode(suggestedNextCode)}
                            className="text-[10px] bg-slate-900 hover:bg-[#0051d5] text-white px-2 py-0.5 rounded font-black font-sans leading-none flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            Suggest Next: {suggestedNextCode}
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        value={code}
                        disabled={!canEditCode && !!code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9-]/g, ''))}
                        className={`w-full border rounded-lg p-2.5 font-mono font-black text-blue-600 focus:ring-1 focus:ring-blue-500 outline-none ${inlineErrors.code ? 'border-red-400 bg-red-50/20' : 'border-slate-250 bg-white'}`}
                        placeholder="Assign distinct numeric code"
                      />
                      {inlineErrors.code && <p className="text-red-505 font-medium mt-1 text-[10px]">{inlineErrors.code}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-sans">
                        <span className="text-indigo-600 font-extrabold mr-1">4.</span>
                        Account Name / Title *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded-lg p-2.5 font-bold text-slate-805 focus:ring-1 focus:ring-blue-500 outline-none font-sans ${inlineErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-250 bg-white'}`}
                        placeholder="e.g. Export Debitors Division-C"
                      />
                      {inlineErrors.name && <p className="text-red-505 font-medium mt-1 text-[10px]">{inlineErrors.name}</p>}
                    </div>
                  </div>

                  {/* Bilingual Translation Support */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 font-sans">Amharic Translation Title (optional)</label>
                    <input
                      type="text"
                      value={nameAmharic}
                      onChange={(e) => setNameAmharic(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 font-bold text-slate-805 focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans bg-white animate-fadeIn"
                      placeholder="e.g. ወጪ ደንበኞች ክፍል-ሐ"
                    />
                  </div>

                  {/* Override balance setting */}
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-705 block">Report Normal Balance</span>
                      <span className="text-[10px] text-slate-450 block mt-0.5">Determined automatically from standard ERP rules. Override can be performed if role allows.</span>
                    </div>
                    <select
                      value={balance}
                      onChange={(e) => setBalance(e.target.value as BalanceType)}
                      disabled={isReadOnly || currentRole === 'Accountant'}
                      className="bg-white border border-slate-250 rounded p-1.5 text-xs font-bold font-sans text-slate-800 cursor-pointer"
                    >
                      <option value="Debit">Debit Balance</option>
                      <option value="Credit">Credit Balance</option>
                      <option value="Debit or Credit">Debit or Credit (Clearing)</option>
                      <option value="None">None (Statistical Header)</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Side context & help block */}
              <div className="space-y-4">
                
                {/* Visual Hierarchy path card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
                  <span className="text-[10px] font-mono font-black text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 uppercase tracking-widest block text-center">
                    Visual ERP Breadcrumb Path
                  </span>
                  <div className="text-xs space-y-1.5 leading-snug">
                    <p className="font-bold text-slate-655 text-[10px] uppercase">Calculated Structure Position:</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-150 font-sans font-medium text-slate-700 flex flex-wrap items-center gap-1.5">
                      {computedHierarchyPath.split(' > ').map((crumb, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span className={`text-[11px] ${idx === arr.length - 1 ? 'font-black text-indigo-600' : 'text-slate-500'}`}>
                            {crumb}
                          </span>
                          {idx < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-350 shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-455 leading-relaxed pt-1.5 border-t border-slate-200">
                    Calculated Level depth: <strong className="text-slate-700 font-black">Level {computedLevel} Account</strong>
                  </div>
                </div>

                {/* Interactive Tree Preview Simulator */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-2">
                  <h5 className="font-black text-xs text-slate-805 uppercase tracking-tight flex items-center gap-1.5 pb-1 border-b border-indigo-100">
                    <Layers className="text-[#0051d5] w-3.5 h-3.5" />
                    <span>Real-Time Account Tree Preview</span>
                  </h5>
                  <p className="text-[9px] text-slate-505 leading-relaxed">Where this item will sit inside the primary structure relative to hierarchy counterparts:</p>
                  
                  <div className="bg-slate-55 border border-slate-150 p-3 rounded-lg font-mono text-[10px] space-y-1 max-h-48 overflow-y-auto select-none">
                    <div className="text-slate-500 font-bold">└─ Chart of Accounts (COA)</div>
                    <div className="text-slate-500 pl-3">└─ [{accountType || 'Asset'}] Folder</div>
                    <div className="pl-6 text-slate-450 truncate">└─ {group || 'Statement Section'}</div>
                    <div className="pl-9 text-slate-450 truncate">└─ {subgroup || 'Category'}</div>
                    <div className="pl-12 text-slate-450 truncate">
                      {parentAccount !== 'None' ? `└─ Parent ID: ${parentAccount}` : '└─ [Top Root Header]'}
                    </div>
                    {code && (
                      <div className="pl-16 font-black text-indigo-650 animate-pulse flex items-center gap-1">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>[{code}] {name || 'Draft Name'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System rules helper widget */}
                <div className="bg-indigo-950 text-indigo-100 p-4 rounded-xl space-y-2.5 border border-indigo-900 shadow-xs">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 block font-mono">ERP Business Rule Helper</span>
                  <div className="text-[10px] leading-relaxed space-y-2">
                    <p><strong className="text-white">Rule 1 [Hierarchy Gating]</strong>: Sub-accounts can only be generated under unlocked folders.</p>
                    <p><strong className="text-white">Rule 2 [Automatic Clears]</strong>: Changing primary Account type drops and resets parent properties cascade fields.</p>
                  </div>
                </div>

            {/* --- STEP 2: CLASSIFICATION DETAILS --- */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
              
              {/* Classification Inputs Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-5 md:col-span-2 font-sans text-xs">
                <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#111827] pb-2 border-b border-slate-100 flex items-center justify-between font-bold">
                  <span>FINANCIAL STATEMENT MAP & LOCAL SEGMENTS</span>
                  <span className="text-[10px] text-slate-400 font-normal">Classification Stage 2</span>
                </h4>

                <div className="space-y-4">
                  
                  {/* Sequence 1 & 2: Statement Section (Group) and Category (Subgroup) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">1. Statement Section (Group) *</label>
                      {accountType ? (
                        <select
                          value={group}
                          onChange={(e) => {
                            setGroup(e.target.value);
                            setSubgroup('');
                          }}
                          className="w-full border border-slate-250 rounded-lg p-2.5 bg-white text-slate-800 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="">-- Choose Financial Section --</option>
                          {availableGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      ) : (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 italic font-bold">
                          Waiting for Account Type selection...
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-705 mb-1.5">2. Account Category (Subgroup) *</label>
                      {group ? (
                        <select
                          value={subgroup}
                          onChange={(e) => setSubgroup(e.target.value)}
                          className="w-full border border-slate-250 rounded-lg p-2.5 bg-white text-slate-800 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="">-- Choose Segment Category --</option>
                          {availableSubgroups.map(sg => <option key={sg} value={sg}>{sg}</option>)}
                        </select>
                      ) : (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 italic font-bold">
                          Waiting for statement section...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sequence 3 & 4: Company and Branch (Always unlocked) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">3. Company / Legal Entity *</label>
                      <select
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer truncate"
                      >
                        {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">4. Branch / Segment Location *</label>
                      <select
                        value={branch}
                        disabled={activeInputLevel < 1}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer truncate disabled:opacity-50"
                      >
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl space-y-2 text-slate-705 leading-normal">
                    <span className="text-[10px] font-black tracking-wider text-indigo-700 uppercase block">IFRS Mapping Compliance</span>
                    <p className="text-[10.5px]">
                      By designating <strong>{group || '(Unassigned Section)'}</strong> and reporting category <strong>{subgroup || '(Unassigned Category)'}</strong>, this account triggers direct mapping templates inside the Consolidated Statement of Financial Position model.
                    </p>
                  </div>

                </div>
              </div>

              {/* Step 2 Information Column */}
              <div className="space-y-4 font-sans text-xs">
                
                {/* Structural Alignment HUD */}
                <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
                  <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 uppercase tracking-widest block text-center">
                    STRUCTURAL CLASSIFICATION PATH
                  </span>
                  
                  <div className="space-y-2 font-bold">
                    <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400 font-semibold">Ledger Group:</span>
                      <strong className="text-white font-bold">{group || 'Unassigned'}</strong>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400 font-semibold">Ledger Category:</span>
                      <strong className="text-white font-bold">{subgroup || 'Unassigned'}</strong>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400 font-semibold">Consolidated Under:</span>
                      <strong className="text-white font-bold">{company}</strong>
                    </div>
                  </div>
                </div>

                {/* Internal Verification checks card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-2 text-xs">
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1 font-bold">
                    <CheckSquare className="text-emerald-500 w-3.5 h-3.5 shrink-0" />
                    <span>Real-Time Compliance Audits</span>
                  </h5>
                  <ul className="text-[10px] text-slate-550 space-y-1.5 font-medium">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Consolidation books compatibility checked</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Branch/Location segment registered</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Dual Entry compliance threshold valid</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          )}             </div>

            </div>
          )}

          {/* --- STEP 3: TAX, CURRENCY & DIMENSIONS --- */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Dynamic Company configuration segment switches */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
                <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-widest block text-center">
                  C-Level System Administrator Settings: Segment Activation Board
                </span>
                <p className="text-[10px] text-slate-505 text-center leading-relaxed">Configure which dimensions should be required/active inside legal books before saving.</p>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5 text-center pt-1.5">
                  {[
                    { key: 'costCenter', label: 'Cost Center' },
                    { key: 'project', label: 'Project Segment' },
                    { key: 'department', label: 'Department' },
                    { key: 'region', label: 'Geographical Region' },
                    { key: 'profitCenter', label: 'Profit Center' },
                    { key: 'businessUnit', label: 'Business Unit' }
                  ].map((dim) => {
                    const activeVal = dimensionConfigs[dim.key];
                    return (
                      <div key={dim.key} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold block text-slate-700 leading-tight mb-1 text-[10px]">{dim.label}</span>
                        <select
                          value={activeVal}
                          onChange={(e) => setDimensionConfigs({ ...dimensionConfigs, [dim.key]: e.target.value as any })}
                          className="bg-white border border-slate-200 rounded text-[10px] py-1 px-1.5 w-full cursor-pointer font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Optional">Optional</option>
                          <option value="Mandatory">Mandatory</option>
                          <option value="Not Required">Not Applicable</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tax details card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
                  <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#111827] pb-2 border-b border-slate-100 flex items-center gap-1.5 animate-pulse">
                    <Activity className="text-emerald-500 w-4 h-4 shrink-0" />
                    <span>Ethiopian ERCA Tax Compliance Mappings</span>
                  </h4>

                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-550 mb-1">Standard VAT rate</label>
                        <select
                          value={vatCode}
                          onChange={(e) => setVatCode(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                        >
                          {VAT_CODES.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-550 mb-1">Withholding tax rate (WHT)</label>
                        <select
                          value={whtCode}
                          onChange={(e) => setWhtCode(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                        >
                          {WHT_CODES.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-550 mb-1">Sovereign Taxpayer Category</label>
                        <select
                          value={ethiopianTaxCategory}
                          onChange={(e) => setEthiopianTaxCategory(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                        >
                          {ETHIOPIAN_TAX_CATEGORIES.map(et => <option key={et} value={et}>{et}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-550 mb-1">Currency Standard</label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                        >
                          <option value="ETB">ETB - Ethiopian Birr</option>
                          <option value="USD">USD - United States Dollar</option>
                          <option value="EUR">EUR - European Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk-multicurrency"
                          checked={multiCurrency}
                          onChange={(e) => setMultiCurrency(e.target.checked)}
                          className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <label htmlFor="chk-multicurrency" className="font-bold text-slate-650 cursor-pointer font-sans text-xs">Allow multi-currency trades</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk-reval"
                          checked={revaluationRequired}
                          onChange={(e) => setRevaluationRequired(e.target.checked)}
                          className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <label htmlFor="chk-reval" className="font-bold text-slate-655 cursor-pointer font-sans text-xs">IAS 21 Revaluation required</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reporting segments card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
                  <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#111827] pb-2 border-b border-slate-100 flex items-center gap-1.5">
                    <Grid3X3 className="text-[#0051d5] w-4 h-4 shrink-0" />
                    <span>Global Transaction Reporting Dimensions</span>
                  </h4>

                  <div className="space-y-3.5 text-xs">
                    
                    {dimensionConfigs.costCenter !== 'Not Required' && (
                      <div>
                        <label className="block font-bold text-slate-655 mb-1 flex justify-between">
                          <span>Cost Centre segment {dimensionConfigs.costCenter === 'Mandatory' && <span className="text-red-500">*</span>}</span>
                          <span className="text-[10px] font-semibold text-slate-400">Settings: {dimensionConfigs.costCenter}</span>
                        </label>
                        <select
                          value={selectedCostCenter}
                          onChange={(e) => setSelectedCostCenter(e.target.value)}
                          className="w-full border border-slate-205 p-2 rounded bg-white text-xs"
                        >
                          <option value="CC-DEFAULT">CC-DEFAULT - AA Central Head office</option>
                          <option value="CC-DIST">CC-DIST - Regional Logistics Division</option>
                          <option value="CC-MAN">CC-MAN - Bole Lemi industrial park yard</option>
                        </select>
                      </div>
                    )}

                    {dimensionConfigs.project !== 'Not Required' && (
                      <div>
                        <label className="block font-bold text-slate-655 mb-1 flex justify-between">
                          <span>Associated Project {dimensionConfigs.project === 'Mandatory' && <span className="text-red-500">*</span>}</span>
                          <span className="text-[10px] font-semibold text-slate-400">Settings: {dimensionConfigs.project}</span>
                        </label>
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full border border-slate-205 p-2 rounded bg-white text-xs"
                        >
                          <option value="PRJ-NA">Project N/A - Continuous Operation</option>
                          <option value="PRJ-BOLE-EXP">PRJ-BOLE-EXP - Export Coffee Warehouse Expansion</option>
                          <option value="PRJ-SAP-INTEG">PRJ-SAP-INTEG - SAP S/4HANA Middleware deployment</option>
                        </select>
                      </div>
                    )}

                    {dimensionConfigs.department === 'Not Required' && 
                     dimensionConfigs.costCenter === 'Not Required' &&
                     dimensionConfigs.project === 'Not Required' && (
                      <div className="p-8 bg-slate-50 rounded-xl text-center italic text-slate-400 leading-normal">
                        All financial segments have been disabled by system administrator. No dimensional parameters are enforced on journal entry mappings.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* --- STEP 4: REVIEW & WORKFLOW --- */}
          {step === 4 && (
            <div className="space-y-4">
              
              {/* Layout summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">1. Identity Matrix</span>
                  <p className="font-extrabold text-slate-900 font-mono text-[11px] truncate">[{code || 'PENDING'}] {name || 'Not Entered'}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{company}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">2. Posting controls</span>
                  <p className="font-extrabold text-indigo-700 font-mono text-[11px]">
                    {isHeaderAccount ? 'Summary Folder' : 'Direct Transaction Account'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {slType === 'None' ? 'No Subledger Active' : `Subledger: ${slType}`}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">3. Tax Class Code</span>
                  <p className="font-extrabold text-slate-800 font-mono text-[11px] truncate">{vatCode}</p>
                  <p className="text-[10px] text-slate-500 truncate">{ethiopianTaxCategory}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">4. System Status</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-650 animate-pulse"></span>
                    <span className="font-extrabold text-[#0051d5] text-[11px]">Pending Ledger Insertion</span>
                  </div>
                  <p className="text-[10px] text-slate-500">IFRS Class: {ifrsClass.slice(0, 15)}...</p>
                </div>

              </div>

              {/* Accounting impact preview */}
              <div className="bg-slate-950 text-white p-4 rounded-xl space-y-3 shadow-xs">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest block font-mono">
                  ERP DOUBLE-ENTRY LEDGER IMPACT PREVIEW
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="font-black text-emerald-400 block pb-1 border-b border-emerald-950/60">Debit Posting Impact:</span>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed pt-1">
                      {accountType === 'Asset' || accountType === 'Expense' || accountType === 'Cost of Sales' ? (
                        <span>Increases the asset value and adds to cumulative operating debit balances inside the current period.</span>
                      ) : (
                        <span>Reduces the net balance of this liability/equity/revenue class inside general ledger calculations.</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="font-black text-amber-500 block pb-1 border-b border-amber-950/60">Credit Posting Impact:</span>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed pt-1">
                      {accountType === 'Asset' || accountType === 'Expense' || accountType === 'Cost of Sales' ? (
                        <span>Decreases asset accounts, logging outflows, depreciation writes, or credit adjustments.</span>
                      ) : (
                        <span>Increases cumulative reserves, equity, or operating sales inside the global company balance matrix.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphical Workflow route preview */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs space-y-3.5">
                <h5 className="font-black text-xs text-slate-800 uppercase tracking-tight pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>ERP Multi-Tier Approval Flow Visualization</span>
                </h5>
                <p className="text-[10px] text-slate-500">This account requires compliance clearance before being set as active. Trace flow progress below:</p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-lg">
                  <div className="flex-1 p-2 bg-white rounded border border-indigo-200 text-center text-xs">
                    <span className="text-[9px] font-black text-indigo-500 block uppercase">1. Preparer Stage</span>
                    <span className="font-bold text-slate-800">Accountant</span>
                    <span className="block text-[8px] text-slate-400">mzerihun01@gmail.com</span>
                  </div>
                  <div className="text-center text-slate-300 hidden sm:block">➔</div>
                  <div className="flex-1 p-2 bg-white rounded border border-slate-200 text-center text-xs">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">2. Audit Review</span>
                    <span className="font-bold text-slate-500">Senior Accountant</span>
                    <span className="block text-[8px] text-slate-400">System Checklist Verified</span>
                  </div>
                  <div className="text-center text-slate-300 hidden sm:block">➔</div>
                  <div className="flex-1 p-2 bg-white rounded border border-slate-200 text-center text-xs">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">3. CFO Final Sign-off</span>
                    <span className="font-bold text-slate-500">Finance Manager</span>
                    <span className="block text-[8px] text-slate-400">Authorized approver pool</span>
                  </div>
                </div>
              </div>

              {/* Audit trail comments area */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-3">
                <label className="block font-sans font-black text-xs text-slate-800 uppercase tracking-widest">
                  Internal audit commentary explanations *
                </label>
                <textarea
                  value={auditTrailNotes}
                  onChange={(e) => setAuditTrailNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-250 rounded-lg p-2.5 text-xs text-slate-805 font-sans focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Justify this ledger account inclusion in relation to standard GAAP/IFRS bookkeeping practices."
                  required
                />
              </div>

            </div>
          )}

          {/* Bottom navigation controls */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
            
            <div className="text-[11px] font-bold text-slate-550 font-sans">
              {warnings.length > 0 ? (
                <span className="text-amber-600 block animate-pulse">⚠️ {warnings.length} compliance validation alerts active</span>
              ) : (
                <span className="text-emerald-600">✓ All system constraints conform properly.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 justify-end">
              
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-sans font-bold text-xs rounded-lg transition-all cursor-pointer shadow-3xs"
              >
                Cancel Wizard
              </button>

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-4 py-2 border border-indigo-200 hover:bg-indigo-50 font-sans font-bold text-xs text-indigo-700 rounded-lg transition-all cursor-pointer shadow-3xs"
                >
                  ⭠ Back Step
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  disabled={isValidatingCode}
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  {isValidatingCode ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Next Sequence ➔</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleFinalSubmit('Draft')}
                    className="border border-[#0051d5] text-[#0051d5] hover:bg-[#0051d5]/5 px-4 py-2 rounded-lg text-xs font-sans font-black flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer disabled:opacity-40"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleFinalSubmit('Submit')}
                    className="bg-[#0051d5] border border-blue-600 text-white hover:bg-[#0042b4] px-5 py-2 rounded-lg text-xs font-sans font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-40"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Authorize & Insert Account</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </form>
      )}

    </div>
  );
}

// Inline helper label translator
function getAccountTypeLabel(type: string): string {
  if (type === 'Cost of Sales') return 'Cost';
  if (type === 'Revenue') return 'Income';
  return type;
}

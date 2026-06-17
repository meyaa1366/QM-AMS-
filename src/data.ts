import { 
  Account, 
  EnumValue, 
  LookupGroup, 
  LookupValue, 
  SLMapping, 
  PostingControlRule, 
  DetailedRule, 
  DetailedApiSpec, 
  ImportField, 
  AuditLogEntry,
  AccountType,
  AccountStatus,
  ApprovalStatus,
  SLType,
  DimensionControl,
  VoucherType
} from './types';

export const COMPANIES = [
  'QM AMS Global Holding',
  'QM AMS Ethiopia division',
  'QM AMS East Africa Division',
  'QM AMS Manufacturing Plc',
];

export const BRANCHES = [
  'Addis Ababa Central',
  'Dubai Trade Hub',
  'Adama Branch',
  'Bahir Dar Hub',
  'Dire Dawa City',
  'Hawassa Branch',
];

export const ACCOUNT_TYPES: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Cost of Sales', 'Expense', 'Cost', 'Statistical', 'Memorandum / Off-Balance Sheet'];

export const GROUPS: Record<AccountType, string[]> = {
  Asset: ['Current Assets', 'Non-Current Assets', 'Fixed Assets', 'Intangibles'],
  Liability: ['Current Liabilities', 'Long-term Liabilities', 'Tax Liabilities', 'Provisions'],
  Equity: ['Share Capital', 'Retained Earnings', 'Revaluation Reserves'],
  Revenue: ['Operating Revenue', 'Non-Operating Revenue', 'Financial Income'],
  'Cost of Sales': ['Direct Materials', 'Direct Labor', 'Factory Overheads', 'Subcontracting Cost'],
  Expense: ['Operating Expenses', 'Administrative Expenses', 'Financial Expenses', 'Tax Expenses'],
  Cost: ['Direct Material Cost', 'Direct Labor Cost', 'Indirect Costs'],
  Statistical: ['Statistical Group'],
  'Memorandum / Off-Balance Sheet': ['Memorandum Group'],
};

export const SUBGROUPS: Record<string, string[]> = {
  'Current Assets': ['Cash at Hand', 'Bank Balances', 'Trade Receivables', 'Other Receivables', 'Inventories'],
  'Non-Current Assets': ['Long-term Investments', 'Deferred Tax Assets'],
  'Fixed Assets': ['Land and Buildings', 'Plant and Machinery', 'Office Equipment', 'Vehicles'],
  'Intangibles': ['Goodwill', 'Software Licenses', 'Patents'],
  'Current Liabilities': ['Trade Payables', 'Short-term Borrowings', 'Accrued Expenses'],
  'Long-term Liabilities': ['Bonds Payable', 'Long-term Loans'],
  'Tax Liabilities': ['Income Tax Payable', 'VAT Payable', 'Withholding Tax Payable'],
  'Share Capital': ['Ordinary Shares', 'Preference Shares'],
  'Retained Earnings': ['Retained Earnings - Prior Years', 'Current Year Earnings'],
  'Operating Revenue': ['Domestic Sales', 'Export Sales', 'Service Fees Revenue'],
  'Direct Materials': ['Raw Materials Consumption', 'Consumables Expense'],
  'Direct Labor': ['Direct Wages', 'Contract Overtime wages'],
  'Operating Expenses': ['Cost of Goods Sold', 'Salaries and Wages', 'Rent and Utilities', 'Marketing and Ads'],
  'Administrative Expenses': ['Office Supplies', 'Depreciation', 'Insurance', 'Professional Fees'],
  'Direct Material Cost': ['Direct Materials Raw', 'Factory Consumables'],
  'Direct Labor Cost': ['Wages and Salaries', 'Overtime Wages'],
  'Indirect Costs': ['Factory Rent', 'Utility Cost'],
};

export const IFRS_CLASSES = [
  'IAS 1 - Presentation of Financial Statements',
  'IAS 2 - Inventories',
  'IAS 7 - Statement of Cash Flows',
  'IAS 12 - Income Taxes',
  'IAS 16 - Property, Plant and Equipment',
  'IFRS 9 - Financial Instruments',
  'IFRS 15 - Revenue from Contracts with Customers',
  'IFRS 16 - Leases',
];

export const FINANCIAL_STATEMENT_LINES = [
  'Cash and Cash Equivalents',
  'Trade and Other Receivables',
  'Inventories',
  'Other Current Assets',
  'Property, Plant and Equipment',
  'Intangible Assets',
  'Trade and Other Payables',
  'Short-term Provisions',
  'Long-term Debt',
  'Deferred Tax Liabilities',
  'Shareholders Capital',
  'Revenue from Operations',
  'Other Income',
  'Cost of Materials',
  'Employee Benefit Expenses',
  'Depreciation and Amortization',
  'Finance Costs',
  'Other Operating Expenses',
  'Income Tax Expense',
];

export const VAT_CODES = [
  'VAT-15 (Standard Local Input)',
  'VAT-15 (Standard Local Output)',
  'VAT-0 (Zero Rated Exports)',
  'VAT-E (Exempt Goods & Services)',
  'Not Applicable',
];

export const WHT_CODES = [
  'WHT-2 (Services Rendering)',
  'WHT-5 (Lease/Rent of Premises)',
  'WHT-10 (Dividends/Royalties payout)',
  'Not Applicable',
];

export const ETHIOPIAN_TAX_CATEGORIES = [
  'Large Taxpayer — Category A',
  'Medium Taxpayer — Category B',
  'Small Taxpayer — Category C',
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: '1000',
    code: '1000',
    name: 'Assets',
    parentAccount: 'None',
    level: 1,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Asset',
    group: 'Current Assets',
    subgroup: 'Cash at Hand',
    ifrsClass: 'IAS 1 - Presentation of Financial Statements',
    financialStatementLine: 'Cash and Cash Equivalents',
    postingAllowed: false,
    controlAccount: false,
    manualJournalAllowed: false,
    systemPostingOnly: true,
    slType: 'None',
    vatCode: 'Not Applicable',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Not Required',
    department: 'Not Required',
    project: 'Not Required',
    segment: 'Mandatory',
    profitCenter: 'Not Required',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Debit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'System base account initialized for parent node mapping.'
  },
  {
    id: '1100',
    code: '1100',
    name: 'Current Assets',
    parentAccount: '1000',
    level: 2,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Asset',
    group: 'Current Assets',
    subgroup: 'Cash at Hand',
    ifrsClass: 'IAS 1 - Presentation of Financial Statements',
    financialStatementLine: 'Cash and Cash Equivalents',
    postingAllowed: false,
    controlAccount: false,
    manualJournalAllowed: false,
    systemPostingOnly: true,
    slType: 'None',
    vatCode: 'Not Applicable',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Not Required',
    department: 'Not Required',
    project: 'Optional',
    segment: 'Mandatory',
    profitCenter: 'Not Required',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Debit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'Level 2 hierarchy classification for cash-like items.'
  },
  {
    id: '1110',
    code: '1110',
    name: 'Cash and Bank Equivalents',
    parentAccount: '1100',
    level: 3,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Asset',
    group: 'Current Assets',
    subgroup: 'Bank Balances',
    ifrsClass: 'IAS 7 - Statement of Cash Flows',
    financialStatementLine: 'Cash and Cash Equivalents',
    postingAllowed: true,
    controlAccount: false,
    manualJournalAllowed: true,
    systemPostingOnly: false,
    slType: 'Bank',
    vatCode: 'Not Applicable',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Optional',
    department: 'Optional',
    project: 'Optional',
    segment: 'Mandatory',
    profitCenter: 'Optional',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Debit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'Requires monthly bank statement reconciliation workflows.'
  },
  {
    id: '1120',
    code: '1120',
    name: 'Accounts Receivable Ledger',
    parentAccount: '1100',
    level: 3,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Asset',
    group: 'Current Assets',
    subgroup: 'Trade Receivables',
    ifrsClass: 'IFRS 9 - Financial Instruments',
    financialStatementLine: 'Trade and Other Receivables',
    postingAllowed: true,
    controlAccount: true,
    manualJournalAllowed: false,
    systemPostingOnly: false,
    slType: 'Customer',
    vatCode: 'VAT-15 (Standard Local Output)',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Mandatory',
    department: 'Optional',
    project: 'Optional',
    segment: 'Mandatory',
    profitCenter: 'Mandatory',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Debit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'Mapped as customer sub-ledger to block direct manual journal post.'
  },
  {
    id: '2000',
    code: '2000',
    name: 'Liabilities',
    parentAccount: 'None',
    level: 1,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Liability',
    group: 'Current Liabilities',
    subgroup: 'Trade Payables',
    ifrsClass: 'IAS 1 - Presentation of Financial Statements',
    financialStatementLine: 'Trade and Other Payables',
    postingAllowed: false,
    controlAccount: false,
    manualJournalAllowed: false,
    systemPostingOnly: true,
    slType: 'None',
    vatCode: 'Not Applicable',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Not Required',
    department: 'Not Required',
    project: 'Not Required',
    segment: 'Mandatory',
    profitCenter: 'Not Required',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Credit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'Root liability class setup.'
  },
  {
    id: '2100',
    code: '2100',
    name: 'Accounts Payable AP',
    parentAccount: '2000',
    level: 2,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Liability',
    group: 'Current Liabilities',
    subgroup: 'Trade Payables',
    ifrsClass: 'IFRS 9 - Financial Instruments',
    financialStatementLine: 'Trade and Other Payables',
    postingAllowed: true,
    controlAccount: true,
    manualJournalAllowed: false,
    systemPostingOnly: false,
    slType: 'Supplier',
    vatCode: 'VAT-15 (Standard Local Input)',
    whtCode: 'Not Applicable',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Mandatory',
    department: 'Mandatory',
    project: 'Optional',
    segment: 'Mandatory',
    profitCenter: 'Optional',
    status: 'Active',
    approvalStatus: 'Approved',
    balance: 'Credit',
    createdBy: 'mzerihun01@gmail.com',
    approvedBy: 'senior_auditor@qmathings.com',
    auditTrailNotes: 'Associated directly to Supplier subsidiary ledger ledger.'
  },
  {
    id: '2200',
    code: '2200',
    name: 'Withholding Tax Payable',
    parentAccount: '2000',
    level: 2,
    company: 'QM AMS Global Holding',
    branch: 'Addis Ababa Central',
    accountType: 'Liability',
    group: 'Tax Liabilities',
    subgroup: 'Withholding Tax Payable',
    ifrsClass: 'IAS 12 - Income Taxes',
    financialStatementLine: 'Trade and Other Payables',
    postingAllowed: true,
    controlAccount: false,
    manualJournalAllowed: true,
    systemPostingOnly: false,
    slType: 'Tax Authority',
    vatCode: 'Not Applicable',
    whtCode: 'WHT-2 (Services Rendering)',
    ethiopianTaxCategory: 'Large Taxpayer — Category A',
    costCenter: 'Optional',
    department: 'Optional',
    project: 'Optional',
    segment: 'Mandatory',
    profitCenter: 'Not Required',
    status: 'Pending Approval',
    approvalStatus: 'Submitted',
    balance: 'Credit',
    createdBy: 'mzerihun01@gmail.com',
    auditTrailNotes: 'Temporary liability account for holding 2% withholding deductions.'
  }
];

export const INITIAL_ENUM_VALUES: EnumValue[] = [
  // Account Type
  { enumGroup: 'Account Type', displayName: 'Asset', backendKey: 'ASSET', description: 'Resources owned/controlled', isDefault: true, isActive: true, sortOrder: 1, usedInField: 'accountType' },
  { enumGroup: 'Account Type', displayName: 'Liability', backendKey: 'LIABILITY', description: 'Obligations needing settlements', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'accountType' },
  { enumGroup: 'Account Type', displayName: 'Equity', backendKey: 'EQUITY', description: 'Shareholders interest residual', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'accountType' },
  { enumGroup: 'Account Type', displayName: 'Revenue', backendKey: 'REVENUE', description: 'Operating sales flow', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'accountType' },
  { enumGroup: 'Account Type', displayName: 'Cost of Sales', backendKey: 'COST_OF_SALES', description: 'Direct purchase/delivery cost', isDefault: false, isActive: true, sortOrder: 5, usedInField: 'accountType' },
  { enumGroup: 'Account Type', displayName: 'Expense', backendKey: 'EXPENSE', description: 'Overhead expenses', isDefault: false, isActive: true, sortOrder: 6, usedInField: 'accountType' },

  // Account Nature
  { enumGroup: 'Account Nature', displayName: 'Header', backendKey: 'HEADER', description: 'Non-posting summary node', isDefault: false, isActive: true, sortOrder: 1, usedInField: 'postingAllowed' },
  { enumGroup: 'Account Nature', displayName: 'Posting', backendKey: 'POSTING', description: 'Direct transaction entries', isDefault: true, isActive: true, sortOrder: 2, usedInField: 'postingAllowed' },
  { enumGroup: 'Account Nature', displayName: 'Control', backendKey: 'CONTROL', description: 'Summary for subsidiary journals', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'controlAccount' },
  { enumGroup: 'Account Nature', displayName: 'Contra', backendKey: 'CONTRA', description: 'Off-setting account', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'group' },
  { enumGroup: 'Account Nature', displayName: 'Statistical', backendKey: 'STATISTICAL', description: 'Non-matching quantity tracking', isDefault: false, isActive: true, sortOrder: 5, usedInField: 'subgroup' },
  { enumGroup: 'Account Nature', displayName: 'System', backendKey: 'SYSTEM', description: 'System-exclusive posting only', isDefault: false, isActive: true, sortOrder: 6, usedInField: 'systemPostingOnly' },

  // Normal Balance
  { enumGroup: 'Normal Balance', displayName: 'Debit', backendKey: 'DEBIT', description: 'Standard debit increment', isDefault: true, isActive: true, sortOrder: 1, usedInField: 'balance' },
  { enumGroup: 'Normal Balance', displayName: 'Credit', backendKey: 'CREDIT', description: 'Standard credit increment', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'balance' },
  { enumGroup: 'Normal Balance', displayName: 'Debit or Credit', backendKey: 'DEBIT_OR_CREDIT', description: 'Clearing account flexible balance', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'balance' },
  { enumGroup: 'Normal Balance', displayName: 'None', backendKey: 'NONE', description: 'Zeroed statistical indicator', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'balance' },

  // Posting Allowed
  { enumGroup: 'Posting Allowed', displayName: 'Yes', backendKey: 'POSTING_YES', description: 'Fully open for journal entries', isDefault: true, isActive: true, sortOrder: 1, usedInField: 'postingAllowed' },
  { enumGroup: 'Posting Allowed', displayName: 'No', backendKey: 'POSTING_NO', description: 'Blocked for summary structure', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'postingAllowed' },
  { enumGroup: 'Posting Allowed', displayName: 'System Only', backendKey: 'POSTING_SYSTEM_ONLY', description: 'Engine automatic writes only', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'systemPostingOnly' },
  { enumGroup: 'Posting Allowed', displayName: 'Subledger Only', backendKey: 'POSTING_SL_ONLY', description: 'Must post via subsidiary ledger source', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'controlAccount' },

  // SL Type
  { enumGroup: 'SL Type', displayName: 'Customer', backendKey: 'SL_CUSTOMER', description: 'Customer receivables AR accounts', isDefault: false, isActive: true, sortOrder: 1, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Supplier', backendKey: 'SL_SUPPLIER', description: 'Vendor/Supplier payables AP accounts', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Bank', backendKey: 'SL_BANK', description: 'Bank ledger check accounts', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Cash', backendKey: 'SL_CASH', description: 'Petty cash holdings registers', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Inventory', backendKey: 'SL_INVENTORY', description: 'Product stock materials books', isDefault: false, isActive: true, sortOrder: 5, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Fixed Asset', backendKey: 'SL_FIXED_ASSETS', description: 'Equipment plant asset records', isDefault: false, isActive: true, sortOrder: 6, usedInField: 'slType' },
  { enumGroup: 'SL Type', displayName: 'Tax Authority', backendKey: 'SL_TAX', description: 'Tax schedules for ERCA', isDefault: false, isActive: true, sortOrder: 7, usedInField: 'slType' },

  // VAT Applicability
  { enumGroup: 'VAT Applicability', displayName: 'VAT Input', backendKey: 'VAT_INPUT', description: 'Deductible local standard purchases', isDefault: false, isActive: true, sortOrder: 1, usedInField: 'vatCode' },
  { enumGroup: 'VAT Applicability', displayName: 'VAT Output', backendKey: 'VAT_OUTPUT', description: 'Chargeable local standard sales', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'vatCode' },
  { enumGroup: 'VAT Applicability', displayName: 'VAT Exempt', backendKey: 'VAT_EXEMPT', description: 'Goods explicitly legally exempt', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'vatCode' },
  { enumGroup: 'VAT Applicability', displayName: 'Zero Rated', backendKey: 'VAT_ZERO_RATE', description: '0% rate for export goods', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'vatCode' },
  { enumGroup: 'VAT Applicability', displayName: 'Not Applicable', backendKey: 'VAT_NOT_APPLICABLE', description: 'Excluded from revenue registers', isDefault: true, isActive: true, sortOrder: 5, usedInField: 'vatCode' },

  // Account Status
  { enumGroup: 'Account Status', displayName: 'Draft', backendKey: 'STATUS_DRAFT', description: 'Temporary workflow state', isDefault: true, isActive: true, sortOrder: 1, usedInField: 'status' },
  { enumGroup: 'Account Status', displayName: 'Pending Approval', backendKey: 'STATUS_PENDING', description: 'Awaiting compliance officer review', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'status' },
  { enumGroup: 'Account Status', displayName: 'Active', backendKey: 'STATUS_ACTIVE', description: 'Unlocked for daily journaling', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'status' },
  { enumGroup: 'Account Status', displayName: 'Inactive', backendKey: 'STATUS_INACTIVE', description: 'Retrained from journals', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'status' },
  { enumGroup: 'Account Status', displayName: 'Blocked', backendKey: 'STATUS_BLOCKED', description: 'Auditor freeze block', isDefault: false, isActive: true, sortOrder: 5, usedInField: 'status' },
  { enumGroup: 'Account Status', displayName: 'Archived', backendKey: 'STATUS_ARCHIVED', description: 'historical audit state only', isDefault: false, isActive: true, sortOrder: 6, usedInField: 'status' },

  // Approval Status
  { enumGroup: 'Approval Status', displayName: 'Not Submitted', backendKey: 'APP_NOT_SUBMITTED', description: 'Local editor draft', isDefault: true, isActive: true, sortOrder: 1, usedInField: 'approvalStatus' },
  { enumGroup: 'Approval Status', displayName: 'Submitted', backendKey: 'APP_SUBMITTED', description: 'In progress auditor queue', isDefault: false, isActive: true, sortOrder: 2, usedInField: 'approvalStatus' },
  { enumGroup: 'Approval Status', displayName: 'Approved', backendKey: 'APP_APPROVED', description: 'Signed and active in book', isDefault: false, isActive: true, sortOrder: 3, usedInField: 'approvalStatus' },
  { enumGroup: 'Approval Status', displayName: 'Rejected', backendKey: 'APP_REJECTED', description: 'Review failure returned draft', isDefault: false, isActive: true, sortOrder: 4, usedInField: 'approvalStatus' },
  { enumGroup: 'Approval Status', displayName: 'Returned', backendKey: 'APP_RETURNED', description: 'Returned for additional data', isDefault: false, isActive: true, sortOrder: 5, usedInField: 'approvalStatus' },
];

export const LOOKUP_GROUPS: LookupGroup[] = [
  { groupKey: 'COMPANY', displayName: 'Company / Entity', description: 'Legal corporate organizations', neededFor: 'Entity identity segregations' },
  { groupKey: 'BRANCH', displayName: 'Branch Location', description: 'Local geographical retail/corporate offices', neededFor: 'Tax filings & regional routing' },
  { groupKey: 'BIZ_UNIT', displayName: 'Business Unit', description: 'Corporate division line matrices', neededFor: 'Segment Reporting under IFRS 8' },
  { groupKey: 'DEPT', displayName: 'Department', description: 'Internal operating units', neededFor: 'Overhead allocation matrices' },
  { groupKey: 'COST_CENTER', displayName: 'Cost Center', description: 'Expense tracking areas', neededFor: 'Operational cost validation' },
  { groupKey: 'PROJECT', displayName: 'Project', description: 'Temporary localized enterprise jobs', neededFor: 'Direct job-costing schedules' },
  { groupKey: 'SEGMENT', displayName: 'Segment', description: 'IFRS-compliant reporting categories', neededFor: 'Disclosed operating statements' },
  { groupKey: 'PROFIT_CENTER', displayName: 'Profit Center', description: 'Internal division margins managers', neededFor: 'Segment asset valuations' },
  { groupKey: 'CURRENCY', displayName: 'Currency', description: 'Standard currency notations', neededFor: 'IAS 21 multi-currency transactions' },
  { groupKey: 'TAX_CODE', displayName: 'Tax Code', description: 'Direct regional tax rate formulas', neededFor: 'Corporate compliance auditing' },
  { groupKey: 'VAT_CODE', displayName: 'VAT Code', description: 'Ethiopian standard VAT schedules', neededFor: 'Monthly VAT filings (ERCA)' },
  { groupKey: 'WHT_CODE', displayName: 'Withholding Tax Code', description: 'Withholding legal assignments (2% or 5%)', neededFor: 'Supplier invoice matching' },
  { groupKey: 'PARENT_ACC', displayName: 'Parent Account', description: 'Hierarchical rollup nodes', neededFor: 'Consolidation sum math' },
  { groupKey: 'FIN_STATE_LINE', displayName: 'Financial Statement Line', description: 'Standard taxonomy classification slots', neededFor: 'Balance Sheet presentation' },
  { groupKey: 'CASH_FLOW_LINE', displayName: 'Cash Flow Line', description: 'IAS 7 cash flow categories', neededFor: 'Cash flow statement generation' },
  { groupKey: 'BUDGET_CAT', displayName: 'Budget Category', description: 'Budgetary threshold groupings', neededFor: 'Yearly budget variance checks' },
  { groupKey: 'CUST_GROUP', displayName: 'Customer Group', description: 'Tax residency and segment divisions', neededFor: 'Sub-ledger validation rules' },
  { groupKey: 'SUPP_GROUP', displayName: 'Supplier Group', description: 'Local vs foreign supply segments', neededFor: 'Withholding tax applicability' },
  { groupKey: 'INV_CAT', displayName: 'Inventory Category', description: 'Asset stocks and materials types', neededFor: 'LIFO/Weighted Average IAS 2 rules' },
  { groupKey: 'FA_CAT', displayName: 'Fixed Asset Category', description: 'Tangible property categories', neededFor: 'IAS 16 depreciation schedules' },
  { groupKey: 'INTERCO', displayName: 'Intercompany Partner', description: 'Affiliates for elimination', neededFor: 'Holding consolidation eliminations' },
];

export const INITIAL_LOOKUP_VALUES: LookupValue[] = [
  // Company lookups
  { id: 'L-01', groupKey: 'COMPANY', code: 'FC-HOLD', displayName: 'QM AMS Global Holding', description: 'Consolidated parent entity based in Dubai', isActive: true },
  { id: 'L-02', groupKey: 'COMPANY', code: 'FC-ETH', displayName: 'QM AMS Ethiopia division', description: 'Local operating subsidiary under ERCA scope', isActive: true },
  { id: 'L-03', groupKey: 'COMPANY', code: 'FC-EAF', displayName: 'QM AMS East Africa Division', description: 'Regional division overseeing Kenya and Uganda', isActive: true },

  // Branch lookups
  { id: 'L-04', groupKey: 'BRANCH', code: 'BR-ADD-01', displayName: 'Addis Ababa Central', description: 'Main office located in Bole District', isActive: true, metaData: { location: '9.0333° N, 38.7500° E', routing: '01-9982-1', currency: 'ETB' } },
  { id: 'L-05', groupKey: 'BRANCH', code: 'BR-ADA-02', displayName: 'Adama Branch', description: 'Operating hub along Expressway', isActive: true, metaData: { location: '8.5500° N, 39.2667° E', routing: '02-4410-4', currency: 'ETB' } },
  { id: 'L-06', groupKey: 'BRANCH', code: 'BR-BAH-03', displayName: 'Bahir Dar Hub', description: 'Regional hub serving Amhara division', isActive: false, metaData: { location: '11.5900° N, 37.3900° E', routing: '03-1129-9', currency: 'ETB' } },

  // Business Unit
  { id: 'L-07', groupKey: 'BIZ_UNIT', code: 'BU-RETAIL', displayName: 'Consumer Retail Group', description: 'Direct consumer transactions division', isActive: true },
  { id: 'L-08', groupKey: 'BIZ_UNIT', code: 'BU-MFG', displayName: 'Industrial Manufacturing', description: 'Production lines operations plc', isActive: true },

  // Department
  { id: 'L-09', groupKey: 'DEPT', code: 'D-FIN', displayName: 'Finance & Accounts', description: 'General accounting and tax controllers', isActive: true },
  { id: 'L-10', groupKey: 'DEPT', code: 'D-HR', displayName: 'Human Resources', description: 'Recruitment and benefit operations', isActive: true },
  { id: 'L-11', groupKey: 'DEPT', code: 'D-OPS', displayName: 'Supply Chain Operations', description: 'Import logisitics and deliveries', isActive: true },

  // Cost Center
  { id: 'L-12', groupKey: 'COST_CENTER', code: 'CC-ADM-01', displayName: 'Administrative Overhead', description: 'Shared executive office administrative cost', isActive: true },
  { id: 'L-13', groupKey: 'COST_CENTER', code: 'CC-SALES-02', displayName: 'Bole Retail Outlet', description: 'Bole branch point-of-sale costs center', isActive: true },

  // Currency
  { id: 'L-14', groupKey: 'CURRENCY', code: 'ETB', displayName: 'Ethiopian Birr', description: 'Official transaction currency of Ethiopia Subsidiary', isActive: true },
  { id: 'L-15', groupKey: 'CURRENCY', code: 'USD', displayName: 'US Dollar', description: 'Reporting currency of Global Parent plc', isActive: true },

  // Tax/VAT Code limits
  { id: 'L-16', groupKey: 'VAT_CODE', code: 'VAT-15-IN', displayName: 'VAT Standard Input (15%)', description: 'Local standard purchase tax recovery code', isActive: true },
  { id: 'L-17', groupKey: 'VAT_CODE', code: 'VAT-15-OUT', displayName: 'VAT Standard Output (15%)', description: 'Standard sales transaction tax liability code', isActive: true },
  { id: 'L-18', groupKey: 'WHT_CODE', code: 'WHT-SERVICE-2', displayName: 'Services Withholding (2%)', description: 'ERCA legal withholding on purchases over ETB 10,000', isActive: true }
];

export const SL_MAPPINGS: SLMapping[] = [
  { slType: 'Customer', controlAccountCode: '1120', controlAccountName: 'Accounts Receivable Ledger', mappingRule: 'Each registered active customer profile triggers a virtual segment 1120-XXXX sub-ledger card automatically.', reconciliationRequired: true },
  { slType: 'Supplier', controlAccountCode: '2100', controlAccountName: 'Accounts Payable AP', mappingRule: 'Vendor registration enforces dynamic CJS string matching to 2100-XXXX block with withholding calculation triggers.', reconciliationRequired: true },
  { slType: 'Bank', controlAccountCode: '1110', controlAccountName: 'Cash and Bank Equivalents', mappingRule: 'Bank lookup codes match direct multi-currency revaluation formulas.', reconciliationRequired: true },
  { slType: 'Employee', controlAccountCode: '2145', controlAccountName: 'Staff Salary Escrows', mappingRule: 'Payroll engine writes advance loans balances to staff sub-ledgers directly.', reconciliationRequired: false },
  { slType: 'Fixed Asset', controlAccountCode: '1500', controlAccountName: 'Buildings & Plant Assets', mappingRule: 'Accumulated depreciation IAS 16 formulas write sub-ledgers hourly.', reconciliationRequired: true },
  { slType: 'Tax Authority', controlAccountCode: '2200', controlAccountName: 'Withholding Tax Payable', mappingRule: 'Monthly ERCA batch clearing extracts tax sub-ledger journal codes.', reconciliationRequired: true }
];

export const POSTING_CONTROL_RULES: PostingControlRule[] = [
  { accountType: 'Asset', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: true, manualPostAllowed: true, sysPostAllowed: true },
  { accountType: 'Liability', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: true, manualPostAllowed: true, sysPostAllowed: true },
  { accountType: 'Equity', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: false, manualPostAllowed: false, sysPostAllowed: true },
  { accountType: 'Revenue', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: false, manualPostAllowed: true, sysPostAllowed: true },
  { accountType: 'Cost of Sales', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: false, manualPostAllowed: true, sysPostAllowed: true },
  { accountType: 'Expense', postingAllowed: 'Yes', headerAllowed: false, controlAccountAllowed: false, manualPostAllowed: true, sysPostAllowed: true }
];

export const DETAILED_RULES: DetailedRule[] = [
  {
    id: 'BR-COA-01',
    name: 'Account Code Unique Per Company',
    appliesTo: 'General Ledger Account',
    triggerEvent: 'Insert / Update Account metadata',
    condition: 'NEW.account_code EXISTS IN (SELECT code FROM accounts WHERE company = NEW.company)',
    expectedBehavior: 'System checks code existence in database. Throws validation failure preventing writes.',
    errorMessage: 'Account Code code is already registered under company name.',
    severity: 'Critical',
    validationLocation: 'Backend / Account Code Validator (COA Validator)',
    relatedApi: 'POST /coa/accounts',
    relatedTable: 'coa_accounts',
    testScenario: 'Try creating account 1120 under company QM AMS Global Holding. Must fail if 1120 already exists.'
  },
  {
    id: 'BR-COA-02',
    name: 'Account Code Must Match Account Type Range',
    appliesTo: 'GL Code Strings',
    triggerEvent: 'Insert / Update Account',
    condition: 'NEW.code falls outside pre-assigned enum ranges defined for the Account Type',
    expectedBehavior: 'Validator parses starting characters of code. Code must start with 1 for Assets, 2 for Liabilities, 3 for Equity, 4 for Revenues, 5 for COS/Expenses.',
    errorMessage: 'Validation Failure: Account Code must align with standard category range rules (e.g. Assets start with 1).',
    severity: 'Critical',
    validationLocation: 'Backend / Schema Range Validator',
    relatedApi: 'POST /coa/validate-account-code',
    relatedTable: 'coa_accounts',
    testScenario: 'Submit an Asset account with code "5200". Validator returns error 400 immediately.'
  },
  {
    id: 'BR-COA-03',
    name: 'Parent Account Must Be Same Company',
    appliesTo: 'Hierarchical rollup references',
    triggerEvent: 'Set parentAccount value',
    condition: 'NEW.parentAccount != "None" AND (SELECT company FROM accounts WHERE code=NEW.parentAccount) != NEW.company',
    expectedBehavior: 'Validate that both parent and child accounts operate under identical corporate legal entities.',
    errorMessage: 'Hierarchy Violation: Parent account must operate under the exact same corporate entity scope.',
    severity: 'Critical',
    validationLocation: 'Backend / Tree Hierarchy Inspector',
    relatedApi: 'POST /coa/accounts/{id}/submit',
    relatedTable: 'coa_accounts',
    testScenario: 'Create account 1125 under QM AMS Ethiopia Ltd but set parent to 1100 (which belongs to QM AMS Global Holding).'
  },
  {
    id: 'BR-COA-04',
    name: 'Posting Account Cannot Have Child Accounts',
    appliesTo: 'Leaf Node vs Folder Rules',
    triggerEvent: 'Save Child Account',
    condition: 'PARENT.postingAllowed == true',
    expectedBehavior: 'Block saving child node if targeted parent account is already flagged as an active posting account.',
    errorMessage: 'Hierarchy Error: A leaf-level posting account cannot act as a folder parent. Disable Posting on parent first.',
    severity: 'Critical',
    validationLocation: 'Backend / Structural Integrity Rule',
    relatedApi: 'POST /coa/accounts',
    relatedTable: 'coa_accounts',
    testScenario: 'Setting account 1110 (posting: true) as parent of a new account code.'
  },
  {
    id: 'BR-COA-05',
    name: 'Header Account Cannot Post Journals',
    appliesTo: 'Double-entry posting flow',
    triggerEvent: 'Double-entry journal writing (GL posting)',
    condition: 'JOURNAL_LINE.account_code IN (SELECT code FROM accounts WHERE postingAllowed=false)',
    expectedBehavior: 'Journals engine checks ledger setup records first; exits with failure if postingAllowed is false.',
    errorMessage: 'Posting Blocked: The target account is defined as a Header node. Directly booking journals is prohibited.',
    severity: 'Critical',
    validationLocation: 'Backend / Posting Validator engine',
    relatedApi: 'POST /coa/validate-posting-account',
    relatedTable: 'gl_journals',
    testScenario: 'Create a journal post to Debit account code "1000" (Assets Folder). Journal must fail checks.'
  },
  {
    id: 'BR-COA-06',
    name: 'Control Account Requires SL Type',
    appliesTo: 'Subsidiary Ledger settings',
    triggerEvent: 'Save Account metadata',
    condition: 'NEW.controlAccount == true AND NEW.slType == "None"',
    expectedBehavior: 'If an account is configured as a Control Account, it must identify a subsidiary ledger mapping type.',
    errorMessage: 'Control Account Misconfiguration: A Control Account requires a Subsidiary Ledger mapping selection.',
    severity: 'Warning',
    validationLocation: 'Backend / Compliance Rule Evaluator',
    relatedApi: 'PUT /coa/accounts/{id}',
    relatedTable: 'coa_accounts',
    testScenario: 'Toggle Control Account checkmark to True but leave SL Type as None.'
  },
  {
    id: 'BR-COA-07',
    name: 'AR Control Account Must Use Customer SL',
    appliesTo: 'Receivables Control Rule',
    triggerEvent: 'Submit AR account',
    condition: 'NEW.code STARTS WITH "112" AND NEW.controlAccount == true AND NEW.slType != "Customer"',
    expectedBehavior: 'Ensures standard receivables are tied exclusively to customer ledger segments.',
    errorMessage: 'Control Slip Error: Trade Receivables control accounts must restrict SL maps to Customer registries exclusively.',
    severity: 'Critical',
    validationLocation: 'Backend / Accounts Receivable audit stream',
    relatedApi: 'POST /coa/accounts',
    relatedTable: 'coa_accounts',
    testScenario: 'Assign SL Type of Supplier onto Receivables account 1120.'
  },
  {
    id: 'BR-COA-08',
    name: 'AP Control Account Must Use Supplier SL',
    appliesTo: 'Payables Control Rule',
    triggerEvent: 'Submit AP account',
    condition: 'NEW.code STARTS WITH "210" AND NEW.controlAccount == true AND NEW.slType != "Supplier"',
    expectedBehavior: 'Ensures payables are tied exclusively to vendor ledger segments.',
    errorMessage: 'Control Slip Error: Trade Payables control accounts must restrict SL maps to Supplier registries exclusively.',
    severity: 'Critical',
    validationLocation: 'Backend / Accounts Payable audit stream',
    relatedApi: 'POST /coa/accounts',
    relatedTable: 'coa_accounts',
    testScenario: 'Assign SL Type of Bank onto payables account 2100.'
  },
  {
    id: 'BR-COA-09',
    name: 'Bank Account Requires Reconciliation',
    appliesTo: 'Bank Cash Accounts',
    triggerEvent: 'Set Bank SL Type',
    condition: 'NEW.slType == "Bank" AND NEW.revaluationRequired != true',
    expectedBehavior: 'Verify that any cash-at-bank asset complies with IAS 21 or requires monthly statement reconciliation.',
    errorMessage: 'Auditing Advisory: Cash at bank ledger accounts should be set as reconcilable for bank clearing.',
    severity: 'Info',
    validationLocation: 'Compliance audit scheduler',
    relatedApi: 'PUT /coa/accounts/{id}',
    relatedTable: 'coa_accounts',
    testScenario: 'Identify Bank ledger that has no reconciliation schedules flagged.'
  },
  {
    id: 'BR-COA-10',
    name: 'Tax Account Requires Tax Mapping',
    appliesTo: 'Tax ledger definitions',
    triggerEvent: 'Save Account under VAT subgroup',
    condition: 'NEW.subgroup == "VAT Payable" AND NEW.vatCode == "None"',
    expectedBehavior: 'VAT and Withholding tax GL ledger mappings must declare standard tax transaction codes.',
    errorMessage: 'Compliance Warning: Tax Accounts require VAT or Withholding transaction category mapping.',
    severity: 'Warning',
    validationLocation: 'Tax Compliance Engine (ERCA Mapping Node)',
    relatedApi: 'POST /coa/accounts',
    relatedTable: 'coa_accounts',
    testScenario: 'Save VAT Payable account 2100 with VAT Code set to N/A.'
  },
  {
    id: 'BR-COA-11',
    name: 'Account With Transactions Cannot Be Deleted',
    appliesTo: 'Retiring ledger indexes',
    triggerEvent: 'DELETE request to /coa/accounts/{id}',
    condition: 'EXISTS (SELECT 1 FROM gl_journal_lines WHERE account_code = ID)',
    expectedBehavior: 'API returns error 409 Conflict. Suggests deactivating instead of deleting historical data.',
    errorMessage: 'Integrity Violation: This Account Code has active transaction history. Deletion is blocked; flag inactive instead.',
    severity: 'Critical',
    validationLocation: 'Backend / Database Referential Integrity',
    relatedApi: 'PUT /coa/accounts/{id}/deactivate',
    relatedTable: 'coa_accounts',
    testScenario: 'Submit delete command to asset account 1110 (which contains active journals).'
  },
  {
    id: 'BR-COA-12',
    name: 'Account Type Cannot Change After Posting Exists',
    appliesTo: 'Alter ledger settings',
    triggerEvent: 'Update AccountType field',
    condition: 'OLD.accountType != NEW.accountType AND EXISTS (SELECT 1 FROM gl_journal_lines WHERE account_code=OLD.code)',
    expectedBehavior: 'Block type alteration to prevent unbalancing financial statement structures.',
    errorMessage: 'Operational Block: Cannot alter account nature from Asset to Expense because active journal posts exist.',
    severity: 'Critical',
    validationLocation: 'Schema alteration auditor',
    relatedApi: 'PUT /coa/accounts/{id}',
    relatedTable: 'coa_accounts',
    testScenario: 'Change account 1110 type from Asset to Revenue.'
  },
  {
    id: 'BR-COA-13',
    name: 'Inactive Account Blocked From New Transaction',
    appliesTo: 'Transactional journal entries checking',
    triggerEvent: 'Double-entry journal writing',
    condition: 'JOURNAL_LINE.account_code IN (SELECT code FROM accounts WHERE status="Inactive" OR status="Blocked")',
    expectedBehavior: 'Block posting process if any associated ledger register is inactive or frozen.',
    errorMessage: 'Transaction Failure: Target General Ledger account is frozen or deactivated. Postings refused.',
    severity: 'Critical',
    validationLocation: 'Backend / Posting Validator engine',
    relatedApi: 'POST /coa/validate-posting-account',
    relatedTable: 'gl_journals',
    testScenario: 'Post journal entries assigning debit line to a blocked tax payable account.'
  }
];

export const DETAILED_API_SPECS: DetailedApiSpec[] = [
  {
    method: 'POST',
    endpoint: '/api/v1/coa/accounts',
    description: 'Registers a brand-new General Ledger account node in QM AMS ERP system database after hierarchical validation.',
    version: 'v4.1.0-stable',
    requestFields: [
      { name: 'code', type: 'string', required: true, desc: 'Unique account identifier string matching type masks (e.g. 1010-002)' },
      { name: 'name', type: 'string', required: true, desc: 'Human-legible display title for books' },
      { name: 'company', type: 'string', required: true, desc: 'Standard registered corporate name' },
      { name: 'parentAccount', type: 'string', required: true, desc: 'Immediate parent code string or "None"' },
      { name: 'accountType', type: 'enum', required: true, desc: 'One of Asset, Liability, Equity, Revenue, Cost of Sales, Expense' }
    ],
    responseFields: [
      { name: 'id', type: 'string', desc: 'System primary database key' },
      { name: 'status', type: 'string', desc: 'Current account list lifecycle status (e.g. Draft)' },
      { name: 'level', type: 'number', desc: 'Calculated hierarchical nesting depth level' }
    ],
    rulesApplied: ['BR-COA-01', 'BR-COA-02', 'BR-COA-03', 'BR-COA-04'],
    permissionRequired: 'ACCOUNTANT_CREATE',
    auditRequired: true,
    errorResponses: [
      { status: 400, desc: 'Validation failures or rule clashing' },
      { status: 409, desc: 'Account Code already registered under target company' }
    ]
  },
  {
    method: 'PUT',
    endpoint: '/api/v1/coa/accounts/{id}',
    description: 'Alters metadata properties of an existing GL ledger account, validating type transformations and integrity rules.',
    version: 'v4.1.0-stable',
    requestFields: [
      { name: 'name', type: 'string', required: false, desc: 'Altered display label' },
      { name: 'postingAllowed', type: 'boolean', required: false, desc: 'Flag allowing line posting journals' },
      { name: 'slType', type: 'string', required: false, desc: 'Target subsidiary ledger setup' }
    ],
    responseFields: [
      { name: 'id', type: 'string', desc: 'Identified primary key' },
      { name: 'isSuccess', type: 'boolean', desc: 'True if successfully saved to database' }
    ],
    rulesApplied: ['BR-COA-06', 'BR-COA-10', 'BR-COA-12'],
    permissionRequired: 'ACCOUNTANT_UPDATE',
    auditRequired: true,
    errorResponses: [
      { status: 400, desc: 'Unlawful schema adjustments' },
      { status: 404, desc: 'Ledger account with ID not identified' }
    ]
  },
  {
    method: 'GET',
    endpoint: '/api/v1/coa/accounts',
    description: 'Retrieves raw active list of COA ledger accounts under specified company filters or nested status checks.',
    version: 'v4.1.0-stable',
    requestFields: [
      { name: 'company', type: 'string', required: false, desc: 'Filter criteria for legal entities' },
      { name: 'status', type: 'string', required: false, desc: 'Filter state: Active, Pending, Blocked' }
    ],
    responseFields: [
      { name: 'data', type: 'array', desc: 'Raw array representation of GL accounts JSON records' }
    ],
    rulesApplied: [],
    permissionRequired: 'USER_READ_SESSION',
    auditRequired: false,
    errorResponses: [
      { status: 500, desc: 'Database connection failed' }
    ]
  },
  {
    method: 'GET',
    endpoint: '/api/v1/coa/accounts/tree',
    description: 'Retrieves consolidated hierarchical JSON tree structure for visual COA folder renderings.',
    version: 'v4.1.0-stable',
    requestFields: [],
    responseFields: [
      { name: 'tree', type: 'object', desc: 'Root nodes hierarchy listing tree configurations nested' }
    ],
    rulesApplied: [],
    permissionRequired: 'USER_READ_SESSION',
    auditRequired: false,
    errorResponses: []
  },
  {
    method: 'POST',
    endpoint: '/api/v1/coa/accounts/{id}/submit',
    description: 'Publishes a draft account configuration, submitting it to the senior auditor approvals queue.',
    version: 'v4.1.0-stable',
    requestFields: [],
    responseFields: [
      { name: 'status', type: 'string', desc: 'Updated to Pending Approval' }
    ],
    rulesApplied: ['BR-COA-03', 'BR-COA-07', 'BR-COA-08'],
    permissionRequired: 'ACCOUNTANT_CREATE',
    auditRequired: true,
    errorResponses: [
      { status: 400, desc: 'Mandatory dimensions missing configuration' }
    ]
  },
  {
    method: 'POST',
    endpoint: '/api/v1/coa/accounts/{id}/approve',
    description: 'Promotes an account from pending to official Active status state, unlocking it for journal ledger transfers.',
    version: 'v4.1.0-stable',
    requestFields: [],
    responseFields: [
      { name: 'status', type: 'string', desc: 'Updated to Active status' },
      { name: 'approvedBy', type: 'string', desc: 'Auditor identity signature string' }
    ],
    rulesApplied: ['BR-COA-02', 'BR-COA-10'],
    permissionRequired: 'AUDITOR_COMMIT',
    auditRequired: true,
    errorResponses: [
      { status: 403, desc: 'Unauthorized user permissions' }
    ]
  },
  {
    method: 'POST',
    endpoint: '/api/v1/coa/validate-posting-account',
    description: 'Evaluates journal input codes before executing ledger post, validating leaf node eligibility.',
    version: 'v4.1.0-stable',
    requestFields: [
      { name: 'accountCode', type: 'string', required: true, desc: 'Lead GL ledger target code' }
    ],
    responseFields: [
      { name: 'valid', type: 'boolean', desc: 'True if account allows manual posting' }
    ],
    rulesApplied: ['BR-COA-05', 'BR-COA-13'],
    permissionRequired: 'JOURNALS_INTEGRATOR_CLIENT',
    auditRequired: false,
    errorResponses: []
  }
];

export const IMPORT_TEMPLATE_FIELDS: ImportField[] = [
  { fieldName: 'Company Code', required: true, type: 'String (Varchar 10)', validations: 'Must match registered entities list', sampleValue: 'FC-ETH', remark: 'Defines subsidiary boundary scale.' },
  { fieldName: 'Branch Code', required: true, type: 'String (Varchar 12)', validations: 'Matches unique 4 digit routing code', sampleValue: 'BR-ADD-01', remark: 'Enforces location coordinates tracking.' },
  { fieldName: 'Account Code', required: true, type: 'String (Varchar 20)', validations: 'Must be unique per company, matches Account Type range', sampleValue: '1120-001', remark: 'GL account index.' },
  { fieldName: 'Account Name', required: true, type: 'String (Varchar 150)', validations: 'Human legible letters', sampleValue: 'Operating Cash - Bole Teller A', remark: 'T-account description.' },
  { fieldName: 'Parent Account Code', required: false, type: 'String (Varchar 20)', validations: 'Must exist inside company scope first, or "None"', sampleValue: '1110', remark: 'Establishes rollup tree mathematical lines.' },
  { fieldName: 'Account Level', required: true, type: 'Integer', validations: 'Autocalculated as parent level + 1 (1 to 6 range)', sampleValue: '4', remark: 'Depth of nesting.' },
  { fieldName: 'Account Type', required: true, type: 'Enum String', validations: 'One of Asset, Liability, Equity, Revenue, Cost of Sales, Expense', sampleValue: 'Asset', remark: 'Directs balance side rules.' },
  { fieldName: 'Account Group', required: true, type: 'String', validations: 'Must align to standard groupings list', sampleValue: 'Current Assets', remark: 'Sub-statement groups.' },
  { fieldName: 'Account Category', required: true, type: 'String', validations: 'Must align to standard sub-groups list', sampleValue: 'Bank Balances', remark: 'Granular details classification.' },
  { fieldName: 'Normal Balance', required: true, type: 'Enum String', validations: 'Debit, Credit, Debit or Credit, None', sampleValue: 'Debit', remark: 'Normal T-account balance side.' },
  { fieldName: 'Posting Allowed', required: true, type: 'Boolean (Y/N)', validations: 'Mandatory true for transactions, false for folds', sampleValue: 'Y', remark: 'Defines if manual journals are logged.' },
  { fieldName: 'Control Account', required: true, type: 'Boolean (Y/N)', validations: 'True if associated with subsidiary ledgers', sampleValue: 'N', remark: 'Fails journal if no SL input exists.' },
  { fieldName: 'Subsidiary Ledger Type', required: false, type: 'Enum String', validations: 'None, Customer, Supplier, Bank, Employee, Fixed Asset, Tax Authority', sampleValue: 'None', remark: 'SL mapping validation.' },
  { fieldName: 'IFRS Classification', required: true, type: 'String', validations: 'Must match standard IFRS Taxonomy definitions', sampleValue: 'IFRS-9 - Financial Instruments', remark: 'Disclosure segments grouping' },
  { fieldName: 'Financial Statement Line', required: true, type: 'String', validations: 'Must match pre-configured FS disclosures list', sampleValue: 'Cash and Cash Equivalents', remark: 'Rolls up to Balance Sheet / Income Statement' },
  { fieldName: 'VAT Code', required: false, type: 'String', validations: 'VAT-15-IN, VAT-15-OUT, VAT-0, VAT-E, N/A', sampleValue: 'N/A', remark: 'For tax return automated aggregations.' },
  { fieldName: 'Withholding Tax Code', required: false, type: 'String', validations: 'WHT-SERVICE-2, N/A', sampleValue: 'WHT-SERVICE-2', remark: 'Triggers withheld tax collection schedule on payout.' },
  { fieldName: 'Currency', required: true, type: 'String (3 char)', validations: 'ETB, USD, AED, EUR, GBP', sampleValue: 'ETB', remark: 'IAS 21 functional currency indicator.' },
  { fieldName: 'Active Status', required: true, type: 'Enum String', validations: 'Draft, Pending Approval, Active, Inactive, Blocked', sampleValue: 'Active', remark: 'System operational flag.' },
  { fieldName: 'Remarks', required: false, type: 'String', validations: 'Free text notes', sampleValue: 'Initial upload for new fiscal year Bole subsidiary office.', remark: 'Log notes' }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-06-10T11:00:22Z',
    user: 'mzerihun01@gmail.com',
    action: 'CREATE_ACCOUNT',
    entityType: 'GL_ACCOUNT',
    entityKey: '1000',
    description: 'Created Assets root hierarchy folder successfully. Registered pre-configured IFRS taxonomy tags.',
    payloadAfter: '{"code":"1000","name":"Assets","parentAccount":"None","postingAllowed":false,"status":"Active"}'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-06-10T11:05:40Z',
    user: 'mzerihun01@gmail.com',
    action: 'CREATE_ACCOUNT',
    entityType: 'GL_ACCOUNT',
    entityKey: '1120',
    description: 'Created Accounts Receivable control account under Assets fold. Assigned Customer Subsidiary ledger check rule.',
    payloadAfter: '{"code":"1120","name":"Accounts Receivable Ledger","slType":"Customer","controlAccount":true}'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-06-10T12:00:00Z',
    user: 'compliance_officer@qmathings.com',
    action: 'APPROVE_ACCOUNT',
    entityType: 'GL_ACCOUNT',
    entityKey: '1120',
    description: 'Formally approved account code 1120. Changed status to ACTIVE. ledger is unlocked.',
    payloadBefore: '{"status":"Pending Approval"}',
    payloadAfter: '{"status":"Active"}'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-06-10T13:20:15Z',
    user: 'mzerihun01@gmail.com',
    action: 'SUBMIT_FOR_APPROVAL',
    entityType: 'GL_ACCOUNT',
    entityKey: '2200',
    description: 'Created Withholding Tax account 2200 under Liabilities folder and submitted for formal reviewer check.',
    payloadBefore: '{"status":"Draft"}',
    payloadAfter: '{"status":"Pending Approval"}'
  }
];

export const INITIAL_VOUCHERS: VoucherType[] = [
  {
    code: 'PV-VENDOR',
    name: 'Payment Voucher (Vendor Settlement)',
    category: 'Accounts Payable',
    autoNumbering: 'Enabled',
    approvalFlow: 'Level 2 (Director Approval)',
    postingControl: 'Balanced Only',
    status: 'Active',
    prefix: 'PV-VND',
    suffix: 'AP',
    resetYearly: true,
    prohibitGaps: true,
    requireApproval: true,
    approvalLevels: ['1. Supervisor', '2. Accountant', '3. Finance Director'],
    balanceValidation: true,
    backdatedEntry: false,
    tolerancePercent: 0,
    warningAction: 'Hard Block',
    vatGroup: 'Standard 15%',
    whtLogic: 'Vendor Default',
    qrCodeInvoice: true,
    signatureLabels: true,
    watermarkDraft: true,
    lastModifiedBy: 'MZerihun',
    lastModifiedTime: '2026-06-10 11:32:00'
  },
  {
    code: 'JV-CORP',
    name: 'Corporate Journal Voucher',
    category: 'General Ledger',
    autoNumbering: 'Enabled',
    approvalFlow: 'Level 1 (Supervisor)',
    postingControl: 'Balanced Only',
    status: 'Active',
    prefix: 'JV-CRP',
    suffix: 'GL',
    resetYearly: true,
    prohibitGaps: false,
    requireApproval: true,
    approvalLevels: ['1. Controller', '2. Internal Auditor'],
    balanceValidation: true,
    backdatedEntry: true,
    tolerancePercent: 2,
    warningAction: 'Soft Warning',
    vatGroup: 'Exempt',
    whtLogic: 'Manual Only',
    qrCodeInvoice: false,
    signatureLabels: true,
    watermarkDraft: true,
    lastModifiedBy: 'MZerihun',
    lastModifiedTime: '2026-06-10 12:15:10'
  },
  {
    code: 'RV-CUST',
    name: 'Receipt Voucher (Customer Payments)',
    category: 'Cash & Bank',
    autoNumbering: 'Enabled',
    approvalFlow: 'Level 1 (Cashier Auto)',
    postingControl: 'Balanced Only',
    status: 'Active',
    prefix: 'RV-CST',
    suffix: 'AR',
    resetYearly: true,
    prohibitGaps: true,
    requireApproval: false,
    approvalLevels: ['1. Cashier'],
    balanceValidation: true,
    backdatedEntry: false,
    tolerancePercent: 0,
    warningAction: 'Hard Block',
    vatGroup: 'Standard 15%',
    whtLogic: 'Vendor Default',
    qrCodeInvoice: true,
    signatureLabels: false,
    watermarkDraft: false,
    lastModifiedBy: 'MZerihun',
    lastModifiedTime: '2026-06-10 09:44:20'
  },
  {
    code: 'CV-PETTY',
    name: 'Petty Cash Disbursements',
    category: 'Cash Mgmt',
    autoNumbering: 'Manual Override',
    approvalFlow: 'Level 1 (Petty Admin)',
    postingControl: 'Balanced Only',
    status: 'Active',
    prefix: 'CV-PT',
    suffix: 'CSH',
    resetYearly: false,
    prohibitGaps: false,
    requireApproval: true,
    approvalLevels: ['1. Custodian', '2. Branch Mgr'],
    balanceValidation: true,
    backdatedEntry: true,
    tolerancePercent: 5,
    warningAction: 'Soft Warning',
    vatGroup: 'Exempt',
    whtLogic: 'Manual Only',
    qrCodeInvoice: false,
    signatureLabels: true,
    watermarkDraft: false,
    lastModifiedBy: 'compliance_officer@qmathings.com',
    lastModifiedTime: '2026-06-08 17:01:05'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    code: 'CUST-001',
    name: 'Addis Allied Trading PLC',
    email: 'info@addisallied.et',
    phone: '+251-11-663-8201',
    address: 'Bole Subcity, Woreda 03, Addis Ababa',
    paymentTerms: 'Net 30 Days',
    tin: '1092837465',
    vatRegNumber: 'VAT-ETH-92019',
    businessLicenseRef: 'BL-AA-481912-2025',
    whtCategory: 'Standard 2% Withholding',
    creditLimit: 1500000,
    creditRiskGrade: 'Low',
    creditHold: false,
    status: 'Active',
    segment: 'Commercial Wholesale',
    costCenter: 'CC-DIST-01',
    relatedCompany: 'None',
    auditTrailNotes: 'Standard vetted trade debtor customer.'
  },
  {
    id: 'CUST-002',
    code: 'CUST-002',
    name: 'Ethio-Telecom Corporate Sales',
    email: 'corp-billing@ethiotelecom.et',
    phone: '+251-11-551-0000',
    address: 'Churchill Road, Arada Subcity, Addis Ababa',
    paymentTerms: 'Cash on Delivery',
    tin: '0019283746',
    vatRegNumber: 'VAT-ETH-00010',
    businessLicenseRef: 'BL-GOV-001920',
    whtCategory: 'Exempt from Withholding',
    creditLimit: 5000000,
    creditRiskGrade: 'Low',
    creditHold: false,
    status: 'Active',
    segment: 'State Owned Enterprises',
    costCenter: 'CC-TELCO-05',
    relatedCompany: 'None',
    auditTrailNotes: 'Enterprise Tier-1 utility client with zero credit hold.'
  },
  {
    id: 'CUST-003',
    code: 'CUST-003',
    name: 'Meda Agro-Exporters PLC',
    email: 'export@medaagro.com',
    phone: '+251-22-111-9281',
    address: 'Kebele 04, Adama, Oromia',
    paymentTerms: 'Net 15 Days',
    tin: '1029384756',
    vatRegNumber: 'VAT-ETH-55612',
    businessLicenseRef: 'BL-AD-192011',
    whtCategory: 'Standard 2% Withholding',
    creditLimit: 750000,
    creditRiskGrade: 'Medium',
    creditHold: false,
    status: 'Active',
    segment: 'Agricultural Wholesale',
    costCenter: 'CC-EXP-ADAMA',
    relatedCompany: 'None',
    auditTrailNotes: 'Export partner. Credit threshold monitored weekly.'
  }
];

export const INITIAL_VENDORS = [
  {
    id: 'VEND-001',
    code: 'VEND-001',
    companyName: 'Bole Paper Manufacturing PLC',
    email: 'procurement@bolepaper.et',
    phone: '+251-11-662-1102',
    address: 'Bole Industrial Zone, Addis Ababa',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    bankAccountNumber: '1000192837465',
    ibanSwift: 'CBETETAAXXX',
    tin: '1028374659',
    vatCertificateLink: 'CERT-VAT-BOLP-2025',
    whtCategory: 'Standard Deductible 2%',
    preferredTierStatus: 'Tier-1 Preferred',
    minOrderQuantity: 500,
    deliveryLeadTimeDays: 7,
    openPOCount: 3,
    status: 'Approved',
    relatedGLAccount: '2110 (Trade Payables)',
    auditTrailNotes: 'Primary packaging materials vendor.'
  },
  {
    id: 'VEND-002',
    code: 'VEND-002',
    companyName: 'Awash Petroleum & Logistics',
    email: 'logistics@awashpetro.com',
    phone: '+251-11-440-9218',
    address: 'Nefas Silk Subcity, Addis Ababa',
    bankName: 'Awash International Bank',
    bankAccountNumber: '01320192837400',
    ibanSwift: 'AWABETAAXXX',
    tin: '0029384755',
    vatCertificateLink: 'CERT-VAT-AWSH-991',
    whtCategory: 'Standard Deductible 2%',
    preferredTierStatus: 'Tier-1 Preferred',
    minOrderQuantity: 1000,
    deliveryLeadTimeDays: 2,
    openPOCount: 1,
    status: 'Approved',
    relatedGLAccount: '2110 (Trade Payables)',
    auditTrailNotes: 'Critical fuel and freight shipping subledger.'
  },
  {
    id: 'VEND-003',
    code: 'VEND-003',
    companyName: 'Al-Sam Electronics Wholesalers',
    email: 'sales@alsamelectronics.com',
    phone: '+251-11-155-8822',
    address: 'Merkato Area, Addis Ketema, Addis Ababa',
    bankName: 'Dashen Bank',
    bankAccountNumber: '5019283049182',
    ibanSwift: 'DASHETAAXXX',
    tin: '9820194821',
    vatCertificateLink: 'CERT-VAT-ALS-4812',
    whtCategory: 'Standard Deductible 3%',
    preferredTierStatus: 'Tier-2 Verified',
    minOrderQuantity: 10,
    deliveryLeadTimeDays: 4,
    openPOCount: 0,
    status: 'Registered',
    relatedGLAccount: '1610 (Office Equipment)',
    auditTrailNotes: 'Office electronics partner. Active Approved Supplier list.'
  }
];


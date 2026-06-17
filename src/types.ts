export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Cost of Sales' | 'Expense' | 'Statistical' | 'Memorandum / Off-Balance Sheet' | 'Cost';

export type BalanceType = 'Debit' | 'Credit' | 'Debit or Credit' | 'None';

export type AccountStatus = 'Draft' | 'Pending Approval' | 'Active' | 'Inactive' | 'Blocked' | 'Archived' | 'Suspended' | 'Closed';

export type ApprovalStatus = 'Not Submitted' | 'Submitted' | 'Approved' | 'Rejected' | 'Returned' | 'Pending';

export type SLType = 'None' | 'Customer' | 'Supplier' | 'Bank' | 'Cash' | 'Inventory' | 'Fixed Asset' | 'Tax Authority' | 'Employee';

export type DimensionControl = 'Mandatory' | 'Optional' | 'Not Required';

export interface Account {
  id: string; // matches code
  code: string;
  name: string;
  parentAccount: string; // Code of parent, e.g. "1010" or "None"
  level: number; // calculated depth or explicit
  company: string;
  branch: string;
  accountType: AccountType;
  group: string;
  subgroup: string;
  ifrsClass: string;
  financialStatementLine: string;
  
  // Posting Controls
  postingAllowed: boolean;
  controlAccount: boolean;
  manualJournalAllowed: boolean;
  systemPostingOnly: boolean;

  // Subsidiary Ledger
  slType: SLType;
  slMappingCode?: string;

  // Tax & Compliance
  vatCode: string;
  whtCode: string;
  ethiopianTaxCategory: string;

  // Reporting Dimensions
  costCenter: DimensionControl;
  department: DimensionControl;
  project: DimensionControl;
  segment: DimensionControl;
  profitCenter: DimensionControl;

  status: AccountStatus;
  approvalStatus: ApprovalStatus;
  balance: BalanceType;
  openingBalanceDebit?: number;
  openingBalanceCredit?: number;
  createdBy?: string;
  approvedBy?: string;
  auditTrailNotes?: string;
}

export interface EnumValue {
  enumGroup: string;
  displayName: string;
  backendKey: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  usedInField: string;
}

export interface LookupGroup {
  groupKey: string;
  displayName: string;
  description: string;
  neededFor: string;
}

export interface LookupValue {
  id: string;
  groupKey: string;
  code: string;
  displayName: string;
  description: string;
  isActive: boolean;
  metaData?: Record<string, string>;
}

export interface SLMapping {
  slType: SLType;
  controlAccountCode: string;
  controlAccountName: string;
  mappingRule: string;
  reconciliationRequired: boolean;
}

export interface PostingControlRule {
  accountType: AccountType;
  postingAllowed: 'Yes' | 'No' | 'System Only' | 'Subledger Only';
  headerAllowed: boolean;
  controlAccountAllowed: boolean;
  manualPostAllowed: boolean;
  sysPostAllowed: boolean;
}

export interface DetailedRule {
  id: string; // BR-01
  name: string;
  appliesTo: string;
  triggerEvent: string;
  condition: string;
  expectedBehavior: string;
  errorMessage: string;
  severity: 'Critical' | 'Warning' | 'Info';
  validationLocation: string;
  relatedApi: string;
  relatedTable: string;
  testScenario: string;
}

export interface DetailedApiSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  version: string;
  requestFields: Array<{ name: string; type: string; required: boolean; desc: string }>;
  responseFields: Array<{ name: string; type: string; desc: string }>;
  rulesApplied: string[];
  permissionRequired: string;
  auditRequired: boolean;
  errorResponses: Array<{ status: number; desc: string }>;
}

export interface ImportField {
  fieldName: string;
  required: boolean;
  type: string;
  validations: string;
  sampleValue: string;
  remark: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityKey: string;
  description: string;
  payloadBefore?: string;
  payloadAfter?: string;
}

export type VoucherStatus = 'Active' | 'Inactive';

export interface VoucherType {
  code: string;
  name: string;
  category: string;
  autoNumbering: 'Enabled' | 'Manual Override';
  approvalFlow: string;
  postingControl: string;
  status: VoucherStatus;
  prefix: string;
  suffix: string;
  resetYearly: boolean;
  prohibitGaps: boolean;
  requireApproval: boolean;
  approvalLevels: string[];
  balanceValidation: boolean;
  backdatedEntry: boolean;
  tolerancePercent: number;
  warningAction: 'Hard Block' | 'Soft Warning';
  vatGroup: string;
  whtLogic: string;
  qrCodeInvoice: boolean;
  signatureLabels: boolean;
  watermarkDraft: boolean;
  lastModifiedBy?: string;
  lastModifiedTime?: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  tin: string;
  vatRegNumber: string;
  businessLicenseRef: string;
  whtCategory: string;
  creditLimit: number;
  creditRiskGrade: 'Low' | 'Medium' | 'High' | 'Critical';
  creditHold: boolean;
  status: 'Draft' | 'Active' | 'Blocked';
  segment: string;
  costCenter: string;
  relatedCompany: string;
  auditTrailNotes?: string;
}

export interface Vendor {
  id: string;
  code: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccountNumber: string;
  ibanSwift: string;
  tin: string;
  vatCertificateLink: string;
  whtCategory: 'Standard Deductible 2%' | 'Exempt' | 'Standard Deductible 3%';
  preferredTierStatus: 'Tier-1 Preferred' | 'Tier-2 Verified' | 'Tier-3 Probationary';
  minOrderQuantity: number;
  deliveryLeadTimeDays: number;
  openPOCount: number;
  status: 'Registered' | 'Approved' | 'Suspended' | 'Blacklisted';
  relatedGLAccount: string;
  auditTrailNotes?: string;
}

export interface TransactionLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  costCenter?: string;
  department?: string;
  project?: string;
}

export interface PostedTransaction {
  id: string;
  source: 'JOURNAL' | 'VOUCHER' | 'CASH_BANK';
  voucherNo: string;
  voucherType: string;
  description: string;
  date: string;
  postedBy: string;
  lines: TransactionLine[];
}

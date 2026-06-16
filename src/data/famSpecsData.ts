// Enterprise-Grade FAM ERP Specifications Data (SAP/D365/NetSuite/Odoo reference)
// This file serves as the database for our interactive specifications browser.

export interface FAMCapability {
  id: string; // A to I
  title: string;
  icon: string;
  description: string;
  verticals: string[];
  submenus: string[];
  functions: string[];
  sections: {
    businessCapabilityArea: string;
    functionalStructure: string[];
    userStories: string[];
    businessRequirements: string[];
    businessRules: { rule: string; validation: string }[];
    workflow: { step: string; actor: string; description: string }[];
    pages: { name: string; type: string; purpose: string }[];
    fields: { field: string; type: string; required: boolean; group: string }[];
    lookups: string[];
    enums: { name: string; values: string[] }[];
    roles: { role: string; access: string }[];
    notifications: { trigger: string; type: string; target: string; msg: string }[];
    integrations: { module: string; flowDirection: string; dataPoints: string }[];
    accountingEntries: { event: string; debit: string; credit: string; notes: string }[];
    auditTrail: string[];
    reports: string[];
    apis: { endpoint: string; verb: 'GET' | 'POST' | 'PUT' | 'DELETE'; desc: string }[];
    sodRules: string[];
    batchJobs: { name: string; cron: string; desc: string }[];
    exceptions: { error: string; handler: string }[];
  };
}

export const FAM_CAPABILITIES: FAMCapability[] = [
  {
    id: 'A',
    title: 'Asset Registration, Capitalization and Master Maintenance',
    icon: 'Briefcase',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Deals with the entire intake process: manual asset registration, sourcing from projects (CIP capitalizations) or AP bills, component classification, and physical updates (custody transfers & lifecycle locks).',
    submenus: [
      'Fixed Assets Inventory Registry',
      'Asset Acquisition Hub',
      'Construction-in-Progress Capitalization Engine',
      'Asset Master Maintenance Center',
      'Components & Group Assets Splitter'
    ],
    functions: [
      'Register Fixed Asset',
      'Create Asset from Purchase Transaction',
      'Create Asset from Inventory Item',
      'Create Asset from Project Completion',
      'Capitalize Asset from AP Invoice',
      'Capitalize Asset Under Construction (CIP)',
      'Capitalize Multiple Assets from Single Purchase',
      'Create Asset Components',
      'Create Group Assets',
      'Maintain Fixed Asset Master Center',
      'Maintain Asset Attributes & Locations',
      'Maintain Custodial Records & Ownership logs',
      'Maintain Asset Insurance & Warranty Info',
      'Maintain Asset Tags / Barcode System',
      'Split Asset Bundle',
      'Merge Assets Block',
      'Transfer Assets (Location/Department/Cost Center/Legal Entity)',
      'Change Parameters (Useful Life, Cost, Method)',
      'Temporarily Lock / Suspend Asset',
      'Reactivate Asset Card',
      'Mass Fleet Asset Update'
    ],
    sections: {
      businessCapabilityArea: 'Fixed Assets Operations (Subledger Control) & Capital Projects Accounting (CAPEX).',
      functionalStructure: [
        'Asset Master Ledger Space (FAM-AML)',
        'Capital Intake Pipeline (FAM-CIP)',
        'Maintenance, Custody & Tagging Hub (FAM-MCT)',
        'Relocation and Re-assignment Terminal (FAM-RRT)'
      ],
      userStories: [
        'As an Asset Accountant, I want to create a CIP Asset Master so that I can capture design, construction, and licensing expenditures continuously during complex machinery builds.',
        'As a Procurement Manager, I want physical asset cards to automatically generate when receiving AP-approved inventory bills, preventing human clerical entry mistakes.',
        'As an Regional Branch Manager, I want to execute a physical department relocation approval workflow so that the asset tags and underlying costing center updates sync before moving servers.'
      ],
      businessRequirements: [
        'Must support compound capital acquisition flows merging mechanical gear and accessories into a singular, componentized capitalization block.',
        'Enforce automated asset tag assignment formatted as FA-[YYYY]-[Category_Code]-[Sequence_No].',
        'Physical relocation across cost centers or legal entities must trigger tax-neutral transfer journals automatically based on inter-unit clearing accounts.',
        'Any revision to useful life or method must generate retrospective or prospective schedules based on IFRS policy overrides.'
      ],
      businessRules: [
        { rule: 'Capitalization threshold rule', validation: 'Acquisition cost must exceed 10,000 ETB for corporate eligibility; else direct-charge to expense.' },
        { rule: 'Uniqueness of ID code', validation: 'Asset barcode / serial must be globally distinct across all operational entities.' },
        { rule: 'Valid Depreciable cost base', validation: 'Estimated salvage residual value cannot exceed 100% of purchase price.' }
      ],
      workflow: [
        { step: 'Init Acquisition Draft', actor: 'Asset Admin', description: 'Enters purchase data or fetches from pending AP invoice bill.' },
        { step: 'Component Engineering Check', actor: 'Technical Engineer', description: 'Validates structure and divides carrying costs into life elements.' },
        { step: 'Audit Compliance Affirmation', actor: 'Finance Manager', description: 'Reconciles the CAPEX ledger budget and approves active capitalization. Journal is posted.' }
      ],
      pages: [
        { name: 'FAM-ACT-01 (Asset Creator Workbench)', type: 'Data Intake & Edit Sheet', purpose: 'Capitalize new physical items from invoices, POs, or existing equipment inventories.' },
        { name: 'FAM-MST-02 (Fixed Asset Master Card)', type: 'Master File Visualizer', purpose: 'Contains 360-degree view of useful parameters, warranty detail, ownership, and locations.' },
        { name: 'FAM-TRN-03 (Inter-unit Reassignment Pane)', type: 'Operational Workspace', purpose: 'Executes physical and financial relocations across cost units.' }
      ],
      fields: [
        { field: 'Acquisition Cost', type: 'Numeric Decimal', required: true, group: 'Aquisition Data' },
        { field: 'Asset Class Code', type: 'Lookup Identifier', required: true, group: 'Structural Ledger' },
        { field: 'Custodian Employee ID', type: 'Lookup Identifier', required: false, group: 'Asset Custodial' },
        { field: 'Barcode RFID Tag', type: 'Alphanumeric String', required: true, group: 'Physical Tracking' }
      ],
      lookups: ['Asset Group Mapping Code', 'Regional Branch Office', 'General Ledger Cost Center', 'Sponsoring Supplier Info'],
      enums: [
        { name: 'Asset Ownership Class', values: ['Wholly Owned', 'Leased Finance', 'Third Party Leased', 'Consigned'] },
        { name: 'Asset Technical Condition', values: ['Unassigned', 'Excellent/New', 'Fully Operational', 'Undergoing Maintenance', 'Damaged', 'Obsolete'] }
      ],
      roles: [
        { role: 'Fixed Asset Administrator', access: 'Saves asset metadata, schedules physical tags, logs transfers.' },
        { role: 'Finance Director', access: 'Reviews capitalization logs, executes life modifications, authorizes structural divisions.' }
      ],
      notifications: [
        { trigger: 'Exceeding CAPEX Project Budget', type: 'Alert banner + Email', target: 'Finance Director', msg: 'Project PRJ-CO-26 capitalization request exceeds allocated CAPEX budget by 12%!' },
        { trigger: 'Technical Audit Date Threshold', type: 'System notification', target: 'Fixed Asset Administrator', msg: 'System check: 45 technical asset classes are missing updated serial tags.' }
      ],
      integrations: [
        { module: 'Accounts Payable', flowDirection: 'Bidirectional', dataPoints: 'AP clearing account balances, asset capitalization matching status, supplier invoice documents.' },
        { module: 'Project Management & WBS', flowDirection: 'Inbound', dataPoints: 'Construction ledger actual cost aggregations, capital project delivery certificates.' }
      ],
      accountingEntries: [
        { event: 'Immediate Purchase Capitalization', debit: '1210 - Property, Plant, & Heavy Machinery', credit: '2110 - Accounts Payable Invoice Clearing', notes: 'Asset capitalized directly from vendor purchase transaction.' },
        { event: 'Capitalization of CIP project', debit: '1210 - Property, Plant, & Heavy Machinery', credit: '1290 - Construction in Progress (CIP) clearing ledger', notes: 'Settle cumulative CAPEX costs once active service certificate is submitted.' }
      ],
      auditTrail: [
        'Records user identity for registration, validation, cost modification or relocation.',
        'Tracks raw database mutations on initial invoice attachments.',
        'Stores timestamp logs on change in parameters (life, residual, center).'
      ],
      reports: [
        'Monthly FA Acquisition Journal Ledger',
        'Construction in Progress Roll-forward schedule',
        'Physical Custody and Assignment List'
      ],
      apis: [
        { endpoint: '/api/v1/assets/capitalize', verb: 'POST', desc: 'Registers and capitalizes an asset from external AP records.' },
        { endpoint: '/api/v1/assets/transfer', verb: 'PUT', desc: 'Schedules and posts inter-company asset relocation.' }
      ],
      sodRules: [
        'Users initiating the purchase invoice cannot approve the subsequent asset subclass categorization.',
        'Asset custodians cannot modify depreciation books parameters or run calculations.'
      ],
      batchJobs: [
        { name: 'CIP Daily Rollup Scanner', cron: '0 2 * * *', desc: 'Runs calculations aggregating daily construction raw project expenses into CIP parent heads.' }
      ],
      exceptions: [
        { error: 'Asset acquisition cost is below threshold limit', handler: 'Re-route cost ledger classification to secondary OpEx expense categories instantly with alert confirmation.' }
      ]
    }
  },
  {
    id: 'B',
    title: 'Asset Classification and Configuration',
    icon: 'Grid',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Maintains system-level configuration, classes, groups, automatic numbering structures, capitalization thresholds, and detailed ledger account posting profiles.',
    submenus: [
      'ERP Configuration Workbench',
      'Asset Class & Group Profiles',
      'System Numbering Config',
      'Ledger Posting Controls & Account Determination'
    ],
    functions: [
      'Maintain Asset Categories',
      'Maintain Asset Classes',
      'Maintain Asset Groups',
      'Maintain Asset Types',
      'Configure Numbering Rules',
      'Configure Multiple Assets Books',
      'Maintain Impairment Areas',
      'Configure Capitalization Thresholds',
      'Configure Account Determination Profiles',
      'Configure Retirement Criteria'
    ],
    sections: {
      businessCapabilityArea: 'Shared ERP Controls & Subledger Integrity config.',
      functionalStructure: [
        'Asset Classifier Config (FAM-ACC)',
        'Posting Profiles Desk (FAM-PPD)',
        'Threshold Administration & Criteria (FAM-TAC)'
      ],
      userStories: [
        'As an ERP Architect, I want to define account determination profiles for the IT equipment group so that acquisition costs auto-allocate to GL 1205 and write-back depreciation maps to GL 1206.',
        'As a Compliance Controller, I want to define custom capitalization thresholds per legal entity branch to ensure conformity with local enterprise laws.'
      ],
      businessRequirements: [
        'Classifications must enforce parental hierarchies: Asset Class contains multiple Groups, Groups hold individual Categories.',
        'Enforce default useful lives and depreciation methods at the Asset Class level with options for field-level locks.',
        'Direct linkage of Asset Classes to Account Posting Profiles, establishing exact GL account pairs for depreciation, accumulation, revaluations, write-downs, and disposal offsets.'
      ],
      businessRules: [
        { rule: 'Parental Integrity', validation: 'Cannot delete an Asset Category if active customized assets remain linked to it.' },
        { rule: 'Account mapping validity', validation: 'Posting Profiles must contain valid GL account numbers with active ledger status verification.' }
      ],
      workflow: [
        { step: 'Define Classification Profiles', actor: 'Finance Admin', description: 'Configure Asset Group mapping models.' },
        { step: 'Board Policy Review', actor: 'Internal Auditor', description: 'Reviews statutory useful lives classes matching IAS 16 tax tables.' },
        { step: 'Publish Configurations', actor: 'System Administrator', description: 'Activates classifications system-wide, locking parameters.' }
      ],
      pages: [
        { name: 'FAM-CFG-10 (Asset Categories Directory)', type: 'Hierarchy Explorer', purpose: 'Maintains classes, groups, and statutory rules.' },
        { name: 'FAM-PST-20 (Account Posting Profile Matrix)', type: 'Account Control Grid', purpose: 'Maps asset transactions directly to General Ledger accounts.' }
      ],
      fields: [
        { field: 'Asset Class Name', type: 'String text', required: true, group: 'Subclass Header' },
        { field: 'Acquisition GL Clearing Account', type: 'GL Account Lookup', required: true, group: 'GL Posting Profile' },
        { field: 'Statutory Useful Life (Years)', type: 'Integer', required: true, group: 'Depr Defaults' }
      ],
      lookups: ['General Ledger CoA Accounts', 'Government Class Codes', 'Statutory Depreciation Life Matrices'],
      enums: [
        { name: 'Calculation Frequency', values: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually'] }
      ],
      roles: [
        { role: 'System Administrator', access: 'Authorized to change baseline configuration parameters and delete unused groups.' }
      ],
      notifications: [
        { trigger: 'Orphaned Class Profile Creation', type: 'In-app notification', target: 'System Administrator', msg: 'Warning: Class code CLASS-HVD lacks complete General Ledger routing maps!' }
      ],
      integrations: [
        { module: 'General Ledger Shared CoA', flowDirection: 'Inbound', dataPoints: 'General Ledger account states, CoA classification rules.' }
      ],
      accountingEntries: [
        { event: 'Configuration Save Event', debit: 'None', credit: 'None', notes: 'No financial transaction recorded. System configuration states saved.' }
      ],
      auditTrail: [
        'Enforces write logs mapping user identity to modified classification guidelines.',
        'Maintains previous GL account values prior to edit override.'
      ],
      reports: [
        'Class Accounts Mapping Register',
        'System Parameter Audit Matrix'
      ],
      apis: [
        { endpoint: '/api/v1/config/profiles', verb: 'GET', desc: 'Returns active accounting configurations for structural assets.' }
      ],
      sodRules: [
        'Accounts team members cannot edit the baseline system configuration or update account mappings.'
      ],
      batchJobs: [
        { name: 'Mapping Validation Synchronizer', cron: '0 4 * * *', desc: 'Daily verification confirming all active groups are mapped to active, non-locked GL accounts.' }
      ],
      exceptions: [
        { error: 'GL Account not found in active COA', handler: 'Halt configuration update, notify system administrator, log ledger error.' }
      ]
    }
  },
  {
    id: 'C',
    title: 'Depreciation, Valuation and Accounting Control',
    icon: 'TrendingUp',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Encompasses all financial calculations: periodic depreciation processing, parallel depreciation ledgers (IFRS vs local Tax vs Management books), revaluations, and impairment testing matching IAS 36.',
    submenus: [
      'Depreciation Run Control Center',
      'Parallel Books Management Dashboard',
      'Asset Revaluation Workbench',
      'IAS 36 Impairment and Write-down console'
    ],
    functions: [
      'Calculate Asset Depreciation (Batch)',
      'Schedule Automatic Depreciation Runs',
      'Recalculate Depreciation Schedules',
      'Reverse Posted Depreciation Months',
      'Suspend/Resume Depreciation Flags',
      'Process Catch-Up Depreciation',
      'Process Partial Period Depreciation',
      'Execute Revaluation Increments / Decrements',
      'Reverse Asset Revaluation Surplus',
      'Record Impairment Write-down Loss (IAS 36)',
      'Reconcile Subledger to GL Trial Balances'
    ],
    sections: {
      businessCapabilityArea: 'Fixed Assets Accounting & Statutory Financial Compliance.',
      functionalStructure: [
        'Depreciation Engine Workspace (FAM-DEW)',
        'Parallel Book Ledger (FAM-PBL)',
        'Adjustments, Impairment & Valuation Suite (FAM-AIV)'
      ],
      userStories: [
        'As an Asset Accountant, I want to trigger a batch monthly depreciation calculation so that all in-service assets update carrying values and release accrual postings to GL.',
        'As a Financial Director, I want to toggle between the Corporate IFRS Book and ERCA Tax Book to prepare distinct tax returns alongside investor report segments.',
        'As an Internal Auditor, I want to execute an impairment test under IAS 36 by entering a revised value-in-use to post necessary markdown journals instantly.'
      ],
      businessRequirements: [
        'Support straight-line, declining-balance, and manual double-entry allocations as native formulas.',
        'Maintain parallel asset books tracking different carrying values, useful lives, and residual salvage balances independently for the same physical asset tag.',
        'Statutory Tax Book must ignore IFRS revaluation increments, calculating pool depreciation solely on original adjusted balance, adhering to local ERCA rules.',
        'Provide single-button rollbacks for the last posted calculation month, restoring the asset sub-ledger database state safely.'
      ],
      businessRules: [
        { rule: 'Maximum Scrap Value Rule', validation: 'Depreciation stops when net book value reaches residual salvage estimates.' },
        { rule: 'Impairment carrying cost limit', validation: 'Impairment loss cannot reduce the net asset value below 0 ETB.' },
        { rule: 'Revaluation Surplus Routing', validation: 'IAS 16 gains must credit Revaluation Surplus in Other Comprehensive Income (OCI) unless reversing a prior period expense.' }
      ],
      workflow: [
        { step: 'Schedule / Launch Run', actor: 'Asset Accountant', description: 'Checks calculations, reviews pre-calculation schedules, triggers batch.' },
        { step: 'Audit Discrepancies Check', actor: 'Internal Auditor', description: 'Analyzes anomalies, verify GL balance synchronizations, posts feedback.' },
        { step: 'Approve & Release Voucher', actor: 'Finance Manager', description: 'Authorizes final posting and moves subledger updates directly into GL journals.' }
      ],
      pages: [
        { name: 'FAM-DEP-05 (Depreciation Run Interface)', type: 'Batch Action Engine', purpose: 'Executes monthly calculations for all target books with reporting summaries.' },
        { name: 'FAM-REV-08 (Asset Revaluation Panel)', type: 'Financial Transaction entry', purpose: 'Processes formal revaluations, applying value enhancements or write-downs.' },
        { name: 'FAM-REC-12 (Subledger to GL Reconciliation Ledger)', type: 'Reconciliation Grid', purpose: 'Identifies discrepancies between subledger balances and General Ledger statement balances.' }
      ],
      fields: [
        { field: 'Posting Period / Month', type: 'Date Header (YYYY-MM)', required: true, group: 'Execution Parameters' },
        { field: 'Target Depreciation Book', type: 'Select Option Combo', required: true, group: 'Execution Parameters' },
        { field: 'Valuer Certificate ID', type: 'Alphanumeric String', required: false, group: 'Revaluation Metadata' },
        { field: 'Recoverable Value (IAS 36)', type: 'Numeric Decimal', required: true, group: 'Impairment Test' }
      ],
      lookups: ['Accounting Period Dates', 'Qualified Surveyor IDs', 'Tax Book Pool Percentages'],
      enums: [
        { name: 'Depreciation Book Category', values: ['IFRS Book', 'Statutory Tax Book', 'Management Book'] },
        { name: 'Impairment Test Decision', values: ['Undepreciated', 'Impaired Pending Adjustment', 'Impaired Logged', 'Impairment Reversed'] }
      ],
      roles: [
        { role: 'Fixed Asset Accountant', access: 'Runs weekly checks, initiates revaluations, runs periodic depreciation calculations.' }
      ],
      notifications: [
        { trigger: 'Depreciation calculations mismatch', type: 'High priority system error', target: 'Fixed Asset Accountant', msg: 'System integrity error: Subledger calculations on Asset FA-290 deviate from projected schedule by >0.05%!' }
      ],
      integrations: [
        { module: 'General Ledger Core Modules', flowDirection: 'Outbound', dataPoints: 'Depreciation journals, revaluation adjustments, impairment loss vouchers.' }
      ],
      accountingEntries: [
        { event: 'Standard Depreciation Run', debit: '5205 - Depreciation Expense (Operating)', credit: '1215 - Accumulated Depreciation (Asset Reserve)', notes: 'Periodic write-down of asset carrying value.' },
        { event: 'IAS 16 Revaluation gain (Asset Enhancement)', debit: '1210 - Property Cost Ledger', credit: '3410 - Revaluation Surplus (Equity, OCI Segment)', notes: 'Recording asset appreciation matching external valuer appraisal.' },
        { event: 'IAS 36 Impairment write-down loss', debit: '5310 - Loss on Impairment (Profit & Loss)', credit: '1218 - Accumulated Impairment Loss (Asset Reserve)', notes: 'Markdown of asset to matching recoverable value bounds.' }
      ],
      auditTrail: [
        'Maintains detailed logs on revaluation date, previous carrying amount, new appraised valuation, and valuer license references.',
        'Tracks the execution history, batch IDs, and execution times for all depreciation procedures.'
      ],
      reports: [
        'Periodic Depreciation Run Ledger Schedule',
        'Parallel Books Comparative balance sheet',
        'Comprehensive Impairment Audits Journal'
      ],
      apis: [
        { endpoint: '/api/v1/depreciation/run', verb: 'POST', desc: 'Starts batch depreciation calculations of assets for a selected ledger period.' },
        { endpoint: '/api/v1/assets/revalue', verb: 'POST', desc: 'Submits IAS 16 asset revaluation appraisal data.' }
      ],
      sodRules: [
        'Asset Accountants cannot delete historical valuation logs or alter raw calculations formulas.'
      ],
      batchJobs: [
        { name: 'Monthly Depr Calculator Scheduled', cron: '0 0 28 * *', desc: 'Triggers pre-calculation schedules on the 28th of every month, notifying accountants of potential errors.' }
      ],
      exceptions: [
        { error: 'Asset already fully depreciated', handler: 'Safe bypass: Set depreciation contribution to exactly 0, preserve asset status, log warning message.' }
      ]
    }
  },
  {
    id: 'D',
    title: 'Asset Maintenance and Lifecycle Management',
    icon: 'Activity',
    verticals: ['Government', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Tracks technical physical activities: scheduling corrective or preventive maintenance events, logging downtime minutes, coordinating technician hours, keeping repair history logs, and tracking calibration records.',
    submenus: [
      'Engineering Operations Center',
      'Preventive Maintenance Scheduling',
      'Work Order Dispatch Terminal',
      'Calibration & Inspection Logs'
    ],
    functions: [
      'Register Preventive Maintenance Schedule',
      'Register Corrective Maintenance Work Order',
      'Record Asset Repairs Log & Cost Surcharges',
      'Manage Asset Downtime tracking metrics',
      'Register Technical Diagnostics Inspection',
      'Log Precision Calibration Activities',
      'Assess Physical Asset Condition levels',
      'Maintain Asset Performance Indicators'
    ],
    sections: {
      businessCapabilityArea: 'Operations Management, Technical Assets Engineering, & Fleet Support.',
      functionalStructure: [
        'Work Management Suite (FAM-WMS)',
        'Technical Maintenance Registry (FAM-TMR)',
        'Condition & Reliability Desk (FAM-CRD)'
      ],
      userStories: [
        'As a Plant Supervisor, I want to schedule a recurring semiannual preventive inspection check for the German Precision Milling machine so that we prevent high-cost breakdowns.',
        'As a Maintenance Technician, I want to capture spare parts cost and hours logged against a custom repair work order to track the active maintenance surcharge ledger.'
      ],
      businessRequirements: [
        'Support recurring preventive maintenance routines based on calendars (days/months) or asset performance meters (hours/mileages).',
        'Log downtime metrics calculating Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR) automatically.',
        'Allow capitalization of significant rebuild upgrades directly into matching asset card bases under IAS 16 structural enhancement rules.'
      ],
      businessRules: [
        { rule: 'Mandatory Calibration limit', validation: 'Technical laboratory instruments cannot perform tasks if calibration date expires.' },
        { rule: 'Upgrade Cost routing limit', validation: 'Upgrades must exceed 20% of original acquisition cost to justify capitalization overrides; else book as routine maintenance expense.' }
      ],
      workflow: [
        { step: 'Issue Work Request', actor: 'Asset Administrator', description: 'Flags physical asset defect, launching service order.' },
        { step: 'Dispatched Technical Service', actor: 'Maintenance Officer', description: 'Assesses damage, logs material costs, registers diagnostic checklist.' },
        { step: 'Close & Cost Post', actor: 'Finance Director', description: 'Verifies work done and posts expenses to corresponding cost centers.' }
      ],
      pages: [
        { name: 'FAM-MNT-50 (Maintenance Order Desk)', type: 'Service Dispatch Console', purpose: 'Registers preventive scheduling calendars and corrective diagnostic logs.' },
        { name: 'FAM-CAL-60 (Technical Calibration Log)', type: 'Technical Registry Sheet', purpose: 'Maintains calibration limits, certificates, tolerances, and technician signatures.' }
      ],
      fields: [
        { field: 'Maintenance Schedule Type', type: 'Static Dropdown Options', required: true, group: 'Maintenance Standard' },
        { field: 'Planned Inspection Date', type: '📅 Calendar Date Picker', required: true, group: 'Scheduling Data' },
        { field: 'Contracted Service Partner', type: 'Supplier lookup ID', required: false, group: 'Supplier Links' },
        { field: 'Total Downtime (Minutes)', type: 'Integer Duration', required: true, group: 'Reliability metrics' }
      ],
      lookups: ['Operational Service Partners', 'Parts Inventory Master SKU', 'Mechanical Engineer Teams'],
      enums: [
        { name: 'Maintenance Class Rank', values: ['Routine Low-Cost', 'Critical Repair Needed', 'Major Refurbishment', 'IAS 16 Capital Enhancement'] },
        { name: 'Inspection Condition Rank', values: ['Excellent/Optimal', 'Fair Performance', 'Degraded Quality', 'Repair Enforced', 'Safety hazard'] }
      ],
      roles: [
        { role: 'Maintenance Officer', access: 'Saves repair orders, updates diagnostic inspections logs, signs calibration records.' }
      ],
      notifications: [
        { trigger: 'Preventive service interval deadline', type: 'Standard Email notify', target: 'Maintenance Officer', msg: 'Schedule Alert: Server rack datacenter cooling array is due for preventive maintenance in 3 days.' }
      ],
      integrations: [
        { module: 'Inventory Management SKU Systems', flowDirection: 'Outbound', dataPoints: 'Parts consumption ledger, pricing inventory stocks updates.' }
      ],
      accountingEntries: [
        { event: 'Routine maintenance expense posting', debit: '5420 - Fleet & Equipment Maintenance Expense', credit: '1110 - Inventory Parts Clearing (or AP Liability)', notes: 'Direct expense for maintenance costs.' },
        { event: 'Capitalization of Machinery Rebuild', debit: '1210 - Property & Heavy Machinery', credit: '2110 - Supplier Cleared Balances', notes: 'Enhancing original machine useful base matching certified upgrade rules.' }
      ],
      auditTrail: [
        'Maintains detailed technician repair signatures on calibration history cards.',
        'Tracks the recorded downtime logs, and historical work order metrics.'
      ],
      reports: [
        'Asset Reliability Metrics & Downtime breakdown',
        'Period Preventive Maintenance Delivery schedule',
        'Component Maintenance Costs Ledger'
      ],
      apis: [
        { endpoint: '/api/v1/maintenance/schedule', verb: 'POST', desc: 'Registers recurring maintenance parameters.' },
        { endpoint: '/api/v1/maintenance/work-order', verb: 'PUT', desc: 'Updates active technical progress, parts usage, or closing logs.' }
      ],
      sodRules: [
        'Technicians cannot approve upgrade capitalizations to the subledger.'
      ],
      batchJobs: [
        { name: 'Daily Predictive Maintenance Planner', cron: '0 6 * * *', desc: 'Scans the asset parameters table daily, issuing auto-scheduled orders for technical checkups.' }
      ],
      exceptions: [
        { error: 'Required parts out of stock', handler: 'Flag maintenance status as "Delayed-Supply Hold" immediately, trigger procurement alert.' }
      ]
    }
  },
  {
    id: 'E',
    title: 'Asset Disposal and Retirement Management',
    icon: 'Trash2',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'General Enterprise'],
    description: 'Governs the formal termination of the asset lifecycle: writing off obsolete machinery, executing complex sales to third parties with automated gain/loss calculations, partial disposals, and retirement reversals.',
    submenus: [
      'De-registration Desk (FAM-DRD)',
      'Sales and Scrap Disposal Workspace',
      'Gain/Loss Financial Audit Ledger'
    ],
    functions: [
      'Dispose Fixed Asset (Full Retirement)',
      'Sell Fixed Asset (Commercial Transaction)',
      'Retire/Write-Off Damaged Equipment',
      'Scrap Salvaged Material Components',
      'Donate Depreciated Asset Properties',
      'Process Partial Asset Disposal',
      'Calculate Gain/Loss on Disposal Event',
      'Generate De-registration Accounting Journals',
      'Reverse Accidental Disposal Incident'
    ],
    sections: {
      businessCapabilityArea: 'Operations accounting / Subledger derecognition.',
      functionalStructure: [
        'Derecognition Controls Desk (FAM-DCD)',
        'Gain-Loss Disposal Calculator (FAM-GLC)',
        'Scrap Valuation Panel (FAM-SVP)'
      ],
      userStories: [
        'As an Asset Accountant, I want to log an asset sales transaction so that the accumulated depreciation matches the disposal date and the resulting gain or loss is booked automatically.',
        'As an Regional CFO, I want to perform a partial asset disposal of one floor of our regional hub transit depot to recognize the partial carrying cost reduction correctly under IFRS.'
      ],
      businessRequirements: [
        'Calculate Net Book Value (NBV) dynamically on the exact action day, posting catch-up depreciation to align balances.',
        'Remove original acquisition cost, accumulated depreciation reserves, and any revaluation balances from active ledgers instantly.',
        'Automate GL double-entries incorporating cash receipts from sales, residual scraping, and P&L gain/loss ledger balances.'
      ],
      businessRules: [
        { rule: 'Prior Period locks validation', validation: 'Cannot execute a disposal for an asset if it has unposted depreciation calculations for prior active months.' },
        { rule: 'Authority Limit Authorization', validation: 'Disposals with carrying costs exceeding 50,000 ETB require joint authorization from the branch CFO.' }
      ],
      workflow: [
        { step: 'Submit Disposal Plan', actor: 'Asset Accountant', description: 'Selects target asset, chooses disposal method, and enters expected sales revenues.' },
        { step: 'Asset Quality Analysis', actor: 'Maintenance Officer', description: 'Certifies physical damage, confirms de-commissioning dates.' },
        { step: 'Post Derecognition Ledger', actor: 'Finance Manager', description: 'Authorizes disposal transaction; system calculates gain/loss and pushes to General Ledger.' }
      ],
      pages: [
        { name: 'FAM-DIS-01 (Derecognition Workspace)', type: 'Transaction pane', purpose: 'Exposes scrap templates, sales contracts, or partial write-offs controls.' },
        { name: 'FAM-GNS-02 (Gain & Loss Controller)', type: 'Live Audit Log Calculator', purpose: 'Monitors historical cost, accumulated depreciation, sales revenue, and the net accounting impact.' }
      ],
      fields: [
        { field: 'Disposal Reason Code', type: 'Static dropdown', required: true, group: 'Transaction details' },
        { field: 'Sales revenue (ETB)', type: 'Currency Numeric', required: true, group: 'Asset Sales details' },
        { field: 'De-commissioning Date', type: '📅 Calendar Date', required: true, group: 'Transaction details' },
        { field: 'De-authorizer ID reference', type: 'Lookup tag', required: true, group: 'Control logs' }
      ],
      lookups: ['Certified Disposal Reasons', 'Cash and Bank Receipts account Ledger', 'AP Clearing Invoices'],
      enums: [
        { name: 'Asset De-registration Mode', values: ['Direct Scrap Write-off', 'Commercial Auction', 'State Donor Allocation', 'Partial Structural retirement'] }
      ],
      roles: [
        { role: 'Finance Manager', access: 'Reviews gain/loss results, authorizes asset de-registrations, approves write-offs.' }
      ],
      notifications: [
        { trigger: 'High Valuation Writeoff proposed', type: 'Critical alert notification', target: 'Finance Manager', msg: 'System Alert: Asset Card FA-1090 proposed with writeoff loss exceeding 100,000 ETB!' }
      ],
      integrations: [
        { module: 'Cash Book and Bank Ledger', flowDirection: 'Inbound', dataPoints: 'Sales receipts records, customer wire transfers approvals.' }
      ],
      accountingEntries: [
        { event: 'Asset derecognition via Sale (Gains Block)', debit: '1010 - Accounts Receivable/Cash Receipt (120k), 1215 - Accumulated Depreciation (50k)', credit: '1210 - Property Ledger Cost (150k), 6210 - Gain on Asset Sales (20k)', notes: 'Sale of corporate truck resulting in a capital gain.' },
        { event: 'Direct Asset write-off (Loss Block)', debit: '1215 - Accumulated Depreciation (30k), 6220 - Loss on Writeoff / Obsolescence (70k)', credit: '1210 - Asset Cost Ledger (100k)', notes: 'De-registration of non-reparable datacenter servers.' }
      ],
      auditTrail: [
        'Maintains detailed logs on derecognition date, authorization records, previous net values, and sales contract attachments.'
      ],
      reports: [
        'Asset Disposals Ledger Roll-forward schedule',
        'Period Gain & Loss on Property Sales Report',
        'State Obsolescence & Write-off Register'
      ],
      apis: [
        { endpoint: '/api/v1/assets/dispose', verb: 'POST', desc: 'Processes full or partial asset derecognition.' },
        { endpoint: '/api/v1/assets/reverse-disposal', verb: 'PUT', desc: 'Reverses accidental derecognitions, recovering previous subledger statuses.' }
      ],
      sodRules: [
        'Accountants performing physical counts cannot submit write-off disposal requests without manager approvals.'
      ],
      batchJobs: [
        { name: 'Daily Disposers sync checks', cron: '0 23 * * *', desc: 'Syncs finished capital disposals with tax registers to adjust tax pool categories continuously.' }
      ],
      exceptions: [
        { error: 'Attempting to dispose zero cost asset', handler: 'Enforce baseline inventory write-off logs, bypassing valuation accounts, post metadata logging.' }
      ]
    }
  },
  {
    id: 'F',
    title: 'Component Accounting',
    icon: 'Layers',
    verticals: ['Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Supports IAS 16 rules for separating compound assets (e.g., airline fleet separated into engines, interior fitments, and hull) into independent components with customized useful lives, methods, and disposals.',
    submenus: [
      'IAS 16 Component Desk (FAM-IAS)',
      'Sub-parts Inventory Setup',
      'Structural Component Depreciation Grid'
    ],
    functions: [
      'Register Asset Structure Component',
      'Capitalize Component Parts Independently',
      'Replace Component Sub-part (with decommission of original)',
      'Process Independent Component Depreciation schedules',
      'Dispose Discrete Component without retiring parent frame',
      'Maintain Parentcontract Component Relationships'
    ],
    sections: {
      businessCapabilityArea: 'Property, plant & equipment compliance under IFRS IAS 16.',
      functionalStructure: [
        'Component Relationships Map (FAM-CRM)',
        'Component-specific Depreciation ledger (FAM-CDL)',
        'Component Swap-Replacement controls (FAM-CSR)'
      ],
      userStories: [
        'As a Manufacturing Engineer, I want to register a compound turbine block as multiple independent components so that the shell amortizes over 25 years while the high-wear rotor depreciates over 5 years.',
        'As an Asset Accountant, I want to record the replacement of an electrical compressor component to write off the old unit and capitalize the upgraded part seamlessly.'
      ],
      businessRequirements: [
        'Allow multi-tier parent-child relationships where a parent asset contains multiple child components.',
        'Each child component preserves its distinct depreciation parameters: customized lifecycle methods, remaining life, and salvage residual metrics.',
        'Consolidated reports must display structural parent-level rollups with optional drill-downs into individual component blocks.'
      ],
      businessRules: [
        { rule: 'Consolidated Value Cap', validation: 'The cumulative acquisition value of components must equal the actual total value of the parent block.' },
        { rule: 'Retreating component lifespan', validation: 'A component useful lifespan cannot exceed the overarching technical lifespan of the parent structural shell.' }
      ],
      workflow: [
        { step: 'Core Asset Classification', actor: 'Asset Administrator', description: 'Registers compound chassis asset.' },
        { step: 'Decomposition Specs Set', actor: 'Technical Engineer', description: 'Defines the structural segments, value assignments, and lifespans.' },
        { step: 'Publish Subcomponents mapping', actor: 'Finance Director', description: 'Splits main carrying cost, creating independent tracking cards linked to separate journal lines.' }
      ],
      pages: [
        { name: 'FAM-CMP-20 (Component Decomposer Workspace)', type: 'Dynamic Split tool', purpose: 'Deconstructs parent asset records into discrete tracking parts.' },
        { name: 'FAM-CMP-30 (Parent-Child Hierarchy visualizer)', type: 'Relational Tree Viewer', purpose: 'Renders sub-components structures and cumulative value matrices.' }
      ],
      fields: [
        { field: 'Parent Asset Tag Reference', type: 'Parent Asset ID Link', required: true, group: 'Relational Links' },
        { field: 'Share of Parent Value (%)', type: 'Integer / Percent', required: true, group: 'Financial Split' },
        { field: 'Distinct Useful Life (Months)', type: 'Integer Duration', required: true, group: 'Subsystem parameters' }
      ],
      lookups: ['Overarching parent assets tags', 'IFRS Component Classes Codes'],
      enums: [
        { name: 'Component Priority Status', values: ['Primary chassis shell', 'Interchangeable wear component', 'Safety critical regulator', 'Secondary accessory fitment'] }
      ],
      roles: [
        { role: 'Fixed Asset Accountant', access: 'Performs asset breakdowns, replaces broken components, updates child lives.' }
      ],
      notifications: [
        { trigger: 'Child depreciation expiry mismatch', type: 'Standard system notification', target: 'Fixed Asset Accountant', msg: 'System flag: Sub-component HVAC rotor of asset FA-404 is close to depreciation expiry, whereas physical unit is in service.' }
      ],
      integrations: [
        { module: 'Technical Works Ledger', flowDirection: 'Inbound', dataPoints: 'Technical decomposition details, mechanical structural components schedules.' }
      ],
      accountingEntries: [
        { event: 'Component Separation event (Splitting parent)', debit: '1210-01 Core Structural shell (600k), 1210-02 Turbine Rotors (400k)', credit: '1210-00 Compound Asset Base Account (1000k)', notes: 'IAS 16 compliance split of bulk property.' },
        { event: 'Decommissioning retired part during swap', debit: '1215 Accumulated Depreciation (70k), 6220 Loss on disposal (30k)', credit: '1210 Component Cost base (100k)', notes: 'De-registering ancient structural parts.' }
      ],
      auditTrail: [
        'Logs historical parent-child split actions with original parent cost mappings.'
      ],
      reports: [
        'Parent-Child Asset Relationship Ledger',
        'Segmented Component carrying value matrices',
        'Component Lifespan Expiration Schedules'
      ],
      apis: [
        { endpoint: '/api/v1/components/split', verb: 'POST', desc: 'Decomposes parent asset carrying costs into distinct components.' }
      ],
      sodRules: [
        'Asset staff cannot split or combine assets without validation from structural technical inspectors.'
      ],
      batchJobs: [
        { name: 'Component Schedule Integrity Scanner', cron: '0 5 * * *', desc: 'Nightly checks confirming components matches the parental totals, correcting discrepancies.' }
      ],
      exceptions: [
        { error: 'Component replacement exceeds parent boundaries', handler: 'Notify CFO, stop transaction, switch capitalization routing to manual override logs.' }
      ]
    }
  },
  {
    id: 'G',
    title: 'Asset Inventory and Physical Verification',
    icon: 'ShieldCheck',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Controls standard physical audits: compiling verification checklist sheets, registering barcodes / RFID tags scanning results, reconciliations, identifying missing/surplus assets, and logging damage.',
    submenus: [
      'Physical Counting Center (FAM-PCC)',
      'Barcode / RFID Scanner Workbench',
      'Audit Verification Sheet Generator',
      'Inventory Reconciliation Board'
    ],
    functions: [
      'Register Physical Asset Count Cycle',
      'Generate Asset Verification Audit Sheets',
      'Import Audited Counts File',
      'Scan Asset Barcode / RFID',
      'Reconcile Physical Counts logs vs Ledger',
      'Register Missing Equipment Incidents',
      'Register Damaged Assets during audits',
      'Register Unrecorded Surplus Assets',
      'Generate Audit Discrepancies Reconciliation Reports'
    ],
    sections: {
      businessCapabilityArea: 'Operations audits & Property Governance.',
      functionalStructure: [
        'Physical Counting Terminal (FAM-PCT)',
        'RFID Tracking interface (FAM-RTI)',
        'Exceptions and Gaps reconciler (FAM-EGR)'
      ],
      userStories: [
        'As an Internal Auditor, I want to download a location-specific audit sheet so that our team can verify all branch computer monitors match physical custody registers.',
        'As an Inventory Clerk, I want to scan a laptop RFID tag to update custody, department location, and active operating status instantly via mobile.'
      ],
      businessRequirements: [
        'Enable bulk generation of physical verification inventories sorted by branch, floor, and custodian.',
        'Capture scanner feeds (UPC, Code128, Datamatrix, RFID) from corporate mobile portals.',
        'Provide structured interfaces to reconcile discrepancies, allowing accountants to post write-offs (missing items) or register surplus assets.'
      ],
      businessRules: [
        { rule: 'Count Frequency limits', validation: 'High-value security safes and server cores must be physically checked every 6 months.' },
        { rule: 'Condition Change enforcement', validation: 'Registering an asset condition as "Damaged" must trigger immediate operational status suspension.' }
      ],
      workflow: [
        { step: 'Initialize Inventory Count Session', actor: 'Internal Auditor', description: 'Selects target regional branch, locks active ledger updates, produces count sheets.' },
        { step: 'Field tag scanning operations', actor: 'Asset Custodian', description: 'Physically scans barcodes, logs condition changes, and writes commentary notes.' },
        { step: 'Audit Discrepancies Reconcile', actor: 'Finance Manager', description: 'Reviews missing list, evaluates unrecorded items, approves adjustment journals.' }
      ],
      pages: [
        { name: 'FAM-CNT-12 (Physical Counts Hub)', type: 'Count Management Console', purpose: 'Maintains audit schedules, matches scanner records, and handles data feeds.' },
        { name: 'FAM-TAG-15 (RFID Barcode Integration Panel)', type: 'Scanner Simulator', purpose: 'Coordinates RFID sweeps and processes barcode scan submissions.' }
      ],
      fields: [
        { field: 'Audited Physical Count ID', type: 'Sequence barcode', required: true, group: 'Audit header' },
        { field: 'Scanned Asset Tag', type: 'Identifier code', required: true, group: 'Scan Details' },
        { field: 'Registered Condition status', type: 'Static options list', required: true, group: 'Physical health' },
        { field: 'Discrepancy Action Type', type: 'Select adjustment', required: true, group: 'Reinstations' }
      ],
      lookups: ['Active Employee Registers', 'Scanning Device Hardware Profiles', 'Branch Facility Maps'],
      enums: [
        { name: 'Audit Discrepancy Status', values: ['Matched Exactly', 'Asset Location Discrepancy', 'Physical Asset Missing', 'Surplus/Unrecorded Found'] }
      ],
      roles: [
        { role: 'Asset Custodian', access: 'Creates counting cycles, enters field notes, uploads physical barcodes audits data.' },
        { role: 'Internal Auditor', access: 'Supervises counting, reviews variance reports, certifies final physical audits.' }
      ],
      notifications: [
        { trigger: 'Audit mismatch found', type: 'Alert push notification', target: 'Internal Auditor', msg: 'Verification variance: Regional office inventory cycle has detected 5 critical field assets as missing!' }
      ],
      integrations: [
        { module: 'Industrial Mobile Scanning systems', flowDirection: 'Inbound', dataPoints: 'Raw hardware barcode sweeps, scanned coordinates, custodian stamps.' }
      ],
      accountingEntries: [
        { event: 'Accounting for Missing Assets (Loss)', debit: '6220 - Loss on Missing Assets Property (Net), 1215 - Accumulated Depreciation (Full)', credit: '1210 - Asset cost account', notes: 'Write-off of missing assets after audited count cycle reconciliation.' },
        { event: 'Accounting for Surplus Assets found', debit: '1210 - Property asset account (Fair Value)', credit: '3425 - Miscellaneous Non-Operating Revenue', notes: 'Registering surplus property discovered during field checks.' }
      ],
      auditTrail: [
        'Insists on recording scanner hardware identifiers, timestamped coordinate markers, and inventory operator indexes.'
      ],
      reports: [
        'Asset Physical Count Discrepancy report',
        'Scanning operators productivity summary',
        'Historical Branch Location Audits schedule'
      ],
      apis: [
        { endpoint: '/api/v1/verification/register-scan', verb: 'POST', desc: 'Registers a single barcode or RFID scan event from industrial handheld devices.' }
      ],
      sodRules: [
        'Staff who physically manage equipment locations cannot singlehandedly adjust subledger balances inside the system.'
      ],
      batchJobs: [
        { name: 'Count Session Overdue alert', cron: '0 8 * * *', desc: 'Checks outstanding count cycles, issuing escalation warnings for counts delayed past 15 days.' }
      ],
      exceptions: [
        { error: 'Scanned barcode not registered', handler: 'Flag as "Unknown Surplus Asset", parse class parameters, suggest temporary classification card.' }
      ]
    }
  },
  {
    id: 'H',
    title: 'Lease Asset Management (IFRS 16)',
    icon: 'Scale',
    verticals: ['Banking', 'Insurance', 'Telecom', 'General Enterprise'],
    description: 'Implements IFRS 16 lease standards: recording lease agreements, calculating Right-of-Use (ROU) assets, establishing lease liability schedules and amortization, processing modifications, and planning terminations.',
    submenus: [
      'IFRS 16 Lease Desk (FAM-LEAS)',
      'Lease Contracts Register',
      'ROU Asset Amortization Console',
      'Lease Obligations Schedule Planner'
    ],
    functions: [
      'Register Lease Asset agreement',
      'Register Lease Contract parameters',
      'Calculate Right-of-Use Assets carrying cost',
      'Calculate Lease Liability and Amortization schedules',
      'Process Monthly Lease Depreciation loops',
      'Calculate Variable Lease interest accruals',
      'Process Lease Terms Modifications modifications',
      'Terminate Lease prior to contract schedule',
      'Generate Lease Accounting entries and Journals'
    ],
    sections: {
      businessCapabilityArea: 'Leases and Contracts Corporate Compliance under IFRS 16.',
      functionalStructure: [
        'Contract Parameters Vault (FAM-CPV)',
        'ROU Asset Amortization matrix (FAM-RAA)',
        'Lease Debt Schedule desk (FAM-LDS)'
      ],
      userStories: [
        'As a Corporate Treasurer, I want to register a headquarters commercial office lease contract so that ROU assets are calculated and our lease liability schedules are fully mapped in the ledger.',
        'As an Accountant, I want the system to generate interest accruals and depreciation expenses for lease liabilities, updating the GL automatically at month-end.'
      ],
      businessRequirements: [
        'Enable calculation of Right-of-Use (ROU) asset values incorporating initial direct costs, lease payments, and dismantling provision estimates.',
        'Establish lease liability balances based on the present value of lease payments discounted using incremental borrowing rates (IBR).',
        'Support modifications like extending useful life terms, changing rental rates, or executing premature contract terminations.'
      ],
      businessRules: [
        { rule: 'Discount rate requirement', validation: 'Incremental borrowing discount rate must be positive and fall between 1% and 25%.' },
        { rule: 'Lease category exemption validation', validation: 'Short-term leases (<12 months) and low-value asset leases are exempt from ROU capitalization, direct-expensing instead.' }
      ],
      workflow: [
        { step: 'Submit Lease Contract Draft', actor: 'Asset Administrator', description: 'Enters lease dates, periodic rental pricing, discount rate, initial fees.' },
        { step: 'Review Financial Amortization Schedules', actor: 'Fixed Asset Accountant', description: 'Reviews present value computations, checks ROU projections, confirms scheduling accuracy.' },
        { step: 'Authorize Capitalization & Post', actor: 'Finance Manager', description: 'Approve capitalization, posting active ROU asset and lease liability profiles to the subledger.' }
      ],
      pages: [
        { name: 'FAM-LSE-100 (IFRS 16 Lease Register)', type: 'Document Entry Workspace', purpose: 'Captures rent terms, incremental borrowing rates, indexations, and contract milestones.' },
        { name: 'FAM-LSE-120 (Lease Amortization Grid)', type: 'Projections Visualizer', purpose: 'Renders liability present value tables and interest calculations per period.' }
      ],
      fields: [
        { field: 'Lease Commencement Date', type: '📅 Calendar Date', required: true, group: 'Lease Terms' },
        { field: 'Contract Lease Duration (Months)', type: 'Integer Duration', required: true, group: 'Lease Terms' },
        { field: 'Discount Rate / IBR (%)', type: 'Numeric Decimal', required: true, group: 'Financial parameters' },
        { field: 'Periodic Rent Payment (ETB)', type: 'Currency Numeric', required: true, group: 'Lease Payments' }
      ],
      lookups: ['Legal entity interest scales', 'Standard Property rental agreements'],
      enums: [
        { name: 'Lease Classification', values: ['Exigent Low Value Exempt', 'Standard ROU Capitalization', 'Short-term Operating Rent Exempt'] }
      ],
      roles: [
        { role: 'Fixed Asset Accountant', access: 'Creates lease contract files, manages present value estimates, changes variables.' }
      ],
      notifications: [
        { trigger: 'Lease renewal deadline approaching', type: 'Standard email warning', target: 'Fixed Asset Accountant', msg: 'Contract Alert: Commercial outlet lease contract LSE-404 is scheduled to expire in 60 days.' }
      ],
      integrations: [
        { module: 'Contract Management Services', flowDirection: 'Bidirectional', dataPoints: 'Lease master metadata, physical rental property updates.' }
      ],
      accountingEntries: [
        { event: 'Commencement of Lease (Initial posting)', debit: '1250 - Right of Use (ROU) Asset (500k)', credit: '2210 - Lease Liability (Present Value) (500k)', notes: 'Capitalization of leased workspace matching IFRS 16.' },
        { event: 'Monthly Interest Accrual', debit: '5250 - Lease Interest Expense (OCI)', credit: '2210 - Lease Liability Account', notes: 'Accrual of discounted interest matching present value tables.' },
        { event: 'Monthly Lease ROU Depreciation', debit: '5205 - Depreciation Expense (Lease Asset)', credit: '1255 - Accumulated Amortization (ROU Asset)', notes: 'Amortization of ROU asset useful carrying value.' },
        { event: 'Monthly Rental Cash Payment Outflow', debit: '2210 - Lease Liability Account', credit: '1020 - Corporate Bank/Cash ledger', notes: 'Settle monthly invoice against lease liabilities.' }
      ],
      auditTrail: [
        'Maintains detailed logs on present value discount calculations, selected benchmark rates, lease modifications historical steps.'
      ],
      reports: [
        'IFRS 16 Lease Liabilities Amortization Schedules',
        'Right of Use Asset Carrying Values Registry',
        'Lease Obligations Maturity Breakdown Report'
      ],
      apis: [
        { endpoint: '/api/v1/leases/amortize', verb: 'POST', desc: 'Computes ROU present value schedules, returning amortization arrays.' }
      ],
      sodRules: [
        'Auditors are restricted from creating new leases or altering statutory incremental borrowing rates configurations.'
      ],
      batchJobs: [
        { name: 'Monthly Lease Accruals execution', cron: '0 2 * * 28', desc: 'Runs automated lease depreciation, amortization, and interest accruals calculations on the 28th of every month.' }
      ],
      exceptions: [
        { error: 'Rental payment changes', handler: 'Flag as contract terms modification, calculate present value changes, update schedules.' }
      ]
    }
  },
  {
    id: 'I',
    title: 'Reporting, Inquiry and Reconciliation',
    icon: 'FileSpreadsheet',
    verticals: ['Government', 'Banking', 'Insurance', 'Manufacturing', 'Telecom', 'General Enterprise'],
    description: 'Generates comprehensive analysis: Statutory Fixed Asset Register, movement roll-forwards, subledger to GL reconciliation grids, depreciation projections, asset warranty tracking, and visual management screens.',
    submenus: [
      'Executive Analytics Board (FAM-EAB)',
      'Statutory Financial Reporting Center',
      'Inquiries & Historic Logs Workspace',
      'Corporate Reconciliation Panel'
    ],
    functions: [
      'Generate Fixed Asset Register (FAR) Comprehensive PDF/XLSX',
      'Generate Asset Ledger Card historical timeline',
      'Generate Asset Movement / Roll-forward schedule',
      'Generate Period Asset Acquisition summaries',
      'Generate Comprehensive Depreciation Forecast schedule',
      'Generate Subledger to GL Reconciliation statements',
      'Inspect Asset Insurance & Warranty matrices',
      'Render Executive Dashboard KPI charts (carrying value, acquisitions, depreciations)'
    ],
    sections: {
      businessCapabilityArea: 'Shared ERP Controller dashboard, Treasury oversight, & Audits.',
      functionalStructure: [
        'Report Generator Suite (FAM-RGS)',
        'Interactive Asset History logs (FAM-IAH)',
        'Subledger checking engine (FAM-SCE)'
      ],
      userStories: [
        'As an Senior Financial Controller, I want to run a Fixed Asset Roll-forward schedule showing additions, disposals, depreciation, and revaluations so that I can compile the necessary disclosures for our annual report.',
        'As an Auditor, I want to view a real-time Subledger to General Ledger Reconciliation dashboard to confirm that Asset Clearing accounts are fully balanced.'
      ],
      businessRequirements: [
        'Support multi-format exporting (PDF, Excel, JSON API exports) for the complete Fixed Asset Register (FAR).',
        'Render chronological historical schedules for each asset tag (Audit custody logs, location transfers, revaluations).',
        'Generate detailed forecasts of monthly deprecation liabilities across 5 to 10 year Horizons for budgeting.'
      ],
      businessRules: [
        { rule: 'Reconciliation Tolerance Limit', validation: 'Subledger and General Ledger balances must reconcile to exactly 0.00 ETB. If discrepancies exist, flag them as "Unreconciled Variance".' }
      ],
      workflow: [
        { step: 'Select Target Scope & Year', actor: 'Finance Director', description: 'Chooses company branches, accounting standard, and reporting periods.' },
        { step: 'Report Computations Render', actor: 'System Core Engine', description: 'Processes ledger balance sheets, compiles roll-forwards, and generates data grids.' },
        { step: 'Certify & Publish', actor: 'Internal Auditor', description: 'Reviews balances, validates General Ledger reconciliations, and publishes certified files.' }
      ],
      pages: [
        { name: 'FAM-RPT-01 (Statutory Reporting Portal)', type: 'Analytical Workspace', purpose: 'Consolidates downloads for FAR, roll-forwards, revaluations, and impairments.' },
        { name: 'FAM-INQ-02 (Asset Lifecycle Inquiry Ledger)', type: 'Historic Timeline tool', purpose: 'Tracks detailed transition timelines, modifications logs, and cost adjustments for individual asset cards.' }
      ],
      fields: [
        { field: 'Selected Report Type', type: 'Static dropdown selection', required: true, group: 'Report Parameters' },
        { field: 'Reporting Period End', type: '📅 Calendar Date Selector', required: true, group: 'Scope boundaries' },
        { field: 'Include Leases Flag', type: 'Boolean checkbox', required: true, group: 'Data options' }
      ],
      lookups: ['Historic fiscal periods records', 'Legal Entities identifiers List'],
      enums: [
        { name: 'Report Export Type', values: ['Formatted spreadsheet (.xlsx)', 'Audit ready PDF document', 'JSON Raw Data Schema', 'Print layout formatting'] }
      ],
      roles: [
        { role: 'Inquiry User', access: 'Allowed to view dashboards, search asset parameters, and generate data spreadsheets.' }
      ],
      notifications: [
        { trigger: 'Auto-reconciliation run finished', type: 'System notification email', target: 'Finance Manager', msg: 'System integrity: Reconciliation run complete. Zero variance detected across all active accounts!' }
      ],
      integrations: [
        { module: 'Business Intelligence Platforms', flowDirection: 'Outbound', dataPoints: 'Raw asset dimensions, monthly depreciation arrays, useful life metrics.' }
      ],
      accountingEntries: [
        { event: 'Operational Reporting Run', debit: 'None', credit: 'None', notes: 'No accounting transaction posted during analysis runs.' }
      ],
      auditTrail: [
        'Stores timestamped download logs mapping user identity to sensitive legal reporting data.'
      ],
      reports: [
        'Statutory Fixed Asset Register (FAR)',
        'Corporate Property Movement Roll-Forward',
        'Subledger to General Ledger Reconciliation Summary'
      ],
      apis: [
        { endpoint: '/api/v1/reporting/far', verb: 'GET', desc: 'Returns the complete physical asset register sorted by criteria.' }
      ],
      sodRules: [
        'Inquiry users are strictly blocked from editing asset records, running calculations, or posting journal records.'
      ],
      batchJobs: [
        { name: 'Weekly Automatic Reconciler Check', cron: '0 1 * * 0', desc: 'Sunday batch scanning process confirming subledger-to-GL trial balances sync, flagging anomalies.' }
      ],
      exceptions: [
        { error: 'General Ledger balance mismatch found', handler: 'Flag as "Reconciliation Out of Sync", display exact account differences, notify CFO.' }
      ]
    }
  }
];

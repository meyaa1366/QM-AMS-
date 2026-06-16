export interface VoucherTypeBlueprint {
  code: string;
  name: string;
  purpose: string;
  scenario: string;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: string[];
  autoDebit: string;
  autoCredit: string;
  workflow: string;
  approvalRules: string;
  sampleTxn: string;
  reversalRules: string;
  postingRules: string;
  auditReqs: string;
}

export const VOUCHER_SPECS: Record<string, VoucherTypeBlueprint> = {
  JV: {
    code: 'JV',
    name: 'Journal Voucher',
    purpose: 'Manual adjustment of non-cash transactions and ledger balancing corrections.',
    scenario: 'Recording monthly accruals, adjustments, or correcting erroneous postings between GL accounts.',
    requiredFields: ['Voucher Date', 'Posting Date', 'Entity', 'Narration', 'Debits/Credits Lines'],
    optionalFields: ['Project Reference', 'Campaign Code'],
    validationRules: [
      'Total Debits must equal Total Credits precisely.',
      'Usage of Cash/Bank accounts is strictly prohibited to enforce segregation of duties in treasury operations.'
    ],
    autoDebit: 'User selected target adjustment/expense GL accounts (manual inputs)',
    autoCredit: 'User selected target contra/liability GL accounts (manual inputs)',
    workflow: 'Prepared by Junior Accountant ➔ Reviewed by Senior / Chief Accountant ➔ Approved by Finance Manager/CFO',
    approvalRules: 'Requires double signature. Transactions > 500,000 ETB require CFO and board co-sign.',
    sampleTxn: 'Dr 5150 Rent Expense (85,000 ETB) | Cr 1130 Prepaid Rent Asset (85,000 ETB)',
    reversalRules: 'Generate an offsetting Journal Voucher with swapped Debit/Credit values referencing the original voucher number.',
    postingRules: 'Can only be posted to open financial periods. Historical postings to closed fiscal quarters are hard-locked.',
    auditReqs: 'Must attach supporting computation spreadsheets or valuation memos signed off by department heads.'
  },
  AJV: {
    code: 'AJV',
    name: 'Adjustment Journal Voucher',
    purpose: 'Special end-of-period adjustments, tax provisions, and audit corrections.',
    scenario: 'Creating financial year-end adjustments or provisions requested by external auditors.',
    requiredFields: ['Voucher Date', 'Posting Date', 'Auditor Ref No', 'Adjustment Narration'],
    optionalFields: ['Tax Year Match', 'Audit Firm Stamp ID'],
    validationRules: [
      'Must balance to zero cent variance.',
      'Allowed only in month-end, quarter-end, or year-end adjustment intervals.'
    ],
    autoDebit: 'Nominated balance sheet asset adjustments or expense provisioning accounts',
    autoCredit: 'Corresponding reserve, provision, or liability adjustments',
    workflow: 'Audit lead preparer ➔ Director of Finance Review ➔ CFO Authorized Post',
    approvalRules: 'Requires external audit approval code and CFO digital authorization key.',
    sampleTxn: 'Dr 5120 Provision for Bad Debts (12,000 ETB) | Cr 1120 Trade Receivable Allowance (12,000 ETB)',
    reversalRules: 'Post a Contra-Reversal document approved by internal audit division.',
    postingRules: 'Strictly restricted to adjusting periods (Period 13 (Year-end Adjustments)). Enforced in accounting settings.',
    auditReqs: 'Attach official external auditor corrective journals sheet or trial balance draft.'
  },
  CRV: {
    code: 'CRV',
    name: 'Cash Receipt Voucher',
    purpose: 'Acknowledgement and ledger entry of received physical cash instruments to cash safe assets.',
    scenario: 'Receiving cash over the counter for cash-based sales or small staff advances reimbursement.',
    requiredFields: ['Payer Name', 'Collected Amount', 'Target Cash Account', 'Narration'],
    optionalFields: ['Cashier Cash Register Ref', 'Preprinted Receipt No'],
    validationRules: [
      'Must enter positive collected numeric value (> 0).',
      'Daily physical cash receiving limit is capped at 100,000 ETB per cashier for retail premises.'
    ],
    autoDebit: 'Allocated Petty Cash or Main cash box asset ledger (Dr 1111)',
    autoCredit: 'Target income, customer sub-ledger, or asset clearing cash (Cr 4110 / 1120)',
    workflow: 'Receiving Cashier ➔ Treasury Supervisor ➔ Cashier Post Confirmation',
    approvalRules: 'Sums exceeding 50,050 ETB require supervisor clearance of physical vault check.',
    sampleTxn: 'Dr 1111 Petty Cash Local (15,000 ETB) | Cr 4110 Sales Revenue (15,000 ETB)',
    reversalRules: 'Requires a corresponding Cash Payment Voucher (CPV) stamped as "Correction of Receipt Error".',
    postingRules: 'Posts in real-time to the daily general ledger cash journal book.',
    auditReqs: 'Sequential pre-printed continuous receipt coupon must be attached. Sequential number gaps trigger flags.'
  },
  CPV: {
    code: 'CPV',
    name: 'Cash Payment Voucher',
    purpose: 'Validating and paying physical cash for small petty disbursements.',
    scenario: 'Paying local courier logistics charges, buying emergency office paper buffers, or minor repairs.',
    requiredFields: ['Payee Legal Name', 'Cash Account box', 'Expense GL Account', 'Gross Cash Paid'],
    optionalFields: ['Supplier Bill Invoice Ref', 'WHT Deducted Option'],
    validationRules: [
      'Single daily payment per supplier must not exceed 10,000 ETB (ERCA Cash Transaction Act No. 721). Large expenditures demand BPV.'
    ],
    autoDebit: 'Nominated expense node (e.g. Dr 5130 Office Expense / Dr 5140 Logistics)',
    autoCredit: 'Fior Cash Box ledger account (Cr 1111 Petty Cash)',
    workflow: 'Procurement Petty Preparer ➔ Internal Control Accountant Sign ➔ Cashier Release',
    approvalRules: 'Payments > 5,000 ETB require CFO written approval in corporate admin.',
    sampleTxn: 'Dr 5130 Office Expense (4,500 ETB) | Cr 1111 Petty Cash Local (4,500 ETB)',
    reversalRules: 'Inward Cash Receipt Voucher marked as manual adjustment with the exact original voucher number.',
    postingRules: 'Immediate ledger writing; daily cash summaries lock daily cash box total.',
    auditReqs: 'Physical receipt with official cash-sale invoices or ERCA-registered invoices must be scanned.'
  },
  BRV: {
    code: 'BRV',
    name: 'Bank Receipt Voucher',
    purpose: 'Recording wired funds, deposits, and clearing incoming bank remittances.',
    scenario: 'Receiving USD wire transfer for sesame export shipment or CBE domestic bank transfers.',
    requiredFields: ['Depositor / Customer Inst', 'Receipt Amount', 'Receipt Bank Link', 'Reference Transfer No'],
    optionalFields: ['Swift Reference Code', 'Underlying Purchase Order No'],
    validationRules: [
      'Bank transaction reference number must be unique and verified against daily bank credit advice.'
    ],
    autoDebit: 'Selected active Bank ledger node (Dr 1112 CBE Bank / Dr 1114 Awash USD)',
    autoCredit: 'Trade customer subledger or deferred revenue (Cr 1120 Receivable / Cr Customer)',
    workflow: 'Bank Treasury Analyst ➔ Finance Supervisor ➔ Accounts Receivable Clerk Post',
    approvalRules: 'Standard bank deposit advice validated. Amounts exceeding 1M ETB trigger Compliance Officer check.',
    sampleTxn: 'Dr 1112 Bank CBE ETB (172,350 ETB) | Cr 1120 Trade Receivable (172,350 ETB)',
    reversalRules: 'Cannot be edited. Must execute Bank Payment Voucher (BPV) with specialized code "Remittance Return".',
    postingRules: 'Posted upon clearance verification by bank statement matches.',
    auditReqs: 'Attach PDF digital copy of Credit Advice issued by Central Ban / CBE.'
  },
  BPV: {
    code: 'BPV',
    name: 'Bank Payment Voucher',
    purpose: 'Recording and issuing corporate bank payments via cheques, EFT or bank transfers.',
    scenario: 'Paying commercial supplier invoices, buying corporate fixed assets, or settling statutory tax obligations.',
    requiredFields: ['Beneficiary Corp', 'Payment Gross Amount', 'Source Bank Account', 'Cheque / Wire Ref No'],
    optionalFields: ['Purchase Invoice Code', 'Tax Group Ref'],
    validationRules: [
      'Source corporate bank account must contain sufficient cleared ledger balance.',
      'Instrument cheque numbers must be entered with consecutive serial numbers.'
    ],
    autoDebit: 'Supplier Account Payable (Dr 2110) or specific purchased asset GL account',
    autoCredit: 'Source corporate bank checking account (Cr 1112 CBE Bank / Cr 1113 Dashen)',
    workflow: 'Accounts Payable Clerk ➔ Treasury Manager Co-Sign ➔ Signed CFO Release',
    approvalRules: 'Requires dual corporate banking signatories. Value exceeding 250,500 ETB requires CFO authorization.',
    sampleTxn: 'Dr 2110 Trade Payables (92,000 ETB) | Cr 1112 Bank CBE Account (92,000 ETB)',
    reversalRules: 'Reversed via Bank Receipt Voucher (BRV) matching cancellation and refund advices.',
    postingRules: 'Posted into ledger book only after bank cheque stub clearance or digital transfer notification confirmation.',
    auditReqs: 'Attach scanned Bank Transfer Advice or photocopy of issued paper banking cheque.'
  },
  BTV: {
    code: 'BTV',
    name: 'Bank Transfer Voucher',
    purpose: 'Shifting liquidity assets between internal corporate bank accounts.',
    scenario: 'Transferring cash from a high-yield CBE account to Dashen Checking to cover payroll payouts.',
    requiredFields: ['Source Bank', 'Destination Bank', 'Transfer Amount', 'Reference Wire Advice'],
    optionalFields: ['Treasury Fees Account', 'Bank Transfer Quote ID'],
    validationRules: [
      'Source Bank and Target Bank must be different accounts.',
      'Requires exact match of currency codes unless converting with official treasury currency conversion coefficients.'
    ],
    autoDebit: 'Target receiver bank general ledger account (Dr 1113)',
    autoCredit: 'Originating source bank general ledger account (Cr 1112)',
    workflow: 'Cash Management Analyst ➔ Treasury Manager ➔ Automated Broker Clear',
    approvalRules: 'Requires joint approval of Treasury Director if inter-entity balances are involved.',
    sampleTxn: 'Dr 1113 Bank Dashen (300,000 ETB) | Cr 1112 Bank CBE (300,000 ETB)',
    reversalRules: 'Execute an inverse BTV from Destination Bank to Source Bank with detailed re-transfer log.',
    postingRules: 'Posted on same-day transfer dates to guarantee interbank reconciliation is neat.',
    auditReqs: 'Attach digital statements of the source debit advice and destination deposit credit confirmation.'
  },
  ARI: {
    code: 'ARI',
    name: 'Customer Invoice Voucher',
    purpose: 'Generating customer account receivables and recognizing sales revenue matching IFRS 15 rules.',
    scenario: 'Issuing a tax invoice to a client for exporting coffee consignment or local agro delivery.',
    requiredFields: ['Customer Name', 'Sales Net Amount', 'Revenue Account Code', 'VAT Option'],
    optionalFields: ['Logistics Tracking Ref', 'Contractual Payment Terms Days'],
    validationRules: [
      'Customer VAT number and TIN number must match the legal billing database records.',
      'VAT 15% must be applied unless explicit tax exemption certificate is pinned.'
    ],
    autoDebit: 'Trade Receivables Asset Subledger ledger node (Dr 1120)',
    autoCredit: 'Recognized Sales Income (Cr 4110) & Tax VAT Output Liability (Cr 2120)',
    workflow: 'Sales Invoicing Desk ➔ Credit Control Accountant ➔ Automated Subledger Post',
    approvalRules: 'Subject to customer credit limit checks. Excess credit approvals demand Sales Director signoff.',
    sampleTxn: 'Dr 1120 Trade Receivable (115,000 ETB) | Cr 4110 Sales Revenue (100,000 ETB) | Cr 2120 VAT Output (15,000 ETB)',
    reversalRules: 'Corrected via Credit Note Voucher (CNV) or debit adjustment notes depending on pricing correction.',
    postingRules: 'Automatically posted upon sales system print and dispatch of product.',
    auditReqs: 'Attach signed Delivery Order (DO) and customer-approved sales order.'
  },
  ARRV: {
    code: 'ARRV',
    name: 'Customer Receipt Voucher',
    purpose: 'Inward cash matching against trade receivables accounts.',
    scenario: 'Receiving bank wire from customer settling their outstanding monthly account balance.',
    requiredFields: ['Customer Name', 'Trade Receivable account', 'Receipt Amount', 'Cash/Bank Account'],
    optionalFields: ['Original Invoice Number Link', 'Bank Slip Ref'],
    validationRules: [
      'Must allocate receipts against active, outstanding Customer Invoice (ARI) records to close subledger loops.'
    ],
    autoDebit: 'Receiving corporate Bank Account or active Cash Box (Dr 1112)',
    autoCredit: 'Trade Customer Receivable Asset Subledger (Cr 1120)',
    workflow: 'Receivables Clerk ➔ Credit Manager Review ➔ Ledger Allocation Post',
    approvalRules: 'Credit Control Officer checks and unlocks customer accounts if past overdue barriers are paid.',
    sampleTxn: 'Dr 1112 CBE Bank Asset (115,000 ETB) | Cr 1120 Trade Receivables (115,000 ETB)',
    reversalRules: 'Post corrective ledger Adjustment Journal Voucher (AJV) specifying incorrect customer allocations.',
    postingRules: 'Immediate booking on bank settlement dates.',
    auditReqs: 'Bank confirmation receipt stamped by treasury.'
  },
  CNV: {
    code: 'CNV',
    name: 'Credit Note Voucher',
    purpose: 'Reducing customer outstanding balances due to returned products or agreed price deductions.',
    scenario: 'Crediting coffee customer for damaged crop bags received during sea freight transit.',
    requiredFields: ['Customer Name', 'Returns Account Code', 'Credit Adjusted Amount', 'VAT rate'],
    optionalFields: ['Original Sales Invoice Ref', 'Warehouse Return Slip'],
    validationRules: [
      'Credit note amount cannot exceed the net amount of the original corresponding customer invoice.'
    ],
    autoDebit: 'Sales Returns/Discounts Dr 4110 & VAT Output tax liability correction (Dr 2120)',
    autoCredit: 'Trade Customer Outstanding Receivables (Cr 1120)',
    workflow: 'Customer Service Clerk ➔ Sales Manager Authorization ➔ Finance Controller Approval',
    approvalRules: 'Credit adjustments > 100,000 ETB require strict CFO approval.',
    sampleTxn: 'Dr 4110 Sales Return (20,000 ETB) | Dr 2120 VAT Output Correction (3,000 ETB) | Cr 1120 Trade Receivables (23,000 ETB)',
    reversalRules: 'Debit Note Voucher (DNV) to reinstate original customer trade receivables liability.',
    postingRules: 'Must be posted inside fiscal month of credit approval; backdating is barred.',
    auditReqs: 'Scanned warehouse Good Return Note (GRN) proving physical arrival of returned products.'
  },
  DNV: {
    code: 'DNV',
    name: 'Debit Note Voucher',
    purpose: 'increasing customer receivables due to under-invoicing or subsequent price increases.',
    scenario: 'Charging additional shipping costs to client which were initially omitted on first invoice.',
    requiredFields: ['Customer Name', 'Receivable GL Account', 'Debit Adjusted Net Amount', 'VAT rate'],
    optionalFields: ['Original Invoice Reference', 'Amended Contract Code'],
    validationRules: [
      'Requires explicit attachment explaining contractual under-billing justification factors.'
    ],
    autoDebit: 'Trade customer subledger receivables asset (Dr 1120)',
    autoCredit: 'Recognized Sales Revenues (Cr 4110) & corresponding VAT Output liability (Cr 2120)',
    workflow: 'Billing Clerk ➔ Senior Billing Controller ➔ Subledger Automated Post',
    approvalRules: 'Requires Director of Billing sign-off on transactions exceeding threshold of 50,050 ETB.',
    sampleTxn: 'Dr 1120 Trade Receivables (11,500 ETB) | Cr 4110 Sales (10,000 ETB) | Cr 2120 VAT Output (1,500 ETB)',
    reversalRules: 'Post a Credit Note Voucher (CNV) compensating the adjustments.',
    postingRules: 'Requires active tax period posting permissions.',
    auditReqs: 'Attach the corrected commercial contract quote or price adjustment agreement papers.'
  },
  API: {
    code: 'API',
    name: 'Supplier Invoice Voucher',
    purpose: 'Recording supplier expenditures, matching procurement costs, and recognizing accounts payable liabilities.',
    scenario: 'Booking commercial utility invoice, raw sugar deliveries from agro fields, or expert consultancy.',
    requiredFields: ['Supplier Vendor Name', 'Expense Account GL', 'Purchase Net Amount', 'VAT Options', 'WHT Options'],
    optionalFields: ['Purchase Order Ref ID', 'Supplier Serial invoice Ref', 'TIN/VAT Number'],
    validationRules: [
      'Calculates VAT Input tax assets and Withholding Tax Payable obligations.'
    ],
    autoDebit: 'Target procurement expense/asset (Dr 5110 Direct Cost) & VAT Input tax asset (Dr 1140)',
    autoCredit: 'Trade Account Payable subledger (Cr 2110) & Withholding Tax Payable liability (Cr 2130)',
    workflow: 'Accounts Payable Clerk ➔ Internal Auditor Match ➔ CFO Verified Post',
    approvalRules: 'Invoice value must match Purchase Order and Good Receipt Note values ("3-Way Match Check").',
    sampleTxn: 'Dr 5110 Raw Materials (100,000 ETB) | Dr 1140 VAT Input (15,000 ETB) | Cr 2130 Withholding Payable (2,000 ETB) | Cr 2110 Trade Payables (113,000 ETB)',
    reversalRules: 'Generate Supplier Credit Note adjustment or general journal correcting entries.',
    postingRules: 'Posted immediately to expense registers upon verification of goods delivery.',
    auditReqs: 'Attach original Supplier Tax Invoice, Purchase Order slip and signed Good Receiving Note (GRN).'
  },
  APPV: {
    code: 'APPV',
    name: 'Supplier Payment Voucher',
    purpose: 'Matching payables against cash/bank settlement outflows.',
    scenario: 'Paying outstanding supplier trade balances via CBE Bank wire transfer.',
    requiredFields: ['Supplier Vendor Name', 'Payment Amount', 'Trade Payables account', 'Bank/Cash Account'],
    optionalFields: ['Outstanding Invoices matches', 'Bank Transfer Advice ID'],
    validationRules: [
      'Payment allocation must correspond to specific, previously posted Supplier Invoices (API).'
    ],
    autoDebit: 'Trade Supplier Accounts Payable Liability subledger (Dr 2110)',
    autoCredit: 'Corporate Bank account or Cash safe box asset (Cr 1112 CBE Bank)',
    workflow: 'Accounts Payable specialist ➔ Treasury Cash manager ➔ CFO Approval Sign',
    approvalRules: 'Payment must have matching supplier invoices approved for payment.',
    sampleTxn: 'Dr 2110 Trade Payables (113,000 ETB) | Cr 1112 Bank CBE ETB (113,000 ETB)',
    reversalRules: 'Manual corrective adjustment via Journal Voucher (JV) tracking banking returns.',
    postingRules: 'Posted matching bank transaction clearance timestamp records.',
    auditReqs: 'Photocopy of paid bank advice slip signed by the head of treasury.'
  },
  ADV: {
    code: 'ADV',
    name: 'Advance Voucher',
    purpose: 'Tracking upfront downpayments made to vendors or received from clients prior to delivery.',
    scenario: 'Sending 30% advance deposit value to commercial packaging company to trigger box production.',
    requiredFields: ['Party Legal Name', 'Advance Direction', 'Advance Clearing Account', 'Total Advance Amount', 'Target Bank/Cash'],
    optionalFields: ['Proforma Invoice Ref', 'Project Bid Reference'],
    validationRules: [
      'Unapplied advances must be kept in specific balance sheet advance holding accounts until final invoice clearing.'
    ],
    autoDebit: 'If Supplier: Debit vendor advance asset account (Dr 1130) | If Customer: Debit Bank CBE Asset (Dr 1112)',
    autoCredit: 'If Supplier: Credit bank asset (Cr 1112) | If Customer: Credit customer advance liability (Cr 2210)',
    workflow: 'Accounts Specialist ➔ Cash controller ➔ Director of Finance Sign',
    approvalRules: 'Contractual terms proving advance downpayment rules must be attached and co-signed.',
    sampleTxn: 'Dr 1130 Vendor Advances Asset (50,000 ETB) | Cr 1112 Bank CBE Account (50,000 ETB)',
    reversalRules: 'Voucher journal reversal adjusting matching deliveries.',
    postingRules: 'Enters dynamic ledger on receipt/payment clearing moments.',
    auditReqs: 'Attach signed proforma invoice or contract downpayment rules documentation.'
  },
  PPV: {
    code: 'PPV',
    name: 'Prepayment Voucher',
    purpose: 'Booking deferred expense assets according to IFRS accrual concepts.',
    scenario: 'Prepaying 12 months office warehouse lease rent to landlord in Addis Ababa.',
    requiredFields: ['Vendor Landlord Name', 'Prepayment Total Amount', 'Prepaid Asset Account', 'Bank/Cash Account'],
    optionalFields: ['Lease Contract Serial', 'Monthly Amortization Schedule Link'],
    validationRules: [
      'Prepaid expense assets are amortisatible over the dynamic period of the underlying coverage contract.'
    ],
    autoDebit: 'Deferred prepaid expenses asset ledger (Dr 1130 Prepaid Expenses)',
    autoCredit: 'Paying corporate bank account (Cr 1112 CBE Bank ETB)',
    workflow: 'AP Clerk Draft ➔ Financial Reporting manager ➔ CFO Approval Sign',
    approvalRules: 'Lease contracts must match corporate legal team signatures.',
    sampleTxn: 'Dr 1130 Prepaid Rent Asset (120,000 ETB) | Cr 1112 Bank CBE Account (120,000 ETB)',
    reversalRules: 'System-generated monthly amortizations (JVs) instead of document-level block cancellation.',
    postingRules: 'Booked in the initial contract payment month.',
    auditReqs: 'Attach lease amortization spreadsheet detailing the monthly expense release splits.'
  },
  CHQV: {
    code: 'CHQV',
    name: 'Cheque Voucher',
    purpose: 'Managing, printing, and ledger posting of cheque instruments to bank reserves.',
    scenario: 'Issuing physical bank payee cheque for raw materials to agricultural farmers.',
    requiredFields: ['Cheque Number Serial', 'Vendor Name', 'Cheque Amount Value', 'Bank account link'],
    optionalFields: ['Cheque Memo', 'Drawn Date'],
    validationRules: [
      'Cheque number serial must not be duplicate inside the bank account register.'
    ],
    autoDebit: 'Supplier Accounts Payable Liability subledger (Dr 2110)',
    autoCredit: 'Drawn Bank account asset ledger (Cr 1112 CBE Bank)',
    workflow: 'Treasury clerk cheque writer ➔ Treasury lead check ➔ CFO cheque signature',
    approvalRules: 'Dual bank signatories rule matching corporate banking setup requirements.',
    sampleTxn: 'Dr 2110 Trade Payables (45,000 ETB) | Cr 1112 CBE Bank Asset (45,000 ETB)',
    reversalRules: 'Void cheque mark, automated post-back ledger reversing.',
    postingRules: 'Posted into ledger book only after confirmation of cheque handoff to vendor.',
    auditReqs: 'Secure safe storage of physical cheque book, maintaining log of voided cheque leafs.'
  },
  PDCV: {
    code: 'PDCV',
    name: 'Post-Dated Cheque Voucher',
    purpose: 'Holding customer or supplier post-dated cheques in a secure clearing asset ledger.',
    scenario: 'Receiving a customer clearing cheque dated 3 months in advance to settle export payments.',
    requiredFields: ['Cheque Number Ref', 'Payer Name', 'Cheque Value', 'Holding Account', 'Cheque Maturity Date'],
    optionalFields: ['Paying bank details', 'Invoice reference matches'],
    validationRules: [
      'Post-dated cheques cannot be posted to liquid cash accounts until maturity dates are reached and cleared.'
    ],
    autoDebit: 'Post-dated Cheques Secure Clearing Holding Asset (Dr 1150)',
    autoCredit: 'Trade Customer accounts receivable subledger (Cr 1120)',
    workflow: 'Cash Custodian Clerk ➔ Treasury Director Check ➔ Automatic maturity clearing scheduler',
    approvalRules: 'Payer bank credit rating valid checks performed prior to accepting PDCs.',
    sampleTxn: 'Dr 1150 PDC Clearing Asset (60,000 ETB) | Cr 1120 Trade Receivables (60,000 ETB)',
    reversalRules: 'Returned cheque voucher, reversing original Trade Account Receivables.',
    postingRules: 'Asset holding posted upon receipt. Liquid bank post happens strictly on cheque maturity.',
    auditReqs: 'Audit physical checks safe storage registers. Discrepancies between logs and safe counts must be zero.'
  },
  VATV: {
    code: 'VATV',
    name: 'VAT Settlement Voucher',
    purpose: 'Clearing and settling VAT inputs and VAT outputs for monthly reporting to ERCA.',
    scenario: 'Month-end ERCA compliance reporting clearing local VAT books.',
    requiredFields: ['VAT Reporting Period', 'Total Accrued VAT Input', 'Total Accrued VAT Output'],
    optionalFields: ['ERCA VAT Declarations reference ID', 'Tax return form receipt'],
    validationRules: [
      'Must clear the balance of VAT Input (Asset) and VAT Output (Liability) of the reporting month completely.'
    ],
    autoDebit: 'VAT Output Liability (Dr 2120 VAT Output for entire accumulated balance)',
    autoCredit: 'VAT Input Asset (Cr 1140 VAT Input for entire accumulated balance) & clearing to VAT Payable (Cr 2140)',
    workflow: 'Tax Compliance Director ➔ Senior Accountant Sign ➔ CFO authorized pay release',
    approvalRules: 'Requires tax board review of complete invoice registries before filing.',
    sampleTxn: 'Dr 2120 VAT Output (350,000 ETB) | Cr 1140 VAT Input (200,000 ETB) | Cr 2140 VAT Payable Cleared (150,000 ETB)',
    reversalRules: 'Strictly forbidden. Errors must be settled in next month tax adjustments.',
    postingRules: 'Posted strictly on monthly tax settlement run dates.',
    auditReqs: 'Exported VAT Output tax invoice ledger book and verified VAT Input purchases ledger book.'
  },
  WHTV: {
    code: 'WHTV',
    name: 'Withholding Tax Voucher',
    purpose: 'Recording statutory withholding taxes deducted during transactions according to ERCA regulations.',
    scenario: 'Deducting 2% withholding tax on local service contracts exceeding 10,000 ETB.',
    requiredFields: ['Invoice reference', 'Contract Base amount', 'Withholding Category Rate', 'Supplier Payables GL Account'],
    optionalFields: ['ERCA TIN Code', 'WHT Serial Certificate Number'],
    validationRules: [
      'WHT certificates must be generated and printed for the supplier within 15 days of withholding.'
    ],
    autoDebit: 'Supplier Accounts Payable Liability subledger (Dr 2110)',
    autoCredit: 'Statutory Withholding Tax Payable liability (Cr 2130)',
    workflow: 'AP matching clerk ➔ Tax accountant supervisor ➔ Automatic cert print',
    approvalRules: 'Validates supplier tax exemption certificate registry status prior to deduction waive.',
    sampleTxn: 'Dr 2110 Supplier Payables (2,000 ETB) | Cr 2130 Withholding Tax Payable (2,000 ETB)',
    reversalRules: 'Reversed only if invoice was voided completely inside same taxing period.',
    postingRules: 'Posted concurrently with the invoice booking transaction.',
    auditReqs: 'Verify against pre-numbered ERCA Withholding Tax Certificate booklets.'
  },
  FXV: {
    code: 'FXV',
    name: 'FX Exchange Voucher',
    purpose: 'Adjusting foreign currency account balances dynamically at period closing rates.',
    scenario: 'Re-evaluating USD export balance after changes in ETB/USD exchange rates.',
    requiredFields: ['Currency Code', 'Target USD Asset bank', 'Historical exchange rate', 'New closing rate'],
    optionalFields: ['NBE official rate sheet ref', 'Forex reference quote ID'],
    validationRules: [
      'Re-evaluation rates must match National Bank of Ethiopia (NBE) official month-end closing rate tables.'
    ],
    autoDebit: 'If USD asset increases: Bank USD Asset (Dr 1114) | If loss: Forex conversion loss expense (Dr 5160)',
    autoCredit: 'If USD asset increases: Premium FX gains revenue (Cr 4120) | If loss: Bank USD Asset (Cr 1114)',
    workflow: 'Forex Treasury manager ➔ Reporting supervisor ➔ Authorized Ledger Post',
    approvalRules: 'Forex translation adjustments are run on all currency accounts jointly.',
    sampleTxn: 'Dr 1114 Bank USD Awash (23,000 ETB) | Cr 4120 Realized FX Gain (23,000 ETB)',
    reversalRules: 'Inverse currency adjustment entries for corrections.',
    postingRules: 'Batch processed as a month-end ledger closing routine.',
    auditReqs: 'Attach official NBE exchange rate publication sheets dated for the final reporting day.'
  },
  ALV: {
    code: 'ALV',
    name: 'Allocation/Accrual Voucher',
    purpose: 'Distributing consolidated corporate expenses to distinct branch segments.',
    scenario: 'Splitting consolidated head office electric/internet bills among regional branches.',
    requiredFields: ['Total allocated gross expense', 'Source cost center', 'Allocation ratios list', 'Target cost center entries'],
    optionalFields: ['Corporate allocation run ID', 'Allocation Matrix Excel Ref'],
    validationRules: [
      'Allocation ratios must sum up to exactly 100% (or ratio sum equals 1.0).'
    ],
    autoDebit: 'Target receiver branch/department expense GL nodes (Dr rent/electric for branch value)',
    autoCredit: 'Main corporate head office clearing contra-allowance account (Cr 5150)',
    workflow: 'Inter-branch accountant ➔ Multi-entity manager reviewer ➔ Automated allocation batch post',
    approvalRules: 'Subject to inter-entity service level agreements approved by division heads.',
    sampleTxn: 'Dr 5130 Bole Office Electric (4,000 ETB) | Dr 5130 Factory Electric (6,000 ETB) | Cr 5130 HQ Consolidated Electric Contra (10,000 ETB)',
    reversalRules: 'Cancellation via reversing contra-allocation journal runs in matching period.',
    postingRules: 'Accrual run scheduled at end of calendar months.',
    auditReqs: 'Annual alignment review verifying allocation formulas are relevant to subsidiary spaces.'
  },
  RCV: {
    code: 'RCV',
    name: 'Reversal Correction Voucher',
    purpose: 'Generating automated contra balancing ledger lines to completely cancel an incorrect posted document.',
    scenario: 'Cancelling a bank payment voucher that was entered with incorrect bank charges.',
    requiredFields: ['Original target voucher number', 'Reversal Reason memo', 'Ledger swap entries'],
    optionalFields: ['Auditor Authorization code', 'Corrected duplicate voucher ref'],
    validationRules: [
      'Original voucher must have "Posted" status and must not have been previously reversed.',
      'Reversal entry must target the original ledger lines exactly but in reverse (Debits become Credits and vice versa).'
    ],
    autoDebit: 'The credited accounts of the original voucher (Dr original Cr accounts)',
    autoCredit: 'The debited accounts of the original voucher (Cr original Dr accounts)',
    workflow: 'Senior Accountant ➔ Internal Control review ➔ CFO Sign',
    approvalRules: 'Audit trail logging is mandatory. Reversing posted documents always alert CFO terminal.',
    sampleTxn: 'Dr 1111 Petty Cash (4,500 ETB) | Cr 5130 Office Expense (4,500 ETB) (Exact reversal of CPV-2026-0043)',
    reversalRules: 'Post a new corrected voucher. Double-reversing is restricted by system constraints.',
    postingRules: 'Posted immediately to current open calendar periods with cross-references to original document.',
    auditReqs: 'Attach clear copy of the original incorrect voucher highlighting the error correction code.'
  },
  ICV: {
    code: 'ICV',
    name: 'Intercompany Voucher',
    purpose: 'Settle intercompany trade values and transfer balances between separate divisional affiliates.',
    scenario: 'MS-ETH-01 paying custom clearance duties on behalf of MS-KE-02 associate branch.',
    requiredFields: ['Affiliate Entity Name', 'Intercompany balance accounts', 'Settlement Amount', 'Analytical Cost Centers'],
    optionalFields: ['Affiliate Contract ID', 'Custom Clearance reference No'],
    validationRules: [
      'Requisite counterpart entry must be posted in sibling ledger to prevent consolidated balancing issues.'
    ],
    autoDebit: 'Intercompany Receivables / Due From Affiliate (Dr 1210)',
    autoCredit: 'Corporate Bank Account (Cr 1112 CBE Bank)',
    workflow: 'Intercompany Accountant ➔ Group Controller Audit ➔ CFO Approved Post',
    approvalRules: 'Requires matching intercompany agreement contracts signed by both representative legal bodies.',
    sampleTxn: 'Dr 1210 Intercompany Receivable (115,000 ETB) | Cr 1112 Bank CBE ETB (115,000 ETB)',
    reversalRules: 'Post offsetting journal balances approved by group accountant desks.',
    postingRules: 'Completed dynamically following month-end intercompany group reconciliations.',
    auditReqs: 'Attach signed cross-corporate inter-entity transfer agreement document.'
  },
  PCV: {
    code: 'PCV',
    name: 'Petty Cash Voucher',
    purpose: 'Disbursements from physical imprest petty cash box and local operational settlements.',
    scenario: 'Paying local office lunch refreshments, purchasing light hardware tools, or courier delivery tips.',
    requiredFields: ['Custodians Box name', 'Payee Cash Receipt', 'Authorized Supervisor', 'Disbursed Amount'],
    optionalFields: ['Cost center mapping', 'Project Reference'],
    validationRules: [
      'Single disbursements must not exceed 5,000 ETB per event.',
      'Must be within the monthly imprest replenishment budget ceiling.'
    ],
    autoDebit: 'Nominated operational expense Account (Dr 5130 Office Supps / Dr 5140 Travel)',
    autoCredit: 'Local Cash Safe / Petty Cash account box (Cr 1111 Petty Cash)',
    workflow: 'Petty cash custodian preparer ➔ Operations Supervisor approve ➔ Immediate Cash Release',
    approvalRules: 'Approved by physical vault custodian. Vault audit count matches monthly reconciliation logs.',
    sampleTxn: 'Dr 5130 Office & Stationery Expenses (300 ETB) | Cr 1111 Petty Cash Local Account (300 ETB)',
    reversalRules: 'Reversed via manual adjustment transaction referencing the original Petty Cash ticket voucher.',
    postingRules: 'Posted instantly on physical vault dispersal matching standard cashier imprest books.',
    auditReqs: 'Requires physical retail or cash receipts with supervisor signature matches scanned onto system vault logs.'
  }
};

import { Account } from '../types';

export interface GeneratedVoucherLine {
  id: string;
  lineNo: number;
  accountCode: string;
  accountName: string;
  description: string;
  entity: string;
  branch: string;
  costCenter: string;
  department: string;
  project: string;
  currency: string;
  exchangeRate: number;
  debit: number;
  credit: number;
  taxCode: string;
  taxAmount: number;
  reference: string;
}

// Fallback account lookups to ensure account validation never crumbles in the UI
export const DEFAULT_GL_ACCOUNTS: Record<string, string> = {
  '1111': 'Petty Cash Local Account',
  '1112': 'Bank deposits - Bank of China / CBE',
  '1113': 'Bank Dashen Account - ETB',
  '1114': 'Bank Awash Account - USD',
  '1120': 'Trade Receivables (A/R)',
  '1130': 'Prepaid Expense Assets',
  '1140': 'VAT Input Tax Asset',
  '1150': 'PDC Clearing Holding Asset',
  '1210': 'Intercompany Due From Affiliate',
  '2110': 'Trade Payables (A/P)',
  '2120': 'VAT Output Tax Liability',
  '2130': 'Withholding Tax (WHT) Payable',
  '2140': 'VAT Settlement Cleared Payable',
  '2210': 'Intercompany Due To Affiliate',
  '4110': 'Sales & Service Revenues',
  '4120': 'Realized Gain on Foreign FX',
  '5110': 'Direct Cost of Sales - Raw Materials',
  '5120': 'Depreciation Expense (Equipment)',
  '5130': 'Office & Stationery Expenses',
  '5131': 'Administrative Expenses - Office Expenses',
  '5132': 'Administrative Expenses - Travel Expenses',
  '5140': 'Travel & Courier Logistics',
  '5141': 'Management Fee - Maintenance Fee',
  '5150': 'Rent & Workspace Amortization',
  '5160': 'Loss on Foreign Exchange Conversion'
};

export function getAccountName(code: string, schemaAccounts: Account[]): string {
  const matched = schemaAccounts.find(a => a.code === code);
  if (matched) return matched.name;
  return DEFAULT_GL_ACCOUNTS[code] || `Account ${code}`;
}

export function generateAccountingLines(params: {
  voucherType: string;
  amount: number;
  payerOrPayee: string;
  accountDr?: string;
  accountCr?: string;
  taxCode: string;
  bankAccount: string;
  cashAccount: string;
  narration: string;
  entity: string;
  branch: string;
  costCenter: string;
  department: string;
  currency: string;
  exchangeRate: number;
  chequeNo?: string;
  originalVoucherRef?: string;
  schemaAccounts: Account[];
}): GeneratedVoucherLine[] {
  const {
    voucherType,
    amount,
    payerOrPayee,
    accountDr,
    accountCr,
    taxCode,
    bankAccount = '1112',
    cashAccount = '1111',
    narration,
    entity,
    branch,
    costCenter,
    department,
    currency,
    exchangeRate,
    chequeNo = '',
    originalVoucherRef = '',
    schemaAccounts
  } = params;

  const lines: GeneratedVoucherLine[] = [];
  const memoText = narration || `Auto-generated ${voucherType} transaction`;
  const amtVal = Math.max(0, Number(amount || 0));

  const makeLineObj = (
    lineNo: number,
    code: string,
    desc: string,
    dr: number,
    cr: number,
    tCode: string = 'Exempt',
    tAmt: number = 0
  ): GeneratedVoucherLine => ({
    id: `g-line-${voucherType}-${lineNo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    lineNo,
    accountCode: code,
    accountName: getAccountName(code, schemaAccounts),
    description: desc,
    entity,
    branch,
    costCenter,
    department,
    project: 'PRJ-MAIN-2026',
    currency,
    exchangeRate,
    debit: Number(dr.toFixed(2)),
    credit: Number(cr.toFixed(2)),
    taxCode: tCode,
    taxAmount: Number(tAmt.toFixed(2)),
    reference: chequeNo || originalVoucherRef || 'SYSTEM-AUTO'
  });

  // Base tax calculations
  const isVAT = taxCode === 'VAT-15';
  const isWHT2 = taxCode === 'WHT-2';
  const isWHT15 = taxCode === 'WHT-15';
  const isVATWHT3 = taxCode === 'VAT-WHT-3';

  let computedTax = 0;
  if (isVAT || isWHT15) computedTax = amtVal * 0.15;
  else if (isWHT2) computedTax = amtVal * 0.02;
  else if (isVATWHT3) computedTax = amtVal * 0.03;

  // Render business double entry according to designated IFRS & Ethiopian configurations
  switch (voucherType) {
    case 'CPV': {
      // Cash payment voucher: Dr Expense Asset, Cr Petty Cash Safe Box
      const expAcc = accountDr || '5130';
      const cashAcc = cashAccount.split(' ')[0] || '1111';
      if (isVAT) {
        // Gross-inclusive mode common to simple petty cash purchases
        const baseExpense = amtVal / 1.15;
        const vatAmt = amtVal - baseExpense;
        lines.push(makeLineObj(1, expAcc, `${memoText} (Excl. VAT) - Payee: ${payerOrPayee}`, baseExpense, 0));
        lines.push(makeLineObj(2, '1140', `VAT Input Tax 15% - Payee: ${payerOrPayee}`, vatAmt, 0, 'VAT-15', vatAmt));
        lines.push(makeLineObj(3, cashAcc, `Cash Settle payment to ${payerOrPayee}`, 0, amtVal));
      } else {
        lines.push(makeLineObj(1, expAcc, `${memoText} - Payee: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, cashAcc, `Cash Settle payment to ${payerOrPayee}`, 0, amtVal));
      }
      break;
    }

    case 'PCV': {
      // Petty Cash voucher: identical to CPV but explicitly marked for imprest cash boxes
      const expAcc = accountDr || '5130';
      const cashAcc = cashAccount.split(' ')[0] || '1111';
      if (isVAT) {
        const baseExpense = amtVal / 1.15;
        const vatAmt = amtVal - baseExpense;
        lines.push(makeLineObj(1, expAcc, `${memoText} (Excl. VAT) - Payee: ${payerOrPayee}`, baseExpense, 0));
        lines.push(makeLineObj(2, '1140', `VAT Input Tax 15% - Payee: ${payerOrPayee}`, vatAmt, 0, 'VAT-15', vatAmt));
        lines.push(makeLineObj(3, cashAcc, `Petty Cash Settle payment to ${payerOrPayee}`, 0, amtVal));
      } else {
        lines.push(makeLineObj(1, expAcc, `${memoText} - Payee: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, cashAcc, `Petty Cash Settle payment to ${payerOrPayee}`, 0, amtVal));
      }
      break;
    }

    case 'CRV': {
      // Cash receipt voucher: Dr cash safe, Cr target revenue or customer subledger
      const targetAcc = accountCr || '4110';
      const cashAcc = cashAccount.split(' ')[0] || '1111';
      lines.push(makeLineObj(1, cashAcc, `Cash Receipt from ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, targetAcc, `${memoText} - Received from ${payerOrPayee}`, 0, amtVal));
      break;
    }

    case 'BPV': {
      // Bank Payment Voucher: Dr Supplier / Expense, Cr Bank. Handle VAT
      const targetAcc = accountDr || '5150';
      const bankAcc = bankAccount.split(' ')[0] || '1112';
      if (isVAT) {
        const baseExpense = amtVal / 1.15;
        const vatAmt = amtVal - baseExpense;
        lines.push(makeLineObj(1, targetAcc, `${memoText} (Excl. VAT) - Payee: ${payerOrPayee}`, baseExpense, 0));
        lines.push(makeLineObj(2, '1140', `VAT Input Tax 15% - Payee: ${payerOrPayee}`, vatAmt, 0, 'VAT-15', vatAmt));
        lines.push(makeLineObj(3, bankAcc, `Bank Transfer Settlement to ${payerOrPayee}`, 0, amtVal));
      } else {
        lines.push(makeLineObj(1, targetAcc, `${memoText} - Paid to ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, bankAcc, `Cheque Release settlement to ${payerOrPayee}`, 0, amtVal));
      }
      break;
    }

    case 'BRV': {
      // Bank Receipt Voucher: Dr Bank, Cr Client sub-ledger or Sales Revenue
      const revenueAcc = accountCr || '1120';
      const bankAcc = bankAccount.split(' ')[0] || '1112';
      lines.push(makeLineObj(1, bankAcc, `Bank Receipt Clearance - Payer: ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, revenueAcc, `${memoText} - Deposited from ${payerOrPayee}`, 0, amtVal));
      break;
    }

    case 'BTV': {
      // Bank Transfer: Dr Destination Bank, Cr Source Bank. Handle small processing fee
      const srcBank = bankAccount.split(' ')[0] || '1112';
      const destBank = accountDr || '1113';
      const chargeAmount = 15; // Set processing fee default
      lines.push(makeLineObj(1, destBank, `Incoming Liquidity Transfer from ${srcBank}`, amtVal, 0));
      lines.push(makeLineObj(2, '5130', `Interbank Treasury processing fee charge`, chargeAmount, 0));
      lines.push(makeLineObj(3, srcBank, `Liquidity transfer to ${destBank} (Incl fee)`, 0, amtVal + chargeAmount));
      break;
    }

    case 'ARI': {
      // Customer Invoice Voucher: Dr Trade Receivables, Cr Sales Revenue + Cr VAT Output Tax
      const revenueAcc = accountCr || '4110';
      if (isVAT) {
        const vatAmt = amtVal * 0.15;
        const totalReceivable = amtVal + vatAmt;
        lines.push(makeLineObj(1, '1120', `Trade Receivables customer book - client: ${payerOrPayee}`, totalReceivable, 0));
        lines.push(makeLineObj(2, revenueAcc, `${memoText} (Sales Balance)`, 0, amtVal));
        lines.push(makeLineObj(3, '2120', `VAT Output Tax liability accrual`, 0, vatAmt, 'VAT-15', vatAmt));
      } else {
        lines.push(makeLineObj(1, '1120', `Trade Receivables customer book - client: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, revenueAcc, `${memoText} (Exempt Sales Revenue)`, 0, amtVal));
      }
      break;
    }

    case 'ARRV': {
      // Accounts Receivable Receipt: Dr Bank/Cash, Cr Customer balance (1120)
      const payChannel = bankAccount.split(' ')[0] || '1112';
      lines.push(makeLineObj(1, payChannel, `Incoming payment matching invoice - client: ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, '1120', `Clearing Customer balance receivable accounts`, 0, amtVal));
      break;
    }

    case 'CNV': {
      // Customer Credit Note: Dr Sales Returns, Dr VAT Output (Liability adjustment), Cr Trade receivables matching
      const returnAcc = accountDr || '4110';
      if (isVAT) {
        const vatOffset = amtVal * 0.15;
        const totalCredit = amtVal + vatOffset;
        lines.push(makeLineObj(1, returnAcc, `Sales Return Allowance - client: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, '2120', `Adjusting VAT Output liability register`, vatOffset, 0, 'VAT-15', vatOffset));
        lines.push(makeLineObj(3, '1120', `Reducing Outstanding Customer receivables balance`, 0, totalCredit));
      } else {
        lines.push(makeLineObj(1, returnAcc, `Sales Return Allowance (Exempt) - client: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, '1120', `Reducing Outstanding Customer receivables balance`, 0, amtVal));
      }
      break;
    }

    case 'DNV': {
      // Customer Debit Note: Dr Receivables (1120), Cr Sales Revenue & VAT Output
      const revenueAcc = accountCr || '4110';
      if (isVAT) {
        const vatAmt = amtVal * 0.15;
        const totalReceivable = amtVal + vatAmt;
        lines.push(makeLineObj(1, '1120', `Debit Note Adjustment - client: ${payerOrPayee}`, totalReceivable, 0));
        lines.push(makeLineObj(2, revenueAcc, `Billing Adjustment Sales Revenues`, 0, amtVal));
        lines.push(makeLineObj(3, '2120', `VAT Output liability adjustments`, 0, vatAmt, 'VAT-15', vatAmt));
      } else {
        lines.push(makeLineObj(1, '1120', `Debit Note Adjustment (Exempt)`, amtVal, 0));
        lines.push(makeLineObj(2, revenueAcc, `Billing adjust exempt revenues`, 0, amtVal));
      }
      break;
    }

    case 'API': {
      // Supplier Invoice Voucher: Dr Purchase/Expense, Dr VAT Input, Cr Trade Payables, Cr WHT Payable
      const expAcc = accountDr || '5110';
      let whtAmount = 0;
      if (isWHT2) whtAmount = amtVal * 0.02;
      else if (isWHT15) whtAmount = amtVal * 0.15;

      if (isVAT) {
        const vatAmt = amtVal * 0.15;
        const payableSupplierValue = amtVal + vatAmt - whtAmount;
        lines.push(makeLineObj(1, expAcc, `${memoText} (Consumables Purchase) - Vendor: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, '1140', `VAT Input tax asset release`, vatAmt, 0, 'VAT-15', vatAmt));
        if (whtAmount > 0) {
          lines.push(makeLineObj(3, '2130', `ERCA Statutory Withholding Tax withheld (Cr)`, 0, whtAmount, taxCode, whtAmount));
        }
        lines.push(makeLineObj(lines.length + 1, '2110', `Trade Payables ledger booking - vendor: ${payerOrPayee}`, 0, payableSupplierValue));
      } else {
        const payableSupplierValue = amtVal - whtAmount;
        lines.push(makeLineObj(1, expAcc, `${memoText} (Exempt purchase) - Vendor: ${payerOrPayee}`, amtVal, 0));
        if (whtAmount > 0) {
          lines.push(makeLineObj(2, '2130', `ERCA Statutory Withholding Tax withheld (Cr)`, 0, whtAmount, taxCode, whtAmount));
        }
        lines.push(makeLineObj(lines.length + 1, '2110', `Trade Payables ledger booking - vendor: ${payerOrPayee}`, 0, payableSupplierValue));
      }
      break;
    }

    case 'APPV': {
      // Settle Supplier balances: Dr Accounts Payable (2110), Cr Banking Outflows
      const settleBank = bankAccount.split(' ')[0] || '1112';
      lines.push(makeLineObj(1, '2110', `Settling Payables Accounts - vendor: ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, settleBank, `Clearance Transfer Cash Payment Outflow`, 0, amtVal));
      break;
    }

    case 'ADV': {
      // Advances pre-balancing: Dr Advance Asset, Cr Bank / Dr Bank, Cr Advance Liability
      const holdingBank = bankAccount.split(' ')[0] || '1112';
      if (payerOrPayee.toLowerCase().includes('supplier') || accountDr === '1130') {
        lines.push(makeLineObj(1, '1130', `Security Prepaid Advances Asset - recipient: ${payerOrPayee}`, amtVal, 0));
        lines.push(makeLineObj(2, holdingBank, `Upfront advance deposit bank release`, 0, amtVal));
      } else {
        lines.push(makeLineObj(1, holdingBank, `Received customeradvance security payment`, amtVal, 0));
        lines.push(makeLineObj(2, '2210', `Customer advances deposit holding liability`, 0, amtVal));
      }
      break;
    }

    case 'PPV': {
      // Prepayments amort: Dr Prepaids (1130), Cr Bank checking
      const holdingBank = bankAccount.split(' ')[0] || '1112';
      lines.push(makeLineObj(1, '1130', ` IFSR Prepaid deferred expense asset - provider: ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, holdingBank, `Prepayment out payment clearance`, 0, amtVal));
      break;
    }

    case 'CHQV': {
      // Cheques ledger clearing: Dr Bank (1112), Cr in-transit checks clearing account (1150)
      const clearBank = bankAccount.split(' ')[0] || '1112';
      lines.push(makeLineObj(1, clearBank, `Deposited customer cheque clearing balance`, amtVal, 0));
      lines.push(makeLineObj(2, '1150', `Clearing collected physical cheques in transit`, 0, amtVal));
      break;
    }

    case 'PDCV': {
      // Post-dated checks ledger holding: Dr PDC Asset (1150), Cr Customer Receivables (1120)
      lines.push(makeLineObj(1, '1150', `Post Dated Cheque custody ledger asset - drawer: ${payerOrPayee}`, amtVal, 0));
      lines.push(makeLineObj(2, '1120', `Deduct Customer outstanding balances temporarily`, 0, amtVal));
      break;
    }

    case 'VATV': {
      // Monthly VAT clearing: Dr VAT Output Liability (2120), Cr VAT Input Asset (1140). Diff to Payable
      const outputVATSum = amtVal;
      const inputVATSum = Math.min(amtVal, Math.floor(amtVal * 0.6)); // simulated input matching
      const netVATPayable = outputVATSum - inputVATSum;
      lines.push(makeLineObj(1, '2120', `Clearing accrued VAT Output Tax Liability`, outputVATSum, 0));
      lines.push(makeLineObj(2, '1140', `offset accrued VAT Input Tax Assets`, 0, inputVATSum));
      lines.push(makeLineObj(3, '2140', `ERCA VAT net payable balance tax settlement`, 0, netVATPayable));
      break;
    }

    case 'WHTV': {
      // Withholding tax direct booking: Dr AP (2110), Cr WHT liability (2130)
      const whtDr = amtVal;
      lines.push(makeLineObj(1, '2110', `Deducting Withholding tax from vendor obligation: ${payerOrPayee}`, whtDr, 0));
      lines.push(makeLineObj(2, '2130', `Statutory ERCA WHT Payable liability booking`, 0, whtDr));
      break;
    }

    case 'FXV': {
      // FX Revaluations: Dr USD Asset (1114), Cr FX Gain Revenue (4120) or vice versa
      const rawGain = Number(amount) || 2300;
      if (rawGain >= 0) {
        lines.push(makeLineObj(1, '1114', `Exchange Revaluation USD Foreign reserve increment`, rawGain, 0));
        lines.push(makeLineObj(2, '4120', `Unrealized Gain on Currency translation`, 0, rawGain));
      } else {
        const absLoss = Math.abs(rawGain);
        lines.push(makeLineObj(1, '5160', `Unrealized Loss on Currency translations`, absLoss, 0));
        lines.push(makeLineObj(2, '1114', `Exchange Revaluation USD bank decrease`, 0, absLoss));
      }
      break;
    }

    case 'ALV': {
      // Corporate allocations: Dr regional offices, Cr Main consolidated center
      const deptAmt = amtVal / 2;
      lines.push(makeLineObj(1, '5130', `Rent Allocation portion - Bole Branch`, deptAmt, 0));
      lines.push(makeLineObj(2, '5130', `Rent Allocation portion - Factory Branch`, deptAmt, 0));
      lines.push(makeLineObj(3, '5150', `Rent adjustment contra corporate clearing`, 0, amtVal));
      break;
    }

    case 'RCV': {
      // Reversal contra generator: Swaps debit and credit lines of original
      const sampleAmt = amtVal || 5000;
      lines.push(makeLineObj(1, '1111', `Reversing contra Debit entry - Doc ${originalVoucherRef}`, sampleAmt, 0));
      lines.push(makeLineObj(2, '5130', `Reversing contra Credit entry - Doc ${originalVoucherRef}`, 0, sampleAmt));
      break;
    }

    case 'ICV': {
      // Intercompany settlement: Dr Intercompany receivables (1210), Cr Cash Box (1111)
      lines.push(makeLineObj(1, '1210', `Intercompany Due From Affiliate - MS-KE-02`, amtVal, 0));
      lines.push(makeLineObj(2, '1111', `Liquidity release clearing intercompany costs`, 0, amtVal));
      break;
    }

    default: {
      // JV/AJV manual modes default placeholder rows
      lines.push(makeLineObj(1, accountDr || '5130', `${memoText} (Debit)`, amtVal, 0));
      lines.push(makeLineObj(2, accountCr || '1111', `${memoText} (Credit)`, 0, amtVal));
      break;
    }
  }

  return lines;
}

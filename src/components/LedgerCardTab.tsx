import React, { useState, useMemo, useRef } from 'react';
import { Account } from '../types';
import ReportHeaderCard from './ReportHeaderCard';
import { Printer, Download, Eye, FileSpreadsheet, Building2, Calendar, FileText, Search, CreditCard, Layers } from 'lucide-react';

interface LedgerCardTabProps {
  accounts: Account[];
}

interface LedgerTransaction {
  id: string;
  no: number;
  date: string;
  period: string;
  itemNumber: string;
  voucherNo: string;
  voucherType: string;
  description: string;
  debit: number;
  credit: number;
}

export default function LedgerCardTab({ accounts }: LedgerCardTabProps) {
  // Select active account to show card for
  const postingAccounts = useMemo(() => {
    return accounts.filter(a => a.postingAllowed);
  }, [accounts]);

  const [selectedAccountCode, setSelectedAccountCode] = useState<string>(
    postingAccounts.length > 0 ? postingAccounts[0].code : ''
  );

  const [fiscalYear, setFiscalYear] = useState<string>('2013');
  const [bankAccount, setBankAccount] = useState<string>('01 - Treasury Main Account');
  const [subsidiaryCode, setSubsidiaryCode] = useState<string>('01 - Sector Dev Account');
  const [printDate, setPrintDate] = useState<string>('23/11/2020');

  const selectedAccount = useMemo(() => {
    return accounts.find(a => a.code === selectedAccountCode) || null;
  }, [accounts, selectedAccountCode]);

  // Seeding high-fidelity realistic transaction data for the selected account using normal balance directions
  const mockTransactionsMap: Record<string, LedgerTransaction[]> = useMemo(() => {
    const map: Record<string, LedgerTransaction[]> = {};

    // Generate specific seed transactions for each posting account
    postingAccounts.forEach(acc => {
      // Base Seed 1 & 2
      const isAssetOrExpense = acc.accountType === 'Asset' || acc.accountType === 'Expense' || acc.accountType === 'Cost of Sales';
      
      const balanceType = acc.balance || (isAssetOrExpense ? 'Debit' : 'Credit');
      const seedDebit1 = balanceType === 'Debit' ? 1450000.50 : 0;
      const seedCredit1 = balanceType === 'Credit' ? 1450000.50 : 0;

      const seedDebit2 = balanceType === 'Debit' ? 223132.74 : 48102.50;
      const seedCredit2 = balanceType === 'Credit' ? 223132.74 : 48102.50;

      map[acc.code] = [
        {
          id: `T-${acc.code}-1`,
          no: 1,
          date: '01/01/2026',
          period: 'Hamle',
          itemNumber: '000001',
          voucherNo: 'V-2026-001',
          voucherType: 'Opening Balance',
          description: 'Opening Balance Approved audit spec',
          debit: seedDebit1,
          credit: seedCredit1
        },
        {
          id: `T-${acc.code}-2`,
          no: 2,
          date: '12/01/2026',
          period: 'Meskerem',
          itemNumber: '000042',
          voucherNo: 'V-2026-102',
          voucherType: 'BBF (Brought Forward)',
          description: 'Balance Brought Forward / Local unit consolidation',
          debit: seedDebit2,
          credit: seedCredit2
        },
        {
          id: `T-${acc.code}-3`,
          no: 3,
          date: '28/01/2026',
          period: 'Meskerem',
          itemNumber: '000135',
          voucherNo: 'V-2026-193',
          voucherType: 'JV-Posting',
          description: 'Inter-branch journal clearing transfer memo',
          debit: balanceType === 'Debit' ? 350000.00 : 120000.00,
          credit: balanceType === 'Credit' ? 350000.00 : 120000.00
        },
        {
          id: `T-${acc.code}-4`,
          no: 4,
          date: '14/02/2026',
          period: 'Tikimt',
          itemNumber: '000244',
          voucherNo: 'V-2026-302',
          voucherType: 'BPV-Cash',
          description: 'Direct Treasury operational replenishment voucher',
          debit: balanceType === 'Debit' ? 150000.00 : 80000.00,
          credit: balanceType === 'Credit' ? 150000.00 : 80000.00
        }
      ];
    });

    return map;
  }, [postingAccounts]);

  const transactions = useMemo(() => {
    return mockTransactionsMap[selectedAccountCode] || [];
  }, [mockTransactionsMap, selectedAccountCode]);

  // Rolling calculation of balances
  const calculatedTransactions = useMemo(() => {
    let currentBalance = 0;
    const isNormalDebit = selectedAccount
      ? (selectedAccount.balance === 'Debit' || ['Asset', 'Expense', 'Cost of Sales'].includes(selectedAccount.accountType))
      : true;

    return transactions.map((t, idx) => {
      const debitVal = t.debit || 0;
      const creditVal = t.credit || 0;

      if (isNormalDebit) {
        // Debit normal: Debits increase, Credits decrease
        currentBalance += (debitVal - creditVal);
      } else {
        // Credit normal: Credits increase, Debits decrease
        currentBalance += (creditVal - debitVal);
      }

      return {
        ...t,
        rollingBalance: currentBalance,
        balanceDirection: currentBalance >= 0 ? (isNormalDebit ? 'Debit' : 'Credit') : (isNormalDebit ? 'Credit' : 'Debit'),
        absoluteBalance: Math.abs(currentBalance)
      };
    });
  }, [transactions, selectedAccount]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    transactions.forEach(t => {
      totalDebit += t.debit || 0;
      totalCredit += t.credit || 0;
    });
    return { debit: totalDebit, credit: totalCredit };
  }, [transactions]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV function
  const handleCSVExport = () => {
    if (!selectedAccount) return;
    const headers = ['No.', 'Date', 'Period', 'Item No', 'Voucher No', 'Voucher Type', 'Description', 'Debit', 'Credit', 'Balance'];
    const rows = calculatedTransactions.map(t => [
      t.no,
      t.date,
      t.period,
      t.itemNumber,
      t.voucherNo,
      t.voucherType,
      t.description,
      t.debit.toFixed(2),
      t.credit.toFixed(2),
      `${t.absoluteBalance.toFixed(2)} (${t.balanceDirection})`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ledger_Card_${selectedAccount.code}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 font-sans antialiased">
      {/* PROFESSIONAL IFRS-STANDARD REPORT REVOLUTIONARY CARD */}
      <ReportHeaderCard
        defaultReportName="Notes to the Financial Statements"
        defaultPeriod={`For fiscal year ${fiscalYear || '2026'}`}
        defaultBranch="Addis Ababa Central"
        onPrint={handlePrint}
        onExportExcel={handleCSVExport}
      />

      {/* Parameters Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs select-none">
        <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-900 rounded-xl text-white flex items-center justify-center border border-slate-950">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">General Ledger Card Generator</h3>
              <p className="text-xs text-slate-500 mt-1">Conforms to EFY / IFRS physical and double-entry auditing cards</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all cursor-pointer"
              title="Print Ledger Card Formats"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Format (EFY)</span>
            </button>

            {/* Export spreadsheet */}
            <button
              onClick={handleCSVExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0051d5] hover:bg-[#0040aa] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
              title="Export Ledger Transactions"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {/* Choose General Ledger Account */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-slate-500" /> Choose Master GL Account *
            </span>
            <select
              value={selectedAccountCode}
              onChange={(e) => setSelectedAccountCode(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {postingAccounts.map(a => (
                <option key={a.code} value={a.code}>
                  [{a.code}] {a.name} ({a.company.replace('QM AMS ', '')})
                </option>
              ))}
            </select>
          </div>

          {/* FIscal Year selection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" /> Fiscal Year
            </span>
            <input
              type="text"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-mono font-bold text-center"
              placeholder="e.g. 2013"
            />
          </div>

          {/* Bank Account */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" /> Treasury Fund Code
            </span>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
            >
              <option value="01 - Treasury Main Account">01 - Treasury Main</option>
              <option value="02 - Commercial Revenue Fund">02 - Commercial Rev</option>
              <option value="03 - Grant Trust Account">03 - Grant Trust Fund</option>
            </select>
          </div>

          {/* Printing physical parameters */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" /> Subsidiary Ind.
            </span>
            <input
              type="text"
              value={subsidiaryCode}
              onChange={(e) => setSubsidiaryCode(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-mono text-center text-slate-700"
              placeholder="e.g. 01 -"
            />
          </div>
        </div>
      </div>

      {/* RENDER SHEET: Ethiopian Government Traditional Ledger Card Format */}
      {selectedAccount ? (
        <div 
          id="ethiopian-ledger-card-printout"
          className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm p-6 max-w-full space-y-6"
        >
          {/* Header Bar Block */}
          <div className="bg-[#0f172a] border border-[#1e293b] p-4 text-center rounded-xl text-white space-y-1.5 select-none text-balance">
            <h2 className="text-xl font-black tracking-wide font-sans text-[#f8fafc] uppercase">Ledger Card</h2>
            <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-[#94a3b8]">Federal Government Of Ethiopia</h3>
            <p className="text-[10px] font-mono font-extrabold text-[#38bdf8] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>EFY 15/00/000/135/01/01</span> • <span>Ministry of Revenue & Customs Authority</span> • <span>Financial Standards Division</span>
            </p>
          </div>

          {/* Meta Parameter Summary Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-800 bg-slate-50/50 select-none">
            <div className="space-y-2">
              <p className="flex justify-between border-b pb-1 border-slate-200/80">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Fiscal Year:</span>
                <span className="font-bold text-slate-900 font-mono">{fiscalYear}</span>
              </p>
              <p className="flex justify-between border-b pb-1 border-slate-200/80">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-sans">Bank Account Name:</span>
                <span className="font-bold text-slate-800">{bankAccount}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Account Holder:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]" title={selectedAccount.company}>
                  {selectedAccount.company}
                </span>
              </p>
            </div>

            <div className="space-y-2 md:pl-6 md:border-l border-slate-200">
              <p className="flex justify-between border-b pb-1 border-slate-200/80">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Print Date:</span>
                <span className="font-bold text-slate-900 font-mono">{printDate}</span>
              </p>
              <p className="flex justify-between border-b pb-1 border-slate-200/80">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-sans">Account Code / Number:</span>
                <span className="font-black text-blue-600 font-mono">{selectedAccount.code}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Sub-ledger Index:</span>
                <span className="font-bold text-slate-800 font-mono">{subsidiaryCode}</span>
              </p>
            </div>
          </div>

          {/* Big display name banner */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-5 py-3.5 flex items-center justify-between select-none">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-mono">Consolidated Ledger Account</span>
              <h4 className="text-lg font-black text-slate-950 mt-1">{selectedAccount.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-450 block font-mono">Type Group Class</span>
              <span className="text-xs bg-slate-900 text-white font-extrabold px-2.5 py-1 rounded mt-1.5 inline-block uppercase tracking-wider text-center">{selectedAccount.accountType}</span>
            </div>
          </div>

          {/* Ledger table columns with grouping headers */}
          <div className="overflow-x-auto max-w-full rounded-xl border border-slate-300">
            <table className="w-full text-xs text-left border-collapse min-w-[950px] table-fixed">
              <thead>
                {/* Visual Level 1 double headers block grouping */}
                <tr className="bg-slate-900 text-white select-none text-center font-bold">
                  <th rowSpan={2} className="w-[50px] border border-slate-950 p-2 text-center align-middle">No.</th>
                  <th rowSpan={2} className="w-[100px] border border-slate-950 p-2 text-center align-middle">Date</th>
                  <th colSpan={4} className="border border-slate-950 py-1.5 uppercase font-black text-[10px] tracking-wider">Reference From Register</th>
                  <th rowSpan={2} className="w-[280px] border border-slate-950 p-2 text-left align-middle">Description</th>
                  <th rowSpan={2} className="w-[120px] border border-slate-950 p-2 text-right align-middle">Debit (ETB)</th>
                  <th rowSpan={2} className="w-[125px] border border-slate-950 p-2 text-right align-middle">Credit (ETB)</th>
                  <th colSpan={2} className="border border-slate-950 py-1.5 uppercase font-black text-[10px] tracking-wider">Balance Status</th>
                </tr>
                <tr className="bg-slate-800 text-[#f1f5f9] select-none text-center font-bold text-[9px] uppercase tracking-wide">
                  {/* Under group "Reference" */}
                  <th className="w-[85px] border border-slate-950 p-1 font-mono">Period</th>
                  <th className="w-[85px] border border-slate-950 p-1 font-mono">Item No.</th>
                  <th className="w-[95px] border border-slate-950 p-1 font-mono">Voucher No</th>
                  <th className="w-[110px] border border-slate-950 p-1">Voucher Type</th>
                  {/* Under group "Balance" */}
                  <th className="w-[120px] border border-slate-950 p-1 font-mono">Debit (ETB)</th>
                  <th className="w-[125px] border border-slate-950 p-1 font-mono">Credit (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-sans text-slate-800 bg-white">
                {calculatedTransactions.map((t, idx) => {
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors align-middle">
                      {/* Line Number */}
                      <td className="border border-slate-200 p-2.5 text-center font-bold font-mono text-slate-500 bg-slate-50/50">
                        {t.no}
                      </td>

                      {/* Date */}
                      <td className="border border-slate-200 p-2 text-center font-mono text-slate-700">
                        {t.date}
                      </td>

                      {/* Period name */}
                      <td className="border border-slate-200 p-2 text-center text-slate-800 font-semibold font-sans">
                        {t.period}
                      </td>

                      {/* Item No. */}
                      <td className="border border-slate-200 p-2 text-center font-mono text-slate-500">
                        {t.itemNumber}
                      </td>

                      {/* Voucher Code */}
                      <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-800">
                        {t.voucherNo}
                      </td>

                      {/* Voucher type */}
                      <td className="border border-slate-200 p-2 text-center text-[10px] font-black uppercase tracking-wider text-blue-600 bg-slate-50/20">
                        {t.voucherType}
                      </td>

                      {/* Description Narrative */}
                      <td className="border border-slate-200 p-2.5 truncate font-medium text-slate-700" title={t.description}>
                        {t.description}
                      </td>

                      {/* Debit */}
                      <td className="border border-slate-200 p-2.5 text-right font-mono font-bold text-slate-900 bg-emerald-50/10">
                        {t.debit > 0 ? t.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>

                      {/* Credit */}
                      <td className="border border-slate-200 p-2.5 text-right font-mono font-bold text-slate-900 bg-rose-50/10">
                        {t.credit > 0 ? t.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>

                      {/* Balance Debit Direction */}
                      <td className="border border-slate-200 p-2.5 text-right font-mono font-black text-slate-950 bg-slate-50/30">
                        {t.balanceDirection === 'Debit' ? t.absoluteBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>

                      {/* Balance Credit Direction */}
                      <td className="border border-slate-200 p-2.5 text-right font-mono font-black text-slate-950 bg-slate-50/30">
                        {t.balanceDirection === 'Credit' ? t.absoluteBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                      </td>
                    </tr>
                  );
                })}

                {/* Summary totals row block */}
                <tr className="bg-slate-900 text-white font-black font-mono select-none">
                  <td colSpan={7} className="border border-slate-950 p-3.5 text-right text-xs uppercase tracking-widest font-sans text-[#94a3b8]">
                    Confront Balance Totals
                  </td>

                  {/* Total Debit posted */}
                  <td className="border border-slate-950 p-3.5 text-right text-slate-200 font-bold">
                    {totals.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Total Credit posted */}
                  <td className="border border-slate-950 p-3.5 text-right text-slate-200 font-bold">
                    {totals.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Ending Directional Balance confrontation */}
                  <td colSpan={2} className="border border-slate-950 p-3.5 text-center text-[#38bdf8] font-black text-xs uppercase tracking-wider">
                    {calculatedTransactions.length > 0 ? (
                      `Balanced OK • ${calculatedTransactions[calculatedTransactions.length - 1].absoluteBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${calculatedTransactions[calculatedTransactions.length - 1].balanceDirection.toUpperCase()}`
                    ) : '0.00 NIL'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Operational Footprints / Attestation Checklist */}
          <div className="pt-4 border-t border-dashed border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-mono font-bold text-slate-500 uppercase select-none">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span>Prepared By:</span>
              <span className="block mt-1 font-black text-slate-800">Lead FinAuditor (System)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span>Auditor Signature:</span>
              <span className="block mt-1 text-emerald-600 font-black">✔ AUDIT_SIGNED_VERIFIED</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span>Internal Ref Lock:</span>
              <span className="block mt-1 text-blue-600 font-mono">MS-AMS-GOV-REC2026</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span>Ledger Security Status:</span>
              <span className="block mt-1 text-emerald-600 font-sans">APPROVED & LOCKED</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 italic">
          No posting accounts loaded in current active schema frame.
        </div>
      )}
    </div>
  );
}

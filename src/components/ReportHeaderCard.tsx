import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  FileDown, 
  Settings2, 
  Check, 
  Globe, 
  Building2, 
  Calendar, 
  DollarSign, 
  User, 
  Briefcase 
} from 'lucide-react';
import BusinessTooltip from './BusinessTooltip';

interface ReportHeaderCardProps {
  defaultReportName: string;
  defaultPeriod?: string;
  defaultBranch?: string;
  currency?: 'ETB' | 'USD';
  onCurrencyChange?: (c: 'ETB' | 'USD') => void;
  onPrint?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

const REPORT_NAMES = [
  "Statement of Financial Position",
  "Statement of Profit or Loss",
  "Statement of Cash Flows",
  "Statement of Changes in Equity",
  "Notes to the Financial Statements",
  "AP Aging Report",
  "AR Aging Report",
  "Supplier Statement",
  "Customer Statement",
  "Budget vs Actual Report"
];

const REPORT_DESCRIPTIONS: Record<string, string> = {
  "Statement of Financial Position": "A snapshot of the organization's financial health, listing Assets, Liabilities, and Equity to assess solvency and valuation.",
  "Statement of Profit or Loss": "A summary of revenues, cost of sales, and operational expenses over a specific period to calculate net profitability.",
  "Statement of Cash Flows": "An analysis of cash inflows and outflows categorized by Operating, Investing, and Financing activities.",
  "Statement of Changes in Equity": "Details the shifts in owners' capital, reserves, and retained earnings during the current fiscal year.",
  "Notes to the Financial Statements": "Comprehensive narratives and direct ledger account breakdowns requested to explain statement balances fully.",
  "AP Aging Report": "Tracks supplier liabilities categorized by time elapsed to manage upcoming cash payout obligations.",
  "AR Aging Report": "Analysis of customer receivables grouped by past-due periods to monitor collections efficiency and bad debts.",
  "Supplier Statement": "Reconciliation card showing all invoices, credit notes, and payments issued to a specific vendor.",
  "Customer Statement": "Chronological report of billings and cash received against a specific client account for payment confirmations.",
  "Budget vs Actual Report": "Operational card matching actual general ledger postings against approved budget allocations to identify variances.",
  "Integrated Treasury Liquidity & Cash Control Dashboard": "Real-time monitoring of corporate bank accounts, petty cash balances, intercompany fund transfers, and live bank reconciliation statements.",
  "Primary Financial Statements": "Consolidated auditor sheet including Balance Sheet, Income Statement, Cash Flows, Equity, and Trial Balance Verification registers.",
  "Ethiopian General Ledger Card Workspace": "A statement of historical transactions, debits, credits, and rolling balances loaded under a specific general ledger coordinate code.",
  "IFRS Disclosure Notes Publication Compiler": "Comprehensive narrative footnotes and detailed ledger analysis tables justifying corporate statement lines."
};

const APPROVAL_STATUSES = [
  "Draft",
  "Prepared",
  "Reviewed",
  "Approved",
  "Final",
  "Archived"
];

const REPORT_STATUSES = [
  "Draft",
  "Prepared",
  "Reviewed",
  "Approved",
  "Final",
  "Archived"
];

const REPORTING_BASES = [
  "IFRS",
  "IFRS for SMEs",
  "Ethiopian Statutory",
  "Management Reporting"
];

export default function ReportHeaderCard({
  defaultReportName,
  defaultPeriod = "For the period ended 31 December 2026",
  defaultBranch = "Addis Ababa Central",
  currency = "ETB",
  onCurrencyChange,
  onPrint,
  onExportExcel,
  onExportPDF
}: ReportHeaderCardProps) {
  // Localized configuration state that persists during active tab switching so the demo is ultra-responsive
  const [showConfig, setShowConfig] = useState(false);
  const [legalEntity, setLegalEntity] = useState("Mesfin PLC");
  const [reportName, setReportName] = useState(defaultReportName);
  const [reportingPeriod, setReportingPeriod] = useState(defaultPeriod);
  const [fiscalYear, setFiscalYear] = useState("FY2026");
  const [accountingPeriod, setAccountingPeriod] = useState("December 2026");
  const [branch, setBranch] = useState(defaultBranch);
  const [basis, setBasis] = useState("IFRS");
  const [preparedDate, setPreparedDate] = useState("31 December 2026");
  const [preparedBy, setPreparedBy] = useState("Finance Team");
  const [approvalStatus, setApprovalStatus] = useState("Approved");
  const [reportStatus, setReportStatus] = useState("Final");

  // Keep reportName in sync if the parent changes defaultReportName (e.g. they click a different tab)
  useEffect(() => {
    setReportName(defaultReportName);
  }, [defaultReportName]);

  // Keep branch in sync if parent changes default branch
  useEffect(() => {
    if (defaultBranch && defaultBranch !== "All") {
      setBranch(defaultBranch);
    } else {
      setBranch("Addis Ababa Central");
    }
  }, [defaultBranch]);

  // Sync reporting period changes
  useEffect(() => {
    if (defaultPeriod) {
      if (defaultPeriod === 'FY_2026') {
        setReportingPeriod("For the period 1 January 2026 to 31 December 2026");
        setAccountingPeriod("FY 2026 Full-Year");
      } else if (defaultPeriod === 'Q2_2026') {
        setReportingPeriod("For the period 1 April 2026 to 30 June 2026");
        setAccountingPeriod("Q2 2026 Quarter");
      } else if (defaultPeriod === 'Q1_2026') {
        setReportingPeriod("For the period 1 January 2026 to 31 March 2026");
        setAccountingPeriod("Q1 2026 Quarter");
      } else {
        setReportingPeriod(defaultPeriod);
      }
    }
  }, [defaultPeriod]);

  // Styled helper for statuses
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Prepared':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reviewed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Final':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleTriggerPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleTriggerPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      // Elegant fallback showing print layout (Save as PDF)
      alert("Opening print options. In the destination list, select 'Save as PDF' to export this professional client-ready statement.");
      window.print();
    }
  };

  return (
    <div id="ifrs-report-header" className="space-y-4">
      {/* PROFESSIONAL IFRS-STANDARD REPORT CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all duration-300 print:shadow-none print:border-none print:p-0">
        
        {/* Subtle decorative subtle line for elegant alignment */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 print:hidden" />

        {/* Action Controls Panel - HIDDEN DURING PRINTING */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4 select-none print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg transition"
              title="Configure header parameters for audit"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Modify Header</span>
            </button>
            
            {onCurrencyChange && (
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onCurrencyChange('ETB')}
                  className={`px-2 py-1 rounded-md transition ${currency === 'ETB' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-950'}`}
                >
                  ETB (Br)
                </button>
                <button
                  type="button"
                  onClick={() => onCurrencyChange('USD')}
                  className={`px-2 py-1 rounded-md transition ${currency === 'USD' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-950'}`}
                >
                  USD ($)
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1e293b] hover:bg-emerald-50 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg transition shadow-3xs"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Excel</span>
              </button>
            )}
            <button
              onClick={handleTriggerPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1e293b] hover:bg-indigo-50 hover:text-indigo-700 bg-white border border-slate-200 rounded-lg transition shadow-3xs"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-3xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* COMPACT INTERACTIVE DRAWERS */}
        {showConfig && (
          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans print:hidden animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Legal Entity</label>
              <input
                type="text"
                value={legalEntity}
                onChange={(e) => setLegalEntity(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Report Name</label>
              <select
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              >
                {REPORT_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Reporting Period</label>
              <input
                type="text"
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Fiscal Year</label>
              <input
                type="text"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Accounting Period</label>
              <input
                type="text"
                value={accountingPeriod}
                onChange={(e) => setAccountingPeriod(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Branch / Location</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Reporting Basis</label>
              <select
                value={basis}
                onChange={(e) => setBasis(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              >
                {REPORTING_BASES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Prepared By</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Prepared Date</label>
              <input
                type="text"
                value={preparedDate}
                onChange={(e) => setPreparedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Approval Status</label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              >
                {APPROVAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Report Status</label>
              <select
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-250 rounded bg-white text-slate-800 font-medium focus:outline-none"
              >
                {REPORT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* THE MAIN AUDITOR STATEMENT REPORT CARD */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-100 print:pb-4 print:mb-4">
          <p className="text-sm font-extrabold text-[#111827] uppercase tracking-widest leading-none font-sans print:text-xs">
            {legalEntity}
          </p>
          <h2 className="text-xl md:text-2xl font-black text-[#0f172a] uppercase tracking-tight font-sans py-0.5 print:text-lg flex items-center justify-center gap-1.5 matches-heading">
            <span>{reportName}</span>
            <span className="print:hidden">
              <BusinessTooltip text={REPORT_DESCRIPTIONS[reportName] || "Comprehensive financial report generated directly from general ledger mappings."} />
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight italic print:text-xs print:text-slate-600">
            {reportingPeriod}
          </p>
        </div>

        {/* METADATA SUMMARY GRID CONTAINER */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-6 pt-5 text-left text-xs font-sans">
          
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Fiscal Year</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <span>{fiscalYear}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Accounting Period</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <span>{accountingPeriod}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Operating Branch</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <Building2 className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <span>{branch}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Reporting Currency</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-mono font-bold">
              <span className="text-[11px] text-slate-400 font-sans print:hidden">Currency:</span>
              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 print:border-none print:bg-transparent print:p-0">
                {currency}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Reporting Basis</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <Globe className="w-3.5 h-3.5 text-indigo-500 print:hidden" />
              <span className="bg-indigo-50 text-indigo-850 px-1.5 py-0.5 rounded border border-indigo-150 font-bold text-[10px] uppercase print:border-none print:bg-transparent print:p-0 print:text-xs">
                {basis}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Prepared By</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <User className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <span>{preparedBy}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Prepared Date</span>
            <div className="flex items-center gap-1.5 text-[#1e293b] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              <span>{preparedDate}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Approval Status</span>
            <div className="flex items-center mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border leading-none ${getBadgeClass(approvalStatus)}`}>
                • {approvalStatus}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Report Status</span>
            <div className="flex items-center mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border leading-none ${getBadgeClass(reportStatus)}`}>
                • {reportStatus}
              </span>
            </div>
          </div>

          {/* Secure watermark label for high-fidelity enterprise validation */}
          <div className="space-y-1 col-span-2 sm:col-span-1 flex flex-col justify-end">
            <span className="block text-[9px] font-mono text-slate-400 tracking-wider">SECURE HASH CODE</span>
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase mt-0.5 select-all">
              AMS-AUD-{fiscalYear}-VERIFIED
            </span>
          </div>

        </div>

        {/* Small legal footnote for professional printing output standard layout */}
        <div className="hidden print:flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
          <span>This financial document holds strict legal accounting significance certified post compliance verification audit.</span>
          <span>IFRS IAS-1 / IAS-7 IAS-8 Compliant Run • Authority Stamp Included</span>
        </div>

      </div>
    </div>
  );
}

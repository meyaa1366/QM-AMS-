import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Percent, 
  Boxes, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  Upload, 
  History, 
  Search, 
  Play, 
  Download, 
  CheckCircle,
  HelpCircle,
  Info,
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  Account, 
  SLMapping, 
  PostingControlRule, 
  DetailedRule, 
  DetailedApiSpec, 
  ImportField, 
  AuditLogEntry 
} from '../types';
import { 
  IFRS_CLASSES, 
  FINANCIAL_STATEMENT_LINES, 
  ETHIOPIAN_TAX_CATEGORIES,
  SL_MAPPINGS,
  POSTING_CONTROL_RULES,
  DETAILED_RULES,
  DETAILED_API_SPECS,
  IMPORT_TEMPLATE_FIELDS,
  INITIAL_AUDIT_LOGS
} from '../data';

// ==========================================
// 6. IFRS CLASSIFICATION TAB
// ==========================================
export function IFRSClassificationTab() {
  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center gap-3">
        <BookOpen className="w-10 h-10 text-primary shrink-0" />
        <div>
          <h4 className="font-sans font-extrabold text-title-md text-slate-950">IFRS Taxonomy Standards Map</h4>
          <p className="text-body-xs text-outline mt-0.5">Disclosures and line classifications mandatory under standard IAS 1 regulations</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-label-xs font-bold uppercase text-outline border-b">
              <th className="px-5 py-3 font-sans w-[280px]">Standard Reference</th>
              <th className="px-5 py-3 font-sans">Mandated Disclosures & Segmentations</th>
              <th className="px-5 py-3 font-sans w-[220px]">Financial Statement Line</th>
            </tr>
          </thead>
          <tbody className="divide-y text-body-sm text-slate-800 font-sans">
            {IFRS_CLASSES.map((cls, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-5 py-3 font-bold text-primary text-xs">{cls}</td>
                <td className="px-5 py-3 text-xs leading-relaxed text-slate-600 font-medium">
                  Enforces strict separation of operating segments and current vs non-current holdings lines. All ledger child mappings must roll up to direct presentation slots.
                </td>
                <td className="px-5 py-3 text-xs text-on-surface-variant font-medium">
                  {FINANCIAL_STATEMENT_LINES[idx % FINANCIAL_STATEMENT_LINES.length]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 7. ETHIOPIAN TAX MAPPING TAB
// ==========================================
export function EthiopianTaxTab() {
  const taxRules = [
    { cat: 'Category A - Large Taxpayer (>ETB 1M)', rate: '30% Corporate Tax', type: 'VAT Standard Output (15%)', desc: 'Required monthly computerized filing of transaction books (ERCA compliant).' },
    { cat: 'Category B - Medium Taxpayer (ETB 500k-1M)', rate: '30% Corporate Tax', type: 'VAT Standard Input (15%)', desc: 'Manual or electronic bookkeeping subject to biannual regional ERCA audit.' },
    { cat: 'Category C - Small Taxpayer (<ETB 500k)', rate: 'Lump-sum estimation formulas', type: 'Exempt', desc: 'Based on micro-business indicators and asset values.' },
    { cat: 'WHT Liability on Services Rendered', rate: '2.0% deduction', type: 'Withholding WHT', desc: 'Required deduction on purchases of services exceeding ETB 10,000 from local businesses.' },
    { cat: 'WHT Liability on Rent of Premises', rate: '5.0% deduction', type: 'Withholding WHT', desc: 'Required deduction on corporate rent payments exceeding ETB 10,000, filed monthly.' }
  ];

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center gap-3">
        <Percent className="w-10 h-10 text-amber-600 shrink-0" />
        <div>
          <h4 className="font-sans font-extrabold text-title-md text-slate-950">Ethiopian Tax Mapping Ledger</h4>
          <p className="text-body-xs text-outline mt-0.5">Compliancy guidelines matching Ethiopian Revenue Customs Authority (ERCA) legal mandates</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-label-xs font-bold uppercase text-outline border-b">
              <th className="px-5 py-3 font-sans">Compliance Category</th>
              <th className="px-5 py-3 font-sans">Tax Rate</th>
              <th className="px-5 py-3 font-sans">Tax Type</th>
              <th className="px-5 py-3 font-sans">Legal Declaration Scope / Description</th>
            </tr>
          </thead>
          <tbody className="divide-y text-body-sm text-slate-800 font-sans">
            {taxRules.map((tr, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">{tr.cat}</td>
                <td className="px-5 py-3.5 font-mono text-xs font-black text-rose-700 bg-rose-50/30 text-center">{tr.rate}</td>
                <td className="px-5 py-3.5 text-xs text-slate-700 font-bold">{tr.type}</td>
                <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium leading-relaxed">{tr.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 8. SUBSIDIARY LEDGER SETUP TAB
// ==========================================
export function SubsidiaryLedgerTab() {
  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center gap-3">
        <Boxes className="w-10 h-10 text-primary shrink-0" />
        <div>
          <h4 className="font-sans font-extrabold text-title-md text-slate-950">Subsidiary Ledger Mapping Rules</h4>
          <p className="text-body-xs text-outline mt-0.5">Pre-configured integrations for subledger modules and control account ledger routes</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left col-fixed">
          <thead>
            <tr className="bg-slate-50 text-label-xs font-bold uppercase text-outline border-b">
              <th className="px-5 py-3 font-sans w-[180px]">SL-Type Target</th>
              <th className="px-5 py-3 font-sans w-[160px]">Control GL Code</th>
              <th className="px-5 py-3 font-sans w-[240px]">Control GL Name</th>
              <th className="px-5 py-3 font-sans">Subledger Mapping Integrity Logic</th>
              <th className="px-5 py-3 font-sans text-center w-[160px]">Recon Required</th>
            </tr>
          </thead>
          <tbody className="divide-y text-body-sm text-slate-800 font-sans">
            {SL_MAPPINGS.map((sl, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">
                  {sl.slType}
                </td>
                <td className="px-5 py-3.5 font-mono text-primary text-xs font-bold">
                  {sl.controlAccountCode}
                </td>
                <td className="px-5 py-3.5 text-xs font-medium text-slate-800 truncate" title={sl.controlAccountName}>
                  {sl.controlAccountName}
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600 font-medium leading-relaxed">
                  {sl.mappingRule || 'Subledger ledger accounts are automatically mapped to control nodes via dynamic ES-module segments.'}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sl.reconciliationRequired ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {sl.reconciliationRequired ? 'Yes (Strict)' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 9. POSTING CONTROL MATRIX TAB
// ==========================================
export function PostingControlTab() {
  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center gap-3">
        <Scale className="w-10 h-10 text-primary shrink-0" />
        <div>
          <h4 className="font-sans font-extrabold text-title-md text-slate-950">Posting Control Matrix Grid</h4>
          <p className="text-body-xs text-outline mt-0.5">Administrative rules determining double entry journal postings permitted by Account Type</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-label-xs font-bold uppercase text-outline border-b">
              <th className="px-5 py-3.5 font-sans">Account Type</th>
              <th className="px-5 py-3.5 font-sans text-center">Posting Allowed</th>
              <th className="px-5 py-3.5 font-sans text-center">Header Fold Allowed</th>
              <th className="px-5 py-3.5 font-sans text-center">Control Account Option</th>
              <th className="px-5 py-3.5 font-sans text-center">Manual Postings Allowed</th>
              <th className="px-5 py-3.5 font-sans text-center">System Integration Only</th>
            </tr>
          </thead>
          <tbody className="divide-y text-body-sm text-slate-800 font-sans">
            {POSTING_CONTROL_RULES.map((pm, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">
                  {pm.accountType}
                </td>
                <td className="px-5 py-3.5 text-center text-xs font-bold text-emerald-700">{pm.postingAllowed}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${pm.headerAllowed ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${pm.controlAccountAllowed ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${pm.manualPostAllowed ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${pm.sysPostAllowed ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 10. BACKEND BUSINESS RULES TAB
// ==========================================
export function BackendRulesTab() {
  const [search, setSearch] = useState('');

  const filteredRules = useMemo(() => {
    return DETAILED_RULES.filter(rule => 
      rule.id.toLowerCase().includes(search.toLowerCase()) ||
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.errorMessage.toLowerCase().includes(search.toLowerCase()) ||
      rule.validationLocation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
          <div>
            <h4 className="font-sans font-extrabold text-title-md text-slate-950">Backend Business Rules Registry</h4>
            <p className="text-body-xs text-outline mt-0.5">Real-time and batch compliance parameters hardcoded on ledger engine</p>
          </div>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border rounded text-body-xs"
            placeholder="Search hardcoded validation policies..."
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="bg-white border rounded-xl p-5 space-y-3 shadow-xs hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded inline-block">
                  {rule.id}
                </span>
                <h5 className="font-sans font-black text-body-md text-slate-950">{rule.name}</h5>
              </div>

              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
                rule.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' :
                rule.severity === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-slate-100 text-slate-600'
              }`}>
                {rule.severity} Severity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border">
              <div>
                <span className="block text-[10px] uppercase font-bold text-outline">Applies To</span>
                <p className="mt-0.5 text-slate-900">{rule.appliesTo}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-outline">Trigger Event</span>
                <p className="mt-0.5 text-slate-900">{rule.triggerEvent}</p>
              </div>
              <div className="md:col-span-2">
                <span className="block text-[10px] uppercase font-bold text-outline">Condition Clause</span>
                <code className="mt-0.5 block font-mono text-[10px] text-teal-800 bg-white p-1 rounded truncate leading-none">{rule.condition}</code>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="font-bold text-outline uppercase text-[10px] block mb-0.5">System Expected Behavior</span></p>
              <p className="text-slate-600 font-medium bg-slate-50/50 p-2 rounded border border-dashed text-[11px]">{rule.expectedBehavior}</p>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="font-bold text-rose-700 uppercase text-[10px] block mb-0.5">Error Message Thown</span></p>
              <p className="text-rose-800 bg-rose-50/30 p-2 border border-rose-200/50 rounded font-bold font-sans">"Error {rule.id}: {rule.errorMessage}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-semibold text-outline pt-2 border-t border-dashed">
              <p><span className="font-bold">Locator:</span> <span className="font-mono text-slate-700">{rule.validationLocation}</span></p>
              <p><span className="font-bold">API Route:</span> <span className="font-mono text-slate-700">{rule.relatedApi}</span></p>
              <p><span className="font-bold">Table Scope:</span> <span className="font-mono text-slate-700">{rule.relatedTable}</span></p>
            </div>

            <div className="bg-amber-50/30 text-[11px] p-2.5 rounded border border-amber-200 text-slate-700">
              <span className="font-black uppercase text-[10px] tracking-wider text-amber-800">Test Scenario:</span>
              <p className="mt-0.5 font-medium italic text-slate-600">"{rule.testScenario}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. VALIDATION MESSAGES (DIAGNOSTICS COnP LIANCE)
// ==========================================
interface ValidationMessagesProps {
  accounts: Account[];
}

export function ValidationMessagesTab({ accounts }: ValidationMessagesProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [ranDiagnostic, setRanDiagnostic] = useState(false);
  const [failures, setFailures] = useState<Array<{ id: string; code: string; name: string; rule: string; severity: string; resolution: string }>>([]);

  const executeDiagnostic = () => {
    setIsRunning(true);
    setRanDiagnostic(false);
    
    setTimeout(() => {
      const issuesList: typeof failures = [];

      // Loop over accounts state and simulate actual logical clashing
      accounts.forEach(acc => {
        // Warning 1: Code vs Range Check
        const start = acc.code.slice(0, 1);
        if (acc.accountType === 'Asset' && start !== '1') {
          issuesList.push({
            id: 'BR-COA-02',
            code: acc.code,
            name: acc.name,
            rule: 'Account Code must match range. Assets must start with code "1".',
            severity: 'Critical',
            resolution: `Change Account Code [${acc.code}] to start with "1" or transform Account Type from Asset.`
          });
        } else if (acc.accountType === 'Liability' && start !== '2') {
          issuesList.push({
            id: 'BR-COA-02',
            code: acc.code,
            name: acc.name,
            rule: 'Account Code must match range. Liabilities must start with "2".',
            severity: 'Critical',
            resolution: `Change Account Code [${acc.code}] to start with "2" or change Type.`
          });
        }

        // Warning 2: Control Account missing subledger
        if (acc.controlAccount && acc.slType === 'None') {
          issuesList.push({
            id: 'BR-COA-06',
            code: acc.code,
            name: acc.name,
            rule: `Control Account requires SL type. [${acc.code}] has SL Type set to None.`,
            severity: 'Warning',
            resolution: `Select an active sub-ledger mapping (e.g. Supplier or Customer) on edit form.`
          });
        }

        // Warning 3: AR account has non-customer SL
        if (acc.code.startsWith('112') && acc.controlAccount && acc.slType !== 'Customer') {
          issuesList.push({
            id: 'BR-COA-07',
            code: acc.code,
            name: acc.name,
            rule: `Accounts Receivable Control account code expects Customer SL. Found: "${acc.slType}".`,
            severity: 'Critical',
            resolution: 'Edit account and change Subsidiary Ledger Type to Customer.'
          });
        }

        // Warning 4: AP account has non-supplier SL
        if (acc.code.startsWith('210') && acc.controlAccount && acc.slType !== 'Supplier') {
          issuesList.push({
            id: 'BR-COA-08',
            code: acc.code,
            name: acc.name,
            rule: `Accounts Payable Control account code expects Supplier SL. Found: "${acc.slType}".`,
            severity: 'Critical',
            resolution: 'Edit account and change Subsidiary Ledger Type to Supplier.'
          });
        }
      });

      setFailures(issuesList);
      setIsRunning(false);
      setRanDiagnostic(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="bg-white border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-title-lg text-slate-1000 leading-none">
              Setup Compliance Diagnostic Engine
            </h3>
            <p className="text-body-xs text-outline mt-1 font-semibold leading-relaxed">
              Scan active ledger metadata records to find violations of the 13 backend business validation rules
            </p>
          </div>
        </div>

        <button
          onClick={executeDiagnostic}
          disabled={isRunning}
          className="bg-amber-600 text-white hover:bg-amber-700 px-5 py-2.5 rounded font-sans text-xs font-bold flex items-center gap-2 transition-all shrink-0 shadow-sm active:scale-95 disabled:opacity-60"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Scanning ledger schemas...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Run Setup Compliance Diagnostics</span>
            </>
          )}
        </button>
      </div>

      {!ranDiagnostic && !isRunning && (
        <div className="border border-dashed bg-slate-50/50 rounded-xl p-12 text-center text-outline space-y-3">
          <Info className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-body-md font-bold text-slate-700">Setup Compliance System Ready</p>
          <p className="text-xs max-w-sm mx-auto text-slate-500 font-medium">Click the button above to run real-time checks on your currently saved accounts hierarchy tree.</p>
        </div>
      )}

      {isRunning && (
        <div className="border border-dashed bg-blue-50/20 rounded-xl p-12 text-center text-primary space-y-3 animate-pulse">
          <RefreshCw className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-body-md font-bold">Evaluating ledger nodes and segment codes...</p>
          <p className="text-xs text-primary/70 font-medium">Inspecting IFRS classes and Ethiopian Tax compliance ranges.</p>
        </div>
      )}

      {ranDiagnostic && (
        <div className="animate-fadeIn space-y-4">
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${failures.length === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {failures.length === 0 ? (
              <>
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-body-sm leading-none">Diagnostic Result: ALL LEDGER NODES COMPLIANT</p>
                  <p className="mt-1 font-medium text-emerald-700/80">The configuration tree adheres perfectly to IAS 1 standards, and matches Ethiopian ERCA regional tax ranges.</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-body-sm leading-none">Diagnostic Result: FOUND {failures.length} COMPLIANCE VIOLATIONS</p>
                  <p className="mt-1 font-medium text-red-700/80">Ledgers will fail transaction post operations in production. Coordinate adjustments below.</p>
                </div>
              </>
            )}
          </div>

          {failures.length > 0 && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-outline border-b">
                    <th className="px-5 py-3 w-[110px]">Rule ID</th>
                    <th className="px-5 py-3 w-[150px]">Account Affected</th>
                    <th className="px-5 py-3">Violation Found</th>
                    <th className="px-5 py-3 w-[110px]">Severity</th>
                    <th className="px-5 py-3 w-[340px]">Suggested Adjustment Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-body-xs font-sans">
                  {failures.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-primary">{f.id}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        <span className="block font-mono font-bold">{f.code}</span>
                        <span className="text-[10px] text-outline block">{f.name}</span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-600 leading-relaxed">{f.rule}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${f.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                          {f.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-700 font-medium italic bg-amber-50/10">
                        {f.resolution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. API ENDPOINTS TAB
// ==========================================
export function APIEndpointsTab() {
  const [viewedApi, setViewedApi] = useState<DetailedApiSpec | null>(null);

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-10 h-10 text-primary shrink-0" />
          <div>
            <h4 className="font-sans font-extrabold text-title-md text-slate-950 font-sans">REST Endpoint Definitions</h4>
            <p className="text-body-xs text-outline mt-0.5">Specifications dictionary for ERP client-server communications integrations</p>
          </div>
        </div>

        <div className="bg-slate-100 text-xs px-3 py-1 font-mono rounded font-medium text-slate-600">
          Base URL: /api/v1
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left endpoint selector list */}
        <div className="bg-white border rounded-xl divide-y overflow-hidden h-[540px] overflow-y-auto shadow-sm">
          {DETAILED_API_SPECS.map((api, i) => (
            <button
              key={i}
              onClick={() => setViewedApi(api)}
              className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-slate-50 ${viewedApi?.endpoint === api.endpoint ? 'bg-slate-50 border-l-[3px] border-primary' : ''}`}
            >
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                api.method === 'POST' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                api.method === 'PUT' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-slate-100 text-slate-700 border'
              }`}>
                {api.method}
              </span>

              <div className="space-y-1 overflow-hidden">
                <code className="text-body-xs font-mono font-bold block truncate text-slate-900">{api.endpoint}</code>
                <p className="text-[11px] text-outline leading-tight truncate">{api.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right JSON spec displayer */}
        <div className="md:col-span-2 bg-white border rounded-xl overflow-hidden min-h-[500px] flex flex-col justify-between shadow-sm">
          {viewedApi ? (
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h5 className="font-sans font-extrabold text-body-md text-slate-950 font-sans flex items-center gap-2">
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">{viewedApi.method}</span>
                    <code className="font-mono">{viewedApi.endpoint}</code>
                  </h5>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">{viewedApi.description}</p>
                </div>

                <div className="text-right text-[10px] text-outline font-bold uppercase tracking-wider">
                  <p>Spec Version: {viewedApi.version}</p>
                  <p className="mt-0.5 text-primary">Required Permission: {viewedApi.permissionRequired}</p>
                </div>
              </div>

              {/* Request Fields */}
              <div className="space-y-2">
                <h6 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">Payload Request Body Specs</h6>
                <div className="bg-slate-50 border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="px-4 py-2 w-[120px]">Field Key</th>
                        <th className="px-4 py-2 w-[100px]">Data Type</th>
                        <th className="px-4 py-2 text-center w-[100px]">Required</th>
                        <th className="px-4 py-2">Validation Rule description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {viewedApi.requestFields.map((f, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 font-mono font-bold text-primary">{f.name}</td>
                          <td className="px-4 py-2 font-mono text-outline text-[11px]">{f.type}</td>
                          <td className="px-4 py-2 text-center font-bold">
                            {f.required ? <span className="text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">Yes</span> : <span className="text-outline">No</span>}
                          </td>
                          <td className="px-4 py-2 text-on-surface-variant font-medium text-[11px]">{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Response Fields */}
              <div className="space-y-2">
                <h6 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">Expected Response Payload JSON (200 OK)</h6>
                <div className="bg-slate-50 border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="px-4 py-2 w-[140px]">Response key</th>
                        <th className="px-4 py-2 w-[100px]">Response type</th>
                        <th className="px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {viewedApi.responseFields.map((f, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 font-mono font-bold text-teal-800 bg-teal-50/10">{f.name}</td>
                          <td className="px-4 py-2 font-mono text-outline">{f.type}</td>
                          <td className="px-4 py-2 text-on-surface-variant font-medium text-[11px]">{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rules applied & Security configs */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="bg-slate-50 p-3 rounded-lg border border-dashed text-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-outline">Compliance Rules Bound</span>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {viewedApi.rulesApplied.length > 0 ? (
                      viewedApi.rulesApplied.map((r, i) => (
                        <span key={i} className="bg-white border rounded px-1.5 py-0.5 font-mono text-[10px] text-primary">{r}</span>
                      ))
                    ) : (
                      <span className="text-outline italic">No compliance rules</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-dashed text-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-outline">Security Audit Log?</span>
                    <p className="mt-1 font-bold text-slate-900 text-xs">
                      {viewedApi.auditRequired ? '🔓 SECURE COMPLIED AUDITING LOCKED' : 'No explicit audit capture'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-outline italic text-xs my-auto">
              Identify and select a REST API route in the Left Navigator pane to drill down parameters and validations schemas.
            </div>
          )}

          <div className="bg-slate-50 border-t p-4 flex justify-between items-center text-[11px] text-outline font-medium">
            <span>Enforces strict server-side JSON schema matching</span>
            <span>REST API Spec Sheet: QM AMS Intelligent Ledger Core</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 13. IMPORT TEMPLATE TAB
// ==========================================
export function ImportTemplateTab() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadComp, setUploadComp] = useState(false);

  const simulateExcelExport = () => {
    alert("Downloading QM_AMS_COA_Upload_Template.xlsx schema spreadsheet file directly.");
  };

  const handleUploadSim = () => {
    if (!selectedFile) {
      alert("Please choose a file or drag a CSV ledger first.");
      return;
    }
    setUploadComp(true);
    setTimeout(() => {
      alert("Excel Spreadsheet parsed. Successfully created 5 child accounts, updating ledger workbook.");
      setUploadComp(false);
      setSelectedFile(null);
    }, 1200);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload className="w-10 h-10 text-primary shrink-0" />
          <div>
            <h4 className="font-sans font-extrabold text-title-md text-slate-950 font-sans">Spreadsheet Import Specifications</h4>
            <p className="text-body-xs text-outline mt-0.5">Specifications for bulk uploading ledger accounts from Excel or CSV files</p>
          </div>
        </div>

        <button
          onClick={simulateExcelExport}
          className="bg-primary text-white hover:bg-primary-container px-4 py-1.8 rounded text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-sm active:scale-95 text-xs text-center"
        >
          <Download className="w-4 h-4 text-white" />
          Download Template Spreadsheet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schema Specification list */}
        <div className="md:col-span-2 bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-slate-50 border-b flex justify-between items-center">
            <span className="text-xs font-sans font-black text-slate-800 uppercase tracking-wider">Compulsory Excel Column Definition Schema</span>
            <span className="text-[11px] text-outline font-medium">{IMPORT_TEMPLATE_FIELDS.length} Columns Defs</span>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="px-5 py-2.5 w-[140px]">Column Header</th>
                  <th className="px-5 py-2.5 w-[100px]">Data Type</th>
                  <th className="px-5 py-2.5 text-center w-[90px]">Required</th>
                  <th className="px-5 py-2.5">Range Validation Checklist</th>
                  <th className="px-5 py-2.5">Sample Value</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {IMPORT_TEMPLATE_FIELDS.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-2 font-bold text-slate-800">{f.fieldName}</td>
                    <td className="px-5 py-2 font-mono text-[10px] text-primary">{f.type}</td>
                    <td className="px-5 py-2 text-center font-bold">
                      {f.required ? <span className="text-red-700 bg-red-100 px-1.5 py-0.2 rounded font-mono text-[9px]">YES</span> : <span className="text-outline">-</span>}
                    </td>
                    <td className="px-5 py-2 text-on-surface-variant font-medium leading-relaxed max-w-[280px] break-words" title={f.remark}>
                      {f.validations}
                    </td>
                    <td className="px-5 py-2 font-mono text-[11px] text-teal-800 bg-slate-50/55">{f.sampleValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import actions simulation */}
        <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h5 className="font-sans font-extrabold text-body-md text-slate-950 font-sans border-b pb-2">Upload Completed Registry</h5>

            <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-6 text-center space-y-2 cursor-pointer hover:bg-slate-50/50" onClick={() => setSelectedFile("Ready_ledger_coa_bole.csv")}>
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Drag & Drop Completed CSV / Excel</p>
              <p className="text-[10px] text-outline font-medium">Accepts CSV, XLSX files with matching column mapping sizes</p>
            </div>

            {selectedFile && (
              <div className="text-xs bg-slate-50 border p-3 rounded-lg flex items-center justify-between text-slate-700 animate-fadeIn font-medium">
                <span className="truncate max-w-[140px] font-semibold text-primary">{selectedFile}</span>
                <button onClick={() => setSelectedFile(null)} className="text-rose-700 hover:text-rose-900 font-bold px-1.5 py-0.5 border rounded bg-white">Cancel</button>
              </div>
            )}
          </div>

          <button
            onClick={handleUploadSim}
            disabled={uploadComp}
            className="w-full bg-primary text-white hover:bg-primary-container px-4 py-2 rounded text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 mt-4"
          >
            {uploadComp ? 'Processing spreadsheet...' : 'Begin Mass Registry Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 14. AUDIT TRAIL TAB
// ==========================================
interface AuditTrailProps {
  auditLogs: AuditLogEntry[];
}

export function AuditTrailTab({ auditLogs }: AuditTrailProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.entityKey.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
    );
  }, [auditLogs, search]);

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white border rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-10 h-10 text-primary shrink-0" />
          <div>
            <h4 className="font-sans font-extrabold text-title-md text-slate-950 font-sans">Historical Audit Trails</h4>
            <p className="text-body-xs text-outline mt-0.5">Logs documenting compliance review dates, submissions, and approvals changes</p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border rounded text-xs"
            placeholder="Search audit trail records..."
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-outline border-b">
                <th className="px-5 py-3 w-[160px] font-sans">Timestamp (UTC)</th>
                <th className="px-5 py-3 w-[160px] font-sans">Actor Account</th>
                <th className="px-5 py-3 w-[140px] font-sans">Action Type</th>
                <th className="px-5 py-3 w-[120px] font-sans">Target Key</th>
                <th className="px-5 py-3 font-sans">Modification Note</th>
              </tr>
            </thead>
            <tbody className="divide-y text-body-xs font-sans text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 align-top">
                  <td className="px-5 py-3 text-xs text-slate-500 font-mono flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span>{log.timestamp.replace('T', ' ').replace('Z', '')}</span>
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-800">{log.user}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                      log.action.includes('APPROVE') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.action.includes('SUBMIT') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-slate-700">
                    {log.entityKey}
                  </td>
                  <td className="px-5 py-3 text-xs leading-relaxed text-on-surface-variant font-medium">
                    <p className="font-semibold text-slate-800">{log.description}</p>
                    {log.payloadAfter && (
                      <div className="bg-slate-50 p-2 border border-dashed rounded font-mono text-[9px] text-teal-800 mt-2 max-w-xl truncate overflow-hidden">
                        Changes: {log.payloadAfter}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

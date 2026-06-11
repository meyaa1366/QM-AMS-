import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Layers, 
  Settings, 
  Building2, 
  Users, 
  ArrowLeftRight, 
  FileText, 
  RefreshCw, 
  Play, 
  CheckSquare, 
  AlertTriangle, 
  Search, 
  Download, 
  Upload, 
  History, 
  Lock, 
  Unlock, 
  FileSpreadsheet, 
  Database, 
  Workflow, 
  ClipboardList, 
  CheckCircle2,
  ChevronRight,
  Info,
  Sliders,
  DollarSign,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityKey: string;
  description: string;
}

interface BudgetModuleTabProps {
  onAddAuditLog?: (log: AuditLog) => void;
}

export default function BudgetModuleTab({ onAddAuditLog }: BudgetModuleTabProps) {
  // Navigation: Operations sub tabs
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'form' | 'scenarios' | 'transfers' | 'specs'>('board');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [scenarioFilter, setScenarioFilter] = useState<string>('All');

  // Dynamic notification toast list
  const [notifications, setNotifications] = useState<{ id: number; text: string; type: 'success' | 'warn' | 'info' }[]>([]);
  const addNotify = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleTriggerAudit = (action: string, key: string, desc: string) => {
    if (onAddAuditLog) {
      onAddAuditLog({
        id: `AUD-BGT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        user: 'finance.lead@qmt.com',
        action,
        entityType: 'BUDGET_MODULE',
        entityKey: key,
        description: desc
      });
    }
  };

  // Seed Data: Budgets
  const [budgets, setBudgets] = useState([
    { code: 'B-2026-REV', name: 'Product Sales Revenue Target', company: 'QM-ABC', branch: 'AA-01', year: 'FY2026', scenario: 'BASE', account: '4110 (Sales Revenue)', dept: 'SALES', costCenter: 'CC-SALES', approved: 25000000, revised: 27500000, committed: 0, actual: 21000000, status: 'Released', approval: 'Approved' },
    { code: 'B-2026-SAL', name: 'AA Headquarters Personnel Salaries', company: 'QM-ABC', branch: 'AA-01', year: 'FY2026', scenario: 'BASE', account: '6110 (Salaries Expense)', dept: 'HR', costCenter: 'CC-HR', approved: 8500000, revised: 8500000, committed: 45000, actual: 5200000, status: 'Released', approval: 'Approved' },
    { code: 'B-2026-MKT', name: 'Corporate Marketing Campaign', company: 'QM-ABC', branch: 'HQ', year: 'FY2026', scenario: 'OPTIMISTIC', account: '6140 (Marketing Expense)', dept: 'MKT', costCenter: 'CC-MKT', approved: 3500000, revised: 3800000, committed: 200000, actual: 1250000, status: 'Released', approval: 'Approved' },
    { code: 'B-2026-IT', name: 'SaaS Tool and Server Subscriptions', company: 'QM-ABC', branch: 'HQ', year: 'FY2026', scenario: 'BASE', account: '6130 (Utilities Expense)', dept: 'IT', costCenter: 'CC-IT', approved: 1200000, revised: 1500000, committed: 50000, actual: 950000, status: 'Released', approval: 'Approved' },
    { code: 'B-2026-CAP', name: 'HQ Server Hardware Upgrades (CAPEX)', company: 'QM-ABC', branch: 'HQ', year: 'FY2026', scenario: 'BASE', account: '1510 (PPE)', dept: 'IT', costCenter: 'CC-IT', approved: 4500000, revised: 4500000, committed: 1800000, actual: 1200000, status: 'Active', approval: 'Approved' },
    { code: 'B-2026-TRA', name: 'Regional Ops Team Travel Offset', company: 'QM-ABC', branch: 'AD-01', year: 'FY2026', scenario: 'COST_REDUCTION', account: '6160 (Travel Expense)', dept: 'OPS', costCenter: 'CC-OPS', approved: 750000, revised: 60000, committed: 15000, actual: 480000, status: 'Active', approval: 'Approved' }
  ]);

  // Form States: Setup New Budget Form
  const [formCompany, setFormCompany] = useState('QM-ABC');
  const [formBranch, setFormBranch] = useState('AA-01');
  const [formYear, setFormYear] = useState('FY2026');
  const [formCode, setFormCode] = useState('B-2026-RENT');
  const [formName, setFormName] = useState('Workspace Rent & Utility Allocation');
  const [formAccount, setFormAccount] = useState('6120 (Rent Expense)');
  const [formDept, setFormDept] = useState('ADMIN');
  const [formCostCenter, setFormCostCenter] = useState('CC-ADMIN');
  const [formScenario, setFormScenario] = useState('BASE');
  const [formAmount, setFormAmount] = useState('1800000');
  const [formCtrlLevel, setFormCtrlLevel] = useState('GL_ACCOUNT');
  const [formCtrlMethod, setFormCtrlMethod] = useState('HARD_BLOCK');

  // Interactive Scenario lists S4
  const [versions, setVersions] = useState([
    { code: 'ORIGINAL', name: 'Original Core Balanced Budget', type: 'Original', scenario: 'BASE', approved: true, active: true, locked: true },
    { code: 'REV01', name: 'Midyear Reallocation Calibration Run', type: 'Revised', scenario: 'BASE', approved: true, active: true, locked: false },
    { code: 'FORECAST_Q1', name: 'Q1 Performance Expansion Forecast', type: 'Forecast', scenario: 'OPTIMISTIC', approved: false, active: true, locked: false },
    { code: 'COST_REDUCE', name: 'Emergency Austerity Target Scenario', type: 'Scenario', scenario: 'COST_REDUCTION', approved: true, active: false, locked: true }
  ]);

  // Budget Transfers State
  const [tfSourceCode, setTfSourceCode] = useState('B-2026-SAL');
  const [tfTargetCode, setTfTargetCode] = useState('B-2026-MKT');
  const [tfAmount, setTfAmount] = useState('250000');
  const [tfReason, setTfReason] = useState('Shift surplus headcount reserves into tactical campaigns');

  // Allocation Tools Auto Splits
  const [allocAmount, setAllocAmount] = useState('2400000');
  const [allocMethod, setAllocMethod] = useState('EQUAL_MONTHLY');
  const [allocCalculations, setAllocCalculations] = useState<number[]>([]);

  // CSV paste template import state
  const [importCsv, setImportCsv] = useState(
    `QM-ABC,HQ,FY2026,B-2026-OFFS,Office Supplies Expense,OPERATING,ORIGINAL,BASE,6130,ADMIN,CC-ADMIN,150000\nQM-ABC,AA-01,FY2026,B-2026-UTIL,Addis Power Grid Allocation,OPERATING,ORIGINAL,BASE,6130,OPS,CC-OPS,480000`
  );

  // Stats calculation
  const stats = useMemo(() => {
    let totalApproved = budgets.reduce((acc, b) => acc + b.approved, 0);
    let totalRevised = budgets.reduce((acc, b) => acc + b.revised, 0);
    let totalActual = budgets.reduce((acc, b) => acc + b.actual, 0);
    let totalCommitted = budgets.reduce((acc, b) => acc + b.committed, 0);
    return {
      approved: totalApproved,
      revised: totalRevised,
      actual: totalActual,
      committed: totalCommitted,
      available: totalRevised - (totalActual + totalCommitted)
    };
  }, [budgets]);

  // Submit Budget Create / Edit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName || !formAmount) {
      addNotify('Validation Failed: Please fill in all required setup fields.', 'warn');
      return;
    }

    if (budgets.some(b => b.code === formCode)) {
      addNotify(`Validation Failed: Budget code ${formCode} already exists.`, 'warn');
      return;
    }

    const amt = parseFloat(formAmount) || 0;
    const newItem = {
      code: formCode,
      name: formName,
      company: formCompany,
      branch: formBranch,
      year: formYear,
      scenario: formScenario,
      account: formAccount,
      dept: formDept,
      costCenter: formCostCenter,
      approved: amt,
      revised: amt,
      committed: 0,
      actual: 0,
      status: 'Active',
      approval: 'Approved'
    };

    setBudgets([newItem, ...budgets]);
    addNotify(`Success: Compliant IFRS Budget node [${formCode}] created securely!`, 'success');
    handleTriggerAudit('BUDGET_CREATED', formCode, `Created budget '${formName}' allocated at ${amt.toLocaleString()} ETB`);
    
    // Clear / reset coding defaults
    setFormCode(`B-${formYear}-NEW-${Math.floor(Math.random() * 800) + 100}`);
    setFormName('');
    setActiveSubTab('board');
  };

  // Run Budget Transfer Reallocation
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(tfAmount) || 0;
    if (amt <= 0) {
      addNotify('Validation Warning: Transfer funds amount must be positive!', 'warn');
      return;
    }

    const src = budgets.find(b => b.code === tfSourceCode);
    const tgt = budgets.find(b => b.code === tfTargetCode);

    if (!src || !tgt) {
      addNotify('Validation Error: Target or Source budget line not found!', 'warn');
      return;
    }

    const avail = src.revised - (src.committed + src.actual);
    if (avail < amt) {
      addNotify(`Rule Violation: Transfer amount exceeds available balance (${avail.toLocaleString()} ETB) in ${tfSourceCode}!`, 'warn');
      return;
    }

    setBudgets(prev => prev.map(b => {
      if (b.code === tfSourceCode) {
        return { ...b, revised: b.revised - amt };
      }
      if (b.code === tfTargetCode) {
        return { ...b, revised: b.revised + amt };
      }
      return b;
    }));

    addNotify(`Compliance Approved: Reallocated ${amt.toLocaleString()} ETB securely!`, 'success');
    handleTriggerAudit('BUDGET_REALLOCATION', `${tfSourceCode}=>${tfTargetCode}`, `Transferred ${amt.toLocaleString()} ETB. Memo: ${tfReason}`);
  };

  // Run Auto splits generator preview
  const handleAutoSplitsPreview = () => {
    const total = parseFloat(allocAmount) || 0;
    if (total <= 0) {
      addNotify('Please specify a positive value to test splits.', 'warn');
      return;
    }

    let periods = Array(12).fill(0);
    if (allocMethod === 'EQUAL_MONTHLY') {
      const split = Math.round((total / 12) * 100) / 100;
      periods = Array(12).fill(split);
    } else if (allocMethod === 'SEASONAL') {
      const weights = [0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.09, 0.12, 0.12, 0.12];
      periods = weights.map(w => Math.round(total * w * 100) / 100);
    } else {
      const weights = [0.10, 0.05, 0.15, 0.05, 0.10, 0.05, 0.10, 0.10, 0.05, 0.10, 0.10, 0.05];
      periods = weights.map(w => Math.round(total * w * 100) / 100);
    }

    setAllocCalculations(periods);
    addNotify('Calculations generated! View period splits preview below.', 'info');
  };

  // Clipboard spreadsheet parser
  const handleCsvImport = () => {
    try {
      const rows = importCsv.split('\n');
      let count = 0;
      const parsedRows: any[] = [];
      
      rows.forEach(r => {
        if (!r.trim()) return;
        const col = r.split(',');
        if (col.length >= 12) {
          const rawAmt = parseFloat(col[11]) || 0;
          parsedRows.push({
            code: col[3].trim(),
            name: col[4].trim(),
            company: col[0].trim(),
            branch: col[1].trim(),
            year: col[2].trim(),
            scenario: col[7].trim(),
            account: col[8].trim(),
            dept: col[9].trim(),
            costCenter: col[10].trim(),
            approved: rawAmt,
            revised: rawAmt,
            committed: 0,
            actual: 0,
            status: 'Released',
            approval: 'Approved'
          });
          count++;
        }
      });

      if (count > 0) {
        setBudgets(prev => {
          const newCodes = parsedRows.map(p => p.code);
          return [...prev.filter(b => !newCodes.includes(b.code)), ...parsedRows];
        });
        addNotify(`Successfully imported ${count} ledger budget nodes via template.`, 'success');
        handleTriggerAudit('BULK_CSV_IMPORT', 'CSV_BATCH', `Imported ${count} active positions from spreadsheet clipboard.`);
        setActiveSubTab('board');
      } else {
        addNotify('Could not parse any columns. Review format values.', 'warn');
      }
    } catch (err) {
      addNotify('Parsing failed: Ensure standard CSV column layout is respected.', 'warn');
    }
  };

  // Filter lists
  const filteredBudgets = budgets.filter(b => {
    const textMatch = b.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.account.toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = companyFilter === 'All' || b.company === companyFilter;
    const scenarioMatch = scenarioFilter === 'All' || b.scenario === scenarioFilter;
    return textMatch && companyMatch && scenarioMatch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* HUD notifications toast lists */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border shadow-xl flex items-center gap-2.5 animate-bounce-short text-xs font-black text-white pointer-events-auto ${
            n.type === 'success' ? 'bg-emerald-600 border-emerald-505' :
            n.type === 'warn' ? 'bg-amber-500 border-amber-600' : 'bg-slate-800 border-slate-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>{n.text}</span>
          </div>
        ))}
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
            <Coins className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">IFRS Budget Management Setup</h2>
            <p className="text-xs text-slate-500 font-medium">Configure corporate budgets, scenarios, control thresholds and secure transfers.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('form')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Budget</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-600"></div>
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Approved Targets</span>
          <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">{stats.approved.toLocaleString()} ETB</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500"></div>
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Revised Budgets Sum</span>
          <span className="text-sm font-extrabold text-indigo-700 mt-1.5 block">{stats.revised.toLocaleString()} ETB</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Actual Expenses Lodged</span>
          <span className="text-sm font-extrabold text-emerald-600 mt-1.5 block">{stats.actual.toLocaleString()} ETB</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-rose-500"></div>
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Remaining Funds Scope</span>
          <span className="text-sm font-extrabold text-rose-600 mt-1.5 block">{stats.available.toLocaleString()} ETB</span>
        </div>
      </div>

      {/* Tabs Switch Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSubTab('board')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'board' 
              ? 'border-blue-600 text-blue-600 font-extrabold bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          1. Budget Registry Board
        </button>
        <button
          onClick={() => setActiveSubTab('form')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'form' 
              ? 'border-blue-600 text-blue-600 font-extrabold bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          2. Setup New Budget Form
        </button>
        <button
          onClick={() => setActiveSubTab('scenarios')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'scenarios' 
              ? 'border-blue-600 text-blue-600 font-extrabold bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          3. Version Scenario Lock
        </button>
        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'transfers' 
              ? 'border-blue-600 text-blue-600 font-extrabold bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          4. Allocation & Funds Transfers
        </button>
        <button
          onClick={() => setActiveSubTab('specs')}
          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'specs' 
              ? 'border-blue-600 text-blue-600 font-extrabold bg-white' 
              : 'border-transparent text-slate-550 hover:text-slate-800'
          }`}
        >
          5. Controls Rules & Tech Specs
        </button>
      </div>

      {/* Sub tabs content viewport */}

      {/* 1. BUDGET REGISTRY BOARD */}
      {activeSubTab === 'board' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          
          {/* Advanced Search Filter Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 border p-3 border-slate-200 rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code, label, or matching general ledger account..."
                className="pl-9 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span>Under Scenario:</span>
              <select
                value={scenarioFilter}
                onChange={(e) => setScenarioFilter(e.target.value)}
                className="bg-white border border-slate-200 p-1.5 rounded-lg text-xs"
              >
                <option value="All">All Scenarios</option>
                <option value="BASE">BASE Scenario</option>
                <option value="OPTIMISTIC">OPTIMISTIC Scenario</option>
                <option value="COST_REDUCTION">COST_REDUCTION Scenario</option>
              </select>
            </div>
          </div>

          {/* Interactive Budgets list table */}
          <div className="overflow-x-auto rounded-xl border border-slate-250">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                  <th className="px-4 py-3">Budget Code</th>
                  <th className="px-4 py-3">Label reference</th>
                  <th className="px-4 py-3">Dept / Center</th>
                  <th className="px-4 py-3">GL Account Mapping</th>
                  <th className="px-4 py-3 text-right">Approved</th>
                  <th className="px-4 py-3 text-right">Revised</th>
                  <th className="px-4 py-3 text-right">Actual Spent</th>
                  <th className="px-4 py-3 text-center">Remaining</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBudgets.map((b) => {
                  const rem = b.revised - (b.committed + b.actual);
                  const pct = Math.min(Math.round((b.actual / b.revised) * 100), 100) || 0;
                  return (
                    <tr key={b.code} className="hover:bg-slate-50/55">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{b.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{b.name}</td>
                      <td className="px-4 py-3 font-semibold text-slate-550">{b.dept} • {b.costCenter}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-500 block truncate max-w-[130px]" title={b.account}>{b.account}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-500">{b.approved.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-black text-slate-850 bg-slate-50/50">{b.revised.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        <div>{b.actual.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-400">Spent: {pct}%</div>
                      </td>
                      <td className={`px-4 py-3 text-center font-bold font-mono ${
                        rem < 0 ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {rem.toLocaleString()} ETB
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${
                          b.status === 'Released' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SETUP NEW BUDGET FORM */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-900">Configure Controls</h3>
              <p className="text-[10px] text-slate-450">Set rule enforcement triggers for budget validation validation before saving.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Trigger Threshold Level</label>
                <select
                  value={formCtrlLevel}
                  onChange={(e) => setFormCtrlLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                >
                  <option value="GL_ACCOUNT">GL Account Level enforcement</option>
                  <option value="COST_CENTER">Cost Center Level enforcement</option>
                  <option value="DEPARTMENT">Department level aggregation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Enforcement Lock Method</label>
                <select
                  value={formCtrlMethod}
                  onChange={(e) => setFormCtrlMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                >
                  <option value="HARD_BLOCK">⚠️ HARD_BLOCK (Stop transaction posting if limit exceeded)</option>
                  <option value="WARNING_ONLY">🔔 WARNING_ONLY (Log auditor incident warning and proceed)</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-150 rounded-xl p-4 text-[11px] text-blue-800 leading-normal font-bold">
                🔒 System Integrity assurance compliance: General journal transfers will reference these control triggers to block out-of-limits transactions automatically.
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Define Budget Allocation Parameters</h3>
                <p className="text-[10px] text-slate-400">Map specific funds to legal departments and corporate centers.</p>
              </div>
              <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                ACTIVE CODES COMPLIANCE
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    System Unique Budget Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. B-2026-RENT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Budget Allocation Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Workspace Rent & Utility Allocation"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Financial Year Binding</label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="FY2025">FY2025</option>
                    <option value="FY2026">FY2026</option>
                    <option value="FY2027">FY2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Strategic Scenario Mode</label>
                  <select
                    value={formScenario}
                    onChange={(e) => setFormScenario(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="BASE">BASE Scenario</option>
                    <option value="OPTIMISTIC">OPTIMISTIC Scenario</option>
                    <option value="COST_REDUCTION">COST_REDUCTION Target</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Account Mapping Code</label>
                  <select
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="6120 (Rent Expense)">6120 (Rent Expense)</option>
                    <option value="6110 (Salaries Expense)">6110 (Salaries Expense)</option>
                    <option value="6140 (Marketing Expense)">6140 (Marketing Expansion)</option>
                    <option value="6130 (Utilities Operating)">6130 (Utilities Expense)</option>
                    <option value="1510 (Asset Equips PPE)">1510 (PPE Fixed Asset)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Company Entity</label>
                  <input
                    type="text"
                    value={formCompany}
                    disabled
                    className="w-full bg-slate-50 border border-slate-100 p-2 text-xs text-slate-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Legal Department</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="ADMIN">ADMIN (Administration)</option>
                    <option value="SALES">SALES (Business Target)</option>
                    <option value="HR">HR (Personnel)</option>
                    <option value="IT">IT (SaaS & Networks)</option>
                    <option value="OPS">OPS (Regional execution)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Allocation Sum (ETB) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 1800000"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-lg text-xs uppercase cursor-pointer"
                >
                  Authorize & Release Budget Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. VERSION SCENARIO LOCK */}
      {activeSubTab === 'scenarios' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-xs uppercase text-slate-900">IFRS Budget Scenario Versions</h3>
            <p className="text-[10px] text-slate-450">Active versions and lock status matrices to secure positions against ledger edits.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-250">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                  <th className="px-4 py-3">Version Code</th>
                  <th className="px-4 py-3">Scenario Name</th>
                  <th className="px-4 py-3 text-center">Type</th>
                  <th className="px-4 py-3 text-center">Assumed Scenarios</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Integrity Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {versions.map((ver) => (
                  <tr key={ver.code} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{ver.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{ver.name}</td>
                    <td className="px-4 py-3 text-center text-slate-500 font-bold">{ver.type}</td>
                    <td className="px-4 py-3 text-center text-indigo-700 font-mono font-extrabold">{ver.scenario}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        ver.locked ? 'bg-slate-100 text-slate-450 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-250 animate-pulse'
                      }`}>
                        {ver.locked ? '🔒 Locked' : '🔓 Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setVersions(prev => prev.map(v => v.code === ver.code ? { ...v, locked: !v.locked } : v));
                          addNotify(`Version ${ver.code} lock status updated securely!`, 'info');
                        }}
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded cursor-pointer border ${
                          ver.locked 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-220 hover:bg-rose-100'
                        }`}
                      >
                        {ver.locked ? 'Unlock Version' : 'Lock Version'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ALLOCATION & FUNDS TRANSFERS */}
      {activeSubTab === 'transfers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funds Transfers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-1">
                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                <span>Inter-Node Budget Transfer Tool</span>
              </h3>
              <p className="text-[10px] text-slate-450 mt-1">Reallocate surplus funds between active compliant positions safely with validator triggers.</p>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Source Budget Node (Surplus) <span className="text-red-500">*</span></label>
                <select
                  value={tfSourceCode}
                  onChange={(e) => setTfSourceCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-800"
                >
                  {budgets.map(b => (
                    <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Budget Node (Deficit) <span className="text-red-500">*</span></label>
                <select
                  value={tfTargetCode}
                  onChange={(e) => setTfTargetCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-800"
                >
                  {budgets.map(b => (
                    <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Amount to Transfer (ETB) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={tfAmount}
                    onChange={(e) => setTfAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 150000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Justification Memo <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={tfReason}
                    onChange={(e) => setTfReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                    placeholder="Provide compliance reasoning"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 rounded-lg text-xs uppercase cursor-pointer"
              >
                Perform Secured Funds Transfer
              </button>
            </form>
          </div>

          {/* Allocation auto splits preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs uppercase text-slate-900">Monthly Period Allocation Splits</h3>
              <p className="text-[10px] text-slate-450 mt-1">Simulate weights distribution (e.g., Seasonal Q4 weighted, Equal divisions or historical actual ratios).</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Total Amount (ETB)</label>
                  <input
                    type="number"
                    value={allocAmount}
                    onChange={(e) => setAllocAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Spreading Strategy</label>
                  <select
                    value={allocMethod}
                    onChange={(e) => setAllocMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="EQUAL_MONTHLY">Equal division (Monthly split)</option>
                    <option value="SEASONAL">Seasonal high (Weighted Q4 peak)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAutoSplitsPreview}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-2 rounded-lg text-xs uppercase cursor-pointer"
              >
                Recalculate Spreads
              </button>

              {allocCalculations.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Calculated Period Layout Preview:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 text-[10px] text-center font-mono font-bold">
                    {allocCalculations.map((val, idx) => (
                      <div key={idx} className="p-1.5 border border-slate-200 bg-slate-50 rounded text-slate-700">
                        <span className="block text-[8px] text-slate-400 font-sans">Period P{idx+1 < 10 ? '0'+(idx+1) : idx+1}</span>
                        <span>{parseFloat(val.toFixed()).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTROLS RULES & TECH SPECS */}
      {activeSubTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Direct bulk clipboard mapping */}
            <div className="lg:col-span-1 border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
              <span className="text-[10px] font-black text-slate-600 block uppercase">Bulk Excel Clipboard Import</span>
              <p className="text-[11px] text-slate-450 font-medium">Paste spreadsheet clipboard lines directly here to batch load compliant definitions.</p>
              
              <textarea
                value={importCsv}
                onChange={(e) => setImportCsv(e.target.value)}
                rows={4}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-[10.5px] font-mono focus:outline-none"
              />

              <button
                onClick={handleCsvImport}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold py-2 rounded-lg text-xs tracking-wide uppercase transition-colors"
              >
                Perform Bulk Import
              </button>
            </div>

            {/* Speciation Payload codes */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">IFRS Technical Payload & Compliance Schemas</h3>
                <p className="text-[10px] text-slate-400">Database contracts bounding legal entity budget lines.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 text-slate-250 font-mono text-[10.5px] p-4.5 rounded-xl leading-relaxed overflow-x-auto">
                <span className="text-[10px] font-extrabold text-blue-400 block uppercase border-b border-slate-800 pb-1 font-mono">
                  BUDGET_CONTROL_RULES METADATA ENGINE CONTRACT
                </span>
                <pre>{JSON.stringify({
                  ruleName: "IFRS_BUDGET_VALIDATOR",
                  controlMatrix: {
                    defaultCurrency: "ETB",
                    overdraftAction: "HARD_BLOCK_GATE",
                    tolerancesPercentage: "10.0%",
                    signatoryRequirements: ["FIN_MANAGER", "AUDITOR_LEAD"]
                  }
                }, null, 2)}</pre>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

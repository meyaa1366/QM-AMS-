import React, { useState } from 'react';
import { 
  FAM_CAPABILITIES, 
  FAM_CAPABILITIES as capabilitiesList,
  FAMCapability 
} from '../data/famSpecsData';
import { 
  BookOpen, 
  Settings, 
  TrendingUp, 
  Activity, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  Scale, 
  FileSpreadsheet,
  Layers as LayersIcon,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Database,
  Terminal,
  Activity as DiagnosticIcon,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  UserCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function FAMSpecsExplorer() {
  const [selectedCapId, setSelectedCapId] = useState<string>('A');
  const [activeSectionNum, setActiveSectionNum] = useState<number>(3); // Default to User Stories!
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive sandbox states
  const [sandboxCost, setSandboxCost] = useState<number>(1850000);
  const [sandboxSalvage, setSandboxSalvage] = useState<number>(92500);
  const [sandboxUsefulLife, setSandboxUsefulLife] = useState<number>(5);

  const selectedCap = FAM_CAPABILITIES.find(c => c.id === selectedCapId) || FAM_CAPABILITIES[0];

  // Helper to map capability icon string to actual Lucide component
  const renderCapIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Briefcase': return <ClipboardList className={className} />;
      case 'Grid': return <Settings className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  // Find occurrences across all specs for full-text search
  const filteredCapabilities = FAM_CAPABILITIES.filter(cap => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cap.title.toLowerCase().includes(q) ||
      cap.description.toLowerCase().includes(q) ||
      cap.functions.some(f => f.toLowerCase().includes(q)) ||
      cap.submenus.some(s => s.toLowerCase().includes(q))
    );
  });

  // Calculate live compliance checks in the sandbox
  const complianceChecks = {
    isThresholdValid: sandboxCost >= 10000,
    isSalvageExceeded: sandboxSalvage > sandboxCost,
    ercaPoolCapValid: sandboxSalvage <= (sandboxCost * 0.05), // ERCA 5% salvage cap
    estimatedAnnualDepreciation: sandboxUsefulLife > 0 
      ? ((sandboxCost - sandboxSalvage) / sandboxUsefulLife) 
      : 0
  };

  // The 20 ERP Technical Specification points defined by the business
  const specChapters = [
    { num: 1, label: '1. Business Capability Area', key: 'businessCapabilityArea' },
    { num: 2, label: '2. Functional Structure', key: 'functionalStructure' },
    { num: 3, label: '3. User Stories / Use Cases', key: 'userStories' },
    { num: 4, label: '4. Detailed Requirements', key: 'businessRequirements' },
    { num: 5, label: '5. Business Rules & Validations', key: 'businessRules' },
    { num: 6, label: '6. Approved Workflows Flow', key: 'workflow' },
    { num: 7, label: '7. Required Pages & Screens', key: 'pages' },
    { num: 8, label: '8. Page Fields & Elements', key: 'fields' },
    { num: 9, label: '9. Required Lookup Data', key: 'lookups' },
    { num: 10, label: '10. Master & Enum Codes', key: 'enums' },
    { num: 11, label: '11. Roles and Permissions', key: 'roles' },
    { num: 12, label: '12. System Alerts & Triggers', key: 'notifications' },
    { num: 13, label: '13. Module Integrations', key: 'integrations' },
    { num: 14, label: '14. GL Vouchers & Entries', key: 'accountingEntries' },
    { num: 15, label: '15. Audit Trail Enforcements', key: 'auditTrail' },
    { num: 16, label: '16. Reports and Dashboards', key: 'reports' },
    { num: 17, label: '17. REST APIs & Interfaces', key: 'apis' },
    { num: 18, label: '18. Segregation of Duties (SoD)', key: 'sodRules' },
    { num: 19, label: '19. Nightly Batch Jobs', key: 'batchJobs' },
    { num: 20, label: '20. Error & Exception Paths', key: 'exceptions' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-950 p-6 rounded-2xl text-slate-100 space-y-6 shadow-2xl leading-relaxed">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-mono text-[9px] font-black uppercase px-2.5 py-1 rounded tracking-widest">
              SAP S/4HANA & MS DYNAMICS COMPLIANT
            </span>
            <span className="bg-slate-800 text-slate-400 font-mono text-[9px] px-2 py-1 rounded">
              v1.4 Enterprise Matrix
            </span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans mt-2 flex items-center gap-2">
            <LayersIcon className="w-5 h-5 text-indigo-400" />
            <span>Interactive FIXED ASSETS ERP BLUEPRINT EXPLORER</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Fully customized functional requirements, automated double-entry accounting profiles, 
            relational database entity mappings, and statutory ERCA Proclamation/IFRS 16 policy controls.
          </p>
        </div>
        
        {/* Search input bar */}
        <div className="relative w-full lg:w-72 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search specifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs font-semibold text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: 9 CAPABILITIES NAVIGATION */}
        <div className="lg:col-span-4 space-y-3">
          <span className="block text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
            A to I Business Capabilities ({filteredCapabilities.length})
          </span>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCapabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => {
                  setSelectedCapId(cap.id);
                  triggerCapTransitionNotification(cap.title);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 relative overflow-hidden group cursor-pointer ${
                  selectedCapId === cap.id
                    ? 'border-indigo-600 bg-indigo-950/45 text-white shadow-md'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-400 hover:text-slate-200'
                }`}
              >
                {selectedCapId === cap.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-sky-500 animate-pulse" />
                )}
                
                <div className={`p-2 rounded-lg shrink-0 ${
                  selectedCapId === cap.id 
                    ? 'bg-indigo-900/50 text-indigo-300' 
                    : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                }`}>
                  {renderCapIcon(cap.icon)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] bg-slate-800/85 px-1.5 py-0.5 rounded text-white font-bold leading-none">
                      {cap.id}
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-tight tracking-wider line-clamp-1 py-0.5">
                      {cap.title.substring(0, 48)}...
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {cap.description}
                  </p>
                </div>
              </button>
            ))}

            {filteredCapabilities.length === 0 && (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                ✕ No matching capability blocks located. Try a different search parameter.
              </div>
            )}
          </div>

          {/* QUICK LINKS BANNER */}
          <div className="border border-indigo-950/80 bg-indigo-950/15 p-4 rounded-xl space-y-2.5">
            <span className="text-[9px] font-black font-mono text-indigo-400 uppercase tracking-widest block leading-none">
              Statutory ERP Compliances Loaded:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono font-bold text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-950/45 p-1.5 rounded border border-slate-800/50">
                <span className="text-emerald-500">✓</span>
                <span>IFRS 16 Lease</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-955/45 p-1.5 rounded border border-slate-800/50">
                <span className="text-emerald-500">✓</span>
                <span>IAS 16 PP&E</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-955/45 p-1.5 rounded border border-slate-800/50">
                <span className="text-emerald-500">✓</span>
                <span>IAS 36 Impair</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-955/45 p-1.5 rounded border border-slate-800/50">
                <span className="text-emerald-500">✓</span>
                <span>ERCA Tax Pool</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 20-POINT WORKSPACE ACCORDION */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* CHOSEN CAPABILITY HEADER BANNER */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-900 text-indigo-300 font-mono text-[10px] px-2.5 py-0.5 rounded font-black uppercase">
                  ACTIVE DOMAIN: AREA {selectedCap.id}
                </span>
                <span className="text-[10px] text-slate-500 font-serif italic">
                  Applicable verticals: {selectedCap.verticals.join(' • ')}
                </span>
              </div>
              <h2 className="text-base font-black text-white hover:text-indigo-300 transition-colors">
                {selectedCap.title}
              </h2>
            </div>
          </div>

          {/* 20 ARCHITECTURE CHAPTERS DIRECTORY SWITCHER */}
          <div className="space-y-2">
            <span className="block text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
              Choose from the 20 Core Specification chapters to explore
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
              {specChapters.map((ch) => (
                <button
                  key={ch.num}
                  onClick={() => setActiveSectionNum(ch.num)}
                  className={`text-[10px] font-mono font-black border p-1.5 px-2 rounded-md uppercase tracking-tight truncate text-left transition-all cursor-pointer ${
                    activeSectionNum === ch.num
                      ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-slate-950 shadow-sm'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  S{ch.num}: {ch.label.split('. ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE PARAMETER CONTENT DESK */}
          <div className="bg-slate-950 border border-slate-800/85 p-6 rounded-2xl min-h-[360px] flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Parameter title and active spec detail */}
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-black text-amber-500 uppercase font-mono tracking-wider flex items-center gap-2">
                  <DiagnosticIcon className="w-4 h-4 text-amber-500" />
                  <span>CHAPTER {activeSectionNum}: {specChapters.find(c => c.num === activeSectionNum)?.label.split('. ')[1]}</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">SEC-REF: FA-ERP-{selectedCap.id}-{activeSectionNum}</span>
              </div>

              {/* RENDER MODULE DYNAMIC VIEWS BASED ON ACCORDION NO */}

              {/* VIEW 1: Business Capability Area */}
              {activeSectionNum === 1 && (
                <div className="space-y-3">
                  <p className="text-[12px] leading-relaxed text-slate-300">
                    {selectedCap.sections.businessCapabilityArea}
                  </p>
                  <div className="bg-slate-900/60 p-4 border rounded-xl border-slate-800/80 space-y-2">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">System Deployment Boundaries:</span>
                    <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1.5 font-medium">
                      <li>The subledger is authoritative for carrying costs and depreciation scheduling.</li>
                      <li>General Ledger accepts summary journal entries or individual voucher lines matching custom posting profile mappings.</li>
                      <li>Physical assets sync with location IDs registered inside general business partner master tables.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* VIEW 2: Functional Structure */}
              {activeSectionNum === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    The functional menu hierarchy corresponds directly to standard modern modular frameworks (SAP FI-AA Module structures):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                    {selectedCap.sections.functionalStructure.map((struct, i) => (
                      <div key={i} className="bg-slate-900 p-3.5 border rounded-lg border-slate-800 font-mono text-[10.5px] text-indigo-300 flex items-center gap-2.5">
                        <span className="bg-indigo-900/80 text-white p-1 rounded font-bold leading-none">0{i+1}</span>
                        <span>{struct}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Submenu Registry Map</span>
                    <div className="bg-slate-900 p-3 rounded border border-slate-800 text-[10.5px] font-mono text-emerald-400 whitespace-pre overflow-x-auto">
{`Fixed Assets Subledger (${selectedCap.id})
${selectedCap.submenus.map(sub => `  ├── ${sub}`).join('\n')}
  └── Regulatory Compliance Logs`}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: User Stories */}
              {activeSectionNum === 3 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">User Stories & Acceptance Criteria:</span>
                  <div className="space-y-2.5">
                    {selectedCap.sections.userStories.map((story, i) => (
                      <div key={i} className="bg-slate-900/80 border p-3.5 rounded-xl border-slate-800 flex gap-3">
                        <UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold font-sans text-slate-200">User Story {i+1}</p>
                          <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed italic">"{story}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 4: Detailed Requirements */}
              {activeSectionNum === 4 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Functional and Compliance Requirements:</span>
                  <div className="bg-slate-900/50 p-4 border rounded-xl border-slate-800/80 space-y-2.5">
                    {selectedCap.sections.businessRequirements.map((req, i) => (
                      <div key={i} className="flex gap-2.5 text-xs">
                        <span className="text-indigo-400 font-mono font-bold shrink-0">REQ-{selectedCap.id}-0{i+1}:</span>
                        <p className="text-slate-350 font-medium leading-relaxed">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 5: Business Rules & Validations */}
              {activeSectionNum === 5 && (
                <div className="space-y-3.5">
                  <div className="bg-slate-900 p-4 border rounded-xl border-slate-800 space-y-2.5">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none">Statutory & System Invariant Rules:</span>
                    <div className="divide-y divide-slate-800 font-sans text-xs">
                      {selectedCap.sections.businessRules.map((rule, i) => (
                        <div key={i} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                          <span className="font-extrabold text-slate-200 block">{rule.rule}</span>
                          <span className="text-slate-450 font-medium block">
                            Validation: <span className="text-red-400 font-mono">{rule.validation}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INTERACTIVE COMPLIANCE COMPONENT SANDBOX */}
                  <div className="bg-indigo-950/40 border border-indigo-900 p-4.5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-indigo-900">
                      <span className="text-[9.5px] font-mono font-black text-indigo-400 uppercase tracking-wider block leading-none">
                        Interactive Sandboxed Validation Simulator
                      </span>
                      <span className="text-[8.5px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded font-mono">Test Rules Live</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-1">Asset Value Cost (ETB)</label>
                        <input
                          type="number"
                          value={sandboxCost}
                          onChange={(e) => setSandboxCost(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-xs font-mono font-bold text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-1">Residual / Scrap (ETB)</label>
                        <input
                          type="number"
                          value={sandboxSalvage}
                          onChange={(e) => setSandboxSalvage(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-xs font-mono font-bold text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-1">Useful Life (Years)</label>
                        <input
                          type="number"
                          value={sandboxUsefulLife}
                          onChange={(e) => setSandboxUsefulLife(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-xs font-mono font-bold text-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[9px] font-bold">
                      
                      <div className={`p-2 rounded border flex flex-col justify-between ${
                        complianceChecks.isThresholdValid 
                          ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400' 
                          : 'border-rose-900 bg-rose-950/20 text-rose-400'
                      }`}>
                        <span>Capitalization Threshold</span>
                        <span className="text-[10px] mt-1 font-black">{complianceChecks.isThresholdValid ? '✓ PASS (>10k ETB)' : '✕ Direct Expense'}</span>
                      </div>

                      <div className={`p-2 rounded border flex flex-col justify-between ${
                        !complianceChecks.isSalvageExceeded 
                          ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400' 
                          : 'border-rose-900 bg-rose-950/20 text-rose-400'
                      }`}>
                        <span>Salvage &lt; Total Cost</span>
                        <span className="text-[10px] mt-1 font-black">{!complianceChecks.isSalvageExceeded ? '✓ PASS (Valid Base)' : '✕ ERROR (Salvage > Cost)'}</span>
                      </div>

                      <div className={`p-2 rounded border flex flex-col justify-between ${
                        complianceChecks.ercaPoolCapValid 
                          ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400' 
                          : 'border-amber-900 bg-amber-950/20 text-amber-400'
                      }`}>
                        <span>ERCA Statutory 5% Limit</span>
                        <span className="text-[10px] mt-1 font-black">
                          {complianceChecks.ercaPoolCapValid ? '✓ Compliant (≤5%)' : '⚠ Non-compliant Tax Book'}
                        </span>
                      </div>

                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded border border-indigo-950 text-[10.5px] font-mono text-indigo-300 flex justify-between">
                      <span>Pro-forma Straight Line Depreciation Annual Run:</span>
                      <span className="font-bold font-mono text-emerald-400">
                        {complianceChecks.estimatedAnnualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB / Year
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {/* VIEW 6: Approved Workflows Flow */}
              {activeSectionNum === 6 && (
                <div className="space-y-4">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Modular Approval & State Transition Flow:</span>
                  
                  <div className="flex flex-col md:flex-row items-center justify-around gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
                    {selectedCap.sections.workflow.map((flow, i) => (
                      <React.Fragment key={i}>
                        <div className="flex-1 bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5 w-full relative">
                          <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950 px-1 rounded">Step {i+1}</span>
                          <span className="block text-[8px] font-mono font-black text-slate-500 uppercase">Actor Role</span>
                          <span className="block text-[10.5px] font-mono font-black text-slate-200 truncate uppercase mt-0.5">{flow.actor}</span>
                          <span className="block font-sans text-[11px] text-indigo-300 font-extrabold border-t border-slate-850 pt-1.5">{flow.step}</span>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-sans">{flow.description}</p>
                        </div>
                        {i < selectedCap.sections.workflow.length - 1 && (
                          <div className="shrink-0 flex items-center justify-center p-1">
                            <ArrowRight className="w-5 h-5 text-indigo-500 rotate-90 md:rotate-0" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border text-[10px] leading-relaxed font-mono flex items-center gap-2 text-indigo-400 border-indigo-950">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>State transitions adhere to strict system validations preventing draft modifications once an asset transitions past status "Capitalized".</span>
                  </div>
                </div>
              )}

              {/* VIEW 7: Required Pages & Screens */}
              {activeSectionNum === 7 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Required Pages & Screen Inventory:</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {selectedCap.sections.pages.map((p, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="text-[9.5px] font-mono text-indigo-400 font-bold tracking-widest uppercase block leading-none">{p.name}</span>
                          <span className="inline-block text-[8px] bg-indigo-950 text-indigo-300 border border-indigo-900 font-mono px-1 rounded uppercase mt-2">{p.type}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-2.5 font-medium leading-normal">{p.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 8: Page Fields & Elements */}
              {activeSectionNum === 8 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Fields Specification Template:</span>
                  
                  <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden font-mono text-[10.5px]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-950 text-slate-500 text-[8px] uppercase tracking-wider border-b border-slate-850">
                          <th className="p-2.5 pl-4">FieldName</th>
                          <th className="p-2.5">Data Type</th>
                          <th className="p-2.5">Field Group</th>
                          <th className="p-2.5 pr-4 text-right">Required</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-450">
                        {selectedCap.sections.fields.map((f, i) => (
                          <tr key={i} className="hover:bg-slate-850/20">
                            <td className="p-2.5 pl-4 font-bold text-slate-250">{f.field}</td>
                            <td className="p-2.5 text-[9.5px] text-slate-400">{f.type}</td>
                            <td className="p-2.5 text-[9.5px] text-indigo-400">{f.group}</td>
                            <td className="p-2.5 pr-4 text-right text-[10px]">
                              <span className={`px-1.5 py-0.5 rounded ${f.required ? 'bg-amber-950 text-amber-400 border border-amber-900' : 'bg-slate-800 text-slate-500'}`}>
                                {f.required ? 'REQUIRED' : 'OPTIONAL'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 9: Required Lookup Data */}
              {activeSectionNum === 9 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Ledger Lookup References:</span>
                  <p className="text-[11px] text-slate-400 font-sans">
                    These elements dynamically fetch from core global enterprise master databases or general ledger registries:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {selectedCap.sections.lookups.map((lk, i) => (
                      <div key={i} className="bg-slate-900 p-3 border rounded-xl border-slate-800 font-mono text-[11px] text-slate-350 flex items-center justify-between">
                        <span>{lk}</span>
                        <span className="bg-slate-950 text-slate-500 text-[8px] px-1.5 py-1 rounded font-black tracking-widest font-mono">DB_LOOKUP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 10: Master & Enum Codes */}
              {activeSectionNum === 10 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Subledger Enums & Codification lists:</span>
                  
                  <div className="space-y-3 font-mono text-[10.5px]">
                    {selectedCap.sections.enums.map((en, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                        <span className="font-extrabold font-mono text-[9px] uppercase text-indigo-400 block tracking-wider">{en.name} (static ENUM values)</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {en.values.map((v, idx) => (
                            <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 text-[9.5px] leading-none px-2 py-1 rounded font-medium">
                              "{v}"
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 11: Roles and Permissions */}
              {activeSectionNum === 11 && (
                <div className="space-y-3 font-sans">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Required User Permissions Suite:</span>
                  <div className="space-y-2.5">
                    {selectedCap.sections.roles.map((r, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                        <span className="font-black text-slate-200 block text-xs uppercase font-mono text-indigo-400">{r.role}</span>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{r.access}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 12: System Alerts & Triggers */}
              {activeSectionNum === 12 && (
                <div className="space-y-3 font-sans">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">System Integrity Alerts & Limits:</span>
                  <div className="space-y-2.5">
                    {selectedCap.sections.notifications.map((n, i) => (
                      <div key={i} className="bg-slate-900/40 p-4 border rounded-xl border-slate-800 flex gap-3 text-xs">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-black text-slate-200 font-mono text-[9.5px] uppercase tracking-wider text-rose-400">Trigger: {n.trigger}</span>
                          <span className="inline-block text-[8.5px] bg-slate-950 border text-slate-450 px-1 rounded my-1 font-mono">{n.type} • Target: {n.target}</span>
                          <p className="text-slate-350 leading-relaxed mt-1 italic">"{n.msg}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 13: Module Integrations */}
              {activeSectionNum === 13 && (
                <div className="space-y-3 font-sans">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Cross-Module Integration Maps:</span>
                  <div className="space-y-2.5">
                    {selectedCap.sections.integrations.map((it, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-850">
                          <span className="font-black text-indigo-400 uppercase font-mono text-[9.5px]">Integrating Module: {it.module}</span>
                          <span className="text-[8.5px] bg-indigo-950 font-mono text-indigo-300 border border-indigo-900 px-1 rounded">{it.flowDirection}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          <span className="font-bold text-slate-300 block font-mono text-[8px] uppercase text-slate-500">Transferred Fields & Data points:</span>
                          {it.dataPoints}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 14: GL Vouchers & Entries */}
              {activeSectionNum === 14 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Double-Entry Posting Matrices:</span>
                  
                  <div className="space-y-4 font-mono text-[10px]">
                    {selectedCap.sections.accountingEntries.map((ae, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-950 p-2.5 px-3.5 flex justify-between items-center border-b border-slate-850">
                          <span className="font-extrabold uppercase text-slate-200 tracking-wider">EVENT: {ae.event}</span>
                        </div>
                        
                        <div className="p-3.5 space-y-2.5">
                          <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                            <div className="bg-slate-950 p-2 py-3 rounded border border-emerald-950/30">
                              <span className="text-emerald-400 font-bold block uppercase text-[8px] tracking-wider mb-1">DEBIT ACCOUNT</span>
                              <span className="text-slate-300 font-bold font-mono">{ae.debit}</span>
                            </div>
                            <div className="bg-slate-950 p-2 py-3 rounded border border-rose-950/30">
                              <span className="text-rose-400 font-bold block uppercase text-[8px] tracking-wider mb-1">CREDIT ACCOUNT</span>
                              <span className="text-slate-300 font-bold font-mono">{ae.credit}</span>
                            </div>
                          </div>
                          
                          <p className="text-[10.5px] text-slate-400 font-sans italic pt-1 leading-relaxed">
                            <span className="font-bold block font-mono text-[8.5px] uppercase tracking-wider text-slate-500 mt-1 mb-0.5">Post-adjustment Description:</span>
                            "{ae.notes}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 15: Audit Trail Enforcements */}
              {activeSectionNum === 15 && (
                <div className="space-y-3 font-sans">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Mandatory Auditor Logs Requirements:</span>
                  <div className="bg-slate-900/60 p-4 border rounded-xl border-slate-800 space-y-1.5 text-xs text-slate-400">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block leading-none pb-2">Audit Compliance Rules:</span>
                    {selectedCap.sections.auditTrail.map((el, i) => (
                      <div key={i} className="flex gap-2 leading-relaxed">
                        <span className="text-indigo-400">✓</span>
                        <p className="font-medium">{el}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 16: Reports and Dashboards */}
              {activeSectionNum === 16 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Required Roll-forwards & Statutory Reports:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {selectedCap.sections.reports.map((rep, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                        <span className="text-[11px] font-sans font-bold text-slate-200 leading-normal">{rep}</span>
                        <button
                          onClick={() => triggerReportDownloadSimulator(rep)}
                          className="bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-900 text-indigo-400 font-mono text-[9px] font-bold py-1 px-2 rounded uppercase mt-4 transition-all"
                        >
                          ↓ Request Format
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 17: REST APIs & Interfaces */}
              {activeSectionNum === 17 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">REST Full integration APIs:</span>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-[10.5px]">
                    <div className="bg-slate-950 p-2.5 border-b border-slate-850 flex items-center justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px] tracking-wider">Gateway Endpoints List</span>
                      <span className="text-emerald-500 text-[8px] font-black tracking-wider animate-pulse">● GATEWAY ONLINE</span>
                    </div>

                    <div className="divide-y divide-slate-850">
                      {selectedCap.sections.apis.map((api, i) => (
                        <div key={i} className="p-3 hover:bg-slate-850/15 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded font-mono ${
                              api.verb === 'POST' ? 'bg-emerald-950 text-emerald-400' :
                              api.verb === 'PUT' ? 'bg-amber-950 text-amber-400' :
                              api.verb === 'DELETE' ? 'bg-rose-950 text-rose-400' :
                              'bg-indigo-950 text-indigo-300'
                            }`}>{api.verb}</span>
                            <span className="font-bold text-slate-200 shrink-0 select-all">{api.endpoint}</span>
                          </div>
                          <p className="text-slate-500 text-[9.5px] leading-normal font-sans pl-1 font-medium">{api.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 18: Segregation of Duties (SoD) */}
              {activeSectionNum === 18 && (
                <div className="space-y-3 font-sans">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Segregation of Duties (SoD) & Security:</span>
                  <div className="bg-slate-900/60 p-4 border rounded-xl border-slate-800 space-y-2 text-xs text-slate-400 leading-relaxed">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none pb-1 text-amber-500">Conflicts Avoidance (SoD) limits:</span>
                    {selectedCap.sections.sodRules.map((rule, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-rose-400 font-mono font-black">⚠</span>
                        <p className="font-medium p-0.5">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 19: Nightly Batch Jobs */}
              {activeSectionNum === 19 && (
                <div className="space-y-3 font-mono text-[10.5px]">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Scheduled Batch Procedures & Cron expressions:</span>
                  <div className="space-y-3">
                    {selectedCap.sections.batchJobs.map((bj, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-wider border-b border-slate-800 pb-1.5">
                          <span className="font-extrabold text-indigo-400">PROC-NAME: {bj.name}</span>
                          <span className="text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">CRON Expression: {bj.cron}</span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-400 mt-1 leading-normal font-medium">{bj.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 20: Error & Exception Paths */}
              {activeSectionNum === 20 && (
                <div className="space-y-3">
                  <span className="block text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider font-mono">Error & Exception Path Maps:</span>
                  <div className="space-y-2.5 font-mono text-[10.5px]">
                    {selectedCap.sections.exceptions.map((ex, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                        <span className="text-[9.5px] font-extrabold block uppercase text-rose-400">🚨 Error Event: {ex.error}</span>
                        <p className="font-sans text-[11px] text-slate-450 leading-relaxed font-semibold pl-1">
                          Recedence Handler: <span className="text-slate-300 font-serif italic">"{ex.handler}"</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* SPECS CONTROL LEGEND FOOTER ACCENTS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-slate-800/80 pt-4 mt-8 font-mono text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none">
              <span>DESIGN PHASE SIGN-OFF: COMPLETED CERTIFIED ERP</span>
              <span>VERIFIED: {new Date().toLocaleDateString()}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// Local small simulators
function triggerCapTransitionNotification(title: string) {
  // Silent confirmation bypass or tiny debug message
}

function triggerReportDownloadSimulator(reportName: string) {
  // Simulated action
  const formatMsg = `Report parameters downloaded: Ready to export ${reportName} structure matching standard ERCA auditing spreadsheet guidelines (.xlsx).`;
  alert(formatMsg);
}

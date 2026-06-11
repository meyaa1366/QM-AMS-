import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import COARegisterTab from './components/COARegisterTab';
import AddEditAccountTab from './components/AddEditAccountTab';
import EnumMasterTab from './components/EnumMasterTab';
import LookupMasterTab from './components/LookupMasterTab';
import LookupDataTab from './components/LookupDataTab';
import VoucherRegistryView from './components/VoucherRegistryView';
import FinancialStatementsTab from './components/FinancialStatementsTab';
import LedgerCardTab from './components/LedgerCardTab';
import JournalRegisterTab from './components/JournalRegisterTab';
import FiscalPeriodTab from './components/FiscalPeriodTab';
import DevImplementationGuideTab from './components/DevImplementationGuideTab';
import { 
  IFRSClassificationTab, 
  EthiopianTaxTab, 
  SubsidiaryLedgerTab, 
  PostingControlTab, 
  BackendRulesTab, 
  ValidationMessagesTab, 
  APIEndpointsTab, 
  ImportTemplateTab, 
  AuditTrailTab 
} from './components/SpecsTabHolders';

import { Account, EnumValue, LookupValue, AuditLogEntry, AccountStatus, ApprovalStatus, VoucherType } from './types';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_ENUM_VALUES, 
  INITIAL_LOOKUP_VALUES, 
  INITIAL_AUDIT_LOGS,
  INITIAL_VOUCHERS
} from './data';

import { 
  X, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  FileMinus,
  Sparkles,
  RefreshCw,
  Coins
} from 'lucide-react';

export default function App() {
  // Navigation: Active Tab of the 14 standard sheets requested
  const [activeTab, setActiveTab] = useState<string>('coa-register');
  
  // Shared Search Term
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active ledger master lists (Dynamic local persistence in component stack)
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [enumValues, setEnumValues] = useState<EnumValue[]>(INITIAL_ENUM_VALUES);
  const [lookupValues, setLookupValues] = useState<LookupValue[]>(INITIAL_LOOKUP_VALUES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>(INITIAL_VOUCHERS);

  // Buffer state when editing a ledger account
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Interactive filter on Audit Trail log
  const [auditFilterCode, setAuditFilterCode] = useState<string>('');

  // Dropdown filter key for Lookup Data
  const [lookupGroupFilter, setLookupGroupFilter] = useState<string>('All');

  // Floating temporary toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Interactive "Post Journal" overlay (preserved for operational double-entry simulation)
  const [showPostJournal, setShowPostJournal] = useState<boolean>(false);
  const [journalDebitCode, setJournalDebitCode] = useState<string>('');
  const [journalCreditCode, setJournalCreditCode] = useState<string>('');
  const [journalAmount, setJournalAmount] = useState<string>('5000');
  const [journalMemo, setJournalMemo] = useState<string>('Adjust cash in transfer balance');
  const [postingProgress, setPostingProgress] = useState<boolean>(false);

  // Trigger floating HUD notifications
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Voucher Presets Handlers
  const handleSaveVoucher = (updated: VoucherType) => {
    setVoucherTypes(prev => prev.map(v => v.code === updated.code ? updated : v));
    triggerToast(`Voucher [${updated.code}] configuration updated directly in QM AMS registry!`);
  };

  const handleAddVoucher = (news: VoucherType) => {
    setVoucherTypes(prev => {
      if (prev.some(v => v.code === news.code)) {
        return prev.map(v => v.code === news.code ? news : v);
      }
      return [...prev, news];
    });
    triggerToast(`Registered new Voucher template [${news.code}] successfully!`);
  };

  const triggerVoucherLog = (user: string, action: string, type: 'info' | 'edited' | 'created' | 'warning') => {
    const log: AuditLogEntry = {
      id: `AUD-VCH-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: user || 'MZerihun',
      action: type.toUpperCase(),
      entityType: 'VOUCHER_CONFIG',
      entityKey: 'SYSTEM',
      description: action
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Nav actions
  const handleAddNewAccount = () => {
    setSelectedAccount(null);
    setActiveTab('add-edit-account');
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setActiveTab('add-edit-account');
    triggerToast(`Loaded [${account.code}] configuration to editor.`, "info");
  };

  // State manipulation for Ledger submissions
  const handleSubmitAccountForReview = (id: string) => {
    const fresh = accounts.map(a => {
      if (a.id === id) {
        // Log action
        const log: AuditLogEntry = {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString(),
          user: 'mzerihun01@gmail.com',
          action: 'SUBMIT_FOR_APPROVAL',
          entityType: 'GL_ACCOUNT',
          entityKey: a.code,
          description: `Submitted account code [${a.code}] to the auditor validation queue.`,
          payloadBefore: JSON.stringify(a),
          payloadAfter: JSON.stringify({ ...a, approvalStatus: 'Submitted', status: 'Pending Approval' })
        };
        setAuditLogs([log, ...auditLogs]);
        return { ...a, approvalStatus: 'Submitted' as ApprovalStatus, status: 'Pending Approval' as AccountStatus };
      }
      return a;
    });

    setAccounts(fresh);
    triggerToast("Ledger account submitted to senior auditor approval queue.", "success");
  };

  const handleApproveAccount = (id: string) => {
    const fresh = accounts.map(a => {
      if (a.id === id) {
        const log: AuditLogEntry = {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString(),
          user: 'senior_auditor@fincorp.com',
          action: 'APPROVE_ACCOUNT',
          entityType: 'GL_ACCOUNT',
          entityKey: a.code,
          description: `Formally approved account code [${a.code}]. Unlocked for postings.`,
          payloadBefore: JSON.stringify(a),
          payloadAfter: JSON.stringify({ ...a, approvalStatus: 'Approved', status: 'Active', approvedBy: 'senior_auditor@fincorp.com' })
        };
        setAuditLogs([log, ...auditLogs]);
        return { ...a, approvalStatus: 'Approved' as ApprovalStatus, status: 'Active' as AccountStatus, approvedBy: 'senior_auditor@fincorp.com' };
      }
      return a;
    });

    setAccounts(fresh);
    triggerToast("Ledger account signed and set active.", "success");
  };

  const handleRejectAccount = (id: string) => {
    const fresh = accounts.map(a => {
      if (a.id === id) {
        const log: AuditLogEntry = {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString(),
          user: 'senior_auditor@fincorp.com',
          action: 'REJECT_ACCOUNT',
          entityType: 'GL_ACCOUNT',
          entityKey: a.code,
          description: `Rejected and returned account code [${a.code}] back to Draft state.`,
          payloadBefore: JSON.stringify(a),
          payloadAfter: JSON.stringify({ ...a, approvalStatus: 'Rejected', status: 'Draft' })
        };
        setAuditLogs([log, ...auditLogs]);
        return { ...a, approvalStatus: 'Rejected' as ApprovalStatus, status: 'Draft' as AccountStatus };
      }
      return a;
    });

    setAccounts(fresh);
    triggerToast("Ledger account returned to Draft state with alignment recommendations.", "info");
  };

  const handleUpdateStatus = (id: string, nextStatus: AccountStatus) => {
    const fresh = accounts.map(a => {
      if (a.id === id) {
        const log: AuditLogEntry = {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          timestamp: new Date().toISOString(),
          user: 'mzerihun01@gmail.com',
          action: nextStatus === 'Inactive' ? 'DEACTIVATE_ACCOUNT' : 'ACTIVATE_ACCOUNT',
          entityType: 'GL_ACCOUNT',
          entityKey: a.code,
          description: `Changed status of is ${a.code} to ${nextStatus}.`,
          payloadBefore: JSON.stringify(a),
          payloadAfter: JSON.stringify({ ...a, status: nextStatus })
        };
        setAuditLogs([log, ...auditLogs]);
        return { ...a, status: nextStatus };
      }
      return a;
    });

    setAccounts(fresh);
    triggerToast(`Account status set to: ${nextStatus}.`, "success");
  };

  const handleJumpToAuditTrail = (code: string) => {
    setSearchQuery(code);
    setActiveTab('audit-trail');
    triggerToast(`Filtered logs for ledger code [${code}]`, "info");
  };

  // Merge Save / Create Account callbacks
  const handleSaveAccount = (newAccount: Account) => {
    const exists = accounts.some(a => a.id === newAccount.id);
    const beforeState = exists ? JSON.stringify(accounts.find(a => a.id === newAccount.id)) : "";
    
    let updatedAccounts = [...accounts];
    if (exists) {
      updatedAccounts = accounts.map(a => a.id === newAccount.id ? newAccount : a);
      setAccounts(updatedAccounts);
      
      const audit: AuditLogEntry = {
        id: `AUD-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString(),
        user: 'mzerihun01@gmail.com',
        action: 'UPDATE_ACCOUNT',
        entityType: 'GL_ACCOUNT',
        entityKey: newAccount.code,
        description: `Modified GL account [${newAccount.code}]. Adjusted posting or tax compliance mapping matrices.`,
        payloadBefore: beforeState,
        payloadAfter: JSON.stringify(newAccount)
      };
      setAuditLogs([audit, ...auditLogs]);
      triggerToast(`Account [${newAccount.code}] successfully updated.`, "success");
    } else {
      updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      
      const audit: AuditLogEntry = {
        id: `AUD-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString(),
        user: 'mzerihun01@gmail.com',
        action: 'CREATE_ACCOUNT',
        entityType: 'GL_ACCOUNT',
        entityKey: newAccount.code,
        description: `Created new GL account [${newAccount.code}] under parent folders. Initial draft.`,
        payloadAfter: JSON.stringify(newAccount)
      };
      setAuditLogs([audit, ...auditLogs]);
      triggerToast(`Account [${newAccount.code}] created and stored in memory.`, "success");
    }
    
    setActiveTab('coa-register');
  };

  // Add Enum entry dynamically
  const handleAddEnumValue = (newVal: EnumValue) => {
    setEnumValues([...enumValues, newVal]);
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString(),
      user: 'mzerihun01@gmail.com',
      action: 'ADD_ENUM_VALUE',
      entityType: 'ENUM_MASTER',
      entityKey: newVal.backendKey,
      description: `Registered new Enum value display "${newVal.displayName}" for group Category "${newVal.enumGroup}".`,
      payloadAfter: JSON.stringify(newVal)
    };
    setAuditLogs([audit, ...auditLogs]);
    triggerToast(`Added "${newVal.displayName}" to ${newVal.enumGroup}.`, "success");
  };

  // Add lookup value dynamically
  const handleAddLookupValue = (val: LookupValue) => {
    setLookupValues([...lookupValues, val]);
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString(),
      user: 'mzerihun01@gmail.com',
      action: 'ADD_LOOKUP_VALUE',
      entityType: 'LOOKUP_DATA',
      entityKey: val.code,
      description: `Registered new lookup index [${val.code}] under Group Key "${val.groupKey}".`,
      payloadAfter: JSON.stringify(val)
    };
    setAuditLogs([audit, ...auditLogs]);
    triggerToast(`Created lookup code "${val.code}" successfully.`, "success");
  };

  const handleBrowseLookupGroup = (groupKey: string) => {
    setLookupGroupFilter(groupKey);
    setActiveTab('lookup-data');
    triggerToast(`Filtered Lookup data for category "${groupKey}".`, "info");
  };

  // Core Actions from sidebar (Replaces Post Daily Journal button with specified controls)
  const handleSidebarCreateAccount = () => {
    setSelectedAccount(null);
    setActiveTab('add-edit-account');
    triggerToast("Editor reset for new account entry.", "info");
  };

  const handleSidebarImportCOA = () => {
    setActiveTab('import-template');
    triggerToast("Loaded spreadsheets specification template.", "info");
  };

  const handleSidebarValidateSetup = () => {
    setActiveTab('validation-messages');
    triggerToast("Loaded dynamic setup validation deck.", "info");
  };

  // Export dynamically stored dictionaries directly to a JSON file! (Item 7 resolution)
  const handleSidebarExportSetup = () => {
    try {
      const exportObject = {
        meta: {
          system: "QM AMS Audit Suite",
          scope: "Chart of Accounts setup & Audit Checklist workbook",
          exportedAt: new Date().toISOString(),
          compliance_governance: "IAS / IFRS standard & ERCA Ethiopia codes mapping"
        },
        payload: {
          accounts,
          enumValues,
          lookupValues,
          auditLogs
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "QM_AMS_COA_Setup_Specs.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("IFRS Chart of Accounts Specs exported successfully as JSON.", "success");
    } catch (e) {
      triggerToast("Export failed: out of bounds browser error.", "error");
    }
  };

  // Simulator Double entry transaction postings
  const handlePostJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalDebitCode || !journalCreditCode) {
      alert("Please identify valid Debit and Credit ledger accounts.");
      return;
    }
    if (journalDebitCode === journalCreditCode) {
      alert("Ledger validation clash: Debit and Credit codes must represent distinct ledger positions.");
      return;
    }
    const amt = parseFloat(journalAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid numeric amount.");
      return;
    }

    setPostingProgress(true);
    setTimeout(() => {
      setPostingProgress(false);
      setShowPostJournal(false);

      // Create Audit log of transaction posting
      const audit: AuditLogEntry = {
        id: `AUD-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString(),
        user: 'mzerihun01@gmail.com',
        action: 'POST_JOURNAL_ENTRY',
        entityType: 'TRANSACTION_LEDGER',
        entityKey: `REC-${Date.now().toString().slice(-3)}`,
        description: `Posted double-entry balanced journal. Transfered ${amt.toLocaleString()} ETB. Debit: ${journalDebitCode}, Credit: ${journalCreditCode}. Memo: "${journalMemo}"`
      };
      setAuditLogs([audit, ...auditLogs]);

      triggerToast(`Double-entry Journal Posted: ${amt.toLocaleString()} ETB transferred. Mapped audit trail.`, "success");
      
      // Reset State
      setJournalDebitCode('');
      setJournalCreditCode('');
      setJournalAmount('5000');
      setJournalMemo('Adjust cash in transfer balance');
    }, 1200);
  };

  return (
    <div id="finance-dashboard-root" className="min-h-screen bg-[#fcfdff]">
      {/* Grouped Sidebar - Replaced Post Journal button with dynamic operations */}
      <Sidebar 
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        onCreateAccount={handleSidebarCreateAccount}
        onImportCOA={handleSidebarImportCOA}
        onValidateSetup={handleSidebarValidateSetup}
        onExportSetup={handleSidebarExportSetup}
      />

      {/* Header bar */}
      <Header 
        activeScreen={activeTab}
        onScreenChange={(screen) => {
          setActiveTab(screen);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewEntryOpen={() => {
          setActiveTab('add-edit-account');
        }}
        onExport={(format) => {
          alert(`Generating compliant IFRS statement in ${format} format... Compiled from dynamic ledger mappings!`);
        }}
        notificationsCount={12}
        onNotificationsClick={() => {
          alert("QM AMS Auditing Hub: 12 corporate ledger accounts updated within ERCA thresholds.");
        }}
      />

      {/* Main Content Workspace viewport */}
      <main className="pl-[280px] pt-16 pb-20 select-none">
        {/* Floating Journal trigger */}
        <div className="bg-slate-100/80 px-6 py-2.5 border-b border-outline-variant/60 flex justify-between items-center text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-600">IFRS Active Schema: <span className="font-bold text-slate-800">QM AMS Audit Group Workspace (v4.1)</span></span>
          </div>

          <button
            onClick={() => setShowPostJournal(true)}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 border border-indigo-200 rounded"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Simulate Journal Entry Transfer</span>
          </button>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          
          {/* TAB 1: COA Register */}
          {activeTab === 'coa-register' && (
            <COARegisterTab 
              accounts={accounts}
              onEditAccount={handleEditAccount}
              onSubmitAccount={handleSubmitAccountForReview}
              onApproveAccount={handleApproveAccount}
              onRejectAccount={handleRejectAccount}
              onUpdateStatus={handleUpdateStatus}
              onViewAuditTrail={handleJumpToAuditTrail}
              searchQuery={searchQuery}
            />
          )}

          {/* TAB: Financial Statements & Compliant Reports */}
          {(activeTab === 'financial-statements' || 
            activeTab === 'balance-sheet' || 
            activeTab === 'income-statement' || 
            activeTab === 'cashflows' || 
            activeTab === 'changes-equity') && (
            <FinancialStatementsTab 
              accounts={accounts} 
              activeView={
                activeTab === 'balance-sheet' ? 'BS' :
                activeTab === 'income-statement' ? 'PL' :
                activeTab === 'cashflows' ? 'CF' :
                activeTab === 'changes-equity' ? 'EQ' : 'TB'
              }
              onViewChange={(view) => {
                const tabMap = { 'BS': 'balance-sheet', 'PL': 'income-statement', 'CF': 'cashflows', 'EQ': 'changes-equity', 'TB': 'financial-statements' };
                setActiveTab(tabMap[view] || 'balance-sheet');
              }}
            />
          )}

          {/* TAB: Ethiopian General Ledger Cards */}
          {activeTab === 'ledger-card' && (
            <LedgerCardTab accounts={accounts} />
          )}

          {/* TAB: General Journal Transaction Registers */}
          {activeTab === 'journal-register' && (
            <JournalRegisterTab accounts={accounts} auditLogs={auditLogs} />
          )}

          {/* TAB: Fiscal Year & Period Setup */}
          {activeTab === 'fiscal-period' && (
            <FiscalPeriodTab 
              onAddAuditLog={(log) => {
                setAuditLogs(prev => [log, ...prev]);
                triggerToast(`Audit log registered: ${log.description}`, 'info');
              }}
            />
          )}

          {/* TAB 2: Add/Edit Account Form */}
          {activeTab === 'add-edit-account' && (
            <AddEditAccountTab 
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSave={handleSaveAccount}
              onCancel={() => {
                setActiveTab('coa-register');
                triggerToast("Form adjustments canceled.", "info");
              }}
            />
          )}

          {/* TAB 3: Enum Master */}
          {activeTab === 'enum-master' && (
            <EnumMasterTab 
              enumValues={enumValues}
              onAddEnumValue={handleAddEnumValue}
            />
          )}

          {/* TAB 4: Lookup Master */}
          {activeTab === 'lookup-master' && (
            <LookupMasterTab 
              onNavigateToData={handleBrowseLookupGroup}
            />
          )}

          {/* TAB 5: Lookup Data */}
          {activeTab === 'lookup-data' && (
            <LookupDataTab 
              lookupValues={lookupValues}
              onAddLookupValue={handleAddLookupValue}
              selectedGroupFilter={lookupGroupFilter}
              onSetGroupFilter={setLookupGroupFilter}
            />
          )}

          {/* TAB 6: IFRS Classification */}
          {activeTab === 'ifrs-classification' && <IFRSClassificationTab />}

          {/* TAB 7: Ethiopian Tax Mapping */}
          {activeTab === 'ethiopian-tax' && <EthiopianTaxTab />}

          {/* TAB 8: Subsidiary Ledger Setup */}
          {activeTab === 'subledger-setup' && <SubsidiaryLedgerTab />}

          {/* TAB 9: Posting Control Matrix */}
          {activeTab === 'posting-matrix' && (
            <VoucherRegistryView 
              voucherTypes={voucherTypes}
              onSaveVoucher={handleSaveVoucher}
              onAddVoucher={handleAddVoucher}
              triggerLog={triggerVoucherLog}
            />
          )}

          {/* TAB 10: Backend Business Rules */}
          {activeTab === 'business-rules' && <BackendRulesTab />}

          {/* TAB 11: Validation Messages */}
          {activeTab === 'validation-messages' && (
            <ValidationMessagesTab accounts={accounts} />
          )}

          {/* TAB 12: API Endpoints */}
          {activeTab === 'api-endpoints' && <APIEndpointsTab />}

          {/* TAB: Developer Implementation & COA Linkage Guide */}
          {activeTab === 'dev-implementation-guide' && (
            <DevImplementationGuideTab accounts={accounts} />
          )}

          {/* TAB 13: Import Template */}
          {activeTab === 'import-template' && <ImportTemplateTab />}

          {/* TAB 14: Audit Trail */}
          {activeTab === 'audit-trail' && (
            <AuditTrailTab auditLogs={auditLogs} />
          )}

        </div>
      </main>

      {/* PERSISTENT FLOATING TOAST NOTIFICATION STREAM */}
      {toastMessage && (
        <div 
          id="toast-container"
          className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-xl shadow-lg border text-body-sm font-sans flex items-center gap-3 z-[150] animate-bounce-short transition-all ${
            toastType === 'success' 
              ? 'bg-white border-emerald-200 text-on-surface shadow-emerald-700/5' 
              : toastType === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white border-outline-variant text-on-surface-variant'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="font-bold text-slate-800 leading-normal">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer ml-2"
          >
            <X className="w-4 h-4 text-outline" />
          </button>
        </div>
      )}

      {/* DRAWER MODAL: POST DOUBLE-ENTRY JOURNAL SIMULATION */}
      {showPostJournal && (
        <div id="modal-post-journal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[200] select-none font-sans">
          <div className="bg-white border border-outline-variant rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-5 animate-slideUp">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 bg-white">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-extrabold text-title-lg text-slate-900">
                  Simulate Double-Entry Journal Post
                </h3>
              </div>
              <button 
                onClick={() => setShowPostJournal(false)}
                className="p-1 hover:bg-slate-100 rounded-full cursor-pointer text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postingProgress ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-xs font-semibold text-slate-700">
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                <p className="font-sans font-semibold text-body-md text-on-surface">Validating compliance parameters...</p>
                <p className="text-[11px] text-outline font-mono">ENFORCING IFRS-9 DISCLOSURES & ETHIOPIAN ERCA REGULATION</p>
              </div>
            ) : (
              <form onSubmit={handlePostJournalSubmit} className="space-y-4 text-xs text-slate-700">
                <div className="bg-blue-50/50 p-3 rounded-lg text-slate-600 flex items-start gap-1.5 leading-relaxed border border-blue-100">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p>Posting here simulates a realbalanced double entry ledger transaction. The compliance auditing engine validates leaf-node eligibility before writing.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Select Debit Ledger */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Debit Ledger Account *</label>
                    <select 
                      value={journalDebitCode}
                      onChange={(e) => setJournalDebitCode(e.target.value)}
                      className="border border-outline rounded p-2 text-body-sm bg-white focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                      required
                    >
                      <option value="">-- Choose Account --</option>
                      {accounts.filter(a => a.postingAllowed && a.status === 'Active').map(a => (
                        <option key={a.code} value={a.code}>[{a.code}] {a.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Credit Ledger */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Credit Ledger Account *</label>
                    <select 
                      value={journalCreditCode}
                      onChange={(e) => setJournalCreditCode(e.target.value)}
                      className="border border-outline rounded p-2 text-body-sm bg-white focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                      required
                    >
                      <option value="">-- Choose Account --</option>
                      {accounts.filter(a => a.postingAllowed && a.status === 'Active').map(a => (
                        <option key={a.code} value={a.code}>[{a.code}] {a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Transfer amount in ETB */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Amount (ETB) *</label>
                    <input 
                      type="number"
                      value={journalAmount}
                      onChange={(e) => setJournalAmount(e.target.value)}
                      className="border border-outline rounded p-2 text-body-sm font-mono font-bold"
                      placeholder="e.g. 5000"
                      min="1"
                      required
                    />
                  </div>

                  {/* Operational Reference */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-700">Journal Reference Number</label>
                    <input 
                      type="text"
                      className="border border-outline rounded p-2 text-body-sm bg-slate-50 font-mono text-outline select-all"
                      value="REC-ETH-2026-004c"
                      readOnly
                    />
                  </div>
                </div>

                {/* Narrative Memo */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Journal Narrative / Memo</label>
                  <textarea 
                    value={journalMemo}
                    onChange={(e) => setJournalMemo(e.target.value)}
                    rows={2}
                    className="border border-outline rounded p-2 text-body-sm resize-none text-slate-800"
                    placeholder="Provide compliance transaction detail notes"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant">
                  <button 
                    type="button" 
                    onClick={() => setShowPostJournal(false)}
                    className="px-5 py-2 border rounded text-label-md font-bold text-outline hover:bg-slate-50 cursor-pointer"
                  >
                    Discard Entry
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary hover:bg-primary-container text-white font-sans text-label-md font-bold rounded shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Submit Journal Posting
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

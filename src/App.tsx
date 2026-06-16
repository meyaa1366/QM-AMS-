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
import VoucherFrameworkTab from './components/VoucherFrameworkTab';
import FiscalPeriodTab from './components/FiscalPeriodTab';
import DevImplementationGuideTab from './components/DevImplementationGuideTab';
import BudgetModuleTab from './components/BudgetModuleTab';
import APARSubmoduleTab from './components/APARSubmoduleTab';
import CashBankModuleTab from './components/CashBankModuleTab';
import FixedAssetsTab from './components/FixedAssetsTab';
import FinancialDisclosureNotesTab from './components/FinancialDisclosureNotesTab';
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

import { Account, EnumValue, LookupValue, AuditLogEntry, AccountStatus, ApprovalStatus, VoucherType, PostedTransaction } from './types';
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

  // Global posted transactions registry (feeds Financial Statements, Ledger Cards, and Journals dynamically)
  const [globalTransactions, setGlobalTransactions] = useState<PostedTransaction[]>(() => {
    return [
      {
        id: 'TXN-001',
        source: 'JOURNAL',
        voucherNo: 'REC-ETH-2026-001x',
        voucherType: 'JV',
        description: 'Consolidated commercial operating export revenue transfer',
        date: '2026-06-10',
        postedBy: 'mzerihun01@gmail.com',
        lines: [
          { accountCode: '1110', accountName: 'Cash and Bank Equivalents', debit: 8540200.50, credit: 0, description: 'Consolidated revenue receipt' },
          { accountCode: '4000', accountName: 'Revenue / Operating Revenue', debit: 0, credit: 8540200.50, description: 'Revenue allocation' }
        ]
      },
      {
        id: 'TXN-002',
        source: 'JOURNAL',
        voucherNo: 'V-25-102',
        voucherType: 'JV',
        description: 'Intercompany short-term credit facility clearance',
        date: '2026-06-10',
        postedBy: 'senior_auditor@fincorp.com',
        lines: [
          { accountCode: '1120', accountName: 'Trade Receivables (Intercompany)', debit: 320000.00, credit: 0, description: 'Receivable outstanding cleared' },
          { accountCode: '1110', accountName: 'Cash and Bank Equivalents', debit: 0, credit: 320000.00, description: 'Treasury payment out' }
        ]
      },
      {
        id: 'TXN-003',
        source: 'JOURNAL',
        voucherNo: 'V-25-302',
        voucherType: 'JV',
        description: 'Monthly ERCA tax filing return settlement',
        date: '2026-06-10',
        postedBy: 'mzerihun01@gmail.com',
        lines: [
          { accountCode: '2210', accountName: 'VAT Payable (ERCA Input)', debit: 1673133.24, credit: 0, description: 'ERCA tax ledger settlement' },
          { accountCode: '1110', accountName: 'Cash and Bank Equivalents', debit: 0, credit: 1673133.24, description: 'Commercial account settlement payout' }
        ]
      },
      {
        id: 'TXN-004',
        source: 'JOURNAL',
        voucherNo: 'JV-2026-90',
        voucherType: 'JV',
        description: 'Raw materials import consignment clearance matching voucher',
        date: '2026-06-10',
        postedBy: 'mzerihun01@gmail.com',
        lines: [
          { accountCode: '5110', accountName: 'Direct Cost of Sales - Raw Materials', debit: 1450000.50, credit: 0, description: 'Cost of materials import clearance' },
          { accountCode: '2110', accountName: 'Trade Payables (Accts Payable)', debit: 0, credit: 1450000.50, description: 'Withholding clearance matching payables' }
        ]
      }
    ];
  });

  const handleAddTransaction = (txn: PostedTransaction) => {
    setGlobalTransactions(prev => [txn, ...prev]);
  };

  // Buffer state when editing a ledger account
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Interactive filter on Audit Trail log
  const [auditFilterCode, setAuditFilterCode] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

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
    <div id="finance-dashboard-root" className="min-h-screen bg-slate-50 print:bg-white text-slate-900 print:text-black">
      {/* Grouped Sidebar - Replaced Post Journal button with dynamic operations */}
      <div className="print:hidden">
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
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Header bar */}
      <div className="print:hidden">
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
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Content Workspace viewport */}
      <main className={`transition-all duration-300 select-none print:pl-0 print:pt-4 print:pb-0 ${
        sidebarCollapsed ? 'pl-[72px]' : 'pl-[280px]'
      } pt-16 pb-20`}>
        {/* Floating Journal trigger */}
        <div className="bg-slate-100/80 px-6 py-2.5 border-b border-outline-variant/60 flex justify-between items-center text-xs text-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-600">IFRS Active Schema: <span className="font-bold text-slate-800">QM AMS (v4.1)</span></span>
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
              globalTransactions={globalTransactions}
            />
          )}

          {/* TAB: Ethiopian General Ledger Cards */}
          {activeTab === 'ledger-card' && (
            <LedgerCardTab 
              accounts={accounts} 
              globalTransactions={globalTransactions} 
            />
          )}

          {/* TAB: General Journal Transaction Registers */}
          {activeTab === 'journal-register' && (
            <JournalRegisterTab 
              accounts={accounts} 
              auditLogs={auditLogs} 
              globalTransactions={globalTransactions}
              onAddTransaction={handleAddTransaction}
              onAddAuditLog={(log) => setAuditLogs(prev => [log, ...prev])}
            />
          )}

          {/* TAB: AMS Voucher Workdesk (SAP/NetSuite Grade Framework) */}
          {(activeTab === 'voucher-framework' || activeTab.startsWith('voucher-')) && (
            <VoucherFrameworkTab 
              accounts={accounts} 
              overrideVoucherType={activeTab.startsWith('voucher-') ? activeTab.replace('voucher-', '').toUpperCase() : undefined}
              onAddAuditLog={(log) => {
                const mapped = {
                  id: log.id,
                  timestamp: log.timestamp,
                  user: log.user,
                  action: log.action,
                  entityType: log.entityType,
                  entityKey: log.entityKey,
                  description: log.description
                };
                setAuditLogs(prev => [mapped as any, ...prev]);
                triggerToast(`Voucher action: ${log.description}`, 'success');
              }}
              onAddTransaction={handleAddTransaction}
            />
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

          {/* TAB 8B: AP/AR Subledger Subsections */}
          {activeTab === 'apar-overview' && <APARSubmoduleTab initialCategory="Overview" initialSheet="AP_AR_Module_Dashboard" />}
          {activeTab === 'apar-suppliers' && <APARSubmoduleTab initialCategory="Suppliers" initialSheet="Supplier_Register_Page" />}
          {activeTab === 'apar-customers' && <APARSubmoduleTab initialCategory="Customers" initialSheet="Customer_Register_Page" />}
          {activeTab === 'apar-aging' && <APARSubmoduleTab initialCategory="Aging" initialSheet="AP_Aging_Report" />}
          {activeTab === 'apar-gating' && <APARSubmoduleTab initialCategory="Gating" initialSheet="Supplier_Transaction_Gating" />}
          {activeTab === 'apar-controls' && <APARSubmoduleTab initialCategory="Control" initialSheet="AP_Setup_Control" />}
          {activeTab === 'apar-compliance' && <APARSubmoduleTab initialCategory="Compliance" initialSheet="Tax_Compliance_Mapping" />}

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

          {/* TAB 15: Budget Setups and Controls */}
          {activeTab === 'budget-setup' && (
            <BudgetModuleTab 
              onAddAuditLog={(log) => {
                const mapped: AuditLogEntry = {
                  id: log.id,
                  timestamp: log.timestamp,
                  user: log.user,
                  action: log.action,
                  entityType: log.entityType as any,
                  entityKey: log.entityKey,
                  description: log.description
                };
                setAuditLogs(prev => [mapped, ...prev]);
                triggerToast(`Budget log: ${log.description}`, 'success');
              }}
            />
          )}

          {/* TAB 16: Corporate Cash & Bank Management Master */}
          {activeTab.startsWith('cash-bank') && (
            <CashBankModuleTab initialSubTab={
              activeTab === 'cash-bank-dashboard' ? 'dashboard' :
              activeTab === 'cash-bank-masters' ? 'accounts' :
              activeTab === 'cash-bank-transactions' ? 'transactions' :
              activeTab === 'cash-bank-petty' ? 'petty-cash' :
              activeTab === 'cash-bank-transfers' ? 'transfers' :
              activeTab === 'cash-bank-cheques' ? 'cheques-pdc' :
              activeTab === 'cash-bank-reco' ? 'reconstruction' :
              activeTab === 'cash-bank-security' ? 'security' :
              activeTab === 'cash-bank-comparison' ? 'comparison' :
              'dashboard'
            } />
          )}

          {/* TAB 16B: Corporate Fixed Assets Management Module */}
          {activeTab.startsWith('fixed-assets-') && (
            <FixedAssetsTab 
              accounts={accounts}
              onAddTransaction={handleAddTransaction}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              onAddAuditLog={(log) => {
                setAuditLogs(prev => [log, ...prev]);
                triggerToast(`Asset action logged count: ${log.description}`, 'success');
              }}
              initialSubTab={activeTab}
            />
          )}

          {/* TAB 17: IFRS Corporate disclosure notes compiler workspace */}
          {(activeTab === 'note-disclosure-workspace' || activeTab.startsWith('note-')) && (
            <FinancialDisclosureNotesTab 
              accounts={accounts}
              onAddAuditLog={(log) => {
                const mapped: AuditLogEntry = {
                  id: log.id,
                  timestamp: log.timestamp,
                  user: log.user,
                  action: log.action,
                  entityType: log.entityType,
                  entityKey: log.entityKey,
                  description: log.description
                };
                setAuditLogs(prev => [mapped, ...prev]);
                triggerToast(`Disclosure change: ${log.description}`, 'success');
              }}
              activeMenuId={activeTab.startsWith('note-') ? activeTab.replace('note-', '') : undefined}
              onActiveMenuIdChange={(id) => {
                setActiveTab(`note-${id}`);
              }}
            />
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

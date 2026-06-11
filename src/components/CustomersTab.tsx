import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserCheck, 
  ShieldAlert, 
  Clock, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileSpreadsheet, 
  Database,
  Plus, 
  Eye, 
  Edit3, 
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Customer } from '../types';

interface CustomersTabProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  isDeveloperView: boolean;
}

export default function CustomersTab({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  isDeveloperView
}: CustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');
  const [tin, setTin] = useState('');
  const [vatRegNumber, setVatRegNumber] = useState('');
  const [businessLicenseRef, setBusinessLicenseRef] = useState('');
  const [whtCategory, setWhtCategory] = useState('Standard 2% Withholding');
  const [creditLimit, setCreditLimit] = useState(500000);
  const [creditRiskGrade, setCreditRiskGrade] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [creditHold, setCreditHold] = useState(false);
  const [status, setStatus] = useState<'Draft' | 'Active' | 'Blocked'>('Active');
  const [segment, setSegment] = useState('Commercial Wholesale');
  const [costCenter, setCostCenter] = useState('CC-DIST-01');
  const [relatedCompany, setRelatedCompany] = useState('None');
  const [auditNotes, setAuditNotes] = useState('');

  // Calculations
  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'Active').length,
      totalCreditLimit: customers.reduce((sum, c) => sum + c.creditLimit, 0),
      holds: customers.filter(c => c.creditHold).length
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tin.includes(searchQuery) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = selectedRisk === 'All' || c.creditRiskGrade === selectedRisk;
      const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [customers, searchQuery, selectedRisk, selectedStatus]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setCode(`CUST-0${customers.length + 1}`);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('Addis Ababa, Ethiopia');
    setPaymentTerms('Net 30 Days');
    setTin('');
    setVatRegNumber('');
    setBusinessLicenseRef('');
    setWhtCategory('Standard 2% Withholding');
    setCreditLimit(500000);
    setCreditRiskGrade('Low');
    setCreditHold(false);
    setStatus('Active');
    setSegment('Commercial Wholesale');
    setCostCenter('CC-DIST-01');
    setRelatedCompany('None');
    setAuditNotes('Initial customer registration onboarding.');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setCode(c.code);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setAddress(c.address);
    setPaymentTerms(c.paymentTerms);
    setTin(c.tin);
    setVatRegNumber(c.vatRegNumber);
    setBusinessLicenseRef(c.businessLicenseRef);
    setWhtCategory(c.whtCategory);
    setCreditLimit(c.creditLimit);
    setCreditRiskGrade(c.creditRiskGrade);
    setCreditHold(c.creditHold);
    setStatus(c.status);
    setSegment(c.segment);
    setCostCenter(c.costCenter);
    setRelatedCompany(c.relatedCompany);
    setAuditNotes(c.auditTrailNotes || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tin) {
      alert('TIN number (10-digits) and Customer Name are strictly required for IFRS-compliant registries.');
      return;
    }
    if (tin.replace(/[^0-9]/g, '').length !== 10) {
      alert('Ethiopian revenue regulatory authority (ERCA) requires a 10-digit numeric Taxpayer Identification Number (TIN).');
      return;
    }

    const payload: Customer = {
      id: editingCustomer ? editingCustomer.id : code,
      code,
      name,
      email,
      phone,
      address,
      paymentTerms,
      tin,
      vatRegNumber: vatRegNumber || `VAT-${tin.slice(-5)}`,
      businessLicenseRef,
      whtCategory,
      creditLimit: Number(creditLimit),
      creditRiskGrade,
      creditHold,
      status,
      segment,
      costCenter,
      relatedCompany,
      auditTrailNotes: auditNotes || 'Adjusted customer ledger specifications.'
    };

    if (editingCustomer) {
      onUpdateCustomer(payload);
    } else {
      onAddCustomer(payload);
    }
    setIsFormOpen(false);
  };

  const toggleCreditHold = (c: Customer) => {
    onUpdateCustomer({
      ...c,
      creditHold: !c.creditHold,
      auditTrailNotes: `Manually toggled credit hold policy check. Current hold status: ${!c.creditHold}`
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-600"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Customers</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1.5">{stats.active} / {stats.total}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Subledger accounts linked to AR</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Credit Exposure</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1.5">{stats.totalCreditLimit.toLocaleString()} ETB</h3>
              <p className="text-[10px] text-slate-500 mt-1">Consolidated debtor risk limits</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-red-500"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit Holds Active</p>
              <h3 className="text-2xl font-black text-red-650 mt-1.5">{stats.holds} Delinquent</h3>
              <p className="text-[10px] text-slate-500 mt-1">Voucher booking blocked</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Authority Link</p>
              <h3 className="text-sm font-black text-slate-900 mt-2.5">100% TIN Coverage</h3>
              <p className="text-[10px] text-[#0051d5] font-mono mt-1">ERCA E-Invoicing Compliant</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search customers by code, TIN, address..."
            />
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg bg-white px-2.5 py-2 text-slate-705 font-medium outline-none"
          >
            <option value="All">All Risk Grades</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg bg-white px-2.5 py-2 text-slate-705 font-medium outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Blocked">Blocked Only</option>
            <option value="Draft">Drafts</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Subledger</span>
        </button>
      </div>

      {/* Main Grid View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-xs text-left border-collapse min-w-[1200px] table-fixed">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-950 text-white font-black uppercase">
                <th className="w-[110px] px-4 py-3">Customer Code</th>
                <th className="w-[260px] px-4 py-3">Customer Legal Name</th>
                <th className="w-[130px] px-4 py-3">TIN Number</th>
                <th className="w-[180px] px-4 py-3">Contact Email/Phone</th>
                <th className="w-[160px] px-4 py-3 text-right">Credit Limit & Risk</th>
                <th className="w-[130px] px-4 py-3 text-center">Credit Hold</th>
                <th className="w-[135px] px-4 py-3 text-center">AR Status</th>
                <th className="w-[160px] px-4 py-3 text-center">Registry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-700 bg-white">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 italic font-medium bg-slate-50/55">
                    No active Ethiopian customer subledgers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-55/60 transition-colors group">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600 select-all">{c.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">{c.tin}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-1 text-[10px] font-mono">
                        <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      <div className="font-black text-slate-900">{c.creditLimit.toLocaleString()} ETB</div>
                      <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.2 rounded mt-1 mt-0.5 ${
                        c.creditRiskGrade === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        c.creditRiskGrade === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {c.creditRiskGrade} Risk
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {c.creditHold ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold leading-none">
                          <Lock className="w-2.5 h-2.5 text-rose-650 shrink-0" />
                          <span>BLOCKED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-850 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold leading-none">
                          <Unlock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span>RELEASED</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'Blocked' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewCustomer(c)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="View Customer Compliance Sheet"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg"
                          title="Modify Debtor Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleCreditHold(c)}
                          className={`px-2 py-1 text-[9px] font-black uppercase rounded ${
                            c.creditHold ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                          title="Toggle Credit Protection Interlock"
                        >
                          {c.creditHold ? 'Release' : 'Hold'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Schema Reference Box */}
      {isDeveloperView && (
        <div className="bg-slate-900 border border-slate-950 p-5 rounded-xl font-mono text-[11px] text-slate-300 space-y-3 shadow-lg select-all">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Database Table Schema: subledger_customers</span>
            </span>
            <span className="text-[10px] text-slate-500">IFRS Category: TRADE Receivable Accounts (AR)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
            <div>
              <p className="text-slate-500 font-bold mb-1">// DDL Declarations</p>
              <pre className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-cyan-350">
{`CREATE TABLE subledger_customers (
  id VARCHAR(40) PRIMARY KEY,
  customer_code VARCHAR(30) UNIQUE NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  address_text TEXT,
  tin_number VARCHAR(10) CHECK(LENGTH(tin_number) = 10),
  vat_reg_no VARCHAR(20),
  credit_limit NUMERIC(19,4) DEFAULT 500000.00,
  risk_grade VARCHAR(20) DEFAULT 'Low',
  credit_hold_flag BOOLEAN DEFAULT FALSE,
  ar_gl_code VARCHAR(20) REFERENCES chart_of_accounts(code),
  status VARCHAR(20) DEFAULT 'Active'
);`}
              </pre>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-1">// Live API Contract Information</p>
              <pre className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-emerald-300">
{`// GET /api/v1/subledgers/customers
{
  "totalCount": ${customers.length},
  "ercaUnifiedCompliance": true,
  "arControlAccount": "1120 (Trade Receivables)",
  "customers": ${JSON.stringify(customers.slice(0, 1), null, 2)}
}`}
              </pre>
            </div>
          </div>
          <p className="text-[10px] text-yellow-500/80 leading-relaxed pt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Developer Note: The billing ledger triggers warning/blocks on transaction POST actions if credit_hold_flag = TRUE or tin_number is empty.</span>
          </p>
        </div>
      )}

      {/* Detail Overlay Sheet Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans select-none animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white select-none">
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 block tracking-widest">Customer Compliance Card</span>
                <h4 className="font-sans font-black text-lg text-white mt-0.5 leading-none">{viewCustomer.code} • {viewCustomer.name}</h4>
              </div>
              <button 
                onClick={() => setViewCustomer(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Operations Details</span>
                  <div className="mt-2 text-xs space-y-1.5 text-slate-700">
                     <p><span className="text-slate-500">TIN Number:</span> <span className="font-bold font-mono">{viewCustomer.tin}</span></p>
                     <p><span className="text-slate-500">VAT Reg:</span> <span className="font-semibold font-mono">{viewCustomer.vatRegNumber}</span></p>
                     <p><span className="text-slate-500">Business License:</span> <span className="font-medium">{viewCustomer.businessLicenseRef || 'N/A'}</span></p>
                     <p><span className="text-slate-500">Payment Terms:</span> <span className="font-bold text-indigo-750">{viewCustomer.paymentTerms}</span></p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Accounting Controls</span>
                  <div className="mt-2 text-xs space-y-1.5 text-slate-700">
                     <p><span className="text-slate-500">Credit Limit:</span> <span className="font-bold font-mono text-slate-950">{viewCustomer.creditLimit.toLocaleString()} ETB</span></p>
                     <p><span className="text-slate-500">Risk Grade:</span> <span className="font-bold">{viewCustomer.creditRiskGrade} Risk</span></p>
                     <p><span className="text-slate-500">Cost Center:</span> <span className="font-bold font-mono">{viewCustomer.costCenter}</span></p>
                     <p><span className="text-slate-500">Org Segment:</span> <span className="font-bold">{viewCustomer.segment}</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block mb-2">Registry Footprint & Attestation Diary</span>
                <p className="bg-slate-50 text-slate-700 text-xs italic font-mono p-3 rounded-lg border border-slate-200 leading-relaxed">
                  "{viewCustomer.auditTrailNotes || 'No custom audit logs on record.'}"
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewCustomer(null)}
                className="bg-slate-950 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close Compliance Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Slide Sheet Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[130] p-4 select-none">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h4 className="font-sans font-black text-base text-white">
                  {editingCustomer ? `Edit Customer details: [${code}]` : 'Create Customer AR Subledger'}
                </h4>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mt-1">IFRS Subledger Management Console</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Customer Identifier Code *</label>
                  <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    disabled={!!editingCustomer}
                    className="w-full border border-slate-200 rounded p-2 font-mono font-bold text-blue-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Customer Legal Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 text-slate-850 font-bold text-xs"
                    placeholder="e.g. Addis Allied Trading PLC"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Taxpayer ID (TIN) (10 Digits) *</label>
                  <input 
                    type="text" 
                    maxLength={10}
                    value={tin} 
                    onChange={(e) => setTin(e.target.value.replace(/[^0-9]/g, ''))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                    placeholder="e.g. 1029384756"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">VAT Reg Number</label>
                  <input 
                    type="text" 
                    value={vatRegNumber} 
                    onChange={(e) => setVatRegNumber(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2"
                    placeholder="VAT-ETH-XXXXX (default automatic)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Contact Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 text-slate-800"
                    placeholder="finance@customer.et"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Contact Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                    placeholder="+251-11-..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Billing Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2"
                    placeholder="Bole Subcity, Woreda 03, Addis Ababa"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Billing & Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2"
                  >
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 45 Days">Net 45 Days</option>
                    <option value="Net 60 Days">Net 60 Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Credit Limit (ETB)</label>
                  <input 
                    type="number" 
                    value={creditLimit} 
                    onChange={(e) => setCreditLimit(Number(e.target.value))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Credit Risk Grade</label>
                  <select
                    value={creditRiskGrade}
                    onChange={(e) => setCreditRiskGrade(e.target.value as any)}
                    className="w-full border border-slate-200 rounded p-2 font-bold"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Risk</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input 
                    type="checkbox" 
                    id="chk-hold"
                    checked={creditHold} 
                    onChange={(e) => setCreditHold(e.target.checked)} 
                    className="h-4.5 w-4.5 border border-slate-350 rounded text-blue-600"
                  />
                  <label htmlFor="chk-hold" className="font-bold text-slate-800 text-[11px] cursor-pointer">Force Credit Hold</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Marketing/Customer Segment</label>
                  <input 
                    type="text" 
                    value={segment} 
                    onChange={(e) => setSegment(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Default Cost Center</label>
                  <input 
                    type="text" 
                    value={costCenter} 
                    onChange={(e) => setCostCenter(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Audit Trail Footprint & Compliance Log Notes</label>
                <textarea 
                  value={auditNotes} 
                  onChange={(e) => setAuditNotes(e.target.value)} 
                  className="w-full border border-slate-200 rounded p-2 resize-none font-mono text-[11px]"
                  placeholder="Onboarding due diligence report summary notes..."
                  rows={2}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border rounded font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer shadow-xs"
              >
                {editingCustomer ? 'Update Ledger' : 'Create Ledger'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

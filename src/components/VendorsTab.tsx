import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Database, 
  Activity, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  DollarSign, 
  TrendingUp, 
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import { Vendor } from '../types';

interface VendorsTabProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  isDeveloperView: boolean;
}

export default function VendorsTab({
  vendors,
  onAddVendor,
  onUpdateVendor,
  isDeveloperView
}: VendorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form Field States
  const [code, setCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('Commercial Bank of Ethiopia (CBE)');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ibanSwift, setIbanSwift] = useState('CBETETAAXXX');
  const [tin, setTin] = useState('');
  const [vatCertificateLink, setVatCertificateLink] = useState('');
  const [whtCategory, setWhtCategory] = useState<'Standard Deductible 2%' | 'Exempt' | 'Standard Deductible 3%'>('Standard Deductible 2%');
  const [preferredTierStatus, setPreferredTierStatus] = useState<'Tier-1 Preferred' | 'Tier-2 Verified' | 'Tier-3 Probationary'>('Tier-2 Verified');
  const [minOrderQuantity, setMinOrderQuantity] = useState(10);
  const [deliveryLeadTimeDays, setDeliveryLeadTimeDays] = useState(5);
  const [openPOCount, setOpenPOCount] = useState(0);
  const [status, setStatus] = useState<'Registered' | 'Approved' | 'Suspended' | 'Blacklisted'>('Approved');
  const [relatedGLAccount, setRelatedGLAccount] = useState('2110 (Trade Payables)');
  const [auditNotes, setAuditNotes] = useState('');

  // Stats
  const stats = useMemo(() => {
    return {
      total: vendors.length,
      approved: vendors.filter(v => v.status === 'Approved').length,
      totalActiveOrders: vendors.reduce((sum, v) => sum + v.openPOCount, 0),
      tier1Count: vendors.filter(v => v.preferredTierStatus === 'Tier-1 Preferred').length
    };
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = 
        v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tin.includes(searchQuery) ||
        v.bankName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = selectedTier === 'All' || v.preferredTierStatus === selectedTier;
      const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [vendors, searchQuery, selectedTier, selectedStatus]);

  const handleOpenCreate = () => {
    setEditingVendor(null);
    setCode(`VEND-0${vendors.length + 1}`);
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('Addis Ababa, Ethiopia');
    setBankName('Commercial Bank of Ethiopia (CBE)');
    setBankAccountNumber('');
    setIbanSwift('CBETETAAXXX');
    setTin('');
    setVatCertificateLink('');
    setWhtCategory('Standard Deductible 2%');
    setPreferredTierStatus('Tier-2 Verified');
    setMinOrderQuantity(10);
    setDeliveryLeadTimeDays(5);
    setOpenPOCount(0);
    setStatus('Approved');
    setRelatedGLAccount('2110 (Trade Payables)');
    setAuditNotes('Initial supplier validation audit trails log.');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setCode(v.code);
    setCompanyName(v.companyName);
    setEmail(v.email);
    setPhone(v.phone);
    setAddress(v.address);
    setBankName(v.bankName);
    setBankAccountNumber(v.bankAccountNumber);
    setIbanSwift(v.ibanSwift);
    setTin(v.tin);
    setVatCertificateLink(v.vatCertificateLink);
    setWhtCategory(v.whtCategory);
    setPreferredTierStatus(v.preferredTierStatus);
    setMinOrderQuantity(v.minOrderQuantity);
    setDeliveryLeadTimeDays(v.deliveryLeadTimeDays);
    setOpenPOCount(v.openPOCount);
    setStatus(v.status);
    setRelatedGLAccount(v.relatedGLAccount);
    setAuditNotes(v.auditTrailNotes || 'Supplier adjustment updates.');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !tin) {
      alert('TIN and Vendor Name are required for compliance tracking.');
      return;
    }
    if (tin.replace(/[^0-9]/g, '').length !== 10) {
      alert('TIN must be 10 numeric digits.');
      return;
    }

    const payload: Vendor = {
      id: editingVendor ? editingVendor.id : code,
      code,
      companyName,
      email,
      phone,
      address,
      bankName,
      bankAccountNumber,
      ibanSwift,
      tin,
      vatCertificateLink: vatCertificateLink || `CERT-VAT-${code}`,
      whtCategory,
      preferredTierStatus,
      minOrderQuantity: Number(minOrderQuantity),
      deliveryLeadTimeDays: Number(deliveryLeadTimeDays),
      openPOCount: Number(openPOCount),
      status,
      relatedGLAccount,
      auditTrailNotes: auditNotes || 'Adjusted vendor registration profile.'
    };

    if (editingVendor) {
      onUpdateVendor(payload);
    } else {
      onAddVendor(payload);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-600"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Suppliers</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1.5">{stats.total}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Vetted subledger accounts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Creditors</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1.5">{stats.approved} / {stats.total}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Ready for PO voucher releases</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-650"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Suppliers</p>
              <h3 className="text-2xl font-black text-indigo-600 mt-1.5">{stats.tier1Count} Tier-1 Strategic</h3>
              <p className="text-[10px] text-slate-500 mt-1">Priority payment release routing</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Purchase Orders</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1.5">{stats.totalActiveOrders} Live</h3>
              <p className="text-[10px] text-slate-500 mt-1">Pending subledger reconciliation</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-amber-600" />
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-none text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search suppliers by name, code, TIN, bank..."
            />
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg bg-white px-2.5 py-2 text-slate-705 font-medium outline-none"
          >
            <option value="All">All Procurement Tiers</option>
            <option value="Tier-1 Preferred">Tier-1 Preferred</option>
            <option value="Tier-2 Verified">Tier-2 Verified</option>
            <option value="Tier-3 Probationary">Tier-3 Probationary</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg bg-white px-2.5 py-2 text-slate-705 font-medium outline-none"
          >
            <option value="All">All ASL Statuses</option>
            <option value="Registered">Registered Only</option>
            <option value="Approved">Approved Suppliers</option>
            <option value="Suspended">Suspended</option>
            <option value="Blacklisted">Blacklisted</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Vendor Subledger</span>
        </button>
      </div>

      {/* Main Table Register View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-xs text-left border-collapse min-w-[1250px] table-fixed font-sans">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-950 text-white font-black uppercase">
                <th className="w-[110px] px-4 py-3">Vendor Code</th>
                <th className="w-[280px] px-4 py-3">Supplier Legal Name</th>
                <th className="w-[120px] px-4 py-3">TIN Number</th>
                <th className="w-[260px] px-4 py-3">Banking Routing Detail (CBE / CBE Birr)</th>
                <th className="w-[150px] px-4 py-3">Procurement Tier</th>
                <th className="w-[130px] px-4 py-3 text-center">WHT Category</th>
                <th className="w-[140px] px-4 py-3 text-center">ASL Authorization</th>
                <th className="w-[160px] px-4 py-3 text-center">Register Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-700 bg-white">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 italic font-medium bg-slate-50/55">
                    No active approved supplier subledgers found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-55/60 transition-colors group">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-600 select-all">{v.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">{v.companyName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-sans">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{v.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">{v.tin}</td>
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-semibold text-slate-850 flex items-center gap-1">
                        <span>{v.bankName}</span>
                      </div>
                      <div className="text-[10px] text-indigo-600 font-black mt-1">
                        Acc: {v.bankAccountNumber}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        SWIFT: [ {v.ibanSwift} ]
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block text-[9.5px] font-black uppercase px-2 py-0.5 rounded ${
                        v.preferredTierStatus === 'Tier-1 Preferred' ? 'bg-indigo-50 text-indigo-750 border border-indigo-150' :
                        v.preferredTierStatus === 'Tier-2 Verified' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {v.preferredTierStatus}
                      </span>
                      <div className="text-[9.5px] text-slate-400 mt-1 font-mono">
                        Lead Time: {v.deliveryLeadTimeDays} days
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {v.whtCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        v.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        v.status === 'Suspended' ? 'bg-amber-100 text-amber-800' :
                        v.status === 'Blacklisted' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{v.status.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewVendor(v)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Review Supplier Compliance Sheet"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg"
                          title="Modify AP Supplier Node"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const nextS = v.status === 'Approved' ? 'Suspended' : 'Approved';
                            onUpdateVendor({
                              ...v,
                              status: nextS,
                              auditTrailNotes: `Manually edited ASL ledger authorization level to [${nextS}]`
                            });
                          }}
                          className={`px-2 py-1 text-[9px] font-black uppercase rounded ${
                            v.status === 'Approved' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-705 border border-emerald-200'
                          }`}
                          title="Toggle ASL compliance status"
                        >
                          {v.status === 'Approved' ? 'Suspend' : 'Approve'}
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

      {/* Developer View */}
      {isDeveloperView && (
        <div className="bg-slate-900 border border-slate-950 p-5 rounded-xl font-mono text-[11px] text-slate-305 space-y-3 shadow-lg select-all">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Database Table Schema: subledger_suppliers</span>
            </span>
            <span className="text-[10px] text-slate-500">IFRS Category: TRADE Payable Accounts (AP)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
            <div>
              <p className="text-slate-500 font-bold mb-1">// DDL Declarations</p>
              <pre className="bg-slate-950/75 p-3 rounded-lg border border-slate-800 text-cyan-350">
{`CREATE TABLE subledger_suppliers (
  id VARCHAR(40) PRIMARY KEY,
  supplier_code VARCHAR(30) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  address_text TEXT,
  bank_name VARCHAR(120),
  bank_account VARCHAR(40),
  tin_number VARCHAR(10) CHECK(LENGTH(tin_number) = 10),
  wht_rate_category VARCHAR(30) NOT NULL,
  asl_status VARCHAR(30) DEFAULT 'Approved', -- Approved Supplier List
  ap_control_gl VARCHAR(20) REFERENCES chart_of_accounts(code)
);`}
              </pre>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-1">// API response structure</p>
              <pre className="bg-slate-950/75 p-3 rounded-lg border border-slate-800 text-emerald-355">
{`// GET /api/v1/subledgers/suppliers
{
  "totalRecordIndex": ${vendors.length},
  "encaComplianceStatus": "VALIDATED",
  "controlAccountRef": "2110 (Trade Payables)",
  "suppliers": ${JSON.stringify(vendors.slice(0, 1), null, 2)}
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Detail Overlay */}
      {viewVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[130] p-4 font-sans select-none animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 block tracking-widest text-[#94a3b8]">ASL Certification Directory</span>
                <h4 className="font-sans font-black text-lg text-white mt-1 leading-none">{viewVendor.code} • {viewVendor.companyName}</h4>
              </div>
              <button 
                onClick={() => setViewVendor(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Taxpayer & Regulatory</span>
                  <div className="mt-2 text-xs space-y-1.5 text-slate-700">
                    <p><span className="text-slate-500">TIN Number:</span> <span className="font-bold font-mono text-slate-900">{viewVendor.tin}</span></p>
                    <p><span className="text-slate-500">VAT Cert link:</span> <span className="font-mono text-blue-600 underline font-medium">{viewVendor.vatCertificateLink}</span></p>
                    <p><span className="text-slate-500">Withholding tax:</span> <span className="font-bold">{viewVendor.whtCategory}</span></p>
                    <p><span className="text-slate-500">Control GL:</span> <span className="font-mono font-bold">{viewVendor.relatedGLAccount}</span></p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Bank Routing specs</span>
                  <div className="mt-2 text-xs space-y-1.5 text-slate-700 col-span-1">
                    <p><span className="text-slate-500">Bank Name:</span> <span className="font-bold">{viewVendor.bankName}</span></p>
                    <p><span className="text-slate-500">Account:</span> <span className="font-bold font-mono text-indigo-750">{viewVendor.bankAccountNumber || 'N/A'}</span></p>
                    <p><span className="text-slate-500">SWIFT Code:</span> <span className="font-mono text-slate-600">{viewVendor.ibanSwift}</span></p>
                    <p><span className="text-slate-500">Procurement Tier:</span> <span className="font-bold font-mono text-emerald-700">{viewVendor.preferredTierStatus}</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block mb-1">Procurement constraints</span>
                <p className="text-xs text-slate-700">
                  Preferred Supplier parameters limit purchase orders to Minimum Order Quantity (MOQ) of <strong className="font-mono">{viewVendor.minOrderQuantity} items</strong> under typical delivery lead times of <strong className="font-mono">{viewVendor.deliveryLeadTimeDays} days</strong>. Active Purchase Orders currently logged: <strong className="font-mono">{viewVendor.openPOCount} files</strong>.
                </p>
              </div>

              <div className="border-t pt-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block mb-1">Audit verification journal notes</span>
                <p className="bg-slate-50 text-slate-700 text-xs italic font-mono p-3 rounded-lg border border-slate-200 leading-relaxed">
                  "{viewVendor.auditTrailNotes || 'No custom audit logs on record.'}"
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewVendor(null)}
                className="bg-slate-950 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-900 cursor-pointer"
              >
                Close Compliance Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[130] p-4 select-none">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h4 className="font-sans font-black text-base text-white">
                  {editingVendor ? `Edit AP Supplier Specifications: [${code}]` : 'Create Supplier AP Subledger'}
                </h4>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mt-1">IFRS Subledger Management Console</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-slate-440 hover:text-white cursor-pointer ml-3 font-semibold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-medium text-slate-700 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Vendor Reference Code *</label>
                  <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    disabled={!!editingVendor}
                    className="w-full border border-slate-200 rounded p-2 font-mono font-bold text-blue-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Company Legal Name *</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 text-slate-850 font-bold"
                    placeholder="e.g. Bole Paper Manufacturing PLC"
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
                    placeholder="e.g. 1028374659"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">VAT Certificate reference link</label>
                  <input 
                    type="text" 
                    value={vatCertificateLink} 
                    onChange={(e) => setVatCertificateLink(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                    placeholder="CERT-VAT-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Contact Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2"
                    placeholder="sales@vendor.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                    placeholder="+251-11-..."
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Physical Address / Subcity</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2"
                    placeholder="Addis Ababa, Ethiopia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Ethio Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2"
                  >
                    <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Awash International Bank">Awash International Bank</option>
                    <option value="Dashen Bank">Dashen Bank</option>
                    <option value="Abyssinia Bank">Abyssinia Bank</option>
                    <option value="Wegagen Bank">Wegagen Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Bank Account Number</label>
                  <input 
                    type="text" 
                    value={bankAccountNumber} 
                    onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^0-9]/g, ''))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                    placeholder="e.g. 100018283941"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">SWIFT Code / IBAN</label>
                  <input 
                    type="text" 
                    value={ibanSwift} 
                    onChange={(e) => setIbanSwift(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono uppercase"
                    placeholder="e.g. CBETETAAXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Withholding Tax Logic Category</label>
                  <select
                    value={whtCategory}
                    onChange={(e) => setWhtCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded p-2"
                  >
                    <option value="Standard Deductible 2%">Standard Deductible 2% on Goods</option>
                    <option value="Standard Deductible 3%">Standard Deductible 3% on Services</option>
                    <option value="Exempt">Exempt from Withholding Tax</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Preferred Supplier Tier status</label>
                  <select
                    value={preferredTierStatus}
                    onChange={(e) => setPreferredTierStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded p-2 font-bold"
                  >
                    <option value="Tier-1 Preferred">Tier-1 Preferred Vendor</option>
                    <option value="Tier-2 Verified">Tier-2 Verified Vendor</option>
                    <option value="Tier-3 Probationary">Tier-3 Probationary Vendor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Min Order Qty (MOQ)</label>
                  <input 
                    type="number" 
                    value={minOrderQuantity} 
                    onChange={(e) => setMinOrderQuantity(Number(e.target.value))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Delivery Lead Time (Days)</label>
                  <input 
                    type="number" 
                    value={deliveryLeadTimeDays} 
                    onChange={(e) => setDeliveryLeadTimeDays(Number(e.target.value))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Open PO Count</label>
                  <input 
                    type="number" 
                    value={openPOCount} 
                    onChange={(e) => setOpenPOCount(Number(e.target.value))} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">ASL Status Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded p-2 font-bold text-xs"
                  >
                    <option value="Registered">Registered Only</option>
                    <option value="Approved">Approved Supplier</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Related Trade payables AP GL Account link</label>
                  <input 
                    type="text" 
                    value={relatedGLAccount} 
                    onChange={(e) => setRelatedGLAccount(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Audit Trail Attestation Compliance Notes</label>
                  <input 
                    type="text" 
                    value={auditNotes} 
                    onChange={(e) => setAuditNotes(e.target.value)} 
                    className="w-full border border-slate-200 rounded p-2 font-mono text-[11px]"
                    placeholder="Primary purchase logs remarks..."
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border rounded font-semibold hover:bg-slate-100 cursor-pointer text-slate-600"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer shadow-xs"
              >
                {editingVendor ? 'Update Supplier' : 'Register Supplier'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

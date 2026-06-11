/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, Search, ChevronRight, Hash, 
  CheckCircle2, FileText, Check, ShieldCheck, X, AlertTriangle, 
  TrendingUp, Copy, List, Edit2, History, PlayCircle, Eye,
  Lightbulb, ShieldCheck as SecurityIcon, Lock
} from 'lucide-react';
import { VoucherType } from '../types';

interface VoucherRegistryViewProps {
  voucherTypes: VoucherType[];
  onSaveVoucher: (updated: VoucherType) => void;
  onAddVoucher: (news: VoucherType) => void;
  triggerLog: (user: string, action: string, type: 'info' | 'edited' | 'created' | 'warning') => void;
}

export default function VoucherRegistryView({
  voucherTypes,
  onSaveVoucher,
  onAddVoucher,
  triggerLog,
}: VoucherRegistryViewProps) {
  // Navigation: Registry list or detail form
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<number>(1);
  const [selectedRowCode, setSelectedRowCode] = useState<string | null>('PV-VENDOR');

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [showIntegrityAudit, setShowIntegrityAudit] = useState(false);

  // Form State
  const [formState, setFormState] = useState<VoucherType | null>(null);

  // Open Edit Panel
  const handleEdit = (v: VoucherType) => {
    setFormState({ ...v });
    setEditingCode(v.code);
    setIsCreatingNew(false);
    setActiveFormTab(1);
  };

  // Init Create Panel
  const handleInitCreate = () => {
    const newV: VoucherType = {
      code: 'NEW-VOUCH',
      name: 'New Voucher Template',
      category: 'General Ledger',
      autoNumbering: 'Enabled',
      approvalFlow: 'Level 1 (Branch Mgr)',
      postingControl: 'Balanced Only',
      status: 'Active',
      prefix: 'NEW',
      suffix: 'GL',
      resetYearly: true,
      prohibitGaps: true,
      requireApproval: true,
      approvalLevels: ['1. Supervisor'],
      balanceValidation: true,
      backdatedEntry: false,
      tolerancePercent: 0,
      warningAction: 'Hard Block',
      vatGroup: 'Exempt',
      whtLogic: 'Manual Only',
      qrCodeInvoice: true,
      signatureLabels: true,
      watermarkDraft: true,
      lastModifiedBy: 'MZerihun',
      lastModifiedTime: new Date().toLocaleString()
    };
    setFormState(newV);
    setIsCreatingNew(true);
    setEditingCode(newV.code);
    setActiveFormTab(1);
  };

  // Clone template
  const handleClone = (v: VoucherType, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: VoucherType = {
      ...v,
      code: `${v.code}-CLONE`,
      name: `Copy of ${v.name}`,
      lastModifiedTime: new Date().toLocaleString()
    };
    onAddVoucher(cloned);
    triggerLog('MZerihun', `cloned template "${v.code}" to create "${cloned.code}".`, 'created');
  };

  // Save Execution
  const handleSaveSubmit = () => {
    if (!formState) return;
    if (isCreatingNew) {
      onAddVoucher(formState);
      triggerLog('MZerihun', `registered new voucher config "${formState.code}".`, 'created');
    } else {
      onSaveVoucher(formState);
      triggerLog('MZerihun', `updated registry numbering for voucher type "${formState.code}".`, 'edited');
    }
    setEditingCode(null);
    setIsCreatingNew(false);
    setFormState(null);
  };

  // Filters calculation
  const filteredTypes = voucherTypes.filter(v => {
    return v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
           v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           v.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 font-sans">
      {editingCode === null ? (
        // DEFAULT LIST SCREEN (Screen 3)
        <div className="space-y-6">
          {/* Summary Bento Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Voucher Types</span>
                <div className="bg-slate-100 p-1.5 rounded-lg text-slate-700">
                  <List className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900">{voucherTypes.length}</span>
                <div className="flex items-center mt-1 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  Optimal Allocation
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active Auto-Sequences</span>
                <div className="bg-cyan-50 p-1.5 rounded-lg text-cyan-600">
                  <Hash className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900">
                  {voucherTypes.filter(v => v.autoNumbering === 'Enabled').length}
                </span>
                <div className="text-xs text-slate-400 font-medium mt-1">Automatic core routing</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Pending Approvals</span>
                <div className="bg-amber-50 p-1.5 rounded-lg text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900">01</span>
                <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Registry audit pending
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Security Integrity</span>
                <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-700">Optimal</span>
                <div className="text-[11px] text-slate-400 font-medium mt-1">SLA syncing: Active</div>
              </div>
            </div>
          </section>

          {/* Configuration Registry Header and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">QM AMS Configuration Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage global voucher schemas and automatic ledger routing sequences under IFRS guidelines.</p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by code or name..."
                  className="pl-9 pr-4 py-1.8 w-64 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-slate-700"
                />
              </div>
              <button 
                onClick={handleInitCreate}
                className="px-4 py-1.8 bg-cyan-600 text-white text-xs font-bold rounded hover:bg-cyan-500 shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Register Type
              </button>
            </div>
          </div>

          {/* Configuration Register table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden" id="voucher-registry-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Voucher Code</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Auto-Numbering</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approval Flow</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Posting Control</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTypes.map(v => {
                    const isSelected = selectedRowCode === v.code;
                    return (
                      <tr
                        key={v.code}
                        onClick={() => setSelectedRowCode(v.code)}
                        className={`group cursor-pointer transition-all duration-150 ${
                          isSelected ? 'bg-cyan-50/30 border-l-[3.5px] border-cyan-500' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="px-5 py-4.5 font-mono text-xs font-bold text-cyan-600">{v.code}</td>
                        <td className="px-5 py-4.5 text-xs font-semibold text-slate-800">{v.name}</td>
                        <td className="px-4 py-4.5">
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                            {v.category}
                          </span>
                        </td>
                        <td className="px-4 py-4.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700">
                            <span className={`w-2 h-2 rounded-full ${
                              v.autoNumbering === 'Enabled' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}></span>
                            {v.autoNumbering}
                          </div>
                        </td>
                        <td className="px-4 py-4.5 text-xs text-slate-600">{v.approvalFlow}</td>
                        <td className="px-4 py-4.5 text-xs text-slate-500 font-medium italic">{v.postingControl}</td>
                        <td className="px-4 py-4.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border leading-none ${
                            v.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-4.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 select-none">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(v); }}
                              className="p-1 text-slate-400 hover:text-cyan-600 hover:bg-slate-150 rounded transition-colors"
                              title="Edit Registry"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleClone(v, e)}
                              className="p-1 text-slate-400 hover:text-cyan-600 hover:bg-slate-150 rounded transition-colors"
                              title="Clone layout"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table pagination stats footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 select-none">
              <span>Showing {filteredTypes.length} registered system voucher templates</span>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-0.5 border border-slate-200 rounded bg-white text-[11px] font-bold">1</button>
              </div>
            </div>
          </div>

          {/* Lower Section: Recent Configuration Activities & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
            {/* Recent configuration activity */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest leading-none">Recent Registry Activity</h3>
              
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-1">
                <div className="divide-y divide-slate-150">
                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
                        <Edit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-800 font-semibold">Auto-numbering logic updated for <span className="font-bold text-cyan-600">PV-VENDOR</span></p>
                        <p className="text-[10px] text-slate-405 font-medium">by Lead Auditor • 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-800 font-semibold">New Voucher Type Configured: <span className="font-bold text-emerald-600">CV-PETTY</span></p>
                        <p className="text-[10px] text-slate-405 font-medium">by Lead Auditor • 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System health audit card */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest leading-none">Registry Integrity</h3>
              
              <div className="bg-[#090f24] border border-[#1e294b] text-white rounded-xl shadow-xs p-5 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <PlayCircle className="w-7 h-7 text-cyan-400" />
                    <span className="bg-[#121c42] text-[9px] text-cyan-400 font-black tracking-widest uppercase px-2 py-0.5 rounded border border-[#1e2a5c]">
                      IFRS SECURE
                    </span>
                  </div>
                  <h4 className="text-xs font-bold tracking-tight text-white mb-1.5">QM AMS Integrity Review</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Check if voucher numbering sequences are synchronized perfectly across all distributed audit nodes.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    setShowIntegrityAudit(true);
                    triggerLog('MZerihun', `performed full security sequence audit checking ${voucherTypes.length} ledger nodes.`, 'info');
                  }}
                  className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white py-1.8 text-xs font-bold rounded transition-colors"
                >
                  Verify Sequence Integrity
                </button>
              </div>
            </div>
          </div>

          {/* Audit Result Popup Modal */}
          {showIntegrityAudit && (
            <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">Audit Check Completed</h4>
                  </div>
                  <button onClick={() => setShowIntegrityAudit(false)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>QM AMS verified all numbering sequences for all system voucher types are strictly aligned and serialized under ERCA tax authority standards.</p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px]">
                    <li>No numerical sequence gaps detected in <span className="font-mono">JV-CORP</span></li>
                    <li>Automatic suffix mapping is validated across EMEA clusters for <span className="font-mono">PV-VENDOR</span></li>
                    <li>Integrity verified completely inside core ledger engine.</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowIntegrityAudit(false)}
                  className="w-full bg-cyan-600 text-white text-xs font-bold py-2 rounded"
                >
                  Dismiss Results
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // DETAIL FORM CONFIG PANEL (Screen 4)
        <div className="space-y-6">
          {/* Breadcrumbs Section */}
          <div className="flex justify-between items-end select-none">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <span>Setup</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span>Financial Configuration</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-cyan-600 font-black">Voucher Types</span>
              </nav>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {isCreatingNew ? 'Register New Voucher Type' : `${formState?.name}`}
              </h1>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingCode(null); setFormState(null); }}
                className="px-4 py-1.8 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSubmit}
                className="px-5 py-1.8 bg-cyan-600 text-white text-xs font-bold rounded shadow-xs hover:bg-cyan-500 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-12">
            {/* Form Panels Column on Left */}
            <div className="col-span-12 xl:col-span-9 space-y-6">
              {/* Tabs navigation */}
              <div className="border-b border-slate-200 flex gap-6 overflow-x-auto select-none">
                {[
                  { id: 1, label: '1. General & Numbering' },
                  { id: 2, label: '2. Workflow & Posting' },
                  { id: 3, label: '3. Controls & Security' },
                  { id: 4, label: '4. Tax & Budget' }
                ].map(tb => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveFormTab(tb.id)}
                    className={`pb-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                      activeFormTab === tb.id 
                        ? 'text-cyan-600 border-cyan-500 bg-transparent font-extrabold' 
                        : 'text-slate-450 border-transparent hover:text-slate-800'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* Dynamic render chosen tab */}
              {formState && activeFormTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <fieldset className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                    <legend className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-1.5">
                      <List className="w-4 h-4 text-cyan-600" /> Basic Information
                    </legend>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Voucher Code</label>
                        <input 
                          type="text" 
                          value={formState.code}
                          disabled={!isCreatingNew}
                          onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                          className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Display Name</label>
                        <input 
                          type="text" 
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                          <select 
                            value={formState.category}
                            onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none bg-white"
                          >
                            <option>Accounts Payable</option>
                            <option>Cash &amp; Bank</option>
                            <option>General Ledger</option>
                            <option>Cash Mgmt</option>
                            <option>Regulatory</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => setFormState({ ...formState, status: formState.status === 'Active' ? 'Inactive' : 'Active' })}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                                formState.status === 'Active' ? 'bg-cyan-600' : 'bg-slate-300'
                              }`}
                            >
                              <span className={`w-4 h-4 bg-white rounded-full block shadow-sm transform transition-transform ${
                                formState.status === 'Active' ? 'translate-x-4' : 'translate-x-0'
                              }`}></span>
                            </button>
                            <span className={`text-[10px] font-extrabold ${formState.status === 'Active' ? 'text-cyan-600' : 'text-slate-400'}`}>
                              {formState.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Numbering configuration */}
                  <fieldset className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                    <legend className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-cyan-600" /> Numbering Configuration
                    </legend>
                    
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input 
                            type="radio" 
                            name="autoNum" 
                            checked={formState.autoNumbering === 'Enabled'}
                            onChange={() => setFormState({ ...formState, autoNumbering: 'Enabled' })}
                            className="text-cyan-600 border-slate-300"
                          />
                          Automatic
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input 
                            type="radio" 
                            name="autoNum" 
                            checked={formState.autoNumbering === 'Manual Override'}
                            onChange={() => setFormState({ ...formState, autoNumbering: 'Manual Override' })}
                            className="text-cyan-600 border-slate-300"
                          />
                          Manual Override
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prefix</label>
                          <input 
                            type="text" 
                            placeholder="PV-AA"
                            value={formState.prefix}
                            onChange={(e) => setFormState({ ...formState, prefix: e.target.value })}
                            className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Suffix</label>
                          <input 
                            type="text" 
                            placeholder="GL"
                            value={formState.suffix}
                            onChange={(e) => setFormState({ ...formState, suffix: e.target.value })}
                            className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Live preview pattern block */}
                      <div className="p-4 bg-slate-50 border-l-4 border-cyan-500 rounded-r-lg shadow-inner select-none">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Sequence Preview</label>
                        <div className="font-mono text-base font-extrabold text-slate-800 tracking-widest">
                          {formState.prefix || 'PV'}-2026-000001-{formState.suffix || 'GL'}
                        </div>
                      </div>

                      <div className="flex gap-6 pt-1 select-none">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formState.resetYearly}
                            onChange={(e) => setFormState({ ...formState, resetYearly: e.target.checked })}
                            className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                          />
                          Reset Yearly
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formState.prohibitGaps}
                            onChange={(e) => setFormState({ ...formState, prohibitGaps: e.target.checked })}
                            className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                          />
                          Prohibit Gaps
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Tab 2: Workflow & Posting */}
              {formState && activeFormTab === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <fieldset className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                    <legend className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2">Approval Workflow</legend>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100 select-none">
                        <span className="text-xs text-slate-600 font-semibold">Require Approval before posting</span>
                        <input 
                          type="checkbox" 
                          checked={formState.requireApproval}
                          onChange={(e) => setFormState({ ...formState, requireApproval: e.target.checked })}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Flow Hierarchy Levels</label>
                        <div className="flex gap-2">
                          {formState.approvalLevels.map((lvl, idx) => (
                            <div key={idx} className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded text-center font-mono text-[11px] font-bold text-slate-600 shadow-inner border-t-2 border-t-slate-400">
                              {lvl}
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => setFormState({
                              ...formState,
                              approvalLevels: [...formState.approvalLevels, `${formState.approvalLevels.length + 1}. Audit Audit`]
                            })}
                            className="flex items-center justify-center p-2 border border-dashed border-slate-300 text-slate-400 hover:text-cyan-600 rounded text-xs px-3"
                          >
                            + Level
                          </button>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4 select-none">
                    <legend className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2">Posting Controls</legend>
                    
                    <div className="grid gap-4">
                      <label className="flex items-start gap-4 p-4 bg-slate-50 hover:bg-slate-105 rounded-lg border border-slate-150 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formState.balanceValidation}
                          onChange={(e) => setFormState({ ...formState, balanceValidation: e.target.checked })}
                          className="mt-1 rounded text-cyan-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Debit / Credit Balance Validation</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Force direct balance equality between total credits and debits before posting completes.</div>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 p-4 bg-slate-50 hover:bg-slate-105 rounded-lg border border-slate-150 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formState.backdatedEntry}
                          onChange={(e) => setFormState({ ...formState, backdatedEntry: e.target.checked })}
                          className="mt-1 rounded text-cyan-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Backdated Posting Authorization</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Authorize entries posting to previous period records within verified thresholds.</div>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Tab 3: Controls & Security */}
              {formState && activeFormTab === 3 && (
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dimension Constraints &amp; Authorization</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse select-none">
                      <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                          <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Dimensions</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mandatory Status</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Default Core Value</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Editable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">Cost Center</td>
                          <td className="px-4 py-3"><input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-0" /></td>
                          <td className="px-4 py-3 text-slate-400 italic">No Default Specified</td>
                          <td className="px-4 py-3"><input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-0" /></td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">Branch Location</td>
                          <td className="px-4 py-3"><input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-0" /></td>
                          <td className="px-4 py-3 text-slate-700 font-mono text-[11px]">BR-01</td>
                          <td className="px-4 py-3"><input type="checkbox" className="rounded text-cyan-600 focus:ring-0" /></td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">Project Code</td>
                          <td className="px-4 py-3"><input type="checkbox" className="rounded text-cyan-600 focus:ring-0" /></td>
                          <td className="px-4 py-3 text-slate-400 italic">No Default Specified</td>
                          <td className="px-4 py-3"><input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-0" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Tax & Budget */}
              {formState && activeFormTab === 4 && (
                <div className="grid grid-cols-12 gap-6">
                  {/* Budget Policy and Tax dropdowns */}
                  <div className="col-span-12 md:col-span-7 bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-5">
                    <h3 className="text-xs font-bold text-slate-805 uppercase tracking-wider border-b border-slate-100 pb-2">Policy Settings</h3>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-xs font-bold text-slate-800">Budget Validation Policy</span>
                        <span className="bg-rose-100 text-rose-850 text-[9px] font-black px-2 py-0.5 rounded uppercase">Strict Blocking</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Reject posting of transactions immediately if variance exceeds authorized budget allocations for the targeted cost center node.
                      </p>
                      <div className="flex gap-4 pt-1">
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Tolerance Margin (%)</label>
                          <input 
                            type="number"
                            value={formState.tolerancePercent}
                            onChange={(e) => setFormState({ ...formState, tolerancePercent: Number(e.target.value) })}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white" 
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Alert Trigger Event</label>
                          <select 
                            value={formState.warningAction}
                            onChange={(e) => setFormState({ ...formState, warningAction: e.target.value as 'Hard Block' | 'Soft Warning' })}
                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white"
                          >
                            <option>Hard Block</option>
                            <option>Soft Warning</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 select-none">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Default Purchase VAT Group</label>
                        <select 
                          value={formState.vatGroup}
                          onChange={(e) => setFormState({ ...formState, vatGroup: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-slate-705"
                        >
                          <option>Standard 15%</option>
                          <option>Exempt</option>
                          <option>Zero-Rated 0%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">WHT Settlement Logic</label>
                        <select 
                          value={formState.whtLogic}
                          onChange={(e) => setFormState({ ...formState, whtLogic: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-slate-705"
                        >
                          <option>Vendor Default</option>
                          <option>Manual Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Print Template Mockup */}
                  <div className="col-span-12 md:col-span-5 bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-slate-805 uppercase tracking-wider">Visual Document Template</h3>
                    
                    <div className="relative aspect-video bg-slate-900 overflow-hidden rounded-lg group select-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-slate-950/80 blend-multiply pointer-events-none"></div>
                      <div className="w-full h-full flex flex-col justify-center items-center p-4 border border-slate-800 text-center relative z-10">
                        <FileText className="w-8 h-8 text-cyan-300 opacity-60 mb-2 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-200 tracking-wider">Compliant Standard Voucher layout</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Automated debit credit grids with signature hashes.</p>
                      </div>
                      <div className="absolute inset-x-0 bottom-3 flex justify-center z-25">
                        <button className="bg-white hover:bg-slate-100 text-slate-900 text-[10px] font-semibold px-2 py-1 rounded shadow-md transition-colors flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Preview Template
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 select-none text-slate-700">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formState.qrCodeInvoice}
                          onChange={(e) => setFormState({ ...formState, qrCodeInvoice: e.target.checked })}
                          className="rounded text-cyan-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                        />
                        Include QR Code (E-Invoice compliant)
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formState.signatureLabels}
                          onChange={(e) => setFormState({ ...formState, signatureLabels: e.target.checked })}
                          className="rounded text-cyan-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                        />
                        Display explicit signature lines
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formState.watermarkDraft}
                          onChange={(e) => setFormState({ ...formState, watermarkDraft: e.target.checked })}
                          className="rounded text-cyan-600 focus:ring-0 border-slate-300 h-3.5 w-3.5"
                        />
                        Superimpose 'DRAFT' until fully posted
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Lightbulb Configuration Hint */}
              <div className="bg-cyan-50/50 border border-cyan-150 p-4 rounded-xl flex items-start gap-4 select-none">
                <Lightbulb className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-900 leading-normal">
                  <strong>Configuration Advice:</strong> Modifying the numbering prefix rules mid-fiscal period can result in sequence consolidation warnings during distributed ledger audits. Scheduled maintenance is highly recommended at closure dates.
                </div>
              </div>
            </div>

            {/* Right Logic Preview Summary column (Screen 4 Right sidebar) */}
            <aside className="col-span-12 xl:col-span-3 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden select-none">
                <div className="bg-[#090f24] px-4 py-3 border-b border-[#1e294b] text-white flex items-center gap-2">
                  <SecurityIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Logic Summary</span>
                </div>
                
                <div className="p-5 space-y-5">
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Structure</p>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="text-slate-500">Document Type</span>
                      <span className="font-mono font-bold text-slate-800">{formState.code}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                      <span className="text-slate-500">Live Counter</span>
                      <span className="font-mono text-slate-705">{formState.prefix}-2026-000001</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Validation Gates</p>
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {formState.approvalLevels.length}-Level Process Configured
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Mandatory Dimension Validation
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {formState.postingControl} Constraint
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Strict Budget Limits Applied
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-150">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">Last modified info</span>
                    <p className="text-xs text-slate-800 font-bold mt-1">Lead Auditor (Internal Control)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Security policy card */}
              <div className="bg-cyan-600 text-white rounded-xl p-5 relative overflow-hidden group select-none shadow-sm">
                <SecurityIcon className="absolute -right-6 -bottom-6 w-28 h-28 opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Security Standard</h5>
                <p className="text-[11px] text-cyan-100 leading-normal mb-4 relative z-10">
                   Ensure authorized GL controllers are mapped within roles to prevent posting adjustments after closure dates.
                </p>
                <button 
                  onClick={() => triggerLog('System Auditor', `downloaded policy documentation.`, 'info')}
                  className="text-xs font-bold underline hover:text-cyan-100 relative z-10"
                >
                  View Policy Guidelines
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

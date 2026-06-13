import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Locate,
  Percent,
  Compass,
  FileCheck2,
  Tag
} from 'lucide-react';
import { LookupValue, LookupGroup } from '../types';
import BusinessTooltip from './BusinessTooltip';
import { LOOKUP_GROUPS } from '../data';

interface LookupDataTabProps {
  lookupValues: LookupValue[];
  onAddLookupValue: (val: LookupValue) => void;
  selectedGroupFilter: string;
  onSetGroupFilter: (val: string) => void;
}

export default function LookupDataTab({
  lookupValues,
  onAddLookupValue,
  selectedGroupFilter,
  onSetGroupFilter
}: LookupDataTabProps) {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [groupKey, setGroupKey] = useState('COMPANY');
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Additional detail fields for Branch Lookup
  const [locationCoords, setLocationCoords] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [ifrsClassification, setIfrsClassification] = useState('');
  const [finStatementGroup, setFinStatementGroup] = useState('');

  const filteredValues = useMemo(() => {
    return lookupValues.filter(v => {
      const matchesGroup = selectedGroupFilter === 'All' || v.groupKey === selectedGroupFilter;
      const matchesSearch = 
        v.code.toLowerCase().includes(search.toLowerCase()) ||
        v.displayName.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [lookupValues, selectedGroupFilter, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !displayName) {
      alert('Validation Failure: Please specify both Code and Display Name.');
      return;
    }

    const val: LookupValue = {
      id: `L-${Date.now().toString().slice(-4)}`,
      groupKey,
      code,
      displayName,
      description,
      isActive,
      metaData: groupKey === 'BRANCH' ? {
        location: locationCoords || '9.0300° N, 38.7400° E',
        routing: '01-0000-0',
        currency: 'ETB',
        taxRate: taxRate || '15%',
        ifrsClassification: ifrsClassification || 'IAS 1 - General Disclosure',
        financialStatementGroup: finStatementGroup || 'Cash Equivalents'
      } : undefined
    };

    onAddLookupValue(val);

    // Reset Form
    setCode('');
    setDisplayName('');
    setDescription('');
    setIsActive(true);
    setLocationCoords('');
    setTaxRate('');
    setIfrsClassification('');
    setFinStatementGroup('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Description Header Renamed based on user terminology */}
      <div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-title-lg text-slate-900 leading-tight flex items-center gap-1.5 matches-title">
              <span>Lookup Data Mapping</span>
              <BusinessTooltip text="Interactive ledger records mapped to corporate divisions, segments, VAT classes, and currency exchange codes used to dynamically route journal transactions." />
            </h3>
            <p className="text-body-xs text-outline mt-1 font-medium pb-1">
              Configure IFRS-based ledger accounts, lookup values, posting controls, and tax mappings
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (selectedGroupFilter !== 'All') {
              setGroupKey(selectedGroupFilter);
            }
            setShowAddForm(true);
          }}
          className="bg-primary text-white hover:bg-primary-container px-4 py-1.8 rounded font-sans text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Add Setup Sheet / Add Lookup Group
        </button>
      </div>

      {/* Filter and control board */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-outline-variant rounded bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-outline"
              placeholder="Search lookup codes or names..."
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-outline" />
            <select
              value={selectedGroupFilter}
              onChange={(e) => onSetGroupFilter(e.target.value)}
              className="text-xs border border-outline-variant rounded bg-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface-variant font-medium"
            >
              <option value="All">All Lookup Groups</option>
              {LOOKUP_GROUPS.map((lg, i) => <option key={i} value={lg.groupKey}>{lg.displayName}</option>)}
            </select>
          </div>
        </div>

        <div className="text-body-xs font-mono text-outline font-medium">
          Showing {filteredValues.length} of {lookupValues.length} entries matching
        </div>
      </div>

      {/* Lookup Listing */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 text-label-xs font-extrabold uppercase tracking-wider text-outline border-b border-outline-variant">
                <th className="px-5 py-3.5 font-sans w-[150px]">Lookup Group</th>
                <th className="px-5 py-3.5 font-sans w-[130px]">Code</th>
                <th className="px-5 py-3.5 font-sans w-[220px]">Display Name</th>
                <th className="px-5 py-3.5 font-sans">Description</th>
                <th className="px-4 py-3.5 text-center font-sans w-[100px]">Status</th>
                {/* Custom details when Branch lookup is being shown */}
                <th className="px-5 py-3.5 font-sans w-[280px] bg-slate-50/50">Custom Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-sans text-body-sm text-on-surface">
              {filteredValues.map((val) => (
                <tr key={val.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-black text-primary">
                    {val.groupKey}
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-slate-800 text-xs">
                    {val.code}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {val.displayName}
                  </td>
                  <td className="px-5 py-3 text-xs text-on-surface-variant max-w-[340px] truncate" title={val.description}>
                    {val.description}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {val.isActive ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Inactive</span>
                    )}
                  </td>
                  {/* Custom Extra specifications display with proper labeling (e.g. Location Coordinates instead of Geography) */}
                  <td className="px-5 py-3 bg-slate-50/30 text-body-xs font-medium space-y-1 align-top">
                    {val.groupKey === 'BRANCH' && val.metaData ? (
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <p className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-outline" />
                          <span><span className="font-bold">Location Coordinates:</span> {val.metaData.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Percent className="w-3.5 h-3.5 text-outline" />
                          <span><span className="font-bold">Tax Rate:</span> {val.metaData.taxRate || '15%'}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <FileCheck2 className="w-3.5 h-3.5 text-outline" />
                          <span><span className="font-bold">IFRS Classification:</span> {val.metaData.ifrsClassification || 'IAS 16 - PPE'}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-outline" />
                          <span><span className="font-bold">Financial Statement Group:</span> {val.metaData.financialStatementGroup || 'Accruals'}</span>
                        </p>
                      </div>
                    ) : (
                      <span className="text-outline italic text-xs">Standard lookup metadata schema</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add lookup form modal overlay */}
      {showAddForm && (
        <div id="add-lookup-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 font-sans select-all">
          <div className="bg-white rounded-xl shadow-xl border border-outline-variant w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-bold text-label-lg text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Add Setup Sheet / Add Lookup Group
              </h4>
              <button onClick={() => setShowAddForm(false)} className="text-outline hover:text-slate-800 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Lookup Group Key</label>
                <select
                  value={groupKey}
                  onChange={(e) => setGroupKey(e.target.value)}
                  className="w-full border p-2 rounded bg-white text-slate-800 text-xs font-bold"
                >
                  {LOOKUP_GROUPS.map((lg) => (
                    <option key={lg.groupKey} value={lg.groupKey}>{lg.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lookup Code Key</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, '_'))}
                    className="w-full border p-2 rounded text-slate-800 font-mono font-bold"
                    placeholder="e.g. BRAND-04"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Value / Label</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border p-2 rounded text-slate-800 font-medium"
                    placeholder="e.g. Regional Office Bole"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded text-slate-800"
                  placeholder="Explain what this look value identifies"
                />
              </div>

              {/* Extra branch details if BRANCH selected */}
              {groupKey === 'BRANCH' && (
                <div className="p-3 bg-slate-50 border rounded-lg space-y-3 animate-fadeIn">
                  <span className="block font-sans font-black uppercase text-[9px] tracking-wide text-primary">Regional Coordinates Parameters</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">Location Coordinates</label>
                      <input
                        type="text"
                        value={locationCoords}
                        onChange={(e) => setLocationCoords(e.target.value)}
                        className="w-full border p-1 rounded font-mono text-[11px]"
                        placeholder="9.0300° N, 38.7400° E"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">Tax Rate</label>
                      <input
                        type="text"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="w-full border p-1 rounded text-[11px]"
                        placeholder="15%"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">IFRS Classification</label>
                      <input
                        type="text"
                        value={ifrsClassification}
                        onChange={(e) => setIfrsClassification(e.target.value)}
                        className="w-full border p-1 rounded text-[11px]"
                        placeholder="IAS 16 Property"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-0.5">Financial Statement Group</label>
                      <input
                        type="text"
                        value={finStatementGroup}
                        onChange={(e) => setFinStatementGroup(e.target.value)}
                        className="w-full border p-1 rounded text-[11px]"
                        placeholder="Property, Plant & Equip"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-lookup-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-primary"
                />
                <label htmlFor="add-lookup-active" className="font-bold text-slate-700">Set as Active?</label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-4 py-2 rounded font-bold"
                >
                  Save Lookup Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

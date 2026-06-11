import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ChevronRight,
  Sliders
} from 'lucide-react';
import { EnumValue } from '../types';

interface EnumMasterTabProps {
  enumValues: EnumValue[];
  onAddEnumValue: (newVal: EnumValue) => void;
}

export default function EnumMasterTab({
  enumValues,
  onAddEnumValue
}: EnumMasterTabProps) {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [enumGroup, setEnumGroup] = useState('Account Type');
  const [displayName, setDisplayName] = useState('');
  const [backendKey, setBackendKey] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [usedInField, setUsedInField] = useState('');

  const groups = useMemo(() => {
    return Array.from(new Set(enumValues.map(e => e.enumGroup)));
  }, [enumValues]);

  const filteredEnums = useMemo(() => {
    return enumValues.filter(entry => {
      const matchesSearch = 
        entry.displayName.toLowerCase().includes(search.toLowerCase()) ||
        entry.backendKey.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesGroup = selectedGroup === 'All' || entry.enumGroup === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [enumValues, search, selectedGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !backendKey) {
      alert('Please provide the Business Display Value and Backend Enum Key.');
      return;
    }

    const newVal: EnumValue = {
      enumGroup,
      displayName,
      backendKey: backendKey.toUpperCase().replace(/\s/g, '_'),
      description,
      isDefault,
      isActive,
      sortOrder: Number(sortOrder),
      usedInField: usedInField || 'custom_user_field'
    };

    onAddEnumValue(newVal);
    
    // Reset Form
    setDisplayName('');
    setBackendKey('');
    setDescription('');
    setIsDefault(false);
    setIsActive(true);
    setSortOrder(1);
    setUsedInField('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Description block */}
      <div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-title-lg text-slate-900 leading-tight">
              Enum Master Dictionary
            </h3>
            <p className="text-body-xs text-outline mt-1 font-medium">
              Registered ledger dimensions, status states, and tax applicability option tags
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-white hover:bg-primary-container px-4 py-1.8 rounded font-sans text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Register Enum Value
        </button>
      </div>

      {/* Filter and search control board */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-outline-variant rounded bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-outline"
              placeholder="Search enums..."
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-outline" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs border border-outline-variant rounded bg-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface-variant font-medium"
            >
              <option value="All">All Enum Groups</option>
              {groups.map((g, i) => <option key={i} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="text-body-xs font-mono text-outline font-medium">
          Showing {filteredEnums.length} of {enumValues.length} configuration rows
        </div>
      </div>

      {/* Table Sheet */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-label-xs font-extrabold uppercase tracking-wider text-outline border-b border-outline-variant">
                <th className="px-5 py-3.5 font-sans">Enum Group</th>
                <th className="px-5 py-3.5 font-sans">Business Display Value</th>
                <th className="px-5 py-3.5 font-sans">Backend Enum Key</th>
                <th className="px-5 py-3.5 font-sans">Description</th>
                <th className="px-4 py-3.5 text-center font-sans">Default?</th>
                <th className="px-4 py-3.5 text-center font-sans">Active Status</th>
                <th className="px-4 py-3.5 text-center font-sans">Sort Order</th>
                <th className="px-5 py-3.5 font-sans">Used In Field</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-sans text-body-sm text-on-surface">
              {filteredEnums.map((ent, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-2.8 font-bold text-slate-800 text-xs">
                    {ent.enumGroup}
                  </td>
                  <td className="px-5 py-2.8 font-medium">
                    {ent.displayName}
                  </td>
                  <td className="px-5 py-2.8 font-mono text-xs font-bold text-teal-800 bg-slate-50">
                    {ent.backendKey}
                  </td>
                  <td className="px-5 py-2.8 text-xs text-on-surface-variant max-w-[280px] truncate" title={ent.description}>
                    {ent.description}
                  </td>
                  <td className="px-4 py-2.8 text-center">
                    {ent.isDefault ? (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Default</span>
                    ) : (
                      <span className="text-outline text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.8 text-center">
                    {ent.isActive ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Active</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-2.8 text-center font-mono font-bold text-xs">
                    {ent.sortOrder}
                  </td>
                  <td className="px-5 py-2.8 font-mono text-xs text-slate-600">
                    {ent.usedInField}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Append EnumValue Inline Modal Overlay */}
      {showAddForm && (
        <div id="add-enum-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl border border-outline-variant w-full max-w-md overflow-hidden animate-fadeIn select-all">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-outline-variant flex justify-between items-center">
              <h4 className="font-bold text-label-lg text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Add Setup Sheet / Add Lookup Group Value
              </h4>
              <button onClick={() => setShowAddForm(false)} className="text-outline hover:text-slate-800 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Enum Group Category</label>
                <select
                  value={enumGroup}
                  onChange={(e) => setEnumGroup(e.target.value)}
                  className="w-full border p-2 rounded bg-white text-slate-800 text-xs font-bold"
                >
                  <option value="Account Type">Account Type</option>
                  <option value="Account Nature">Account Nature</option>
                  <option value="Normal Balance">Normal Balance</option>
                  <option value="Posting Allowed">Posting Allowed</option>
                  <option value="SL Type">SL Type</option>
                  <option value="VAT Applicability">VAT Applicability</option>
                  <option value="Account Status">Account Status</option>
                  <option value="Approval Status">Approval Status</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Display Value</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border p-2 rounded text-slate-800"
                    placeholder="e.g. Cleared Account"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Backend Enum Key Value</label>
                  <input
                    type="text"
                    value={backendKey}
                    onChange={(e) => setBackendKey(e.target.value.toUpperCase().replace(/\s/g, '_'))}
                    className="w-full border p-2 rounded text-slate-800 font-mono"
                    placeholder="e.g. CLEARED_ACCT"
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
                  placeholder="Explain the purpose of this option"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Used in Field</label>
                  <input
                    type="text"
                    value={usedInField}
                    onChange={(e) => setUsedInField(e.target.value)}
                    className="w-full border p-2 rounded text-slate-800 font-mono"
                    placeholder="e.g. status"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sorting Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    min={1}
                    className="w-full border p-2 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="add-enum-default"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="add-enum-default" className="font-bold text-slate-700">Set as Default?</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="add-enum-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="add-enum-active" className="font-bold text-slate-700">Set Active?</label>
                </div>
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
                  Save Enum Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

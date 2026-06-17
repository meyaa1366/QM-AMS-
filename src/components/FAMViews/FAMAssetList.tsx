import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  ArrowRightLeft, 
  Sliders, 
  TrendingUp, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Bookmark, 
  Layers, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Clock,
  Eye,
  Settings
} from 'lucide-react';

interface FAMAssetListProps {
  assets: any[];
  onSelectAsset: (asset: any) => void;
  onNavigatePage: (page: string) => void;
  onEditAsset: (asset: any) => void;
}

export default function FAMAssetList({ assets, onSelectAsset, onNavigatePage, onEditAsset }: FAMAssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  
  // Dense Grid states
  const [selectedRowId, setSelectedRowId] = useState<string>('FA-2026-001');
  const [savedViewsActive, setSavedViewsActive] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mass action selected items
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  // Filter lists options
  const categories = ['All', 'Machinery', 'IT', 'Vehicles', 'Furniture', 'Land', 'CIP'];
  const branches = ['All', 'Addis Ababa Head Branch', 'Hawassa Regional Hub'];
  const statuses = ['All', 'In Service', 'Draft', 'Under Construction', 'Suspended', 'Disposed', 'Impaired'];

  const handleToggleRowChecked = (id: string) => {
    setCheckedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleAllRows = (visibleRows: any[]) => {
    const allChecked = visibleRows.every(r => checkedRows[r.id]);
    const next: Record<string, boolean> = { ...checkedRows };
    visibleRows.forEach(r => {
      next[r.id] = !allChecked;
    });
    setCheckedRows(next);
  };

  // Static pre-saved view filters
  const handleApplySavedView = (viewKey: string) => {
    setSavedViewsActive(viewKey);
    if (viewKey === 'all') {
      setSelectedCategoryFilter('All');
      setSelectedStatusFilter('All');
    } else if (viewKey === 'cip') {
      setSelectedCategoryFilter('CIP');
      setSelectedStatusFilter('All');
    } else if (viewKey === 'highvalue') {
      setSelectedCategoryFilter('All');
      setSelectedStatusFilter('All');
      setSearchTerm('');
    } else if (viewKey === 'impaired') {
      setSelectedStatusFilter('Impaired');
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.custodian.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategoryFilter === 'All' || a.assetClass === selectedCategoryFilter;
      const matchBr = selectedBranchFilter === 'All' || a.branch === selectedBranchFilter;
      const matchStat = selectedStatusFilter === 'All' || a.status === selectedStatusFilter;

      // Custom business filter for high value view
      if (savedViewsActive === 'highvalue') {
        return matchSearch && matchCat && matchBr && matchStat && a.acquisitionCost >= 1000000;
      }

      return matchSearch && matchCat && matchBr && matchStat;
    });
  }, [assets, searchTerm, selectedCategoryFilter, selectedBranchFilter, selectedStatusFilter, savedViewsActive]);

  // Paginated visible items
  const visibleAssets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAssets.slice(start, start + itemsPerPage);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;

  // Mass action simulation handler
  const triggerMassAcquisitionSimulation = () => {
    const selectedIds = Object.keys(checkedRows).filter(k => checkedRows[k]);
    if (selectedIds.length === 0) {
      alert('First select row check-boxes to process mass action allocations.');
      return;
    }
    alert(`Triggered mass depreciation recalculation simulation for ${selectedIds.length} subledger accounts. Output synchronized in background buffer.`);
  };

  const handleExportCSV = () => {
    alert('Subledger registry data exported as primary Microsoft Excel spreadsheet layout (.xls). Loaded with general GAAP ledger formatting.');
  };

  return (
    <div className="space-y-4 font-sans" id="fam-asset-list-grid">
      
      {/* SAVED VIEWS DIRECTORY BAR */}
      <div className="bg-slate-50 border border-slate-205 p-3 rounded-xl flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-black uppercase">
          <span className="text-slate-450 flex items-center gap-1 shrink-0"><Bookmark className="w-3.5 h-3.5 text-slate-400" /> Saved Views:</span>
          <button 
            onClick={() => handleApplySavedView('all')}
            className={`px-3 py-1 rounded border cursor-pointer ${savedViewsActive === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            All Capitalized PP&E
          </button>
          <button 
            onClick={() => handleApplySavedView('cip')}
            className={`px-3 py-1 rounded border cursor-pointer ${savedViewsActive === 'cip' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            Awaiting CIP (Under Construction)
          </button>
          <button 
            onClick={() => handleApplySavedView('highvalue')}
            className={`px-3 py-1 rounded border cursor-pointer ${savedViewsActive === 'highvalue' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            High Value (Cost &ge; 1M ETB)
          </button>
        </div>

        <button 
          onClick={() => onNavigatePage('asset-register')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Onboard New Asset</span>
        </button>
      </div>

      {/* SEARCH AND FILTER EXPANSION PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 grid grid-cols-1 md:grid-cols-4 gap-3.5">
        
        {/* Full-text search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text"
            placeholder="Search matching serial, tag, custodian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs font-semibold placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest shrink-0">Class:</span>
          <select 
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setSavedViewsActive('');
            }}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Branch filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest shrink-0">Branch:</span>
          <select 
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest shrink-0">Status:</span>
          <select 
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setSavedViewsActive('');
            }}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

      </div>

      {/* MASS ACTIONS & TABLE CONTROLS COMPONENT */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-950 p-3 rounded-xl text-slate-100">
        
        <div className="flex items-center gap-2 font-mono text-[9.5px]">
          <span className="font-black text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 font-bold">
            {Object.keys(checkedRows).filter(k => checkedRows[k]).length} Selected
          </span>
          <span className="text-slate-450">Bulk subledger utilities:</span>
          <button 
            onClick={triggerMassAcquisitionSimulation}
            className="bg-slate-800 hover:bg-slate-700 text-slate-250 py-1 px-2.5 rounded font-bold cursor-pointer"
          >
            Recalculate Run
          </button>
          <button 
            onClick={() => onNavigatePage('transfer')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-250 py-1 px-2.5 rounded font-bold cursor-pointer"
          >
            Transfer Center
          </button>
          <button 
            onClick={() => onNavigatePage('disposal')}
            className="bg-slate-800 hover:bg-slate-705 text-slate-250 py-1 px-2.5 rounded font-bold cursor-pointer"
          >
            Retire/Dispose
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="bg-slate-850 hover:bg-slate-800 p-1.5 rounded text-white flex items-center gap-1.5 text-[9.5px] font-mono font-black cursor-pointer">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT FILES</span>
          </button>
        </div>

      </div>

      {/* DENSE ENTERPRISE DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs font-sans">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono font-black text-slate-450 uppercase">
              <th className="p-3 w-10 text-center">
                <input 
                  type="checkbox"
                  checked={visibleAssets.length > 0 && visibleAssets.every(r => checkedRows[r.id])}
                  onChange={() => handleToggleAllRows(visibleAssets)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="p-3 pl-4">Asset Tag</th>
              <th className="p-3">Asset Master Description</th>
              <th className="p-3">Class</th>
              <th className="p-3">Acquisition Date</th>
              <th className="p-3 text-right">Acquisition Cost</th>
              <th className="p-3 text-right">Carrying NBV</th>
              <th className="p-3">Branch/Location</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-slate-700">
            {visibleAssets.map(asset => {
              const capCost = asset.acquisitionCost + (asset.revaluationSurplus || 0);
              const accumDepr = asset.accumulatedDepreciation || 0;
              const carryValue = capCost - accumDepr - (asset.impairmentAccumulated || 0);
              const isChecked = checkedRows[asset.id] || false;

              return (
                <tr 
                  key={asset.id} 
                  onClick={() => onSelectAsset(asset)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedRowId === asset.id ? 'bg-indigo-50/20' : ''}`}
                >
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleRowChecked(asset.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-3 pl-4 font-mono font-extrabold text-indigo-750">{asset.id}</td>
                  <td className="p-3">
                    <div className="font-extrabold text-slate-900 leading-snug">{asset.name}</div>
                    <div className="text-[10px] text-slate-450 mt-0.5">Custodian: {asset.custodian} • Cost Center: {asset.costCenter}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-500 uppercase text-[10px]">{asset.assetClass}</td>
                  <td className="p-3 font-mono text-[10.5px] text-slate-600">{asset.acquisitionDate}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">{asset.acquisitionCost.toLocaleString()} ETB</td>
                  <td className="p-3 text-right font-mono font-black text-indigo-900">{carryValue.toLocaleString()} ETB</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-750 truncate max-w-[140px] uppercase text-[10px]">{asset.branch.split(' Hub')[0].split(' Branch')[0]}</div>
                    <div className="text-[9px] text-slate-550 truncate max-w-[140px] italic">{asset.location}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block text-[9px] font-mono leading-none font-black px-2 py-1 rounded border uppercase ${
                      asset.status === 'In Service' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 
                      asset.status === 'Draft' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' : 
                      asset.status === 'Under Construction' ? 'bg-amber-50 text-amber-700 border-amber-150' : 
                      asset.status === 'Impaired' ? 'bg-rose-50 text-rose-700 border-rose-150' : 
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5 justify-center">
                      <button 
                        onClick={() => onEditAsset(asset)}
                        className="bg-white hover:bg-slate-100 text-slate-700 border p-1 rounded font-bold uppercase text-[9.5px] tracking-tight cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onSelectAsset(asset)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-750 p-1 px-1.5 rounded font-bold uppercase text-[9.5px] tracking-tight cursor-pointer"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={10} className="p-10 border border-dashed text-center text-slate-500 text-xs py-16">
                  ✕ No capitalized assets located matching active criteria. Check subledger scope filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-2 pb-4">
        <span>Showing {filteredAssets.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(filteredAssets.length, currentPage * itemsPerPage)} of {filteredAssets.length} ledger cards</span>
        
        <div className="flex gap-2.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="bg-white border p-1 rounded hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1 cursor-pointer"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="py-1 px-2.5 bg-slate-100 rounded text-slate-800 font-bold">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="bg-white border p-1 rounded hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1 cursor-pointer"
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

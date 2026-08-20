import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Asset, Category, Location, Department, Vendor } from '../../types';

interface AssetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (assets: Partial<Asset>[]) => Promise<{ count: number; errors: string[] }>;
  categories: Category[];
  locations: Location[];
  departments: Department[];
  vendors: Vendor[];
}

export function AssetImportModal({
  isOpen,
  onClose,
  onImport,
  categories,
  locations,
  departments,
  vendors
}: AssetImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedAssets, setParsedAssets] = useState<Partial<Asset>[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number; errors: string[] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadSampleTemplate = () => {
    const headers = [
      'assetTag',
      'name',
      'brand',
      'model',
      'serialNumber',
      'purchaseDate',
      'purchaseCost',
      'warrantyExpiry',
      'status',
      'notes'
    ];
    const sampleRows = [
      'AST-2024-501,Dell UltraSharp 32,Dell,U3223QE,CN-088192,2024-01-10,899.00,2027-01-10,Available,Primary designer monitor',
      'AST-2024-502,MacBook Air 15 M2,Apple,MacBook Air 15,C02G19829M,2024-02-15,1499.00,2027-02-15,Available,Standard marketing laptop'
    ];
    const csvContent = `${headers.join(',')}\r\n${sampleRows.join('\r\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'assethub_sample_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setParseError(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          setParseError('CSV must have a header row and at least one data row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const assets: Partial<Asset>[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple CSV splitter respecting quotes
          const rawRow = lines[i];
          const cols: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let char of rawRow) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cols.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          cols.push(current.trim());

          const rowData: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowData[h] = (cols[idx] || '').replace(/^"|"$/g, '');
          });

          if (rowData.name || rowData.assetTag) {
            assets.push({
              assetTag: rowData.assetTag || `AST-${Date.now()}-${i}`,
              name: rowData.name || 'Unnamed Asset',
              brand: rowData.brand || 'Generic',
              model: rowData.model || 'Standard',
              serialNumber: rowData.serialNumber || `SN-${Date.now()}-${i}`,
              purchaseDate: rowData.purchaseDate || new Date().toISOString().split('T')[0],
              purchaseCost: Number(rowData.purchaseCost) || 0,
              warrantyExpiry: rowData.warrantyExpiry || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
              categoryId: categories[0]?.id,
              locationId: locations[0]?.id,
              departmentId: departments[0]?.id,
              vendorId: vendors[0]?.id,
              status: (rowData.status as any) || 'Available',
              notes: rowData.notes || 'Imported via CSV batch'
            });
          }
        }

        if (assets.length === 0) {
          setParseError('No valid asset rows found in this file.');
        } else {
          setParsedAssets(assets);
        }
      } catch (err: any) {
        setParseError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleStartImport = async () => {
    if (parsedAssets.length === 0) return;
    try {
      setLoading(true);
      const result = await onImport(parsedAssets);
      setImportResult(result);
    } catch (err: any) {
      setParseError(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Import Assets from CSV
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Bulk register existing hardware inventories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Download Template Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
            <div>
              <div className="font-semibold text-indigo-900 dark:text-indigo-200">
                Need the standard spreadsheet format?
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-400">
                Download a pre-formatted template with sample asset columns
              </div>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* Drag and drop area */}
          {!importResult && (
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="font-semibold text-slate-900 dark:text-white">
                Drag and drop your CSV file here
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                or click below to browse your computer
              </p>

              <label className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium cursor-pointer transition-colors shadow-sm">
                Select CSV File
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {fileName && (
                <p className="mt-3 text-indigo-600 dark:text-indigo-400 font-medium">
                  Selected: {fileName} ({parsedAssets.length} assets ready)
                </p>
              )}
            </div>
          )}

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Import Result Feedback */}
          {importResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Successfully imported {importResult.count} assets into AssetHub!
              </div>
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="text-rose-600 dark:text-rose-400 text-[11px] pt-1">
                  <strong>Warnings / Skipped:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {importResult.errors.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedAssets.length > 0 && !importResult && (
            <div className="space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white flex justify-between">
                <span>Preview ({parsedAssets.length} rows detected)</span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                    <tr>
                      <th className="p-2">Tag</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Brand</th>
                      <th className="p-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedAssets.slice(0, 10).map((a, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono">{a.assetTag}</td>
                        <td className="p-2 font-medium">{a.name}</td>
                        <td className="p-2">{a.brand}</td>
                        <td className="p-2">${a.purchaseCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              {importResult ? 'Close' : 'Cancel'}
            </button>
            {!importResult && (
              <button
                type="button"
                onClick={handleStartImport}
                disabled={loading || parsedAssets.length === 0}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                Import {parsedAssets.length} Assets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

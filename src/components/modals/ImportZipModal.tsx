import React, { useState } from 'react';
import { X, UploadCloud, FileArchive, CheckCircle2 } from 'lucide-react';

interface ImportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (productName: string, price: number, variantsCount: number) => void;
}

export const ImportZipModal: React.FC<ImportZipModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState('Tournevis électrique sans fil 36V');
  const [itemPrice, setItemPrice] = useState('189');
  const [targetAccounts, setTargetAccounts] = useState(['0606599967', 'ArabePlus']);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onImportSuccess(itemTitle, parseFloat(itemPrice) || 199, 12);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Import Listing ZIP Archive</h2>
              <p className="text-xs text-slate-400">Batch upload photos, title spin-syntax & descriptions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSimulatedSubmit} className="p-6 space-y-4 text-xs">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : selectedFileName
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
            }`}
          >
            <input
              type="file"
              accept=".zip,.tar.gz"
              onChange={handleFileChange}
              className="hidden"
              id="zip-upload"
            />
            <label htmlFor="zip-upload" className="cursor-pointer flex flex-col items-center">
              {selectedFileName ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                  <span className="font-semibold text-emerald-300 text-sm">{selectedFileName}</span>
                  <span className="text-slate-400 mt-1">Ready to unpack and generate variants</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="font-medium text-slate-200 text-sm">
                    Drag and drop your ZIP file here, or browse
                  </span>
                  <span className="text-slate-500 mt-1 text-[11px]">
                    Must contain images folder + optional manifest.json / variants.txt
                  </span>
                </>
              )}
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Article Title (Default Primary)</label>
            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Selling Price (dhs)</label>
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Auto-generate Variants</label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                <option value="12">12 variants (2 per major city)</option>
                <option value="20">20 variants (Multi-account rotation)</option>
                <option value="40">40 variants (Full Morocco coverage)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Distribute Across Accounts</label>
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              {['0606599967', '0606629961', 'ArabePlus', 'o25@live.fr'].map((acc) => (
                <label key={acc} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={targetAccounts.includes(acc)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTargetAccounts([...targetAccounts, acc]);
                      } else {
                        setTargetAccounts(targetAccounts.filter((a) => a !== acc));
                      }
                    }}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="font-mono text-[11px] truncate">{acc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? 'Processing ZIP...' : 'Import & Publish'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

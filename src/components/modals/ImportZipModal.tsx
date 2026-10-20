import React, { useState, useRef } from 'react';
import { X, ChevronDown, RotateCw } from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [condition, setCondition] = useState('Use condition in ZIP');
  const [category, setCategory] = useState('Choose later');
  const [isReloadingCategories, setIsReloadingCategories] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReloadCategories = () => {
    setIsReloadingCategories(true);
    setTimeout(() => {
      setIsReloadingCategories(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const parsedPrice = parseFloat(priceInput) || 199;
      const fileNameWithoutExt = selectedFile
        ? selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        : 'Pack Produit Nouveauté (Multi-Versions)';
      
      onImportSuccess(fileNameWithoutExt, parsedPrice, 12);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-[520px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <h2 className="text-base font-bold text-white tracking-tight">
            Import product versions
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Subtitle Description */}
          <p className="text-slate-400 text-xs leading-relaxed">
            One product, all its versions and photos. Connected accounts receive different versions automatically; you can change them before publishing.
          </p>

          {/* Field 1: ZIP Archive */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium flex items-center gap-1">
              <span>ZIP archive</span>
              <span className="text-red-400">*</span>
            </label>

            {/* Custom File Chooser Input */}
            <div className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-lg">
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.rar,.tar.gz"
                onChange={handleFileChange}
                className="hidden"
                id="zip-archive-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                Choisir un fichier
              </button>
              <span className="text-slate-400 text-xs truncate">
                {selectedFile ? selectedFile.name : 'Aucun fichier choisi'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Up to 100 MB. Include a UTF-8 CSV and JPEG, PNG or WebP photos.
            </p>
          </div>

          {/* Field 2 & 3: Price (dhs) & Condition Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Price (dhs) */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Price (dhs)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Use price in ZIP"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Condition</label>
              <div className="relative">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Use condition in ZIP">Use condition in ZIP</option>
                  <option value="New">New</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Fair">Used - Fair</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Field 4: Facebook Category with Reload Categories */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Facebook category</label>
              <button
                type="button"
                onClick={handleReloadCategories}
                disabled={isReloadingCategories}
                className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3 h-3 ${isReloadingCategories ? 'animate-spin' : ''}`} />
                <span>Reload categories</span>
              </button>
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Choose later">Choose later</option>
                <option value="Tools & Home Improvement">Tools & Home Improvement</option>
                <option value="Household & Kitchen Essentials">Household & Kitchen Essentials</option>
                <option value="Electronics & Appliances">Electronics & Appliances</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Auto Parts & Accessories">Auto Parts & Accessories</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <p className="text-[11px] text-slate-500">
              Categories from o25@live.fr. Each account uses its own selling city.
            </p>
          </div>

          {/* Callout Box: Dashed Border Note */}
          <div className="p-3.5 rounded-lg border border-dashed border-blue-500/40 bg-blue-500/5 text-slate-300 text-xs leading-relaxed">
            The import creates drafts. Publish from Account listings after reviewing the versions.
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
            >
              {isProcessing ? 'Importing...' : 'Import product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

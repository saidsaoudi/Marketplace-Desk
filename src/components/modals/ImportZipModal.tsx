import React, { useState, useRef } from 'react';
import { X, ChevronDown, RotateCw, Plus, Check, ImagePlus, Trash2, ExternalLink } from 'lucide-react';
import { FacebookAccount } from '../../types';

const FB_CATEGORIES = [
  'Choose later',
  'Maison et cuisine',
  'Tools & Home Improvement',
  'Household & Kitchen Essentials',
  'Electronics & Appliances',
  'Beauty & Personal Care',
  'Auto Parts & Accessories',
  'Vêtements & Mode',
  'Jouets & Loisirs',
  'Sport & Outdoor',
  'Animaux & Accessoires',
];

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
  'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan',
  'Safi', 'El Jadida', 'Beni Mellal', 'Laâyoune',
];

export interface NewArticleData {
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  description: string;
  facebookUrl: string;
  status: 'Published' | 'Draft';
  image: string;
  selectedAccountIds: string[];
}

interface ImportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (productName: string, price: number, variantsCount: number) => void;
  onAddArticle?: (data: NewArticleData) => void;
  accounts?: FacebookAccount[];
}

export const ImportZipModal: React.FC<ImportZipModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onAddArticle,
  accounts = [],
}) => {
  // Product details (matching the screenshot form)
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('New');
  const [category, setCategory] = useState('Maison et cuisine');
  const [location, setLocation] = useState('Casablanca');
  const [description, setDescription] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('https://www.facebook.com/marketplace/you/selling');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [publishToFacebook, setPublishToFacebook] = useState(true);

  // Account selection
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const [isReloadingCategories, setIsReloadingCategories] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10 - photoFiles.length);
    const newFiles = [...photoFiles, ...files].slice(0, 10);
    setPhotoFiles(newFiles);
    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreviews((prev) => [...prev, ev.target?.result as string].slice(0, 10));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectAllAccounts = () => {
    if (selectedAccountIds.length === accounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(accounts.map((a) => a.id));
    }
  };

  const handleReloadCategories = () => {
    setIsReloadingCategories(true);
    setTimeout(() => setIsReloadingCategories(false), 600);
  };

  const handleReset = () => {
    setTitle('');
    setPrice('');
    setCondition('New');
    setCategory('Maison et cuisine');
    setLocation('Casablanca');
    setDescription('');
    setFacebookUrl('https://www.facebook.com/marketplace/you/selling');
    setStatus('Published');
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setSelectedAccountIds([]);
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsProcessing(true);

    const parsedPrice = parseFloat(price) || 199;
    const variantsCount = selectedAccountIds.length > 0 ? selectedAccountIds.length : accounts.length || 5;
    const primaryImage = photoPreviews[0] || '/src/assets/images/product_cordless_drill_kit_1792497060070.jpg';

    // If publishing to Facebook Marketplace is enabled
    if (publishToFacebook) {
      const articlePayload = {
        title: title.trim(),
        price: parsedPrice,
        category,
        condition,
        location,
        description,
        image: primaryImage,
      };

      // 1. Send to Extension via window.postMessage
      try {
        window.postMessage({
          type: 'MP_PUBLISH_ARTICLE',
          article: articlePayload,
        }, '*');
      } catch (e) {}

      // 2. Clipboard fallback
      try {
        const textToCopy = `Titre: ${title.trim()}\nPrix: ${parsedPrice} MAD\nVille: ${location}\nCatégorie: ${category}\n${description ? `Description:\n${description}` : ''}`;
        navigator.clipboard.writeText(textToCopy);
      } catch (err) {}

      // 3. Open Facebook Marketplace Item creation with payload in hash
      const encoded = encodeURIComponent(JSON.stringify(articlePayload));
      window.open(`https://www.facebook.com/marketplace/create/item#mp_data=${encoded}`, '_blank');
    }

    setTimeout(() => {
      if (onAddArticle) {
        onAddArticle({
          title: title.trim(),
          price: parsedPrice,
          category,
          condition,
          location,
          description,
          facebookUrl,
          status,
          image: primaryImage,
          selectedAccountIds,
        });
      } else if (onImportSuccess) {
        onImportSuccess(title.trim(), parsedPrice, variantsCount);
      }
      handleReset();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full shadow-2xl overflow-hidden flex"
        style={{ maxWidth: '860px', maxHeight: '92vh' }}
      >
        {/* ── LEFT COLUMN: Product form (matching screenshot) ─────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Add Article</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Create a marketplace product, photos and assign to Facebook accounts.
                </p>
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/marketplace/you/selling"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/30 text-blue-400 text-[11px] font-medium transition-colors"
                title="Open Facebook Marketplace Selling"
              >
                <span className="font-bold text-[#1877f2]" style={{ fontFamily: 'Georgia, serif' }}>f</span>
                <span>FB Selling</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={handleClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs flex-1">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. منظف زجاج مغناطيسي ثنائي الجوانب | Nettoyage facile"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Price + Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">
                  Price (MAD) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="59"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Condition</label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Facebook category + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">Facebook category</label>
                  <button
                    type="button"
                    onClick={handleReloadCategories}
                    disabled={isReloadingCategories}
                    className="text-blue-400 hover:text-blue-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3 h-3 ${isReloadingCategories ? 'animate-spin' : ''}`} />
                    Reload
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {FB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">HTTP publishing uses your saved Facebook selling city: {location}.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Location</label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">Change your selling city in Facebook and reopen this form to use another location.</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Description</label>
              <textarea
                rows={4}
                placeholder="نظافة سريعة وسهلة للزجاج من الداخل والخارج بنفس الوقت..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs resize-y min-h-[80px]"
              />
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <label className="text-slate-300 font-medium">Photos</label>
              <div className="flex flex-wrap gap-2">
                {/* Add photo button */}
                {photoFiles.length < 10 && (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="w-14 h-14 rounded-lg border border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[9px]">Add</span>
                  </button>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotosChange}
                  className="hidden"
                />
                {/* Photo thumbnails */}
                {photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative w-14 h-14 group">
                    <img
                      src={src}
                      alt={`photo-${idx}`}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {/* Placeholder if no photos */}
                {photoPreviews.length === 0 && (
                  <div className="w-14 h-14 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center">
                    <span className="text-slate-600 text-[9px] text-center">No photo</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Up to 10 photos. 8 MB each. JPEG, PNG or WebP.</p>
            </div>

            {/* Status + Facebook URL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Status</label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">Saving existing listing details updates your workspace.</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">Facebook Marketplace URL</label>
                  <a
                    href="https://www.facebook.com/marketplace/you/selling"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1"
                  >
                    Open Selling <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/marketplace/you/selling"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                />
                <p className="text-[11px] text-slate-500">Connected with Facebook Marketplace selling management.</p>
              </div>
            </div>

            {/* Direct Facebook Marketplace Publishing Toggle */}
            <div className="p-3.5 rounded-xl bg-[#1877f2]/10 border border-[#1877f2]/30 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToFacebook}
                  onChange={(e) => setPublishToFacebook(e.target.checked)}
                  className="rounded border-slate-700 text-[#1877f2] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Publier directement sur Facebook Marketplace</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1877f2]/20 border border-[#1877f2]/40 text-blue-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1877f2] animate-ping" />
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ouvre automatiquement <strong>+ Ajouter un article</strong> sur Facebook (<span className="text-blue-300 font-mono">marketplace/create/item</span>) avec copie rapide des détails.
                  </p>
                </div>
              </label>

              <div className="flex items-center gap-2 pt-1.5 border-t border-[#1877f2]/20 text-[11px] text-slate-400">
                <span className="text-slate-500">Destination:</span>
                <a
                  href="https://www.facebook.com/marketplace/you/selling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  facebook.com/marketplace/you/selling (Vos annonces) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !title.trim()}
                className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    Adding Article...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN: Account selector ──────────────────────────── */}
        <div
          className="w-64 shrink-0 border-l border-slate-800 flex flex-col bg-slate-950/40"
          style={{ minWidth: '240px', maxWidth: '260px' }}
        >
          <div className="px-4 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-white">Publish to accounts</h3>
              <button
                type="button"
                onClick={selectAllAccounts}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                {selectedAccountIds.length === accounts.length && accounts.length > 0 ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Choose which Facebook accounts will publish this article in Marketplace.
            </p>
          </div>

          {accounts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-slate-500 text-lg">f</span>
              </div>
              <p className="text-[11px] text-slate-500">No accounts connected yet.</p>
              <p className="text-[10px] text-slate-600">Go to Accounts to add Facebook accounts.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {accounts.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccount(acc.id)}
                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/50 text-white'
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {acc.avatarInitial}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{acc.identifier}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            acc.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                        <span className={`text-[10px] ${acc.status === 'Online' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {acc.status}
                        </span>
                        {acc.proxy?.ip && (
                          <span className="text-[10px] text-slate-600 truncate">· {acc.proxy.ip.split('.').slice(0, 2).join('.')}...</span>
                        )}
                      </div>
                    </div>

                    {/* Checkmark */}
                    <div
                      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected count footer */}
          <div className="px-4 py-3 border-t border-slate-800 shrink-0">
            <p className="text-[11px] text-slate-400 text-center">
              {selectedAccountIds.length > 0 ? (
                <span className="text-blue-400 font-semibold">{selectedAccountIds.length} account{selectedAccountIds.length > 1 ? 's' : ''} selected</span>
              ) : accounts.length > 0 ? (
                <span className="text-slate-500">All accounts will be used</span>
              ) : (
                <span className="text-slate-600">No accounts available</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

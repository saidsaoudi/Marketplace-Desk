import React, { useState, useEffect, useRef } from 'react';
import { ArticleListing } from '../../types';
import { X, ChevronDown } from 'lucide-react';

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleListing | null;
  onSave: (updatedArticle: ArticleListing) => void;
}

export const EditArticleModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | string>(59);
  const [condition, setCondition] = useState('New');
  const [category, setCategory] = useState('Maison et cuisine');
  const [location, setLocation] = useState('Casablanca');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [status, setStatus] = useState<ArticleListing['status']>('Published');
  const [facebookUrl, setFacebookUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setPrice(article.price ?? 59);
      setCondition(article.condition || 'New');
      setCategory(article.category || 'Maison et cuisine');
      setLocation(article.location || 'Casablanca');
      setDescription(
        article.description ||
          'نظافة سريعة وسهلة للزجاج من الداخل والخارج بنفس الوقت. منظف زجاج مغناطيسي ثنائي الجوانب كيعاونك تنظف النوافذ بدون مجهود كبير. مناسب لزجاج النوافذ، البالكون وواجهات الزجاج. Kayji m3ah accessoires de rechange pour une utilisation pratique au quotidien.'
      );
      setImagePreview(article.image || '');
      setSelectedFileName('');
      setStatus(article.status || 'Published');
      setFacebookUrl(article.facebookUrl || '');
    }
  }, [article, isOpen]);

  if (!isOpen || !article) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...article,
      title: title.trim() || article.title,
      price: typeof price === 'string' ? parseFloat(price) || 0 : price,
      condition,
      category,
      location,
      description,
      image: imagePreview || article.image,
      status,
      facebookUrl: facebookUrl.trim(),
      updatedAt: 'Just now',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-[580px] max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <h2 className="text-base font-bold text-white tracking-tight">
            Edit listing
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Field 1: Title * */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium flex items-center gap-1">
              <span>Title</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 font-normal leading-relaxed text-xs"
            />
          </div>

          {/* Field 2 & 3: Price (MAD) * & Condition Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Price (MAD) * */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1">
                <span>Price (MAD)</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Condition</label>
              <div className="relative">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-8 py-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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

          {/* Field 4 & 5: Facebook Category & Location Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Facebook Category */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Facebook category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-8 py-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Maison et cuisine">Maison et cuisine</option>
                  <option value="Outils et bricolage">Outils et bricolage</option>
                  <option value="Électronique et électroménager">Électronique et électroménager</option>
                  <option value="Auto et moto">Auto et moto</option>
                  <option value="Santé et beauté">Santé et beauté</option>
                  <option value="Sports et loisirs">Sports et loisirs</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="space-y-0.5 pt-0.5 text-[11px] text-slate-500 leading-tight">
                <p>HTTP publishing uses your saved Facebook selling city: Casablanca.</p>
                <p>Choose a Facebook category before publishing.</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-normal"
              />
              <p className="pt-0.5 text-[11px] text-slate-500 leading-tight">
                Change your selling city in Facebook and reopen this form to use another location.
              </p>
            </div>

          </div>

          {/* Field 6: Description */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter full product description in Darija, Arabic or French..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 text-xs leading-relaxed resize-y"
            />
          </div>

          {/* Field 7: Photos */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium">Photos</label>
            
            {/* Custom File Chooser Input */}
            <div className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-lg">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="edit-listing-photo-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                Sélect. fichiers
              </button>
              <span className="text-slate-400 text-xs truncate">
                {selectedFileName || 'Aucun fichier choisi'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Up to 10 photos, 8 MB each. JPEG, PNG or WebP.
            </p>

            {/* Thumbnail Preview & Remove Button */}
            {imagePreview && (
              <div className="pt-1 flex flex-col items-start gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Listing thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-md transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Field 8 & 9: Status & Facebook Listing URL Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleListing['status'])}
                  className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-8 py-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="pt-0.5 text-[11px] text-slate-500 leading-tight">
                Saving existing listing details updates your workspace.
              </p>
            </div>

            {/* Facebook Listing URL */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Facebook listing URL</label>
              <input
                type="text"
                placeholder="Optional for a draft"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500 font-normal"
              />
              <p className="pt-0.5 text-[11px] text-slate-500 leading-tight">
                Optional for drafts. Publish fills this in automatically. Published or Sold requires an existing Facebook link.
              </p>
            </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              Save listing
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

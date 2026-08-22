import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Printer,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Sliders,
  Stamp,
  Receipt,
  FileSpreadsheet,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Save,
  Check,
  Building2,
  FileCheck2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Company } from '../types';

interface CompanyBrandingStudioProps {
  company: Company;
  onSave: (updatedFields: Partial<Company>, reason?: string) => void;
}

// Preset modern corporate logos
const PRESET_LOGOS = [
  {
    id: 'preset-crest',
    name: 'Holdings Apex Crest',
    url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-tech',
    name: 'Industrial & Technology',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-energy',
    name: 'Clean Energy & Utilities',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-logistics',
    name: 'Global Supply & Logistics',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=128&auto=format&fit=crop&q=80'
  }
];

// Preset Color Palettes
const PRESET_PALETTES = [
  { name: 'Royal Indigo', primary: '#4f46e5', secondary: '#06b6d4' },
  { name: 'Emerald Corporate', primary: '#059669', secondary: '#10b981' },
  { name: 'Midnight Navy', primary: '#1e3a8a', secondary: '#38bdf8' },
  { name: 'Crimson Executive', primary: '#dc2626', secondary: '#f97316' },
  { name: 'Amber Slate', primary: '#d97706', secondary: '#64748b' },
  { name: 'Modern Violet', primary: '#7c3aed', secondary: '#ec4899' },
  { name: 'Deep Teal', primary: '#0d9488', secondary: '#06b6d4' },
  { name: 'Charcoal Minimal', primary: '#334155', secondary: '#475569' }
];

export const CompanyBrandingStudio: React.FC<CompanyBrandingStudioProps> = ({ company, onSave }) => {
  // Local state initialized from company
  const [brandColor, setBrandColor] = useState(company.brandColor || '#4f46e5');
  const [brandSecondaryColor, setBrandSecondaryColor] = useState(company.brandSecondaryColor || '#06b6d4');
  const [logo, setLogo] = useState(company.logo || '');
  const [watermarkText, setWatermarkText] = useState(company.watermarkText || `${company.legalName.toUpperCase()} CONFIDENTIAL`);
  const [watermarkEnabled, setWatermarkEnabled] = useState(company.watermarkEnabled ?? true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(company.watermarkOpacity ?? 15);
  const [watermarkAngle, setWatermarkAngle] = useState(company.watermarkAngle ?? -30);
  const [letterheadTemplate, setLetterheadTemplate] = useState<
    'Default Standard' | 'Modern Minimalist' | 'Executive Classic' | 'Bilingual English/Arabic' | 'Centered Official'
  >(company.letterheadTemplate || 'Default Standard');
  const [letterheadHeaderHtml, setLetterheadHeaderHtml] = useState(company.letterheadHeaderHtml || '');
  const [letterheadFooterHtml, setLetterheadFooterHtml] = useState(company.letterheadFooterHtml || '');
  const [headerTagline, setHeaderTagline] = useState(company.headerTagline || 'Enterprise Commercial Solutions & Operations');
  const [footerBankDetails, setFooterBankDetails] = useState(
    company.footerBankDetails || 'Bank Muscat SAOG • IBAN: OM02BMUS00192837465001 • SWIFT: BMUSOMRX'
  );
  const [arabicLegalName, setArabicLegalName] = useState(company.arabicLegalName || 'شركة آرتفاي القابضة ش.م.ع.م');
  const [arabicAddress, setArabicAddress] = useState(company.arabicAddress || 'مجمع القرم التجاري، مسقط، سلطنة عُمان');
  const [stampEnabled, setStampEnabled] = useState(company.stampEnabled ?? true);
  const [signatureOfficerName, setSignatureOfficerName] = useState(
    company.signatureOfficerName || company.managingDirectorName || 'Eng. Salim Al-Rawahi'
  );
  const [signatureOfficerTitle, setSignatureOfficerTitle] = useState(
    company.signatureOfficerTitle || 'Managing Director & CEO'
  );

  // Document preview simulation type
  const [docType, setDocType] = useState<'invoice' | 'po' | 'letterhead' | 'voucher'>('invoice');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever selected company changes
  useEffect(() => {
    setBrandColor(company.brandColor || '#4f46e5');
    setBrandSecondaryColor(company.brandSecondaryColor || '#06b6d4');
    setLogo(company.logo || '');
    setWatermarkText(company.watermarkText || `${company.legalName.toUpperCase()} CONFIDENTIAL`);
    setWatermarkEnabled(company.watermarkEnabled ?? true);
    setWatermarkOpacity(company.watermarkOpacity ?? 15);
    setWatermarkAngle(company.watermarkAngle ?? -30);
    setLetterheadTemplate(company.letterheadTemplate || 'Default Standard');
    setLetterheadHeaderHtml(company.letterheadHeaderHtml || '');
    setLetterheadFooterHtml(company.letterheadFooterHtml || '');
    setHeaderTagline(company.headerTagline || 'Enterprise Commercial Solutions & Operations');
    setFooterBankDetails(
      company.footerBankDetails || 'Bank Muscat SAOG • IBAN: OM02BMUS00192837465001 • SWIFT: BMUSOMRX'
    );
    setArabicLegalName(company.arabicLegalName || 'شركة آرتفاي القابضة ش.م.ع.م');
    setArabicAddress(company.arabicAddress || 'مجمع القرم التجاري، مسقط، سلطنة عُمان');
    setStampEnabled(company.stampEnabled ?? true);
    setSignatureOfficerName(company.signatureOfficerName || company.managingDirectorName || 'Eng. Salim Al-Rawahi');
    setSignatureOfficerTitle(company.signatureOfficerTitle || 'Managing Director & CEO');
  }, [company]);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = () => {
    onSave(
      {
        brandColor,
        brandSecondaryColor,
        logo,
        watermarkText,
        watermarkEnabled,
        watermarkOpacity,
        watermarkAngle,
        letterheadTemplate,
        letterheadHeaderHtml,
        letterheadFooterHtml,
        headerTagline,
        footerBankDetails,
        arabicLegalName,
        arabicAddress,
        stampEnabled,
        signatureOfficerName,
        signatureOfficerTitle
      },
      'Updated corporate branding, official watermark, and statutory letterhead template'
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to original company properties
  const handleReset = () => {
    setBrandColor(company.brandColor || '#4f46e5');
    setBrandSecondaryColor(company.brandSecondaryColor || '#06b6d4');
    setLogo(company.logo || '');
    setWatermarkText(company.watermarkText || `${company.legalName.toUpperCase()} CONFIDENTIAL`);
    setWatermarkEnabled(company.watermarkEnabled ?? true);
    setWatermarkOpacity(company.watermarkOpacity ?? 15);
    setWatermarkAngle(company.watermarkAngle ?? -30);
    setLetterheadTemplate(company.letterheadTemplate || 'Default Standard');
    setLetterheadHeaderHtml(company.letterheadHeaderHtml || '');
    setLetterheadFooterHtml(company.letterheadFooterHtml || '');
  };

  // Trigger print test
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6" id="company-branding-studio">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-xs font-bold text-sm"
            style={{ backgroundColor: brandColor }}
          >
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Corporate Branding & Letterhead Studio</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                {company.code}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure corporate logos, brand accent colors, statutory watermarks, and multi-template document headers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Test</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Branding Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Branding Controls */}
        <div className="space-y-6">
          {/* Card 1: Corporate Identity & Logo Manager */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Corporate Logo & Visual Asset</span>
              </h4>
              <span className="text-[11px] text-slate-400">High-Resolution Vector / Raster</span>
            </div>

            {/* Logo Preview & Upload Station */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-24 h-24 rounded-xl bg-white border border-slate-200 shadow-inner flex items-center justify-center p-2 relative shrink-0 overflow-hidden group">
                {logo ? (
                  <img
                    src={logo}
                    alt="Corporate Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-slate-300" />
                )}
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo('')}
                    title="Remove Logo"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-300" />
                  </button>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Logo File</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Or Direct Image URL / Preset:
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={e => setLogo(e.target.value)}
                    placeholder="https://... or paste image link"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* Preset Logo Quick Selectors */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-slate-400">Presets:</span>
                  {PRESET_LOGOS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setLogo(p.url)}
                      className="px-2 py-0.5 text-[10px] rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-700 cursor-pointer font-medium"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Corporate Color Palette Pickers */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700">Corporate Color Identity</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Brand Accent */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Primary Brand Accent</span>
                    <div
                      className="w-5 h-5 rounded-md shadow-2xs border border-black/10"
                      style={{ backgroundColor: brandColor }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={e => setBrandColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={e => setBrandColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-semibold bg-white uppercase"
                    />
                  </div>
                </div>

                {/* Secondary Brand Accent */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Secondary Accent</span>
                    <div
                      className="w-5 h-5 rounded-md shadow-2xs border border-black/10"
                      style={{ backgroundColor: brandSecondaryColor }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandSecondaryColor}
                      onChange={e => setBrandSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={brandSecondaryColor}
                      onChange={e => setBrandSecondaryColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-semibold bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Color Themes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500">Quick Palette Themes:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PALETTES.map(pal => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => {
                        setBrandColor(pal.primary);
                        setBrandSecondaryColor(pal.secondary);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:border-slate-400 text-[11px] font-medium text-slate-700 cursor-pointer shadow-2xs transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.secondary }} />
                      <span>{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bilingual Arabic Entity Details for Statutory Documents */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Bilingual Statutory Identity (Arabic / English)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Arabic Legal Entity Name
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={arabicLegalName}
                    onChange={e => setArabicLegalName(e.target.value)}
                    placeholder="شركة آرتفاي القابضة ش.م.ع.م"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-right font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Arabic Registered Address
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={arabicAddress}
                    onChange={e => setArabicAddress(e.target.value)}
                    placeholder="مجمع القرم التجاري، مسقط، عُمان"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Watermark & Letterhead Security Configuration */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Watermark & Letterhead Security Engine</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={e => setWatermarkEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-xs font-semibold text-slate-700">Watermark Active</span>
              </label>
            </div>

            {/* Watermark Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Watermark Security Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={e => setWatermarkText(e.target.value)}
                  placeholder="e.g. ARTIFY GROUP HOLDINGS SAOC CONFIDENTIAL"
                  disabled={!watermarkEnabled}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase disabled:opacity-50 bg-white"
                />
              </div>

              {/* Watermark Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  `${company.legalName.toUpperCase()} CONFIDENTIAL`,
                  'ORIGINAL TAX INVOICE',
                  'OFFICIAL INTERNAL DRAFT',
                  'BOARD GOVERNANCE COPY',
                  'AUTHORIZED POSTING'
                ].map(txt => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => setWatermarkText(txt)}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium cursor-pointer"
                  >
                    {txt.length > 22 ? txt.slice(0, 20) + '...' : txt}
                  </button>
                ))}
              </div>

              {/* Sliders: Opacity & Angle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Watermark Opacity:</span>
                    <span className="font-mono font-bold">{watermarkOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={45}
                    step={1}
                    value={watermarkOpacity}
                    onChange={e => setWatermarkOpacity(Number(e.target.value))}
                    disabled={!watermarkEnabled}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Watermark Angle:</span>
                    <span className="font-mono font-bold">{watermarkAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={5}
                    value={watermarkAngle}
                    onChange={e => setWatermarkAngle(Number(e.target.value))}
                    disabled={!watermarkEnabled}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Letterhead Templates & Layout Style */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Document Layout Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Header Template
                  </label>
                  <select
                    value={letterheadTemplate}
                    onChange={e => setLetterheadTemplate(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium"
                  >
                    <option value="Default Standard">Default Standard (Corporate Banner)</option>
                    <option value="Modern Minimalist">Modern Minimalist (Sleek Border)</option>
                    <option value="Executive Classic">Executive Classic (Boxed Header)</option>
                    <option value="Bilingual English/Arabic">Bilingual English/Arabic (Dual Crest)</option>
                    <option value="Centered Official">Centered Official (Formal Apex)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Corporate Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={headerTagline}
                    onChange={e => setHeaderTagline(e.target.value)}
                    placeholder="e.g. Enterprise Commercial Solutions"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Footer Bank & Wire Instructions
                </label>
                <input
                  type="text"
                  value={footerBankDetails}
                  onChange={e => setFooterBankDetails(e.target.value)}
                  placeholder="e.g. Bank Muscat SAOG • IBAN: OM02BMUS... • SWIFT: BMUSOMRX"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-mono"
                />
              </div>

              {/* Signatory Seal & Stamp */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stampEnabled}
                      onChange={e => setStampEnabled(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Stamp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Authorized Officer Stamp & Signature</span>
                    </span>
                  </label>
                </div>

                {stampEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                        Officer Name
                      </label>
                      <input
                        type="text"
                        value={signatureOfficerName}
                        onChange={e => setSignatureOfficerName(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                        Official Title
                      </label>
                      <input
                        type="text"
                        value={signatureOfficerTitle}
                        onChange={e => setSignatureOfficerTitle(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Preview Engine */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-slate-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Statutory Document Output
              </h4>
            </div>

            {/* Document Type Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setDocType('invoice')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  docType === 'invoice' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => setDocType('po')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  docType === 'po' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase Order
              </button>
              <button
                type="button"
                onClick={() => setDocType('letterhead')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  docType === 'letterhead' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Letterhead Memo
              </button>
              <button
                type="button"
                onClick={() => setDocType('voucher')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  docType === 'voucher' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payment Voucher
              </button>
            </div>
          </div>

          {/* Interactive Document Sheet (Simulated A4 Paper) */}
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-md p-6 relative overflow-hidden min-h-[580px] flex flex-col justify-between select-none">
            {/* Real Dynamic Watermark Overlay */}
            {watermarkEnabled && watermarkText && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
                style={{ opacity: watermarkOpacity / 100 }}
              >
                <div
                  className="font-black font-mono text-center tracking-widest text-slate-800 uppercase leading-none select-none text-2xl sm:text-4xl"
                  style={{
                    transform: `rotate(${watermarkAngle}deg)`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {watermarkText}
                </div>
              </div>
            )}

            {/* Document Content Layer */}
            <div className="relative z-10 space-y-6">
              {/* Dynamic Header based on selected Template */}
              {letterheadTemplate === 'Bilingual English/Arabic' ? (
                <div
                  className="border-b-2 pb-4 flex items-start justify-between"
                  style={{ borderColor: brandColor }}
                >
                  {/* Left English */}
                  <div className="flex items-center gap-3">
                    {logo && (
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-14 h-14 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{company.legalName}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{headerTagline}</p>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        CR: <strong>{company.registrationNumber}</strong> | VAT TRN: <strong>{company.taxNumber}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Arabic */}
                  <div className="text-right" dir="rtl">
                    <h3 className="font-bold text-slate-900 text-sm">{arabicLegalName}</h3>
                    <p className="text-[11px] text-slate-500">{arabicAddress}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      هاتف: {company.phone} | ص.ب: {company.poBox || '112'}
                    </div>
                  </div>
                </div>
              ) : letterheadTemplate === 'Centered Official' ? (
                <div
                  className="border-b-2 pb-4 text-center space-y-2"
                  style={{ borderColor: brandColor }}
                >
                  {logo && (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-12 h-12 object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base uppercase tracking-wider">
                      {company.legalName}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-600">{arabicLegalName}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span>CR: {company.registrationNumber}</span>
                    <span>•</span>
                    <span>VAT TRN: {company.taxNumber}</span>
                    <span>•</span>
                    <span>{company.city}, {company.country}</span>
                  </div>
                </div>
              ) : letterheadTemplate === 'Modern Minimalist' ? (
                <div
                  className="border-b pb-3 flex items-center justify-between"
                  style={{ borderColor: brandColor }}
                >
                  <div className="flex items-center gap-3">
                    {logo && (
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-10 h-10 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm tracking-tight">{company.legalName}</h3>
                      <div className="text-[10px] text-slate-500">{headerTagline}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    <div>VAT: {company.taxNumber}</div>
                    <div>CR: {company.registrationNumber}</div>
                  </div>
                </div>
              ) : (
                /* Default Standard Template */
                <div
                  className="border-b-2 pb-4 flex items-start justify-between"
                  style={{ borderColor: brandColor }}
                >
                  <div className="flex items-center gap-3.5">
                    {logo && (
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{company.legalName}</h3>
                      <div className="text-[11px] text-slate-500 font-mono">
                        CR Number: {company.registrationNumber} • VAT TRN: {company.taxNumber}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">{headerTagline}</div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                    <div>{company.address}</div>
                    <div>{company.city}, {company.country}</div>
                    <div>Tel: {company.phone} • {company.email}</div>
                  </div>
                </div>
              )}

              {/* Dynamic Document Body */}
              {docType === 'invoice' && (
                <div className="space-y-4 text-xs">
                  {/* Invoice Header Details */}
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        TAX INVOICE
                      </span>
                      <div className="text-slate-600 font-mono text-[11px] mt-1">Invoice #: INV-2026-08492</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <div>Date: {new Date().toISOString().split('T')[0]}</div>
                      <div>Due Date: 30 Days Net</div>
                    </div>
                  </div>

                  {/* Bill To Info */}
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">Customer / Billed To:</span>
                      <div>Oman National Telecommunications SAOC</div>
                      <div>Tax TRN: OM-VAT-9920184</div>
                      <div>Way 3012, Ruwi High Street, Muscat</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">Payment Reference:</span>
                      <div className="font-mono">PO-OMNTEL-84910</div>
                      <div className="font-mono">Currency: {company.currency}</div>
                    </div>
                  </div>

                  {/* Itemized Line Items Table */}
                  <table className="w-full text-[11px] border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Price ({company.currency})</th>
                        <th className="p-2 text-right">VAT (5%)</th>
                        <th className="p-2 text-right">Total ({company.currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">Enterprise System License & Hosting SLA Q1-2026</td>
                        <td className="p-2 text-center">1</td>
                        <td className="p-2 text-right font-mono">12,500.000</td>
                        <td className="p-2 text-right font-mono">625.000</td>
                        <td className="p-2 text-right font-mono font-semibold">13,125.000</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Statutory Compliance & Security Module Implementation</td>
                        <td className="p-2 text-center">1</td>
                        <td className="p-2 text-right font-mono">4,800.000</td>
                        <td className="p-2 text-right font-mono">240.000</td>
                        <td className="p-2 text-right font-mono font-semibold">5,040.000</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Summary & Totals */}
                  <div className="flex justify-end pt-2">
                    <div className="w-64 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono">17,300.000 {company.currency}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>VAT Amount (5%):</span>
                        <span className="font-mono">865.000 {company.currency}</span>
                      </div>
                      <div
                        className="flex justify-between font-bold text-sm pt-2 border-t text-white p-2 rounded"
                        style={{ backgroundColor: brandColor }}
                      >
                        <span>Grand Total:</span>
                        <span className="font-mono">18,165.000 {company.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {docType === 'po' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        OFFICIAL PURCHASE ORDER
                      </span>
                      <div className="text-slate-600 font-mono text-[11px] mt-1">PO #: PO-2026-04192</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <div>Issued Date: {new Date().toISOString().split('T')[0]}</div>
                      <div>Delivery Term: DDP Muscat Warehouse</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">Vendor:</span>
                      <div>Dell EMC Enterprise Middle East FZ-LLC</div>
                      <div>Dubai Internet City, UAE</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">Delivery Destination:</span>
                      <div>KOM Data Center, Building 4, Muscat</div>
                    </div>
                  </div>

                  <table className="w-full text-[11px] border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-2 text-left">Item / Specification</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Price ({company.currency})</th>
                        <th className="p-2 text-right">Total ({company.currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">PowerEdge R750 Rack Server Dual Xeon 64GB</td>
                        <td className="p-2 text-center">4</td>
                        <td className="p-2 text-right font-mono">3,200.000</td>
                        <td className="p-2 text-right font-mono font-semibold">12,800.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {docType === 'letterhead' && (
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono border-b pb-2">
                    <div>Ref: {company.code}/EXEC/2026/092</div>
                    <div>Date: {new Date().toISOString().split('T')[0]}</div>
                  </div>

                  <div className="space-y-1 font-semibold text-slate-800">
                    <div>TO: The Board of Directors & Governance Committee</div>
                    <div>FROM: {signatureOfficerName}, {signatureOfficerTitle}</div>
                    <div className="text-indigo-700 font-bold pt-1">
                      SUBJECT: Official Master Entity Charter & Statutory Compliance Verification
                    </div>
                  </div>

                  <p>
                    Please be advised that all corporate registration certificates, tax identifiers (VAT TRN{' '}
                    <strong>{company.taxNumber}</strong>), commercial chamber records, and authorized banking parameters
                    for <strong>{company.legalName}</strong> have been ratified in strict accordance with the Commercial
                    Companies Law and IFRS statutory reporting requirements.
                  </p>
                  <p>
                    All downstream operational transactions, invoices, and purchase contracts issued through this
                    entity shall bear the authoritative corporate identity, security watermark, and registered seal.
                  </p>
                </div>
              )}

              {docType === 'voucher' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        BANK PAYMENT DISBURSEMENT VOUCHER
                      </span>
                      <div className="text-slate-600 font-mono text-[11px] mt-1">Voucher #: BPV-2026-00482</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <div>Posting Date: {new Date().toISOString().split('T')[0]}</div>
                      <div>Mode: Real-Time Gross Settlement (RTGS)</div>
                    </div>
                  </div>

                  <table className="w-full text-[11px] border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-2 text-left">GL Account #</th>
                        <th className="p-2 text-left">Account Description</th>
                        <th className="p-2 text-right">Debit ({company.currency})</th>
                        <th className="p-2 text-right">Credit ({company.currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-mono">2100-00-AP</td>
                        <td className="p-2">Accounts Payable — Trade Creditors</td>
                        <td className="p-2 text-right font-mono font-semibold">24,500.000</td>
                        <td className="p-2 text-right font-mono">0.000</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono">1010-01-BK</td>
                        <td className="p-2">Bank Muscat Main Corporate Treasury</td>
                        <td className="p-2 text-right font-mono">0.000</td>
                        <td className="p-2 text-right font-mono font-semibold">24,500.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Authorized Signatory & Official Stamp Seal */}
              {stampEnabled && (
                <div className="pt-4 flex justify-between items-end border-t border-slate-200">
                  <div className="text-[10px] text-slate-400">
                    Generated by Artify Master Management Suite • Authenticated Cryptographically
                  </div>

                  <div className="text-center space-y-1">
                    {/* Stamp Seal Graphic */}
                    <div
                      className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 mx-auto text-[9px] font-mono uppercase font-bold rotate-6"
                      style={{
                        borderColor: brandColor,
                        color: brandColor,
                        backgroundColor: `${brandColor}0a`
                      }}
                    >
                      <div className="text-[8px] tracking-tight">{company.code}</div>
                      <div className="font-bold text-[7px] text-center">{company.legalName.slice(0, 18)}</div>
                      <div className="text-[7px] font-mono">OFFICIAL SEAL</div>
                      <div className="text-[6px]">MOCIIP • {company.country}</div>
                    </div>

                    <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-900">
                      {signatureOfficerName}
                    </div>
                    <div className="text-[10px] text-slate-500">{signatureOfficerTitle}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Footer with Bank details and legal disclaimer */}
            <div className="relative z-10 border-t border-slate-200 pt-3 text-center space-y-1 text-[10px] text-slate-500">
              <div className="font-semibold text-slate-700">{footerBankDetails}</div>
              <div>
                {letterheadFooterHtml ||
                  `${company.legalName} • Registered in ${company.country} • Commercial Registry: ${company.registrationNumber} • Tax TRN: ${company.taxNumber}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

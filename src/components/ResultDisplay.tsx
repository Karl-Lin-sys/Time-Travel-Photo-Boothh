import React, { useState, useRef } from 'react';
import {
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Wand2,
  Clock,
  Compass,
  Sliders,
  History,
  Check,
  Split,
  Eye,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react';
import { GeneratedPostcard, HistoricalEra } from '../types';

interface ResultDisplayProps {
  postcard: GeneratedPostcard;
  onEditImage: (editPrompt: string) => void;
  isEditing: boolean;
  onPickAnotherEra: () => void;
  onNewPortrait: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  postcard,
  onEditImage,
  isEditing,
  onPickAnotherEra,
  onNewPortrait,
}) => {
  const [viewMode, setViewMode] = useState<'postcard' | 'split' | 'result-only'>('postcard');
  const [customEditPrompt, setCustomEditPrompt] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Quick edit prompt presets
  const quickEditPrompts = [
    'Add an authentic 19th-century sepia tint & crackled film grain',
    'Add an ornate golden royal crown with emeralds',
    'Change the lighting to dramatic candlelit chiaroscuro',
    'Add a vintage brass pocket watch and monocle',
    'Transform background into a stormy dramatic sunset with clouds',
    'Make it look like an authentic museum oil painting with visible brushstrokes',
  ];

  const handleApplyEdit = (promptText: string) => {
    if (!promptText.trim() || isEditing) return;
    onEditImage(promptText.trim());
    setCustomEditPrompt('');
  };

  // Canvas composite download: Renders an ornate vintage historical postcard
  const handleDownloadPostcard = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1200;
      canvas.height = 1450;

      // Background vintage aged parchment
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Inner card parchment
      const cardMargin = 40;
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(cardMargin, cardMargin, canvas.width - cardMargin * 2, canvas.height - cardMargin * 2);

      // Gold border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(cardMargin + 8, cardMargin + 8, canvas.width - (cardMargin + 8) * 2, canvas.height - (cardMargin + 8) * 2);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.strokeRect(cardMargin + 16, cardMargin + 16, canvas.width - (cardMargin + 16) * 2, canvas.height - (cardMargin + 16) * 2);

      // Load result image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = postcard.resultImage;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Draw historical portrait
      const imgSize = 1040;
      const imgX = (canvas.width - imgSize) / 2;
      const imgY = cardMargin + 40;
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

      // Photo inner border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(imgX, imgY, imgSize, imgSize);

      // Postcard footer captions
      ctx.fillStyle = '#f5f5f4';
      ctx.font = 'bold 36px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(postcard.era.name.toUpperCase(), canvas.width / 2, imgY + imgSize + 70);

      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${postcard.era.year} • ${postcard.era.role.toUpperCase()}`, canvas.width / 2, imgY + imgSize + 115);

      ctx.fillStyle = '#78716c';
      ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Historical Temporal Portrait • Chrono Photo Booth (Gemini 3.1)', canvas.width / 2, imgY + imgSize + 160);

      // Save as PNG
      const link = document.createElement('a');
      link.download = `time-travel-${postcard.era.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.warn('Canvas render error, falling back to direct image download:', err);
      const link = document.createElement('a');
      link.download = `historical-portrait-${postcard.era.id}.png`;
      link.href = postcard.resultImage;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div id="result-display-container" className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur-sm mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Temporal Jump Complete</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-stone-100 sm:text-3xl">
            {postcard.era.name} ({postcard.era.year})
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Transplanted as <span className="text-amber-300 font-semibold">{postcard.era.role}</span>
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-stone-800 bg-stone-900/80 p-1">
            <button
              onClick={() => setViewMode('postcard')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'postcard'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Postcard
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'split'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Split className="h-3 w-3" />
              <span>Before & After</span>
            </button>
            <button
              onClick={() => setViewMode('result-only')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'result-only'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Full Portrait
            </button>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Postcard Canvas View */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {viewMode === 'postcard' ? (
            /* Vintage Postcard Frame */
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-4 border-amber-600/40 bg-stone-950 p-4 shadow-2xl shadow-stone-950 ring-1 ring-amber-500/20">
              {/* Gold Filigree Corner Accents */}
              <div className="pointer-events-none absolute top-2 left-2 text-amber-500/60 font-cinzel text-xs font-black">✦</div>
              <div className="pointer-events-none absolute top-2 right-2 text-amber-500/60 font-cinzel text-xs font-black">✦</div>
              <div className="pointer-events-none absolute bottom-2 left-2 text-amber-500/60 font-cinzel text-xs font-black">✦</div>
              <div className="pointer-events-none absolute bottom-2 right-2 text-amber-500/60 font-cinzel text-xs font-black">✦</div>

              {/* Top Postage Stamp & Watermark */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-amber-400">
                    HISTORICAL DISPATCH • {postcard.era.year}
                  </span>
                </div>
                {/* Vintage Wax Seal Emblem */}
                <div className="flex items-center gap-1 rounded-full border border-amber-600/50 bg-amber-950/80 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                  <Clock className="h-2.5 w-2.5" />
                  <span>CHRONO SEAL</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-stone-800 bg-stone-900 group">
                <img
                  src={postcard.resultImage}
                  alt={`${postcard.era.name} Portrait`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-stone-950/70 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-white backdrop-blur-sm transition-all"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Postcard Inscription */}
              <div className="mt-4 border-t border-stone-800/80 pt-3 text-center">
                <h3 className="font-cinzel text-lg font-bold tracking-wider text-stone-100">
                  {postcard.era.name.toUpperCase()}
                </h3>
                <p className="font-mono text-xs font-semibold text-amber-400">
                  {postcard.era.year} • {postcard.era.role}
                </p>
                <p className="mt-1 text-[11px] text-stone-400 font-sans italic max-w-sm mx-auto">
                  "{postcard.era.tagline}"
                </p>
              </div>
            </div>
          ) : viewMode === 'split' ? (
            /* Side-by-Side Comparison */
            <div className="w-full grid grid-cols-2 gap-3 max-w-lg">
              <div className="rounded-xl border border-stone-800 overflow-hidden bg-stone-900">
                <div className="p-2 text-center bg-stone-950/80 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Present Day (2026)
                </div>
                <div className="aspect-square w-full">
                  <img
                    src={postcard.originalImage}
                    alt="Original"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/40 overflow-hidden bg-stone-900 ring-2 ring-amber-500/20">
                <div className="p-2 text-center bg-amber-950/80 border-b border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  {postcard.era.name} ({postcard.era.year})
                </div>
                <div className="aspect-square w-full">
                  <img
                    src={postcard.resultImage}
                    alt="Historical"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Result Only Full Size */
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl">
              <img
                src={postcard.resultImage}
                alt="Full Historical Portrait"
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Action Buttons Under Image */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              id="download-postcard-btn"
              onClick={handleDownloadPostcard}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs sm:text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              {downloading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 stroke-[2.5]" />
              )}
              <span>Download Historical Postcard</span>
            </button>

            <button
              id="share-link-btn"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
              title="Copy App URL"
            >
              {copySuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copySuccess ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              id="travel-again-btn"
              onClick={onPickAnotherEra}
              className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-amber-300 transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>Other Eras</span>
            </button>

            <button
              id="new-portrait-btn"
              onClick={onNewPortrait}
              className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>New Photo</span>
            </button>
          </div>
        </div>

        {/* Right: Feature 1 - "Create & Edit Images with gemini-3.1-flash-image-preview" */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-amber-400" />
                <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-stone-100">
                  Refine & Edit Portrait
                </h3>
              </div>
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                gemini-3.1-flash-image-preview
              </span>
            </div>

            <p className="text-xs text-stone-400 font-sans leading-relaxed mb-4">
              Use text prompts to edit your historical portrait. Add period accessories, modify the lighting, alter weather, or transform the painterly medium.
            </p>

            {/* Custom Edit Input */}
            <div className="space-y-2 mb-4">
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Describe Your Edit
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={customEditPrompt}
                  onChange={(e) => setCustomEditPrompt(e.target.value)}
                  placeholder="e.g. 'Add a vintage golden crown with emeralds', 'Make it look like an oil painting on cracked canvas'..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                id="apply-custom-edit-btn"
                onClick={() => handleApplyEdit(customEditPrompt)}
                disabled={!customEditPrompt.trim() || isEditing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Gemini is editing your portrait...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Apply Custom Modification</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-Click Modifications */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Quick Historical Adjustments
              </label>
              <div className="flex flex-col gap-1.5">
                {quickEditPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyEdit(prompt)}
                    disabled={isEditing}
                    className="text-left rounded-lg border border-stone-800/80 bg-stone-950/60 p-2 text-xs text-stone-300 hover:border-amber-500/40 hover:bg-stone-900 hover:text-amber-200 transition-all disabled:opacity-50"
                  >
                    ✦ {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit History Revisions */}
            {postcard.editHistory && postcard.editHistory.length > 0 && (
              <div className="mt-4 border-t border-stone-800 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mb-2">
                  <History className="h-3.5 w-3.5 text-amber-400" />
                  <span>Revision History ({postcard.editHistory.length})</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {postcard.editHistory.map((h, i) => (
                    <div
                      key={i}
                      className="rounded bg-stone-950/80 p-2 text-[11px] text-stone-400 border border-stone-800/60"
                    >
                      <span className="text-amber-400 font-mono">Rev {i + 1}:</span> {h.editPrompt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4 backdrop-blur-md"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-2">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-stone-950/80 p-2 text-stone-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={postcard.resultImage}
              alt="Historical Portrait Full"
              className="max-h-[85vh] w-auto rounded-xl object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

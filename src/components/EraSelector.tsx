import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
  Sliders,
  Check,
  Wand2,
  HelpCircle,
} from 'lucide-react';
import { HISTORICAL_ERAS } from '../data/historicalEras';
import { HistoricalEra } from '../types';

interface EraSelectorProps {
  selectedEra: HistoricalEra;
  onSelectEra: (era: HistoricalEra) => void;
  userCustomText: string;
  onChangeCustomText: (text: string) => void;
  onLaunchTimeTravel: () => void;
  loading: boolean;
  recommendedEraId?: string;
}

export const EraSelector: React.FC<EraSelectorProps> = ({
  selectedEra,
  onSelectEra,
  userCustomText,
  onChangeCustomText,
  onLaunchTimeTravel,
  loading,
  recommendedEraId,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customYear, setCustomYear] = useState('1789 CE');
  const [customName, setCustomName] = useState('French Revolution Paris');
  const [customRole, setCustomRole] = useState('Enlightenment Philosopher');
  const [customPrompt, setCustomPrompt] = useState(
    'Insert this person\'s face into a dramatic 18th-century French Revolution portrait in Paris, 1789. Wearing authentic powdered wig, embroidered silk frock coat, standing in front of the historic Bastille courtyard under twilight lanterns, classical oil painting on canvas.'
  );

  const categories = ['All', 'Ancient', 'Medieval', 'Renaissance', 'Modern', 'Future'];

  const filteredEras =
    filterCategory === 'All'
      ? HISTORICAL_ERAS
      : HISTORICAL_ERAS.filter((e) => e.category === filterCategory);

  const handleApplyCustomEra = () => {
    const customEraObj: HistoricalEra = {
      id: `custom-${Date.now()}`,
      name: customName || 'Custom Era',
      year: customYear || 'Historic Era',
      category: 'Renaissance',
      role: customRole || 'Time Traveler',
      tagline: 'Custom chronological coordinates',
      scenePrompt: customPrompt,
      iconName: 'Compass',
      colorScheme: {
        accent: 'text-amber-400',
        border: 'border-amber-500/40',
        badge: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
      },
    };
    onSelectEra(customEraObj);
    setIsCustomMode(false);
  };

  return (
    <div id="era-selector-container" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm mb-2">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span>Step 2: Choose Your Temporal Destination</span>
        </div>
        <h2 className="font-cinzel text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl md:text-4xl">
          Select Historical Epoch
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-stone-400 font-sans">
          Your portrait will be re-rendered into this scene with authentic period attire, atmospheric lighting, and high-fidelity facial alignment via <span className="text-amber-300 font-semibold">gemini-3.1-flash-image-preview</span>.
        </p>
      </div>

      {/* Category Tabs & Custom Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900/80 p-1 backdrop-blur-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setIsCustomMode(false);
                setFilterCategory(cat);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                !isCustomMode && filterCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          id="toggle-custom-era-btn"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
            isCustomMode
              ? 'border-amber-400 bg-amber-500 text-stone-950'
              : 'border-stone-700 bg-stone-900/80 text-amber-300 hover:border-amber-500/50'
          }`}
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>Custom Temporal Coordinates</span>
        </button>
      </div>

      {/* Custom Era Form Modal / Card */}
      {isCustomMode && (
        <div className="mb-8 rounded-2xl border border-amber-500/40 bg-stone-900/90 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-amber-400" />
              <h3 className="font-cinzel text-base font-bold text-stone-100">
                Custom Time Machine Coordinates
              </h3>
            </div>
            <span className="text-xs text-amber-400/80 font-mono">Any epoch in history or fiction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Destination Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Imperial Rome"
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Historical Year
              </label>
              <input
                type="text"
                value={customYear}
                onChange={(e) => setCustomYear(e.target.value)}
                placeholder="e.g. 79 CE"
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Character Role
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Gladiator Champion"
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Scene & Visual Prompt for Gemini 3.1 Flash Image
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe the historical scene, clothing, environment, lighting, and period details..."
              className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCustomMode(false)}
              className="rounded-lg border border-stone-700 px-4 py-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              id="set-custom-destination-btn"
              onClick={handleApplyCustomEra}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Lock Coordinates</span>
            </button>
          </div>
        </div>
      )}

      {/* Eras Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredEras.map((era) => {
          const isSelected = selectedEra.id === era.id;
          const isRecommended = recommendedEraId === era.id;

          return (
            <div
              key={era.id}
              id={`era-card-${era.id}`}
              onClick={() => onSelectEra(era)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-amber-400 bg-gradient-to-b from-stone-900 to-stone-950 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50'
                  : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-900/90'
              }`}
            >
              {/* Year Stamp */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold tracking-wider text-amber-400">
                  {era.year}
                </span>
                <div className="flex items-center gap-1">
                  {isRecommended && (
                    <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      Best Match
                    </span>
                  )}
                  <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${era.colorScheme.badge}`}>
                    {era.category}
                  </span>
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="font-cinzel text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                {era.name}
              </h3>
              <p className="text-xs font-semibold text-stone-400 mb-2">
                {era.role}
              </p>

              {/* Tagline */}
              <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-sans">
                {era.tagline}
              </p>

              {/* Selection Checkmark */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-800/60">
                <span className="text-[11px] text-stone-500 group-hover:text-stone-400 font-sans">
                  {isSelected ? 'Destination Locked' : 'Click to select'}
                </span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950'
                      : 'border border-stone-700 text-transparent group-hover:border-stone-500'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Launch Bar */}
      <div className="sticky bottom-4 z-30 rounded-2xl border border-amber-500/40 bg-stone-950/90 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Destination:
              </span>
              <span className="font-cinzel text-base font-bold text-amber-300">
                {selectedEra.name} ({selectedEra.year})
              </span>
              <span className="text-xs text-stone-400">as {selectedEra.role}</span>
            </div>

            {/* Optional Custom Tweak Input */}
            <div className="mt-2 flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-stone-500 shrink-0" />
              <input
                type="text"
                value={userCustomText}
                onChange={(e) => onChangeCustomText(e.target.value)}
                placeholder="Optional extra details (e.g. 'Wearing glasses', 'holding an ancient map', 'smiling softly')..."
                className="w-full rounded-lg border border-stone-800 bg-stone-900/80 px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/70 focus:outline-none"
              />
            </div>
          </div>

          <button
            id="launch-time-travel-btn"
            onClick={onLaunchTimeTravel}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent"></div>
                <span className="font-cinzel tracking-wide">Transplanting Face in {selectedEra.year}...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
                <span className="font-cinzel font-black tracking-wide">Enter Time Portal</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

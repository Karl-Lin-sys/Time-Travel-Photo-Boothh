import React from 'react';
import { Sparkles, BrainCircuit, Compass, Award, ArrowRight, RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react';
import { PhotoAnalysis, HistoricalEra } from '../types';

interface AnalysisPanelProps {
  userImage: string;
  analysis: PhotoAnalysis | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
  onSelectEra: (eraId: string, customAdjustment?: string) => void;
  onProceedToEras: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  userImage,
  analysis,
  loading,
  error,
  onAnalyze,
  onSelectEra,
  onProceedToEras,
}) => {
  return (
    <div id="analysis-panel-container" className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm mb-2">
          <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
          <span>Gemini 3.1 Pro Image Understanding</span>
        </div>
        <h2 className="font-cinzel text-2xl font-bold tracking-tight text-stone-100 sm:text-3xl">
          Historical Persona & Face Analysis
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-stone-400 font-sans">
          Powered by <span className="text-amber-300 font-semibold">gemini-3.1-pro-preview</span> to determine your facial compatibility across civilizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Portrait & Action */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-xl">
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={userImage}
                alt="Your Portrait"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-3 bg-stone-950/90 border-t border-stone-800/80 text-center">
              <p className="text-xs font-semibold text-stone-300 font-cinzel">Subject Portrait</p>
              <p className="text-[11px] text-stone-500">Ready for Temporal Synchronization</p>
            </div>
          </div>

          {/* Trigger Analysis button */}
          {!analysis && !loading && (
            <button
              id="start-analysis-btn"
              onClick={onAnalyze}
              className="mt-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
              <span>Analyze with Gemini 3.1 Pro</span>
            </button>
          )}

          {analysis && !loading && (
            <button
              id="re-analyze-btn"
              onClick={onAnalyze}
              className="mt-4 flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Re-Analyze Portrait</span>
            </button>
          )}
        </div>

        {/* Right Column: Results & Affinity Matches */}
        <div className="md:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800/80 bg-stone-900/60 p-10 text-center backdrop-blur-sm">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
                <div className="animate-spin absolute h-full w-full rounded-full border-4 border-amber-500/20 border-t-amber-400"></div>
                <BrainCircuit className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-stone-100">
                Analyzing Facial Topology & Lighting...
              </h3>
              <p className="mt-1 text-xs text-stone-400 max-w-sm font-sans">
                Scanning cheekbones, ocular geometry, lighting angles, and cross-referencing with classical art archives using gemini-3.1-pro-preview.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-6 text-center">
              <p className="text-sm font-semibold text-rose-300 mb-2">{error}</p>
              <button
                onClick={onAnalyze}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <h3 className="font-cinzel text-sm font-bold tracking-wide text-amber-300 uppercase">
                    Temporal Assessment
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  {analysis.summary}
                </p>

                {/* Key Attributes */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-stone-900/80 p-2 border border-stone-800">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Expression</span>
                    <span className="font-semibold text-stone-200">{analysis.expression || 'Harmonious'}</span>
                  </div>
                  <div className="rounded-lg bg-stone-900/80 p-2 border border-stone-800">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Lighting Quality</span>
                    <span className="font-semibold text-stone-200">{analysis.lighting || 'Balanced Key'}</span>
                  </div>
                  <div className="rounded-lg bg-stone-900/80 p-2 border border-stone-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Persona Vibe</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {(analysis.personaKeywords || ['Regal', 'Visionary']).map((kw, i) => (
                        <span key={i} className="rounded bg-amber-500/10 px-1 py-0.2 text-[10px] font-semibold text-amber-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Historical Matches */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-stone-400">
                    Top Era Affinities
                  </h4>
                  <span className="text-[11px] text-stone-500">Pick an era or view all</span>
                </div>

                <div className="space-y-2.5">
                  {analysis.eraMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-800 bg-stone-900/70 p-3 hover:border-amber-500/40 hover:bg-stone-900 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                            {match.eraName}
                          </span>
                          <span className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] font-medium text-stone-400">
                            {match.role}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-400 line-clamp-2">
                          {match.reason}
                        </p>
                        {/* Match Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-stone-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                              style={{ width: `${match.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-amber-400">
                            {match.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <button
                        id={`travel-to-${match.eraId}-btn`}
                        onClick={() => onSelectEra(match.eraId, match.customPromptAdjustment)}
                        className="self-end sm:self-center flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-all"
                      >
                        <span>Travel Here</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Continue Button */}
              <div className="pt-2 flex justify-end">
                <button
                  id="browse-all-eras-btn"
                  onClick={onProceedToEras}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-stone-800 to-stone-700 border border-stone-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-100 hover:border-amber-500/50 hover:text-amber-300 transition-all"
                >
                  <Compass className="h-4 w-4 text-amber-400" />
                  <span>Explore All Historical Destinations</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

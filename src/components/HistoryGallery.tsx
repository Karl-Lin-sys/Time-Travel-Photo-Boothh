import React from 'react';
import { Clock, X, Trash2, ArrowRight, Download, Eye } from 'lucide-react';
import { GeneratedPostcard } from '../types';

interface HistoryGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  postcards: GeneratedPostcard[];
  onSelectPostcard: (postcard: GeneratedPostcard) => void;
  onClearHistory: () => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  isOpen,
  onClose,
  postcards,
  onSelectPostcard,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden">
        {/* Gallery Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-100">
                Temporal Journey Album
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                {postcards.length} {postcards.length === 1 ? 'epoch visited' : 'epochs visited'} this session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {postcards.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 transition-colors"
                title="Clear Album"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Album</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grid Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {postcards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="h-12 w-12 text-stone-600 mb-3" />
              <h4 className="font-cinzel text-base font-bold text-stone-300">
                No Historical Journeys Recorded Yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-stone-500 font-sans">
                Take a portrait and select any historical epoch to commence time travel. Your generated postcards will be cataloged here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {postcards.map((card) => (
                <div
                  key={card.id}
                  className="group relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950 transition-all hover:border-amber-500/50 hover:shadow-xl"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-900">
                    <img
                      src={card.resultImage}
                      alt={card.era.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Overlay Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-cinzel text-xs font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                        {card.era.name}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-amber-400">
                        {card.era.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mb-2">
                      {card.era.role}
                    </p>

                    <button
                      onClick={() => {
                        onSelectPostcard(card);
                        onClose();
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-stone-900 border border-stone-700 py-1.5 text-xs font-semibold text-stone-200 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View & Edit Postcard</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

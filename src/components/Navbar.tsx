import React from 'react';
import { Clock, History, Camera, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentStep: 'capture' | 'analyze' | 'travel' | 'result';
  onReset: () => void;
  savedCount: number;
  onOpenGallery: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onReset,
  savedCount,
  onOpenGallery,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header id="photobooth-navbar" className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={onReset}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Return to Photo Booth Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40 transition-transform group-hover:scale-105">
              <Clock className="h-5 w-5 text-stone-950 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-lg font-bold tracking-wider text-stone-100">
                  CHRONO<span className="text-amber-400">BOOTH</span>
                </span>
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
                  Time Machine
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans hidden sm:block">
                Historical Face-Swap & Era Transformation
              </p>
            </div>
          </button>
        </div>

        {/* Step Indicator */}
        <nav aria-label="Photo booth progress" className="hidden md:flex items-center gap-2 text-xs font-medium">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
            currentStep === 'capture'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-500'
          }`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[10px]">1</span>
            <span>Portrait</span>
          </div>
          <span className="text-stone-700 font-bold">›</span>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
            currentStep === 'analyze'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-500'
          }`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[10px]">2</span>
            <span>Gemini Pro Analysis</span>
          </div>
          <span className="text-stone-700 font-bold">›</span>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
            currentStep === 'travel'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-500'
          }`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[10px]">3</span>
            <span>Choose Era</span>
          </div>
          <span className="text-stone-700 font-bold">›</span>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
            currentStep === 'result'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-500'
          }`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[10px]">4</span>
            <span>Time-Travel Postcard</span>
          </div>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={onToggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200 focus:outline-none"
            title={soundEnabled ? 'Mute shutter sound' : 'Enable shutter sound'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Time Capsule Gallery Button */}
          <button
            id="nav-gallery-btn"
            onClick={onOpenGallery}
            className="flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-900/80 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:border-stone-700 hover:bg-stone-800 focus:outline-none transition-colors"
          >
            <History className="h-4 w-4 text-amber-400" />
            <span>Time Album</span>
            {savedCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-stone-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Photo / Reset button */}
          {currentStep !== 'capture' && (
            <button
              id="nav-new-photo-btn"
              onClick={onReset}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 focus:outline-none transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>New Portrait</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

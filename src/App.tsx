import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisPanel } from './components/AnalysisPanel';
import { EraSelector } from './components/EraSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryGallery } from './components/HistoryGallery';
import { HISTORICAL_ERAS } from './data/historicalEras';
import { HistoricalEra, PhotoAnalysis, GeneratedPostcard } from './types';
import { playChronoSound } from './utils/audio';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<'capture' | 'analyze' | 'travel' | 'result'>('capture');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<HistoricalEra>(HISTORICAL_ERAS[0]);
  const [userCustomText, setUserCustomText] = useState('');
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [activePostcard, setActivePostcard] = useState<GeneratedPostcard | null>(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [savedPostcards, setSavedPostcards] = useState<GeneratedPostcard[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load saved postcards from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chrono_booth_postcards');
      if (stored) {
        setSavedPostcards(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read saved postcards:', e);
    }
  }, []);

  // Save to localStorage when changed
  const savePostcardToStorage = (card: GeneratedPostcard) => {
    setSavedPostcards((prev) => {
      const updated = [card, ...prev.filter((p) => p.id !== card.id)];
      try {
        localStorage.setItem('chrono_booth_postcards', JSON.stringify(updated.slice(0, 30)));
      } catch (e) {
        console.warn('Could not persist postcards:', e);
      }
      return updated;
    });
  };

  // Step 1 -> Step 2: Photo Selected
  const handlePhotoSelected = (imageDataUri: string) => {
    setUserImage(imageDataUri);
    setAnalysis(null);
    setAnalysisError(null);
    setCurrentStep('analyze');
    // Automatically trigger Gemini 3.1 Pro facial & era analysis
    analyzePhoto(imageDataUri);
  };

  // Feature: Analyze photo with Gemini 3.1 Pro
  const analyzePhoto = async (imageUri?: string) => {
    const targetImage = imageUri || userImage;
    if (!targetImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: targetImage }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze portrait');
      }

      setAnalysis(data.analysis);

      // Pre-select the top matching historical era if found
      if (data.analysis?.eraMatches && data.analysis.eraMatches.length > 0) {
        const topMatch = data.analysis.eraMatches[0];
        const matchedEra = HISTORICAL_ERAS.find((e) => e.id === topMatch.eraId);
        if (matchedEra) {
          setSelectedEra(matchedEra);
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'Error communicating with Gemini 3.1 Pro.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Direct selection from analysis affinity card
  const handleSelectFromAnalysis = (eraId: string, customAdjustment?: string) => {
    const found = HISTORICAL_ERAS.find((e) => e.id === eraId);
    if (found) {
      setSelectedEra(found);
    }
    if (customAdjustment) {
      setUserCustomText(customAdjustment);
    }
    setCurrentStep('travel');
  };

  // Feature: Time-Travel Face Swap with Gemini 3.1 Flash Image
  const handleLaunchTimeTravel = async () => {
    if (!userImage) return;

    setIsTraveling(true);
    setTravelError(null);
    if (soundEnabled) playChronoSound();

    try {
      const res = await fetch('/api/time-travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: userImage,
          scenePrompt: selectedEra.scenePrompt,
          eraName: selectedEra.name,
          eraYear: selectedEra.year,
          role: selectedEra.role,
          userCustomText: userCustomText,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate historical portrait.');
      }

      const newPostcard: GeneratedPostcard = {
        id: `card-${Date.now()}`,
        originalImage: userImage,
        resultImage: data.imageUrl,
        era: selectedEra,
        promptUsed: selectedEra.scenePrompt + (userCustomText ? ` ${userCustomText}` : ''),
        timestamp: Date.now(),
        analysis: analysis || undefined,
        editHistory: [],
      };

      setActivePostcard(newPostcard);
      savePostcardToStorage(newPostcard);
      setCurrentStep('result');
    } catch (err: any) {
      console.error('Time travel generation error:', err);
      setTravelError(err.message || 'Failed to transport through time. Please try again.');
    } finally {
      setIsTraveling(false);
    }
  };

  // Feature: Prompt-based Image Editing with Gemini 3.1 Flash Image
  const handleEditResultImage = async (editPrompt: string) => {
    if (!activePostcard) return;

    setIsEditing(true);
    try {
      const res = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentImage: activePostcard.resultImage,
          editPrompt: editPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to edit image.');
      }

      const updatedPostcard: GeneratedPostcard = {
        ...activePostcard,
        resultImage: data.imageUrl,
        editHistory: [
          ...(activePostcard.editHistory || []),
          {
            editPrompt: editPrompt,
            imageUrl: activePostcard.resultImage,
            timestamp: Date.now(),
          },
        ],
      };

      setActivePostcard(updatedPostcard);
      savePostcardToStorage(updatedPostcard);
    } catch (err: any) {
      console.error('Image edit error:', err);
      alert(`Could not apply edit: ${err.message || 'Unknown error'}`);
    } finally {
      setIsEditing(false);
    }
  };

  // Reset to photo booth capture
  const handleReset = () => {
    setUserImage(null);
    setAnalysis(null);
    setActivePostcard(null);
    setUserCustomText('');
    setTravelError(null);
    setCurrentStep('capture');
  };

  // Clear session history
  const handleClearHistory = () => {
    setSavedPostcards([]);
    try {
      localStorage.removeItem('chrono_booth_postcards');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Navigation Bar */}
      <Navbar
        currentStep={currentStep}
        onReset={handleReset}
        savedCount={savedPostcards.length}
        onOpenGallery={() => setGalleryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {travelError && (
          <div className="mx-auto max-w-4xl px-4 pt-6">
            <div className="flex items-center justify-between rounded-xl border border-rose-900/50 bg-rose-950/30 p-4 text-rose-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                <p className="text-xs sm:text-sm font-medium">{travelError}</p>
              </div>
              <button
                onClick={() => setTravelError(null)}
                className="rounded-lg bg-rose-900/40 px-3 py-1 text-xs font-bold hover:bg-rose-900/60"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Capture Photo */}
        {currentStep === 'capture' && (
          <CameraCapture
            onPhotoSelected={handlePhotoSelected}
            soundEnabled={soundEnabled}
          />
        )}

        {/* STEP 2: Gemini 3.1 Pro Analysis */}
        {currentStep === 'analyze' && userImage && (
          <AnalysisPanel
            userImage={userImage}
            analysis={analysis}
            loading={isAnalyzing}
            error={analysisError}
            onAnalyze={() => analyzePhoto(userImage)}
            onSelectEra={handleSelectFromAnalysis}
            onProceedToEras={() => setCurrentStep('travel')}
          />
        )}

        {/* STEP 3: Choose Era Destination */}
        {currentStep === 'travel' && (
          <EraSelector
            selectedEra={selectedEra}
            onSelectEra={setSelectedEra}
            userCustomText={userCustomText}
            onChangeCustomText={setUserCustomText}
            onLaunchTimeTravel={handleLaunchTimeTravel}
            loading={isTraveling}
            recommendedEraId={analysis?.eraMatches?.[0]?.eraId}
          />
        )}

        {/* STEP 4: Time Travel Result Postcard & Gemini Flash Editing */}
        {currentStep === 'result' && activePostcard && (
          <ResultDisplay
            postcard={activePostcard}
            onEditImage={handleEditResultImage}
            isEditing={isEditing}
            onPickAnotherEra={() => setCurrentStep('travel')}
            onNewPortrait={handleReset}
          />
        )}
      </main>

      {/* Time Capsule Gallery Modal */}
      <HistoryGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        postcards={savedPostcards}
        onSelectPostcard={(card) => {
          setActivePostcard(card);
          setSelectedEra(card.era);
          setCurrentStep('result');
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Subtle Chrono Footer */}
      <footer className="border-t border-stone-800/60 bg-stone-950 py-4 text-center text-xs text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-cinzel font-bold text-stone-300">CHRONO PHOTO BOOTH</span>
            <span>• Temporal Face Transplantation</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Powered by <span className="text-stone-300">Gemini 3.1 Pro</span> & <span className="text-stone-300">Gemini 3.1 Flash Image</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

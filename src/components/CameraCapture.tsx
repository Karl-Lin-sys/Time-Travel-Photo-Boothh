import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, User, AlertCircle, Check, SwitchCamera } from 'lucide-react';
import { SAMPLE_AVATARS } from '../data/historicalEras';
import { playShutterSound, playCountdownBeep } from '../utils/audio';

interface CameraCaptureProps {
  onPhotoSelected: (imageDataUri: string) => void;
  soundEnabled: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoSelected, soundEnabled }) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'preset'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Start camera helper
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was declined. Please allow camera permissions or upload a photo below.'
          : 'Unable to start camera. Please upload an image or choose a demo portrait.'
      );
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (mode === 'camera' && !previewImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, previewImage, startCamera, stopCamera]);

  // Flip camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Trigger shutter capture
  const handleStartCountdown = () => {
    if (countdown !== null) return;

    let current = 3;
    setCountdown(current);
    if (soundEnabled) playCountdownBeep(false);

    const timer = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
        if (soundEnabled) playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdown(null);
        if (soundEnabled) playCountdownBeep(true);
        captureFrame();
      }
    }, 900);
  };

  // Capture frame from video element to canvas
  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    if (facingMode === 'user') {
      // Mirror image for selfie mode
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    // Screen flash
    setFlashActive(true);
    if (soundEnabled) playShutterSound();
    setTimeout(() => setFlashActive(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewImage(dataUrl);
    stopCamera();
  };

  // Handle uploaded file
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Use selected avatar
  const handleSelectAvatar = async (url: string) => {
    try {
      // Convert external image to base64 via temporary canvas to bypass CORS or direct use
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
          const dataUri = canvas.toDataURL('image/jpeg', 0.9);
          setPreviewImage(dataUri);
        }
      };
      img.onerror = () => {
        // Fallback directly
        setPreviewImage(url);
      };
    } catch {
      setPreviewImage(url);
    }
  };

  return (
    <div id="camera-capture-container" className="relative mx-auto max-w-4xl px-4 py-6 sm:py-10">
      {/* Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Step 1: Capture Your Portrait</span>
        </div>
        <h1 className="font-cinzel text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl md:text-5xl">
          Enter The Chrono-Booth
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-400 font-sans sm:text-base">
          Look straight ahead with good lighting. We'll analyze your facial features and transport you into legendary historical eras.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-xl border border-stone-800 bg-stone-900/80 p-1.5 backdrop-blur-sm shadow-lg">
          <button
            id="tab-camera-btn"
            onClick={() => {
              setPreviewImage(null);
              setMode('camera');
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              mode === 'camera' && !previewImage
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Live Photo Booth</span>
          </button>
          <button
            id="tab-upload-btn"
            onClick={() => {
              setPreviewImage(null);
              setMode('upload');
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              mode === 'upload' && !previewImage
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Photo</span>
          </button>
          <button
            id="tab-preset-btn"
            onClick={() => {
              setPreviewImage(null);
              setMode('preset');
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              mode === 'preset' && !previewImage
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Demo Portraits</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Card */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/90 shadow-2xl shadow-stone-950">
        {/* Vintage Camera Corner Accents */}
        <div className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-amber-500/60 z-20"></div>
        <div className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-amber-500/60 z-20"></div>
        <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-amber-500/60 z-20"></div>
        <div className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-amber-500/60 z-20"></div>

        {/* Shutter Flash Animation */}
        {flashActive && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-white transition-opacity duration-150"></div>
        )}

        {/* PREVIEW MODE (Photo Captured or Selected) */}
        {previewImage ? (
          <div className="relative aspect-square w-full bg-stone-950">
            <img
              src={previewImage}
              alt="Portrait Preview"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay badge */}
            <div className="absolute top-4 left-4 rounded-md border border-stone-700 bg-stone-950/80 px-2.5 py-1 text-xs font-semibold text-stone-300 backdrop-blur-md">
              Original Portrait • Ready for Travel
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-3 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3 rounded-xl backdrop-blur-sm">
              <button
                id="retake-photo-btn"
                onClick={() => {
                  setPreviewImage(null);
                  if (mode === 'camera') startCamera();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900/90 px-3.5 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retake</span>
              </button>

              <button
                id="confirm-photo-btn"
                onClick={() => onPhotoSelected(previewImage)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs sm:text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-[1.02]"
              >
                <span>Continue to Time Travel</span>
                <Check className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : mode === 'camera' ? (
          /* LIVE CAMERA MODE */
          <div className="relative aspect-square w-full overflow-hidden bg-stone-950">
            {cameraError ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="mb-3 h-10 w-10 text-amber-500" />
                <p className="text-sm font-medium text-stone-300">{cameraError}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-700"
                  >
                    Retry Camera
                  </button>
                  <button
                    onClick={() => setMode('upload')}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 hover:bg-amber-400"
                  >
                    Upload File Instead
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />

                {/* Face Silhouette Guide */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-48 rounded-[50%] border-2 border-dashed border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center justify-center">
                    <span className="text-[11px] font-medium tracking-wide uppercase text-amber-400/70 bg-stone-950/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      Align Face Here
                    </span>
                  </div>
                </div>

                {/* Countdown display */}
                {countdown !== null && (
                  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-stone-950/40 backdrop-blur-[2px]">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-amber-400 bg-stone-950/80 font-cinzel text-6xl font-bold text-amber-400 shadow-2xl animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* Camera Top Controls */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                  <span className="flex items-center gap-1.5 rounded-md border border-stone-800 bg-stone-950/80 px-2 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE BOOTH
                  </span>

                  <button
                    id="flip-camera-btn"
                    onClick={toggleFacingMode}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700 bg-stone-950/80 text-stone-300 hover:text-white backdrop-blur-sm focus:outline-none"
                    title="Flip camera"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                </div>

                {/* Camera Bottom Shutter Bar */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-center z-20">
                  <button
                    id="shutter-snap-btn"
                    onClick={handleStartCountdown}
                    disabled={countdown !== null || !cameraActive}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-400 bg-stone-950/90 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                    title="Take Photo (3s Timer)"
                  >
                    <div className="h-10 w-10 rounded-full bg-amber-500 group-hover:bg-amber-400 transition-colors"></div>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : mode === 'upload' ? (
          /* UPLOAD MODE */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center p-8 text-center transition-all ${
              dragOver ? 'border-2 border-dashed border-amber-400 bg-amber-950/20' : 'bg-stone-950 hover:bg-stone-900/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-amber-400">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-stone-200">
              Drag & Drop Portrait Here
            </h3>
            <p className="mt-1 text-xs text-stone-400 max-w-xs font-sans">
              Or click to browse from your device (PNG, JPG, or WEBP)
            </p>
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
              Best results: Clear frontal headshot
            </div>
          </div>
        ) : (
          /* PRESET DEMO AVATARS */
          <div className="aspect-square w-full overflow-y-auto p-5 bg-stone-950">
            <p className="mb-3 text-xs font-medium text-stone-400 text-center font-sans">
              Select a demo portrait to test time-travel instantly:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  id={`select-${avatar.id}-btn`}
                  onClick={() => handleSelectAvatar(avatar.url)}
                  className="group relative overflow-hidden rounded-xl border border-stone-800 bg-stone-900 text-left transition-all hover:border-amber-500/60 hover:scale-[1.02]"
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-stone-200 group-hover:text-amber-300">
                      {avatar.name}
                    </p>
                    <p className="text-[10px] text-stone-400 line-clamp-1">
                      {avatar.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

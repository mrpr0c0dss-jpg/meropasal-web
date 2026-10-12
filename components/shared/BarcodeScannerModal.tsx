'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ScanBarcode, AlertCircle, RefreshCw } from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const startCamera = async () => {
      try {
        setErrorMsg(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          setErrorMsg('Camera access is not supported on this browser/device.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: unknown) {
        setHasCamera(false);
        const error = err as Error;
        setErrorMsg(error.message || 'Camera permission denied or camera not found.');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    audioFeedback.playScanBeep();
    onScan(manualBarcode.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 text-center overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ScanBarcode className="w-5 h-5 text-blue-600" />
            <span>Barcode & QR Camera Scanner</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder View */}
        <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700">
          {hasCamera ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Aiming Reticle */}
              <div className="absolute inset-x-8 inset-y-10 border-2 border-blue-500 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(37,99,235,0.5)] flex flex-col justify-between p-2">
                <div className="w-full h-0.5 bg-red-500 animate-pulse" />
                <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded mx-auto">
                  Align Barcode Inside Box
                </span>
              </div>
            </>
          ) : (
            <div className="p-6 text-slate-400 text-xs space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
              <p className="font-semibold text-slate-300">Live Camera Not Detected</p>
              <p className="text-[11px] text-slate-500">{errorMsg || 'Please use manual barcode entry below'}</p>
            </div>
          )}
        </div>

        {/* Manual Barcode Fallback Input */}
        <form onSubmit={handleManualSubmit} className="mt-4 space-y-3 text-xs text-left">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Manual Barcode / Scanner Gun Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Scan or type barcode (e.g. 8901234567890)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
              >
                Scan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { ProductModel } from '@/lib/types';
import {
  Camera,
  X,
  ScanBarcode,
  Flashlight,
  SwitchCamera,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface ContinuousBarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductScanned?: (product: ProductModel) => void;
}

export const ContinuousBarcodeScanner: React.FC<ContinuousBarcodeScannerProps> = ({
  isOpen,
  onClose,
  onProductScanned,
}) => {
  const { products, cart, addToCart, formatCurrency, t } = useApp();

  const [hasCamera, setHasCamera] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastScannedProduct, setLastScannedProduct] = useState<ProductModel | null>(null);
  const [sessionScanCount, setSessionScanCount] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const isLockedRef = useRef(false);
  const lastCodeRef = useRef('');
  const lastTimeRef = useRef(0);

  const processBarcode = useCallback((rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    const now = Date.now();
    const isSameCode = code === lastCodeRef.current;
    const elapsed = now - lastTimeRef.current;

    // Prevent immediate double scan of identical item within 2.5 seconds
    if (isSameCode && elapsed < 2500) {
      return;
    }
    if (!isSameCode && elapsed < 600) {
      return;
    }

    lastCodeRef.current = code;
    lastTimeRef.current = now;

    // Lookup product in database
    const matched = products.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === code.toLowerCase()) ||
        p.id.toLowerCase() === code.toLowerCase()
    );

    if (matched) {
      addToCart(matched, 1);
      audioFeedback.playScanBeep();
      setLastScannedProduct(matched);
      setSessionScanCount((prev) => prev + 1);
      if (onProductScanned) onProductScanned(matched);
    } else {
      audioFeedback.playErrorTone();
      alert(`Barcode "${code}" was not found in your inventory.`);
    }
  }, [addToCart, onProductScanned, products]);

  // Start ZXing Camera Stream
  useEffect(() => {
    if (!isOpen) {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setErrorMsg(null);
    setHasCamera(true);

    const startDecoding = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          setErrorMsg('Camera access is not supported on this browser or platform.');
          return;
        }

        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          setHasCamera(false);
          setErrorMsg('No camera hardware found.');
          return;
        }

        const selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              processBarcode(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
              // Ignore standard frame scan misses
            }
          }
        );
      } catch (err: unknown) {
        setHasCamera(false);
        const error = err as Error;
        setErrorMsg(error.message || 'Camera permission denied.');
      }
    };

    startDecoding();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
    };
  }, [isOpen, facingMode, processBarcode]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processBarcode(manualCode.trim());
    setManualCode('');
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const cartTotal = cart.reduce((acc, it) => acc + it.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <ScanBarcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Live Mart Barcode Scanner
              </h3>
              <p className="text-[11px] text-slate-400">
                Continuous auto-detect mode (Point &amp; Scan)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sessionScanCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-xs">
                {sessionScanCount} Scanned
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewfinder */}
        <div className="p-4 space-y-3 bg-slate-950 flex flex-col items-center">
          <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
            {hasCamera ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Framing Box & Laser */}
                <div className="absolute inset-x-10 inset-y-12 border-2 border-emerald-500/80 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)] flex flex-col justify-between p-2">
                  {/* Laser line animated */}
                  <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300 bg-black/70 px-2 py-0.5 rounded mx-auto backdrop-blur-xs">
                    Align Barcode or QR Inside
                  </span>
                </div>

                {/* On-camera controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={handleSwitchCamera}
                    className="p-2 rounded-xl bg-black/60 text-white hover:bg-black/90 backdrop-blur-xs transition"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
                <p className="font-bold text-slate-200 text-xs">Camera Inactive or Not Supported</p>
                <p className="text-[11px] text-slate-500">{errorMsg || 'Please use the manual scanner field below.'}</p>
              </div>
            )}
          </div>

          {/* Feedback Toast on Scan */}
          {lastScannedProduct && (
            <div className="w-full p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold truncate">{lastScannedProduct.name}</span>
              </div>
              <span className="font-black text-white shrink-0">
                +{formatCurrency(lastScannedProduct.sellingPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Manual Barcode Input & Search Fallback */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] space-y-3">
          <form onSubmit={handleManualSubmit} className="flex gap-2 text-xs">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Barcode scanner gun / type number (e.g. 8901234567890)"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
            >
              Add
            </button>
          </form>

          {/* Cart Status Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Bill</span>
              <span className="font-black text-sm text-slate-900 dark:text-white">
                {formatCurrency(cartTotal)} ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Done / Checkout Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

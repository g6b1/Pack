
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { ChecklistItem } from '../types.ts';

interface ShareModalProps {
  listTitle: string;
  items: ChecklistItem[];
  onClose: () => void;
  onImport: (title: string, items: ChecklistItem[]) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ listTitle, items, onClose, onImport }) => {
  const [mode, setMode] = useState<'display' | 'scan'>('display');
  const [error, setError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Encode list data for QR
  const shareData = JSON.stringify({
    v: 1,
    title: listTitle,
    items: items.map(({ label, subtext, icon, color }) => ({ label, subtext, icon, color }))
  });

  const initializeScanner = async () => {
    const elementId = "qr-reader";
    const element = document.getElementById(elementId);
    
    if (!element || isCameraStarting || scannerRef.current) {
      if (!element) setTimeout(initializeScanner, 150);
      return;
    }

    try {
      setError(null);
      setIsCameraStarting(true);
      
      // Clear any existing content
      element.innerHTML = "";
      
      const scanner = new Html5Qrcode(elementId);
      scannerRef.current = scanner;
      
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 20,
          aspectRatio: 1.0,
        },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.v === 1 && data.title && Array.isArray(data.items)) {
              onImport(data.title, data.items);
              stopScanner();
            } else {
              setError("Invalid Pack QR");
            }
          } catch (e) {
            setError("Invalid QR format");
          }
        },
        () => {}
      );
      setIsCameraStarting(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera unavailable");
      setIsCameraStarting(false);
      setTimeout(() => setMode('display'), 2500);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current = null;
      } catch (e) {
        console.error("Cleanup failed:", e);
      }
    }
  };

  useEffect(() => {
    if (mode === 'scan') {
      initializeScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [mode]);

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center px-6">
      {/* Background Dimmer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-[32px]"
      />
      
      {/* Mode Switcher - iOS Segmented Control Style */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-[120] mb-8 p-1 bg-white/10 backdrop-blur-xl rounded-2xl flex gap-1 border border-white/10 shadow-2xl"
      >
        <button
          onClick={() => setMode('display')}
          className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
            mode === 'display' 
              ? 'bg-white text-black shadow-lg scale-100' 
              : 'text-white/60 hover:text-white scale-95'
          }`}
        >
          Share Pack
        </button>
        <button
          onClick={() => setMode('scan')}
          className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
            mode === 'scan' 
              ? 'bg-white text-black shadow-lg scale-100' 
              : 'text-white/60 hover:text-white scale-95'
          }`}
        >
          Scan QR
        </button>
      </motion.div>

      {/* The Passport Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative w-full max-w-[340px] min-h-[460px] bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center p-8 overflow-hidden ring-1 ring-white/40"
      >
        {/* Iridescent Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 via-white to-rose-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-50 pointer-events-none" />

        <AnimatePresence mode="wait">
          {mode === 'display' ? (
            <motion.div 
              key="display"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              className="w-full flex-1 flex flex-col items-center justify-between relative z-10"
            >
              <div className="text-center pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Pack Identity</p>
                <h3 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">{listTitle}</h3>
              </div>

              <div className="relative p-6 my-6 bg-white rounded-[44px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100 ring-1 ring-slate-50">
                <QRCodeSVG 
                  value={shareData} 
                  size={180} 
                  level="H" 
                  includeMargin={false}
                  className="rounded-xl"
                />
                {/* Subtle Scanline Animation on QR */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-6 right-6 h-px bg-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.3)] pointer-events-none"
                />
              </div>

              <div className="flex flex-col items-center gap-4 pb-2">
                <div className="flex -space-x-2">
                  {items.slice(0, 4).map((item, i) => (
                    <div key={i} className={`size-8 rounded-full ${item.color} border-2 border-white flex items-center justify-center text-sm shadow-sm ring-1 ring-slate-100`}>
                      {item.icon}
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="size-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100">
                      +{items.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] text-center">
                  Scan to import this pack
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="scan"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex-1 relative bg-slate-950 rounded-[38px] overflow-hidden shadow-inner"
            >
              {/* Scanner Viewport */}
              <div id="qr-reader" className="w-full h-full absolute inset-0"></div>
              
              {/* Camera Loading State */}
              <AnimatePresence>
                {isCameraStarting && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900 z-30 flex flex-col items-center justify-center gap-6"
                  >
                    <div className="relative">
                      <div className="size-16 border-4 border-white/5 rounded-full" />
                      <div className="absolute inset-0 size-16 border-4 border-transparent border-t-white rounded-full animate-spin" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Initializing</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Accessing Camera</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scanning HUD */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <div className="relative w-64 h-64">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 size-10 border-t-[5px] border-l-[5px] border-white rounded-tl-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  <div className="absolute top-0 right-0 size-10 border-t-[5px] border-r-[5px] border-white rounded-tr-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  <div className="absolute bottom-0 left-0 size-10 border-b-[5px] border-l-[5px] border-white rounded-bl-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  <div className="absolute bottom-0 right-0 size-10 border-b-[5px] border-r-[5px] border-white rounded-br-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  
                  {/* Scanning Line */}
                  <motion.div 
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"
                  />

                  {/* Inner Glow */}
                  <div className="absolute inset-4 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-[1px]" />
                </div>

                <div className="mt-10 flex flex-col items-center gap-3">
                  {error ? (
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="px-6 py-3 bg-rose-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl border border-white/20"
                    >
                      {error}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">
                        Scanning for Pack
                      </p>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="size-1 rounded-full bg-white"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Close Button - Floating FAB style */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={onClose}
        className="mt-10 size-16 rounded-full bg-white flex items-center justify-center active:scale-90 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] group"
      >
        <span className="material-symbols-outlined text-slate-900 text-3xl group-hover:rotate-90 transition-transform duration-300">close</span>
      </motion.button>
    </div>
  );
};

export default ShareModal;

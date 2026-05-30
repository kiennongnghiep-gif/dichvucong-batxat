import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PWAUpdater() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const currentVersionRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Register the Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] ServiceWorker registered successfully:', registration.scope);

            // Optional: Listen to update found events for the standard sw cycle
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      // New content is available but waiting
                      console.log('[PWA] New content is available; please refresh.');
                      setHasUpdate(true);
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('[PWA] ServiceWorker registration failed:', error);
          });
      });
    }

    // 2. Continuous Background Check Mechanism
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.version) {
            if (currentVersionRef.current && data.version !== currentVersionRef.current) {
              console.log('[PWA] New version detected on server:', data.version);
              setHasUpdate(true);
            } else if (!currentVersionRef.current) {
              // Initial version capture
              currentVersionRef.current = data.version;
              console.log('[PWA] Initial version running:', data.version);
            }
          }
        }
      } catch (err) {
        console.warn('[PWA] Error checking latest version:', err);
      }
    };

    // Run first check
    checkVersion();

    // Check version every 20 seconds
    const intervalId = setInterval(checkVersion, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // 1. Clear all PWA caches
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        console.log('[PWA] Caches cleared successfully.');
      }

      // 2. Unregister Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
        console.log('[PWA] ServiceWorkers unregistered.');
      }
    } catch (error) {
      console.error('[PWA] Error during update clear-up:', error);
    } finally {
      // 3. Forced safe reload to pull everything from network
      console.log('[PWA] Refreshing window...');
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {hasUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-white/95 text-stone-900 border-2 border-brand-yellow rounded-2xl p-4 shadow-2xl backdrop-blur-md z-[9999] flex flex-col gap-3"
          id="pwa-update-banner"
        >
          <div className="flex items-start gap-3">
            <div className="bg-brand-red-pride text-white p-2.5 rounded-full mt-0.5 shrink-0 flex items-center justify-center animate-bounce shadow-md">
              <Download className="w-5 h-5 text-brand-yellow" />
            </div>
            <div className="grow">
              <h4 className="text-[15px] font-bold text-brand-red-pride tracking-tight">
                Cập nhật phiên bản mới
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5 font-medium">
                Hệ thống một cửa đã có bản cập nhật mới. Bà con vui lòng tải phiên bản mới để xem đúng các thông tin, trình tự thủ tục hành chính mới nhất.
              </p>
            </div>
            <button
              onClick={() => setHasUpdate(false)}
              className="text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-1.5 rounded-lg transition-colors shrink-0"
              title="Để sau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 justify-end pt-1 border-t border-stone-100">
            <button
              onClick={() => setHasUpdate(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition"
              disabled={updating}
            >
              Để sau
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-xs font-black text-brand-red-deep bg-brand-yellow hover:bg-yellow-400 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm active:scale-95"
              disabled={updating}
              id="pwa-update-confirm-btn"
            >
              {updating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Đang thiết lập...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Cập nhật ngay
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { subscribeToWakingState } from '../lib/apiInterceptor';

export default function RenderWarmingBanner() {
  const [isWaking, setIsWaking] = useState(false);

  useEffect(() => {
    // Subscribe to global long-running request states
    const unsubscribe = subscribeToWakingState((waking) => {
      setIsWaking(waking);
    });
    return unsubscribe;
  }, []);

  return (
    <AnimatePresence>
      {isWaking && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -80, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-24 left-1/2 z-[9999] w-[90%] max-w-lg bg-amber-500/10 dark:bg-amber-950/40 backdrop-blur-md border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 shadow-lg select-none"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 animate-bounce" />
          <div className="flex-1">
            <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">
              Render Backend Waking Up
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              The API server is currently waking up from sleep. This first load can take up to <strong>50 seconds</strong>. The page will display your data automatically as soon as it's ready.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-8 left-3 z-40 flex items-center gap-2 px-2.5 py-1 rounded bg-amber-600 text-white shadow-md text-[11px] font-medium animate-in fade-in slide-in-from-bottom-2"
    >
      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
      <span>Offline Mode &mdash; Drawing & local changes are cached</span>
    </div>
  );
};

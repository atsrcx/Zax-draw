import React, { memo, useState, useCallback } from 'react';
import { Tldraw, Editor } from 'tldraw';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { safeDeleteIndexedDB } from '../utils/storage';

interface CanvasBoardProps {
  onMount: (editor: Editor) => void;
}

const PERSISTENCE_KEY = 'tldraw_sdk_main_board';

export const CanvasBoard: React.FC<CanvasBoardProps> = memo(({ onMount }) => {
  const [boardVersion, setBoardVersion] = useState(0);

  const handleResetData = useCallback(async () => {
    try {
      await safeDeleteIndexedDB(PERSISTENCE_KEY);
      await safeDeleteIndexedDB('tldraw');
    } catch (err) {
      console.warn('[CanvasBoard] Failed to delete IndexedDB during reset:', err);
    }
    setBoardVersion((v) => v + 1);
  }, []);

  return (
    <CanvasErrorBoundary key={`canvas-boundary-${boardVersion}`} onResetData={handleResetData}>
      <Tldraw
        key={`tldraw-instance-${PERSISTENCE_KEY}-${boardVersion}`}
        persistenceKey={PERSISTENCE_KEY}
        onMount={onMount}
        autoFocus={false}
      />
    </CanvasErrorBoundary>
  );
});

CanvasBoard.displayName = 'CanvasBoard';

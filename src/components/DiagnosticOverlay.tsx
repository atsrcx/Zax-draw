import React, { useState, useEffect } from 'react';

interface ParentCheck {
  name: string;
  size: string;
  status: string;
}

interface DiagnosticData {
  canvasBoardMounted: boolean;
  canvasBoardTime: string;
  tldrawMounted: boolean;
  tldrawMountTime: string;
  editorId: string;
  testShapeStatus: string;
  windowSize: string;
  wrapperSize: string;
  wrapperRect: string;
  tldrawRootSize: string;
  tldrawRootComputed: string;
  tlCanvasExists: boolean;
  canvasCount: number;
  svgCount: number;
  parentChecks: ParentCheck[];
  anyZeroOrHidden: boolean;
}

function sampleDiagnostics(): DiagnosticData {
  const win = typeof window !== 'undefined' ? window : null;
  const diag = (win as any)?.__TLDRAW_DIAGNOSTICS__ || {};

  const wrapper = document.getElementById('tldraw-canvas-wrapper');
  const appRoot = document.getElementById('tldraw-app-root');
  const root = document.getElementById('root');
  const body = document.body;
  const html = document.documentElement;
  const tlContainer = document.querySelector('.tl-container') as HTMLElement | null;
  const tlCanvas = document.querySelector('.tl-canvas') as HTMLElement | null;

  const parents = [
    { name: 'html', el: html },
    { name: 'body', el: body },
    { name: '#root', el: root },
    { name: '#tldraw-app-root', el: appRoot },
    { name: '#tldraw-canvas-wrapper', el: wrapper },
    { name: '.tl-container', el: tlContainer },
  ];

  let anyZeroOrHidden = false;
  const parentChecks: ParentCheck[] = parents.map(({ name, el }) => {
    if (!el) {
      return { name, size: 'NOT FOUND', status: 'MISSING' };
    }
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const disp = cs.display;
    const vis = cs.visibility;
    const op = cs.opacity;
    const isZero = w === 0 || h === 0;
    const isHidden = disp === 'none' || vis === 'hidden' || op === '0';
    if (isZero || isHidden) anyZeroOrHidden = true;

    return {
      name,
      size: `${w}x${h}`,
      status: isHidden ? `HIDDEN(${disp}/${vis}/${op})` : isZero ? 'ZERO_SIZE' : 'OK',
    };
  });

  const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : null;
  const tlContainerCs = tlContainer ? window.getComputedStyle(tlContainer) : null;

  return {
    canvasBoardMounted: Boolean(diag.canvasBoardMounted),
    canvasBoardTime: diag.canvasBoardTime || 'NO',
    tldrawMounted: Boolean(diag.tldrawMounted),
    tldrawMountTime: diag.tldrawMountTime || 'NO',
    editorId: diag.editorId || 'none',
    testShapeStatus: diag.testShapeStatus || 'Pending onMount',
    windowSize: win ? `${win.innerWidth}x${win.innerHeight} (dpr:${win.devicePixelRatio})` : 'N/A',
    wrapperSize: wrapper ? `${wrapper.clientWidth}x${wrapper.clientHeight}` : 'NOT FOUND',
    wrapperRect: wrapperRect
      ? `top:${Math.round(wrapperRect.top)} left:${Math.round(wrapperRect.left)} w:${Math.round(wrapperRect.width)} h:${Math.round(wrapperRect.height)}`
      : 'N/A',
    tldrawRootSize: tlContainer ? `${tlContainer.clientWidth}x${tlContainer.clientHeight}` : 'NOT FOUND',
    tldrawRootComputed: tlContainerCs
      ? `display:${tlContainerCs.display} vis:${tlContainerCs.visibility} op:${tlContainerCs.opacity} pos:${tlContainerCs.position}`
      : 'N/A',
    tlCanvasExists: Boolean(tlCanvas),
    canvasCount: document.querySelectorAll('canvas').length,
    svgCount: document.querySelectorAll('.tl-container svg').length,
    parentChecks,
    anyZeroOrHidden,
  };
}

export const DiagnosticOverlay: React.FC = () => {
  const [data, setData] = useState<DiagnosticData>(sampleDiagnostics);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const update = () => setData(sampleDiagnostics());

    // Poll rapidly initially, then steady
    const interval = setInterval(update, 600);
    window.addEventListener('resize', update);
    window.addEventListener('tldraw-diagnostic-update', update);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', update);
      window.removeEventListener('tldraw-diagnostic-update', update);
    };
  }, []);

  return (
    <div
      id="visible-diagnostic-overlay"
      className="fixed bottom-2 left-2 right-2 sm:left-auto sm:right-2 sm:w-[420px] z-[99999] bg-slate-950/95 border-2 border-amber-500/80 rounded-lg shadow-2xl p-3 text-white font-mono text-[11px] leading-tight select-text backdrop-blur-md"
    >
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          TLDRAW RUNTIME DIAGNOSTIC HUD
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setData(sampleDiagnostics())}
            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsMinimized((v) => !v)}
            className="px-1.5 py-0.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-[10px] cursor-pointer"
          >
            {isMinimized ? 'Expand' : 'Minimize'}
          </button>
        </div>
      </div>

      {isMinimized ? (
        <div className="text-[10px] flex items-center justify-between">
          <span className={data.tldrawMounted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            Tldraw: {data.tldrawMounted ? 'MOUNTED' : 'NOT MOUNTED'}
          </span>
          <span className="text-slate-400">Win: {data.windowSize}</span>
          <span className="text-cyan-300">Wrap: {data.wrapperSize}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Status Rows */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded border border-slate-800">
            <div>
              <span className="text-slate-400">CanvasBoard: </span>
              <span className={data.canvasBoardMounted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.canvasBoardMounted ? `MOUNTED (${data.canvasBoardTime})` : 'NOT MOUNTED'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Tldraw onMount: </span>
              <span className={data.tldrawMounted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.tldrawMounted ? `MOUNTED (${data.tldrawMountTime})` : 'NOT MOUNTED'}
              </span>
            </div>
          </div>

          {/* Test Shape Status */}
          <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Test Shape (onMount): </span>
            <span
              className={
                data.testShapeStatus.startsWith('CREATED')
                  ? 'text-emerald-400 font-bold'
                  : data.testShapeStatus.startsWith('FAILED')
                    ? 'text-rose-400 font-bold'
                    : 'text-amber-300'
              }
            >
              {data.testShapeStatus}
            </span>
          </div>

          {/* Sizing Information */}
          <div className="space-y-0.5 bg-slate-900/90 p-1.5 rounded border border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400">Window Size: </span>
              <span className="text-cyan-300 font-semibold">{data.windowSize}</span>
            </div>
            <div>
              <span className="text-slate-400">Wrapper (#tldraw-canvas-wrapper): </span>
              <span className="text-cyan-300 font-semibold">{data.wrapperSize}</span>{' '}
              <span className="text-slate-500 text-[9px]">[{data.wrapperRect}]</span>
            </div>
            <div>
              <span className="text-slate-400">Tldraw Root (.tl-container): </span>
              <span className={data.tldrawRootSize === 'NOT FOUND' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                {data.tldrawRootSize}
              </span>{' '}
              <span className="text-slate-400 text-[9px]">[{data.tldrawRootComputed}]</span>
            </div>
            <div>
              <span className="text-slate-400">Canvas elements: </span>
              <span className="text-slate-200">
                .tl-canvas: {data.tlCanvasExists ? 'YES' : 'NO'} | &lt;canvas&gt;: {data.canvasCount} | .tl-container svg: {data.svgCount}
              </span>
            </div>
          </div>

          {/* DOM Parent Hierarchy Check */}
          <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 text-[10px]">
            <div className="text-slate-400 font-bold mb-0.5">DOM Hierarchy & Sizing:</div>
            <div className="grid grid-cols-3 gap-1 text-[9px]">
              {data.parentChecks.map((p) => (
                <div
                  key={p.name}
                  className={`p-1 rounded border ${
                    p.status === 'OK'
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-300'
                      : 'border-rose-500 bg-rose-950/40 text-rose-300 font-bold'
                  }`}
                >
                  <div className="truncate font-semibold">{p.name}</div>
                  <div>{p.size}</div>
                  <div className={p.status === 'OK' ? 'text-emerald-400' : 'text-rose-400'}>{p.status}</div>
                </div>
              ))}
            </div>
            {data.anyZeroOrHidden && (
              <div className="mt-1 text-rose-400 font-bold bg-rose-950/60 p-1 rounded border border-rose-600 text-[10px]">
                CRITICAL: One or more parent elements has 0 width/height or display:none/hidden!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

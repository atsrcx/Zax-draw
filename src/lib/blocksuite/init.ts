import { effects as registerBlocksEffects } from '@blocksuite/blocks/effects';
import { effects as registerPresetsEffects } from '@blocksuite/presets/effects';
import { EdgelessEditor } from '@blocksuite/presets';

let isInitialized = false;

/**
 * Safely registers all BlockSuite blocks, widgets, and editor custom elements.
 * Makes customElements.define idempotent to avoid aborting on duplicate definitions.
 */
export function ensureBlockSuiteRegistered(): void {
  if (typeof window === 'undefined' || isInitialized) return;

  // Make customElements.define idempotent
  if (window.customElements) {
    const originalDefine = window.customElements.define.bind(window.customElements);
    window.customElements.define = function (
      name: string,
      constructor: CustomElementConstructor,
      options?: ElementDefinitionOptions
    ) {
      if (!window.customElements.get(name)) {
        try {
          originalDefine(name, constructor, options);
        } catch {
          // Ignore duplicate definitions gracefully
        }
      }
    };
  }

  // Explicitly register edgeless-editor first so constructor is guaranteed valid
  if (!customElements.get('edgeless-editor')) {
    try {
      customElements.define('edgeless-editor', EdgelessEditor);
    } catch {
      // already registered
    }
  }

  // Register all BlockSuite block definitions (surface, note, frame, paragraph, etc.)
  try {
    registerBlocksEffects();
  } catch (err) {
    console.warn('[ZaxDraw] blocks effects registration notice:', err);
  }

  // Register all preset components (editor containers, panels, toolbars)
  try {
    registerPresetsEffects();
  } catch (err) {
    console.warn('[ZaxDraw] presets effects registration notice:', err);
  }

  isInitialized = true;
}

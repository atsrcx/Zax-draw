import { DocCollection, Schema, Doc, Text } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks/schemas';
import * as Y from 'yjs';
import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'zax_draw_doc_binary';
const DOC_ID = 'zax-draw-main-doc';

let sharedCollection: DocCollection | null = null;
let sharedDoc: Doc | null = null;
let saveTimeout: any = null;

/**
 * Initializes or returns the shared DocCollection with all Affine schemas.
 */
export function getOrCreateDocCollection(): DocCollection {
  if (!sharedCollection) {
    const schema = new Schema().register(AffineSchemas);
    sharedCollection = new DocCollection({ schema, id: 'zax-draw-workspace' });
    sharedCollection.meta.initialize();
  }
  return sharedCollection;
}

/**
 * Initializes and retrieves the main whiteboard Doc with IndexedDB persistence.
 */
export async function getOrCreateMainDoc(): Promise<{ doc: Doc; isNew: boolean }> {
  if (sharedDoc) {
    return { doc: sharedDoc, isNew: false };
  }

  const collection = getOrCreateDocCollection();
  const doc = collection.createDoc({ id: DOC_ID });
  sharedDoc = doc;

  let isNew = true;

  try {
    const savedBinary = await get<Uint8Array>(STORAGE_KEY);
    if (savedBinary && savedBinary.byteLength > 0) {
      doc.load();
      Y.applyUpdate(doc.spaceDoc, savedBinary);
      isNew = false;
    }
  } catch (err) {
    console.warn('[ZaxDraw] Failed to restore from IndexedDB:', err);
  }

  if (isNew) {
    doc.load();
    const rootId = doc.addBlock('affine:page', {
      title: new Text('Zax-draw Whiteboard'),
    });
    doc.addBlock('affine:surface', {}, rootId);
    const noteId = doc.addBlock('affine:note', {}, rootId);
    doc.addBlock('affine:paragraph', { text: new Text('') }, noteId);
  }

  // Setup debounced autosave on doc updates
  doc.spaceDoc.on('update', () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        const update = Y.encodeStateAsUpdate(doc.spaceDoc);
        await set(STORAGE_KEY, update);
      } catch (err) {
        console.warn('[ZaxDraw] Failed to save state to IndexedDB:', err);
      }
    }, 400);
  });

  return { doc, isNew };
}

/**
 * Forces an immediate save of the document state to IndexedDB.
 */
export async function forceSaveDoc(doc: Doc): Promise<void> {
  try {
    const update = Y.encodeStateAsUpdate(doc.spaceDoc);
    await set(STORAGE_KEY, update);
  } catch (err) {
    console.warn('[ZaxDraw] Force save error:', err);
  }
}

/**
 * Clears local board persistence from IndexedDB.
 */
export async function clearDocPersistence(): Promise<void> {
  try {
    await del(STORAGE_KEY);
  } catch (err) {
    console.warn('[ZaxDraw] Clear persistence error:', err);
  }
}

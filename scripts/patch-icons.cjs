const fs = require('fs');
const path = require('path');

const iconsDir = path.resolve(__dirname, '../node_modules/@blocksuite/icons/dist');

function patchFile(filePath, search, replace) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('CheckBoxCkeckSolidIcon')) {
    console.log(`[patch-icons] Already patched: ${path.basename(filePath)}`);
    return;
  }
  if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[patch-icons] Successfully patched: ${path.basename(filePath)}`);
  } else {
    console.warn(`[patch-icons] Search string not found in: ${path.basename(filePath)}`);
  }
}

try {
  // Patch lit.mjs
  patchFile(
    path.join(iconsDir, 'lit.mjs'),
    'CheckBoxCheckSolid as CheckBoxCheckSolidIcon,',
    'CheckBoxCheckSolid as CheckBoxCheckSolidIcon,\n  CheckBoxCheckSolid as CheckBoxCkeckSolidIcon,'
  );

  // Patch lit.js
  patchFile(
    path.join(iconsDir, 'lit.js'),
    'exports.CheckBoxCheckSolidIcon = CheckBoxCheckSolid;',
    'exports.CheckBoxCheckSolidIcon = CheckBoxCheckSolid;\nexports.CheckBoxCkeckSolidIcon = CheckBoxCheckSolid;'
  );

  // Patch lit.d.ts
  const dtsPath = path.join(iconsDir, 'lit.d.ts');
  if (fs.existsSync(dtsPath)) {
    let dts = fs.readFileSync(dtsPath, 'utf8');
    if (!dts.includes('CheckBoxCkeckSolidIcon')) {
      dts += '\nexport declare const CheckBoxCkeckSolidIcon: typeof CheckBoxCheckSolidIcon;\n';
      fs.writeFileSync(dtsPath, dts, 'utf8');
      console.log('[patch-icons] Successfully patched: lit.d.ts');
    }
  }
} catch (err) {
  console.warn('[patch-icons] Failed to patch icons:', err);
}

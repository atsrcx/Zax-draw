const fs = require('fs');
const path = require('path');

function findIconsDirs(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'icons' && path.basename(dir) === '@blocksuite') {
        const dist = path.join(fullPath, 'dist');
        if (fs.existsSync(dist)) {
          list.push(dist);
        }
      } else if (entry.name !== '.git') {
        findIconsDirs(fullPath, list);
      }
    }
  }
  return list;
}

function patchFile(filePath, search, replace) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('CheckBoxCkeckSolidIcon')) {
    return;
  }
  if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[patch-icons] Successfully patched: ${filePath}`);
  }
}

try {
  const nodeModulesDir = path.resolve(__dirname, '../node_modules');
  const iconsDirs = findIconsDirs(nodeModulesDir);

  for (const iconsDir of iconsDirs) {
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
        console.log(`[patch-icons] Successfully patched: ${dtsPath}`);
      }
    }
  }
} catch (err) {
  console.warn('[patch-icons] Failed to patch icons:', err);
}

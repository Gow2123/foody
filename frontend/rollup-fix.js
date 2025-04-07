// Rollup native module fix for Vercel
const fs = require('fs');
const path = require('path');

// Path to the problematic Rollup native module file
const nativeFilePath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

console.log('Patching Rollup native module file...');

try {
  if (fs.existsSync(nativeFilePath)) {
    // Backup the original file
    fs.copyFileSync(nativeFilePath, `${nativeFilePath}.backup`);

    // Replace the entire file with a version that doesn't try to load native modules
    const patchedContent = `
// This is a patched version that doesn't try to load native modules
const stubInterface = {
  isNativeEsmAvailable: false,
  getDefaultExternal() { return []; },
  getDefaultNativeExternal() { return []; },
  getMangleCache() { return null; },
  getGlobalExternal() { return []; },
  needsLegacyFunctionThis() { return true; }
};

// Export a stub interface
exports.getDefaultBuildOptions = () => ({});
exports.getNativeInterface = () => stubInterface;
exports.normalizeOptions = options => options;
`;

    // Write the patched content
    fs.writeFileSync(nativeFilePath, patchedContent);

    console.log('Successfully patched Rollup native.js file.');
  } else {
    console.log('Rollup native.js file not found. No patching required.');
  }
} catch (error) {
  console.error('Error patching Rollup native module:', error);
} 
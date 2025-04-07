// Rollup native module fix for Vercel
const fs = require('fs');
const path = require('path');

// Create stub modules for native dependencies
const modulesToStub = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-linux-x64-musl',
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

// Create node_modules directory if it doesn't exist
const nodeModulesDir = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir, { recursive: true });
}

// Create empty modules for all native dependencies
modulesToStub.forEach(moduleName => {
  const moduleDir = path.join(nodeModulesDir, moduleName);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(
      path.join(moduleDir, 'index.js'), 
      'module.exports = {};'
    );
    fs.writeFileSync(
      path.join(moduleDir, 'package.json'), 
      JSON.stringify({ name: moduleName, version: '3.29.4', main: 'index.js' })
    );
    console.log(`Created stub module for ${moduleName}`);
  }
});

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
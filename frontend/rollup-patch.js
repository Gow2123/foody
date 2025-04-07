// Direct patch for rollup's native.js
const fs = require('fs');
const path = require('path');

console.log('Running direct rollup patch script');

try {
  // First try to find the native.js file
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js'),
    path.join(process.cwd(), 'node_modules', 'vite', 'node_modules', 'rollup', 'dist', 'native.js'),
    path.join(process.cwd(), '../node_modules', 'rollup', 'dist', 'native.js'),
  ];

  let nativeFilePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      nativeFilePath = p;
      break;
    }
  }

  if (nativeFilePath) {
    console.log(`Found native.js at ${nativeFilePath}`);
    // Create patch
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
    fs.writeFileSync(nativeFilePath, patchedContent);
    console.log('Successfully patched Rollup native.js file');
  } else {
    console.log('Could not find Rollup native.js file');
    // Let's create dummy modules to completely bypass the issue
    const moduleRoot = path.join(process.cwd(), 'node_modules');
    if (!fs.existsSync(moduleRoot)) {
      fs.mkdirSync(moduleRoot, { recursive: true });
    }

    const modulesToStub = [
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-linux-x64-musl',
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-darwin-arm64'
    ];

    for (const moduleName of modulesToStub) {
      const moduleDir = path.join(moduleRoot, moduleName);
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
    }
  }
} catch (err) {
  console.error('Error in rollup-patch.js:', err);
} 
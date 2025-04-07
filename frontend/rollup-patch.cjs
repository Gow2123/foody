#!/usr/bin/env node

/**
 * This script patches Rollup to avoid native module issues.
 * It creates stub modules for platform-specific dependencies
 * and fixes the native.js file if it exists.
 */
const fs = require('fs');
const path = require('path');

// Create a stub for any module
function createStubModule(moduleName, location) {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location, { recursive: true });
    fs.writeFileSync(
      path.join(location, 'index.js'),
      'module.exports = {};'
    );
    fs.writeFileSync(
      path.join(location, 'package.json'),
      JSON.stringify({
        name: moduleName,
        version: '4.5.0',
        main: 'index.js'
      }, null, 2)
    );
    console.log(`Created stub for ${moduleName}`);
  }
}

// Handle platform-specific modules
const platformModules = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-linux-x64-musl',
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

try {
  // Create node_modules if it doesn't exist
  const nodeModules = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    fs.mkdirSync(nodeModules, { recursive: true });
  }

  // Create stub modules for platform-specific dependencies
  platformModules.forEach(moduleName => {
    const moduleLocation = path.join(nodeModules, moduleName);
    createStubModule(moduleName, moduleLocation);
  });

  // Find Rollup's native.js file
  const possibleNativePaths = [
    path.join(nodeModules, 'rollup', 'dist', 'native.js'),
    path.join(nodeModules, 'vite', 'node_modules', 'rollup', 'dist', 'native.js')
  ];

  let nativeJsPath = null;
  for (const p of possibleNativePaths) {
    if (fs.existsSync(p)) {
      nativeJsPath = p;
      break;
    }
  }

  // Patch native.js if found
  if (nativeJsPath) {
    console.log(`Found native.js at ${nativeJsPath}, patching...`);
    
    // Create a simple stub implementation that doesn't try to load native modules
    const patchedContent = `
// Patched by rollup-patch.cjs - Stub implementation to avoid native module issues
const stubInterface = {
  isNativeEsmAvailable: false,
  getDefaultExternal() { return []; },
  getDefaultNativeExternal() { return []; },
  getMangleCache() { return null; },
  getGlobalExternal() { return []; },
  needsLegacyFunctionThis() { return true; }
};

// Export stub functions
exports.getDefaultBuildOptions = () => ({});
exports.getNativeInterface = () => stubInterface;
exports.normalizeOptions = options => options;
`;
    
    fs.writeFileSync(nativeJsPath, patchedContent);
    console.log('Successfully patched Rollup native.js');
  } else {
    console.log('Could not find Rollup native.js file');
  }

  console.log('Rollup patch complete');
} catch (error) {
  console.error('Error in rollup-patch.cjs:', error);
} 
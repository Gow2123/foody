// Custom build script that avoids Rollup native module issues
import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create empty stub modules for native dependencies
function createStubModules() {
  const modulesToStub = [
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-linux-x64-musl',
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-darwin-arm64'
  ];

  const nodeModulesDir = path.join(process.cwd(), 'node_modules');
  
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir, { recursive: true });
  }
  
  // Create each stub module
  for (const moduleName of modulesToStub) {
    const moduleDir = path.join(nodeModulesDir, moduleName);
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
      
      // Create an empty JS file
      fs.writeFileSync(
        path.join(moduleDir, 'index.js'),
        'module.exports = {};'
      );
      
      // Create a minimal package.json
      fs.writeFileSync(
        path.join(moduleDir, 'package.json'),
        JSON.stringify({ 
          name: moduleName, 
          version: '3.29.4', 
          main: 'index.js' 
        }, null, 2)
      );
      
      console.log(`Created stub module for ${moduleName}`);
    }
  }
}

// Patch rollup's native.js file
function patchRollupNativeFile() {
  // Look for the native.js file in various locations
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js'),
    path.join(process.cwd(), 'node_modules', 'vite', 'node_modules', 'rollup', 'dist', 'native.js'),
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
    
    // Create a simple stub implementation
    const patchedContent = `
// Stub implementation that doesn't try to load native modules
const stubInterface = {
  isNativeEsmAvailable: false,
  getDefaultExternal() { return []; },
  getDefaultNativeExternal() { return []; },
  getMangleCache() { return null; },
  getGlobalExternal() { return []; },
  needsLegacyFunctionThis() { return true; }
};

exports.getDefaultBuildOptions = () => ({});
exports.getNativeInterface = () => stubInterface;
exports.normalizeOptions = options => options;
`;
    
    fs.writeFileSync(nativeFilePath, patchedContent);
    console.log('Successfully patched Rollup native.js file');
    return true;
  }
  
  console.log('Could not find Rollup native.js file');
  return false;
}

async function main() {
  console.log('Starting Vite build process...');
  
  // Set environment variables to prevent native module usage
  process.env.ROLLUP_SKIP_NODE_RESOLVE = 'true';
  process.env.ROLLUP_NATIVE_MODULES = 'false';
  process.env.NODE_OPTIONS = '--no-experimental-fetch';
  
  try {
    // Create stub modules for native dependencies
    createStubModules();
    
    // Patch rollup's native.js file if found
    patchRollupNativeFile();
    
    // Run the build
    console.log('Running Vite build...');
    await build();
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main(); 
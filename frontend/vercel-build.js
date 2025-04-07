#!/usr/bin/env node

/**
 * Special build script for Vercel deployment
 * This directly handles problematic dependencies
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel custom build process');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`Detected environment: ${isVercel ? 'Vercel' : 'Local'}`);

try {
  // Recursively find and rename problematic native modules 
  function findAndDisableNativeModules(directory) {
    if (!fs.existsSync(directory)) return;
    
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const fullPath = path.join(directory, file);
      
      // Skip node_modules inside node_modules
      if (fullPath.includes('node_modules/node_modules')) continue;
      
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Process subdirectories recursively
        findAndDisableNativeModules(fullPath);
      } else if (file === 'native.js' && fullPath.includes('rollup/dist')) {
        console.log(`Found problematic file: ${fullPath}`);
        
        // Patch the file directly
        const content = fs.readFileSync(fullPath, 'utf8');
        const patched = content.replace(
          /function\s+requireWithFriendlyError[^}]*}/s,
          'function requireWithFriendlyError() { throw new Error("Native modules disabled"); }'
        );
        
        fs.writeFileSync(fullPath, patched);
        console.log(`✅ Patched ${fullPath}`);
      }
    }
  }
  
  // Install dependencies without optional packages
  console.log('📦 Installing dependencies without optional packages...');
  execSync('npm install --no-optional', { stdio: 'inherit' });
  
  // Find and disable problematic modules
  console.log('🔍 Finding and disabling problematic native modules...');
  findAndDisableNativeModules(path.join(process.cwd(), 'node_modules'));
  
  // Run the build
  console.log('🏗️ Running build...');
  execSync(
    'ROLLUP_SKIP_NODE_RESOLVE=true ROLLUP_NATIVE_MODULES=false NODE_OPTIONS=--no-experimental-fetch npx vite build --config vite.config.js', 
    { stdio: 'inherit' }
  );
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 
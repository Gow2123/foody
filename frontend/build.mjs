// Custom build script to bypass Rollup native modules issue
import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('Starting custom build process...');
  
  // Run the direct rollup patch script first (it's a CommonJS script)
  try {
    console.log('Running direct rollup patch...');
    await execAsync('node rollup-patch.js');
  } catch (err) {
    console.error('Error running rollup-patch.js:', err);
    // Continue with the build
  }
  
  // Run the Vite build
  try {
    console.log('Running Vite build...');
    // Set environment variables to prevent native module usage
    process.env.ROLLUP_SKIP_NODE_RESOLVE = 'true';
    process.env.ROLLUP_NATIVE_MODULES = 'false';
    process.env.NODE_OPTIONS = '--no-experimental-fetch';
    
    await build();
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main(); 
#!/usr/bin/env node

/**
 * Special build script for Vercel deployment
 * This directly handles problematic dependencies
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build script...');

// Function to safely run a command
function runCommand(cmd) {
  try {
    console.log(`Running: ${cmd}`);
    const output = execSync(cmd, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${cmd}`);
    console.error(error.message);
    return false;
  }
}

// Fix Rollup native module issue
function fixRollupIssue() {
  console.log('Fixing Rollup native module issue...');
  
  try {
    // Run our prebuild script
    runCommand('node ./rollup-fix.js');
    runCommand('node ./commonjs-compat.cjs');
    
    // Ensure Rollup doesn't try to use native modules
    process.env.ROLLUP_SKIP_NODE_RESOLVE = 'true';
    process.env.ROLLUP_NATIVE_MODULES = 'false';
    process.env.NODE_OPTIONS = '--no-experimental-fetch';
    
    // Run the build
    console.log('Starting build...');
    return runCommand('npm run build');
  } catch (error) {
    console.error('Failed to fix Rollup issue or build:', error);
    return false;
  }
}

// Clean up node_modules and reinstall if needed
function cleanAndReinstall() {
  console.log('Cleaning node_modules and reinstalling dependencies...');
  
  try {
    // Skip if we're in a Vercel environment (let Vercel handle installation)
    if (process.env.VERCEL) {
      console.log('Running in Vercel environment, skipping manual reinstall');
      return true;
    }
    
    // Otherwise, clean and reinstall
    if (fs.existsSync('node_modules')) {
      fs.rmSync('node_modules', { recursive: true, force: true });
    }
    
    if (fs.existsSync('package-lock.json')) {
      fs.unlinkSync('package-lock.json');
    }
    
    return runCommand('npm install --no-optional');
  } catch (error) {
    console.error('Failed to clean and reinstall:', error);
    return false;
  }
}

// Run the build process
function main() {
  // Skip cleanup in Vercel environment
  if (!process.env.VERCEL) {
    cleanAndReinstall();
  }
  
  // Always fix rollup and run build
  if (!fixRollupIssue()) {
    console.error('Build failed!');
    process.exit(1);
  }
  
  console.log('Build completed successfully!');
}

main(); 
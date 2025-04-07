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

    // Read the file content
    let fileContent = fs.readFileSync(nativeFilePath, 'utf8');

    // Replace the problematic code that tries to load native modules
    fileContent = fileContent.replace(
      /try\s*{[\s\S]*?requireWithFriendlyError[\s\S]*?}\s*catch\s*\([^)]*\)\s*{/,
      'try { throw new Error("Skipping native module"); } catch (err) {'
    );

    // Write the modified content back to the file
    fs.writeFileSync(nativeFilePath, fileContent);

    console.log('Successfully patched Rollup native.js file.');
  } else {
    console.log('Rollup native.js file not found. No patching required.');
  }
} catch (error) {
  console.error('Error patching Rollup native module:', error);
} 
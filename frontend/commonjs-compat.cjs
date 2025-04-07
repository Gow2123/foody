// CommonJS compatibility for Vite/Rollup
const fs = require('fs');
const path = require('path');

// Force commonjs for certain files
const files = [
  'node_modules/rollup/dist/native.js'
];

console.log('Modifying files for CommonJS compatibility...');

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      // Add exports property to force CommonJS
      const packageJsonPath = path.join(path.dirname(fullPath), 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.exports = packageJson.exports || {};
        packageJson.exports['.'] = {
          require: './index.js',
          import: './index.js'
        };
        packageJson.type = 'commonjs';
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`Updated ${packageJsonPath} for CommonJS compatibility`);
      }
      
      // Modify the file itself
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace ESM imports with commonjs requires
      content = content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")');
      
      // Add module.exports if missing
      if (!content.includes('module.exports')) {
        content += '\nmodule.exports = { };\n';
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath} for CommonJS compatibility`);
    } catch (error) {
      console.error(`Error processing ${fullPath}:`, error);
    }
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('CommonJS compatibility modifications complete'); 
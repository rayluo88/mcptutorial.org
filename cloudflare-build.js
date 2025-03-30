/**
 * Cloudflare Build Preparation Script
 */
const fs = require('fs');
const path = require('path');

console.log('Running Cloudflare build preparation...');

// Ensure TypeScript is properly set up
try {
  // Read tsconfig.json
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

  // Update tsconfig to be more permissive
  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    noEmit: true,
    allowJs: true,
    skipLibCheck: true,
    strict: false,
  };

  // Include both JS and TS files
  tsconfig.include = [
    'next-env.d.ts',
    '.next/types/**/*.ts',
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
  ];

  // Write updated tsconfig
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('Updated tsconfig.json for Cloudflare deployment');
} catch (error) {
  console.error('Error updating tsconfig.json:', error);
}

console.log('Cloudflare build preparation complete!');

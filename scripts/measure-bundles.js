#!/usr/bin/env node
/**
 * This script measures the size of JavaScript bundles after optimization
 * and reports the total size along with individual chunk sizes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist', 'public', 'assets');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};

// Helper function to format file sizes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper function to get the gzipped size of a file
function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return zlib.gzipSync(content, { level: 9 }).length;
  } catch (err) {
    console.error(`Error getting gzipped size for ${filePath}:`, err);
    return 0;
  }
}

// Helper function to get the Brotli compressed size of a file
function getBrotliSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return zlib.brotliCompressSync(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }).length;
  } catch (err) {
    console.error(`Error getting Brotli size for ${filePath}:`, err);
    return 0;
  }
}

// Function to measure all JavaScript bundles
function measureBundles() {
  console.log(`${colors.cyan}Measuring JavaScript bundle sizes...${colors.reset}`);
  
  try {
    if (!fs.existsSync(distDir)) {
      console.error(`${colors.red}Error: Distribution directory not found at ${distDir}${colors.reset}`);
      console.log('Please run the build command first: npm run build:prod');
      process.exit(1);
    }
    
    // Get all JS files in the assets directory
    const files = fs.readdirSync(distDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        const gzipSize = getGzippedSize(filePath);
        const brotliSize = getBrotliSize(filePath);
        
        return {
          name: file,
          size,
          gzipSize,
          brotliSize,
          path: filePath,
        };
      })
      .sort((a, b) => b.size - a.size);
    
    // Calculate totals
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalGzipSize = files.reduce((sum, file) => sum + file.gzipSize, 0);
    const totalBrotliSize = files.reduce((sum, file) => sum + file.brotliSize, 0);
    
    // Print results in a table
    console.log(`\n${colors.magenta}JavaScript Bundle Sizes:${colors.reset}`);
    console.log('='.repeat(80));
    console.log(
      `${colors.cyan}File${' '.repeat(35)}Size${' '.repeat(8)}Gzip${' '.repeat(8)}Brotli${colors.reset}`
    );
    console.log('-'.repeat(80));
    
    files.forEach(file => {
      const name = file.name.length > 35 ? file.name.substring(0, 32) + '...' : file.name;
      const padding = 35 - name.length;
      
      let sizeColor;
      if (file.size > 100 * 1024) sizeColor = colors.red;
      else if (file.size > 50 * 1024) sizeColor = colors.yellow;
      else sizeColor = colors.green;
      
      console.log(
        `${name}${' '.repeat(padding)}${sizeColor}${formatBytes(file.size)}${colors.reset}` +
        `${' '.repeat(10 - formatBytes(file.size).length)}${colors.green}${formatBytes(file.gzipSize)}${colors.reset}` +
        `${' '.repeat(10 - formatBytes(file.gzipSize).length)}${colors.blue}${formatBytes(file.brotliSize)}${colors.reset}`
      );
    });
    
    console.log('-'.repeat(80));
    console.log(
      `${colors.cyan}Total:${' '.repeat(30)}${colors.yellow}${formatBytes(totalSize)}${colors.reset}` +
      `${' '.repeat(10 - formatBytes(totalSize).length)}${colors.green}${formatBytes(totalGzipSize)}${colors.reset}` +
      `${' '.repeat(10 - formatBytes(totalGzipSize).length)}${colors.blue}${formatBytes(totalBrotliSize)}${colors.reset}`
    );
    console.log('='.repeat(80));
    
    // Provide a summary and improvement suggestions
    console.log(`\n${colors.magenta}Summary:${colors.reset}`);
    console.log(`Total bundle size: ${colors.yellow}${formatBytes(totalSize)}${colors.reset}`);
    console.log(`Gzipped size: ${colors.green}${formatBytes(totalGzipSize)}${colors.reset} (${Math.round(totalGzipSize / totalSize * 100)}% of original)`);
    console.log(`Brotli size: ${colors.blue}${formatBytes(totalBrotliSize)}${colors.reset} (${Math.round(totalBrotliSize / totalSize * 100)}% of original)`);
    
    if (totalSize > 200 * 1024) {
      console.log(`\n${colors.yellow}⚠️ Your total bundle size is still quite large. Consider:${colors.reset}`);
      console.log(`- Removing or code-splitting more dependencies`);
      console.log(`- Using dynamic imports for non-critical components`);
      console.log(`- Further optimizing images and other assets`);
    } else {
      console.log(`\n${colors.green}✓ Your bundle size looks good!${colors.reset}`);
    }
    
    // List largest dependencies that might need attention
    const largeFiles = files.filter(file => file.size > 50 * 1024);
    if (largeFiles.length > 0) {
      console.log(`\n${colors.yellow}Largest bundles that may need attention:${colors.reset}`);
      largeFiles.forEach(file => {
        console.log(`- ${file.name} (${formatBytes(file.size)})`);
      });
    }
    
  } catch (err) {
    console.error(`${colors.red}Error measuring bundles:${colors.reset}`, err);
  }
}

// Run the measurement
measureBundles(); 
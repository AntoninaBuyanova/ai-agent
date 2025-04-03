#!/usr/bin/env node
/**
 * This script finds and replaces development versions of React dependencies
 * with their production counterparts to reduce bundle size.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const nodeModulesDir = path.join(rootDir, 'node_modules');

// Define development files to check and their production replacements
const replacements = [
  {
    // React DOM development version
    dev: 'react-dom/cjs/react-dom.development.js',
    prod: 'react-dom/cjs/react-dom.production.min.js'
  },
  {
    // React DOM client development version
    dev: 'react-dom/cjs/react-dom-client.development.js',
    prod: 'react-dom/cjs/react-dom-client.production.min.js'
  },
  {
    // Scheduler development version
    dev: 'scheduler/cjs/scheduler.development.js',
    prod: 'scheduler/cjs/scheduler.production.min.js'
  },
  {
    // React development version
    dev: 'react/cjs/react.development.js',
    prod: 'react/cjs/react.production.min.js'
  },
  {
    // React JSX Runtime development version
    dev: 'react/cjs/react-jsx-runtime.development.js',
    prod: 'react/cjs/react-jsx-runtime.production.min.js'
  },
  {
    // React JSX dev runtime
    dev: 'react/cjs/react-jsx-dev-runtime.development.js',
    prod: 'react/cjs/react-jsx-runtime.production.min.js'
  },
  {
    // React DOM server
    dev: 'react-dom/cjs/react-dom-server.development.js',
    prod: 'react-dom/cjs/react-dom-server.production.min.js'
  },
  {
    // React DOM server browser
    dev: 'react-dom/cjs/react-dom-server.browser.development.js',
    prod: 'react-dom/cjs/react-dom-server.browser.production.min.js'
  },
  {
    // React DOM server node
    dev: 'react-dom/cjs/react-dom-server.node.development.js',
    prod: 'react-dom/cjs/react-dom-server.node.production.min.js'
  },
  {
    // React Refresh Runtime (should be excluded completely in prod)
    dev: 'react-refresh/runtime.js',
    prod: null, // Will be handled specially
    action: 'disable' // Special action to disable the module
  }
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to create a backup of the original file
function createBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  if (!fileExists(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Created backup: ${backupPath}`);
  }
}

// Function to restore a file from backup
function restoreFromBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  if (fileExists(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`Restored from backup: ${filePath}`);
  }
}

// Main function to replace development files with production versions
function replaceDevelopmentFiles() {
  console.log('Checking for development dependencies...');
  
  for (const { dev, prod, action } of replacements) {
    const devPath = path.join(nodeModulesDir, dev);
    
    // Handle special action cases
    if (action === 'disable' && fileExists(devPath)) {
      // Create a backup of the file
      createBackup(devPath);
      
      try {
        // Replace the file with a disabled version
        const disabledContent = `
/* DISABLED BY BUILD SCRIPT: This module should not run in production */
export default null;
export const __esModule = true;
`;
        fs.writeFileSync(devPath, disabledContent, 'utf8');
        console.log(`Disabled ${dev} for production`);
        continue;
      } catch (err) {
        console.error(`Error disabling ${dev}:`, err);
        restoreFromBackup(devPath);
        continue;
      }
    }
    
    // Skip if we don't have a production replacement
    if (!prod) continue;
    
    const prodPath = path.join(nodeModulesDir, prod);
    
    if (fileExists(devPath) && fileExists(prodPath)) {
      // Create a backup of the development file
      createBackup(devPath);
      
      // Copy the production file over the development file
      try {
        // Read prod file
        const prodContent = fs.readFileSync(prodPath, 'utf8');
        
        // Add a comment to indicate this is a modified file
        const modifiedContent = `/* MODIFIED BY BUILD SCRIPT: Original development build replaced with production build */\n${prodContent}`;
        
        // Write to the dev file
        fs.writeFileSync(devPath, modifiedContent, 'utf8');
        console.log(`Replaced ${dev} with production version`);
      } catch (err) {
        console.error(`Error replacing ${dev}:`, err);
        // Try to restore from backup if there was an error
        restoreFromBackup(devPath);
      }
    } else {
      if (!fileExists(devPath)) {
        console.log(`Development file not found: ${dev}`);
      }
      if (!fileExists(prodPath)) {
        console.log(`Production file not found: ${prod}`);
      }
    }
  }
  
  // Also scan for any remaining development builds in the React directories
  scanForRemainingDevBuilds('react');
  scanForRemainingDevBuilds('react-dom');
  
  console.log('Finished checking for development dependencies.');
}

// Function to scan for any remaining development builds
function scanForRemainingDevBuilds(packageName) {
  const packageDir = path.join(nodeModulesDir, packageName);
  if (!fs.existsSync(packageDir)) return;
  
  try {
    // Look for any .development.js files recursively
    const { execSync } = require('child_process');
    const result = execSync(`find "${packageDir}" -name "*.development.js"`, { encoding: 'utf8' });
    
    if (result.trim()) {
      console.log(`Found additional development files in ${packageName}:`);
      console.log(result);
      
      // Attempt to find corresponding production files
      for (const devFile of result.trim().split('\n')) {
        const prodFile = devFile.replace('.development.js', '.production.min.js');
        if (fs.existsSync(prodFile)) {
          console.log(`Replacing ${devFile} with ${prodFile}`);
          
          // Create backup
          createBackup(devFile);
          
          // Replace with production version
          const prodContent = fs.readFileSync(prodFile, 'utf8');
          const modifiedContent = `/* AUTO-REPLACED BY BUILD SCRIPT */\n${prodContent}`;
          fs.writeFileSync(devFile, modifiedContent, 'utf8');
        }
      }
    }
  } catch (err) {
    console.log(`Note: Could not scan for additional development files in ${packageName}:`, err.message);
  }
}

// Call the main function
replaceDevelopmentFiles(); 
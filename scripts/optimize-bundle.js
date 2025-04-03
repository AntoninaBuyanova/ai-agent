#!/usr/bin/env node
/**
 * This script performs a complete optimization of the application bundle
 * by running all the optimization steps in sequence.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

// Helper function to run a command and log the output
function runCommand(command, description) {
  console.log(`\n${colors.magenta}${description}${colors.reset}`);
  console.log(`${colors.cyan}> ${command}${colors.reset}`);
  console.log('-'.repeat(80));
  
  try {
    execSync(command, { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production', VITE_ENV: 'production' }
    });
    console.log(`${colors.green}✓ Command completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Command failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main optimization function
async function optimizeBundle() {
  console.log(`\n${colors.cyan}Starting full bundle optimization process...${colors.reset}`);
  console.log('='.repeat(80));
  
  // Step 1: Clean up any development dependencies
  const cleanDevResult = runCommand('npm run build:clean-dev', 'Step 1: Replacing development React with production versions');
  if (!cleanDevResult) {
    console.error(`${colors.red}Failed to clean development dependencies. Continuing anyway...${colors.reset}`);
  }
  
  // Step 2: Run optimization pass
  const optimizeResult = runCommand('npm run optimize:js', 'Step 2: Running JavaScript optimization');
  if (!optimizeResult) {
    console.error(`${colors.red}Failed to optimize JavaScript. Aborting.${colors.reset}`);
    process.exit(1);
  }
  
  // Step 3: Build production version
  const buildResult = runCommand('npm run build:prod', 'Step 3: Building production bundle');
  if (!buildResult) {
    console.error(`${colors.red}Failed to build production bundle. Aborting.${colors.reset}`);
    process.exit(1);
  }
  
  // Step 4: Analyze bundle size
  const analyzeResult = runCommand('npm run measure:size', 'Step 4: Measuring final bundle size');
  if (!analyzeResult) {
    console.warn(`${colors.yellow}Failed to measure bundle size. Continuing...${colors.reset}`);
  }
  
  // Step 5: Check for development builds in the output
  console.log(`\n${colors.magenta}Step 5: Checking for development builds in output${colors.reset}`);
  console.log('-'.repeat(80));
  
  try {
    const distDir = path.join(rootDir, 'dist', 'public');
    const jsFiles = findFilesRecursive(distDir, '.js');
    
    let hasDevBuilds = false;
    const devBuildIndicators = [
      'development', 
      '__DEV__', 
      'ReactDOM.render',
      'checkPropTypes',
      'process.env.NODE_ENV !== "production"'
    ];
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const indicator of devBuildIndicators) {
        if (content.includes(indicator)) {
          console.log(`${colors.yellow}⚠️ Found potential development code in: ${path.relative(rootDir, file)}${colors.reset}`);
          console.log(`  Contains: ${indicator}`);
          hasDevBuilds = true;
          break;
        }
      }
    }
    
    if (!hasDevBuilds) {
      console.log(`${colors.green}✓ No development builds found in output${colors.reset}`);
    } else {
      console.warn(`${colors.yellow}⚠️ Found potential development code in the output. Bundle size may be larger than necessary.${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Error checking for development builds: ${error.message}${colors.reset}`);
  }
  
  console.log(`\n${colors.green}✨ Bundle optimization process completed! ✨${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Run ${colors.yellow}npm run analyze:deps${colors.reset} to visualize your bundle composition`);
  console.log(`2. Try ${colors.yellow}npm run start${colors.reset} to test your optimized application`);
}

// Helper function to find files recursively
function findFilesRecursive(dir, extension) {
  let results = [];
  
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recurse into subdirectory
      results = results.concat(findFilesRecursive(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Run the optimization
optimizeBundle().catch(err => {
  console.error(`${colors.red}Error during optimization:${colors.reset}`, err);
  process.exit(1);
}); 
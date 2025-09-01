#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Chrome Installation Diagnostic Tool for macOS\n');

// Check if Chrome is installed
function checkChromeInstallation() {
  console.log('1. Checking Chrome installation...');
  
  const possiblePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];
  
  let chromeFound = false;
  let chromePath = '';
  
  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      console.log(`✅ Chrome found at: ${chromePath}`);
      chromeFound = true;
      break;
    }
  }
  
  if (!chromeFound) {
    console.log('❌ Chrome not found in common locations');
    console.log('Please install Google Chrome from: https://www.google.com/chrome/');
    return false;
  }
  
  return true;
}

// Check Chrome version
function checkChromeVersion() {
  console.log('\n2. Checking Chrome version...');
  
  try {
    const version = execSync('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version', { encoding: 'utf8' });
    console.log(`✅ Chrome version: ${version.trim()}`);
    return true;
  } catch (error) {
    console.log('❌ Could not determine Chrome version');
    return false;
  }
}

// Check system resources
function checkSystemResources() {
  console.log('\n3. Checking system resources...');
  
  try {
    const memory = execSync('sysctl hw.memsize', { encoding: 'utf8' });
    const memSizeGB = parseInt(memory.split(':')[1].trim()) / (1024 * 1024 * 1024);
    console.log(`✅ Available memory: ${memSizeGB.toFixed(1)} GB`);
    
    if (memSizeGB < 4) {
      console.log('⚠️  Warning: Less than 4GB RAM available. This might cause issues.');
    }
    
    const cpuCores = execSync('sysctl hw.ncpu', { encoding: 'utf8' });
    const cores = cpuCores.split(':')[1].trim();
    console.log(`✅ CPU cores: ${cores}`);
    
    return true;
  } catch (error) {
    console.log('❌ Could not check system resources');
    return false;
  }
}

// Check if ports are available
function checkPorts() {
  console.log('\n4. Checking port availability...');
  
  try {
    const port3001 = execSync('lsof -i :3001', { encoding: 'utf8' });
    console.log('⚠️  Port 3001 is already in use:');
    console.log(port3001);
  } catch (error) {
    console.log('✅ Port 3001 is available');
  }
  
  return true;
}

// Generate .env file
function generateEnvFile() {
  console.log('\n5. Generating .env file...');
  
  const envContent = `# WhatsApp Automation Configuration
WA_AUTOMATION_PORT=3001

# Puppeteer Configuration for macOS
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome

# Debug mode (set to true for more verbose logging)
DEBUG=true
`;
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with recommended settings');
  } else {
    console.log('⚠️  .env file already exists');
  }
}

// Main diagnostic
function runDiagnostic() {
  const results = {
    chrome: checkChromeInstallation(),
    version: checkChromeVersion(),
    resources: checkSystemResources(),
    ports: checkPorts()
  };
  
  generateEnvFile();
  
  console.log('\n📋 Summary:');
  console.log(`Chrome installation: ${results.chrome ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`Chrome version: ${results.version ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`System resources: ${results.resources ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`Port availability: ${results.ports ? '✅ OK' : '❌ ISSUE'}`);
  
  if (results.chrome && results.version && results.resources) {
    console.log('\n🎉 All checks passed! You should be able to run the WhatsApp automation.');
    console.log('\nTo start the server:');
    console.log('  npm start');
  } else {
    console.log('\n⚠️  Some issues detected. Please address them before running the automation.');
  }
  
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure Google Chrome is installed and up to date');
  console.log('2. Try running Chrome manually to ensure it works');
  console.log('3. If issues persist, try running with DEBUG=true in .env');
  console.log('4. Check if any antivirus software is blocking Chrome');
}

runDiagnostic();

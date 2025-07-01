#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const staticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');

// Ensure standalone directory exists
if (!fs.existsSync(standaloneDir)) {
   console.error('Standalone directory not found. Did the build complete successfully?');
   process.exit(1);
}

// Copy static files to standalone/.next/static
const standaloneStaticDir = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticDir)) {
   fs.cpSync(staticDir, standaloneStaticDir, { recursive: true });
   console.log('Copied static files to standalone');
}

// Copy public files to standalone/public
const standalonePublicDir = path.join(standaloneDir, 'public');
if (fs.existsSync(publicDir)) {
   fs.cpSync(publicDir, standalonePublicDir, { recursive: true });
   console.log('Copied public files to standalone');
}

console.log('Package preparation complete!');

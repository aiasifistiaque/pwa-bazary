#!/bin/bash

# Post-build script to ensure PWA files are in dist folder

echo "📦 Copying PWA files to dist folder..."

# Copy manifest
cp public/manifest.json dist/manifest.json

# Copy service worker
cp public/sw.js dist/sw.js

# Copy offline page
cp public/offline.html dist/offline.html

# Copy icons
cp public/icon-192.png dist/icon-192.png
cp public/icon-512.png dist/icon-512.png
cp public/apple-touch-icon.png dist/apple-touch-icon.png

echo "✅ PWA files copied successfully!"

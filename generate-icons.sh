#!/bin/bash

# Script to generate PWA icons from the source icon
# This creates the required icon sizes for proper PWA installation

echo "Generating PWA icons..."

# Check if ImageMagick is installed (for converting)
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to generate icons..."
    
    # Generate 192x192 icon
    convert assets/images/icon.png -resize 192x192 public/icon-192.png
    
    # Generate 512x512 icon
    convert assets/images/icon.png -resize 512x512 public/icon-512.png
    
    echo "✅ Icons generated successfully!"
else
    echo "⚠️  ImageMagick not found. Copying original icon..."
    
    # Fallback: just copy the icon
    cp assets/images/icon.png public/icon-192.png
    cp assets/images/icon.png public/icon-512.png
    
    echo "✅ Icons copied (consider installing ImageMagick for proper resizing)"
fi

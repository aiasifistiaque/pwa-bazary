#!/bin/bash

# Inject PWA meta tags into the generated index.html

echo "🔧 Injecting PWA meta tags into index.html..."

META_TAGS='    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Bazarey">
    <meta name="theme-color" content="#4CAF50">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">'

# Use perl for cross-platform in-place editing
perl -i -pe "s|</head>|$META_TAGS\n</head>|" dist/index.html

echo "✅ PWA meta tags injected!"

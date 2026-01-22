# PWA Deployment Guide

This Expo app has been configured as a Progressive Web App (PWA) for mobile-only usage, deployable to Vercel.

## 🚀 Quick Start

### Local Development

```bash
# Start development server
npm start

# Run on web
npm run web

# Build for production
npm run build:web

# Preview production build
npm run preview
```

## 📱 PWA Features

- ✅ **Mobile-Only Access**: Desktop users will see a message to access from mobile
- ✅ **Installable**: Can be installed as a native app on mobile devices
- ✅ **Offline Support**: Service worker caches assets for offline use
- ✅ **App-like Experience**: Fullscreen standalone mode
- ✅ **Optimized Performance**: Fast loading and smooth animations

## 🌐 Deploy to Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Build the app**:

```bash
npm run build:web
```

3. **Deploy**:

```bash
vercel
```

4. **Deploy to production**:

```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. **Push to GitHub**:

```bash
git add .
git commit -m "Configure PWA for Vercel"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables** (if needed):
   - Add any API keys or environment variables in Vercel dashboard
   - Settings → Environment Variables

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Option 3: GitHub Actions Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:web
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📋 Configuration Files

### `vercel.json`

- Configures build command and output directory
- Sets up routing for SPA
- Adds security headers
- Configures service worker headers

### `public/manifest.json`

- PWA manifest with app metadata
- Icons, theme colors, display mode
- App shortcuts and categories

### `public/sw.js`

- Service worker for offline support
- Caches static assets
- Network-first strategy for API calls

### `app.json` (web section)

- Expo web configuration
- PWA settings and metadata

## 🔒 Mobile-Only Enforcement

The app includes a `MobileOnlyGuard` component that:

- Detects device type using user agent
- Checks screen size (≤768px)
- Shows a friendly message on desktop
- Optionally displays QR code for mobile access

## 🎨 Customization

### Update App Name/Theme

Edit `app.json`:

```json
{
	"expo": {
		"name": "Your App Name",
		"web": {
			"themeColor": "#your-color"
		}
	}
}
```

### Update PWA Manifest

Edit `public/manifest.json`:

```json
{
	"name": "Your App Name",
	"theme_color": "#your-color",
	"background_color": "#your-bg-color"
}
```

### Add App Icons

Replace `/assets/images/bazareylogo.png` with:

- 192x192px icon
- 512x512px icon
- Favicon

## 🧪 Testing

### Test PWA Locally

1. Build the app: `npm run build:web`
2. Serve locally: `npm run preview`
3. Open in browser: `http://localhost:3000`
4. Test on mobile device using local IP

### Test PWA Features

1. Open Chrome DevTools
2. Go to "Application" tab
3. Check:
   - ✅ Service Worker is registered
   - ✅ Manifest is valid
   - ✅ Icons are loading
   - ✅ Offline mode works

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Run audit
5. Aim for score > 90

## 🐛 Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Ensure HTTPS (required for service workers)
- Clear browser cache and reload

### App Not Installable

- Verify manifest.json is valid
- Check icons are accessible
- Ensure display: "standalone"
- Test on actual mobile device (not emulator)

### Desktop Block Not Working

- Check user agent detection
- Verify MobileOnlyGuard is imported
- Check browser console for errors

### Vercel Build Fails

- Check Node version (use 18+)
- Clear local cache: `rm -rf dist .expo`
- Rebuild: `npm run build:web`
- Check build logs in Vercel dashboard

## 📊 Performance Tips

1. **Image Optimization**: Use `expo-image` for optimized loading
2. **Code Splitting**: Already enabled via Expo Router
3. **Lazy Loading**: Import heavy components lazily
4. **Caching**: Service worker caches static assets
5. **CDN**: Vercel automatically serves from global CDN

## 🔐 Security Headers

The following headers are configured in `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📱 Installation Instructions for Users

### iOS (Safari)

1. Open the app in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)

1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install App" or "Add to Home Screen"
4. Tap "Install"

## 🎯 Next Steps

1. **Custom Domain**: Add custom domain in Vercel settings
2. **Analytics**: Add analytics (Google Analytics, Vercel Analytics)
3. **Error Tracking**: Add Sentry or similar
4. **Push Notifications**: Implement web push notifications
5. **App Store**: Consider submitting to app stores using TWA/PWA

## 📚 Resources

- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Vercel Docs](https://vercel.com/docs)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Expo documentation
3. Check Vercel build logs
4. Open an issue in the project repository

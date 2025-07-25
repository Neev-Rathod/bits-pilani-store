# BITS Pilani Store - Android App (TWA) Generation

This document guides you through converting your PWA to an Android App Bundle (AAB) for Google Play Store using Trusted Web Activities (TWA).

## 🚀 Quick Start

1. **Run the build script:**

   ```bash
   # On Windows
   generate-twa.bat

   # On Linux/Mac
   chmod +x generate-twa.sh
   ./generate-twa.sh
   ```

2. **Deploy your PWA** to a web server with HTTPS

3. **Generate TWA** using PWABuilder:
   ```bash
   pwa create https://yourdomain.com
   ```

## 📱 What is TWA?

Trusted Web Activities (TWA) allow you to package your PWA as a native Android app. Benefits:

- Full-screen experience without browser UI
- Can be distributed through Google Play Store
- Access to some Android APIs
- Better integration with Android system

## 📋 Prerequisites

- ✅ PWA with valid manifest.json
- ✅ Service worker
- ✅ HTTPS deployment
- ✅ Android Studio (for building AAB)
- ✅ Google Play Console account

## 🛠️ Detailed Steps

### 1. Build and Test PWA

```bash
npm run build
npm run build:pwa  # This starts a local server for testing
```

### 2. Deploy to HTTPS Server

Upload the `dist` folder contents to your web server. Ensure:

- Valid SSL certificate
- manifest.json accessible at `/manifest.json`
- Service worker loads properly

### 3. Generate TWA Project

```bash
pwa create https://yourdomain.com
```

Follow the prompts:

- **Package name**: `com.bitspilani.store`
- **App name**: `BITS Pilani Store`
- **Display mode**: `standalone`
- **Orientation**: `portrait`
- **Theme color**: `#3b82f6`
- **Background color**: `#ffffff`

### 4. Build Android App Bundle

#### Option A: Using Android Studio

1. Open the generated Android project
2. Go to Build → Generate Signed Bundle/APB
3. Choose Android App Bundle
4. Create/select keystore
5. Build release AAB

**📁 The AAB file location:**

```
your-android-project/app/build/outputs/bundle/release/app-release.aab
```

#### Option B: Using Command Line

```bash
cd your-android-project
./gradlew bundleRelease
```

**📁 The AAB file will be created at:**

```
your-android-project/app/build/outputs/bundle/release/app-release.aab
```

⚠️ **Important:** The AAB file is only created AFTER you:

1. Deploy your PWA to HTTPS
2. Run `pwa create https://yourdomain.com`
3. Build the generated Android project

## 📍 Where is the AAB file?

**The AAB file doesn't exist yet!** Here's the complete process:

### Current Status: ✅ PWA Ready

Your PWA is built and ready. Now you need to:

### Step-by-Step to Get AAB File:

1. **📤 Deploy PWA to HTTPS server** (REQUIRED FIRST)

   ```bash
   # Upload your dist/ folder to your web server
   # Example: https://yourdomain.com
   ```

2. **🔧 Generate Android project with PWABuilder**

   ```bash
   pwa create https://yourdomain.com
   ```

   This creates an Android project folder (e.g., `bitspilani-store-android/`)

3. **🏗️ Build AAB file**

   - Open the generated Android project in Android Studio
   - OR use command line in the Android project folder:

   ```bash
   ./gradlew bundleRelease
   ```

4. **📁 Find your AAB file here:**
   ```
   bitspilani-store-android/app/build/outputs/bundle/release/app-release.aab
   ```

### 🚨 Why no AAB yet?

- PWABuilder needs your deployed PWA URL to generate the Android project
- The Android project must be built to create the AAB file
- You cannot skip the deployment step

### 🎯 Quick Action Items:

1. Deploy `dist/` folder to your HTTPS domain
2. Run `pwa create https://yourdomain.com`
3. Build the Android project
4. Get `app-release.aab` file
5. Upload to Google Play Console

### 5. Upload to Google Play Store

1. Create app in Google Play Console
2. Upload AAB file
3. Complete app listing with:
   - App description
   - Screenshots
   - Feature graphic
   - Privacy policy
4. Submit for review

## 🔧 Troubleshooting

### PWA Requirements Not Met

- Ensure manifest.json is valid
- Check service worker registration
- Verify HTTPS deployment
- Test "Add to Home Screen" functionality

### TWA Generation Fails

- Verify PWA URL is accessible
- Check manifest.json format
- Ensure all required icons are present

### Play Store Upload Issues

- Use release-signed AAB
- Complete all required store listing fields
- Provide privacy policy
- Include proper app descriptions and screenshots

## 📦 Generated Files

After running the build script, you'll have:

- `dist/` - Built PWA files
- `manifest.webmanifest` - PWA manifest
- `sw.js` - Service worker
- Various workbox files for caching

## 🔗 Useful Resources

- [PWABuilder](https://www.pwabuilder.com/)
- [Google Play Console](https://play.google.com/console/)
- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

## 📝 Notes

- Domain verification is required for TWA
- Your PWA must meet Play Store policies
- Consider app signing key management for production
- Test thoroughly on different Android devices

## 🆘 Support

If you encounter issues:

1. Check PWA compatibility with Lighthouse
2. Verify manifest.json with Chrome DevTools
3. Test service worker functionality
4. Review PWABuilder documentation
5. Check Google Play Console help

Good luck with your Android app! 🎉

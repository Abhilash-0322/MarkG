# 🚀 GitHub Pages Deployment & Camera Fix

## ✅ Your Site is Deployed!

If you're reading this on GitHub Pages, your deployment worked! But the camera might need permissions.

## 🎥 Camera Not Working on GitHub Pages?

GitHub Pages uses HTTPS (good!), but you still need to grant camera permissions.

### **Quick Fix** (Works 99% of the time)

1. **Look at your browser's address bar** (should show `https://yourusername.github.io/...`)
2. **Click the 🔒 padlock icon** on the left side
3. **Find "Camera"** in the dropdown menu
4. **Select "Allow"** (not "Ask" or "Block")
5. **Refresh the page** (F5)
6. **Click "START CAMERA"** button

That's it! The camera should work now.

---

## 🔍 Still Not Working?

### Check Browser Permissions

#### Chrome / Edge:
1. Go to: `chrome://settings/content/camera` (or `edge://settings/content/camera`)
2. Look under **"Allowed to use your camera"**
3. Make sure your GitHub Pages URL is listed
4. If not, click **"Add"** and paste your full URL: `https://yourusername.github.io/repository-name`

#### Firefox:
1. Go to: `about:preferences#privacy`
2. Scroll to **"Permissions"** → **"Camera"**
3. Click **"Settings"**
4. Find your site and set to **"Allow"**

#### Safari:
1. Go to **Safari** → **Preferences** → **Websites** → **Camera**
2. Find your GitHub Pages site
3. Set to **"Allow"**

---

## 🧪 Test Your Camera

Before trying the app, test if your camera works:

### Windows:
- Open **Camera app** (built-in)

### Mac:
- Open **Photo Booth**

### Web Test:
- Go to: https://webcamtests.com/
- Click "Test my cam"

If camera doesn't work there, it's a hardware/system issue, not the app.

---

## 🔧 Common Issues & Solutions

### Issue 1: "Camera Blocked" Error
**Cause:** You clicked "Block" when browser asked for permission  
**Fix:** Clear site permissions and reload:
1. Click padlock icon → Site settings
2. Reset camera permission
3. Refresh page

### Issue 2: "No Camera Found"
**Cause:** Camera not connected or disabled  
**Fix:** 
- Check if camera is physically connected
- Try different USB port (for external cameras)
- Check Device Manager (Windows) or System Preferences (Mac)
- Restart computer

### Issue 3: "Camera Already in Use"
**Cause:** Another app is using your camera  
**Fix:** Close these apps:
- Zoom
- Microsoft Teams
- Skype
- Discord
- OBS Studio
- Any other video apps

Then refresh the page.

### Issue 4: Camera Shows Black Screen
**Cause:** Permission granted but camera not initializing  
**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private window
4. Try different browser

---

## 📱 Mobile Devices

### iOS (iPhone/iPad):
1. Go to **Settings** → **Safari** → **Camera**
2. Set to **"Allow"**
3. Open Safari (not Chrome!)
4. Visit your GitHub Pages site
5. Allow camera when prompted

### Android:
1. Open **Chrome**
2. Visit your site
3. When prompted, tap **"Allow"**
4. If blocked:
   - Tap the **lock icon** in address bar
   - Tap **"Permissions"**
   - Enable **"Camera"**

---

## 🎮 No Camera? Use Keyboard!

The app works perfectly without a camera:

### Keyboard Controls:
- `1` - Infinity (無下限)
- `2` - Cursed Blue (蒼)
- `3` - Cursed Red (赫)  
- `4` - Hollow Purple (茈)
- `5` - Domain Expansion (無量空処)
- `B` - Toggle Blindfold
- `A` - Auto-Cast Mode (automatic techniques!)
- `R` - Random Technique

### Mouse Controls:
- **Click technique cards** on the left side
- **Click control buttons** at the bottom
- **Click "HELP"** button for instant guide

---

## 🔐 Privacy & Security

### What the app accesses:
- ✅ Your camera (only when you click "START CAMERA")
- ✅ Hand tracking (processed locally in browser)
- ❌ No data sent to servers
- ❌ No recording or storage
- ❌ No personal information collected

### When camera is active:
- Red light on camera = camera is on
- Everything is processed in your browser
- Nothing is uploaded or saved
- Close tab = camera stops automatically

---

## 🐛 Debugging

Open browser console to see diagnostic info:

1. Press **F12** (or right-click → Inspect)
2. Click **Console** tab
3. Look for errors (red text)
4. Common error messages:

```
NotAllowedError: Permission denied
→ Fix: Allow camera permissions

NotFoundError: No camera detected  
→ Fix: Connect a camera

NotReadableError: Camera in use
→ Fix: Close other apps using camera

TypeError: navigator.mediaDevices is undefined
→ Fix: Use HTTPS or modern browser
```

---

## 🌐 Browser Compatibility

### ✅ Fully Supported:
- Chrome 53+ (recommended)
- Edge 79+
- Firefox 36+
- Safari 11+
- Opera 40+

### ⚠️ Limited Support:
- Internet Explorer (not supported)
- Older mobile browsers

### Best Experience:
- **Chrome** or **Edge** on desktop
- **Safari** on iOS
- **Chrome** on Android

---

## 📊 GitHub Pages Specific Notes

### Why HTTPS Matters:
- GitHub Pages forces HTTPS (good!)
- Camera API requires HTTPS or localhost
- HTTP sites can't access camera (security)

### Your Site URL Format:
```
https://username.github.io/repository-name/
```

Make sure you're using this exact URL (with `https://`).

### Custom Domain?
If you're using a custom domain (e.g., `www.example.com`):
- Make sure it has HTTPS enabled
- Check your DNS settings
- Camera permissions work the same way

---

## ✨ Tips for Best Experience

1. **Good Lighting** - Camera works best in well-lit areas
2. **Clear Background** - Less clutter = better hand detection
3. **Hands Visible** - Keep hands in camera frame
4. **Not Too Fast** - Give gestures time to register
5. **Try Auto-Cast** - Press 'A' for automatic demo mode

---

## 🆘 Still Need Help?

1. **Click the purple "HELP" button** in the app
2. **Check browser console** (F12) for specific errors
3. **Try a different browser** 
4. **Use keyboard controls** (no camera needed!)

---

## 🎉 Enjoy the App!

Remember: **The app is fully functional without a camera!** The motion capture is a cool extra feature, but keyboard and mouse controls work great too.

Press `A` for Auto-Cast Mode and watch Gojo perform techniques automatically! 🌀

---

*Last Updated: February 6, 2026*  
*Works on GitHub Pages with proper camera permissions*

# 📷 Camera Access Fix for Chrome

## The Problem
Chrome blocks camera access on localhost by default for security reasons.

## ✅ Solution 1: Quick Fix (Address Bar)

1. **Look at your browser's address bar** where it says `http://localhost:8080`
2. **Click the 🔒 lock icon** or **🎥 camera icon** on the left side of the address bar
3. **Find "Camera"** in the dropdown menu
4. **Change it to "Allow"**
5. **Refresh the page** (press F5 or click refresh)
6. **Click "START CAMERA"** button again

This should work immediately!

---

## ✅ Solution 2: Chrome Settings (Permanent)

If the above doesn't work, add localhost to Chrome's allowed sites:

### Step-by-Step:

1. **Copy this URL:**
   ```
   chrome://settings/content/camera
   ```

2. **Paste it in a new Chrome tab** and press Enter

3. **Scroll down to "Allowed to use your camera"**

4. **Click the "Add" button**

5. **Type this URL:**
   ```
   http://localhost:8080
   ```

6. **Click "Add"**

7. **Go back to the app and refresh** (F5)

8. **Click "START CAMERA"** - it should work now!

---

## ✅ Solution 3: Site-Specific Settings

1. **Copy this URL:**
   ```
   chrome://settings/content/siteDetails?site=http%3A%2F%2Flocalhost%3A8080
   ```

2. **Paste in new tab** and press Enter

3. **Find "Camera" in the permissions list**

4. **Set it to "Allow"**

5. **Refresh the app page**

---

## 🔍 Still Not Working? Troubleshooting

### Check if your camera is working:
1. Open **Windows Camera app** (Windows) or **Photo Booth** (Mac)
2. If camera doesn't work there, it's a hardware/driver issue

### Close other apps using camera:
- Zoom
- Microsoft Teams
- Skype
- Discord
- OBS Studio
- Any other video apps

### Try a different browser:
- **Firefox** - Usually more permissive with localhost
- **Edge** - Similar to Chrome but different policies
- **Brave** - Privacy-focused but supports camera

### Reset Chrome:
1. Close all Chrome windows
2. Reopen Chrome
3. Try the app again

---

## 🎮 Don't Have a Camera? No Problem!

The app works perfectly without a camera! You can:

- **Click technique cards** on the left side of the screen
- **Use keyboard shortcuts:**
  - `1` - Infinity
  - `2` - Cursed Blue
  - `3` - Cursed Red
  - `4` - Hollow Purple
  - `5` - Domain Expansion
  - `B` - Toggle Blindfold
  - `A` - Auto-Cast Mode
  - `R` - Random Technique

---

## 🆘 Need More Help?

Click the **purple "HELP" button** in the app for instant guidance!

---

## 📝 Technical Details

The app uses:
- **MediaPipe Hands** for hand tracking
- **WebRTC getUserMedia API** for camera access
- **localhost:8080** as the server address

Chrome requires explicit permission for camera access on non-HTTPS sites (except localhost, but it still prompts).

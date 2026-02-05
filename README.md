# 🌀 Gojo Satoru - Motion Capture Technique Activation

An interactive web app featuring Gojo Satoru from Jujutsu Kaisen with real-time motion capture and stunning visual effects!

## 🎮 Features

### Motion Capture System
- **Real-time hand tracking** using MediaPipe Hands
- **5 Gesture-activated techniques:**
  - 🙌 **Both hands up** → Infinity (無下限)
  - 👈 **Left hand forward** → Cursed Blue (蒼)
  - 👉 **Right hand forward** → Cursed Red (赫)
  - 🙏 **Hands together** → Hollow Purple (茈)
  - 🤲 **Hands wide apart** → Domain Expansion (無量空処)

### Visual Effects
- **Three.js** - 3D Gojo character with floating infinity orbs
- **GSAP & Anime.js** - Smooth technique animations
- **Particle systems** - Energy effects for each technique
- **Screen shake** - Impact feedback
- **Slow motion** - Epic moments for Purple & Domain

### New Cool Features! ✨
- **🎯 Combo System** - Chain techniques within 3 seconds for combo multipliers
- **⚡ Auto-Cast Mode** - Automatically performs random techniques (Press 'A')
- **🎲 Random Technique** - Trigger random technique (Press 'R')
- **📊 Technique History** - Tracks your last 10 techniques
- **💫 Enhanced Visual Feedback** - Improved screen shake and slow-mo effects
- **⚡ Energy Management** - Auto-regenerating cursed energy meter

## 🎹 Controls

### Keyboard Shortcuts
- `1` - Activate Infinity
- `2` - Activate Cursed Blue
- `3` - Activate Cursed Red
- `4` - Activate Hollow Purple
- `5` - Activate Domain Expansion
- `B` - Toggle Blindfold (reveal Six Eyes)
- `A` - Toggle Auto-Cast Mode
- `R` - Random Technique

### Mouse Controls
- Click technique cards on the left
- Click control buttons at the bottom

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   ```
   http://localhost:8080
   ```

3. **Enable Camera:**
   - Click "START CAMERA" button
   - **Allow camera permissions** when browser asks
   - If Chrome blocks it, click the **🔒 lock icon** in the address bar
   - Change Camera to "Allow"
   - Refresh page (F5)
   - **OR** click the purple "HELP" button for detailed instructions

   **⚠️ Camera blocked?** See [CAMERA_FIX.md](CAMERA_FIX.md) for detailed solutions!

4. **Start using techniques!**
   - Perform gestures or use keyboard shortcuts (1-5)

## 🔧 Camera Fixes Applied

- ✅ Improved MediaPipe initialization with error handling
- ✅ Alternative frame processing using requestAnimationFrame
- ✅ Fallback rendering for landmarks if MediaPipe drawing utils fail
- ✅ Better error messages and status indicators
- ✅ Reduced detection confidence for better gesture recognition

## 🎨 Tech Stack

- **Three.js** - 3D graphics
- **MediaPipe Hands** - Hand tracking
- **GSAP** - Animation library
- **Anime.js** - Advanced animations
- **Vanilla JavaScript** - No frameworks needed!

## 🌟 Tips

- For best results, use in a well-lit environment
- Keep your hands clearly visible to the camera
- Try the combo system - perform multiple techniques in quick succession!
- Use Auto-Cast mode for a demo/showcase
- Remove Gojo's blindfold to see the Six Eyes glow effect

## 📝 Notes

- Camera requires HTTPS or localhost to function
- Works best on Chrome/Edge (WebRTC support)
- Mobile support available (may need landscape orientation)

---

**Created with cursed energy and code** ⚡ 
*Jujutsu Kaisen © Gege Akutami*

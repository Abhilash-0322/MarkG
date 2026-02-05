// =====================================================
// GOJO SATORU - MOTION CAPTURE TECHNIQUE ACTIVATION
// =====================================================

// Global State
const state = {
    scene: null,
    camera: null,
    renderer: null,
    gojoModel: null,
    particles: [],
    infinityActive: false,
    blindfoldRemoved: false,
    currentTechnique: null,
    cameraStream: null,
    handsDetector: null,
    animationMixers: [],
    clock: null,
    cursedEnergy: 100,
    isProcessingGesture: false,
    comboCount: 0,
    comboTimer: null,
    techniqueHistory: [],
    autoCastMode: false,
    lastGestureTime: 0
};

// Technique Definitions
const TECHNIQUES = {
    infinity: {
        name: 'INFINITY',
        kanji: '無下限',
        color: 0x00ffff,
        duration: 3000
    },
    blue: {
        name: 'CURSED TECHNIQUE: BLUE',
        kanji: '術式順転「蒼」',
        color: 0x0066ff,
        duration: 2000
    },
    red: {
        name: 'CURSED TECHNIQUE REVERSAL: RED',
        kanji: '術式反転「赫」',
        color: 0xff3366,
        duration: 2000
    },
    purple: {
        name: 'HOLLOW PURPLE',
        kanji: '虚式「茈」',
        color: 0x9c27b0,
        duration: 3000
    },
    domain: {
        name: 'DOMAIN EXPANSION',
        kanji: '無量空処',
        color: 0xffffff,
        duration: 5000
    }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function screenShake(intensity = 10, duration = 300) {
    const container = document.getElementById('app-container');
    let startTime = Date.now();
    
    function shake() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const progress = 1 - (elapsed / duration);
            const x = (Math.random() - 0.5) * intensity * progress;
            const y = (Math.random() - 0.5) * intensity * progress;
            container.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            container.style.transform = '';
        }
    }
    shake();
}

function slowMotion(duration = 1000) {
    const container = document.getElementById('app-container');
    container.style.transition = 'filter 0.3s';
    container.style.filter = 'brightness(1.5) contrast(1.2)';
    
    setTimeout(() => {
        container.style.filter = '';
    }, duration);
}

function updateComboCounter() {
    let counterEl = document.getElementById('combo-counter');
    if (!counterEl && state.comboCount > 1) {
        counterEl = document.createElement('div');
        counterEl.id = 'combo-counter';
        counterEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            color: #00ffff;
            text-shadow: 0 0 30px #00ffff;
            z-index: 150;
            animation: comboPopIn 0.3s ease-out;
        `;
        document.body.appendChild(counterEl);
    }
    
    if (counterEl) {
        counterEl.textContent = `${state.comboCount}x COMBO!`;
        anime({
            targets: counterEl,
            scale: [1.5, 1],
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
        
        if (state.comboCount <= 1) {
            setTimeout(() => counterEl.remove(), 500);
        }
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
});

function initLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        initApp();
        
        // Show quick start guide after loading
        setTimeout(() => {
            showQuickStartGuide();
        }, 500);
    }, 2500);
}

function showQuickStartGuide() {
    const guide = document.createElement('div');
    guide.id = 'quick-start-guide';
    guide.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
        padding: 40px;
        border-radius: 20px;
        border: 2px solid #00d4ff;
        max-width: 500px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        box-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
        z-index: 9998;
        animation: slideIn 0.5s ease-out;
    `;
    
    guide.innerHTML = `
        <h2 style="color: #00d4ff; font-family: 'Orbitron', sans-serif; margin-bottom: 20px; text-align: center;">⚡ WELCOME SORCERER!</h2>
        <div style="line-height: 2; color: #ccc;">
            <p style="margin-bottom: 15px;"><strong style="color: #00d4ff;">🎮 Get Started:</strong></p>
            <p>• Press <strong>1-5</strong> to activate techniques</p>
            <p>• Press <strong>A</strong> for Auto-Cast Mode</p>
            <p>• Press <strong>R</strong> for Random Technique</p>
            <p>• Press <strong>B</strong> to remove blindfold</p>
            <p style="margin-top: 20px; margin-bottom: 15px;"><strong style="color: #00d4ff;">📷 Camera Control:</strong></p>
            <p>• Click <strong>"START CAMERA"</strong> for motion capture</p>
            <p>• Allow camera when browser asks</p>
            <p>• If blocked, click <strong>"HELP"</strong> button</p>
        </div>
        <button id="start-guide-btn" style="
            width: 100%;
            margin-top: 30px;
            padding: 15px;
            background: #00d4ff;
            border: none;
            border-radius: 25px;
            color: #000;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s ease;
        ">LET'S GO! ⚡</button>
    `;
    
    document.body.appendChild(guide);
    
    document.getElementById('start-guide-btn').addEventListener('click', () => {
        guide.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => guide.remove(), 300);
    });
}

function initApp() {
    initThreeJS();
    initEventListeners();
    initParticleSystem();
    animate();
}

// =====================================================
// THREE.JS SETUP
// =====================================================

function initThreeJS() {
    const container = document.getElementById('three-container');
    const canvas = document.getElementById('gojo-canvas');

    // Scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x0a0a0a);
    state.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    // Camera
    state.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    state.camera.position.set(0, 1.5, 5);

    // Renderer
    state.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.renderer.toneMappingExposure = 1;

    // Clock
    state.clock = new THREE.Clock();

    // Lighting
    setupLighting();

    // Create Gojo Character
    createGojoCharacter();

    // Create Environment
    createEnvironment();

    // Handle Resize
    window.addEventListener('resize', onWindowResize);
}

function setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    state.scene.add(ambientLight);

    // Main Directional Light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    state.scene.add(mainLight);

    // Cyan Rim Light (for Gojo's signature look)
    const cyanLight = new THREE.PointLight(0x00ffff, 1, 20);
    cyanLight.position.set(-3, 3, 2);
    state.scene.add(cyanLight);

    // Blue accent light
    const blueLight = new THREE.PointLight(0x0066ff, 0.8, 15);
    blueLight.position.set(3, 2, -2);
    state.scene.add(blueLight);

    // Purple accent light
    const purpleLight = new THREE.SpotLight(0x9c27b0, 0.5);
    purpleLight.position.set(0, 10, 0);
    purpleLight.angle = Math.PI / 4;
    state.scene.add(purpleLight);
}

function createGojoCharacter() {
    // Create a stylized Gojo character using Three.js primitives
    const gojoGroup = new THREE.Group();
    gojoGroup.name = 'gojo';

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.3,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    gojoGroup.add(body);

    // Coat/Uniform
    const coatGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.4, 8, 1, true);
    const coatMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.4,
        side: THREE.DoubleSide
    });
    const coat = new THREE.Mesh(coatGeometry, coatMaterial);
    coat.position.y = 0.7;
    gojoGroup.add(coat);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd5c8,
        roughness: 0.5
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    head.castShadow = true;
    gojoGroup.add(head);

    // Hair (White spiky hair)
    const hairGroup = new THREE.Group();
    hairGroup.name = 'hair';
    
    for (let i = 0; i < 20; i++) {
        const spikeGeometry = new THREE.ConeGeometry(0.05, 0.2, 4);
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            emissive: 0x111111
        });
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        
        const angle = (i / 20) * Math.PI * 2;
        const radius = 0.25;
        spike.position.set(
            Math.cos(angle) * radius,
            2.0 + Math.random() * 0.1,
            Math.sin(angle) * radius
        );
        spike.rotation.x = (Math.random() - 0.5) * 0.5;
        spike.rotation.z = (Math.random() - 0.5) * 0.5;
        hairGroup.add(spike);
    }
    gojoGroup.add(hairGroup);

    // Blindfold
    const blindfoldGroup = new THREE.Group();
    blindfoldGroup.name = 'blindfold';
    
    const blindfoldGeometry = new THREE.BoxGeometry(0.65, 0.1, 0.35);
    const blindfoldMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.2
    });
    const blindfold = new THREE.Mesh(blindfoldGeometry, blindfoldMaterial);
    blindfold.position.y = 1.82;
    blindfold.position.z = 0.15;
    blindfoldGroup.add(blindfold);
    gojoGroup.add(blindfoldGroup);

    // Six Eyes (hidden by default)
    const eyesGroup = new THREE.Group();
    eyesGroup.name = 'sixEyes';
    eyesGroup.visible = false;

    // Left Eye
    const leftEyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
    });
    const leftEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.82, 0.28);
    eyesGroup.add(leftEye);

    // Right Eye
    const rightEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.82, 0.28);
    eyesGroup.add(rightEye);

    gojoGroup.add(eyesGroup);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.5, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.4
    });

    // Left Arm
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.name = 'leftArm';
    leftArm.position.set(-0.5, 1.1, 0);
    leftArm.rotation.z = Math.PI / 6;
    gojoGroup.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.name = 'rightArm';
    rightArm.position.set(0.5, 1.1, 0);
    rightArm.rotation.z = -Math.PI / 6;
    gojoGroup.add(rightArm);

    // Hands
    const handGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const handMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd5c8,
        roughness: 0.5
    });

    // Left Hand
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.name = 'leftHand';
    leftHand.position.set(-0.65, 0.75, 0);
    gojoGroup.add(leftHand);

    // Right Hand
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.name = 'rightHand';
    rightHand.position.set(0.65, 0.75, 0);
    gojoGroup.add(rightHand);

    // Add energy aura (invisible by default)
    const auraGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.name = 'aura';
    aura.position.y = 1;
    gojoGroup.add(aura);

    // Position the whole character
    gojoGroup.position.y = 0;
    state.gojoModel = gojoGroup;
    state.scene.add(gojoGroup);

    // Create floating infinity orbs around Gojo
    createInfinityOrbs();
}

function createInfinityOrbs() {
    const orbsGroup = new THREE.Group();
    orbsGroup.name = 'infinityOrbs';

    for (let i = 0; i < 6; i++) {
        const orbGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const orbMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        
        const angle = (i / 6) * Math.PI * 2;
        orb.position.set(
            Math.cos(angle) * 1.5,
            1.5 + Math.sin(angle * 2) * 0.3,
            Math.sin(angle) * 1.5
        );
        orb.userData = { angle, speed: 0.5 + Math.random() * 0.5 };
        orbsGroup.add(orb);
    }

    state.gojoModel.add(orbsGroup);
}

function createEnvironment() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    state.scene.add(ground);

    // Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x00ffff, 0x111133);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    state.scene.add(gridHelper);

    // Background particles
    createBackgroundParticles();
}

function createBackgroundParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = Math.random() * 30;
        positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.05,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.name = 'backgroundParticles';
    state.scene.add(particles);
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function initEventListeners() {
    // Start Camera Button
    document.getElementById('start-camera').addEventListener('click', toggleCamera);

    // Toggle Blindfold Button
    document.getElementById('toggle-blindfold').addEventListener('click', toggleBlindfold);

    // Camera Help Button
    document.getElementById('camera-help').addEventListener('click', () => {
        showCameraHelpModal();
    });

    // Technique Cards
    document.querySelectorAll('.technique-card').forEach(card => {
        card.addEventListener('click', () => {
            const technique = card.dataset.technique;
            activateTechnique(technique, 'manual');
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case '1': activateTechnique('infinity', 'manual'); break;
            case '2': activateTechnique('blue', 'manual'); break;
            case '3': activateTechnique('red', 'manual'); break;
            case '4': activateTechnique('purple', 'manual'); break;
            case '5': activateTechnique('domain', 'manual'); break;
            case 'b': toggleBlindfold(); break;
            case 'a': toggleAutoCast(); break;
            case 'r': randomTechnique(); break;
        }
    });
}

function toggleAutoCast() {
    state.autoCastMode = !state.autoCastMode;
    const indicator = document.getElementById('auto-cast-indicator') || createAutoCastIndicator();
    indicator.style.display = state.autoCastMode ? 'block' : 'none';
    
    if (state.autoCastMode) {
        startAutoCast();
    }
}

function createAutoCastIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'auto-cast-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 140px;
        left: 40px;
        padding: 10px 20px;
        background: rgba(0, 212, 255, 0.2);
        border: 2px solid #00d4ff;
        border-radius: 10px;
        color: #00d4ff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 2px;
        display: none;
        z-index: 150;
        animation: pulse 1s ease-in-out infinite;
    `;
    indicator.textContent = '⚡ AUTO-CAST MODE';
    document.body.appendChild(indicator);
    return indicator;
}

function startAutoCast() {
    if (!state.autoCastMode) return;
    
    const techniques = ['infinity', 'blue', 'red', 'purple', 'domain'];
    const randomTech = techniques[Math.floor(Math.random() * techniques.length)];
    
    activateTechnique(randomTech, 'auto');
    
    const delay = 4000 + Math.random() * 3000;
    setTimeout(() => startAutoCast(), delay);
}

function randomTechnique() {
    const techniques = ['infinity', 'blue', 'red', 'purple', 'domain'];
    const randomTech = techniques[Math.floor(Math.random() * techniques.length)];
    activateTechnique(randomTech, 'manual');
}

// =====================================================
// CAMERA & MOTION DETECTION
// =====================================================

function showCameraHelpModal() {
    const helpText = `🎥 CAMERA SETUP GUIDE\n\n` +
        `METHOD 1 - Quick Fix (Recommended):\n` +
        `1. Look at the address bar (where it says localhost:8080)\n` +
        `2. Click the 🔒 lock icon or 🎥 camera icon\n` +
        `3. Find "Camera" and select "Allow"\n` +
        `4. Click "START CAMERA" button again\n\n` +
        `METHOD 2 - Chrome Settings:\n` +
        `1. Copy this: chrome://settings/content/camera\n` +
        `2. Paste it in a new tab and press Enter\n` +
        `3. Under "Allowed to use your camera"\n` +
        `4. Click "Add" and enter: http://localhost:8080\n` +
        `5. Refresh this page (F5)\n\n` +
        `METHOD 3 - Reset Permissions:\n` +
        `1. Go to: chrome://settings/content/siteDetails?site=http%3A%2F%2Flocalhost%3A8080\n` +
        `2. Find "Camera" permission\n` +
        `3. Set it to "Allow"\n` +
        `4. Refresh the page\n\n` +
        `STILL NOT WORKING?\n` +
        `• Make sure your camera is connected\n` +
        `• Close other apps using the camera (Zoom, Teams, etc.)\n` +
        `• Try a different browser (Firefox, Edge)\n` +
        `• Restart your browser\n\n` +
        `NO CAMERA? NO PROBLEM!\n` +
        `You can still enjoy the app!\n` +
        `• Click technique cards on the left\n` +
        `• Use keyboard shortcuts: 1-5\n` +
        `• Press 'A' for Auto-Cast Mode\n` +
        `• Press 'R' for Random Technique`;
    
    showCameraErrorModal(helpText);
}

async function toggleCamera() {
    const btn = document.getElementById('start-camera');
    const video = document.getElementById('camera-feed');

    if (state.cameraStream) {
        // Stop camera
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
        btn.querySelector('.btn-text').textContent = 'START CAMERA';
        btn.classList.remove('active');
        return;
    }

    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showCameraErrorModal('Your browser does not support camera access. Please use Chrome, Edge, or Firefox.');
        return;
    }

    try {
        btn.querySelector('.btn-text').textContent = 'REQUESTING...';
        btn.disabled = true;
        
        state.cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        video.srcObject = state.cameraStream;
        btn.querySelector('.btn-text').textContent = 'STOP CAMERA';
        btn.classList.add('active');
        btn.disabled = false;
        
        updateGestureIndicator('CAMERA ACTIVE');

        // Initialize MediaPipe Hands
        setTimeout(() => initHandTracking(), 500);
        
    } catch (error) {
        console.error('Camera access error:', error);
        btn.querySelector('.btn-text').textContent = 'START CAMERA';
        btn.disabled = false;
        
        let errorMessage = 'Camera access denied. ';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage += 'You blocked camera access.\n\n';
            errorMessage += '🔧 TO FIX IN CHROME:\n';
            errorMessage += '1. Click the 🔒 or 🎥 icon in the address bar\n';
            errorMessage += '2. Change Camera permission to "Allow"\n';
            errorMessage += '3. Refresh the page (F5)\n\n';
            errorMessage += 'OR:\n';
            errorMessage += '1. Go to chrome://settings/content/camera\n';
            errorMessage += '2. Add http://localhost:8080 to "Allowed to use your camera"\n';
            errorMessage += '3. Refresh the page';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage += 'Camera is already in use by another application. Close other apps using the camera and try again.';
        } else {
            errorMessage += error.message || 'Unknown error occurred.';
        }
        
        showCameraErrorModal(errorMessage);
        updateGestureIndicator('CAMERA ERROR');
    }
}

function showCameraErrorModal(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('camera-error-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'camera-error-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
            padding: 40px;
            border-radius: 20px;
            border: 2px solid #00d4ff;
            max-width: 600px;
            color: #fff;
            font-family: 'Rajdhani', sans-serif;
            box-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
        `;
        
        content.innerHTML = `
            <h2 style="color: #00d4ff; font-family: 'Orbitron', sans-serif; margin-bottom: 20px; font-size: 1.8rem;">⚠️ CAMERA ACCESS BLOCKED</h2>
            <pre id="error-message" style="white-space: pre-wrap; line-height: 1.8; color: #ccc; font-family: 'Rajdhani', sans-serif; font-size: 1rem;"></pre>
            <button id="close-modal-btn" style="
                margin-top: 30px;
                padding: 15px 40px;
                background: #00d4ff;
                border: none;
                border-radius: 25px;
                color: #000;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1rem;
                font-weight: 700;
                letter-spacing: 2px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">GOT IT</button>
            <div style="margin-top: 20px; padding: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 10px; border-left: 3px solid #00d4ff;">
                <strong style="color: #00d4ff;">💡 TIP:</strong> You can still use the app! Click technique cards or use keyboard shortcuts (1-5) to activate techniques without camera.
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    document.getElementById('error-message').textContent = message;
    modal.style.display = 'flex';
}

function initHandTracking() {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('pose-canvas');
    const ctx = canvas.getContext('2d');

    // Check if MediaPipe is loaded
    if (typeof Hands === 'undefined') {
        console.error('MediaPipe Hands not loaded');
        updateGestureIndicator('MEDIAPIPE ERROR');
        return;
    }

    try {
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                // Draw hand landmarks
                for (const landmarks of results.multiHandLandmarks) {
                    if (typeof drawConnectors !== 'undefined' && typeof HAND_CONNECTIONS !== 'undefined') {
                        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                            color: '#00ffff',
                            lineWidth: 2
                        });
                        drawLandmarks(ctx, landmarks, {
                            color: '#00ffff',
                            lineWidth: 1,
                            radius: 3
                        });
                    } else {
                        // Fallback: draw simple dots
                        ctx.fillStyle = '#00ffff';
                        landmarks.forEach(point => {
                            ctx.beginPath();
                            ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
                            ctx.fill();
                        });
                    }
                }

                // Detect gestures
                detectGesture(results);
            } else {
                updateGestureIndicator('DETECTING...');
            }
        });

        // Alternative: use requestAnimationFrame instead of Camera class
        let isProcessing = false;
        async function processFrame() {
            if (!isProcessing && video.readyState === video.HAVE_ENOUGH_DATA) {
                isProcessing = true;
                await hands.send({ image: video });
                isProcessing = false;
            }
            if (state.cameraStream) {
                requestAnimationFrame(processFrame);
            }
        }
        processFrame();

        state.handsDetector = hands;
        console.log('Hand tracking initialized successfully');
    } catch (error) {
        console.error('Error initializing hand tracking:', error);
        updateGestureIndicator('INIT ERROR');
    }
}

function detectGesture(results) {
    if (state.isProcessingGesture) return;

    const handCount = results.multiHandLandmarks.length;
    const handedness = results.multiHandedness;

    if (handCount === 2) {
        const leftHand = findHand(results, 'Left');
        const rightHand = findHand(results, 'Right');

        if (leftHand && rightHand) {
            // Check for hands together (Hollow Purple)
            const distance = calculateDistance(
                leftHand[9], // Middle finger MCP
                rightHand[9]
            );

            if (distance < 0.15) {
                updateGestureIndicator('HOLLOW PURPLE DETECTED!');
                triggerTechniqueFromGesture('purple');
                return;
            }

            // Check for both hands up (Infinity)
            const leftWrist = leftHand[0];
            const rightWrist = rightHand[0];
            
            if (leftWrist.y < 0.4 && rightWrist.y < 0.4) {
                updateGestureIndicator('INFINITY DETECTED!');
                triggerTechniqueFromGesture('infinity');
                return;
            }

            // Check for hands wide apart (Domain Expansion)
            const wristDistance = calculateDistance(leftWrist, rightWrist);
            if (wristDistance > 0.7 && leftWrist.y < 0.5 && rightWrist.y < 0.5) {
                updateGestureIndicator('DOMAIN EXPANSION DETECTED!');
                triggerTechniqueFromGesture('domain');
                return;
            }
        }
    } else if (handCount === 1) {
        const hand = results.multiHandLandmarks[0];
        const handType = handedness[0].label;
        const wrist = hand[0];
        const indexTip = hand[8];

        // Check if hand is pointing forward
        if (indexTip.z < wrist.z - 0.1) {
            if (handType === 'Left') {
                updateGestureIndicator('CURSED BLUE DETECTED!');
                triggerTechniqueFromGesture('blue');
            } else {
                updateGestureIndicator('CURSED RED DETECTED!');
                triggerTechniqueFromGesture('red');
            }
            return;
        }
    }

    updateGestureIndicator('READY FOR INPUT');
}

function findHand(results, type) {
    const index = results.multiHandedness.findIndex(h => h.label === type);
    return index !== -1 ? results.multiHandLandmarks[index] : null;
}

function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2)
    );
}

function updateGestureIndicator(text) {
    document.querySelector('.gesture-text').textContent = text;
}

function triggerTechniqueFromGesture(technique) {
    if (state.isProcessingGesture) return;
    state.isProcessingGesture = true;
    
    activateTechnique(technique, 'gesture');
    
    setTimeout(() => {
        state.isProcessingGesture = false;
    }, TECHNIQUES[technique].duration + 1000);
}

// =====================================================
// TECHNIQUE ANIMATIONS
// =====================================================

function activateTechnique(technique, source = 'manual') {
    if (state.currentTechnique === technique && source !== 'auto') return;
    if (state.cursedEnergy < 5) {
        updateGestureIndicator('INSUFFICIENT ENERGY!');
        return;
    }

    // Update combo system
    const now = Date.now();
    if (now - state.lastGestureTime < 3000 && source === 'gesture') {
        state.comboCount++;
        clearTimeout(state.comboTimer);
    } else if (source === 'gesture') {
        state.comboCount = 1;
    }
    state.lastGestureTime = now;

    // Reset combo after delay
    if (source === 'gesture') {
        state.comboTimer = setTimeout(() => {
            state.comboCount = 0;
            updateComboCounter();
        }, 3000);
        updateComboCounter();
    }

    // Track technique history
    state.techniqueHistory.push({
        technique,
        timestamp: now,
        source
    });
    if (state.techniqueHistory.length > 10) {
        state.techniqueHistory.shift();
    }

    // Update UI
    document.querySelectorAll('.technique-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.technique === technique) {
            card.classList.add('active');
        }
    });

    state.currentTechnique = technique;

    // Reduce cursed energy
    reduceCursedEnergy(technique);

    // Add screen shake for impact
    const shakeIntensity = {
        infinity: 5,
        blue: 10,
        red: 12,
        purple: 20,
        domain: 25
    };
    screenShake(shakeIntensity[technique], 400);

    // Execute technique animation
    switch (technique) {
        case 'infinity':
            executeInfinity();
            break;
        case 'blue':
            executeBlue();
            break;
        case 'red':
            executeRed();
            break;
        case 'purple':
            executePurple();
            break;
        case 'domain':
            executeDomain();
            break;
    }
}

function reduceCursedEnergy(technique) {
    const costs = {
        infinity: 5,
        blue: 15,
        red: 20,
        purple: 35,
        domain: 50
    };

    state.cursedEnergy = Math.max(0, state.cursedEnergy - costs[technique]);
    document.getElementById('energy-meter').style.width = `${state.cursedEnergy}%`;

    // Regenerate energy slowly
    setTimeout(() => {
        const regen = setInterval(() => {
            if (state.cursedEnergy < 100) {
                state.cursedEnergy = Math.min(100, state.cursedEnergy + 1);
                document.getElementById('energy-meter').style.width = `${state.cursedEnergy}%`;
            } else {
                clearInterval(regen);
            }
        }, 100);
    }, 2000);
}

// INFINITY TECHNIQUE
function executeInfinity() {
    showTechniqueOverlay('INFINITY', '無下限');
    
    // Activate aura
    const aura = state.gojoModel.getObjectByName('aura');
    gsap.to(aura.material, {
        opacity: 0.3,
        duration: 0.5
    });

    // Create infinity barrier effect in DOM
    const barrier = document.createElement('div');
    barrier.className = 'infinity-barrier';
    document.getElementById('particle-container').appendChild(barrier);

    // Animate character
    gsap.to(state.gojoModel.position, {
        y: 0.3,
        duration: 1,
        ease: 'power2.out'
    });

    // Create particle burst
    createInfinityParticles();

    // Animate orbs faster
    const orbs = state.gojoModel.getObjectByName('infinityOrbs');
    orbs.children.forEach(orb => {
        orb.userData.speed = 2;
    });

    // Reset after duration
    setTimeout(() => {
        gsap.to(aura.material, { opacity: 0, duration: 0.5 });
        gsap.to(state.gojoModel.position, { y: 0, duration: 0.5 });
        barrier.remove();
        orbs.children.forEach(orb => {
            orb.userData.speed = 0.5 + Math.random() * 0.5;
        });
        hideTechniqueOverlay();
        state.currentTechnique = null;
    }, TECHNIQUES.infinity.duration);
}

// CURSED BLUE TECHNIQUE
function executeBlue() {
    showTechniqueOverlay('CURSED TECHNIQUE: BLUE', '蒼');
    
    // Flash effect
    createScreenFlash('blue');

    // Move left arm forward
    const leftArm = state.gojoModel.getObjectByName('leftArm');
    const leftHand = state.gojoModel.getObjectByName('leftHand');

    gsap.to(leftArm.rotation, {
        x: -Math.PI / 2,
        z: 0,
        duration: 0.3
    });
    gsap.to(leftArm.position, {
        z: 0.3,
        duration: 0.3
    });
    gsap.to(leftHand.position, {
        z: 0.8,
        y: 1.3,
        x: -0.2,
        duration: 0.3
    });

    // Create blue sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.8
    });
    const blueSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    blueSphere.position.set(-0.2, 1.3, 1.5);
    state.scene.add(blueSphere);

    // Animate sphere
    gsap.to(blueSphere.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 0.5,
        delay: 0.3
    });
    gsap.to(blueSphere.position, {
        z: 10,
        duration: 1,
        delay: 0.5,
        ease: 'power2.in'
    });
    gsap.to(blueSphere.material, {
        opacity: 0,
        duration: 0.5,
        delay: 1
    });

    // Create particle trail
    createTechniqueParticles('blue', -0.2, 1.3, 1.5);

    // Reset
    setTimeout(() => {
        gsap.to(leftArm.rotation, { x: 0, z: Math.PI / 6, duration: 0.3 });
        gsap.to(leftArm.position, { z: 0, duration: 0.3 });
        gsap.to(leftHand.position, { z: 0, y: 0.75, x: -0.65, duration: 0.3 });
        state.scene.remove(blueSphere);
        hideTechniqueOverlay();
        state.currentTechnique = null;
    }, TECHNIQUES.blue.duration);
}

// CURSED RED TECHNIQUE
function executeRed() {
    showTechniqueOverlay('REVERSAL: RED', '赫');
    
    // Flash effect
    createScreenFlash('red');

    // Move right arm forward
    const rightArm = state.gojoModel.getObjectByName('rightArm');
    const rightHand = state.gojoModel.getObjectByName('rightHand');

    gsap.to(rightArm.rotation, {
        x: -Math.PI / 2,
        z: 0,
        duration: 0.3
    });
    gsap.to(rightArm.position, {
        z: 0.3,
        duration: 0.3
    });
    gsap.to(rightHand.position, {
        z: 0.8,
        y: 1.3,
        x: 0.2,
        duration: 0.3
    });

    // Create red sphere
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.8
    });
    const redSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    redSphere.position.set(0.2, 1.3, 1.5);
    state.scene.add(redSphere);

    // Create repulsion effect - expanding rings
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ringGeometry = new THREE.RingGeometry(0.5, 0.6, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xff3366,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(0.2, 1.3, 2);
            state.scene.add(ring);

            gsap.to(ring.scale, {
                x: 10,
                y: 10,
                duration: 0.8
            });
            gsap.to(ring.material, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => state.scene.remove(ring)
            });
        }, i * 200);
    }

    // Animate sphere
    gsap.to(redSphere.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.3,
        delay: 0.3
    });
    gsap.to(redSphere.position, {
        z: 15,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
    });
    gsap.to(redSphere.material, {
        opacity: 0,
        duration: 0.3,
        delay: 1
    });

    // Create particle trail
    createTechniqueParticles('red', 0.2, 1.3, 1.5);

    // Reset
    setTimeout(() => {
        gsap.to(rightArm.rotation, { x: 0, z: -Math.PI / 6, duration: 0.3 });
        gsap.to(rightArm.position, { z: 0, duration: 0.3 });
        gsap.to(rightHand.position, { z: 0, y: 0.75, x: 0.65, duration: 0.3 });
        state.scene.remove(redSphere);
        hideTechniqueOverlay();
        state.currentTechnique = null;
    }, TECHNIQUES.red.duration);
}

// HOLLOW PURPLE TECHNIQUE
function executePurple() {
    // Show overlay
    const purpleOverlay = document.getElementById('hollow-purple-overlay');
    purpleOverlay.classList.remove('hidden');

    // Slow motion effect
    slowMotion(1500);

    // Flash effect
    createScreenFlash('purple');

    // Both arms forward
    const leftArm = state.gojoModel.getObjectByName('leftArm');
    const rightArm = state.gojoModel.getObjectByName('rightArm');
    const leftHand = state.gojoModel.getObjectByName('leftHand');
    const rightHand = state.gojoModel.getObjectByName('rightHand');

    // Move arms together
    gsap.to(leftArm.rotation, { x: -Math.PI / 2, z: Math.PI / 8, duration: 0.3 });
    gsap.to(rightArm.rotation, { x: -Math.PI / 2, z: -Math.PI / 8, duration: 0.3 });
    gsap.to(leftHand.position, { z: 0.8, y: 1.3, x: -0.1, duration: 0.3 });
    gsap.to(rightHand.position, { z: 0.8, y: 1.3, x: 0.1, duration: 0.3 });

    // Create merging blue and red spheres
    const blueGeom = new THREE.SphereGeometry(0.2, 32, 32);
    const blueMat = new THREE.MeshBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.8 });
    const blueSphere = new THREE.Mesh(blueGeom, blueMat);
    blueSphere.position.set(-0.5, 1.3, 1);

    const redGeom = new THREE.SphereGeometry(0.2, 32, 32);
    const redMat = new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.8 });
    const redSphere = new THREE.Mesh(redGeom, redMat);
    redSphere.position.set(0.5, 1.3, 1);

    state.scene.add(blueSphere);
    state.scene.add(redSphere);

    // Merge animation
    gsap.to(blueSphere.position, { x: 0, duration: 0.5 });
    gsap.to(redSphere.position, { x: 0, duration: 0.5 });

    // Create purple sphere after merge
    setTimeout(() => {
        state.scene.remove(blueSphere);
        state.scene.remove(redSphere);

        const purpleGeom = new THREE.SphereGeometry(0.4, 32, 32);
        const purpleMat = new THREE.MeshBasicMaterial({
            color: 0x9c27b0,
            transparent: true,
            opacity: 0.9
        });
        const purpleSphere = new THREE.Mesh(purpleGeom, purpleMat);
        purpleSphere.position.set(0, 1.3, 1);
        state.scene.add(purpleSphere);

        // Intense glow
        const glowGeom = new THREE.SphereGeometry(0.6, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.position.copy(purpleSphere.position);
        state.scene.add(glow);

        // Fire!
        gsap.to(purpleSphere.scale, { x: 3, y: 3, z: 3, duration: 0.3, delay: 0.5 });
        gsap.to(glow.scale, { x: 5, y: 5, z: 5, duration: 0.3, delay: 0.5 });
        gsap.to(purpleSphere.position, { z: 20, duration: 1, delay: 0.8, ease: 'power4.in' });
        gsap.to(glow.position, { z: 20, duration: 1, delay: 0.8, ease: 'power4.in' });

        // Create devastation particles
        createTechniqueParticles('purple', 0, 1.3, 1);

        setTimeout(() => {
            state.scene.remove(purpleSphere);
            state.scene.remove(glow);
        }, 2000);
    }, 600);

    // Reset
    setTimeout(() => {
        gsap.to(leftArm.rotation, { x: 0, z: Math.PI / 6, duration: 0.3 });
        gsap.to(rightArm.rotation, { x: 0, z: -Math.PI / 6, duration: 0.3 });
        gsap.to(leftHand.position, { z: 0, y: 0.75, x: -0.65, duration: 0.3 });
        gsap.to(rightHand.position, { z: 0, y: 0.75, x: 0.65, duration: 0.3 });
        purpleOverlay.classList.add('hidden');
        hideTechniqueOverlay();
        state.currentTechnique = null;
    }, TECHNIQUES.purple.duration);
}

// DOMAIN EXPANSION: INFINITE VOID
function executeDomain() {
    const domainOverlay = document.getElementById('domain-overlay');
    
    // Slow motion effect
    slowMotion(2000);
    
    // Flash white
    createScreenFlash('white');

    // Show domain overlay with animation
    setTimeout(() => {
        domainOverlay.classList.remove('hidden');
        
        // Animate domain text with anime.js
        anime({
            targets: '.domain-kanji',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .5)'
        });

        anime({
            targets: '.domain-romaji, .domain-english',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(200, { start: 500 }),
            duration: 800,
            easing: 'easeOutQuart'
        });
    }, 300);

    // Raise arms wide
    const leftArm = state.gojoModel.getObjectByName('leftArm');
    const rightArm = state.gojoModel.getObjectByName('rightArm');
    
    gsap.to(leftArm.rotation, { x: 0, z: Math.PI / 2, duration: 0.5 });
    gsap.to(rightArm.rotation, { x: 0, z: -Math.PI / 2, duration: 0.5 });
    gsap.to(leftArm.position, { y: 1.5, x: -0.8, duration: 0.5 });
    gsap.to(rightArm.position, { y: 1.5, x: 0.8, duration: 0.5 });

    // Create Six Eyes effect
    if (state.blindfoldRemoved) {
        const sixEyesEffect = document.createElement('div');
        sixEyesEffect.className = 'six-eyes-active';
        document.getElementById('particle-container').appendChild(sixEyesEffect);
        
        setTimeout(() => sixEyesEffect.remove(), TECHNIQUES.domain.duration);
    }

    // Change scene environment
    gsap.to(state.scene.background, {
        r: 0,
        g: 0,
        b: 0,
        duration: 0.5
    });

    // Create infinite void particles
    createDomainParticles();

    // Levitate character
    gsap.to(state.gojoModel.position, {
        y: 1,
        duration: 1,
        ease: 'power2.out'
    });

    // Intense aura
    const aura = state.gojoModel.getObjectByName('aura');
    gsap.to(aura.material, {
        opacity: 0.5,
        duration: 0.5
    });
    gsap.to(aura.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.5
    });

    // Reset
    setTimeout(() => {
        domainOverlay.classList.add('hidden');
        gsap.to(leftArm.rotation, { x: 0, z: Math.PI / 6, duration: 0.5 });
        gsap.to(rightArm.rotation, { x: 0, z: -Math.PI / 6, duration: 0.5 });
        gsap.to(leftArm.position, { y: 1.1, x: -0.5, duration: 0.5 });
        gsap.to(rightArm.position, { y: 1.1, x: 0.5, duration: 0.5 });
        gsap.to(state.gojoModel.position, { y: 0, duration: 0.5 });
        gsap.to(aura.material, { opacity: 0, duration: 0.5 });
        gsap.to(aura.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(state.scene.background, { r: 0.04, g: 0.04, b: 0.04, duration: 0.5 });
        state.currentTechnique = null;
    }, TECHNIQUES.domain.duration);
}

// =====================================================
// BLINDFOLD TOGGLE
// =====================================================

function toggleBlindfold() {
    const blindfold = state.gojoModel.getObjectByName('blindfold');
    const sixEyes = state.gojoModel.getObjectByName('sixEyes');
    const btn = document.getElementById('toggle-blindfold');

    state.blindfoldRemoved = !state.blindfoldRemoved;

    if (state.blindfoldRemoved) {
        // Remove blindfold animation
        gsap.to(blindfold.position, {
            y: 3,
            z: -1,
            duration: 0.5,
            onComplete: () => {
                blindfold.visible = false;
            }
        });
        gsap.to(blindfold.rotation, {
            x: Math.PI / 2,
            duration: 0.5
        });

        // Show Six Eyes
        sixEyes.visible = true;
        gsap.from(sixEyes.children, {
            scale: 0,
            duration: 0.3,
            stagger: 0.1,
            delay: 0.3
        });

        btn.querySelector('.btn-text').textContent = 'WEAR BLINDFOLD';
        btn.querySelector('.btn-icon').textContent = '🙈';

        // Create reveal particles
        createSixEyesParticles();
    } else {
        // Put blindfold back
        blindfold.visible = true;
        gsap.to(blindfold.position, {
            y: 1.82,
            z: 0.15,
            duration: 0.5
        });
        gsap.to(blindfold.rotation, {
            x: 0,
            duration: 0.5
        });

        // Hide Six Eyes
        gsap.to(sixEyes.children, {
            scale: 0,
            duration: 0.2,
            onComplete: () => {
                sixEyes.visible = false;
            }
        });

        btn.querySelector('.btn-text').textContent = 'REMOVE BLINDFOLD';
        btn.querySelector('.btn-icon').textContent = '👁️';
    }
}

// =====================================================
// PARTICLE EFFECTS
// =====================================================

function initParticleSystem() {
    // Background ambient particles handled by Three.js
}

function createInfinityParticles() {
    const container = document.getElementById('particle-container');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle infinity-particle';
        
        const angle = (i / 50) * Math.PI * 2;
        const radius = 100 + Math.random() * 100;
        
        particle.style.left = `${centerX + Math.cos(angle) * radius}px`;
        particle.style.top = `${centerY + Math.sin(angle) * radius}px`;
        particle.style.width = `${3 + Math.random() * 5}px`;
        particle.style.height = particle.style.width;
        
        container.appendChild(particle);

        // Animate with anime.js
        anime({
            targets: particle,
            translateX: [0, (Math.random() - 0.5) * 200],
            translateY: [0, (Math.random() - 0.5) * 200],
            scale: [1, 0],
            opacity: [1, 0],
            duration: 2000 + Math.random() * 1000,
            easing: 'easeOutExpo',
            complete: () => particle.remove()
        });
    }
}

function createTechniqueParticles(type, x, y, z) {
    const particleColor = {
        blue: 0x0066ff,
        red: 0xff3366,
        purple: 0x9c27b0
    };

    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: 0.1 + Math.random() * 0.2
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: particleColor[type],
        size: 0.1,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    state.scene.add(particles);

    // Animate particles
    let frame = 0;
    const maxFrames = 60;

    function animateParticles() {
        if (frame >= maxFrames) {
            state.scene.remove(particles);
            return;
        }

        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.material.opacity = 1 - (frame / maxFrames);

        frame++;
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

function createDomainParticles() {
    // Create floating symbols for infinite void
    const symbols = ['∞', '空', '無', '限', '虚'];
    const container = document.getElementById('particle-container');

    for (let i = 0; i < 30; i++) {
        const symbol = document.createElement('div');
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.cssText = `
            position: absolute;
            color: rgba(0, 255, 255, ${0.3 + Math.random() * 0.5});
            font-size: ${20 + Math.random() * 30}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            text-shadow: 0 0 20px cyan;
        `;
        container.appendChild(symbol);

        anime({
            targets: symbol,
            translateY: [-100, window.innerHeight + 100],
            translateX: () => (Math.random() - 0.5) * 200,
            rotate: () => Math.random() * 360,
            opacity: [0, 1, 0],
            duration: 3000 + Math.random() * 2000,
            easing: 'linear',
            complete: () => symbol.remove()
        });
    }
}

function createSixEyesParticles() {
    const container = document.getElementById('particle-container');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 50;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: #00ffff;
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
        `;
        container.appendChild(particle);

        const angle = (i / 20) * Math.PI * 2;
        const distance = 50 + Math.random() * 100;

        anime({
            targets: particle,
            translateX: Math.cos(angle) * distance,
            translateY: Math.sin(angle) * distance,
            scale: [1, 0],
            opacity: [1, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            complete: () => particle.remove()
        });
    }
}

function createScreenFlash(color) {
    const flash = document.createElement('div');
    flash.className = `screen-flash ${color}`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
}

// =====================================================
// UI HELPERS
// =====================================================

function showTechniqueOverlay(name, kanji) {
    const overlay = document.getElementById('technique-overlay');
    const nameEl = document.getElementById('technique-name');
    const kanjiEl = document.getElementById('technique-kanji');

    nameEl.textContent = name;
    kanjiEl.textContent = kanji;
    overlay.classList.remove('hidden');

    // Animate with anime.js
    anime({
        targets: '#technique-name',
        opacity: [0, 1],
        letterSpacing: ['50px', '10px'],
        duration: 500,
        easing: 'easeOutExpo'
    });

    anime({
        targets: '#technique-kanji',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutElastic(1, .5)'
    });
}

function hideTechniqueOverlay() {
    const overlay = document.getElementById('technique-overlay');
    
    anime({
        targets: '#technique-overlay',
        opacity: 0,
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
            overlay.classList.add('hidden');
            overlay.style.opacity = 1;
        }
    });
}

// =====================================================
// ANIMATION LOOP
// =====================================================

function animate() {
    requestAnimationFrame(animate);

    const delta = state.clock.getDelta();
    const elapsed = state.clock.getElapsedTime();

    // Animate Gojo's idle motion
    if (state.gojoModel) {
        // Subtle floating
        state.gojoModel.position.y += Math.sin(elapsed * 2) * 0.001;

        // Rotate infinity orbs
        const orbs = state.gojoModel.getObjectByName('infinityOrbs');
        if (orbs) {
            orbs.children.forEach((orb, i) => {
                const speed = orb.userData.speed;
                const angle = orb.userData.angle + elapsed * speed;
                orb.position.x = Math.cos(angle) * 1.5;
                orb.position.z = Math.sin(angle) * 1.5;
                orb.position.y = 1.5 + Math.sin(elapsed * 2 + i) * 0.2;
            });
        }

        // Six Eyes glow pulse
        const sixEyes = state.gojoModel.getObjectByName('sixEyes');
        if (sixEyes && sixEyes.visible) {
            sixEyes.children.forEach(eye => {
                eye.material.emissiveIntensity = 1.5 + Math.sin(elapsed * 5) * 0.5;
            });
        }
    }

    // Animate background particles
    const bgParticles = state.scene.getObjectByName('backgroundParticles');
    if (bgParticles) {
        bgParticles.rotation.y = elapsed * 0.05;
        const positions = bgParticles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += Math.sin(elapsed + positions[i]) * 0.001;
        }
        bgParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Camera subtle movement
    state.camera.position.x = Math.sin(elapsed * 0.3) * 0.2;
    state.camera.position.y = 1.5 + Math.sin(elapsed * 0.5) * 0.1;
    state.camera.lookAt(0, 1, 0);

    state.renderer.render(state.scene, state.camera);
}

// =====================================================
// EXPORT FOR DEBUGGING
// =====================================================

window.gojoApp = {
    state,
    activateTechnique,
    toggleBlindfold
};

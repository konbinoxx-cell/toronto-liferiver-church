// future.js - Enhanced with interactivity & prayer particle system

let scene, camera, renderer, globe, stars, pulseSphere;
let raycaster, mouse = new THREE.Vector2();
let audioContext = null;

// Initialize on DOMContentLoaded (safer than window.onload)
document.addEventListener('DOMContentLoaded', init);

function init() {
    // 🎯 Scroll to anchor with offset (avoid header overlap)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ✅ Initialize Three.js only if canvas exists
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        initThreeJS();
    }

    // ✅ Prayer Viz & Form
    setupPrayerViz();
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    camera.position.z = 5;

    // 🌐 The "Logos" Core (Wireframe + Solid Glow)
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // 🌕 Inner Pulse Sphere (for click feedback)
    const pulseGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda, 
        transparent: true,
        opacity: 0.8 
    });
    pulseSphere = new THREE.Mesh(pulseGeo, pulseMat);
    pulseSphere.visible = false;
    scene.add(pulseSphere);

    // Inner Glow (soft)
    const innerGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda, 
        transparent: true, 
        opacity: 0.1 
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Stars background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 
    });
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 🖱️ Raycaster for click detection
    raycaster = new THREE.Raycaster();

    // Click to interact
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('touchend', onMouseClick, { passive: true });

    animate();
}

function onMouseClick(event) {
    // Normalize mouse position
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(globe);

    if (intersects.length > 0) {
        triggerPulse();
        playSound(); // placeholder
    }
}

function triggerPulse() {
    if (!pulseSphere) return;
    pulseSphere.visible = true;
    pulseSphere.position.copy(globe.position);
    pulseSphere.scale.set(0.1, 0.1, 0.1);
    pulseSphere.material.opacity = 0.9;

    // Animate pulse expansion & fade
    gsap.to(pulseSphere.scale, {
        x: 5, y: 5, z: 5,
        duration: 1.2,
        ease: "power2.out"
    });
    gsap.to(pulseSphere.material, {
        opacity: 0,
        duration: 1.2,
        onComplete: () => { pulseSphere.visible = false; }
    });
}

function playSound() {
    // 🎵 Future: Replace with Web Audio API chime
    // For now: subtle feedback via console or vibration (mobile)
    if (window.navigator.vibrate) {
        navigator.vibrate(30);
    }
    // console.log("✨ Logos resonated");
}

function animate() {
    requestAnimationFrame(animate);

    if (globe) {
        globe.rotation.y += 0.002;
        globe.rotation.x += 0.001;

        // Gentle breathing
        const time = Date.now() * 0.0005;
        globe.scale.setScalar(1 + Math.sin(time * 0.8) * 0.02);
    }

    if (stars) stars.rotation.y -= 0.0002;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== Quantum Prayer Visualization ==========
function setupPrayerViz() {
    const prayerViz = document.getElementById('prayer-viz');
    const form = document.getElementById('prayer-form');
    const input = document.getElementById('prayer-input');

    if (!prayerViz) return;

    // ✅ Create dynamic prayer particles
    function createPrayerParticle() {
        const dot = document.createElement('div');
        dot.classList.add('prayer-particle');
        dot.style.position = 'absolute';
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.background = '#00ff88';
        dot.style.borderRadius = '50%';
        dot.style.boxShadow = '0 0 8px #00ff88';
        dot.style.left = '50%';
        dot.style.top = '50%';
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.pointerEvents = 'none';
        prayerViz.appendChild(dot);

        // Random target
        const targetX = (Math.random() - 0.5) * 160 + 80; // ±80px from center
        const targetY = (Math.random() - 0.5) * 160 + 80;

        gsap.to(dot, {
            duration: 2 + Math.random() * 2,
            x: targetX,
            y: targetY,
            opacity: 0,
            scale: 2,
            ease: "power1.out",
            onComplete: () => dot.remove()
        });
    }

    // Initialize with 8 particles
    for (let i = 0; i < 8; i++) {
        setTimeout(createPrayerParticle, i * 300);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value.trim() === '') return;
            
            // Emit 3 particles on submit
            for (let i = 0; i < 3; i++) {
                setTimeout(createPrayerParticle, i * 200);
            }

            // Optional: send to backend (future)
            console.log("🙏 Prayer submitted:", input.value);
            input.value = '';

            // Update counter (demo only)
            const counter = prayerViz.querySelector('.counter');
            if (counter) {
                let count = parseInt(counter.textContent.replace(/,/g, '')) || 1247;
                counter.textContent = (count + 1).toLocaleString();
            }
        });
    }
}
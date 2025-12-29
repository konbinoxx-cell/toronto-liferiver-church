// Three.js Core - The "Logos" Centerpiece
let scene, camera, renderer, globe, stars;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 5;

    // The "Logos" Core (Wireframe Globe)
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Inner Glow Sphere
    const innerGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda, 
        transparent: true, 
        opacity: 0.1 
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Particles (Stars)
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
    
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

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Subtle rotations
    globe.rotation.y += 0.002;
    globe.rotation.x += 0.001;
    
    stars.rotation.y -= 0.0002;

    // Pulse effect
    const time = Date.now() * 0.001;
    globe.scale.setScalar(1 + Math.sin(time) * 0.03);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize on load
window.onload = init;

// Prayer Visualization (Simple Particle Injection)
const prayerViz = document.getElementById('prayer-viz');
if (prayerViz) {
    for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.background = '#00ff88';
        dot.style.borderRadius = '50%';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.opacity = Math.random();
        
        gsap.to(dot, {
            duration: 2 + Math.random() * 3,
            x: '+=20',
            y: '+=20',
            opacity: 0,
            repeat: -1,
            ease: "sine.inOut"
        });
        prayerViz.appendChild(dot);
    }
}

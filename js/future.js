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

// QwenAPI Integration for Bible Study and Prayer
document.addEventListener('DOMContentLoaded', function() {
    // Bible Study functionality
    const searchBibleBtn = document.getElementById('search-bible-btn');
    const bibleQueryInput = document.getElementById('bible-query');
    const bibleResults = document.getElementById('bible-results');
    
    if (searchBibleBtn && bibleQueryInput && bibleResults) {
        searchBibleBtn.addEventListener('click', async () => {
            const query = bibleQueryInput.value.trim();
            if (!query) {
                alert('請輸入您想查詢的經文或主題');
                return;
            }
            
            bibleResults.innerHTML = '<p style="color: var(--text-dim);">正在搜索相關經文，請稍候...</p>';
            
            try {
                const response = await window.callQwenAPI(`請根據以下查詢提供相關的聖經經文和解釋：${query}`, window.QWEN_CONFIG.BIBLE_STUDY_SETTINGS);
                bibleResults.innerHTML = `<div style="line-height: 1.6;">${response.replace(/\n/g, '<br>')}</div>`;
            } catch (error) {
                bibleResults.innerHTML = `<p style="color: #ff6b6b;">搜索時發生錯誤: ${error.message}</p>`;
            }
        });
        
        // Allow Enter key to trigger search
        bibleQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBibleBtn.click();
            }
        });
    }
    
    // Open full Bible Study page
    const openBibleStudyPageBtn = document.getElementById('open-bible-study-page');
    if (openBibleStudyPageBtn) {
        openBibleStudyPageBtn.addEventListener('click', () => {
            window.open('pages/bible-study-ai.html', '_blank');
        });
    }
    
    // Enhanced Prayer functionality
    const prayerInput = document.getElementById('prayer-input');
    const sendPrayerBtn = document.getElementById('send-prayer-btn');
    const generatePrayerBtn = document.getElementById('generate-prayer-btn');
    const prayerResults = document.getElementById('prayer-results');
    const prayerGenerated = document.getElementById('prayer-generated');
    
    if (prayerInput && sendPrayerBtn && generatePrayerBtn && prayerResults && prayerGenerated) {
        // Send prayer functionality (placeholder)
        sendPrayerBtn.addEventListener('click', () => {
            const prayer = prayerInput.value.trim();
            if (!prayer) {
                alert('請輸入您的禱告內容');
                return;
            }
            
            // Add to prayer network visualization
            const newDot = document.createElement('div');
            newDot.style.position = 'absolute';
            newDot.style.width = '6px';
            newDot.style.height = '6px';
            newDot.style.background = '#64ffda';
            newDot.style.borderRadius = '50%';
            newDot.style.left = Math.random() * 100 + '%';
            newDot.style.top = Math.random() * 100 + '%';
            newDot.style.opacity = '1';
            
            gsap.to(newDot, {
                duration: 3 + Math.random() * 2,
                x: '+=30',
                y: '+=30',
                opacity: 0,
                ease: "sine.inOut",
                onComplete: () => newDot.remove()
            });
            
            prayerViz.appendChild(newDot);
            
            // Update online count
            const onlineCount = document.getElementById('online-count');
            if (onlineCount) {
                let count = parseInt(onlineCount.textContent.replace(/,/g, ''));
                count = count + 1;
                onlineCount.textContent = count.toLocaleString();
            }
            
            // Clear input
            prayerInput.value = '';
        });
        
        // Generate prayer using QwenAI
        generatePrayerBtn.addEventListener('click', async () => {
            const prayerRequest = prayerInput.value.trim();
            if (!prayerRequest) {
                alert('請輸入您的禱告需求');
                return;
            }
            
            prayerResults.style.display = 'block';
            prayerGenerated.innerHTML = 'AI正在生成禱告文，請稍候...';
            
            try {
                const response = await window.callQwenAPI(`請根據以下需求生成禱告文：${prayerRequest}`, window.QWEN_CONFIG.PRAYER_SETTINGS);
                prayerGenerated.innerHTML = response.replace(/\n/g, '<br>');
            } catch (error) {
                prayerGenerated.innerHTML = `生成禱告文時發生錯誤: ${error.message}`;
            }
        });
        
        // Allow Enter key to trigger prayer generation
        prayerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) { // Ctrl+Enter for prayer generation
                generatePrayerBtn.click();
            } else if (e.key === 'Enter') { // Just Enter for sending prayer
                sendPrayerBtn.click();
            }
        });
    }
    

});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

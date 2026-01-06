// js/future-core.js — 安全、可复用、带 fallback 的 Three.js 初始化器
// 兼容 future.html + 所有子页面

(function() {
    // 防重复初始化
    if (window.__FUTURE_CORE_LOADED__) return;
    window.__FUTURE_CORE_LOADED__ = true;

    // 工具函数：检查 Three.js 是否加载
    function isThreeLoaded() {
        return typeof THREE !== 'undefined' && THREE.Scene;
    }

    // Fallback：若 CDN 失败，动态加载本地备份（你可放 three.r160.min.js 在 js/）
    function loadThreeJS(callback) {
        if (isThreeLoaded()) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
        script.integrity = 'sha512-bY9wG+Y0Z1s5Z5Xj7hQ5Q6vVj5v6vVj7hQ5Q6vVj5v6vVj7hQ5Q6vVj5v6vVj7hQ5Q6vVj5v6vVj7hQ5Q6vV==';
        script.crossOrigin = 'anonymous';
        script.onload = callback;
        script.onerror = () => {
            console.warn('[Future Core] CDN failed, trying local fallback...');
            const local = document.createElement('script');
            local.src = 'js/three.r160.min.js'; // ← 你可准备此文件
            local.onload = callback;
            local.onerror = () => console.error('[Future Core] Three.js failed to load');
            document.head.appendChild(local);
        };
        document.head.appendChild(script);
    }

    // 初始化背景星空 + Logos 球体
    window.initFutureBackground = function(containerId = 'canvas-container') {
        if (window.__BACKGROUND_INIT__) return;
        loadThreeJS(() => {
            if (!isThreeLoaded()) return;

            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`[Future Core] #${containerId} not found`);
                return;
            }

            // 避免重复创建
            if (container.__scene__) return;
            container.__scene__ = true;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);

            // Logos 球体
            const globeGeo = new THREE.IcosahedronGeometry(2, 2);
            const globeMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.3 
            });
            const globe = new THREE.Mesh(globeGeo, globeMat);
            scene.add(globe);

            const innerSphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.5, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.1 })
            );
            scene.add(innerSphere);

            // 星空
            const starGeo = new THREE.BufferGeometry();
            const starVertices = [];
            for (let i = 0; i < 1500; i++) {
                starVertices.push(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200
                );
            }
            starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
                color: 0xffffff, size: 0.08, transparent: true, opacity: 0.4
            }));
            scene.add(stars);

            // 动画
            function animate() {
                requestAnimationFrame(animate);
                globe.rotation.y += 0.002;
                globe.rotation.x += 0.001;
                const s = 1 + Math.sin(Date.now() * 0.0005) * 0.02;
                globe.scale.set(s, s, s);
                stars.rotation.y -= 0.0002;
                renderer.render(scene, camera);
            }

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            animate();
            window.__BACKGROUND_INIT__ = true;
            console.log('[Future Core] ✅ Background initialized');
        });
    };

    // 页面加载时自动初始化（兼容 future.html）
    if (document.getElementById('canvas-container')) {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initFutureBackground(), 100);
        });
    }
})();
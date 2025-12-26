'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARTIFACT_DATA, Artifacts } from '@/lib/museum-data';


const MuseumPage = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const infoPanelRef = useRef<HTMLDivElement>(null);
    const artifactTitleRef = useRef<HTMLHeadingElement>(null);
    const artifactDescRef = useRef<HTMLParagraphElement>(null);
    const speakBtnRef = useRef<HTMLButtonElement>(null);
    const blockerRef = useRef<HTMLDivElement>(null);
    const markersContainerRef = useRef<HTMLDivElement>(null);

    const [isStarted, setIsStarted] = useState(false);
    
    // Store mutable scene objects in refs to prevent re-creation on re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const artifactMarkersRef = useRef<{ [key: string]: any }>({});

    // --- Text-to-speech function ---
    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ar';
        msg.pitch = 1.1;
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    };

    const handleStart = () => {
        if (blockerRef.current) {
            blockerRef.current.style.display = 'none';
        }
        setIsStarted(true);
    };

    const handleClosePanel = () => {
        if (infoPanelRef.current) {
            infoPanelRef.current.classList.remove('visible');
        }
        window.speechSynthesis.cancel();
    };
    
    useEffect(() => {
        if (!isStarted || !mountRef.current) return;
        
        let lon = 0;
        let lat = 0;
        let phi = 0;
        let theta = 0;
        let isUserInteracting = false;
        let onPointerDownMouseX = 0;
        let onPointerDownMouseY = 0;
        let onPointerDownLon = 0;
        let onPointerDownLat = 0;

        // --- Basic Three.js setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.target = new THREE.Vector3(0, 0, 0);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // --- Scene Content ---
        scene.background = new THREE.Color(0x101010);
        scene.add(new THREE.AmbientLight(0xcccccc, 1.2));
        const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
        pointLight.position.set(0, 50, 0);
        scene.add(pointLight);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200, 100, 100),
            new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.8 })
        );
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);
        
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load('https://www.transparenttextures.com/patterns/egyptian-flat.png');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(8, 2);

        const wallMaterial = new THREE.MeshStandardMaterial({ 
            map: wallTexture,
            side: THREE.BackSide,
            color: 0x8c7853
        });

        const geometry = new THREE.SphereGeometry(100, 60, 40);
        const sphere = new THREE.Mesh(geometry, wallMaterial);
        scene.add(sphere);

        // --- Artifacts and Markers ---
        Object.keys(ARTIFACT_DATA).forEach(key => {
            const artifact = ARTIFACT_DATA[key];
            const box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xccab00, emissiveIntensity: 0.3 }));
            box.position.copy(artifact.position);
            box.userData = { id: key };
            scene.add(box);
            
            // Create DOM marker
            const div = document.createElement('div');
            div.className = 'artifact-marker';
            div.innerHTML = `<i class="${artifact.icon}"></i>`;
            div.onclick = () => {
                if (artifactTitleRef.current) artifactTitleRef.current.innerText = artifact.title;
                if (artifactDescRef.current) artifactDescRef.current.innerText = artifact.description;
                if (infoPanelRef.current) infoPanelRef.current.classList.add('visible');
                if (speakBtnRef.current) speakBtnRef.current.onclick = () => speak(artifact.description);
            };
            if(markersContainerRef.current) markersContainerRef.current.appendChild(div);
            artifactMarkersRef.current[key] = { el: div, pos: artifact.position.clone() };
        });

        // --- Animation Loop ---
        const animate = () => {
            requestAnimationFrame(animate);

            if (!isUserInteracting) {
                lon += 0.05;
            }
            
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);

            camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
            camera.target.y = 500 * Math.cos(phi);
            camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
            camera.lookAt(camera.target);

            // Update marker positions
            Object.values(artifactMarkersRef.current).forEach(marker => {
                const vector = marker.pos.clone().project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
                
                if (vector.z < 1) {
                    marker.el.style.left = `${x}px`;
                    marker.el.style.top = `${y}px`;
                    marker.el.style.display = 'flex';
                } else {
                    marker.el.style.display = 'none';
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        // --- Event Listeners ---
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        function onPointerDown(event: PointerEvent) {
            isUserInteracting = true;
            onPointerDownMouseX = event.clientX;
            onPointerDownMouseY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }

        function onPointerMove(event: PointerEvent) {
            lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
            lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
        }

        function onPointerUp() {
            isUserInteracting = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('pointerdown', onPointerDown);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
             if (markersContainerRef.current) {
                markersContainerRef.current.innerHTML = '';
            }
            // Dispose Three.js objects to free up GPU memory
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if(Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, [isStarted]);


    return (
        <>
            <style jsx global>{`
                body, html {
                    overflow: hidden;
                    background-color: #000;
                    font-family: 'El Messiri', sans-serif;
                }
                #info-panel {
                    position: fixed; z-index: 30; top: 50%; left: 50%;
                    background: rgba(0, 0, 0, 0.95); color: #FFD700;
                    border-radius: 12px; box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
                    padding: 20px; width: 90%; max-width: 400px; text-align: right;
                    border: 2px solid #D4AF37; visibility: hidden; opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8); transition: all 0.3s ease;
                    font-family: 'El Messiri', sans-serif;
                }
                #info-panel.visible { visibility: visible; opacity: 1; transform: translate(-50%, -50%) scale(1); }
                .artifact-marker {
                    position: absolute; cursor: pointer; width: 40px; height: 40px;
                    background: rgba(212, 175, 55, 0.9); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: black; font-size: 1.2rem; box-shadow: 0 0 15px #FFD700;
                    z-index: 10;
                    transition: transform 0.2s;
                }
                .artifact-marker:hover {
                    transform: scale(1.2);
                }
                #blocker { 
                    background: radial-gradient(circle, #1a1a1a 0%, #000 100%); 
                    font-family: 'El Messiri', sans-serif;
                }
            `}</style>
            
            <div id="mount" ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
            
            <div ref={markersContainerRef} id="markers-container" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }} />

            <div id="info-panel" ref={infoPanelRef}>
                <h2 id="artifact-title" ref={artifactTitleRef} className="text-2xl font-bold mb-2 border-b border-yellow-600 pb-2"></h2>
                <p id="artifact-description" ref={artifactDescRef} className="text-gray-200 mb-4 leading-relaxed"></p>
                <div className="flex flex-col space-y-2">
                    <button id="speak-btn" ref={speakBtnRef} className="bg-blue-700 p-2 rounded font-bold hover:bg-blue-600 transition text-white">
                        <i className="fas fa-volume-up ml-2"></i> استمع للوصف
                    </button>
                    <button id="close-panel" onClick={handleClosePanel} className="bg-red-700 p-2 rounded font-bold text-white">إغلاق</button>
                </div>
            </div>

            <div id="blocker" ref={blockerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-black text-yellow-500 mb-6 font-display">المتحف الفرعوني</h1>
                <button id="start-btn" onClick={handleStart} className="bg-yellow-600 px-12 py-4 rounded-full text-2xl font-bold text-black hover:bg-yellow-500 transition-transform hover:scale-110">
                    ادخل المتحف
                </button>
            </div>
        </>
    );
};

export default MuseumPage;

'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';
import { ARTIFACT_DATA } from '@/lib/museum-data';
import { handleGetStory } from '@/app/actions';

const MuseumPage = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const infoPanelRef = useRef<HTMLDivElement>(null);
    const artifactTitleRef = useRef<HTMLHeadingElement>(null);
    const artifactDescRef = useRef<HTMLParagraphElement>(null);
    const speakBtnRef = useRef<HTMLButtonElement>(null);
    const blockerRef = useRef<HTMLDivElement>(null);
    const markersContainerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isStarted, setIsStarted] = useState(false);
    const [isGeneratingStory, setIsGeneratingStory] = useState(false);
    
    const artifactMarkersRef = useRef<{ [key: string]: { el: HTMLDivElement; pos: THREE.Vector3 } }>({});

    const tellStory = async (title: string, description: string) => {
        if (isGeneratingStory) return;
        setIsGeneratingStory(true);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        window.speechSynthesis.cancel();

        try {
            const result = await handleGetStory({ title, description });
            if (result.success && result.audioDataUri && audioRef.current) {
                audioRef.current.src = result.audioDataUri;
                audioRef.current.play();
            } else {
                console.error("Failed to get story, using fallback TTS");
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(description));
            }
        } catch (error) {
            console.error("Error calling storyteller action:", error);
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(description));
        } finally {
            setIsGeneratingStory(false);
        }
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
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
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

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        scene.background = new THREE.Color(0x101010);
        scene.add(new THREE.AmbientLight(0xcccccc, 1.2));
        const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
        pointLight.position.set(0, 50, 0);
        scene.add(pointLight);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
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

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 60, 40), wallMaterial);
        scene.add(sphere);

        Object.keys(ARTIFACT_DATA).forEach(artifactKey => {
            const artifact = ARTIFACT_DATA[artifactKey as keyof typeof ARTIFACT_DATA];
            const box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshStandardMaterial({ color: 0xFFD700 }));
            box.position.copy(artifact.position);
            scene.add(box);
            
            const div = document.createElement('div');
            div.className = 'artifact-marker';
            div.style.pointerEvents = 'auto';
            div.innerHTML = `<i class="${artifact.icon}"></i>`;
            div.onclick = (e) => {
                e.stopPropagation();
                if (artifactTitleRef.current) artifactTitleRef.current.innerText = artifact.title;
                if (artifactDescRef.current) artifactDescRef.current.innerText = artifact.description;
                if (infoPanelRef.current) infoPanelRef.current.classList.add('visible');
                if (speakBtnRef.current) speakBtnRef.current.onclick = () => tellStory(artifact.title, artifact.description);
            };
            if(markersContainerRef.current) markersContainerRef.current.appendChild(div);
            artifactMarkersRef.current[artifactKey] = { el: div, pos: artifact.position.clone() };
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (!isUserInteracting) lon += 0.05;
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);

            const target = new THREE.Vector3();
            target.x = 500 * Math.sin(phi) * Math.cos(theta);
            target.y = 500 * Math.cos(phi);
            target.z = 500 * Math.sin(phi) * Math.sin(theta);
            camera.lookAt(target);

            Object.values(artifactMarkersRef.current).forEach(marker => {
                const vector = marker.pos.clone().project(camera);
                if (vector.z < 1) {
                    marker.el.style.left = `${(vector.x * 0.5 + 0.5) * window.innerWidth}px`;
                    marker.el.style.top = `${(vector.y * -0.5 + 0.5) * window.innerHeight}px`;
                    marker.el.style.display = 'flex';
                } else {
                    marker.el.style.display = 'none';
                }
            });
            renderer.render(scene, camera);
        };
        animate();

        const onPointerDown = (e: PointerEvent) => {
            isUserInteracting = true;
            onPointerDownMouseX = e.clientX;
            onPointerDownMouseY = e.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isUserInteracting) return;
            lon = (onPointerDownMouseX - e.clientX) * 0.1 + onPointerDownLon;
            lat = (e.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
        };

        const onPointerUp = () => isUserInteracting = false;

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);

        return () => {
            renderer.dispose();
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [isStarted]);

    return (
        <>
            <audio ref={audioRef} hidden />
            <style jsx global>{`
                body, html { overflow: hidden; background: #000; font-family: 'El Messiri', sans-serif; }
                #info-panel {
                    position: fixed; z-index: 100; top: 50%; left: 50%;
                    background: rgba(0, 0, 0, 0.9); color: #FFD700;
                    border-radius: 12px; padding: 20px; width: 90%; max-width: 400px;
                    border: 2px solid #D4AF37; visibility: hidden; opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8); transition: all 0.3s;
                }
                #info-panel.visible { visibility: visible; opacity: 1; transform: translate(-50%, -50%) scale(1); }
                .artifact-marker {
                    position: absolute; cursor: pointer; width: 40px; height: 40px;
                    background: rgba(212, 175, 55, 0.9); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: black; z-index: 50; box-shadow: 0 0 15px #FFD700;
                }
                #blocker { background: radial-gradient(circle, #1a1a1a 0%, #000 100%); }
            `}</style>
            
            <div ref={mountRef} className="fixed inset-0" />
            <div ref={markersContainerRef} className="fixed inset-0 pointer-events-none" />

            <div id="info-panel" ref={infoPanelRef}>
                <h2 ref={artifactTitleRef} className="text-2xl font-bold mb-2 text-right"></h2>
                <p ref={artifactDescRef} className="text-gray-200 mb-4 text-right"></p>
                <div className="flex flex-col space-y-2">
                    <button ref={speakBtnRef} className="bg-blue-700 p-2 rounded text-white flex justify-center" disabled={isGeneratingStory}>
                        {isGeneratingStory ? <Loader2 className="animate-spin" /> : "استمع للقصة"}
                    </button>
                    <button onClick={handleClosePanel} className="bg-red-700 p-2 rounded text-white">إغلاق</button>
                </div>
            </div>

            <div id="blocker" ref={blockerRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center">
                <h1 className="text-5xl font-black text-yellow-500 mb-6">المتحف الفرعوني</h1>
                <button onClick={handleStart} className="bg-yellow-600 px-12 py-4 rounded-full text-2xl font-bold">ادخل المتحف</button>
            </div>
        </>
    );
};

export default MuseumPage;

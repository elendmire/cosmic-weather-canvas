
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useGlobe } from '@/context/GlobeContext';
import { CAMERA_DISTANCE, GLOBE_RADIUS } from '@/lib/constants';
import { 
  createGlobe, 
  createAtmosphere, 
  createStars, 
  createWindParticles, 
  animateWindParticles 
} from '@/lib/globe-utils';

const Globe: React.FC = () => {
  const { dataType, rotating, selectedLocation } = useGlobe();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = CAMERA_DISTANCE;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = GLOBE_RADIUS * 1.3;
    controls.maxDistance = CAMERA_DISTANCE * 1.5;
    controls.enablePan = false;
    controls.update();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add stars
    const stars = createStars();
    scene.add(stars);
    
    // Add globe
    const globe = createGlobe();
    scene.add(globe);
    
    // Add atmosphere
    const atmosphere = createAtmosphere();
    scene.add(atmosphere);
    
    // Add wind particles
    const particles = createWindParticles(2000);
    scene.add(particles);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (rotating) {
        globe.rotation.y += 0.0005;
        atmosphere.rotation.y += 0.0005;
      }
      
      // Animate particles based on data type
      animateWindParticles(particles, time);
      
      controls.update();
      renderer.render(scene, camera);
      
      // Set loading to false after first render
      if (isLoading) {
        setIsLoading(false);
      }
    };
    
    animate(0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      // Dispose resources
      renderer.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
    };
  }, [dataType, rotating, selectedLocation]);
  
  return (
    <div className="absolute inset-0 z-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-panel p-8 text-center animate-pulse-subtle">
            <div className="text-2xl font-light mb-2">Loading Earth Visualization</div>
            <div className="text-sm text-muted-foreground">Preparing weather data...</div>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};

export default Globe;

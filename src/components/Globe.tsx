
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const newScene = new THREE.Scene();
    setScene(newScene);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = CAMERA_DISTANCE;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(newRenderer.domElement);
    setRenderer(newRenderer);
    
    // Add controls
    const controls = new OrbitControls(camera, newRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = GLOBE_RADIUS * 1.3;
    controls.maxDistance = CAMERA_DISTANCE * 1.5;
    controls.enablePan = false;
    controls.update();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    newScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Add stars
    const stars = createStars();
    newScene.add(stars);
    
    // Create Earth globe with promise to track loading
    const textureLoader = new THREE.TextureLoader();
    
    // Track texture loading progress
    let loadedTextures = 0;
    const totalTextures = 3; // Map, bump, and specular maps
    
    const onTextureProgress = () => {
      loadedTextures++;
      if (loadedTextures === totalTextures) {
        setIsLoading(false);
      }
    };
    
    // Load textures
    Promise.all([
      new Promise<THREE.Texture>((resolve) => 
        textureLoader.load('/earth-blue-marble.jpg', (texture) => {
          onTextureProgress();
          resolve(texture);
        })
      ),
      new Promise<THREE.Texture>((resolve) => 
        textureLoader.load('/earth-topology.jpg', (texture) => {
          onTextureProgress();
          resolve(texture);
        })
      ),
      new Promise<THREE.Texture>((resolve) => 
        textureLoader.load('/earth-specular.jpg', (texture) => {
          onTextureProgress();
          resolve(texture);
        })
      )
    ]).then(([mapTexture, bumpTexture, specularTexture]) => {
      // Create the globe with loaded textures
      const globe = createGlobe(mapTexture, bumpTexture, specularTexture);
      newScene.add(globe);
      
      // Add atmosphere
      const atmosphere = createAtmosphere();
      newScene.add(atmosphere);
      
      // Add wind particles
      const particles = createWindParticles(2000);
      newScene.add(particles);
      
      // Animation loop
      let animationFrameId: number;
      
      const animate = (time: number) => {
        animationFrameId = requestAnimationFrame(animate);
        
        if (rotating) {
          globe.rotation.y += 0.0005;
          atmosphere.rotation.y += 0.0005;
        }
        
        // Animate particles
        animateWindParticles(particles, time);
        
        controls.update();
        newRenderer.render(newScene, camera);
      };
      
      animate(0);
      
      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        newRenderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        
        // Dispose resources
        globe.geometry.dispose();
        (globe.material as THREE.Material).dispose();
        atmosphere.geometry.dispose();
        (atmosphere.material as THREE.Material).dispose();
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
      };
    });
    
    // Return cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      if (newRenderer) {
        newRenderer.dispose();
      }
    };
  }, [dataType, rotating]);
  
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

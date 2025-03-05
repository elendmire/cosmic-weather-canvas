
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
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const newScene = new THREE.Scene();
    sceneRef.current = newScene;
    
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
    rendererRef.current = newRenderer;
    
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
    
    // Create Earth globe
    const textureLoader = new THREE.TextureLoader();
    
    // Load textures with proper error handling
    const mapTexturePromise = new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        '/earth-blue-marble.jpg', 
        resolve,
        undefined, // onProgress is optional
        (error) => {
          console.error('Error loading map texture:', error);
          reject(error);
        }
      );
    });
    
    const bumpTexturePromise = new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        '/earth-topology.jpg', 
        resolve,
        undefined,
        (error) => {
          console.error('Error loading bump texture:', error);
          reject(error);
        }
      );
    });
    
    const specularTexturePromise = new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        '/earth-specular.jpg', 
        resolve,
        undefined,
        (error) => {
          console.error('Error loading specular texture:', error);
          reject(error);
        }
      );
    });
    
    // Create a default globe immediately to show something while textures load
    const defaultGlobe = createGlobe();
    newScene.add(defaultGlobe);
    
    const atmosphere = createAtmosphere();
    newScene.add(atmosphere);
    
    // Start animation immediately with the default globe
    const animate = (time: number) => {
      if (sceneRef.current && rendererRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        
        if (rotating && defaultGlobe) {
          defaultGlobe.rotation.y += 0.0005;
          atmosphere.rotation.y += 0.0005;
        }
        
        if (particles) {
          animateWindParticles(particles, time);
        }
        
        controls.update();
        rendererRef.current.render(sceneRef.current, camera);
      }
    };
    
    // Create wind particles
    const particles = createWindParticles(2000);
    newScene.add(particles);
    
    // Start animation
    animate(0);
    
    // Load high-quality textures in the background
    Promise.all([mapTexturePromise, bumpTexturePromise, specularTexturePromise])
      .then(([mapTexture, bumpTexture, specularTexture]) => {
        // Remove default globe
        if (defaultGlobe) {
          newScene.remove(defaultGlobe);
          defaultGlobe.geometry.dispose();
          (defaultGlobe.material as THREE.Material).dispose();
        }
        
        // Create high-quality globe
        const highQualityGlobe = createGlobe(mapTexture, bumpTexture, specularTexture);
        newScene.add(highQualityGlobe);
        
        // Update animation
        const animateWithHighQuality = (time: number) => {
          if (sceneRef.current && rendererRef.current) {
            animationFrameIdRef.current = requestAnimationFrame(animateWithHighQuality);
            
            if (rotating) {
              highQualityGlobe.rotation.y += 0.0005;
              atmosphere.rotation.y += 0.0005;
            }
            
            if (particles) {
              animateWindParticles(particles, time);
            }
            
            controls.update();
            rendererRef.current.render(sceneRef.current, camera);
          }
        };
        
        // Cancel previous animation
        if (animationFrameIdRef.current !== null) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        
        // Start new animation
        animateWithHighQuality(0);
        
        // Set loading to false
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading textures:', error);
        // Even if high-quality textures fail, we've already got a default globe showing
        setIsLoading(false);
      });
    
    // Handle window resize
    const handleResize = () => {
      if (rendererRef.current) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      // Clean up resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (defaultGlobe) {
        defaultGlobe.geometry.dispose();
        (defaultGlobe.material as THREE.Material).dispose();
      }
      
      if (atmosphere) {
        atmosphere.geometry.dispose();
        (atmosphere.material as THREE.Material).dispose();
      }
      
      if (particles) {
        particles.geometry.dispose();
        (particles.material as THREE.Material).dispose();
      }
      
      if (stars) {
        stars.geometry.dispose();
        (stars.material as THREE.Material).dispose();
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
        style={{ opacity: isLoading ? 0.5 : 1 }}
      />
    </div>
  );
};

export default Globe;

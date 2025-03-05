import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';

export function createGlobe(
  mapTexture?: THREE.Texture,
  bumpMapTexture?: THREE.Texture,
  specularMapTexture?: THREE.Texture
): THREE.Mesh {
  const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  
  // Create a simple material if no textures are provided
  if (!mapTexture && !bumpMapTexture && !specularMapTexture) {
    const simpleMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      transparent: true,
      opacity: 0.9,
    });
    return new THREE.Mesh(globeGeometry, simpleMaterial);
  }
  
  // Create full material with provided textures
  const globeMaterial = new THREE.MeshPhongMaterial({
    map: mapTexture,
    bumpMap: bumpMapTexture,
    bumpScale: 0.5,
    specularMap: specularMapTexture,
    specular: new THREE.Color(0x333333),
    shininess: 5,
    transparent: true,
    opacity: 0.9,
  });
  
  return new THREE.Mesh(globeGeometry, globeMaterial);
}

export function createAtmosphere(): THREE.Mesh {
  const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64);
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });
  
  return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
}

export function createStars(): THREE.Points {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: false,
  });
  
  const starsVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  
  return new THREE.Points(starsGeometry, starsMaterial);
}

export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

export function vector3ToLatLong(position: THREE.Vector3): { lat: number, lon: number } {
  const radius = position.length();
  const phi = Math.acos(position.y / radius);
  const theta = Math.atan2(position.z, position.x);
  
  const lat = 90 - (phi * (180 / Math.PI));
  const lon = (theta * (180 / Math.PI)) - 180;
  
  return { lat, lon };
}

export function createWindParticles(count: number): THREE.Points {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  
  const particlesPositions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    
    const x = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
    const y = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
    const z = GLOBE_RADIUS * Math.cos(theta);
    
    particlesPositions[i * 3] = x * 1.05;
    particlesPositions[i * 3 + 1] = y * 1.05;
    particlesPositions[i * 3 + 2] = z * 1.05;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
  
  return new THREE.Points(particlesGeometry, particlesMaterial);
}

export function animateWindParticles(particles: THREE.Points, time: number): void {
  const positionAttribute = particles.geometry.getAttribute('position') as THREE.BufferAttribute;
  
  // Make a copy of the positions to work with
  const positions = positionAttribute.array as Float32Array;
  const count = positions.length / 3;
  
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;
    
    // Get current position
    const x = positions[ix];
    const y = positions[iy];
    const z = positions[iz];
    
    // Calculate current position vector
    const position = new THREE.Vector3(x, y, z);
    const { lat, lon } = vector3ToLatLong(position);
    
    // Apply wind movement
    const windX = Math.sin(lon * Math.PI / 180 + time * 0.0005) * 0.1;
    const windY = Math.cos(lat * Math.PI / 180 + time * 0.0005) * 0.1;
    const windZ = Math.sin(lat * Math.PI / 180 + time * 0.0005) * 0.1;
    
    // Update position
    positions[ix] += windX;
    positions[iy] += windY;
    positions[iz] += windZ;
    
    // Keep particles near globe surface
    const newPosition = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
    const length = newPosition.length();
    
    if (length < GLOBE_RADIUS * 1.01 || length > GLOBE_RADIUS * 1.1) {
      // Reset particle to a new random position on the globe surface
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      positions[ix] = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi) * 1.05;
      positions[iy] = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi) * 1.05;
      positions[iz] = GLOBE_RADIUS * Math.cos(theta) * 1.05;
    }
  }
  
  // Mark the attribute as needing an update
  positionAttribute.needsUpdate = true;
}

import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';

export function createGlobe(): THREE.Mesh {
  const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const globeMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('/earth-blue-marble.jpg'),
    bumpMap: new THREE.TextureLoader().load('/earth-topology.jpg'),
    bumpScale: 0.5,
    specularMap: new THREE.TextureLoader().load('/earth-specular.jpg'),
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
  const positions = particles.geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Calculate lat/long
    const position = new THREE.Vector3(x, y, z);
    const { lat, lon } = vector3ToLatLong(position);
    
    // Apply wind based on lat/long (simplified)
    const windX = Math.sin(lon * Math.PI / 180 + time * 0.0005) * 0.1;
    const windY = Math.cos(lat * Math.PI / 180 + time * 0.0005) * 0.1;
    const windZ = Math.sin(lat * Math.PI / 180 + time * 0.0005) * 0.1;
    
    positions[i] += windX;
    positions[i + 1] += windY;
    positions[i + 2] += windZ;
    
    // Keep particles near globe surface
    const newPosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const length = newPosition.length();
    
    if (length < GLOBE_RADIUS * 1.01 || length > GLOBE_RADIUS * 1.1) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      positions[i] = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi) * 1.05;
      positions[i + 1] = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi) * 1.05;
      positions[i + 2] = GLOBE_RADIUS * Math.cos(theta) * 1.05;
    }
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
}

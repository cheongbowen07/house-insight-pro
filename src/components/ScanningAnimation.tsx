import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

// Rotating Globe with Grid
function Globe() {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Wireframe sphere */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.3} />
      </Sphere>
      
      {/* Inner glow sphere */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}

// Scanning Ring Effect
function ScanningRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.getElapsedTime();
      ringRef.current.position.y = Math.sin(time * 2) * 2;
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.05, 16, 100]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
    </mesh>
  );
}

// Particle Field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0ea5e9"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Orbital Lines
function OrbitalLines() {
  const linesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.003;
    }
  });

  const orbit1 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 3, 0, Math.sin(angle) * 3));
    }
    return points;
  }, []);

  const orbit2 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 3.5, Math.sin(angle) * 0.5, Math.sin(angle) * 3.5));
    }
    return points;
  }, []);

  return (
    <group ref={linesRef}>
      <Line points={orbit1} color="#06b6d4" lineWidth={1} transparent opacity={0.4} />
      <Line points={orbit2} color="#0ea5e9" lineWidth={1} transparent opacity={0.3} />
    </group>
  );
}

// Data Streams
function DataStream({ position, color }: { position: [number, number, number]; color: string }) {
  const streamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (streamRef.current) {
      const time = state.clock.getElapsedTime();
      streamRef.current.position.y = -3 + ((time * 2) % 6);
      streamRef.current.children.forEach((child, i) => {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.8 - (i * 0.1) - ((time % 1) * 0.5);
      });
    }
  });

  return (
    <group ref={streamRef} position={position}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -i * 0.3, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.1]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function ScanningAnimation() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="bg-gradient-to-b from-background via-primary/5 to-background"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#0ea5e9" />
        
        <Globe />
        <ScanningRing />
        <ParticleField />
        <OrbitalLines />
        
        {/* Data streams */}
        <DataStream position={[-1.5, 3, 0]} color="#06b6d4" />
        <DataStream position={[0, 3, 0]} color="#0ea5e9" />
        <DataStream position={[1.5, 3, 0]} color="#0284c7" />
      </Canvas>

      {/* Scan line overlay effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent scan-line" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(210 100% 50% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(210 100% 50% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BARNS, CROPS, barnFootprint, cropProgress, machineFootprint, type AnimalState, type BarnState, type CropId, type MachineState, type PlotState, type WeatherId } from "@/game/state/farm-rules";
import { MAPS, SEASON_COLORS, seasonAt, type MapId } from "@/game/state/worlds";

type FarmCanvasProps = { selectedPlot: string | null; plots: PlotState[]; machines: MachineState[]; barns: BarnState[]; animals: AnimalState[]; mapId: MapId; seasonStartedAt: number; now: number; weather: WeatherId; onSelectPlot: (plot: string) => void; placementPreview?: { kind: "machine"; x: number; z: number; type: MachineState["type"]; valid: boolean } | { kind: "barn"; x: number; z: number; type: BarnState["type"]; rotation: number; valid: boolean } | null; maxCameraDistance?: number };

function Meadow({ size, grass, soil }: { size: number; grass: string; soil: string }) {
  return (
    <group>
      <mesh position={[0, -0.36, 0]} receiveShadow>
        <cylinderGeometry args={[size, size + 0.25, 0.5, 8]} />
        <meshStandardMaterial color={soil} flatShading />
      </mesh>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[size - 0.08, size - 0.08, 0.12, 8]} />
        <meshStandardMaterial color={grass} flatShading />
      </mesh>
    </group>
  );
}

function Plot({ position, label, selected, onSelect, soil }: {
  position: [number, number, number]; label: string; selected: boolean; onSelect: () => void; soil: string;
}) {
  const border = useMemo(() => new THREE.Shape([
    new THREE.Vector2(-0.88, 0), new THREE.Vector2(0, 0.48),
    new THREE.Vector2(0.88, 0), new THREE.Vector2(0, -0.48),
  ]), []);
  const marker = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!marker.current) return;
    const pulse = selected ? 1 + Math.sin(clock.elapsedTime * 4.2) * 0.055 : 1;
    marker.current.scale.setScalar(pulse);
  });
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <shapeGeometry args={[border]} />
        <meshStandardMaterial color={selected ? "#dfab6b" : soil} roughness={1} />
      </mesh>
      <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <ringGeometry args={[0.53, 0.56, 4]} />
        <meshBasicMaterial color={selected ? "#fff2b4" : "#d39a67"} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.2, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <PlotLabel label={label} />
    </group>
  );
}

function WheatPlant({ x, z, index, progress, crop, onSelect }: { x: number; z: number; index: number; progress: number; crop: CropId; onSelect: () => void }) {
  const sway = useRef<THREE.Group>(null);
  const phase = index * 0.83;
  const height = (0.12 + progress * 0.42) * (0.82 + (index % 3) * 0.08);
  const ripe = progress >= 1;
  useFrame(({ clock }) => {
    if (sway.current) {
      const breeze = Math.sin(clock.elapsedTime * 1.55 + phase) * 0.055;
      sway.current.rotation.z = breeze;
      sway.current.rotation.x = Math.sin(clock.elapsedTime * 1.1 + phase) * 0.025;
    }
  });
  return <group ref={sway} position={[x, 0.04, z]}>
    <mesh position={[0, height / 2, 0]} castShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <cylinderGeometry args={[0.018, 0.03, height, 5]} />
      <meshStandardMaterial color={ripe ? CROPS[crop].color : crop === "wheat" ? "#477e3b" : crop === "carrot" ? "#dd8744" : "#bb5e53"} flatShading />
    </mesh>
    {progress > 0.22 && <>
      <mesh position={[-0.065, height * 0.38, 0]} rotation={[0, 0, -0.72]} scale={[0.07, 0.16, 0.025]} castShadow>
        <sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color={ripe ? "#bf9e47" : "#76aa4e"} flatShading />
      </mesh>
      <mesh position={[0.065, height * 0.58, 0.015]} rotation={[0, 0, 0.68]} scale={[0.065, 0.14, 0.024]} castShadow>
        <sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color={ripe ? "#c8a64b" : "#91c85d"} flatShading />
      </mesh>
    </>}
    {ripe && <group position={[0, height * 0.88, 0]}>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.025, 0.045, 0.16, 5]} /><meshStandardMaterial color="#d5a943" flatShading /></mesh>
      {Array.from({ length: 5 }, (_, kernel) => <mesh key={kernel} position={[kernel % 2 ? 0.045 : -0.045, 0.015 + Math.floor(kernel / 2) * 0.038, 0]} rotation={[0, 0, kernel % 2 ? 0.28 : -0.28]} castShadow>
        <sphereGeometry args={[0.035, 5, 4]} /><meshStandardMaterial color={kernel % 2 ? "#f3d479" : "#e8c05a"} flatShading />
      </mesh>)}
    </group>}
  </group>;
}

function CropRows({ progress, crop, onSelect }: { progress: number; crop: CropId; onSelect: () => void }) {
  const plants = [-0.48, -0.16, 0.16, 0.48].flatMap((x) => [-0.18, 0.18].map((z) => [x, z] as const));
  return <group>{plants.map(([x, z], index) => <WheatPlant key={`${x}-${z}`} x={x} z={z} index={index} progress={progress} crop={crop} onSelect={onSelect} />)}</group>;
}

function RockPile({ onSelect }: { onSelect: () => void }) {
  return <group position={[0, 0.13, 0]}>
    <mesh position={[-0.2, 0.08, 0]} rotation={[0.1, 0.2, -0.1]} castShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}><dodecahedronGeometry args={[0.22, 0]} /><meshStandardMaterial color="#899187" flatShading /></mesh>
    <mesh position={[0.12, 0.07, 0.13]} rotation={[0.2, 0.4, 0.1]} castShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}><dodecahedronGeometry args={[0.19, 0]} /><meshStandardMaterial color="#a3a69a" flatShading /></mesh>
    <mesh position={[0.24, 0.05, -0.13]} rotation={[0.1, 0.1, 0.15]} castShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}><dodecahedronGeometry args={[0.14, 0]} /><meshStandardMaterial color="#777f75" flatShading /></mesh>
  </group>;
}

function PlotLabel({ label }: { label: string }) {
  return <group position={[0, 0.12, 0]} userData={{ label }} />;
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const canopy = useRef<THREE.Group>(null);
  const phase = position[0] * 1.7 + position[2];
  useFrame(({ clock }) => {
    if (canopy.current) canopy.current.rotation.z = Math.sin(clock.elapsedTime * 0.72 + phase) * 0.018;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.85, 6]} />
        <meshStandardMaterial color="#8d5c3c" flatShading />
      </mesh>
      <group ref={canopy} position={[0, 0.8, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow><coneGeometry args={[0.72, 1.25, 7]} /><meshStandardMaterial color="#4f8e4f" flatShading /></mesh>
        <mesh position={[0.18, 0.75, -0.08]} castShadow><coneGeometry args={[0.48, 0.92, 7]} /><meshStandardMaterial color="#73b95b" flatShading /></mesh>
      </group>
    </group>
  );
}

function Barn({ barn, onSelect, selected, readyCount }: { barn: BarnState; onSelect: () => void; selected: boolean; readyCount: number }) {
  const [width, depth] = barnFootprint(barn.type, barn.rotation);
  const position: [number, number, number] = [(barn.x + (width - 1) / 2) * 1.6 - 0.05, 0, (barn.z + (depth - 1) / 2) * 1.6 + 0.35];
  const colors: Record<BarnState["type"], string> = { "chicken-coop": "#e1a467", "cattle-barn": "#c98758", "small-animal-pen": "#d39c67", apiary: "#d9b64d", stable: "#b78056" };
  return (
    <group position={position} rotation={[0, -Math.PI / 4 + barn.rotation * Math.PI / 2, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.8, 1.35, depth * 0.8]} />
        <meshStandardMaterial color={selected ? "#efbd78" : colors[barn.type]} emissive={selected ? "#8d6336" : "#000000"} emissiveIntensity={selected ? 0.18 : 0} flatShading />
      </mesh>
      <mesh position={[0, 1.48, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[width * 0.96, 0.16, depth * 0.96]} />
        <meshStandardMaterial color="#d96655" flatShading />
      </mesh>
      <mesh position={[0, 0.46, 0.69]} castShadow>
        <boxGeometry args={[0.62, 0.88, 0.06]} />
        <meshStandardMaterial color="#95613f" flatShading />
      </mesh>
      <mesh position={[0, 1.52, 0.69]}>
        <boxGeometry args={[0.34, 0.34, 0.045]} />
        <meshStandardMaterial color="#71c9d1" flatShading />
      </mesh>
      {readyCount > 0 && <group position={[0.58, 1.8, 0.2]}><mesh><sphereGeometry args={[0.2, 10, 8]} /><meshBasicMaterial color="#4fba67" /></mesh><Html center distanceFactor={9}><span className="world-ready-count">{readyCount}</span></Html></group>}
      <Html position={[0, 1.97, 0]} center distanceFactor={12}><span className="world-object-label">{BARNS[barn.type].name}</span></Html>
    </group>
  );
}

function FeedMillBuilding({ machine, selected = false, now, onSelect }: { machine: MachineState; selected?: boolean; now: number; onSelect: () => void }) {
  const color = machine.type === "bakery" || machine.type === "flour-mill" ? "#cf8650" : machine.type === "juice-press" || machine.type === "oil-press" ? "#82a95a" : machine.type === "dairy" || machine.type === "jam-kitchen" ? "#b98bb5" : "#bb7650";
  const working = Boolean(machine.job && now < machine.job.readyAt);
  const ready = Boolean(machine.job && now >= machine.job.readyAt);
  const progress = machine.job?.startedAt ? Math.min(1, Math.max(0, (now - machine.job.startedAt) / (machine.job.readyAt - machine.job.startedAt))) : ready ? 1 : 0;
  const isBakery = machine.type === "bakery";
  const baking = working && progress >= 0.46 && progress < 0.82;
  const cooling = isBakery && working && progress >= 0.82;
  const footprint = machineFootprint(machine.type);
  const position: [number, number, number] = [(machine.x + (footprint - 1) / 2) * 1.6 - 0.05, 0, (machine.z + (footprint - 1) / 2) * 1.6 + 0.35];
  const wheel = useRef<THREE.Group>(null);
  const ingredient = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (wheel.current) wheel.current.rotation.z = working ? clock.elapsedTime * 2.4 : Math.sin(clock.elapsedTime * 0.5) * 0.04;
    if (ingredient.current) { ingredient.current.visible = working; ingredient.current.position.x = -0.43 + ((clock.elapsedTime * 0.35) % 0.86); }
  });
  return <group position={position} rotation={[0, -Math.PI / 8 + (machine.rotation ?? 0) * Math.PI / 2, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
    <mesh position={[0, 0.27, 0]} castShadow receiveShadow><boxGeometry args={[1.05, 0.48, 0.82]} /><meshStandardMaterial color={color} flatShading /></mesh>
    <mesh position={[0, 0.78, 0]} castShadow><cylinderGeometry args={[0.38, 0.48, 0.55, 7]} /><meshStandardMaterial color="#e7bd69" flatShading /></mesh>
    <mesh position={[0, 1.13, 0]} castShadow><coneGeometry args={[0.46, 0.3, 7]} /><meshStandardMaterial color={selected ? "#e5bd69" : "#d96655"} flatShading /></mesh>
    <group ref={wheel} position={[0.48, 0.79, 0.02]} rotation={[0, 0, Math.PI / 2]}><mesh castShadow><torusGeometry args={[0.23, 0.045, 5, 8]} /><meshStandardMaterial color="#95613f" flatShading /></mesh><mesh><boxGeometry args={[0.055, 0.46, 0.045]} /><meshStandardMaterial color="#95613f" flatShading /></mesh></group>
    <mesh position={[0, 0.53, 0.43]} castShadow><boxGeometry args={[0.24, 0.34, 0.025]} /><meshStandardMaterial color={isBakery && baking ? "#e59455" : cooling ? "#aa7c57" : "#6f4938"} emissive={isBakery && baking ? "#d77836" : "#000000"} emissiveIntensity={isBakery && baking ? 0.5 + Math.sin(now / 180) * 0.12 : 0} flatShading /></mesh>
    <mesh ref={ingredient} position={[-0.4, 0.55, 0.47]}><sphereGeometry args={[0.075, 6, 5]} /><meshStandardMaterial color="#f4d879" emissive="#d2a944" emissiveIntensity={0.7} /></mesh>
    <mesh position={[0, 1.27, 0]}><sphereGeometry args={[0.065, 7, 5]} /><meshStandardMaterial color={ready ? "#a6d36d" : working ? "#e6bc62" : "#81957b"} emissive={ready ? "#7ea846" : working ? "#c38d3b" : "#000000"} emissiveIntensity={ready || working ? 0.65 : 0} /></mesh>
    {isBakery && ready && <group position={[0.42, 0.48, 0.49]}><mesh castShadow><sphereGeometry args={[0.14, 8, 6]} /><meshStandardMaterial color="#bc7840" flatShading /></mesh><mesh position={[0.02, 0.07, 0.04]}><sphereGeometry args={[0.035, 5, 4]} /><meshStandardMaterial color="#e5c987" /></mesh></group>}
    {isBakery && baking && <group position={[0, 1.34, 0]}><mesh position={[-0.12, 0.1, 0]}><sphereGeometry args={[0.035, 5, 4]} /><meshBasicMaterial color="#fff0d6" transparent opacity={0.42} /></mesh><mesh position={[0.1, 0.19, 0]}><sphereGeometry args={[0.05, 5, 4]} /><meshBasicMaterial color="#fff0d6" transparent opacity={0.26} /></mesh></group>}
    {cooling && <group position={[0, 1.37, 0]}><mesh position={[-0.12, 0.1, 0]}><sphereGeometry args={[0.04, 5, 4]} /><meshBasicMaterial color="#effbff" transparent opacity={0.38} /></mesh><mesh position={[0.12, 0.2, 0]}><sphereGeometry args={[0.05, 5, 4]} /><meshBasicMaterial color="#effbff" transparent opacity={0.25} /></mesh></group>}
  </group>;
}

function Chicken({ position }: { position: [number, number, number] }) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (body.current) {
      body.current.position.set(position[0] + Math.sin(time * 0.36) * 0.24, 0.08 + Math.abs(Math.sin(time * 2.1)) * 0.035, position[2] + Math.cos(time * 0.28) * 0.2);
      body.current.rotation.y = Math.sin(time * 0.36 + 1) * 0.32;
    }
    const peck = Math.max(0, Math.sin(time * 1.2 - 0.7)) ** 9;
    if (head.current) head.current.rotation.z = -peck * 0.55;
    if (leftWing.current) leftWing.current.rotation.x = Math.sin(time * 3) * 0.08;
    if (rightWing.current) rightWing.current.rotation.x = -Math.sin(time * 3) * 0.08;
  });
  return (
    <group ref={body} position={position}>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.34, 12]} /><meshBasicMaterial color="#53734b" transparent opacity={0.18} /></mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.32, 12, 8]} />
        <meshStandardMaterial color="#fff2d2" flatShading />
      </mesh>
      <mesh position={[-0.27, 0.36, -0.02]} rotation={[0, 0, -0.8]} castShadow><coneGeometry args={[0.13, 0.34, 5]} /><meshStandardMaterial color="#e8c8a2" flatShading /></mesh>
      <group ref={head} position={[0.2, 0.49, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow><sphereGeometry args={[0.19, 10, 7]} /><meshStandardMaterial color="#fff2d2" flatShading /></mesh>
        <mesh position={[0.12, 0.08, 0.16]}><sphereGeometry args={[0.028, 6, 5]} /><meshStandardMaterial color="#344a35" /></mesh>
        <mesh position={[0.12, 0.08, -0.16]}><sphereGeometry args={[0.028, 6, 5]} /><meshStandardMaterial color="#344a35" /></mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.07, 0.2, 5]} /><meshStandardMaterial color="#e9a34a" flatShading /></mesh>
        <mesh position={[-0.025, 0.22, 0]}><sphereGeometry args={[0.075, 6, 4]} /><meshStandardMaterial color="#d96655" flatShading /></mesh>
      </group>
      <mesh ref={leftWing} position={[-0.02, 0.28, 0.25]} rotation={[0.1, 0, -0.1]} castShadow><sphereGeometry args={[0.19, 8, 6]} /><meshStandardMaterial color="#f3dfbc" flatShading /></mesh>
      <mesh ref={rightWing} position={[-0.02, 0.28, -0.25]} rotation={[-0.1, 0, -0.1]} castShadow><sphereGeometry args={[0.19, 8, 6]} /><meshStandardMaterial color="#f3dfbc" flatShading /></mesh>
      {[-0.1, 0.1].map((z) => <group key={z} position={[0.03, 0.08, z]}><mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.018, 0.018, 0.16, 5]} /><meshStandardMaterial color="#d58e3a" /></mesh><mesh position={[0.035, -0.11, 0]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.014, 0.014, 0.1, 5]} /><meshStandardMaterial color="#d58e3a" /></mesh></group>)}
    </group>
  );
}

function Butterfly({ position, color, phase }: { position: [number, number, number]; color: string; phase: number }) {
  const flight = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.8 + phase;
    if (flight.current) {
      flight.current.position.set(position[0] + Math.sin(t) * 0.62, position[1] + Math.sin(t * 2.1) * 0.14, position[2] + Math.cos(t * 0.72) * 0.46);
      flight.current.rotation.y = Math.sin(t + 0.8) * 0.48;
      flight.current.rotation.z = Math.cos(t * 1.4) * 0.12;
    }
    const flap = Math.sin(clock.elapsedTime * 16 + phase) * 0.7;
    if (left.current) left.current.rotation.z = flap;
    if (right.current) right.current.rotation.z = -flap;
  });
  return <group ref={flight} position={position}>
    <mesh><capsuleGeometry args={[0.018, 0.09, 3, 5]} /><meshStandardMaterial color="#594b3a" /></mesh>
    <mesh ref={left} position={[-0.045, 0.025, 0]} scale={[0.9, 1, 0.16]}><sphereGeometry args={[0.065, 6, 4]} /><meshStandardMaterial color={color} side={THREE.DoubleSide} /></mesh>
    <mesh ref={right} position={[0.045, 0.025, 0]} scale={[0.9, 1, 0.16]}><sphereGeometry args={[0.065, 6, 4]} /><meshStandardMaterial color={color} side={THREE.DoubleSide} /></mesh>
  </group>;
}

function Flowers() {
  const flowers = [[-3.9, 0.08, -1.7], [-3.6, 0.08, 2.1], [3.9, 0.08, 2.1], [1.15, 0.08, 3.7]] as const;
  return <>{flowers.map(([x, y, z], index) => <mesh key={`${x}-${z}`} position={[x, y, z]} castShadow>
    <sphereGeometry args={[0.09, 6, 4]} />
    <meshStandardMaterial color={index % 2 ? "#fff2d2" : "#edb861"} flatShading />
  </mesh>)}</>;
}

function WeatherParticles({ weather }: { weather: WeatherId }) {
  const drops = useRef<THREE.Group>(null);
  const count = weather === "rain" || weather === "storm" ? 32 : weather === "snow" ? 24 : 0;
  useFrame(({ clock }) => {
    if (!drops.current) return;
    drops.current.children.forEach((drop, index) => {
      const phase = (clock.elapsedTime * (weather === "snow" ? 0.2 : 1.25) + index * 0.137) % 1;
      drop.position.y = 5 - phase * 5;
      drop.position.x = Math.sin(index * 2.2 + clock.elapsedTime * 0.2) * 4;
      drop.position.z = Math.cos(index * 1.7) * 3.8;
    });
  });
  if (!count) return null;
  return <group ref={drops}>{Array.from({ length: count }, (_, index) => <mesh key={index} position={[0, 0, 0]} rotation={[weather === "snow" ? 0 : 0.15, 0, 0]}><sphereGeometry args={[weather === "snow" ? 0.045 : 0.018, 5, 4]} /><meshBasicMaterial color={weather === "snow" ? "#f8fbff" : "#9ed9ed"} transparent opacity={weather === "snow" ? 0.8 : 0.55} /></mesh>)}</group>;
}

function FarmAnimal({ animal, index, position }: { animal: AnimalState; index: number; position: [number, number, number] }) {
  const body = useRef<THREE.Group>(null);
  const colors: Record<AnimalState["type"], string> = { chicken: "#fff0d1", cow: "#eee8dc", goat: "#dac9a8", duck: "#efc85d", bee: "#e5b947", sheep: "#f1eee5", pig: "#e9a9a3", dog: "#ad835a", horse: "#76513b" };
  useFrame(({ clock }) => { if (body.current) { body.current.position.x = position[0] + Math.sin(clock.elapsedTime * 0.32 + index) * 0.14; body.current.position.y = 0.08 + Math.abs(Math.sin(clock.elapsedTime * 2 + index)) * 0.025; } });
  return <group ref={body} position={position}><mesh position={[0, 0.24, 0]} castShadow><sphereGeometry args={[animal.type === "cow" ? 0.31 : 0.23, 9, 6]} /><meshStandardMaterial color={colors[animal.type]} flatShading /></mesh><mesh position={[0.2, 0.35, 0]} castShadow><sphereGeometry args={[0.14, 8, 6]} /><meshStandardMaterial color={colors[animal.type]} flatShading /></mesh>{animal.type === "cow" && <><mesh position={[-0.1, 0.31, 0.2]}><sphereGeometry args={[0.095, 6, 4]} /><meshStandardMaterial color="#655b50" /></mesh><mesh position={[0.14, 0.22, -0.16]}><sphereGeometry args={[0.08, 6, 4]} /><meshStandardMaterial color="#655b50" /></mesh></>}{[[-0.12, 0.11, 0.12], [0.12, 0.11, 0.12], [-0.12, 0.11, -0.12], [0.12, 0.11, -0.12]].map(([x, y, z], leg) => <mesh key={leg} position={[x, y, z]}><cylinderGeometry args={[0.035, 0.035, 0.2, 5]} /><meshStandardMaterial color="#8c765f" /></mesh>)}</group>;
}

type OrbitController = { target: THREE.Vector3; object: THREE.Camera; update: () => void; dollyIn: (scale: number) => void; dollyOut: (scale: number) => void };
function CameraHud() {
  const { controls: rawControls } = useThree();
  const controls = rawControls as unknown as OrbitController | null;
  const changeZoom = (factor: number) => { if (!controls) return; if (factor < 1) controls.dollyIn(1.2); else controls.dollyOut(1.2); controls.update(); };
  const rotate = (angle: number) => { if (!controls) return; const position = controls.object.position.clone().sub(controls.target); position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle); controls.object.position.copy(controls.target).add(position); controls.update(); };
  const reset = () => { if (!controls) return; controls.target.set(0, 0.35, 0); controls.object.position.set(8, 10, 11); controls.update(); };
  return <Html fullscreen><div className="camera-hud" aria-label="Kontrol kamera"><button type="button" aria-label="Perkecil peta" onClick={() => changeZoom(1)}>−</button><button type="button" aria-label="Perbesar peta" onClick={() => changeZoom(-1)}>+</button><button type="button" aria-label="Putar kamera ke kiri" onClick={() => rotate(Math.PI / 12)}>↶</button><button type="button" aria-label="Putar kamera ke kanan" onClick={() => rotate(-Math.PI / 12)}>↷</button><button type="button" aria-label="Atur ulang kamera" onClick={reset}>⌖</button></div></Html>;
}

function SceneContent({ onSelectPlot, selectedPlot, plots: farmPlots, machines, barns, animals, mapId, seasonStartedAt, now, weather, placementPreview, maxCameraDistance = 24 }: FarmCanvasProps) {
  const plotPositions = farmPlots.map((plot) => ({ label: plot.id, position: [plot.x * 1.6 - 0.05, 0, plot.z * 1.6 + 0.35] as [number, number, number], plot }));
  const worldSize = Math.max(5.6, ...farmPlots.map((plot) => Math.max(Math.abs(plot.x), Math.abs(plot.z)) * 1.8 + 3), ...machines.map((machine) => Math.max(Math.abs(machine.x), Math.abs(machine.z)) * 1.8 + 3), ...barns.map((barn) => Math.max(Math.abs(barn.x), Math.abs(barn.z)) * 1.8 + 3));
  const map = MAPS.find((item) => item.id === mapId)!;
  const season = seasonAt(map, seasonStartedAt, now);
  const palette = SEASON_COLORS[season];
  const sky = map.theme === "tropical" ? "#c4e4df" : map.theme === "desert" ? "#efddb6" : map.theme === "coastal" ? "#c3e5ec" : palette.sky;
  const select = (label: string) => onSelectPlot(label);

  return (
    <>
      <color attach="background" args={[sky]} />
      <hemisphereLight intensity={2.1} color="#fff5d9" groundColor="#77925b" />
      <directionalLight position={[-5, 9, 6]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
      <group rotation={[0, 0.18, 0]}>
        <Meadow size={worldSize} grass={palette.grass} soil={palette.soil} />
        {barns.map((barn) => {
          const readyCount = animals.filter((animal) => (animal.barnId === barn.id || (!animal.barnId && barn.type === "chicken-coop")) && animal.readyAt && animal.readyAt <= now).length;
          return <Barn key={barn.id} barn={barn} onSelect={() => onSelectPlot(`barn:${barn.id}`)} selected={selectedPlot === `barn:${barn.id}`} readyCount={readyCount} />;
        })}
        {machines.map((machine) => <FeedMillBuilding machine={machine} key={machine.id} now={now} selected={selectedPlot === machine.id} onSelect={() => onSelectPlot(machine.id)} />)}
        {placementPreview && (() => { const width = placementPreview.kind === "machine" ? machineFootprint(placementPreview.type) : barnFootprint(placementPreview.type, placementPreview.rotation)[0]; const depth = placementPreview.kind === "machine" ? machineFootprint(placementPreview.type) : barnFootprint(placementPreview.type, placementPreview.rotation)[1]; return <mesh position={[(placementPreview.x + (width - 1) / 2) * 1.6 - 0.05, 0.035, (placementPreview.z + (depth - 1) / 2) * 1.6 + 0.35]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[width * 1.45, depth * 0.86]} /><meshBasicMaterial color={placementPreview.valid ? "#63d57c" : "#ef6b63"} transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>; })()}
        {animals.map((animal, index) => { const barn = barns.find((item) => item.id === animal.barnId) ?? barns[0]; const position: [number, number, number] = barn ? [(barn.x + 0.15 + (index % 3) * 0.25) * 1.6 - 0.05, 0.08, (barn.z + 0.1 + Math.floor(index % 6 / 3) * 0.25) * 1.6 + 0.35] : [1.1, 0.08, 2.1]; return <FarmAnimal key={animal.id} animal={animal} index={index} position={position} />; })}
        {plotPositions.map((entry) => {
            const state = entry.plot;
          const progress = state ? cropProgress(state, now) : 0;
          return <group key={entry.label} position={entry.position}>
            <Plot position={[0, 0, 0]} label={entry.label} selected={selectedPlot === entry.label} soil={SEASON_COLORS[seasonAt(map, seasonStartedAt, now, entry.plot.x)].soil} onSelect={() => select(entry.label)} />
            {state?.kind === "blocked" && <RockPile onSelect={() => select(entry.label)} />}
            {(state?.kind === "growing" || state?.kind === "ready") && <CropRows progress={progress} crop={state.crop ?? "wheat"} onSelect={() => select(entry.label)} />}
          </group>;
        })}
        {map.theme === "frostpeak" && <group position={[0, 0, -worldSize * 0.6]}><mesh position={[-2.2, 1.2, 0]}><coneGeometry args={[1.5, 3, 5]} /><meshStandardMaterial color="#b9cbd2" flatShading /></mesh><mesh position={[-2.2, 2.0, 0]}><coneGeometry args={[0.7, 1.35, 5]} /><meshStandardMaterial color="#f5f8f5" flatShading /></mesh></group>}
        {map.theme === "desert" && <mesh position={[1.3, 0.01, 2.8]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.2, 12]} /><meshStandardMaterial color="#64b8b4" roughness={0.22} /></mesh>}
        {map.theme === "coastal" && <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[worldSize + 0.1, worldSize + 1.8, 8]} /><meshStandardMaterial color="#72c7d3" side={THREE.DoubleSide} /></mesh>}
        <Tree position={[-3.1, 0, -2.05]} scale={0.9} />
        <Tree position={[3.45, 0, -0.95]} scale={0.72} />
        <Tree position={[2.6, 0, 2.3]} scale={0.62} />
        {animals.length === 0 && <Chicken position={[1.05, 0.08, 2.18]} />}
        <Flowers />
        <Butterfly position={[-2.55, 1.2, 0.45]} color="#efbc65" phase={0.2} />
        <Butterfly position={[2.85, 1.55, 1.75]} color="#e88b79" phase={2.4} />
      </group>
      <WeatherParticles weather={weather} />
      <OrbitControls makeDefault enablePan enableRotate enableZoom minDistance={7} maxDistance={maxCameraDistance} minPolarAngle={0.55} maxPolarAngle={1.35} minZoom={35} maxZoom={100} mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }} touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }} />
      <CameraHud />
    </>
  );
}

export default function FarmCanvas({ onSelectPlot, selectedPlot, plots: farmPlots, machines, barns, animals, mapId, seasonStartedAt, now, weather, placementPreview }: FarmCanvasProps) {
  const maxCameraDistance = Math.max(24, ...farmPlots.map((plot) => Math.max(Math.abs(plot.x), Math.abs(plot.z)) * 2.8), ...machines.map((machine) => Math.max(Math.abs(machine.x), Math.abs(machine.z)) * 2.8), ...barns.map((barn) => Math.max(Math.abs(barn.x), Math.abs(barn.z)) * 2.8));
  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [8, 10, 11], zoom: 65, near: 0.1, far: 100 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
      dpr={[1, 1.5]}
    >
      <SceneContent onSelectPlot={onSelectPlot} selectedPlot={selectedPlot} plots={farmPlots} machines={machines} barns={barns} animals={animals} mapId={mapId} seasonStartedAt={seasonStartedAt} now={now} weather={weather} placementPreview={placementPreview} maxCameraDistance={maxCameraDistance} />
    </Canvas>
  );
}

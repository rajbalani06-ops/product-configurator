import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Fragment, useMemo } from "react";
import * as THREE from "three";
import { useConfigurator } from "../state/store";
import type { SurfaceId, SurfaceCustomization } from "../types/config";

function makeTexture(surface?: SurfaceCustomization) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = surface?.color || "#e9e4da";
  ctx.fillRect(0, 0, 512, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  for (const art of surface?.artworks || []) {
    ctx.save();
    ctx.translate((art.x / 100) * 512, (art.y / 100) * 256);
    ctx.rotate((art.rotation * Math.PI) / 180);
    ctx.scale(art.scale, art.scale);
    if (art.kind === "text") {
      ctx.fillStyle = art.color;
      ctx.font = `700 ${art.fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(art.text || "", 0, 0, 440);
    } else if (art.src) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate((art.x / 100) * 512, (art.y / 100) * 256);
        ctx.rotate((art.rotation * Math.PI) / 180);
        ctx.scale(art.scale, art.scale);
        ctx.drawImage(img, -75, -45, 150, 90);
        ctx.restore();
        texture.needsUpdate = true;
      };
      img.src = art.src;
    }
    ctx.restore();
  }
  texture.needsUpdate = true;
  return texture;
}

type Point3 = [number, number, number];
function FrameBeam({
  start,
  end,
  radius,
  color = "#b7b7ad",
}: {
  start: Point3;
  end: Point3;
  radius: number;
  color?: string;
}) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(b, a).normalize();
  const position = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction,
  );
  return (
    <mesh position={position} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, a.distanceTo(b), 10]} />
      <meshStandardMaterial color={color} metalness={0.48} roughness={0.38} />
    </mesh>
  );
}

function Tent() {
  const config = useConfigurator((s) => s.config);
  const textures = useMemo(
    () =>
      Object.fromEntries(
        (["roof", "valance", "left", "right", "back"] as SurfaceId[]).map(
          (id) => [id, makeTexture(config.surfaces[id])],
        ),
      ) as Record<SurfaceId, THREE.CanvasTexture>,
    [config.surfaces],
  );
  const corners: Point3[] = [
    [-1.78, 2.18, -1.78],
    [-1.78, 2.18, 1.78],
    [1.78, 2.18, -1.78],
    [1.78, 2.18, 1.78],
  ];
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, 2.835, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.66, 1.15, 4, 1]} />
        <meshStandardMaterial
          map={textures.roof}
          color="#cfc3ae"
          roughness={0.86}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 2.26, 0]}>
        <boxGeometry args={[3.76, 0.1, 3.76]} />
        <meshStandardMaterial
          map={textures.roof}
          color="#c7bead"
          roughness={0.92}
        />
      </mesh>
      <mesh position={[0, 2.05, 1.84]}>
        <boxGeometry args={[3.75, 0.34, 0.08]} />
        <meshStandardMaterial map={textures.valance} color="white" />
      </mesh>
      <mesh position={[0, 2.05, -1.84]}>
        <boxGeometry args={[3.75, 0.34, 0.08]} />
        <meshStandardMaterial map={textures.back} color="white" />
      </mesh>
      <mesh position={[-1.84, 2.05, 0]}>
        <boxGeometry args={[0.08, 0.34, 3.75]} />
        <meshStandardMaterial map={textures.valance} color="white" />
      </mesh>
      <mesh position={[1.84, 2.05, 0]}>
        <boxGeometry args={[0.08, 0.34, 3.75]} />
        <meshStandardMaterial map={textures.valance} color="white" />
      </mesh>
      {config.sidewalls.startsWith("three") && (
        <>
          <mesh position={[0, 1.1, -1.77]}>
            <boxGeometry args={[3.5, 1.75, 0.035]} />
            <meshStandardMaterial
              map={textures.back}
              color="white"
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-1.77, 1.1, 0]}>
            <boxGeometry args={[0.035, 1.75, 3.5]} />
            <meshStandardMaterial
              map={textures.left}
              color="white"
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      {config.sidewalls !== "none" && (
        <mesh position={[1.77, 1.1, 0]}>
          <boxGeometry args={[0.035, 1.75, 3.5]} />
          <meshStandardMaterial
            map={textures.right}
            color="white"
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {config.halfWalls !== "none" && (
        <>
          <mesh position={[-1.77, 0.52, 0]}>
            <boxGeometry args={[0.035, 0.9, 3.5]} />
            <meshStandardMaterial
              map={textures.left}
              color="white"
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[1.77, 0.52, 0]}>
            <boxGeometry args={[0.035, 0.9, 3.5]} />
            <meshStandardMaterial
              map={textures.right}
              color="white"
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      {config.variant !== "canopy-only" && (
        <>
          {corners.map(([x, , z]) => (
            <FrameBeam
              key={`leg-${x}-${z}`}
              start={[x, 0.04, z]}
              end={[x, 2.18, z]}
              radius={0.045}
            />
          ))}
          {[-1, 1].map((side) => (
            <Fragment key={`rails-${side}`}>
              <FrameBeam
                start={[-1.78, 2.18, side * 1.78]}
                end={[1.78, 2.18, side * 1.78]}
                radius={0.03}
              />
              <FrameBeam
                start={[side * 1.78, 2.18, -1.78]}
                end={[side * 1.78, 2.18, 1.78]}
                radius={0.03}
              />
            </Fragment>
          ))}
          {corners.map(([x, , z]) => (
            <FrameBeam
              key={`rafter-${x}-${z}`}
              start={[x, 2.2, z]}
              end={[0, 3.29, 0]}
              radius={0.028}
            />
          ))}
          <mesh position={[0, 3.29, 0]}>
            <sphereGeometry args={[0.085, 12, 8]} />
            <meshStandardMaterial
              color="#9fa198"
              metalness={0.45}
              roughness={0.4}
            />
          </mesh>
        </>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#e8e7e1" />
      </mesh>
    </group>
  );
}

export function TentPreview() {
  const active = useConfigurator((s) => s.activeSurface);
  return (
    <div className="three-canvas">
      <Canvas shadows camera={{ position: [5.8, 5.1, 7.4], fov: 42 }}>
        <color attach="background" args={["#f1f0eb"]} />
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Tent />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.3}
          blur={2.5}
          scale={9}
        />
        <Environment preset="city" />
        <OrbitControls
          makeDefault
          target={[0, 1.35, 0]}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="orbit-note">Drag to rotate · Scroll to zoom</div>
      <div className="preview-surface-pill">Viewing · {active}</div>
    </div>
  );
}

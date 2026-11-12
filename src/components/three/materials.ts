import * as THREE from "three";

export interface ArmMaterials {
  graphite: THREE.MeshStandardMaterial;
  darkMetal: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  casing: THREE.MeshStandardMaterial;
  limeAccent: THREE.MeshStandardMaterial;
  gripPad: THREE.MeshStandardMaterial;
}

export function createArmMaterials(): ArmMaterials {
  return {
    graphite: new THREE.MeshStandardMaterial({
      color: "#2C313A",
      metalness: 0.72,
      roughness: 0.34,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: "#1A1D23",
      metalness: 0.78,
      roughness: 0.3,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: "#6C7482",
      metalness: 0.86,
      roughness: 0.24,
    }),
    casing: new THREE.MeshStandardMaterial({
      color: "#383E48",
      metalness: 0.68,
      roughness: 0.36,
    }),
    limeAccent: new THREE.MeshStandardMaterial({
      color: "#A3E635",
      emissive: "#84CC16",
      emissiveIntensity: 0.45,
      metalness: 0.2,
      roughness: 0.3,
    }),
    gripPad: new THREE.MeshStandardMaterial({
      color: "#111317",
      metalness: 0.1,
      roughness: 0.85,
    }),
  };
}

export function disposeArmMaterials(materials: ArmMaterials): void {
  Object.values(materials).forEach((material) => material.dispose());
}

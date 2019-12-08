import * as BABYLON from 'babylonjs';

export function createSkybox(scene: BABYLON.Scene): BABYLON.AbstractMesh {
  const skyboxMesh = BABYLON.Mesh.CreateBox('skyBox', 1000, scene);
  skyboxMesh.infiniteDistance = true;
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    process.env.PUBLIC_URL + '/assets/skyboxes/SpaceLightBlue/SpaceLightBlue',
    scene,
    ['_ft.png', '_up.png', '_rt.png', '_bk.png', '_dn.png', '_lf.png']
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skyboxMesh.material = skyboxMaterial;

  return skyboxMesh;
}

<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>


// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onBeforeMount, onMounted, } from 'vue';

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MzRmZjA5NC1lMmE5LTQyY2YtODE3NC03MWNjZTAwZWQxYTciLCJpZCI6NDExNzg4LCJpYXQiOjE3NzQ5NTQ2MDZ9.0wE9CHDSqYmhr6bqTjx7A7tYaLMevxdWCPefZHVBs_Y';
let viewer = null;
// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
onMounted( async()=>{
  const viewer = new Viewer('cesiumContainer');
  viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  orientation: {
    heading: CesiumMath.toRadians(0.0),
    pitch: CesiumMath.toRadians(-15.0),
  }
});
const buildingTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);   
})    

onBeforeMount(()=>{

  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy();
    viewer = null;
  }
})
</script>

<style scoped>
/* 确保容器占满全屏 */
#cesiumContainer {
  width: 80vw;
  height: 80vh;
  margin: 0;
  padding: 0;
  
}
/* 确保容器占满全屏 */
*{
  margin: auto;
  padding: auto;
}


</style>
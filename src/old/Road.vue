<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>


// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onBeforeMount, onMounted, } from 'vue';
import * as Cesium from 'cesium'

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MzRmZjA5NC1lMmE5LTQyY2YtODE3NC03MWNjZTAwZWQxYTciLCJpZCI6NDExNzg4LCJpYXQiOjE3NzQ5NTQ2MDZ9.0wE9CHDSqYmhr6bqTjx7A7tYaLMevxdWCPefZHVBs_Y';
let viewer = null;

//设置cesium默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  //西边的经度
  100.5,
  //南边的纬度
  20.4,
  //东边的经度
  110.4,
  //北边的纬度
  61.2
)

//创建viewer
onMounted(async () => {


  const viewer = new Viewer('cesiumContainer', {
    //信息框是否可见
    infoBox: false,
    //搜索框是否可见
    geocoder: false,
    homeButton: false, //home键显示控制
    sceneModePicker: false, //是否显示控制查看器的显示方式
    baseLayerPicker: false, //是否显示图层选择
    navigationHelpButton: false, //是否显示帮助按钮
    timeline: false,  //是否显示时间条
    animation: false, //是否显示播放器
    fullscreenButton: false, //是否显示全屏浏览按钮  
    imageryProvider: false,  // 先不加载默认影像，后面手动添加
    terrain: Terrain.fromWorldTerrain(),  //加载高程
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX:
          "public/testure/sky/px.png",
        negativeX:
          'public/testure/sky/nx.png',
        positiveY:
          "public/testure/sky/py.png",
        negativeY:
          "public/testure/sky/ny.png",
        positiveZ:
          "public/testure/sky/pz.png",
        negativeZ:
          "public/testure/sky/nz.png"
      }

    }),
  });
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(120.4675, 31.5843, 1300),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-90.0),
    }
  });

  const CampusImgProvideer = new Cesium.WebMapServiceImageryProvider({
    url: 'https://localhost:6443/arcgis/services/roadWMS/MapServer/WMSServer?',
    layers: '0',
    crs: 'EPSG:4326',
    parameters: {
      service: 'WMS',
      format: 'image/png',
      transparent: true
    }
    // 最小缩放级别
  });
  // 4. 将影像图层添加到Viewer中
  viewer.imageryLayers.addImageryProvider(CampusImgProvideer);
  const CampusRoadProvideer = new Cesium.WebMapServiceImageryProvider({
    url: 'https://localhost:6443/arcgis/services/CampusrRoad/MapServer/WMSServer?',
    layers: '0',
    crs: 'EPSG:4326',
    parameters: {
      service: 'WMS',
      format: 'image/png',
      transparent: true
    }
    // 最小缩放级别
  });
  // 4. 将影像图层添加到Viewer中
  viewer.imageryLayers.addImageryProvider(CampusRoadProvideer);
// 设置地球整体透明
viewer.scene.globe.showGroundAtmosphere = false;  // 关闭地面大气层
viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;  // 地球基底设为全透
viewer.scene.globe.translucency.enabled = true;  // 启用透明渲染
viewer.scene.globe.undergroundColor = undefined;  // 禁用地下着色

// 设置场景背景透明（便于显示自定义背景）
viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
viewer.scene.skyBox.show = false


})



//销毁viewer
onBeforeMount(() => {

  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy();
    viewer = null;
  }
})
</script>

<style scoped>
/* 确保容器占满全屏 */
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;

}

/* 确保容器占满全屏 */
* {
  margin: auto;
  padding: auto;
}
</style>
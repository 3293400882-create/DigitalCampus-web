<template>
  <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

// 1. 设置静态资源路径（必须在导入 Cesium 之前）
window.CESIUM_BASE_URL = '/cesium'

// 2. 导入 Cesium 和样式
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

let viewer = null
window.CESIUM_BASE_URL='/'
onMounted(() => {
  // 3. 完全离线配置：不使用任何 Ion 服务
  viewer = new Cesium.Viewer('cesiumContainer', {
    // 基础影像：高德影像（无需 token）
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      maximumLevel: 18
    }),
    // 地形：使用椭球体地形（无真实地形，但不会请求网络）
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    // 关闭所有依赖 Ion 的组件
    baseLayerPicker: false,      // 关闭底图选择器（避免切换回 Ion）
    geocoder: false,             // 关闭地理编码（依赖 Ion）
    globe: true,
    // 可选：关闭时间轴、动画等
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    sceneModePicker: true
  })

  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.40, 39.90, 10000000)
  })

  // 添加标记点
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.40, 39.90, 1000),
    point: {
      color: Cesium.Color.RED,
      pixelSize: 15,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    },
    label: {
      text: '北京',
      font: '16px sans-serif',
      fillColor: Cesium.Color.BLACK,
      pixelOffset: new Cesium.Cartesian2(0, -20)
    }
  })
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<style>
  * {
      margin: 0;
      padding: 0;

  }
.cesiumContainer{
  width: 100vw;
  height: 100vh;
}

</style>
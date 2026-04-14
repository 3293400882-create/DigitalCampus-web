<template>
  <div class="map-layout">
    <!-- 侧边控制面板 -->
    <div class="control-panel">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="title">地图标注</span>
            <div class="header-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click="getAndDarw(nodes)"
                :disabled="nodes.length < 2"
              >
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                plain
                @click="restart"
              >
                <el-icon><RefreshRight /></el-icon>
                重置
              </el-button>
            </div>
          </div>
        </template>

        <div class="table-container">
          <el-table 
            :data="nodes" 
            border 
            size="small"
            max-height="calc(100vh - 280px)"
            highlight-current-row
          >
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="x" label="X坐标" min-width="100" show-overflow-tooltip>
              <template #default="scope">
                <span class="coord-value">{{ scope.row.x.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="y" label="Y坐标" min-width="100" show-overflow-tooltip>
              <template #default="scope">
                <span class="coord-value">{{ scope.row.y.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70" align="center" fixed="right">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  circle
                  @click="removePoint(scope.$index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 空状态提示 -->
          <el-empty 
            v-if="nodes.length === 0" 
            description="请在地图上点击添加起点和站点"
            :image-size="80"
          />
        </div>

        <!-- 统计信息 -->
        <div class="stats-bar" v-if="nodes.length > 0">
          <el-tag size="small" type="info">共 {{ nodes.length }} 个点</el-tag>
          <el-tag size="small" type="success" v-if="nodes.length >= 2">可查询路径</el-tag>
        </div>
      </el-card>
    </div>

    <!-- 地图容器 -->
    <div id="cesiumContainer" ref="cesiumContainer" class="map-container"></div>
  </div>
</template>

<script setup>

window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onBeforeMount, onMounted, ref, } from 'vue';
import * as Cesium from 'cesium'
import { getMinPathService } from '@/api/minPath';
import { wgs84ToMercator, batchWgs84ToMercator } from '@/utils/coordUtils'
import { useCesiumClick } from '@/utils/useCesiumClick';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MzRmZjA5NC1lMmE5LTQyY2YtODE3NC03MWNjZTAwZWQxYTciLCJpZCI6NDExNzg4LCJpYXQiOjE3NzQ5NTQ2MDZ9.0wE9CHDSqYmhr6bqTjx7A7tYaLMevxdWCPefZHVBs_Y';
let viewer = null;
const nodes=ref([])
const pathEntities = ref([])
//重置组件
const restart=()=>{
console.log(pathEntities.value)
nodes.value=([])
viewer.entities.removeAll()

}

const removePoint = (index) => {
  nodes.value.splice(index, 1)
}
//查询路线并且直接画图
const getAndDarw=async(nodes)=>{

 const minPath = getMinPathService(nodes)
  const coordinates =(await minPath).data.coordinates
  const positions = coordinates.map(c => 
  Cesium.Cartesian3.fromDegrees(c[0], c[1]))
  console.log(positions)
// 画线
const entity=  viewer.entities.add({
  name: 'pathLine',
  polyline: {
    positions: positions,
    width: 6,
    material: Cesium.Color.RED,
    clampToGround: true
  }
})
pathEntities.value.push(entity)
}



//创建viewer
onMounted(async () => {


  viewer = new Viewer('cesiumContainer', {
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
    //terrain: Terrain.fromWorldTerrain(),  //加载高程
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
 useCesiumClick(viewer, (coord) => {
    const mercator =wgs84ToMercator(coord.lon, coord.lat)
    nodes.value.push(mercator)
    //console.log('点击了:', coord.lon, coord.lat)
      // 在点击位置画点
  viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat, 2), // 离地 2 米
  point: {
    pixelSize: 20,                    // 点变大
    color: Cesium.Color.WHITE,        // 纯白色
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND // 相对地面
  },
  label: {
    text: String(nodes.value.length),
    font: 'bold 18px sans-serif',     // 文字变大加粗
    fillColor: Cesium.Color.WHITE,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 3,                  // 描边加粗
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, -25) // 文字上移，避免遮挡
  }
})
    console.log(nodes.value)
    
  })

  
  // 设置地球整体透明
  viewer.scene.globe.showGroundAtmosphere = false;  // 关闭地面大气层
  viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;  // 地球基底设为全透
  viewer.scene.globe.translucency.enabled = true;  // 启用透明渲染
  viewer.scene.globe.undergroundColor = undefined;  // 禁用地下着色

  // 设置场景背景透明（便于显示自定义背景）
  viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
  viewer.scene.skyBox.show = false
  //设置初始相机位置
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(120.4663, 31.577, 600),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-35.0),
    }
  });

  const resource = await Cesium.IonResource.fromAssetId(4610822);
  const dataSource = await Cesium.GeoJsonDataSource.load(resource, {
    stroke: Cesium.Color.YELLOW,        // 线条颜色设为醒目的黄色
    strokeWidth: 6,                     // 线条宽度设为3像素
    //fill: Cesium.Color.RED.withAlpha(0.5) // 面填充为半透明红色
    show:false
  });
  viewer.dataSources.add(dataSource);
  dataSource.show=false
  //加载影像图层
  const layer = viewer.imageryLayers.addImageryProvider(
    await Cesium.IonImageryProvider.fromAssetId(4610826),
  );
  //加载3Dtitles
  viewer.scene.screenSpaceCameraController.enableTilt = false;
  const tileset = viewer.scene.primitives.add(
    await Cesium.Cesium3DTileset.fromIonAssetId(4610780),
  );

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
.map-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 侧边控制面板 */
.control-panel {
width: 380px;
  flex-shrink: 0;
  background: #f5f7fa;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  /* 添加以下两行实现置顶 */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.box-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 表格容器 */
.table-container {
  flex: 1;
  overflow: hidden;
  margin: -12px;
  padding: 12px;
}

/* 坐标数值样式 */
.coord-value {
  font-family: 'Consolas', monospace;
  color: #409eff;
  font-weight: 500;
}

/* 统计栏 */
.stats-bar {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 地图容器 */
.map-container {
  flex: 1;
  position: relative;
  background: #000;
}
/* 确保容器占满全屏 */
#cesiumContainer {
  width: 80vw;
  height: 100vh;
  margin: 0;
  padding: 0;

}

/* 确保容器占满全屏 */
* {
  margin: auto;
  padding: auto;
}



.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

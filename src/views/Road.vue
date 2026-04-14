  <template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        
       
        

        <el-row :gutter="20" style="display: flex; align-items: center; margin-top: 10px;">
             <el-col :span="8">
            <el-form-item label="上课星期">
              <el-select v-model="ClassRoomdata.weekDay" placeholder="请选择上课星期" style="width: 100%">
                <el-option v-for="item in weekDay" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起始时间">
              <el-time-picker v-model="ClassRoomdata.beginTime" value-format="HH:mm:ss" format="HH:mm:ss"
                placeholder="起始时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-time-picker v-model="ClassRoomdata.endTime" value-format="HH:mm:ss" format="HH:mm:ss" arrow-control
                placeholder="结束时间" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <label>查询<el-tag type="success">{{ ClassRoomdata.building }}</el-tag>的空教室</label>
        <el-button style="float: right; padding: 3px 0" type="text" @click="classroomquery">搜索</el-button>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading" empty-text="哎呀，没有找到相关的教室信息"
        class="custom-table">
        <el-table-column label="序号" type="index" width="60" align="center" />

        <el-table-column prop="Building" label="教学楼" width="100" />
        <el-table-column prop="ClassRoom" label="教室" width="100" />
        <el-table-column prop="WeekDay" label="星期" width="100" />

      </el-table>
    </el-card>
    <el-card class="table-card" shadow="never" v-show="switchvalue">
      <template #header>
        <div class="card-header">

        </div>
      </template>
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading" empty-text="哎呀，没有找到相关的教室信息"
        class="custom-table">
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column prop="Building" label="教学楼" />
        <el-table-column prop="ClassRoom" label="教室" />
        <el-table-column prop="WeekDay" label="星期" />
      </el-table>
    </el-card>


    <div id="cesiumContainer" ref="cesiumContainer"></div>
  </template>

<script setup>
import { wgs84ToMercator, batchWgs84ToMercator } from '@/utils/coordUtils'


window.CESIUM_BASE_URL = '/';
import { courseListService, classrommCourseListService, classrommListService } from '@/api/course.js'
import { ElMessage } from 'element-plus'
import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onBeforeMount, onMounted, ref, reactive } from 'vue';
import * as Cesium from 'cesium'
import { getMinPathService } from '@/api/minPath';
//const buildingName = ref("勤学楼")
const tableData = ref([])
const loading = ref(false)
const ClassRoomdata = reactive({
  building: '勤学楼',
  classroom: '',
  beginTime: '',
  endTime: '',
  weekDay: ''
})
const weekDay = [
  { value: '周一', label: '周一' },
  { value: '周二', label: '周二' },
  { value: '周三', label: '周三' },
  { value: '周四', label: '周四' },
  { value: '周五', label: '周五' },
  { value: '周六', label: '周六' },
  { value: '周日', label: '周日' }
]
const tableTitle = ref('学生课表')
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
//空教室查询
const classroomquery = async () => {
  // 简单校验
  if (!ClassRoomdata.building || !ClassRoomdata.beginTime || !ClassRoomdata.endTime) {
    ElMessage.warning('请选择教学楼和时间段')
    return
  }
  try {
    //console.log(ClassRoomdata.beginTime)
    let result = await classrommListService(ClassRoomdata)

    // 假设后端返回的数据结构在 result.data 中
    tableTitle.value = '空闲教室'
    tableData.value = result.data
    ElMessage.success('查询成功')
  } catch (error) {
    tableData.value = [] // 关键修复：出错时清空旧数据
    console.log(error)
  } finally {
    loading.value = false
  }
}
//创建viewer
onMounted(async () => {


  const viewer = new Viewer('cesiumContainer', {
    //信息框是否可见
    //infoBox: false,
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

  //设置初始相机位置
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(120.4663, 31.577, 600),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-35.0),
    }
  });
  // 设置地球整体透明
  viewer.scene.globe.showGroundAtmosphere = false;  // 关闭地面大气层
  viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;  // 地球基底设为全透
  viewer.scene.globe.translucency.enabled = true;  // 启用透明渲染
  viewer.scene.globe.undergroundColor = undefined;  // 禁用地下着色
  // 设置场景背景透明（便于显示自定义背景）
  viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
  viewer.scene.skyBox.show = false
  //禁用俯仰角变化
  viewer.scene.screenSpaceCameraController.enableTilt = false;

  //加载3Dtitles
  const tileset = viewer.scene.primitives.add(
    await Cesium.Cesium3DTileset.fromIonAssetId(4610780),
  );

  //加载道路
  const resource = await Cesium.IonResource.fromAssetId(4610822);
  const dataSource = await Cesium.GeoJsonDataSource.load(resource, {
    stroke: Cesium.Color.YELLOW,        // 线条颜色设为醒目的黄色
    strokeWidth: 6,                     // 线条宽度设为3像素
    //fill: Cesium.Color.RED.withAlpha(0.5) // 面填充为半透明红色
  });
  viewer.dataSources.add(dataSource);
  //加载影像地图 
  const layer = viewer.imageryLayers.addImageryProvider(
    await Cesium.IonImageryProvider.fromAssetId(4610826),
  );

  //点击实体事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (click) {
    // 使用 pick 方法获取点击位置最顶部的对象
    const pickedObject = viewer.scene.pick(click.position);
    if (!Cesium.defined(pickedObject)) return;
    // 1. 处理 Entity 类型
    if (pickedObject.id instanceof Cesium.Entity) {
      const entity = pickedObject.id;
      console.log('点击到了 Entity:', entity);
      console.log(entity.name);
      entity.stroke = Cesium.Color.RED;
      // 执行 Entity 相关的自定义方法
      //handleEntityClick(entity);
    }
    // 2. 处理 3D Tiles 类型
    else if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
      const feature = pickedObject;
      console.log('点击到了 3D Tiles Feature:', feature);
      //console.log(feature.getProperty('name'));
      ClassRoomdata.building = feature.getProperty("name")
      console.log(ClassRoomdata.building)
      feature.color = Cesium.Color.YELLOW;
    }

    // 3. 可选：处理其他类型（如 Primitive、Globe 等）
    else {
      console.log('点击了其他对象:', pickedObject);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);






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
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 40vw;
  height: 100vh;
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

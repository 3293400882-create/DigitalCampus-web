<template>
  <div class="course-container">
    <!-- 顶部查询卡片 -->
    <el-card class="search-card" shadow="never" style="text-align: left">
      <el-form :model="ClassRoomdata" label-width="80px">
        <!-- 第一行：教学楼、教室 -->
        <el-row :gutter="20" style="display: flex; align-items: center;">
          <el-col :span="8">
            <el-form-item label="教学楼">
              <el-select v-model="ClassRoomdata.building" placeholder="请选择教学楼" :disabled=selectState.building
                style="width: 100%">
                <el-option v-for="item in building" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="教室">
              <el-select v-model="ClassRoomdata.classroom" placeholder="请选择教室" :disabled=selectState.classroom
                style="width: 100%">
                <el-option v-for="item in classroom" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="上课星期">
              <el-select v-model="ClassRoomdata.weekDay" placeholder="请选择上课星期" :disabled=selectState.weekDay
                style="width: 100%">
                <el-option v-for="item in weekDay" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行：时间选择 -->
        <el-row :gutter="20" style="display: flex; align-items: center; margin-top: 10px;">
          <el-col :span="8">
            <el-form-item label="起始时间">
              <el-time-picker v-model="ClassRoomdata.beginTime" :disabled=selectState.beginTime value-format="HH:mm:ss"
                format="HH:mm:ss" placeholder="起始时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-time-picker v-model="ClassRoomdata.endTime" :disabled=selectState.endTime value-format="HH:mm:ss"
                format="HH:mm:ss" arrow-control placeholder="结束时间" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 查询按钮 -->
        <el-row :gutter="20" style="margin-top: 15px;">


          <el-col :span="16">
            <el-form-item>
              <el-space :size="24" style="width: 100%;">
              <el-switch v-model="switchvalue" :change="DisableSelect(switchvalue)" size="large" width="200px"
                inline-prompt active-text="空教室" inactive-text="教室课表" class="custom-switch" />
              <el-button  @click="handleQuery" :icon="Search" style="width: 121.33px;">
                查询
              </el-button>
              <el-button @click="reset" :icon="Refresh" style="width: 121.33px;">
                重置
              </el-button>
              </el-space>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 底部表格卡片 -->
    <el-card class="table-card" shadow="never" v-show="!switchvalue">
      <template #header>
        <div class="card-header">
          <span>{{ tableTitle }}</span>
        </div>
      </template>

      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading" empty-text="哎呀，没有找到相关的教室信息"
        class="custom-table">
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="CourseName" label="课程名称" min-width="120" />
        <el-table-column prop="Building" label="教学楼" width="100" />
        <el-table-column prop="ClassRoom" label="教室" width="100" />
        <el-table-column prop="WeekDay" label="星期" width="100" />
        <el-table-column prop="BeginTime" label="开始时间" width="120" />
        <el-table-column prop="EndTime" label="结束时间" width="120" />
        <el-table-column prop="Teacher" label="教师" min-width="100" />
      </el-table>
    </el-card>
    <el-card class="table-card" shadow="never" v-show="switchvalue">
      <template #header>
        <div class="card-header">
          <span>{{ tableTitle }}</span>
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
  </div>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { courseListService, classrommCourseListService, classrommListService } from '@/api/course.js'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref<any[]>([])
const tableTitle = ref('学生课表')

// 使用 reactive 更符合表单对象的管理
const ClassRoomdata = reactive({
  building: '',
  classroom: '',
  beginTime: '',
  endTime: '',
  weekDay: ''
})

const switchvalue = ref(true)


// 下拉选项数据
const building = [
  { value: '勤学楼', label: '勤学楼' },
  { value: '思泉楼', label: '思泉楼' },
  { value: '尚善楼', label: '尚善楼' },
  { value: '敏学楼', label: '敏学楼' }
]

const classroom = [
  { value: '102', label: '102' },
  { value: '503', label: '503' }
]

const weekDay = [
  { value: '周一', label: '周一' },
  { value: '周二', label: '周二' },
  { value: '周三', label: '周三' },
  { value: '周四', label: '周四' },
  { value: '周五', label: '周五' },
  { value: '周六', label: '周六' },
  { value: '周日', label: '周日' }
]
//下拉选择使用状态
const selectState = ref({
  building: true,
  classroom: true,
  beginTime: true,
  endTime: true,
  weekDay: true
})

// --- 方法 ---

// 初始化加载（如果需要默认显示所有课程或空教室）
const courseList = async () => {
  loading.value = true
  try {
    let result = await courseListService()
    tableData.value = result.data
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}
courseList()

// 教室课表查询逻辑
const coursequery = async () => {
  // 简单校验
  if (!ClassRoomdata.building || !ClassRoomdata.classroom) {
    ElMessage.warning('请选择教学楼和教室')
    return
  }

  loading.value = true
  try {
    let result = await classrommCourseListService(ClassRoomdata)
    // 假设后端返回的数据结构在 result.data 中
    tableTitle.value = '教室课表'
    tableData.value = result.data
    ElMessage.success('查询成功')
  } catch (error) {
    tableData.value = [] // 关键修复：出错时清空旧数据
    //ElMessage.error('查询出错')
  } finally {
    loading.value = false
  }
}
//空教室教室查询逻辑
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
    //ElMessage.error('查询出错')
  } finally {
    loading.value = false
  }
}
//滑块切换禁用选择器

const DisableSelect = (switchBool: any) => {
  //清空原有查询和重置表单
  tableData.value = [];
  reset()
  //空教室查询模型
  if (!switchBool) {

    selectState.value.building = false
    selectState.value.beginTime = true
    selectState.value.endTime = true
    selectState.value.weekDay = true
    selectState.value.classroom = false
  }
  //教室课表查询模型
  else {
    selectState.value.building = false
    selectState.value.beginTime = false
    selectState.value.endTime = false
    selectState.value.weekDay = false
    selectState.value.classroom = true
  }
}
// 统一的查询处理方法，根据滑块状态决定执行哪种查询
const handleQuery = () => {
  if (!switchvalue.value) {
    // 当滑块为true时，执行教室课表查询
    coursequery();
  } else {
    // 当滑块为false时，执行空闲教室查询
    classroomquery();
  }
};

// 重置逻辑
const reset = () => {
  ClassRoomdata.building = ''
  ClassRoomdata.classroom = ''
  ClassRoomdata.beginTime = ''
  ClassRoomdata.endTime = ''
  ClassRoomdata.weekDay = ''
  // 可选：重置后是否重新加载所有数据
  tableTitle.value = '请输入查询条件'

}
</script>

<style scoped>
/* 仅调整高度，完全保留原有颜色 */
:deep(.el-switch__core) {
  height: 32px !important; /* 仅修改高度 */
  border-radius: 20px !important; /* 调整圆角匹配新高度 */
}

/* 调整滑块大小以匹配新高度 */
:deep(.el-switch__thumb) {
  width: 36px !important;
  height: 36px !important;
  top: 2px !important;
}

/* 确保文字垂直居中 */
:deep(.el-switch__label) {
  line-height: 40px !important;
}

.example-basic .el-date-editor {
  margin: 8px;
}

.course-container {
  padding: 20px;
  background-color: #f5f7fa;
  /* 浅灰背景，突出卡片 */
  min-height: 100vh;
  width: 80%;

}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.table-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
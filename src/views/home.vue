<template>
  <el-container class="home-container">
    <!-- 顶部：Header -->
    <el-header class="custom-header">
      <div class="header-title">
        <el-icon class="header-icon"><Monitor /></el-icon>
        <span>超绝锡院数字校园系统</span>
      </div>
    </el-header>

    <el-container class="body-container">
      <!-- 左侧：Aside (侧边栏) -->
      <el-aside width="240px" class="custom-aside">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical"
          @select="handleSelect"
          background-color="#ffffff"
          text-color="#606266"
          active-text-color="#409EFF"
          :collapse-transition="false"
        >
          <el-menu-item index= "/course">
            <el-icon><Reading /></el-icon>
            <span>教务查询</span>
          </el-menu-item>

          <el-menu-item index= "/road">
            <el-icon><School /></el-icon>
            <span>校园阡陌</span>
          </el-menu-item>

          <el-menu-item index="/path">
            <el-icon><MapLocation /></el-icon>
            <span>最短路径查询</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
        <router-view></router-view>
      <!-- 右侧：Main (内容区) -->

    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 引入 Element UI 图标
import { Reading, School, MapLocation, Monitor, BellFilled } from '@element-plus/icons-vue'

const router = useRouter()
const activeIndex = ref(router.currentRoute.value.path)

// 菜单点击事件
const handleSelect = (index) => {
  router.push(index)
}
</script>

<style scoped>
/* 全局容器 */
.home-container {
  height: 100vh;
  background-color: #f0f2f5; /* 浅灰背景，更有质感 */
}

/* 顶部 Header 样式 */
.custom-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #409EFF; /* Element 主色调 */
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 28px;
}

/* 主体布局 */
.body-container {
  height: calc(100vh - 60px); /* 减去 Header 高度 */
}

/* 左侧 Aside 样式 */
.custom-aside {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  padding-top: 10px;
}

/* 菜单样式微调 */
.el-menu-vertical {
  border-right: none; /* 去掉菜单自带的右边框 */
}

/* 右侧 Main 样式 */
.custom-main {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

/* 欢迎卡片样式 */
.welcome-card {
  width: 500px;
  text-align: center;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  gap: 10px;
}

.card-icon {
  color: #E6A23C; /* 警告/通知颜色 */
  font-size: 20px;
}

.welcome-content {
  padding: 20px 0;
}

.welcome-content p {
  color: #606266;
  margin-bottom: 20px;
  font-size: 16px;
}
</style>
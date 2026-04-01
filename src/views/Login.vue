<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <!-- 标题区域 -->
      <div class="title-wrapper">
        <el-icon class="title-icon"><Monitor /></el-icon>
        <h1 class="title">无锡学院智慧校园信息系统</h1>
      </div>

      <!-- 登录表单 -->
      <el-form :model="StuData" class="login-form">
        <!-- 账号输入 -->
        <el-form-item>
          <el-input
            v-model="StuData.StuID"
            placeholder="请输入账号"
            prefix-icon="User"
            size="large"
            clearable
            class="input-item"
          />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item>
          <el-input
            v-model="StuData.Stupassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            size="large"
            class="input-item"
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" class="login-btn" size="large" @click="login">
            登 入 系 统
            <el-icon class="btn-icon"><Right /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userLoginService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {useTokenStore} from '@/stores/token.js'
const tokenStore=useTokenStore();
const router = useRouter();
const StuData = ref({
  StuID: '',
  Stupassword:''
})
const login =async() => {
   
    let result = await userLoginService(StuData.value)
    ElMessage.success(result.data.msg ? result.data.msg : "登录成功")
    console.log(result.data)
    tokenStore.setToken(result.data)
    console.log(tokenStore.token)
    router.push('/')
  
}
</script>

<style scoped>
/* 整体背景：保留原本的柔和渐变 */
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f8faff 0%, #e0f2fe 50%, #f0f9ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 登录卡片：使用 el-card 的样式基础进行覆盖 */
.login-card {
  width: 420px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

/* 标题区域布局 */
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  gap: 12px;
  transition: all 0.3s ease;
}

.title-wrapper:hover {
  transform: scale(1.05);
}

.title-icon {
  font-size: 32px;
  color: #0066cc;
}

.title {
  font-size: 24px;
  color: #0066cc;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

/* 输入框样式微调 */
.input-item {
  transition: all 0.3s ease;
}

.input-item:hover {
  transform: scale(1.02);
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  height: 46px;
  background: linear-gradient(90deg, #0066cc, #3399ff);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #004d99, #0066cc);
  box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3);
}

/* 覆盖 el-card 默认的边框和阴影，使其更柔和 */
:deep(.el-card__body) {
  padding: 50px 40px;
}

:deep(.el-card) {
  border: none;
  box-shadow: 0 10px 40px rgba(0, 102, 204, 0.15);
}
</style>
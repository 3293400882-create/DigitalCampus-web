

<template>
  <el-form :model="StuData" label-width="auto" style="max-width: 400px">
    <el-form-item label="账号">
      <el-input v-model="StuData.StuID" />
    </el-form-item>
     <el-form-item label="密码">
      <el-input v-model="StuData.Stupassword"  type="password"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button>忘记密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
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

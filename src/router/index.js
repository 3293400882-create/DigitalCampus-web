//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import CourseVue from '@/views/Course.vue'

import RoadVue from '@/views/Road.vue'
import home from '@/views/home.vue'
import cesiumMapVue from '@/views/cesiumMap.vue'
//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    { path: '/',
        component: home,
        //重定向
        redirect: '/course',
        //子路由
        children: [
            { path: '/course', component: CourseVue },
             { path: '/road', component: RoadVue }
            
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router
//导入request.js工具
import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token'
//提供调用登录接口的函数
export const courseListService =()=>{
    const tokenStore =useTokenStore();

    //console.log(tokenStore.token)
    //pinia中响应式对象不需要value
    return request.get('/user/course',{headers:{'Authorization':tokenStore.token}})
    //return request.get('/user/course')
    
}
export const classrommCourseListService = (ClassRoomdata) => {
    // 直接传给 axios，它会自动处理序列化
    return request.get('/user/classcourse', {
        params: ClassRoomdata
    });
}

export const classrommListService = (ClassRoomdata) => {
    // 直接传给 axios，它会自动处理序列化
    return request.get('/user/classroom', {
        params: ClassRoomdata
    });
}
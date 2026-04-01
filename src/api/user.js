//导入request.js工具
import request from '@/utils/request.js'

//提供调用登录接口的函数
export const userLoginService =(loginDate)=>{
    const params =new URLSearchParams()
    for(let key in loginDate){
      
        params.append(key,loginDate[key]);
    }

    return request.post('/user/login',params)
    
}
//导入request.js工具
import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token'

// minPath.js
export const getMinPathService = (nodes) => {
    
    return request.post('/user/path', nodes);  // 改成 post，直接传对象
    
}
import { defineStore } from "pinia";
import { ref } from "vue";

//参数要求(名称，函数)
export const useTokenStore=defineStore('token',()=>{
    //内部初始token
    const token=ref('')
    const setToken=(newtoken)=>{
       token.value= newtoken

    }
    //修改token的方法
    const removeToken=()=>{
       token.value= ''

    }

    //移除token
    return{
        token,setToken,removeToken
    }},
    
    { 
        persist:true
})
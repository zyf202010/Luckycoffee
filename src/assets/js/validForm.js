import Vue from 'vue'
//导入提示组件
import { Toast } from 'vant'
//注册提示组件
Vue.use(Toast)

class ValidForm{
 //验证表单方法
    constructor() {}

    valid(obj){

        for(let item in obj){

            if(!obj[item].reg.test(obj[item].value)){

                Toast(obj[item].error)
                return false
            }
        }
    //表单验证通过
        return true
    }
}



//导出表单验证模块实例
export const validForm = new ValidForm();

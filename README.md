# vue-basic-table
基于element UI的 Table组件和Pagination组件封装的Table组件

## Install
***
`npm i vue-basic-table`

##Quick Start
***
```javascript
import BasicTable from "vue-basic-table";

// set a custom HTTP tool
Vue.use(BasicTable, { net: Net });
// Default use axios as HTTP tool
Vue.use(BasicTable);
```
在全局使用组件的时候，可以使用自定义的HTTP请求工具，也可以使用默认基于axios的HTTP工具

#### 组件在页面的使用,基础使用方法如下：
```vue
   <basic-table
    :columns="columns"
    :url="url">
    </basic-table>
```
## 参数介绍
***
基于Element-UI原有的参数没有修改，可以参照Element-UI Table组件和Pagination组件。
只是修改了Table组件参数的传入方式以及新增了参数

### Table参数传入方式的修改
***
```vue
<basic-table
 :options="options"
 :columns="columns"
 :url="url">
 </basic-table>
```
options就是表格新参数的传入，options对象里面的参数和Table组件的参数一致。
额外添加一个ref参数默认值是：'table'。

#### options示例
***
```javascript
export default {
    data() {
        return {
            options: {
                 ref: 'custom-table',
                 border: true,//此处需要注意原有的Table组件按照属性传入的布尔值这里都需要传入对应的值
                 selection: true
            }
        }
    }
}
```

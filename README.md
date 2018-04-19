# vue-basic-table
基于element UI的 Table组件和Pagination组件封装的Table组件

## Install
***
`npm i vue-basic-table`

## Quick Start
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
#### columns示例
***
```javascript
    export default {
        data() {
            return {
                columns: [
                    {
                      prop: 'plaChargeMainNum',
                      label: '单号',
                      width: '200'
                    },
                    {
                      prop: 'chaStuName',
                      label: '学生'
                    },
                    {
                      prop: 'chaClaName',
                      label: '班级'
                    },
                    {
                      prop: 'createDate',
                      label: '日期',
                      formatter: (r, b) => this.mixin_table_formatDate(r, '-')
                    },
                    {
                      prop: 'chaMoney',
                      label: '金额',
                      slotName: 'money-slot'//此处需要注意，此字段是新增属性，后边做详细解释
                    }
                ]
            }
        }
    }
```

#### Table组件上的方法示例,以复选框的选择事件为例，如下：
***
```vue

    <basic-table
     @select="select">
     </basic-table>

```

## 新增参数介绍
***
1. method

主要是去获取数据列表的HTTP请求方法，默认为GET。

2. url

远程获取数据的的接口地址，不能为空，若为空，则不加载数据请求。

3. parameters

请求数据携带的参数，此参数是携带在url后边：?key=value&key1=value1 这种形式。对于查询表单的数据
也可以在此处传入。

4. data

请求数据携带的参数，此参数主要是放在请求体中的即body中，这个前提是请求方法是POST。

5. isDelayGetData

是否延迟加载数据，就是当我们组件挂载后，不立即加载数据，延迟手动触发加载数据

6. isRefresh

是否刷新表格数据，即 重新加载数据

7. columns---->slotName

当某一列需要特殊处理的时候，例如当某一个字段需要渲染成html的时候可以在列的配置的时候配置这个字段。

###### 示例如下(场景：给每一个金额添加一个¥)：

```javacript
    {
        prop: 'chaMoney',
        label: '金额',
        slotName: 'money-slot'
    }
```
```vue
    <basic-table method="POST"
    :columns="columns"
    :options="options"
    :url="url"
    :parameters="parameters"
    @select="select"
    :data="data">

      <template slot="money-slot"
                slot-scope="scope">
        <span>{{scope.row.chaMoney}}¥</span>
      </template>

    </basic-table>
```

## 特殊功能介绍
***
1. 添加操作列

```vue
  <basic-table method="POST"
    :columns="columns"
    :options="options"
    :url="url"
    :parameters="parameters"
    @select="select"
    :data="data">

    <el-table-column slot="append" width="100" label="操作">
        <template slot-scope="scope">
            <div>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
            </div>
        </template>
    </el-table-column>

    </basic-table>
```

2. 自定义无数据显示

```vue
  <basic-table method="POST"
    :columns="columns"
    :options="options"
    :url="url"
    :parameters="parameters"
    @select="select"
    :data="data">

    <template slot="empty">
        我是最外层页面的自定义无数据显示
    </template>

    </basic-table>
```

3. 自定义西南角的功能区域

```vue
  <basic-table method="POST"
    :columns="columns"
    :options="options"
    :url="url"
    :parameters="parameters"
    @select="select"
    :data="data">

    <template slot="bottom-area">
        <el-button type="primary" @click="onSubmit">查询</el-button>
    </template>

    </basic-table>
```


<template>
    <div class="table-page-body" v-loading.lock="loading">

        <div class="table-body">
            <el-table
                    :data="tableData"
                    :ref="tableOptions.ref"
                    :border="tableOptions.border"
                    :stripe="tableOptions.stripe"
                    :height="tableOptions.height"
                    :max-height="tableOptions.maxHeight"
                    :fit="tableOptions.fit"
                    :show-header="tableOptions.showHeader"
                    :highlight-current-row="tableOptions.highlightCurrentRow"
                    :current-row-key="tableOptions.currentRowKey"
                    :row-class-name="tableOptions.rowClassName"
                    :row-style="tableOptions.rowStyle"
                    :row-ket="tableOptions.rowKey"
                    :empty-text="tableOptions.emptyText"
                    :default-expand-all="tableOptions.defaultExpandAll"
                    :expand-row-keys="tableOptions.expandRowKeys"
                    :default-sort="tableOptions.defaultSort"
                    :tooltip-effect="tableOptions.tooltipEffect"
                    :show-summary="tableOptions.showSummary"
                    :sum-text="tableOptions.sumText"
                    :summary-method="tableOptions.summaryMethod"
                    @select="(selection, row) => mixin_emit('select', selection, row)"
                    @select-all="selection => mixin_emit('select-all', selection)"
                    @selection-change="selection => mixin_emit('selection-change', selection)"
                    @cell-mouse-enter="(row, column, cell, event) => mixin_emit('cell-mouse-enter', row, column, cell, event)"
                    @cell-mouse-leave="(row, column, cell, event) => mixin_emit('cell-mouse-leave', row, column, cell, event)"
                    @cell-click="(row, column, cell, event) => mixin_emit('cell-click', row, column, cell, event)"
                    @cell-dblclick="(row, column, cell, event) => mixin_emit('cell-dblclick', row, column, cell, event)"
                    @row-click="(row, event, column) => mixin_emit('row-click', row, event, column)"
                    @row-dblclick="(row, event) => mixin_emit('row-dblclick', row, event)"
                    @row-contextmenu="(row, event) => mixin_emit('row-contextmenu', row, event)"
                    @header-click="(column, event) => mixin_emit('header-click', column, event)"
                    @sort-change="args => mixin_emit('sort-change', args)"
                    @filter-change="filters => mixin_emit('filter-change', filters)"
                    @current-change="(currentRow, oldCurrentRow) => mixin_emit('current-change', currentRow, oldCurrentRow)"
                    @header-dragend="(newWidth, oldWidth, column, event) => mixin_emit('header-dragend', newWidth, oldWidth, column, event)"
                    @expand-change="(row, expanded) => mixin_emit('expand-change', row, expanded)">

                <slot name="prepend"/>

                <el-table-column
                        v-if="tableOptions.selection"
                        type="selection"
                        :width="tableOptions.selectionWidth">
                </el-table-column>

                <el-table-column
                        v-for="(column, columnIndex) in columns"
                        :key="columnIndex"
                        :prop="column.prop"
                        :label="column.label"
                        :width="column.width"
                        :minWidth="column.minWidth || column.width"
                        :fixed="column.fixed"
                        :render-header="column.renderHeader"
                        :sortable="column.sortable"
                        :sort-method="column.method"
                        :resizable="column.resizable"
                        :formatter="column.formatter"
                        :show-overflow-tooltip="column.showOverflowTooltip"
                        :align="column.align"
                        :header-align="column.headerAlign || column.align"
                        :class-name="column.className"
                        :label-class-name="column.labelClassName"
                        :selectable="column.selectable"
                        :reserve-selection="column.reserveSelection"
                        :filters="column.filters"
                        :filter-placement="column.filterPlacement"
                        :filter-multiple="column.filterMultiple"
                        :filter-method="column.filterMethod"
                        :filtered-value="column.filteredValue">

                    <!--表格特殊列处理-->
                <template slot-scope="scope">
                    <span v-if="column.slotName">
                        <slot :name="column.slotName" :row="scope.row"/>
                    </span>
                    <span v-else>
                        {{ column.formatter ? column.formatter(scope.row) : scope.row[column.prop] }}
                    </span>
                </template>

                </el-table-column>

                <!--在表格最后追加-->
                <slot name="append"/>

                <!--当表格无数据时候显示-->
                <template slot="empty">
                    <slot name="empty"><span>暂无数据</span></slot>
                </template>

            </el-table>

        </div>

        <!--当列表没有数据的时候底部功能不显示-->
        <div v-if="tableData.length > 0" class="bottom-body">
            <div class="bottom-function-area">
                <el-button v-if="exportUrl" type="success" plain @click="exportExcel">导出Excel</el-button>
                <slot name="bottom-area"></slot>
            </div>

            <div v-if="isBigData" class="page-right">
                <el-button-group>
                    <el-button @click="handlePreviousPage" type="primary" icon="el-icon-arrow-left">上一页</el-button>
                    <el-button @click="handleNextPage" type="primary">下一页<i
                            class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </div>

            <span v-else>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :class="customPageClass"
                :current-page="tablePage.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="tablePage.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tablePage.total">
        </el-pagination>
      </span>

        </div>

    </div>
</template>

<script>
  import mixinEmit from './mixin/emit.mixin'

  const DEFAULT_HEIGHT = 250

  export default {
    name: 'BasicTable',

    mixins: [mixinEmit],

    data () {
      return {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        loading: false,
        lastId: 0,
        tableOptions: Object.assign({
          ref: 'table',
          border: false,
          selection: false,
          selectionWidth: 55,
          height: DEFAULT_HEIGHT
        }, this.options)
      }
    },

    props: {
      columns: {
        type: Array,
        required: true
      },

      //获取表格数据列表接口地址
      url: String,
      //http请求方法
      method: {
        type: String,
        default: 'GET'
      },
      //组件实例华是否延迟加载数据
      isDelayGetData: {
        type: Boolean,
        default: false
      },
      //是否刷新
      isRefresh: {
        type: Boolean,
        default: false
      },
      //分页位置
      customPageClass: {
        type: String,
        default: 'page-right'
      },
      //请求接口时候的额外参数
      parameters: Object,
      //POST请求接口时候传的数据,放在body里面
      data: Object,
      //表格参数设置
      options: Object,
      // //修改请求接口的参数
      // updateParameters: Function,
      //格式化响应数据
      formatResponseData: Function,
      //自定义分页传参数的键值
      pageIndex: {
        type: String,
        default: 'pageNo'
      },
      pageSize: {
        type: String,
        default: 'pageSize'
      },
      mockData: Object,
      //数据比较大的时候使用上一页和下一页的分页形式
      isBigData: {
        type: Boolean,
        default: false
      },
      //导出查询结果的url
      exportUrl: String
    },

    watch: {
      parameters: {
        handler () {
          if (this.parameters.immediate) {
            this.tablePage.currentPage = 1
            this.getTableDataList()
          }
        },
        deep: true
      },
      isRefresh (value) {
        if (value) {
          this.getTableDataList()
          this.isRefresh = false
        }
      }
    },

    created () {
      if (!this.isDelayGetData) {
        this.getTableDataList()
      }
    },

    methods: {
      exportExcel () {
        let params = {}
        for (const key in this.parameters) {
          if (this.parameters[key] && key !== 'immediate') {
            params[key] = this.parameters[key]
          }
        }
        const netInstance = this.$net.postJSON(this.exportUrl, {}, params)
        netInstance.then((result) => {
          if (result && result.status === '0') {
            this.$message({
              message: '导出Excel成功，请稍后在消息中心查看导出结果。',
              type: 'success'
            })
          } else {
            this.$message.error('导出Excel失败。')
          }
        }, () => {
          this.$message.error('导出Excel失败。')
        })

      },
      getTableDataList () {
        if (!this.url) {
          if (this.mockData) {
            this.tableData = this.mockData.data
            this.tablePage.total = this.mockData.total
          }
          return
        }

        this.loading = true
        let netInstance = this.getDataList()
        if (netInstance) {
          netInstance.then(res => {
            this.loading = false
            if ('function' === typeof this.formatResponseData) {

              try {
                let {data, total, limit, page} = this.formatResponseData(res)
                if (!data || !Array.isArray(data)) {
                  throw 'vue-basic-table: response data is not Array or is undefined'
                } else {
                  this.tableData = data
                  this.tablePage.total = total
                }
              } catch (e) {
                throw 'vue-basic-table: function 【formatResponseData】 Should return a value'
              }

            } else {
              if (res.data) {
                if (Array.isArray(res.data)) {
                  this.tableData = res.data
                } else {
                  this.tableData = res.data.list
                  this.tablePage.total = res.data.total
                }
              }
            }

          }, () => {
            this.loading = false
          })
        }
      },
      getDataList () {
        if ('POST' === this.method) {
          return this.getDataByPost()
        } else if ('GET' === this.method) {
          return this.getDataByGet()
        }
      },
      //将组件外传的参数和分页参数合并
      getParameters () {
        let parameters = null
        if (this.isBigData) {
          parameters = Object.assign({}, this.parameters, {
            lastId: this.lastId,
            [this.pageSize]: this.tablePage.pageSize
          })
        } else {
          parameters = Object.assign({}, this.parameters, {
            [this.pageIndex]: this.tablePage.currentPage,
            [this.pageSize]: this.tablePage.pageSize
          })
        }
        return parameters
      },
      //GET
      getDataByGet () {
        let parameters = this.getParameters()
        return this.$net.getJSON(this.url, parameters)
      },
      //POST
      getDataByPost () {
        let parameters = this.getParameters()
        delete parameters.immediate
        for (const key in parameters) {
          if (!parameters[key] || key.indexOf('_') > -1) {
            delete parameters[key]
          }
        }
        return this.$net.postJSON(this.url, {}, Object.assign({}, parameters, this.data))
      },
      handleSizeChange (size) {
        this.tablePage.pageSize = size
        this.tablePage.currentPage = 1
        this.getTableDataList()
      },
      handleCurrentChange (currentPage) {
        this.tablePage.currentPage = currentPage
        this.getTableDataList()
      },
      handlePreviousPage () {

      },
      handleNextPage () {
        let len = this.tableData.length
        if (len > 0) {
          this.lastId = this.tableData[len - 1].id
          this.getTableDataList()
        }

      }
    }
  }
</script>

<style scoped lang="scss" type="text/css">
    .bottom-body {
        margin-top: 16px;
        position: relative;
    }

    .page-right {
        text-align: right;
    }

    .bottom-function-area {
        float: left;
    }
</style>

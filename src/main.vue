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

        <slot name="prepend" />

        <el-table-column
                v-if="options.selection"
                type="selection"
                :width="options.selectionWidth">
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
                <slot :name="column.slotName" :row="scope.row" />
              </span>
            <span v-else>
                {{ scope.row[column.prop] }}
              </span>
          </template>

        </el-table-column>

        <!--在表格最后追加-->
        <slot name="append" />

        <!--当表格无数据时候显示-->
        <template slot="empty">
          <slot name="empty"><span>自定义无数据显示</span></slot>
        </template>

      </el-table>

    </div>

    <!--当列表没有数据的时候底部功能不显示-->
    <div v-if="tableData.length > 0" class="bottom-body">
      <div class="bottom-function-area">
        <slot name="bottom-area" />
      </div>

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
    </div>

  </div>
</template>

<script>
    import mixinEmit from './mixin/emit.mixin';

    const TOP_AND_BOTTOM_HEIGHT = 200;

    export default {
        name: 'BasicTable',

        mixins : [mixinEmit],

        data() {
            return {
                tableData: [],
                tablePage: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                loading: false,
                tableOptions: Object.assign({
                    ref: 'table',
                    border: true,
                    selection: false,
                    selectionWidth: 55,
                    height: document.body.clientHeight - TOP_AND_BOTTOM_HEIGHT
                }, this.options)
            };
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
            //修改请求接口的参数
            updateParameters: Function
        },

        watch: {
            parameters: {
                handler() {
                    this.tablePage.currentPage = 1;
                    this.getTableDataList();
                },
                deep: true
            },
            isRefresh(value) {
                if (value) {
                    this.getTableDataList();
                    this.isRefresh = false;
                }
            }
        },

        created() {
            if (!this.isDelayGetData) {
                this.getTableDataList();
            }
        },

        methods: {
            getTableDataList() {
                if (!this.url) {
                    return;
                }

                this.loading = true;
                let netInstance = this.getDataList();
                if (netInstance) {
                    netInstance.then(res => {
                        this.loading = false;

                        this.tableData = res.bizData.rows;
                        this.tablePage.total = res.bizData.records;
                    }, () => {
                        this.loading = false;
                    });
                }
            },
            getDataList() {
                if ('POST' === this.method) {
                    return this.getDataByPost();
                } else if ('GET' === this.method) {
                    return this.getDataByGet();
                }
            },
            //将组件外传的参数和分页参数合并
            getParameters() {
                let parameters = Object.assign({}, this.parameters, {
                    pageIndex: this.tablePage.currentPage,
                    pageSize: this.tablePage.pageSize
                });
                //自定义接口请求的参数
                if ('function' === typeof this.updateParameters) {
                    parameters = this.updateParameters(parameters);
                }
                return parameters;
            },
            //GET
            getDataByGet() {
                let parameters = this.getParameters();
                return this.$net.getJSON(this.url, parameters);
            },
            //POST
            getDataByPost() {
                let parameters = this.getParameters();
                return this.$net.postJSON(this.url, parameters, this.data);
            },
            handleSizeChange(size) {
                this.tablePage.pageSize = size;
                this.tablePage.currentPage = 1;
                this.getTableDataList();
            },
            handleCurrentChange(currentPage) {
                this.tablePage.currentPage = currentPage;
                this.getTableDataList();
            }
        }
    };
</script>

<style scoped lang="scss" type="text/css">
  .bottom-body{
    margin-top: 20px;
    position: relative;
  }
  .page-right{
    text-align: right;
  }
  .bottom-function-area{
    float: left;
  }
</style>

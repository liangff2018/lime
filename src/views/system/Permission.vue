<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="lyConf.gutter">
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="编码">
              <a-input v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="url">
                <a-input v-model="queryParam.url" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="描述">
                <a-input v-model="queryParam.description" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="请求方式">
                <a-select
                  v-model="queryParam.apiMethod"
                  mode="multiple"
                >
                  <a-select-option value="post">post</a-select-option>
                  <a-select-option value="get">get</a-select-option>
                  <a-select-option value="put">put</a-select-option>
                  <a-select-option value="delete">delete</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="可用状态">
                <a-radio-group v-model="queryParam.validState">
                  <a-radio value="">全部</a-radio>
                  <a-radio value="1">启用</a-radio>
                  <a-radio value="0">禁用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </template>
          <a-col
            :md="!advanced && lyConf.md || 24"
            :sm="lyConf.sm"
          >
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button
                type="primary"
                @click="$refs.table.refresh(true)"
              >查询</a-button>
              <a-button
                style="margin-left: 8px"
                @click="resetQuery"
              >重置</a-button>
              <a
                @click="() => advanced = !advanced"
                style="margin-left: 8px"
              >
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-button
      type="primary"
      @click="addClick({parentId: 0, code: ''})"
    >新建</a-button>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="(row) => row.id"
      :customRow="rowClick"
      :rowClassName="setRowClassName"
      @change="onChange"
      @expand="onExpand"
    >
      <span
        slot="serial"
        slot-scope="text, row, index"
      >
        {{ index + 1 }}
      </span>
      <span
        slot="action"
        slot-scope="text, row"
      >
        <template>
          <a @click="addClick(row)">新建权限</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="editClick(row)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="changeState(row)">{{ row.validState === 1 ? '禁用': '启用' }}</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  :title="'确认要删除吗？'"
                  @confirm="deleteClick(row.id)"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <permission-modal
      ref="permissionModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById, permissionEnable, permissionDisable } from '@/api/system/permission'
import PermissionModal from './modules/PermissionModal'

// 列名
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: 'url', dataIndex: 'url' },
  { title: '描述', dataIndex: 'description' },
  { title: '请求方式', dataIndex: 'apiMethod' },
  { title: '可用状态', dataIndex: 'validState' },
  { title: '操作', width: '180px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    parentId: optEnum.equalsTo,
    code: optEnum.like,
    name: optEnum.like,
    url: optEnum.like,
    description: optEnum.like,
    sequence: optEnum.equalsTo,
    apiMethod: optEnum.in,
    validState: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = 'sequence:asc'

export default {
  components: {
    STable,
    PermissionModal
  },
  data () {
    return {
      titleName: '权限管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: { parentId: 0 },
      // 显示高级查询
      advanced: false,
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          res.data = res.data.map(item => Object.assign({ children: [] }, item))
          return res
        })
      },
      selectedRow: {}
    }
  },
  methods: {
    addClick (row) {
      this.$refs.permissionModal.open({ operateType: 'new', parentId: row.id, code: row.code, parentName: row.name })
    },
    editClick (row) {
      this.$refs.permissionModal.open({ operateType: 'edit', id: row.id, parentId: row.parentId })
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.$refs.table.refresh()
      })
    },
    resetQuery () {
      this.queryParam = { parentId: 0 }
      this.$refs.table.refresh()
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    rowClick (row, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = row
          }
        }
      }
    },
    setRowClassName (row, index) {
      return row.id === this.selectedRow.id ? 'table-row-selected-color' : ''
    },
    onExpand (expanded, row) {
      this.selectedRow = row
      if (expanded && row.children && row.children.length === 0) {
        const param = {
          pageNo: 1,
          pageSize: 100,
          parentId: row.id,
          order: order
        }
        // 子记录只根据父节点过滤
        findPage(Object.assign(param, opts)).then(res => {
          this.$refs.table.localDataSource.find(item => {
            if (item.id === row.id) {
              item.children = (res.data && res.data.length > 0) ? res.data : undefined
            }
          })
          this.$refs.table.localDataSource = [...this.$refs.table.localDataSource]
        })
      }
    },
    onChange (pagination, filters, sorter) {
      this.$message.info(pagination)
    },
    changeState (row) {
      if (row.validState === 1) {
        permissionDisable(row.id).then(res => { })
      } else {
        permissionEnable(row.id).then(res => { })
      }
    }
  }
}
</script>

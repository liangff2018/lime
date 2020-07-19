<template>
  <a-card
    style="min-height: 580px"
  >
    <a-row :gutter="24">
      <a-col
        :span="8"
        class="col-right-line-vertical"
      >
        <a-button
          type="primary"
          @click="addClick"
        >新建</a-button>
        <a-input-search
          placeholder="输入过滤条件"
          style="width: 280px; float: right"
          @search="onSearchRole"
        />
        <s-table
          ref="table"
          :columns="columns"
          :data="loadData"
          :rowKey="(row) => row.id"
          :customRow="rowClick"
          :rowClassName="setRowClassName"
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
              <a @click="editClick(row.id)">编辑</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a-popconfirm
                  :title="'确认要删除吗？'"
                  @confirm="deleteClick(row.id)"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </a-dropdown>
            </template>
          </span>
        </s-table>
      </a-col>
      <a-col :span="16">
        <a-button @click="assignClick">分配权限</a-button>
        <a-input-search
          placeholder="输入过滤条件"
          style="width: 280px; float: right"
          @search="onSearchPermission"
        />
        <s-table
          ref="tablePms"
          :rowKey="(row) => row.id"
          :data="loadDataPms"
          :columns="columnsPms"
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
              <a-popconfirm
                :title="'确认要删除当前和所有下级权限吗？'"
                @confirm="deleteClickPms(row)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>

            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <role-modal
      ref="roleModal"
      @ok="handleOk"
    />
    <permission-list-modal
      ref="permissionListModal"
      @ok="handleAssignOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/system/role'
import { findRolePermissionByParam, deleteById as deleteByIdPms } from '@/api/system/rolePermission'
import RoleModal from './modules/RoleModal'
import PermissionListModal from './modules/PermissionListModal'

const columnsPms = [
  { title: '#', width: '40px', scopedSlots: { customRender: 'serial' } },
  { title: '全路径名称', dataIndex: 'fullName' },
  { title: '编码', dataIndex: 'code' },
  { title: 'url', dataIndex: 'url' },
  { title: '请求方式', dataIndex: 'reqMethod' },
  { title: '状态', dataIndex: 'state' },
  { title: '操作', width: '70px', scopedSlots: { customRender: 'action' } }
]

// 列名
const columns = [
  { title: '#', width: '40px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: '操作', width: '120px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    name: optEnum.like,
    code: optEnum.like,
    catalog: optEnum.like,
    roleKindId: optEnum.equalsTo,
    description: optEnum.like,
    sequence: optEnum.equalsTo,
    validState: optEnum.equalsTo
  }
}

const optsPms = {
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
const order = ''

// 由于findPage方法已重写，排序需要使用以下格式
const orderPms = 'p.full_id asc, p.sequence asc'

export default {
  components: {
    STable,
    RoleModal,
    PermissionListModal
  },
  data () {
    return {
      titleName: '角色管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: {},
      queryParamPms: {},
      // 显示高级查询
      advanced: false,
      columns,
      columnsPms,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: false })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          this.$refs.tablePms.refresh()
          return res
        })
      },
      loadDataPms: param => {
        if (!this.selectedRow) {
          return
        }
        const roleId = this.selectedRow.id ? this.selectedRow.id : 0
        this.queryParam = Object.assign(this.queryParamPms, { roleId: roleId })
        const queryParam = buildFindPageParam(this.queryParamPms, optsPms.operators, 'all')
        param = Object.assign(param, queryParam, optsPms, { order: orderPms, isAnd: true })
        return findRolePermissionByParam(param).then(res => {
          // res.data = res.data.map(item => Object.assign({ children: [] }, item))
          debugger
          return res
        })
      },
      selectedRow: {}
    }
  },
  methods: {
    addClick () {
      this.$refs.roleModal.open({ operateType: 'new' })
    },
    editClick (id) {
      this.$refs.roleModal.open({ operateType: 'edit', id: id })
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.$refs.table.refresh()
      })
    },
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    rowClick (row, index) {
      return {
        on: {
          click: () => {
            if (this.selectedRow.id !== row.id) {
              this.selectedRow = row
              this.$refs.tablePms.refresh()
            }
          }
        }
      }
    },
    setRowClassName (row, index) {
      return row.id === this.selectedRow.id ? 'table-row-selected-color' : ''
    },
    onSearchRole (value) {
      this.queryParam = Object.assign(this.queryParam, { name: value, code: value })
      this.$refs.table.refresh()
    },
    onSearchPermission (value) {
      this.queryParamPms = Object.assign(this.queryParamPms, { name: value, code: value })
      this.$refs.tablePms.refresh()
    },
    assignClick () {
      this.$refs.permissionListModal.open({ roleId: this.selectedRow.id })
    },
    handleAssignOk () {
      this.$refs.tablePms.refresh()
    },
    deleteClickPms (row) {
      debugger
      deleteByIdPms(row.roleId, row.permissionId).then(res => this.$refs.tablePms.refresh())
    }
  }
}
</script>

<template>
  <a-card
    class="lcy-ext"
    style="min-height: 580px"
  >
    <a-row gutter="8">
      <a-col
        :span="10"
        class="col-right-line-vertical"
      >
        <a-button
          type="primary"
          @click="addClick"
        >新增</a-button>
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
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;">分配</a>
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
      </a-col>
      <a-col :span="14">
        <a-input-search
          placeholder="输入过滤条件"
          style="width: 280px; float: right"
          @search="onSearchPermission"
        />
      </a-col>
    </a-row>

    <role-modal
      ref="roleModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildParamLike } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/system/role'
import RoleModal from './modules/RoleModal'

// 列名
const columns = [
  { title: '#', width: '80px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: '操作', width: '150px', scopedSlots: { customRender: 'action' } }
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

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      titleName: '角色管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      loadData: param => {
        const queryParam = buildParamLike(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: false })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
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
            this.selectedRow = row
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
      this.$message.info(value)
    }

  }
}
</script>

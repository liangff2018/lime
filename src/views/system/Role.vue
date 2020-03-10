<template>
  <a-card>
    <a-button
      type="primary"
      @click="addClick"
    >新增</a-button>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
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
                <a href="javascript:;">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <role-modal
      ref="roleModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/system/role'
import RoleModal from './modules/RoleModal'

const columns = [
  { title: '#', width: '80px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: '操作', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      titleName: '角色管理',
      columns,
      role: { name: '%管理员%' },
      loadData: param => {
        const ct = { operators: { name: 30, code: 10 } }
        param = Object.assign(param, this.role, ct, { order: 'name:acs, sequence: desc' })
        return findPage(param).then(res => {
          return res
        })
      }
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
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>

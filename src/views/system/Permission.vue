<template>
  <a-card style="min-height: 580px">
    <a-button
      type="primary"
      @click="addPermissionClick(0, 1)"
    >新建根菜单</a-button>
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :rowKey="row => row.id"
      @change="handleTableChange"
      @expand="expand"
    >
      <span
        slot="action"
        slot-scope="row"
      >
        <a
          :disabled="row.type === 2"
          @click="addPermissionClick(row.id, 1)"
        >新建菜单</a>
        <a-divider type="vertical" />
        <a
          :disabled="row.type === 2"
          @click="addPermissionClick(row.id, 2)"
        >新建Api</a>
        <a-divider type="vertical" />
        <a @click="editPermissionClick(row.id)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确认要删除码？"
          @confirm="deleteResouceClick(row.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <permission-modal
      ref="permissionModal"
      @ok="handleOk"
    />
  </a-card>

</template>

<script>
import PermissionModal from './modules/PermissionModal'
import { findPage, deleteById } from '@/api/system/permission'
const columns = [
  { title: '名称', dataIndex: 'name', sorter: true, width: '20%' },
  { title: '编码', dataIndex: 'code', sorter: true, width: '20%' },
  { title: 'url', dataIndex: 'url', width: '20%' },
  { title: '描述', dataIndex: 'description', width: '20%' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
]
export default {
  components: {
    PermissionModal
  },
  mounted () {
    this.loadData()
  },
  data () {
    return {
      name: '资源权限',
      columns,
      data: [],
      pagination: { current: 1, pageSize: 100 },
      queryParam: { parentId: 0 },
      loading: false
    }
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    loadData () {
      this.loading = true
      const param = { pageNo: this.pagination.current, pageSize: this.pagination.pageSize }
      findPage(Object.assign(this.queryParam, param)).then(res => {
        console.log('res-data', res)
        const pagination = { ...this.pagination }
        pagination.total = res.totalCount
        const temp = res.data.map(item => { return Object.assign({ children: [] }, item) })
        this.data = temp
        this.pagination = pagination
        this.loading = false
      })
    },
    loadChildrenData (parentId) {
      findPage({ parentId: parentId, pageSize: 100, pageNo: 1 }).then(res => {
        if (res.data && res.data.length > 0) {
          const temp = res.data.map(item => { return Object.assign({ children: [] }, item) })
          this.setDataChildren(this.data, parentId, temp)
        }
      })
    },
    // 由于未提供当前行的方法，只能使用递归查找把数据插到哪条记录的children中
    setDataChildren (items, parentId, temp) {
      items.find(item => {
        const res = this.setDataChildren(item.children, parentId, temp)
        if (res) {
          return
        }
        if (item.id === parentId) {
          item.children = temp
        }
      })
    },
    addPermissionClick (parentId, type) {
      this.$refs.permissionModal.open({ operateType: 'new', parentId: parentId, type: type })
    },
    editPermissionClick (id) {
      this.$refs.permissionModal.open({ operateType: 'edit', id: id })
    },
    deleteResouceClick (id) {
      deleteById(id).then(res => { this.loadData() })
    },
    expand (isExpand, row) {
      if (isExpand && row.children && row.children.length === 0) {
        this.loadChildrenData(row.id)
      }
    },
    handleOk () {
      this.loadData()
    }
  }
}
</script>

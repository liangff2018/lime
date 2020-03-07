<template>
  <a-card>
    <a-button
      type="primary"
      @click="addResourceClick(0)"
    >新建菜单</a-button>
    <a-table
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
        <a @click="addResourceClick(row.id)">新建权限</a>
        <a-divider type="vertical" />
        <a @click="editResourceClick(row.id)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;">删除</a>
      </span>
    </a-table>
    <resource-modal
      ref="resourceModal"
      @ok="handleOk"
    />
  </a-card>

</template>

<script>
import ResourceModal from './modules/ResourceModal'
import { findPage } from '@/api/system/resource'
const columns = [
  { title: '名称', dataIndex: 'name', sorter: true, width: '20%' },
  { title: '编码', dataIndex: 'code', sorter: true, width: '20%' },
  { title: 'url', dataIndex: 'url', width: '20%' },
  { title: '描述', dataIndex: 'description', width: '20%' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
]
export default {
  components: {
    ResourceModal
  },
  mounted () {
    this.loadData()
  },
  data () {
    return {
      name: '资源权限',
      columns,
      data: [],
      pagination: { current: 1, pageSize: 5 },
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
        this.data.find(item => {
          if (item.id === parentId) {
            item.children = res.data && res.data.length > 0 ? res.data : undefined
          }
        })
      })
    },
    addResourceClick (parentId) {
      this.$refs.resourceModal.open({ operateType: 'new', parentId: parentId })
    },
    editResourceClick (id) {
      this.$refs.resourceModal.open({ operateType: 'edit', id: id })
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

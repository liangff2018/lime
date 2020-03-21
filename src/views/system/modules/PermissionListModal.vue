<template>
  <a-modal
    :visible="visible"
    :title="titleName"
    :loading="loading"
    width="800px"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="row => row.id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @expand="onExpand"
    >

    </s-table>
  </a-modal>
</template>

<script>
import STable from '@/components/Table'
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import { findPage } from '@/api/system/permission'
import { adds, findPermissionIdsByRoleId } from '@/api/system/rolePermission'

// 列名
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: 'url', dataIndex: 'url' },
  { title: '描述', dataIndex: 'description' },
  { title: '请求方式', dataIndex: 'apiMethod' }
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
    STable
  },
  data () {
    return {
      titleName: '权限列表',
      visible: false,
      loading: false,
      columns,
      selectedRowKeys: [],
      queryParam: { parentId: 0 },
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: false })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          res.data = res.data.map(item => Object.assign({ children: [] }, item))
          return res
        })
      }
    }
  },
  methods: {
    open (param) {
      this.loading = true
      this.visible = true
      this.roleId = param.roleId
      findPermissionIdsByRoleId(this.roleId).then(res => {
        this.selectedRowKeys = res
        this.loading = false
      })
    },
    okClick () {
      adds({ roleId: this.roleId, permissionIds: this.selectedRowKeys }).then(res => {
        this.$emit('ok', '分配成功.', this.selectedRowKeys)
        this.visible = false
      })
    },
    cancelClick () {
      this.visible = false
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
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
        findPage(Object.assign(param, opts)).then(res => {
          this.$refs.table.localDataSource.find(item => {
            if (item.id === row.id) {
              item.children = (res.data && res.data.length > 0) ? res.data : undefined
            }
          })
          this.$refs.table.localDataSource = [...this.$refs.table.localDataSource]
        })
      }
    }
  }
}
</script>

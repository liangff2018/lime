<template>
  <a-modal
    width="840px"
    :visible="visible"
    :title="titleName"
    @ok="okClick"
    @cancel="cancalClick"
  >
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="row => row.id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
  </a-modal>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage } from '@/api/system/role'
import { adds } from '../../../api/system/authorize'

// 列名
const columns = [
  { title: '#', width: '80px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' }
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
    STable
  },
  data () {
    return {
      titleName: '选择角色',
      visible: false,
      // 查询参数
      queryParam: {},
      columns,
      selectedRowKeys: [],
      orgId: undefined,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: false })
        return findPage(param).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    open (param) {
      this.visible = true
      this.orgId = param.orgId
    },
    okClick () {
      adds({ orgId: this.orgId, roleIds: this.selectedRowKeys }).then(res => {
        this.visible = false
        this.$emit('ok', '分配成功.', this.selectedRowKeys)
      })
    },
    cancalClick () {
      this.visible = false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

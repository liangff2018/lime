<template>
  <a-modal
    :width="'70%'"
    :visible="visible"
    :title="title"
    @ok="okClick"
    @cancel="cancelClick"
  >
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
    </s-table>
  </a-modal>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import moment from 'moment'
import { findPageFinished } from '@/api/hr/trainRequire'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '单据编号', dataIndex: 'billNo' },
  // { title: '单据状态', dataIndex: 'billState', scopedSlots: { customRender: 'billStateSlot' } },
  { title: '单据日期', dataIndex: 'billDate', customRender: (text) => moment(text).format('YYYY-MM-DD') },
  // { title: '提出部门id', dataIndex: 'deptId' },
  { title: '提出部门', dataIndex: 'deptName' },
  // { title: '原因', dataIndex: 'reason' },
  { title: '培训内容要求', dataIndex: 'trainContent' },
  // { title: '备注', dataIndex: 'remarks' },
  { title: '填报人', dataIndex: 'enterPerson' }
  // ,
  // { title: '填报时间', dataIndex: 'enterTime' },
  // { title: '操作', width: '200px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    billNo: optEnum.like,
    billState: optEnum.like,
    billDate: optEnum.equalsTo,
    deptId: optEnum.equalsTo,
    deptName: optEnum.like,
    reason: optEnum.like,
    trainContent: optEnum.like,
    remarks: optEnum.like,
    enterPerson: optEnum.like,
    enterTime: optEnum.equalsTo
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
      title: '培训需求列表',
      // 查询参数
      queryParam: {},
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(Object.assign(this.queryParam, { }), opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPageFinished(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          return res
        })
      },
      visible: false,
      selectedRow: {}
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    okClick () {
      this.$emit('ok', this.selectedRow)
      this.visible = false
    },
    cancelClick () {
      this.visible = false
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
    }
  }
}
</script>

<style lang="less" scope>
</style>

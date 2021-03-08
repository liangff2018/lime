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
import { findPageDetailFinished } from '@/api/hr/recruitPlan'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '计划名称', dataIndex: 'planName' },
  { title: '需求部门', dataIndex: 'deptName' },
  { title: '需求岗位', dataIndex: 'posName' },
  { title: '需求人数', dataIndex: 'personNum' },
  { title: '到岗日期', dataIndex: 'jobDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  { title: '专业要求', dataIndex: 'major' },
  { title: '学历要求', dataIndex: 'education' },
  { title: '岗位要求', dataIndex: 'posRequire' }
]

// 操作符对象
const opts = {
  operators: {
    mainId: optEnum.equalsTo,
    posName: optEnum.like,
    personNum: optEnum.equalsTo,
    jobDate: optEnum.equalsTo,
    major: optEnum.like,
    education: optEnum.like,
    posRequire: optEnum.like
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
      title: '招聘计划明细列表',
      // 查询参数
      queryParam: {},
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(Object.assign(this.queryParam, { }), opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPageDetailFinished(param).then(res => {
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

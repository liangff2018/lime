<template>
  <a-card style="min-height: 580px">

    <a-button
      type="primary"
      @click="loadAllPosData()"
    >加载所有岗位</a-button>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :rowKey="(row) => row.id"
    >
      <span
        slot="serial"
        slot-scope="text, row, index"
      >
        {{ index + 1 }}
      </span>
      <template
        slot="amount"
        slot-scope="text, row"
      >
        <a-input
          v-if="row.editable"
          :value="text"
          style="width: 100%"
          @change="e => amountChange(e.target.value, row.id)"
        />
        <span v-else>
          {{ text }}
        </span>
      </template>
      <span
        slot="action"
        slot-scope="text, row"
      >
        <template v-if="row.editable">
          <a @click="saveRow(row)">保存</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确认要取消修改吗？'"
            @confirm="cancelRow(row)"
          >
            <a href="javascript:;">取消</a>
          </a-popconfirm>
        </template>
        <template v-else>
          <a @click="editRow(row)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确认要删除吗？'"
            @confirm="deleteClick(row.id)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { update, findPage, deleteById, loadPosData } from '@/api/hr/posWages'
import PosWagesForm from './PosWagesForm'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '部门', dataIndex: 'deptName' },
  { title: '岗位', dataIndex: 'posName' },
  { title: '金额', dataIndex: 'amount', scopedSlots: { customRender: 'amount' }, width: '240px' },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    posId: optEnum.equalsTo,
    amount: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    PosWagesForm
  },
  data () {
    return {
      titleName: '岗位工资维护管理',
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      tableData: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData (param) {
      const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
      param = Object.assign(param || { pageNo: 1, pageSize: 100 }, queryParam, opts, { order: order, isAnd: true })
      findPage(param).then(res => {
        this.tableData = res.data
      })
    },
    editRow (row) {
      const tempData = [...this.tableData]
      const target = tempData.filter(item => item.id === row.id)[0]
      if (target) {
        target.editable = true
        this.tableData = tempData
      }
    },
    cancelRow (row) {
      const tempData = [...this.tableData]
      const target = tempData.filter(item => item.id === row.id)[0]
      if (target) {
        console.log('target', target)
        delete target.editable
        this.tableData = tempData
        console.log(this.tableData)
      }
    },
    saveRow (row) {
      update(row).then(res => this.loadData())
    },
    amountChange (value, id) {
      const tempData = [...this.tableData]
      const target = tempData.filter(item => item.id === id)[0]
      if (target) {
        target.amount = value
        this.tableData = tempData
      }
    },
    loadAllPosData () {
      loadPosData().then(res => {
        this.loadData()
      })
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.loadData()
      })
    }
  }
}
</script>

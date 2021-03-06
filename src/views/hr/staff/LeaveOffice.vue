<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form-model
        :labelCol="{xs: {span: 24}, sm: {span: 6}}"
        :wrapperCol="{xs: {span: 24}, sm: {span: 18}}"
      >
        <a-row justify="center">
          <a-col :span="8">
            <a-form-model-item label="单据编号">
              <a-input v-model="queryParam.billNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="单据状态">
              <a-select
                v-model="queryParam.billState"
                allowClear
              >
                <a-select-option
                  v-for="item in billStateItems"
                  :key="item.id"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="advanced">
            <a-col :span="8">
              <a-form-model-item label="员工姓名">
                <a-input v-model="queryParam.staffName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="部门">
                <a-input v-model="queryParam.deptName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="岗位">
                <a-input v-model="queryParam.posName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="离职原因">
                <a-input v-model="queryParam.reason" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="填报人">
                <a-input v-model="queryParam.entryPerson" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="审批人">
                <a-input v-model="queryParam.replyPerson" />
              </a-form-model-item>
            </a-col>
          </template>
          <a-col
            :span="8"
            style="padding-top: 4px; text-align: center"
          >
            <a-button
              type="primary"
              @click="$refs.table.refresh(true)"
            >查询</a-button>
            <a-button
              style="margin-left: 8px"
              @click="resetQuery"
            >重置</a-button>
            <a
              @click="() => advanced = !advanced"
              style="margin-left: 8px"
            >
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <a-button
      type="primary"
      @click="showFormClick('new')"
    >新建</a-button>
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
        slot="billStateSlot"
        slot-scope="text"
      >
        {{ text | billStateFilter(billStateItems) }}
      </span>
      <span
        slot="action"
        slot-scope="text, row"
      >
        <template>
          <span v-if="row.billState === '10' || row.billState === '11' || (row.billState === '20' && hasRole('hrManager'))">
            <a-popconfirm
              :title="row.billState === '20' ? '确认要通过审核吗？' : '确认要提交审核吗？'"
              @confirm="approvalClick(row, 'go')"
            >
              <a href="javascript:;">{{ row.billState === '20' ? '通过' : '提交' }}</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
          <span v-if="row.billState === '20' && hasRole('hrManager')">
            <a-popconfirm
              :title="'确认要回退吗？'"
              @confirm="approvalClick(row, 'back')"
            >
              <a href="javascript:;">回退</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
          <a @click="showFormClick('view', row.id)">查看</a>
          <a-divider type="vertical" />
          <span v-if="row.billState === '10' || row.billState === '11'">
            <a @click="showFormClick('edit', row.id)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              :title="'确认要删除吗？'"
              @confirm="deleteClick(row.id)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById, approval } from '@/api/hr/leaveOffice'
import LeaveOfficeForm from './LeaveOfficeForm'
import moment from 'moment'
import { findItemsByName } from '@/api/system/staticData'
import { mapGetters } from 'vuex'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '单据编号', dataIndex: 'billNo' },
  { title: '单据状态', dataIndex: 'billState', scopedSlots: { customRender: 'billStateSlot' } },
  { title: '单据日期', dataIndex: 'billDate', customRender: (val) => val ? moment(val).format('YYYY-MM-DD') : '' },
  // { title: '员工id', dataIndex: 'staffId' },
  { title: '员工姓名', dataIndex: 'staffName' },
  { title: '部门', dataIndex: 'deptName' },
  { title: '岗位', dataIndex: 'posName' },
  // { title: '离职原因', dataIndex: 'reason' },
  // { title: '离职日期', dataIndex: 'leaveDate' },
  { title: '填报人', dataIndex: 'entryPerson' },
  // { title: '填报时间', dataIndex: 'entryTime' },
  { title: '审批人', dataIndex: 'replyPerson' },
  // { title: '审批时间', dataIndex: 'replyTime' },
  { title: '操作', width: '240px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    billNo: optEnum.like,
    billState: optEnum.like,
    billDate: optEnum.equalsTo,
    staffId: optEnum.equalsTo,
    staffName: optEnum.like,
    deptName: optEnum.like,
    posName: optEnum.like,
    reason: optEnum.like,
    leaveDate: optEnum.equalsTo,
    entryPerson: optEnum.like,
    entryTime: optEnum.equalsTo,
    replyPerson: optEnum.like,
    replyTime: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    LeaveOfficeForm
  },
  data () {
    return {
      titleName: '员工离职管理',
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          return res
        })
      },
      selectedRow: {},
      billStateItems: []
    }
  },
  created () {
    findItemsByName('单据状态', 1).then(res => {
      this.billStateItems = res
    })
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  methods: {
    hasRole (roleCode) {
      return this.roles.some(item => item.code === roleCode)
    },
    approvalClick (row, type) {
      let billState = '10'
      if (type === 'go') {
        if (row.billState === '10' || row.billState === '11') {
          billState = '20'
        } else {
          billState = '30'
        }
      } else {
        billState = '11'
      }

      approval(row.id, billState).then(res => {
        this.$refs.table.refresh()
      })
    },
    showFormClick (operateType, id) {
      this.$router.push({ name: 'leaveOfficeForm', params: { id: id, operateType: operateType } })
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
    }
  },
  filters: {
    billStateFilter (val, items) {
      const item = items.find(item => {
        return item.code === val
      })
      return item ? item.name : ''
    }
  }
}
</script>

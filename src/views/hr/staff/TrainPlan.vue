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
              <a-select v-model="queryParam.billState">
                <a-select-option :value="10">编辑中</a-select-option>
                <a-select-option :value="30">已完成</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="advanced">
            <a-col :span="8">
              <a-form-model-item label="培训需求编号">
                <a-input v-model="queryParam.requireNo" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="计划名称">
                <a-input v-model="queryParam.planName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="培训内容">
                <a-input v-model="queryParam.trainContent" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="参加人数">
                <a-input v-model="queryParam.trainPersons" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="备注">
                <a-input v-model="queryParam.remarks" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="填报人">
                <a-input v-model="queryParam.enterPerson" />
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
          <span v-if="row.billState !== '30'">
            <a-popconfirm
              :title="'提交后单据将被锁定且无法再次修改，确认要提交吗？'"
              @confirm="approvalClick(row)"
            >
              <a href="javascript:;">提交</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </span>
          <a @click="showFormClick('view', row.id)">查看</a>
          <span v-if="row.billState !== '30'">
            <a-divider type="vertical" />
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
import { findPage, deleteById, update } from '@/api/hr/trainPlan'
import TrainPlanForm from './TrainPlanForm'
import moment from 'moment'
import { findItemsByName } from '@/api/system/staticData'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '单据编号', dataIndex: 'billNo' },
  { title: '单据状态', dataIndex: 'billState', scopedSlots: { customRender: 'billStateSlot' } },
  { title: '单据日期', dataIndex: 'billDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  // { title: '培训需求编号', dataIndex: 'requireNo' },
  { title: '计划名称', dataIndex: 'planName' },
  { title: '开始日期', dataIndex: 'startDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  { title: '结束日期', dataIndex: 'endDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  { title: '培训内容', dataIndex: 'trainContent' },
  { title: '参加人数', dataIndex: 'trainPersons' },
  // { title: '备注', dataIndex: 'remarks' },
  { title: '填报人', dataIndex: 'enterPerson' },
  // { title: '填报时间', dataIndex: 'enterTime' },
  { title: '操作', width: '200px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    billNo: optEnum.like,
    billState: optEnum.like,
    billDate: optEnum.equalsTo,
    requireNo: optEnum.like,
    planName: optEnum.like,
    startDate: optEnum.equalsTo,
    endDate: optEnum.equalsTo,
    trainContent: optEnum.like,
    trainPersons: optEnum.equalsTo,
    remarks: optEnum.like,
    enterPerson: optEnum.like,
    enterTime: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    TrainPlanForm
  },
  data () {
    return {
      titleName: '培训计划管理',
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
  methods: {
    approvalClick (row) {
      update(Object.assign(row, { billState: '30' })).then(res => {
        this.$refs.table.refresh()
      })
    },
    showFormClick (operateType, id) {
      this.$router.push({ name: 'trainPlanForm', params: { id: id, operateType: operateType } })
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

<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form-model
        :labelCol="{xs: {span: 24}, sm: {span: 6}}"
        :wrapperCol="{xs: {span: 24}, sm: {span: 18}}"
      >
        <a-row justify="center">
          <a-col :span="8">
            <a-form-model-item label="计划名称">
              <a-input v-model="queryParam.planName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="姓名">
              <a-input v-model="queryParam.name" />
            </a-form-model-item>
          </a-col>
          <template v-if="advanced">
            <a-col :span="8">
              <a-form-model-item label="需求部门">
                <a-input v-model="queryParam.requireDept" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="需求岗位">
                <a-input v-model="queryParam.interviewPos" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="性别">
                <a-select v-model="queryParam.gender">
                  <a-select-option value="男">男</a-select-option>
                  <a-select-option value="女">女</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="手机号码">
                <a-input v-model="queryParam.mobile" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="面试结果">
                <a-select v-model="queryParam.interviewResult">
                  <a-select-option value="通过">通过</a-select-option>
                  <a-select-option value="未通过">未通过</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8"></a-col>
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
        slot="action"
        slot-scope="text, row"
      >
        <template>
          <a @click="showFormClick('view', row.id)">查看</a>
          <a-divider type="vertical" />
          <a @click="showFormClick('edit', row.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确认要删除吗？'"
            @confirm="deleteClick(row.id)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/hr/interview'
import InterviewForm from './InterviewForm'
import moment from 'moment'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  // { title: '计划id', dataIndex: 'planId' },
  { title: '计划名称', dataIndex: 'planName' },
  { title: '需求部门', dataIndex: 'requireDept' },
  { title: '需求岗位', dataIndex: 'interviewPos' },
  { title: '姓名', dataIndex: 'name' },
  { title: '性别', dataIndex: 'gender' },
  // { title: '出生日期', dataIndex: 'birthday' },
  { title: '手机号码', dataIndex: 'mobile' },
  { title: '面试日期', dataIndex: 'interviewDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  { title: '面试结果', dataIndex: 'interviewResult' },
  { title: '填报人', dataIndex: 'enterPerson' },
  // { title: '填报时间', dataIndex: 'enterTime' },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    planId: optEnum.equalsTo,
    planName: optEnum.like,
    requireDept: optEnum.like,
    interviewPos: optEnum.like,
    name: optEnum.like,
    gender: optEnum.like,
    birthday: optEnum.equalsTo,
    mobile: optEnum.like,
    interviewDate: optEnum.equalsTo,
    interviewResult: optEnum.equalsTo,
    enterPerson: optEnum.like,
    enterTime: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    InterviewForm
  },
  data () {
    return {
      titleName: '面试管理管理',
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
      selectedRow: {}
    }
  },
  methods: {
    showFormClick (operateType, id) {
      this.$router.push({ name: 'interviewForm', params: { id: id, operateType: operateType } })
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
    dateFormat (val, format = 'YYYY-MM-DD') {
      return val ? moment(val).format(format) : ''
    }
  }
}
</script>

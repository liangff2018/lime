<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form
        :labelCol="{xs: {span: 24}, sm: {span: 6}}"
        :wrapperCol="{xs: {span: 24}, sm: {span: 18}}"
      >
        <a-row justify="center">
          <a-col :span="8">
            <a-form-item label="工号">
              <a-input v-model="queryParam.staffNumber" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.staffName" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :span="8">
              <a-form-item label="性别">
                <a-select v-model="queryParam.gender">
                  <a-select-option
                    v-for="item in genderItems"
                    :key="item.id"
                    :value="item.code"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="身份证">
                <a-input v-model="queryParam.idCard" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="地址">
                <a-input v-model="queryParam.address" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="手机">
                <a-input v-model="queryParam.moblie" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="婚姻状况">
                <a-select v-model="queryParam.maritalStatus">
                  <a-select-option
                    v-for="item in maritalItems"
                    :key="item.id"
                    :value="item.code"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="毕业学校">
                <a-input v-model="queryParam.school" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="毕业日期">
                <a-input v-model="queryParam.schoolDate" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="学历">
                <a-select v-model="queryParam.education">
                  <a-select-option
                    v-for="item in educationItems"
                    :key="item.id"
                    :value="item.code"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="爱好">
                <a-input v-model="queryParam.hobby" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="特长">
                <a-input v-model="queryParam.speciality" />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="8">
              <a-form-item label="部门id">
                <a-input v-model="queryParam.deptId" />
              </a-form-item>
            </a-col> -->
            <a-col :span="8">
              <a-form-item label="部门">
                <a-input v-model="queryParam.deptName" />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="8">
              <a-form-item label="岗位id">
                <a-input v-model="queryParam.posId" />
              </a-form-item>
            </a-col> -->
            <a-col :span="8">
              <a-form-item label="岗位">
                <a-input v-model="queryParam.posName" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="入职日期">
                <a-input v-model="queryParam.entryDate" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="离职日期">
                <a-input v-model="queryParam.leaveDate" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="员工状态">
                <a-select v-model="queryParam.staffState">
                  <a-select-option
                    v-for="item in staffStateItems"
                    :key="item.id"
                    :value="item.code"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
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
      </a-form>
    </div>

    <a-button
      v-if="!baseQuery"
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
        slot="genderFilter"
        slot-scope="text"
      >
        {{ text | commonFilter(genderItems) }}
      </span>
      <span
        slot="staffStateFilter"
        slot-scope="text"
      >
        <a-badge
          :status="text | statusTypeFilter"
          :text="text | commonFilter(staffStateItems)"
        />
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
import { findPage, deleteById } from '@/api/hr/staff'
import StaffForm from './StaffForm'
import { findItemsByName } from '@/api/system/staticData'
import moment from 'moment'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '工号', dataIndex: 'staffNumber' },
  { title: '姓名', dataIndex: 'staffName' },
  { title: '性别', dataIndex: 'gender', scopedSlots: { customRender: 'genderFilter' } },
  { title: '身份证', dataIndex: 'idCard' },
  // { title: '地址', dataIndex: 'address' },
  // { title: '手机', dataIndex: 'moblie' },
  // { title: '婚姻状况', dataIndex: 'maritalStatus' },
  // { title: '毕业学校', dataIndex: 'school' },
  // { title: '毕业日期', dataIndex: 'schoolDate' },
  // { title: '学历', dataIndex: 'education' },
  // { title: '爱好', dataIndex: 'hobby' },
  // { title: '特长', dataIndex: 'speciality' },
  // { title: '部门id', dataIndex: 'deptId' },
  { title: '部门', dataIndex: 'deptName' },
  // { title: '岗位id', dataIndex: 'posId' },
  { title: '岗位', dataIndex: 'posName' },
  { title: '入职日期', dataIndex: 'entryDate', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD') : '' } },
  // { title: '离职日期', dataIndex: 'leaveDate' },
  { title: '员工状态', dataIndex: 'staffState', scopedSlots: { customRender: 'staffStateFilter' } },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' }, className: '' }
]

// 操作符对象
const opts = {
  operators: {
    staffNumber: optEnum.like,
    staffName: optEnum.like,
    gender: optEnum.equalsTo,
    idCard: optEnum.like,
    address: optEnum.like,
    moblie: optEnum.like,
    maritalStatus: optEnum.like,
    school: optEnum.like,
    schoolDate: optEnum.equalsTo,
    education: optEnum.like,
    hobby: optEnum.like,
    speciality: optEnum.like,
    deptId: optEnum.equalsTo,
    deptName: optEnum.like,
    posId: optEnum.equalsTo,
    posName: optEnum.like,
    entryDate: optEnum.equalsTo,
    leaveDate: optEnum.equalsTo,
    staffState: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    StaffForm
  },
  props: {
    baseQuery: {
      type: Object,
      default: () => undefined
    }
  },
  data () {
    return {
      titleName: '员工信息管理',
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(Object.assign(this.queryParam, this.baseQuery || {}), opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          this.$emit('selectedRowHandle', this.selectedRow)
          return res
        })
      },
      selectedRow: {},
      genderItems: [],
      maritalItems: [],
      educationItems: [],
      staffStateItems: []
    }
  },
  created () {
    findItemsByName('性别', 1).then(res => {
      this.genderItems = res
    })
    findItemsByName('婚姻状况', 1).then(res => {
      this.maritalItems = res
    })
    findItemsByName('学历', 1).then(res => {
      this.educationItems = res
    })
    findItemsByName('员工状态', 1).then(res => {
      this.staffStateItems = res
    })
    // 当前组件做为子组件时，如果父组件传递baseQuery参数时，则隐藏操作列
    if (this.baseQuery) {
      columns.map(item => {
        if (item.className === '') {
          item = Object.assign(item, { className: 'columnHide' })
        }
      })
    } else {
      columns.map(item => {
        if (item.className === 'columnHide') {
          item = Object.assign(item, { className: '' })
        }
      })
    }
  },
  methods: {
    showFormClick (operateType, id) {
      this.$router.push({ name: 'staffForm', params: { id: id, operateType: operateType } })
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
            this.$emit('selectedRowHandle', this.selectedRow)
          }
        }
      }
    },
    setRowClassName (row, index) {
      return row.id === this.selectedRow.id ? 'table-row-selected-color' : ''
    }
  },
  filters: {
    commonFilter (code, items = []) {
      if (code === undefined) {
        return ''
      }
      const item = items.find(item => {
        return item.code === code
      })
      return item ? item.name : code
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        1: 'success',
        2: 'error'
      }
      return statusTypeMap[type]
    }
  }
}
</script>

<style lang="less" spoce>
.columnHide {
  display: none;
}
</style>

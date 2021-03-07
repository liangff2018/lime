<template>
  <div>
    <a-card
      :title="titleName"
      :bordered="false"
    >
      <a-form-model
        ref="formModel"
        :model="dataForm"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="单据编号"
              prop="billNo"
            >
              <span>
                {{ dataForm.billNo }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="单据状态"
              prop="billState"
            >
              <span>
                {{ dataForm.billState | billStateFilter(billStateItems) }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="单据日期"
              prop="billDate"
            >
              <span>
                {{ dataForm.billDate | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="部门"
              prop="deptName"
            >
              <a-tree-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.deptName"
                :loadData="onLoadData"
                :treeData="treeData"
                :replaceFields="{ title: 'name', key: 'id', value: 'name' }"
                @change="deptChange"
                placeholder="请输入部门"
              />
              <span v-else>
                {{ dataForm.deptName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报人"
              prop="enterPerson"
            >
              <span>
                {{ dataForm.enterPerson }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报时间"
              prop="enterTime"
            >
              <span>
                {{ dataForm.enterTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="描述"
              prop="reason"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.reason"
                type="textarea"
                :auto-size="{ minRows: 4, maxRows: 4 }"
                placeholder="请输入描述"
              />
              <span v-else>
                {{ dataForm.reason }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              prop="remarks"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.remarks"
                type="textarea"
                :auto-size="{ minRows: 3, maxRows: 3 }"
                placeholder="请输入备注"
              />
              <span v-else>
                {{ dataForm.remarks }}
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <a-card title="招聘需求明细信息">
      <a-button
        type="primary"
        v-if="operateType !== 'view'"
        @click="showModalClick('new', {}, -1)"
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
          slot-scope="text, row, index"
        >
          <template>
            <a @click="showModalClick('view', row, index)">查看</a>

            <span v-if="operateType !== 'view' && dataForm.billState != '30'">
              <a-divider type="vertical" />
              <a @click="showModalClick('edit', row, index)">编辑</a>
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

    <recruit-require-detail-modal
      forceRender
      ref="rrdModal"
      @ok="okHandle"
    ></recruit-require-detail-modal>

    <footer-tool-bar>
      <span v-show="operateType === 'new' || operateType === 'edit'">
        <a-button
          type="primary"
          @click="okClick"
        >提交</a-button>
        <a-divider type="vertical" />
      </span>
      <a-button @click="cancelClick">取消</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import STable from '@/components/Table'
import { add, update, findById } from '@/api/hr/recruitRequire'
import { createNextNo } from '@/api/system/sysCode'
import { findOrgByParentId } from '@/api/system/organization'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findItemsByName } from '@/api/system/staticData'
import { deleteById } from '@/api/hr/recruitRequireDetail'
import RecruitRequireDetailModal from './modules/RecruitRequireDetailModal'

const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  // { title: '主表id', dataIndex: 'mainId' },
  { title: '岗位', dataIndex: 'posName' },
  { title: '人数', dataIndex: 'personNum' },
  { title: '到岗日期', dataIndex: 'jobDate', customRender: val => val ? moment(val).format('YYYY-MM-DD') : '' },
  { title: '专业要求', dataIndex: 'major' },
  { title: '学历要求', dataIndex: 'education' },
  { title: '岗位要求', dataIndex: 'posRequire' },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    FooterToolBar,
    STable,
    RecruitRequireDetailModal
  },
  data () {
    return {
      titleName: '新增招聘需求',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      dataForm: {
        id: undefined,
        billNo: '',
        billState: '',
        billDate: undefined,
        deptId: undefined,
        deptName: '',
        reason: '',
        remarks: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        remarks: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ]
      },
      treeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      billStateItems: [],
      columns,
      detailData: {
        data: [],
        pageSize: 10,
        pageNo: 1,
        totalPage: 1,
        totalCount: 0
      },
      loadData: param => {
        return new Promise(resolve => {
          resolve(this.detailData)
        }).then(res => res)
      },
      selectedRow: {}
    }
  },
  created () {
    this.open(this.$route.params)
    this.onLoadRootData()
    findItemsByName('单据状态', 1).then(res => {
      this.billStateItems = res
    })
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  methods: {
    okHandle (row, index) {
      if (index === -1) {
        this.detailData.data.push(row)
      } else {
        this.detailData.data[index] = row
      }
    },
    showModalClick (operateType, row, index) {
      this.$refs.rrdModal.open(operateType, row, index)
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.$refs.table.refresh()
      })
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
    },
    onLoadRootData () {
      findOrgByParentId().then(res => {
        this.treeData = res.filter(item => {
          item = Object.assign(item, { disabled: item.orgKindId !== 3 })
          return item.orgKindId < 3
        })
      })
    },
    onLoadData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        findOrgByParentId(treeNode.eventKey).then(res => {
          treeNode.dataRef.children = res.filter(item => {
            item = Object.assign(item, { disabled: item.orgKindId !== 2 })
            return item.orgKindId < 3
          })
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    deptChange (value, label, extra) {
      this.dataForm = Object.assign(this.dataForm, {
        deptId: extra.triggerNode.dataRef.id
      })
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新增招聘需求'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        })
        createNextNo('YQJH' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '招聘需求'
        findById(param.id).then(res => {
          this.dataForm = res
          res.details.map(item => {
            this.detailData.data.push(item)
          })
        })
      }
    },
    okClick () {
      this.$refs.formModel.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.operateType === 'new') {
          add(Object.assign(this.dataForm, { details: this.detailData.data })).then(res => {
            this.$router.go(-1)
          })
        } else if (this.operateType === 'edit') {
          update(Object.assign(this.dataForm, { details: this.detailData.data })).then(res => {
            this.$router.go(-1)
          })
        }
      })
    },
    cancelClick () {
      this.$router.go(-1)
    }
  },
  filters: {
    dateFormat (val, format = 'YYYY-MM-DD') {
      return val ? moment(val).format(format) : ''
    },
    billStateFilter (val, items) {
      const item = items.find(item => {
        return item.code === val
      })
      if (item) {
        return item.name
      }
      return ''
    }
  }
}
</script>

<style lang="less" scope>
.ant-form-item-control-wrapper {
  min-height: 40px;
}
</style>

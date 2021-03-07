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
              label="计划名称"
              prop="planName"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.planName"
                placeholder="请输入计划名称"
              />
              <span v-else>
                {{ dataForm.planName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="开始日期"
              prop="planDateStart"
            >
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.planDateStart"
                placeholder="请输入开始日期"
              />
              <span v-else>
                {{ dataForm.planDateStart | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="结束日期"
              prop="planDateEnd"
            >
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.planDateEnd"
                placeholder="请输入结束日期"
              />
              <span v-else>
                {{ dataForm.planDateEnd | dateFormat }}
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
              <a-textarea
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.remarks"
                placeholder="请输入备注"
                :rows="4"
              />
              <span v-else>
                {{ dataForm.remarks }}
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
        </a-row>
      </a-form-model>
    </a-card>

    <a-card title="招聘计划明细信息">
      <a-button
        type="primary"
        v-if="operateType !== 'view'"
        @click="showModalClick"
      >选择招聘需求</a-button>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :rowKey="(row) => row.id"
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
            <span v-if="operateType !== 'view' && dataForm.billState != '30'">
              <a-popconfirm
                :title="'确认要删除吗？'"
                @confirm="deleteClick(row.id, index)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>

          </template>
        </span>
      </s-table>
    </a-card>

    <recruit-require-modal
      ref="rrModal"
      @ok="okHandle"
    ></recruit-require-modal>

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
import { add, update, findById, deleteDetailById } from '@/api/hr/recruitPlan'
import { createNextNo } from '@/api/system/sysCode'
import moment from 'moment'
import { mapGetters } from 'vuex'
import RecruitRequireModal from './modules/RecruitRequireModal'

const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '需求部门', dataIndex: 'deptName' },
  { title: '需求岗位', dataIndex: 'posName' },
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
    RecruitRequireModal
  },
  data () {
    return {
      titleName: '新增招聘计划',
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
        planName: '',
        planDateStart: undefined,
        planDateEnd: undefined,
        remarks: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        planDateStart: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        planDateEnd: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ]
      },
      billStateItems: [
        { code: '10', name: '编辑中' },
        { code: '30', name: '已完成' }
      ],
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
      }
    }
  },
  created () {
    this.open(this.$route.params)
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  methods: {
    showModalClick () {
      this.$refs.rrModal.open()
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建招聘计划'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        })
        createNextNo('ZPJH' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '招聘计划'
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
    okHandle (values) {
      values.map(item => {
        const flag = this.detailData.data.some(row => {
          return row.requirePosId === item.id
        })
        if (!flag) {
          const { id, ...data } = item
          this.detailData.data.push(Object.assign(data, { requirePosId: id }))
        }
      })
    },
    deleteClick (id, index) {
      if (id !== undefined) {
        deleteDetailById(id).then(res => { })
      }
      this.detailData.data.splice(index, 1)
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

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
              label="员工姓名"
              prop="staffName"
            >
              <a-row
                type="flex"
                v-if="operateType === 'new' || operateType === 'edit'"
              >
                <a-col flex="auto">
                  <a-input
                    v-if="operateType === 'new' || operateType === 'edit'"
                    disabled
                    v-model="dataForm.staffName"
                    placeholder="请选择员工"
                  />
                </a-col>
                <a-col flex="32px">
                  <a-button
                    icon="search"
                    @click="staffClick"
                  ></a-button>
                </a-col>
              </a-row>

              <span v-else>
                {{ dataForm.staffName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="部门"
              prop="deptName"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                disabled
                v-model="dataForm.deptName"
              />
              <span v-else>
                {{ dataForm.deptName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="岗位"
              prop="posName"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                disabled
                v-model="dataForm.posName"
              />
              <span v-else>
                {{ dataForm.posName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="离职原因"
              prop="reason"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.reason"
                type="textarea"
                :auto-size="{ minRows: 8, maxRows: 8 }"
                placeholder="请输入离职原因"
              />
              <span v-else>
                {{ dataForm.reason }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="离职日期"
              prop="leaveDate"
            >
              <a-date-picker
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.leaveDate"
                style="width: 100%"
                placeholder="请输入离职日期"
              />
              <span v-else>
                {{ dataForm.leaveDate | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报人"
              prop="entryPerson"
            >
              <span>
                {{ dataForm.entryPerson }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报时间"
              prop="entryTime"
            >
              <span>
                {{ dataForm.entryTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="审批人"
              prop="replyPerson"
            >
              <span>
                {{ dataForm.replyPerson }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="审批时间"
              prop="replyTime"
            >
              <span>
                {{ dataForm.replyTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <staff-model
      ref="staffModel"
      @ok="handleOk"
    />
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
import { add, update, findById } from '@/api/hr/leaveOffice'
import { createNextNo } from '@/api/system/sysCode'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findItemsByName } from '@/api/system/staticData'
import StaffModel from './modules/StaffModal'

export default {
  components: {
    FooterToolBar,
    StaffModel
  },
  data () {
    return {
      titleName: '新增员工离职',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      billStateItems: [],
      dataForm: {
        id: undefined,
        billNo: '',
        billState: '',
        billDate: undefined,
        staffId: undefined,
        staffName: '',
        deptName: '',
        posName: '',
        reason: '',
        leaveDate: undefined,
        entryPerson: '',
        entryTime: undefined,
        replyPerson: '',
        replyTime: undefined
      },
      rules: {
        id: [
          { required: false, message: '请输入主键', trigger: 'blur' }
        ],
        billNo: [
          { required: false, message: '请输入单据编号', trigger: 'blur' }
        ],
        billState: [
          { required: false, message: '请输入单据状态', trigger: 'blur' }
        ],
        billDate: [
          { required: false, message: '请输入单据日期', trigger: 'blur' }
        ],
        staffId: [
          { required: false, message: '请输入员工id', trigger: 'blur' }
        ],
        staffName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        deptName: [
          { required: false, message: '请输入部门', trigger: 'blur' }
        ],
        posName: [
          { required: false, message: '请输入岗位', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入离职原因', trigger: 'blur' }
        ],
        leaveDate: [
          { required: true, message: '请输入离职日期', trigger: 'blur' }
        ],
        entryPerson: [
          { required: false, message: '请输入填报人', trigger: 'blur' }
        ],
        entryTime: [
          { required: false, message: '请输入填报时间', trigger: 'blur' }
        ],
        replyPerson: [
          { required: false, message: '请输入审批人', trigger: 'blur' }
        ],
        replyTime: [
          { required: false, message: '请输入审批时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.open(this.$route.params)
    findItemsByName('单据状态', 1).then(res => {
      this.billStateItems = res
    })
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建员工离职'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          entryPerson: this.userInfo.name,
          entryTime: moment(new Date())
        })
        createNextNo('YGLZ' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '员工离职'
        findById(param.id).then(res => {
          this.dataForm = res
        })
      }
    },
    staffClick () {
      this.$refs.staffModel.open()
    },
    handleOk (value) {
      this.dataForm = Object.assign(this.dataForm, {
        staffId: value.id,
        staffName: value.staffName,
        deptName: value.deptName,
        posName: value.posName
      })
    },
    okClick () {
      this.$refs.formModel.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.operateType === 'new') {
          add(this.dataForm).then(res => {
            this.$router.go(-1)
          })
        } else if (this.operateType === 'edit') {
          update(this.dataForm).then(res => {
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

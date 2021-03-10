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
              label="奖惩类型"
              prop="rewardType"
            >
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.rewardType"
                placeholder="请输入奖惩类型"
              >
                <a-select-option value="奖励">奖励</a-select-option>
                <a-select-option value="惩罚">惩罚</a-select-option>
              </a-select>
              <span v-else>
                {{ dataForm.rewardType }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="金额"
              prop="amount"
            >
              <a-input-number
                :min="0"
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.amount"
                placeholder="请输入金额"
              />
              <span v-else>
                {{ dataForm.amount }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="奖惩日期"
              prop="startDate"
            >
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.startDate"
                placeholder="请选择奖惩日期"
              />
              <span v-else>
                {{ dataForm.startDate | dateFormat }}
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
              label="理由"
              prop="reason"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                :rows="6"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.reason"
                placeholder="请输入理由"
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
              <a-textarea
                :rows="4"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.remarks"
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
import { add, update, findById } from '@/api/hr/reward'
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
      titleName: '新增奖惩管理',
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
        staffId: undefined,
        staffName: '',
        rewardType: '',
        amount: undefined,
        startDate: undefined,
        reason: '',
        remarks: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门', trigger: 'change' }
        ],
        staffName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        rewardType: [
          { required: true, message: '请输入奖惩类型', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入奖惩日期', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入理由', trigger: 'blur' }
        ]
      },
      treeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      billStateItems: []
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
    staffClick () {
      this.$refs.staffModel.open()
    },
    handleOk (value) {
      this.dataForm = Object.assign(this.dataForm, {
        staffId: value.id,
        staffName: value.staffName
      })
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建奖惩管理'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        })
        createNextNo('JCGL' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '奖惩管理'
        findById(param.id).then(res => {
          this.dataForm = res
        })
      }
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

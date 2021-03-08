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
              label="计划名称"
              prop="planName"
            >
              <a-row
                type="flex"
                v-if="operateType === 'new' || operateType === 'edit'"
              >
                <a-col flex="auto">
                  <a-input
                    v-if="operateType === 'new' || operateType === 'edit'"
                    v-model="dataForm.planName"
                    disabled
                    placeholder="请选择计划"
                  />
                </a-col>
                <a-col flex="32px">
                  <a-button
                    icon="search"
                    @click="planClick"
                  ></a-button>
                </a-col>
              </a-row>
              <span v-else>
                {{ dataForm.planName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="需求部门"
              prop="requireDept"
            >
              <span>
                {{ dataForm.requireDept }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="需求岗位"
              prop="interviewPos"
            >
              <span>
                {{ dataForm.interviewPos }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="姓名"
              prop="name"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.name"
                placeholder="请输入姓名"
              />
              <span v-else>
                {{ dataForm.name }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="性别"
              prop="gender"
            >
              <a-select
                v-model="dataForm.gender"
                v-if="operateType === 'new' || operateType === 'edit'"
                placeholder="请选择性别"
              >
                <a-select-option
                  v-for="item in genderItems"
                  :key="item.id"
                  :value="item.name"
                >{{ item.name }}</a-select-option>
              </a-select>
              <span v-else>
                {{ dataForm.gender }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="出生日期"
              prop="birthday"
            >
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.birthday"
                placeholder="请输入出生日期"
              />
              <span v-else>
                {{ dataForm.birthday | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="手机号码"
              prop="mobile"
            >
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.mobile"
                placeholder="请输入手机号码"
              />
              <span v-else>
                {{ dataForm.mobile }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="面试日期"
              prop="interviewDate"
            >
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.interviewDate"
                placeholder="请输入面试日期"
              />
              <span v-else>
                {{ dataForm.interviewDate | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="面试结果"
              prop="interviewResult"
            >
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.interviewResult"
                placeholder="请选择面试结果"
              >
                <a-select-option value="通过">通过</a-select-option>
                <a-select-option value="未通过">未通过</a-select-option>
              </a-select>
              <span v-else>
                {{ dataForm.interviewResult }}
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

    <require-plan-modal
      ref="rpModal"
      @ok="okHandle"
    ></require-plan-modal>

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
import RequirePlanModal from './modules/RequirePlanModal'
import { add, update, findById } from '@/api/hr/interview'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  components: {
    FooterToolBar,
    RequirePlanModal
  },
  data () {
    return {
      titleName: '新增面试管理',
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
        planId: undefined,
        planName: '',
        requireDept: '',
        interviewPos: '',
        name: '',
        gender: '',
        birthday: undefined,
        mobile: '',
        interviewDate: undefined,
        interviewResult: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        birthday: [
          { required: false, message: '请输入出生日期', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        interviewDate: [
          { required: true, message: '请输入面试日期', trigger: 'blur' }
        ],
        interviewResult: [
          { required: true, message: '请输入面试结果', trigger: 'blur' }
        ]
      },
      genderItems: [
        { id: 1, name: '男' },
        { id: 2, name: '女' }
      ]
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
    planClick () {
      this.$refs.rpModal.open()
    },
    okHandle (value) {
      this.dataForm = Object.assign(this.dataForm, {
        planId: value.id,
        planName: value.planName,
        requireDept: value.deptName,
        interviewPos: value.posName
      })
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建面试管理'
        this.dataForm = Object.assign(this.dataForm, {
          enterTime: moment(new Date()),
          enterPerson: this.userInfo.name
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '面试管理'
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
    }
  }
}
</script>

<style lang="less" scope>
.ant-form-item-control-wrapper {
  min-height: 40px;
}
</style>

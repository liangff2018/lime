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
              label="培训需求编号"
              prop="requireNo"
            >
              <a-row
                type="flex"
                v-if="operateType === 'new' || operateType === 'edit'"
              >
                <a-col flex="auto">
                  <a-input
                    disabled
                    v-if="operateType === 'new' || operateType === 'edit'"
                    v-model="dataForm.requireNo"
                    placeholder="请选择培训需求"
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
                {{ dataForm.requireNo }}
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
              label="参加人数"
              prop="trainPersons"
            >
              <a-input-number
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.trainPersons"
                style="width:100%"
                placeholder="请输入参加人数"
              />
              <span v-else>
                {{ dataForm.trainPersons }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="开始日期"
              prop="startDate"
            >
              <a-date-picker
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.startDate"
                style="width: 100%"
                placeholder="请输入开始日期"
              />
              <span v-else>
                {{ dataForm.startDate }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="结束日期"
              prop="endDate"
            >
              <a-date-picker
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.endDate"
                style="width: 100%"
                placeholder="请输入结束日期"
              />
              <span v-else>
                {{ dataForm.endDate }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="培训内容"
              prop="trainContent"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.trainContent"
                :rows="4"
                placeholder="请输入培训内容"
              />
              <span v-else>
                {{ dataForm.trainContent }}
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
                :rows="3"
                placeholder="请输入备注"
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

    <train-require-modal
      ref="trModal"
      @ok="okHandle"
    ></train-require-modal>

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
import { add, update, findById } from '@/api/hr/trainPlan'
import { createNextNo } from '@/api/system/sysCode'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findItemsByName } from '@/api/system/staticData'
import TrainRequireModal from './modules/TrainRequireModal'

export default {
  components: {
    FooterToolBar,
    TrainRequireModal
  },
  data () {
    return {
      titleName: '新增培训计划',
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
        requireNo: '',
        planName: '',
        startDate: undefined,
        endDate: undefined,
        trainContent: '',
        trainPersons: undefined,
        remarks: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        requireNo: [
          { required: true, message: '请输入培训需求编号', trigger: 'blur' }
        ],
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请输入结束日期', trigger: 'blur' }
        ],
        trainContent: [
          { required: true, message: '请输入培训内容', trigger: 'blur' }
        ],
        trainPersons: [
          { required: true, message: '请输入参加人数', trigger: 'blur' }
        ]
      },
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
    planClick () {
      this.$refs.trModal.open()
    },
    okHandle (value) {
      this.dataForm = Object.assign(this.dataForm, {
        requireNo: value.billNo
      })
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建培训计划'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        })
        createNextNo('PXJH' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '培训计划'
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

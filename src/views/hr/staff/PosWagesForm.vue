<template>
  <div>
    <a-card :title="titleName" :bordered="false">
      <a-form-model
        ref="formModel"
        :model="dataForm"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="岗位id" prop="posId">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.posId"
                placeholder="请输入岗位id"
              />
              <span v-else>
                {{ dataForm.posId }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="金额" prop="amount">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.amount"
                placeholder="请输入金额"
              />
              <span v-else>
                {{ dataForm.amount }}
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
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
import { add, update, findById } from '@/api/hr/posWages'

export default {
  components: {
    FooterToolBar
  },
  data () {
    return {
      titleName: '新增岗位工资维护',
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
        posId: undefined,
        amount: undefined
      },
      rules: {
        id: [
          { required: false, message: '请输入主键', trigger: 'blur' }
        ],
        posId: [
          { required: false, message: '请输入岗位id', trigger: 'blur' }
        ],
        amount: [
          { required: false, message: '请输入金额', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.open(this.$route.params)
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建岗位工资维护'
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '岗位工资维护'
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
  }
}
</script>

<style lang="less" scope>
  .ant-form-item-control-wrapper {
    min-height: 40px;
  }
</style>

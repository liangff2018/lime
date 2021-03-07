<template>
  <a-modal
    :width="1024"
    :visible="visible"
    :title="title"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <a-form-model
      ref="formModel"
      :model="dataForm"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            label="岗位"
            prop="posName"
          >
            <a-input
              v-if="operateType === 'new' || operateType === 'edit'"
              v-model="dataForm.posName"
              placeholder="请输入岗位"
            />
            <span v-else>
              {{ dataForm.posName }}
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="人数"
            prop="personNum"
          >
            <a-input-number
              v-if="operateType === 'new' || operateType === 'edit'"
              v-model="dataForm.personNum"
              style="width: 100%"
              suffix="人"
              placeholder="请输入人数"
            />
            <span v-else>
              {{ dataForm.personNum }}
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="到岗日期"
            prop="jobDate"
          >
            <a-date-picker
              v-if="operateType === 'new' || operateType === 'edit'"
              style="width: 100%"
              v-model="dataForm.jobDate"
              placeholder="请选择到岗日期"
            />
            <span v-else>
              {{ dataForm.jobDate | dateFormat }}
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="专业要求"
            prop="major"
            :labelCol="{sm: { span: 2 }}"
            :wrapperCol="{sm: { span: 22 }}"
          >
            <a-textarea
              v-if="operateType === 'new' || operateType === 'edit'"
              v-model="dataForm.major"
              :rows="3"
              placeholder="请输入专业要求"
            />
            <span v-else>
              {{ dataForm.major }}
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="学历要求"
            prop="education"
            :labelCol="{sm: { span: 2 }}"
            :wrapperCol="{sm: { span: 22 }}"
          >
            <a-textarea
              v-if="operateType === 'new' || operateType === 'edit'"
              v-model="dataForm.education"
              :rows="3"
              placeholder="请输入学历要求"
            />
            <span v-else>
              {{ dataForm.education }}
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="岗位要求"
            prop="posRequire"
            :labelCol="{sm: { span: 2 }}"
            :wrapperCol="{sm: { span: 22 }}"
          >
            <a-textarea
              v-if="operateType === 'new' || operateType === 'edit'"
              v-model="dataForm.posRequire"
              :rows="3"
              placeholder="请输入岗位要求"
            />
            <span v-else>
              {{ dataForm.posRequire }}
            </span>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      visible: false,
      title: '招聘需求明细',
      operateType: 'view',
      index: -1,
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
        mainId: undefined,
        posName: '',
        personNum: undefined,
        jobDate: undefined,
        major: '',
        education: '',
        posRequire: ''
      },
      rules: {
        posName: [
          { required: true, message: '请输入岗位', trigger: 'blur' }
        ],
        personNum: [
          { required: true, message: '请输入人数', trigger: 'blur' }
        ],
        jobDate: [
          { required: true, message: '请输入到岗日期', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请输入专业要求', trigger: 'blur' }
        ],
        education: [
          { required: true, message: '请输入学历要求', trigger: 'blur' }
        ],
        posRequire: [
          { required: true, message: '请输入岗位要求', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open (operateType, row, index) {
      this.visible = true
      this.dataForm = row
      this.operateType = operateType
      this.index = index
    },
    okClick () {
      this.$refs.formModel.validate(valid => {
        debugger
        if (!valid) {
          return false
        }
        if (this.operateType === 'view') {
          this.$emit('ok')
        } else {
          this.$emit('ok', this.dataForm, this.index)
        }
        this.visible = false
      })
    },
    cancelClick () {
      this.visible = false
    }
  },
  filters: {
    dateFormat (val) {
      return val ? moment(val).format('YYYY-MM-DD') : ''
    }
  }
}
</script>

<style lang="less" scope>
</style>

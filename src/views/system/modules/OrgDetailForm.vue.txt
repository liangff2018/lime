<template>
  <a-modal
    title="新增组织"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            autocomplete="off"
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字!'}]}]"
          />
        </a-form-item>
        <a-form-item
          label="组织类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="true"
            v-decorator="['orgType', {rules: [{required: true, message: '组织类型不允许为空!'}]}]"
          >
            <a-select-option value="1">机构</a-select-option>
            <a-select-option value="2">部门</a-select-option>
            <a-select-option value="3">岗位</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addOrg, updateOrg, getOrgById } from '@/api/system/organization'
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      operateType: 'view',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      org: {}
    }
  },
  methods: {
    open (param) {
      this.operateType = param.type
      this.visible = true
      if (param && param.type === 'new') {
        this.form.resetFields()
      } else if (param && param.type === 'edit') {
        this.form.resetFields()
        getOrgById(param.id).then(res => {
          this.org = res
          this.form.setFieldsValue({ name: res.name, orgType: res.orgType + '' })
        })
      }
      this.org.parentId = param.parentId
      if (param && param.orgType) {
        // 设置组织类型的值
        this.form.getFieldDecorator('orgType', { initialValue: param.orgType })
        this.org.orgType = param.OrgType
      }
    },
    handleSubmit () {
      console.log('handleSubmit', '成功')

      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          var temp = Object.assign(this.org, values)
          console.log('temp', temp)

          // 应该在这里处理与服务器交互
          if (this.operateType === 'new') {
            addOrg(temp).then(res => {
              console.log('插入成功', res)
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', '添加成功.', values)
            })
          } else if (this.operateType === 'edit') {
            updateOrg(temp).then(res => {
              console.log('更新成功', res)
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', '修改成功.', values)
            })
          } else {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      console.log('handleCancel', '成功')
      this.visible = false
    }
  }
}
</script>

<template>
  <a-modal
    :visible="visible"
    title="新增人员"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <a-form :form="form">
      <a-form-item
        label="上级组织"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['mainPosName']"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input autocomplete="off" v-decorator="['username', {rules: [{required: true, min: 4, message: '请输入4到16个字符.'}]}]" />
      </a-form-item>
      <a-form-item
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input autocomplete="off" v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入2到8个字符.'}]}]" />
      </a-form-item>
      <a-form-item
        label="手机号码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input autocomplete="off" v-decorator="['phone', {rules: [{required: true}]}]" />
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input autocomplete="off" v-decorator="['email']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { findUserById, addUserToOrg, updateUserAndOrg } from '@/api/system/user'
export default {
  data () {
    return {
      name: '人员明细',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      operateType: 'view',
      form: this.$form.createForm(this),
      user: {}
    }
  },
  methods: {
    open (param) {
      this.user = { password: '123456' }
      this.operateType = param.operateType
      this.visible = true
      this.form.resetFields()
      if (this.operateType === 'new') {
        this.form.getFieldDecorator('mainPosName', { initialValue: param.mainPosName })
        this.user.mainPosId = param.mainPosId
      } else {
        findUserById(param.id).then(res => {
          debugger
          this.user = res
          this.form.setFieldsValue({
            mainPosName: res.mainPosName,
            username: res.username,
            name: res.name,
            phone: res.phone,
            email: res.email
          })
        })
        if (this.operateType !== 'edit') {
          // 不是编辑状态时，应该在这把字段设置为只读
        }
      }
    },
    okClick () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        debugger
        if (!errors) {
          if (this.operateType === 'new') {
            addUserToOrg(Object.assign(this.user, values)).then(res => {
              this.visible = false
              this.$emit('ok', '插入成功', values)
            })
          } else if (this.operateType === 'edit') {
            updateUserAndOrg(Object.assign(this.user, values, { password: '123456', createTime: undefined })).then(res => {
              this.visible = false
              this.$emit('ok', '更新成功', values)
            })
          }
        }
      })
    },
    cancelClick () {
      this.visible = false
    }
  }
}
</script>

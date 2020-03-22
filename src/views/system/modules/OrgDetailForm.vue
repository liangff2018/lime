<template>
  <a-modal
    title="新增组织"
    :width="640"
    :visible="visible"
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
          v-decorator="['parentName']"
          disabled
        />
      </a-form-item>
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
        label="编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['code', {rules: [{required: true, min: 2, message: '请输入至少2个字!'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="长名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['longName']"
        />
      </a-form-item>
      <a-form-item
        label="组织类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          :disabled="true"
          v-decorator="['orgKindId', {rules: [{required: true, message: '组织类型不允许为空!'}]}]"
        >
          <a-select-option value="1">机构</a-select-option>
          <a-select-option value="2">部门</a-select-option>
          <a-select-option value="3">岗位</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { addOrg, findOrgById, updateOrg } from '@/api/system/organization'
export default {
  data () {
    return {
      name: '组织机构详细信息',
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
      org: {}
    }
  },
  methods: {
    open (param) {
      this.org = {}
      this.operateType = param.operateType
      this.visible = true
      this.form.resetFields()
      if (this.operateType === 'new') {
        this.form.getFieldDecorator('orgKindId', { initialValue: param.orgKindId })
        this.form.getFieldDecorator('parentName', { initialValue: param.parentName })
        this.org.orgKindId = param.orgKindId
        this.org.parentId = param.parentId
      } else {
        findOrgById(param.id).then(res => {
          this.org = res
          this.form.setFieldsValue({
            parentName: res.parentName,
            code: res.code,
            name: res.name,
            longName: res.longName,
            orgKindId: res.orgKindId + ''
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
        if (!errors) {
          if (this.operateType === 'new') {
            addOrg(Object.assign(this.org, values)).then(res => {
              this.visible = false
              this.$emit('ok', '插入成功', values)
            })
          } else if (this.operateType === 'edit') {
            updateOrg(Object.assign(this.org, values)).then(res => {
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

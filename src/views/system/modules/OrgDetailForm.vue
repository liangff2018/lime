<template>
  <a-modal
    title="新增组织"
    :width="640"
    :visible="visible"
    :confirmLoading="isLoading"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <a-spin :spinning="isLoading">
      <a-form :form="form">
        <a-form-item
          label="上级组织"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['parentName']" disabled />
        </a-form-item>
        <a-form-item
          label="编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['code', {rules: [{required: true, min: 2, messsage: '请输入至少2个字!'}]}]" />
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
    </a-spin>
  </a-modal>
</template>

<script>
import { addOrg, findOrgById } from '@/api/system/organization'
export default {
  data () {
    return {
      name: '组织机构详细信息',
      visible: false,
      isLoading: false,
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
      this.operateType = param.type
      this.visible = true
      this.form.getFieldDecorator('orgKindId', { initialValue: param.orgType })
      this.org.orgKindId = param.orgType
    },
    okClick () {
      console.log('okClick', '调用成功.')
      this.isLoading = true
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          var param = Object.assign(this.org, values)
          console.log('param', param)
          addOrg(param).then(res => {
            console.log('插入成功', res)
            this.isLoading = false
            this.visible = false
            this.$emit('ok', '插入成功', values)
          })
        } else {
          this.isLoading = false
        }
      })
    },
    cancelClick () {
      findOrgById('1').then(res => {
        console.log('res结果', res)
      })
      this.visible = false
    }
  }
}
</script>

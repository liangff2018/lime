<template>
  <a-modal
    :width="640"
    :visible="visible"
    :title="titleName"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <a-form :form="form">
      <a-form-item
        label="父权限名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          disabled="true"
          v-decorator="['parentName']"
        />
      </a-form-item>
      <a-form-item
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['name', {rules: [{required: true, message: '[名称]不允许为空.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['code', {rules: [{required: true, message: '[编码]不允许为空.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="url"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['url']"
        />
      </a-form-item>
      <a-form-item
        label="请求方式"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          v-decorator="['apiMethod']"
          allowClear="true"
        >
          <a-select-option value="post">post</a-select-option>
          <a-select-option value="get">get</a-select-option>
          <a-select-option value="put">put</a-select-option>
          <a-select-option value="delete">delete</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['description']"
        />
      </a-form-item>
      <a-form-item
        label="序号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['sequence']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add, update, findById } from '@/api/system/permission'

export default {
  data () {
    return {
      titleName: '新增权限',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      data: {}
    }
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      this.form.resetFields()
      this.visible = true
      if (this.operateType === 'new') {
        this.titleName = '新建权限'
        this.data = { parentId: param.parentId }
        this.form.setFieldsValue({ code: param.code, parentName: param.parentName })
      } else if (this.operateType === 'edit') {
        this.titleName = '编辑权限'
        findById(param.id).then(res => {
          this.data = Object.assign(this.data, res)
          this.form.setFieldsValue(res)
        })
        findById(param.parentId).then(res => {
          this.form.setFieldsValue({ parentName: res.name })
        })
      }
    },
    okClick () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.operateType === 'new') {
            add(Object.assign(this.data, values)).then(res => {
              this.$emit('ok', '新建成功', values)
              this.visible = false
            })
          } else if (this.operateType === 'edit') {
            update(Object.assign(this.data, values)).then(res => {
              this.$emit('ok', '更新成功', values)
              this.visible = false
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

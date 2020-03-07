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
        label="编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['code', {rules: [{required: true, min: 2, message: '请输入至少2个字!'}]}]"
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
        label="请求URL"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['url', {rules: [{required: true, message: '请求URL不允许为空!'}]}]" />
      </a-form-item>
      <a-form-item
        label="请求方式"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select v-decorator="['apiMethod']">
          <a-select-option value="get">get</a-select-option>
          <a-select-option value="post">post</a-select-option>
          <a-select-option value="put">put</a-select-option>
          <a-select-option value="delete">delete</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-textarea v-decorator="['description']" />
      </a-form-item>
      <a-form-item
        label="序号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number v-decorator="['sequence']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add, findById, update } from '@/api/system/resource'
export default {
  data () {
    return {
      titleName: '新建菜单',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      resource: { parentId: 0 },
      form: this.$form.createForm(this),
      visible: false
    }
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      this.form.resetFields()
      this.visible = true
      if (this.operateType === 'new') {
        this.titleName = '新建资源'
        this.resource = Object.assign(this.resource, { parentId: param.parentId })
      } else if (this.operateType === 'edit') {
        this.titleName = '编辑资源'
        findById(param.id).then(res => {
          debugger
          const { id, parentId, ...temp } = res
          this.resource = Object.assign(this.resource, { id: id, parentId: parentId })
          this.form.setFieldsValue(temp)
        })
      }
    },
    okClick () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.operateType === 'new') {
            add(Object.assign(this.resource, values)).then(res => {
              this.$emit('ok', '新建成功', values)
              this.visible = false
            })
          } else if (this.operateType === 'edit') {
            update(Object.assign(this.resource, values)).then(res => {
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

<style scoped>
.ant-input-number {
  width: 100% !important;
}
</style>

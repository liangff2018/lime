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
        label="键"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['id', {rules: [{required: true, message: '[键]不允许为空.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="值"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['value']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add, update, findById } from '@/api/system/sysCode'

export default {
  data () {
    return {
      titleName: '新增静态数据',
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
        this.titleName = '新建静态数据'
        this.data = {}
      } else if (this.operateType === 'edit') {
        this.titleName = '编辑静态数据'
        findById(param.id).then(res => {
          this.data = Object.assign(this.data, res)
          this.form.setFieldsValue(res)
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

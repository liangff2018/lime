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
        label="创建人Id"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['createPersonId']"
        />
      </a-form-item>
      <a-form-item
        label="创建人"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['createPersonName']"
        />
      </a-form-item>
      <a-form-item
        label="创建时间"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['createTime']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { add, update, findById } from '@/api/system/authorize'

export default {
  data () {
    return {
      titleName: '新增授权管理',
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
        this.titleName = '新建授权管理'
        this.data = {}
      } else if (this.operateType === 'edit') {
        this.titleName = '编辑授权管理'
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

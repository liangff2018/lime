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
        label="分类名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="!isMain"
      >
        {{ parentName }}
      </a-form-item>
      <a-form-item
        label="编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="!isMain"
      >
        <a-input
          :disabled="disabled"
          autocomplete="off"
          v-decorator="['code', {rules: [{required: !isMain, message: '请输入编码.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="disabled"
          autocomplete="off"
          v-decorator="['name', {rules: [{required: true, message: '请输入名称.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="序号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="disabled"
          autocomplete="off"
          v-decorator="['sequence']"
        />
      </a-form-item>
      <a-form-item
        label="备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="disabled"
          autocomplete="off"
          v-decorator="['note']"
        />
      </a-form-item>
      <!-- <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="false"
      >
        <a-input
          autocomplete="off"
          v-decorator="['state']"
        />
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<script>
import { add, update, findById } from '@/api/system/staticData'

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
      isMain: true,
      parentName: undefined,
      form: this.$form.createForm(this),
      data: {}
    }
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      this.parentName = param.parentName

      this.disabled = this.operateType === 'view'
      this.isMain = param.isMain
      this.form.resetFields()
      this.visible = true
      if (this.operateType === 'new') {
        this.titleName = '新建静态数据'
        this.data = Object.assign(this.data, { parentId: param.id, state: 1 })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '静态数据'
        findById(param.id).then(res => {
          this.data = Object.assign(this.data, res)
          this.form.setFieldsValue(res)
        })
      }
    },
    okClick () {
      if (this.disabled) {
        this.visible = false
      }
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.operateType === 'new') {
            add(Object.assign(this.data, values)).then(res => {
              this.$emit('ok', '新建成功', values, this.isMain)
              this.visible = false
            })
          } else if (this.operateType === 'edit') {
            update(Object.assign(this.data, values)).then(res => {
              this.$emit('ok', '更新成功', values, this.isMain)
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

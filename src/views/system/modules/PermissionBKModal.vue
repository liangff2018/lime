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
        label="父id"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['parentId']"
        />
      </a-form-item>
      <a-form-item
        label="菜单title"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['numeTitle']"
        />
      </a-form-item>
      <a-form-item
        label="菜单key"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['numeKey']"
        />
      </a-form-item>
      <a-form-item
        label="菜单name"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['numeName']"
        />
      </a-form-item>
      <a-form-item
        label="组件名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['component']"
        />
      </a-form-item>
      <a-form-item
        label="重定向url"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['redirect']"
        />
      </a-form-item>
      <a-form-item
        label="图标"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['numeIcon']"
        />
      </a-form-item>
      <a-form-item
        label="隐藏菜单"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['numeHidden']"
        />
      </a-form-item>
      <a-form-item
        label="隐藏头部"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['hiddenheadercontent']"
        />
      </a-form-item>
      <a-form-item
        label="类型;1:菜单,2:api"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['kind', {rules: [{required: true, message: '[类型;1:菜单,2:api]不允许为空.'}]}]"
        />
      </a-form-item>
      <a-form-item
        label="api名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['apiName']"
        />
      </a-form-item>
      <a-form-item
        label="api主键"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['apiKey']"
        />
      </a-form-item>
      <a-form-item
        label="api路径"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['apiUrl']"
        />
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          autocomplete="off"
          v-decorator="['validState', {rules: [{required: true, message: '[状态]不允许为空.'}]}]"
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

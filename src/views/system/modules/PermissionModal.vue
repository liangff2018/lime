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
        label="类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          disabled="ture"
          v-decorator="['type']"
        >
          <a-radio :value="1">菜单</a-radio>
          <a-radio :value="2">api</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="是否可见"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group v-decorator="['isVisible', {initialValue: 1}]">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="组件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="permission.type === 1"
      >
        <a-input v-decorator="['component']" placeholder="指定使用的组件，如组织机构为Organization" />
      </a-form-item>
      <a-form-item
        label="转发"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="permission.type === 1"
      >
        <a-input v-decorator="['redirect']" placeholder="指定转发地址" />
      </a-form-item>
      <a-form-item
        label="请求URL"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="permission.type === 2"
      >
        <a-input v-decorator="['url', {rules: [{required: permission.type === 2, message: '请求URL不允许为空!'}]}]" />
      </a-form-item>
      <a-form-item
        label="请求方式"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="permission.type === 2"
      >
        <a-select v-decorator="['reqMethod', {rules: [{required: permission.type === 2, message: '请求方式不允许为空!'}]}]">
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
      <!-- <a-form-item
        label="序号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number v-decorator="['sequence']" />
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<script>
import { add, findById, update } from '@/api/system/permission'
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
      permission: { parentId: 0, isVisible: 1, state: 1, type: 1 },
      visible: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.permission = Object.assign(this.permission, { parentId: param.parentId, type: param.type })
        this.titleName = '新建资源' + (this.permission.type === 1 ? '-菜单' : '-api')
      } else if (this.operateType === 'edit') {
        findById(param.id).then(res => {
          const { id, parentId, ...temp } = res
          this.permission = Object.assign(this.permission, { id: id, parentId: parentId })
          this.titleName = '编辑资源' + (this.permission.type === 1 ? '-菜单' : '-api')
          this.form.setFieldsValue(temp)
        })
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({ type: param.type })
      })
    },
    okClick () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.operateType === 'new') {
            add(Object.assign(this.permission, values)).then(res => {
              this.$emit('ok', '新建成功', values)
              this.visible = false
            })
          } else if (this.operateType === 'edit') {
            update(Object.assign(this.permission, values)).then(res => {
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

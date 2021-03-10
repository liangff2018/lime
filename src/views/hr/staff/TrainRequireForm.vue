<template>
  <div>
    <a-card
      :title="titleName"
      :bordered="false"
    >
      <a-form-model
        ref="formModel"
        :model="dataForm"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="单据编号"
              prop="billNo"
            >
              <span>
                {{ dataForm.billNo }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="单据状态"
              prop="billState"
            >
              <span>
                {{ dataForm.billState | billStateFilter(billStateItems) }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="单据日期"
              prop="billDate"
            >
              <span>
                {{ dataForm.billDate | dateFormat }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="提出部门"
              prop="deptName"
            >
              <a-tree-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.deptName"
                :loadData="onLoadData"
                :treeData="treeData"
                :replaceFields="{ title: 'name', key: 'id', value: 'name' }"
                @change="deptChange"
                placeholder="请选择部门"
              />
              <span v-else>
                {{ dataForm.deptName }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报人"
              prop="enterPerson"
            >
              <span>
                {{ dataForm.enterPerson }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="填报时间"
              prop="enterTime"
            >
              <span>
                {{ dataForm.enterTime | dateFormat("YYYY-MM-DD HH:mm:ss") }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="原因"
              prop="reason"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                :rows="4"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.reason"
                placeholder="请输入原因"
              />
              <span v-else>
                {{ dataForm.reason }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="培训内容要求"
              prop="trainContent"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                :rows="4"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.trainContent"
                placeholder="请输入培训内容要求"
              />
              <span v-else>
                {{ dataForm.trainContent }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              prop="remarks"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                v-if="operateType === 'new' || operateType === 'edit'"
                v-model="dataForm.remarks"
                placeholder="请输入备注"
                :rows="3"
              />
              <span v-else>
                {{ dataForm.remarks }}
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <footer-tool-bar>
      <span v-show="operateType === 'new' || operateType === 'edit'">
        <a-button
          type="primary"
          @click="okClick"
        >提交</a-button>
        <a-divider type="vertical" />
      </span>
      <a-button @click="cancelClick">取消</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { add, update, findById } from '@/api/hr/trainRequire'
import { createNextNo } from '@/api/system/sysCode'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findItemsByName } from '@/api/system/staticData'
import { findOrgByParentId } from '@/api/system/organization'

export default {
  components: {
    FooterToolBar
  },
  data () {
    return {
      titleName: '新增培训需求',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      dataForm: {
        id: undefined,
        billNo: '',
        billState: '',
        billDate: undefined,
        deptId: undefined,
        deptName: '',
        reason: '',
        trainContent: '',
        remarks: '',
        enterPerson: '',
        enterTime: undefined
      },
      rules: {
        deptName: [
          { required: true, message: '请输入提出部门', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ],
        trainContent: [
          { required: true, message: '请输入培训内容要求', trigger: 'blur' }
        ]
      },
      treeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      billStateItems: []
    }
  },
  created () {
    this.onLoadRootData()
    this.open(this.$route.params)
    findItemsByName('单据状态', 1).then(res => {
      this.billStateItems = res
    })
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  methods: {
    onLoadRootData () {
      findOrgByParentId().then(res => {
        this.treeData = res.filter(item => {
          item = Object.assign(item, { disabled: item.orgKindId !== 3 })
          return item.orgKindId < 4
        })
      })
    },
    onLoadData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        findOrgByParentId(treeNode.eventKey).then(res => {
          treeNode.dataRef.children = res.filter(item => {
            item = Object.assign(item, { disabled: item.orgKindId !== 2 })
            return item.orgKindId < 3
          })
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    deptChange (value, label, extra) {
      this.dataForm = Object.assign(this.dataForm, {
        deptId: extra.triggerNode.dataRef.id
      })
      this.form.setFieldsValue({ newDeptName: extra.triggerNode.$parent.dataRef.name })
    },
    open (param) {
      this.operateType = param.operateType
      if (this.operateType === 'new') {
        this.titleName = '新建培训需求'
        this.dataForm = Object.assign(this.dataForm, {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        })
        createNextNo('PXXQ' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          this.dataForm.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '培训需求'
        findById(param.id).then(res => {
          this.dataForm = res
        })
      }
    },
    okClick () {
      this.$refs.formModel.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.operateType === 'new') {
          add(this.dataForm).then(res => {
            this.$router.go(-1)
          })
        } else if (this.operateType === 'edit') {
          update(this.dataForm).then(res => {
            this.$router.go(-1)
          })
        }
      })
    },
    cancelClick () {
      this.$router.go(-1)
    }
  },
  filters: {
    dateFormat (val, format = 'YYYY-MM-DD') {
      return val ? moment(val).format(format) : ''
    },
    billStateFilter (val, items) {
      const item = items.find(item => {
        return item.code === val
      })
      if (item) {
        return item.name
      }
      return ''
    }
  }
}
</script>

<style lang="less" scope>
.ant-form-item-control-wrapper {
  min-height: 40px;
}
</style>

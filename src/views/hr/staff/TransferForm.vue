<template>
  <div>
    <a-card
      :title="titleName"
      :bordered="false"
    >
      <a-form
        :form="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item label="单据状态">
              <span>
                {{ data.billState | billStateFilter(billStateItems) }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单据编号">
              <span>
                {{ data.billNo }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单据日期">
              <span>
                {{ data.billDate | dateFormat }}
              </span>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item label="员工id">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['staffId']"
              />
              <span v-else>
                {{ form.getFieldValue('staffId') }}
              </span>
            </a-form-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-item label="员工姓名">
              <a-row
                type="flex"
                v-if="operateType === 'new' || operateType === 'edit'"
              >
                <a-col flex="auto">
                  <a-input
                    placeholder="请选择员工"
                    autocomplete="off"
                    disabled
                    v-decorator="['staffName', ruleCfg.staffName]"
                  />
                </a-col>
                <a-col flex="32px">
                  <a-button
                    icon="search"
                    @click="staffClick"
                  ></a-button>
                </a-col>
              </a-row>
              <span v-else>
                {{ data.staffName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="原部门">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                disabled
                v-decorator="['currDeptName']"
              />
              <span v-else>
                {{ data.currDeptName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="原岗位">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                disabled
                v-decorator="['currPosName']"
              />
              <span v-else>
                {{ data.currPosName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="新部门">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                disabled
                v-decorator="['newDeptName']"
              />
              <span v-else>
                {{ data.newDeptName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="新岗位">
              <a-tree-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['newPosName', ruleCfg.newPosName]"
                :loadData="onLoadData"
                :treeData="treeData"
                :replaceFields="{ title: 'name', key: 'id', value: 'name' }"
                @change="posChange"
              />
              <span v-else>
                {{ data.newPosName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="调动原因"
              :labelCol="{sm: { span: 2 }}"
              :wrapperCol="{sm: { span: 22 }}"
            >
              <a-textarea
                :rows="4"
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['reason', ruleCfg.reason]"
              />
              <span v-else>
                {{ data.reason }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="填报人">
              <span>
                {{ data.enterPerson }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="填报时间">
              <span>
                {{ data.enterTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="批复人">
              <span>
                {{ data.replyPerson }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="批复时间">
              <span>
                {{ data.replyTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <staff-model
      ref="staffModel"
      @ok="handleOk"
    />
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
import StaffModel from './modules/StaffModal'
import FooterToolBar from '@/components/FooterToolbar'
import { add, update, findById } from '@/api/hr/transfer'
import { createNextNo } from '@/api/system/sysCode'
import { findOrgByParentId } from '@/api/system/organization'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findItemsByName } from '@/api/system/staticData'

export default {
  components: {
    StaffModel,
    FooterToolBar
  },
  computed: {
    // 从store获取用户信息和角色列表，可获取的内容从\src\store\getters.js中查看
    ...mapGetters(['userInfo', 'roles'])
  },
  data () {
    return {
      titleName: '新增员工调动',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: this.$form.createForm(this),
      data: {},
      ruleCfg: {
        staffName: { rules: [{ required: true, message: '请选择员工' }] },
        newPosName: { rules: [{ required: true, message: '请选择新岗位' }] },
        reason: { rules: [{ required: true, message: '请输入调动原因' }] }
      },
      treeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      billStateItems: []
    }
  },
  created () {
    this.open(this.$route.params)
    this.onLoadRootData()
    findItemsByName('单据状态', 1).then(res => {
      this.billStateItems = res
    })
  },
  methods: {
    handleOk (value) {
      console.log('接收的值', value)
      this.data = Object.assign(this.data, {
        staffId: value.id,
        currDeptId: value.deptId,
        currPosId: value.posId
      })
      this.form.setFieldsValue({
        staffName: value.staffName,
        currDeptName: value.deptName,
        currPosName: value.posName
      })
    },
    staffClick () {
      this.$refs.staffModel.open()
    },
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
            item = Object.assign(item, { disabled: item.orgKindId !== 3 })
            return item.orgKindId < 4
          })
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    posChange (value, label, extra) {
      this.data = Object.assign(this.data, {
        newPosId: extra.triggerNode.dataRef.id,
        newDeptId: extra.triggerNode.$parent.dataRef.id,
        newDeptName: extra.triggerNode.$parent.dataRef.name
      })
      this.form.setFieldsValue({ newDeptName: extra.triggerNode.$parent.dataRef.name })
    },
    open (param) {
      this.operateType = param.operateType
      this.form.resetFields()
      this.visible = true
      if (this.operateType === 'new') {
        this.titleName = '新建员工调动'
        this.data = {
          billState: '10',
          billNo: '',
          billDate: moment(new Date()),
          enterPerson: this.userInfo.name,
          enterTime: moment(new Date())
        }
        createNextNo('YGDD' + moment(new Date()).format('YYYYMM') + '-', '0000').then(res => {
          console.log(res)
          this.data.billNo = res
        })
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '员工调动'
        findById(param.id).then(res => {
          this.data = Object.assign(this.data, res)
          if (this.operateType === 'edit') {
            this.form.setFieldsValue(res)
          }
        })
      }
    },
    okClick () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.operateType === 'new') {
            add(Object.assign(this.data, values)).then(res => {
              this.$router.go(-1)
            })
          } else if (this.operateType === 'edit') {
            update(Object.assign(this.data, values)).then(res => {
              this.$router.go(-1)
            })
          }
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

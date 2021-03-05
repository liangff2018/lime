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
            <a-form-item label="工号">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['staffNumber', { rules: [{ required: true, message: '请输入工号!' }] }]"
              />
              <span v-else>
                {{ data.staffNumber }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="姓名">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['staffName', { rules: [{ required: true, message: '请输入姓名!' }] }]"
              />
              <span v-else>
                {{ data.staffName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别">
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['gender', { rules: [{ required: true, message: '请选择性别!' }] }]"
              >
                <a-select-option
                  v-for="item in genderItems"
                  :key="item.id"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
              <span v-else>
                {{ data.gender | commonFilter(genderItems) }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="身份证">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['idCard', config(true, '请输入身份证号码!', 18)]"
              />
              <span v-else>
                {{ data.idCard }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地址">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['address']"
              />
              <span v-else>
                {{ data.address }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="手机">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['moblie', config(true, '请输入手机号码!', 11)]"
              />
              <span v-else>
                {{ data.moblie }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="婚姻状况">
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['maritalStatus', config(true, '请选择婚姻状况')]"
              >
                <a-select-option
                  v-for="item in maritalItems"
                  :key="item.id"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
              <span v-else>
                {{ data.maritalStatus | commonFilter(maritalItems) }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="毕业学校">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['school']"
              />
              <span v-else>
                {{ data.school }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="毕业日期">
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['schoolDate']"
              />
              <span v-else>
                {{ data.schoolDate | dateFormat }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学历">
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['education']"
              >
                <a-select-option
                  v-for="item in educationItems"
                  :key="item.id"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
              <span v-else>
                {{ data.education | commonFilter(educationItems) }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="爱好">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['hobby']"
              />
              <span v-else>
                {{ data.hobby }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="特长">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['speciality']"
              />
              <span v-else>
                {{ data.speciality }}
              </span>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item label="部门id">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['deptId']"
              />
              <span v-else>
                {{ data.deptId }}
              </span>
            </a-form-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-item label="部门">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                disabled
                v-decorator="['deptName', config(true, '部门不允许为空')]"
              />
              <span v-else>
                {{ data.deptName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="岗位">
              <a-tree-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['posName', config(true, '请选择岗位')]"
                :loadData="onLoadData"
                :treeData="treeData"
                :replaceFields="{ title: 'name', key: 'id', value: 'name' }"
                @change="posChange"
              />
              <span v-else>
                {{ data.posName }}
              </span>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item label="岗位">
              <a-input
                v-if="operateType === 'new' || operateType === 'edit'"
                autocomplete="off"
                v-decorator="['posName']"
              />
              <span v-else>
                {{ data.posName }}
              </span>
            </a-form-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-item label="入职日期">
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['entryDate', config(true, '请选择入职日期!')]"
              />
              <span v-else>
                {{ data.entryDate | dateFormat }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="离职日期">
              <a-date-picker
                style="width: 100%"
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['leaveDate']"
              />
              <span v-else>
                {{ data.leaveDate | dateFormat }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="员工状态">
              <a-select
                v-if="operateType === 'new' || operateType === 'edit'"
                v-decorator="['staffState', config(true, '请选择员工状态!')]"
              >
                <a-select-option
                  v-for="item in staffStateItems"
                  :key="item.id"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>

              <span v-else>
                {{ data.staffState | commonFilter(staffStateItems) }}
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
import { add, update, findById } from '@/api/hr/staff'
import { findItemsByName } from '@/api/system/staticData'
import { findOrgByParentId } from '@/api/system/organization'
import moment from 'moment'

export default {
  components: {
    FooterToolBar
  },
  data () {
    return {
      titleName: '新增员工信息',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: this.$form.createForm(this),
      config: (required, requiredMsg, length = 0) => {
        const cfg = { rules: [] }
        if (required) {
          cfg.rules.push({ required: required, message: requiredMsg })
        }
        if (length > 0) {
          cfg.rules.push({ len: length, message: '长度必须是' + length + '字符' })
        }
        return cfg
      },
      data: {},
      genderItems: [],
      maritalItems: [],
      educationItems: [],
      staffStateItems: [],
      treeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' }
    }
  },
  created () {
    this.open(this.$route.params)
    findItemsByName('性别', 1).then(res => {
      this.genderItems = res
    })
    findItemsByName('婚姻状况', 1).then(res => {
      this.maritalItems = res
    })
    findItemsByName('学历', 1).then(res => {
      this.educationItems = res
    })
    findItemsByName('员工状态', 1).then(res => {
      this.staffStateItems = res
    })
    this.onLoadRootData()
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
        posId: extra.triggerNode.dataRef.id,
        deptId: extra.triggerNode.$parent.dataRef.id,
        deptName: extra.triggerNode.$parent.dataRef.name
      })
      this.form.setFieldsValue({ deptName: extra.triggerNode.$parent.dataRef.name })
    },
    open (param) {
      this.operateType = param.operateType
      this.form.resetFields()
      this.visible = true
      if (this.operateType === 'new') {
        this.titleName = '新建员工信息'
        this.data = {}
      } else if (this.operateType === 'edit' || this.operateType === 'view') {
        this.titleName = (this.operateType === 'edit' ? '编辑' : '查看') + '员工信息'
        findById(param.id).then(res => {
          this.data = Object.assign(this.data, res)
          // temp的值为除了id的所有其他属性的值,并且把日期字符串转换为date-picker可接收的类型
          const { id, deptId, posId, ...temp } = Object.assign(res, {
            schoolDate: res.schoolDate ? moment(res.schoolDate) : undefined,
            entryDate: res.entryDate ? moment(res.entryDate) : undefined,
            leaveDate: res.leaveDate ? moment(res.leaveDate) : undefined
          })
          this.form.setFieldsValue(temp)
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
    commonFilter (code, items = []) {
      if (code === undefined) {
        return ''
      }
      const item = items.find(item => {
        return item.code === code
      })
      if (item) {
        return item.name
      }
      return code
    },
    dateFormat (val) {
      return val ? moment(val).format('YYYY-MM-DD') : ''
    }
  }
}
</script>

<style lang="less" scope>
.ant-form-item-control-wrapper {
  min-height: 40px;
}
</style>

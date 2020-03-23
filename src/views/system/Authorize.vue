<template>
  <a-card style="min-height: 580px">
    <a-row :gutter="24">
      <a-col
        :span="8"
        class="col-right-line-vertical"
      >
        <a-tree
          ref="tree"
          :loadData="loadOrgData"
          :treeData="orgData"
          :replaceFields="replaceFields"
          :selectedKeys="selectedKeys"
          @select="onTreeSelect"
          showIcon
        >
          <a-icon
            type="home"
            slot="orgType1"
          />
          <a-icon
            type="star"
            slot="orgType2"
          />
          <a-icon
            type="team"
            slot="orgType3"
          />
          <a-icon
            type="user"
            slot="orgType4"
          />
          <template
            slot="custom"
            slot-scope="row"
          >
            <span>{{ row.name }}</span>
            <a-button-group style="float: right;">
              <a-button
                type="link"
                size="small"
                icon="edit"
                @click="assignRoleClick(row)"
              >分配角色</a-button>
            </a-button-group>
          </template>
        </a-tree>
      </a-col>
      <a-col :span="16">
        <a-row>
          <a-col :span="24">
            <a-input-search
              placeholder="输入过滤条件"
              style="width: 280px; float: right"
              @search="onSearchRole"
            />
          </a-col>
          <a-col :span="24">
            <s-table
              ref="table"
              :columns="columns"
              :data="loadData"
              :rowKey="(row) => row.id"
            >
              <span
                slot="serial"
                slot-scope="text, row, index"
              >
                {{ index + 1 }}
              </span>
              <span
                slot="action"
                slot-scope="text, row"
              >
                <template>
                  <a-popconfirm
                    :title="'确认要删除吗？'"
                    @confirm="deleteClick(row)"
                  >
                    <a href="javascript:;" v-if="selectedKeys[0]===row.orgId">删除</a>
                  </a-popconfirm>
                </template>
              </span>
            </s-table>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <role-list-modal
      ref="roleListModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteByOrgRoleId } from '@/api/system/authorize'
import RoleListModal from './modules/RoleListModal'
import { findOrgByParentId } from '@/api/system/organization'

const slotCustom = { scopedSlots: { title: 'custom' } }

// 列名
const columns = [
  { title: '#', width: '70px', scopedSlots: { customRender: 'serial' } },
  { title: '角色名称', dataIndex: 'roleName' },
  { title: '角色编码', dataIndex: 'roleCode' },
  { title: '所属组织', dataIndex: 'orgFullName' },
  { title: '操作', width: '70px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    orgId: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    RoleListModal
  },
  data () {
    return {
      titleName: '授权管理管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPage(param).then(res => {
          return res
        })
      },
      selectedKeys: [],
      replaceFields: { title: 'name', key: 'id' },
      orgData: [],
      selectedNode: undefined
    }
  },
  created () {
    this.loadRootOrgData()
  },
  methods: {
    loadRootOrgData () {
      findOrgByParentId().then(res => {
        this.orgData = res.map(item => Object.assign(item, slotCustom, { slots: { icon: 'orgType' + item.orgKindId } }))
        this.selectedKeys.push(this.orgData[0].id)
        this.queryParam = Object.assign(this.queryParam, { orgId: this.orgData[0].id })
        this.$refs.table.refresh()
      })
    },
    loadOrgData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        findOrgByParentId(treeNode.eventKey).then(res => {
          treeNode.dataRef.children = res.map(item => Object.assign(item, slotCustom, { slots: { icon: 'orgType' + item.orgKindId } }))
          this.orgData = [...this.orgData]
          resolve()
        })
      })
    },
    onTreeSelect (key, e) {
      this.selectedKeys = [e.node.dataRef.id]
      this.queryParam = Object.assign(this.queryParam, { orgId: e.node.dataRef.id })
      this.$refs.table.refresh()
    },
    assignRoleClick (row) {
      this.$refs.roleListModal.open({ orgId: row.id })
    },
    deleteClick (row) {
      deleteByOrgRoleId(row.orgId, row.roleId).then(res => {
        this.$refs.table.refresh()
      })
    },
    onSearchRole (value) {
      this.queryParam = Object.assign(this.queryParam, { roleName: value })
      this.$refs.table.refresh()
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-tree-node-content-wrapper {
  width: calc(100% - 24px);
}
/deep/ .col-right-line-vertical {
  min-height: 530px;
}
</style>

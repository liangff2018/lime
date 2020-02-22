<template>
  <div class="root-class-lcy">
    <a-card>
      <a-button @click="addRootOrgClick">新建根机构</a-button>
      <a-tree
        ref="tree"
        :loadData="loadOrgData"
        :treeData="orgData"
        :replaceFields="replaceFields"
        @select="onTerrSelect"
        showIcon
      >
        <a-icon
          type="home"
          slot="ogn"
        />
        <a-icon
          type="star"
          slot="dpt"
        />
        <a-icon
          type="team"
          slot="pos"
        />
        <a-icon
          type="user"
          slot="psm"
        />
        <template
          slot="custom"
          slot-scope="item"
        >
          <span>{{ item.name }}</span>
          <a-button-group style="float: right;">
            <a-dropdown :trigger="['click']">
              <a
                class="ant-dropdown-link"
                href="#"
              >
                <a-icon type="plus" /> 新建</a>
              <a-menu
                slot="overlay"
                @click="orgMenuClick"
              >
                <a-menu-item key="0">
                  <a-icon type="user" />新建机构
                </a-menu-item>
                <a-menu-item key="1">
                  <a-icon type="user" />新建部门
                </a-menu-item>
                <a-menu-item key="2">
                  <a-icon type="user" />新建岗位
                </a-menu-item>
                <a-menu-item key="3">
                  <a-icon type="user" />新建人员
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="4">
                  <a-icon type="user" />分配人员</a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button
              type="link"
              size="small"
              icon="edit"
              @click="editOrgClick(item)"
            >编辑</a-button>
            <a-button
              type="link"
              size="small"
              icon="stop"
            >禁用</a-button>
            <a-button
              type="link"
              size="small"
              icon="delete"
            >删除</a-button>
          </a-button-group>
        </template>
      </a-tree>
      <org-detail-form
        ref="orgDetailForm"
        @ok="handleOk"
      />
    </a-card>
  </div>
</template>

<script>
import OrgDetailForm from './modules/OrgDetailForm'
import { findOrgByParentId } from '@/api/system/organization'

const slotObj = { slots: { icon: 'ogn' }, scopedSlots: { title: 'custom' } }

export default {
  components: {
    OrgDetailForm
  },
  data () {
    return {
      name: '组织管理',
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
        this.orgData = res.map(item => Object.assign(item, slotObj))
      })
    },
    loadOrgData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        findOrgByParentId(treeNode.eventKey).then(res => {
          treeNode.dataRef.children = res.map(item => Object.assign(item, slotObj))
          this.orgData = [...this.orgData]
          resolve()
        })
      })
    },
    addRootOrgClick (event) {
      this.$refs.orgDetailForm.open({
        operateType: 'new',
        orgKindId: '1',
        parentId: null
      })
    },
    handleOk (msg, values) {
      const parentNode = this.selectedNode.$parent
      if (parentNode.dataRef) {
        parentNode.dataRef.children = null
        this.loadOrgData(parentNode)
      } else {
        this.loadRootOrgData()
      }
      this.$message.info(msg)
    },
    editOrgClick (item) {
      this.$refs.orgDetailForm.open({
        operateType: 'edit',
        id: item.id
      })
    },
    orgMenuClick (event) {
      this.$message.info(event.key)
    },
    onTerrSelect (key, e) {
      this.selectedNode = e.node
    }
  }
}
</script>

<style lang="less" scoped>
// 引入的 antd 组件类名没有被 CSS 编译器转化，所以被覆盖的类名 .ant-card 必须依靠 Vue 提供的穿透方案来穿透组件的样式。
// 因为上一条的关系，覆盖是全局性的。为了防止对其他 Select 组件造成影响，所以需要包裹额外的 class 限制样式的生效范围。
// 使用 scss, less 时，可以用 /deep/ 进行样式穿透
.root-class-lcy /deep/ .ant-card {
  min-height: 532px;
}
.root-class-lcy /deep/ .ant-tree-node-content-wrapper {
  width: 98%;
}
</style>

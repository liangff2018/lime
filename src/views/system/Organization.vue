<template>
  <a-card class="card-lcy-ext">
    <a-button @click="addRootOrgClick">新建根机构</a-button>
    <a-tree
      :loadData="loadOrgData"
      :treeData="orgData"
      class="tree-lcy-ext"
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
        <span>{{ item.title }}</span>
        <a-button-group style="float: right;">
          <a-dropdown :trigger="['click']">
            <a
              class="ant-dropdown-link"
              href="#"
            >
              <a-icon type="plus" /> 新建</a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a href="http://www.alipay.com/">新建机构</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a href="http://www.taobao.com/">新建部门</a>
              </a-menu-item>
              <a-menu-item key="2">
                <a href="http://www.taobao.com/">新建岗位</a>
              </a-menu-item>
              <a-menu-item key="3">
                <a href="http://www.taobao.com/">新建人员</a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="4">分配人员</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button
            type="link"
            size="small"
            icon="edit"
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
</template>

<script>
import OrgDetailForm from './modules/OrgDetailForm'
import { findOrgVoByParentId } from '@/api/system/organization'

const slotObj = { slots: { icon: 'ogn' }, scopedSlots: { title: 'custom' } }

export default {
  components: {
    OrgDetailForm
  },
  data () {
    return {
      name: '组织管理',
      orgData: []
    }
  },
  created () {
    findOrgVoByParentId().then(res => {
      this.orgData = res.map(item => Object.assign(item, slotObj))
    })
  },
  methods: {
    loadOrgData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        findOrgVoByParentId(treeNode.eventKey).then(res => {
          treeNode.dataRef.children = res.map(item => Object.assign(item, slotObj))
          this.orgData = [...this.orgData]
          resolve()
        })
      })
    },
    addRootOrgClick (event) {
      this.$refs.orgDetailForm.open({
        type: 'new',
        orgType: '1',
        parentId: null
      })
    },
    handlOk (msg) {
      this.$message.info(msg)
    }
  }
}
</script>

<style lang="less">
.card-lcy-ext {
  min-height: 532px;
}
.tree-lcy-ext > li > .ant-tree-node-content-wrapper {
  width: 98%;
}
</style>

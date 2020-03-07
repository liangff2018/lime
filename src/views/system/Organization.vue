<template>
  <div class="root-class-lcy">
    <a-card>
      <a-button
        type="primary"
        @click="addRootOrgClick"
      >新建根机构</a-button>
      <a-tree
        ref="tree"
        :loadData="loadOrgData"
        :treeData="orgData"
        :replaceFields="replaceFields"
        @select="onTerrSelect"
        :loadedKeys="loadedKeys"
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
          slot-scope="item"
        >
          <span>{{ item.name }}</span>
          <a-button-group style="float: right;">

            <a-dropdown :trigger="['click']" v-if="item.validateState === 1">
              <a
                class="ant-dropdown-link"
                href="#"
              >
                <a-icon type="plus" /> 新建</a>
              <a-menu
                slot="overlay"
                @click="(e) => orgMenuClick(e, item)"
              >
                <a-menu-item
                  key="1"
                  :disabled="item.orgKindId > 1"
                >
                  <a-icon type="user" />新建机构
                </a-menu-item>
                <a-menu-item
                  key="2"
                  :disabled="item.orgKindId > 2"
                >
                  <a-icon type="user" />新建部门
                </a-menu-item>
                <a-menu-item
                  key="3"
                  :disabled="item.orgKindId >= 3"
                >
                  <a-icon type="user" />新建岗位
                </a-menu-item>
                <a-menu-item
                  key="4"
                  :disabled="item.orgKindId >= 4"
                >
                  <a-icon type="user" />新建人员
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="5">
                  <a-icon type="user" />分配人员</a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button
              type="link"
              size="small"
              icon="edit"
              @click="editOrgClick(item)"
            >编辑</a-button>
            <a-popconfirm
              :title="'确认要'+ (item.validateState === 1 ? '禁用当前及所有下级组织': '启用当前级所有上级组织') + '吗？'"
              @confirm="changOrgStateClick(item.id, item.validateState)"
            >
              <a-button
                type="link"
                size="small"
                icon="stop"
              >{{ item.validateState === 1 ? '禁用' : '启用' }}</a-button>
            </a-popconfirm>
            <a-popconfirm
              title="确认要删除吗？"
              @confirm="deleteOrgClick(item.id)"
            >
              <a-button
                type="link"
                size="small"
                icon="delete"
              >删除</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
      </a-tree>
      <org-detail-form
        ref="orgDetailForm"
        @ok="handleOkOrg"
      />
      <user-detail-form
        ref="userDetailForm"
        @ok="handleOKUser"
      />
    </a-card>
  </div>
</template>

<script>
import OrgDetailForm from './modules/OrgDetailForm'
import UserDetailForm from './modules/UserDetailForm'
import { findOrgByParentId, enableOrgById, disableOrgById, deleteOrgById } from '@/api/system/organization'

const slotCustom = { scopedSlots: { title: 'custom' } }

export default {
  components: {
    OrgDetailForm,
    UserDetailForm
  },
  data () {
    return {
      name: '组织管理',
      replaceFields: { title: 'name', key: 'id' },
      orgData: [],
      selectedNode: undefined,
      loadedKeys: []
    }
  },
  created () {
    this.loadRootOrgData()
  },
  methods: {
    loadRootOrgData () {
      findOrgByParentId().then(res => {
        this.orgData = res.map(item => Object.assign(item, slotCustom, { slots: { icon: 'orgType' + item.orgKindId } }))
      })
    },
    loadOrgData (treeNode) {
      this.loadedKeys.push(treeNode.dataRef.id)
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
    addRootOrgClick (event) {
      debugger
      this.$refs.orgDetailForm.open({
        operateType: 'new',
        orgKindId: '1',
        parentId: null
      })
    },
    handleOkOrg (msg, values) {
      this.reloadCurrentOrgData()
      this.$message.info(msg)
    },
    reloadCurrentOrgData () {
      const parentNode = this.selectedNode.$parent
      if (parentNode.dataRef) {
        parentNode.dataRef.children = null
        this.loadOrgData(parentNode)
      } else {
        this.selectedNode.children = undefined
        this.loadRootOrgData()
      }
      this.loadedKeys = []
    },
    editOrgClick (item) {
      if (item.orgKindId === 4) {
        this.$refs.userDetailForm.open({
          operateType: 'edit',
          id: item.personId
        })
      } else {
        this.$refs.orgDetailForm.open({
          operateType: 'edit',
          id: item.id
        })
      }
    },
    changOrgStateClick (id, oldState) {
      if (oldState === 1) {
        disableOrgById(id).then(() => {
          this.reloadCurrentOrgData()
        })
      } else if (oldState === 0) {
        while (this.selectedNode.$parent.treeData === undefined) {
          this.selectedNode = this.selectedNode.$parent
        }
        enableOrgById(id).then(() => {
          this.reloadCurrentOrgData()
        })
      }
    },
    deleteOrgClick (id) {
      deleteOrgById(id).then(() => {
        this.reloadCurrentOrgData()
      })
    },
    orgMenuClick (event, item) {
      if (event.key === '4') {
        this.$refs.userDetailForm.open({
          operateType: 'new',
          mainPosId: item.id,
          mainPosName: item.name
        })
      } else if (event.key === '5') {
        this.$message.info('正在建设中...')
      } else {
        this.$refs.orgDetailForm.open({
          operateType: 'new',
          orgKindId: event.key,
          parentId: item.id,
          parentName: item.name
        })
      }
    },
    onTerrSelect (key, e) {
      this.selectedNode = e.node
    },

    handleOKUser (msg) {
      this.reloadCurrentOrgData()
      this.$message.info(msg)
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

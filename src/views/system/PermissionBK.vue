<template>
  <a-card style="min-height: 580px">
    <a-button
      type="primary"
      @click="addClick"
    >新建根菜单</a-button>
    <a-tree
      ref="tree"
      :loadData="loadgData"
      :treeData="treeData"
      :replaceFields="replaceFields"
      @select="onSelect"
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
      <template
        slot="custom"
        slot-scope="item"
      >
        <span>{{ item.menuTitle || item.apiTitle }}</span>
        <a-button-group style="float: right;">
          <a-button
            type="link"
            size="small"
            icon="edit"
            @click="editOrgClick(item)"
          >新建</a-button>
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
    <permission-modal
      ref="permissionModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { findByParentId, deleteById } from '@/api/system/permission'
import PermissionModal from './modules/PermissionModal'

const slotCustom = { scopedSlots: { title: 'custom' } }

export default {
  components: {
    PermissionModal
  },
  data () {
    return {
      titleName: '授权管理',
      replaceFields: { title: 'name', key: 'id' },
      treeData: [],
      loadedKeys: [],
      loadData: param => {
        return findByParentId(param).then(res => {
          return res
        })
      }
    }
  },
  created () {
    this.loadDataRoot()
  },
  methods: {
    loadDataRoot () {
      findByParentId().then(res => {
        debugger
        this.treeData = res.map(item => Object.assign(item, slotCustom, { slots: { icon: 'orgType' + item.orgKindId } }))
      })
    },
    addClick () {
      this.$refs.permissionModal.open({ operateType: 'new' })
    },
    editClick (id) {
      this.$refs.permissionModal.open({ operateType: 'edit', id: id })
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.$refs.table.refresh()
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>

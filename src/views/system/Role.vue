<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="lyConf.gutter">
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="编码">
              <a-input v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="分类">
                <a-input v-model="queryParam.catalog" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="角色类型Id">
                <a-input v-model="queryParam.roleKindId" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="描述">
                <a-input v-model="queryParam.description" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="序号">
                <a-input v-model="queryParam.sequence" />
              </a-form-item>
            </a-col>
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="可用状态">
                <a-input v-model="queryParam.validState" />
              </a-form-item>
            </a-col>
          </template>
          <a-col
            :md="!advanced && lyConf.md || 24"
            :sm="lyConf.sm"
          >
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button
                type="primary"
                @click="$refs.table.refresh(true)"
              >查询</a-button>
              <a-button
                style="margin-left: 8px"
                @click="resetQuery"
              >重置</a-button>
              <a
                @click="() => advanced = !advanced"
                style="margin-left: 8px"
              >
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-button
      type="primary"
      @click="addClick"
    >新增</a-button>
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
          <a @click="editClick(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">分配</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  :title="'确认要删除吗？'"
                  @confirm="deleteClick(row.id)"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
    <role-modal
      ref="roleModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildParamLike } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/system/role'
import RoleModal from './modules/RoleModal'

// 列名
const columns = [
  { title: '#', width: '80px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  { title: '分类', dataIndex: 'catalog' },
  { title: '角色类型Id', dataIndex: 'roleKindId' },
  { title: '描述', dataIndex: 'description' },
  { title: '序号', dataIndex: 'sequence' },
  { title: '可用状态', dataIndex: 'validState' },
  { title: '操作', width: '150px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    name: optEnum.like,
    code: optEnum.like,
    catalog: optEnum.like,
    roleKindId: optEnum.equalsTo,
    description: optEnum.like,
    sequence: optEnum.equalsTo,
    validState: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    RoleModal
  },
  data () {
    return {
      titleName: '角色管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: {},
      // 显示高级查询
      advanced: false,
      columns,
      role: { name: '%管理员%' },
      loadData: param => {
        const queryParam = buildParamLike(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order })
        return findPage(param).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    addClick () {
      this.$refs.roleModal.open({ operateType: 'new' })
    },
    editClick (id) {
      this.$refs.roleModal.open({ operateType: 'edit', id: id })
    },
    deleteClick (id) {
      deleteById(id).then(res => {
        this.$refs.table.refresh()
      })
    },
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>

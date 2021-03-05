<template>
  <a-card style="min-height: 580px">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="lyConf.gutter">
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="键">
              <a-input v-model="queryParam.id" />
            </a-form-item>
          </a-col>
          <a-col
            :md="lyConf.md"
            :sm="lyConf.sm"
          >
            <a-form-item label="值">
              <a-input v-model="queryParam.value" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
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
    >新建</a-button>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="(row) => row.id"
      :customRow="rowClick"
      :rowClassName="setRowClassName"
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
          <a @click="editClick(row.id)">查看</a>
          <a-divider type="vertical" />
          <a @click="editClick(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="'确认要删除吗？'"
            @confirm="deleteClick(row.id)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <sysCode-modal
      ref="sysCodeModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById } from '@/api/system/sysCode'
import SysCodeModal from './modules/SysCodeModal'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '键', dataIndex: 'id' },
  { title: '值', dataIndex: 'value' },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    id: optEnum.like,
    value: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = ''

export default {
  components: {
    STable,
    SysCodeModal
  },
  data () {
    return {
      titleName: '静态数据管理',
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
          this.selectedRow = res && res.data && res.data[0]
          return res
        })
      },
      selectedRow: {}
    }
  },
  methods: {
    addClick () {
      this.$refs.sysCodeModal.open({ operateType: 'new' })
    },
    editClick (id) {
      this.$refs.sysCodeModal.open({ operateType: 'edit', id: id })
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
    },
    rowClick (row, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = row
          }
        }
      }
    },
    setRowClassName (row, index) {
      return row.id === this.selectedRow.id ? 'table-row-selected-color' : ''
    }
  }
}
</script>

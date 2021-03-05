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
            <a-form-item label="备注">
              <a-input v-model="queryParam.note" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col
              :md="lyConf.md"
              :sm="lyConf.sm"
            >
              <a-form-item label="状态">
                <a-select v-model="queryParam.state">
                  <a-select-option value="1">启用</a-select-option>
                  <a-select-option value="0">禁用</a-select-option>
                </a-select>
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

    <a-row :gutter="24">
      <a-col
        :span="8"
        class="col-right-line-vertical"
      >
        <a-button
          type="primary"
          @click="openClick('new',true)"
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
              <a @click="openClick('edit', true, row.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="'是否确认要'+ (row.state === 1 ? '禁用' : '启用') + ''"
                @confirm="stateChangeClick(row.id)"
              >
                <a href="javascript:;">{{ row.state === 1 ? '禁用' : '启用' }}</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="'确认要删除吗？'"
                @confirm="deleteClick(row.id, true)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </span>
          <template
            slot="status"
            slot-scope="status"
          >
            <a-badge
              :status="status | statusTypeFilter"
              :text="status | statusFilter"
            />
          </template>
        </s-table>
      </a-col>
      <a-col :span="16">
        <a-button
          type="primary"
          @click="openClick('new',false, selectedRow.id)"
        >新建数据项</a-button>
        <s-table
          ref="tableDetail"
          :columns="columnsDetail"
          :data="loadDataDetail"
          :rowKey="(row) => row.id"
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
              <a @click="openClick('edit', false, row.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="'是否确认要'+ (row.state === 1 ? '禁用' : '启用') + ''"
                @confirm="stateChangeDetailClick(row.id)"
              >
                <a href="javascript:;">{{ row.state === 1 ? '禁用' : '启用' }}</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="'确认要删除吗？'"
                @confirm="deleteClick(row.id, false)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </span>
          <template
            slot="status"
            slot-scope="status"
          >
            <a-badge
              :status="status | statusTypeFilter"
              :text="status | statusFilter"
            />
          </template>
        </s-table>
      </a-col>
    </a-row>
    <staticData-modal
      ref="staticDataModal"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { optEnum, buildFindPageParam } from '@/utils/optUtils'
import STable from '@/components/Table'
import { findPage, deleteById, stateChange } from '@/api/system/staticData'
import StaticDataModal from './modules/StaticDataModal'

// 列名
const columns = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '名称', dataIndex: 'name' },
  { title: '状态', dataIndex: 'state', width: '80px', scopedSlots: { customRender: 'status' } },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

// 列名
const columnsDetail = [
  { title: '#', width: '60px', scopedSlots: { customRender: 'serial' } },
  { title: '编码', dataIndex: 'code' },
  { title: '名称', dataIndex: 'name' },
  { title: '序号', dataIndex: 'sequence' },
  { title: '备注', dataIndex: 'note' },
  { title: '状态', dataIndex: 'state', width: '80px', scopedSlots: { customRender: 'status' } },
  { title: '操作', width: '154px', scopedSlots: { customRender: 'action' } }
]

// 操作符对象
const opts = {
  operators: {
    parentId: optEnum.isNull,
    code: optEnum.like,
    name: optEnum.like,
    note: optEnum.like,
    state: optEnum.equalsTo
  }
}

// 操作符对象
const optsDetail = {
  operators: {
    parentId: optEnum.equalsTo,
    code: optEnum.like,
    name: optEnum.like,
    note: optEnum.like,
    state: optEnum.equalsTo
  }
}

// 排序；字符串类型，格式如name:acs, sequence: desc
const order = 'sequence: asc'

// 排序；字符串类型，格式如name:acs, sequence: desc
const orderDetail = 'sequence: asc'

export default {
  components: {
    STable,
    StaticDataModal
  },
  data () {
    return {
      titleName: '静态数据管理',
      // 布局参数
      lyConf: { gutter: 48, md: 8, sm: 24 },
      // 查询参数
      queryParam: {},
      queryParamDetail: {},
      // 显示高级查询
      advanced: false,
      columns,
      columnsDetail,
      loadData: param => {
        const queryParam = buildFindPageParam(this.queryParam, opts.operators, 'all')
        param = Object.assign(param, queryParam, opts, { order: order, isAnd: true })
        return findPage(param).then(res => {
          this.selectedRow = res && res.data && res.data[0]
          this.$refs.tableDetail.refresh()
          return res
        })
      },
      loadDataDetail: param => {
        // 如果没有选中行时，直接返回Promise实例，不执行后续的查询操作
        if (!this.selectedRow) {
          return new Promise(resolve => {
            resolve()
          })
        }
        const parentId = this.selectedRow ? this.selectedRow.id : -1
        const queryParam = buildFindPageParam(this.queryParamDetail, optsDetail.operators, 'all')
        param = Object.assign(param, Object.assign(queryParam, { parentId: parentId }), optsDetail, { order: orderDetail, isAnd: true })
        return findPage(param).then(res => {
          // this.selectedRow = res && res.data && res.data[0]
          return res
        })
      },
      selectedRow: undefined
    }
  },
  methods: {
    openClick (type, isMain, id) {
      let param = { operateType: type, isMain: isMain, id: id }
      if (this.selectedRow) {
        param = Object.assign(param, { parentId: this.selectedRow.parentId, parentName: this.selectedRow.name })
      }
      this.$refs.staticDataModal.open(param)
    },
    stateChangeClick (id) {
      stateChange(id).then(() => {
        this.$refs.table.refresh()
      })
    },
    stateChangeDetailClick (id) {
      stateChange(id).then(() => {
        this.$refs.tableDetail.refresh()
      })
    },
    deleteClick (id, isMain) {
      deleteById(id).then(res => {
        if (isMain) {
          this.$refs.table.refresh()
        } else {
          this.$refs.tableDetail.refresh()
        }
      })
    },
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleOk (message, data, isMain) {
      if (isMain) {
        this.$refs.table.refresh()
      } else {
        this.$refs.tableDetail.refresh()
      }
    },
    rowClick (row, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = row
            this.$refs.tableDetail.refresh()
          }
        }
      }
    },
    setRowClassName (row, index) {
      return row.id === this.selectedRow.id ? 'table-row-selected-color' : ''
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '启用',
        0: '禁用'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        1: 'success',
        0: 'error'
      }
      return statusTypeMap[type]
    }
  }
}
</script>

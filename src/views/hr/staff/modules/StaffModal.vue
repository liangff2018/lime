<template>
  <a-modal
    :width="1024"
    :visible="visible"
    title="请选择调岗的员工"
    @ok="okClick"
    @cancel="cancelClick"
  >
    <staff
      :base-query="{ staffState: '1' }"
      @selectedRowHandle="selectedRowHandle"
    ></staff>
  </a-modal>
</template>

<script>
import Staff from '../Staff'

export default {
  components: {
    Staff
  },
  data () {
    return {
      visible: false,
      selectedRow: undefined
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    okClick () {
      this.$emit('ok', this.selectedRow)
      this.visible = false
    },
    cancelClick () {
      this.visible = false
    },
    selectedRowHandle (row) {
      this.selectedRow = row
    }
  }
}
</script>

<style lang="less" scope>
</style>

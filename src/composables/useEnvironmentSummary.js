import { computed, reactive } from 'vue'

import {
  restorationMetricSpecs,
  restorationZoneReadings,
  restorationZones,
} from '../data/restorationData'
import { ENV_STATUS, normalizeEnvironmentRows } from '../utils/environmentStatus'

// 模块级状态：环境概览与批次页复用同一份汇总数据与视图选项，
// 路由往返后计数、明细和当前筛选/分组保持一致。
const environmentRows = normalizeEnvironmentRows(
  restorationMetricSpecs,
  restorationZones,
  restorationZoneReadings,
)

const summaryState = reactive({
  filter: 'all', // all | over | pending | normal
  groupBy: 'zone', // zone | metric
})

export function useEnvironmentSummary() {
  const rows = computed(() => environmentRows)

  const overCount = computed(
    () => environmentRows.filter((row) => row.status === ENV_STATUS.OVER).length,
  )
  const pendingCount = computed(
    () =>
      environmentRows.filter((row) => row.status === ENV_STATUS.PENDING).length,
  )
  const normalCount = computed(
    () =>
      environmentRows.filter((row) => row.status === ENV_STATUS.NORMAL).length,
  )

  const filteredRows = computed(() => {
    if (summaryState.filter === 'all') {
      return environmentRows
    }
    return environmentRows.filter((row) => row.status === summaryState.filter)
  })

  const groups = computed(() => {
    const buckets = new Map()

    for (const row of filteredRows.value) {
      const key =
        summaryState.groupBy === 'zone' ? row.zoneKey : row.metricKey
      const label =
        summaryState.groupBy === 'zone' ? row.zoneLabel : row.metricLabel

      if (!buckets.has(key)) {
        buckets.set(key, { key, label, rows: [] })
      }
      buckets.get(key).rows.push(row)
    }

    return Array.from(buckets.values())
  })

  return {
    summaryState,
    rows,
    filteredRows,
    groups,
    overCount,
    pendingCount,
    normalCount,
  }
}

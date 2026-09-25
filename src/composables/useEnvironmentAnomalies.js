import { computed } from 'vue'

import {
  environmentMetrics,
  environmentZoneReadings,
  environmentZones,
} from '../data/restorationData'
import {
  buildEnvironmentSummary,
  summarizeEnvironmentRows,
} from '../utils/environmentSummary'

// 模块级共享状态：环境概览与批次页引用同一份汇总结果，
// 在两条路由之间往返后，两处的计数与明细保持一致
const summaryRows = computed(() =>
  buildEnvironmentSummary(environmentMetrics, environmentZones, environmentZoneReadings),
)
const summaryCounts = computed(() => summarizeEnvironmentRows(summaryRows.value))

export function useEnvironmentAnomalies() {
  return {
    summaryRows,
    summaryCounts,
  }
}

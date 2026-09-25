<script setup>
import { computed, ref } from 'vue'

import { environmentStatusMeta } from '../../utils/restorationFormatters'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  counts: {
    type: Object,
    required: true,
  },
})

const groupBy = ref('metric')
const statusFilter = ref('all')

const groupOptions = [
  { key: 'metric', label: '按指标' },
  { key: 'zone', label: '按区域' },
]

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'exceeded', label: '仅超限' },
  { key: 'pending', label: '待确认' },
]

const filteredRows = computed(() => {
  if (statusFilter.value === 'all') {
    return props.rows
  }
  return props.rows.filter((row) => row.status === statusFilter.value)
})

const groups = computed(() => {
  const byMetric = groupBy.value === 'metric'
  const grouped = new Map()
  for (const row of filteredRows.value) {
    const key = byMetric ? row.metricKey : row.zoneKey
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        title: byMetric ? row.metricLabel : row.zoneName,
        subtitle: byMetric ? row.controlText : '',
        rows: [],
      })
    }
    grouped.get(key).rows.push(row)
  }
  return [...grouped.values()]
})

function rowLabel(row) {
  return groupBy.value === 'metric' ? row.zoneName : row.metricLabel
}

function rowHint(row) {
  const parts = []
  if (groupBy.value === 'zone') {
    parts.push(row.controlText)
  }
  parts.push(row.capturedAt ? `采样 ${row.capturedAt}` : '暂无采样')
  return parts.join(' · ')
}
</script>

<template>
  <div class="anomaly-summary">
    <div class="summary-toolbar">
      <div class="toggle-group" role="group" aria-label="汇总分组方式">
        <button
          v-for="option in groupOptions"
          :key="option.key"
          type="button"
          :class="['toggle-btn', { 'toggle-btn--active': groupBy === option.key }]"
          @click="groupBy = option.key"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="toggle-group" role="group" aria-label="状态筛选">
        <button
          v-for="option in filterOptions"
          :key="option.key"
          type="button"
          :class="['toggle-btn', { 'toggle-btn--active': statusFilter === option.key }]"
          @click="statusFilter = option.key"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="summary-counts">
      <span class="count-chip">共 {{ counts.total }} 项</span>
      <span class="count-chip count-chip--exceeded">超限 {{ counts.exceeded }}</span>
      <span class="count-chip count-chip--pending">待确认 {{ counts.pending }}</span>
      <span class="count-chip count-chip--normal">正常 {{ counts.normal }}</span>
    </div>

    <div v-if="groups.length" class="summary-groups">
      <section v-for="group in groups" :key="group.key" class="summary-group">
        <header class="group-head">
          <h4>{{ group.title }}</h4>
          <small v-if="group.subtitle">{{ group.subtitle }}</small>
        </header>
        <ul class="row-list">
          <li
            v-for="row in group.rows"
            :key="row.id"
            :class="['summary-row', `summary-row--${row.status}`]"
          >
            <div class="row-main">
              <span class="row-label">{{ rowLabel(row) }}</span>
              <small class="row-hint">{{ rowHint(row) }}</small>
            </div>
            <div class="row-value">
              <strong>{{ row.displayValue }}</strong>
              <small v-if="row.reason" class="row-reason">{{ row.reason }}</small>
            </div>
            <span :class="['status-pill', `status-pill--${environmentStatusMeta(row.status).tone}`]">
              {{ environmentStatusMeta(row.status).label }}
            </span>
          </li>
        </ul>
      </section>
    </div>
    <p v-else class="empty-tip">当前筛选条件下没有记录。</p>
  </div>
</template>

<style scoped>
.anomaly-summary {
  display: grid;
  gap: 16px;
}

.summary-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}

.toggle-group {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(239, 226, 202, 0.7);
}

.toggle-btn {
  border: none;
  padding: 7px 14px;
  border-radius: 999px;
  background: transparent;
  color: #7e6038;
  font-size: 0.82rem;
  cursor: pointer;
}

.toggle-btn--active {
  background: #5d4322;
  color: #fff8eb;
}

.summary-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.count-chip {
  padding: 7px 12px;
  border-radius: 999px;
  background: #efe2ca;
  color: #7e6038;
  font-size: 0.8rem;
}

.count-chip--exceeded {
  background: #efd0c9;
  color: #913d2f;
}

.count-chip--pending {
  background: #f6e5b9;
  color: #8b6314;
}

.count-chip--normal {
  background: #d9ead9;
  color: #366338;
}

.summary-groups {
  display: grid;
  gap: 14px;
}

.summary-group {
  border: 1px solid rgba(109, 80, 40, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  background: #efe1c6;
}

.group-head h4 {
  margin: 0;
  font-size: 0.98rem;
}

.group-head small {
  color: #775936;
}

.row-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.summary-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  border-left: 4px solid transparent;
}

.summary-row + .summary-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.summary-row--exceeded {
  border-left-color: #b04a38;
  background: rgba(239, 208, 201, 0.45);
}

.summary-row--pending {
  border-left-color: #c99a2e;
  border-top-style: dashed;
  background: rgba(246, 229, 185, 0.4);
}

.row-main,
.row-value {
  display: grid;
  gap: 4px;
}

.row-label {
  font-weight: 600;
}

.row-hint,
.row-reason {
  color: #6a5439;
  font-size: 0.78rem;
}

.row-value strong {
  font-size: 1.05rem;
}

.summary-row--exceeded .row-value strong {
  color: #913d2f;
}

.row-reason {
  color: #8b6314;
}

.status-pill {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  white-space: nowrap;
}

.status-pill--normal {
  background: #d9ead9;
  color: #366338;
}

.status-pill--exceeded {
  background: #efd0c9;
  color: #913d2f;
}

.status-pill--pending {
  background: #f6e5b9;
  color: #8b6314;
}

.empty-tip {
  margin: 0;
  color: #6a5439;
}

@media (max-width: 720px) {
  .summary-row {
    grid-template-columns: 1fr;
  }
}
</style>

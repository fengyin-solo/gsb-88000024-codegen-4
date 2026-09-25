<script setup>
import { computed } from 'vue'

import { useEnvironmentSummary } from '../../composables/useEnvironmentSummary'
import {
  ENV_STATUS,
  environmentStatusMeta,
} from '../../utils/environmentStatus'

const {
  summaryState,
  groups,
  overCount,
  pendingCount,
  normalCount,
} = useEnvironmentSummary()

const filters = computed(() => [
  { key: 'all', label: '全部', count: overCount.value + pendingCount.value + normalCount.value },
  { key: ENV_STATUS.OVER, label: '超出控制线', count: overCount.value },
  { key: ENV_STATUS.PENDING, label: '待确认', count: pendingCount.value },
  { key: ENV_STATUS.NORMAL, label: '正常', count: normalCount.value },
])

function statusLabel(status) {
  return environmentStatusMeta[status].label
}
</script>

<template>
  <div class="env-summary">
    <div class="summary-toolbar">
      <div class="filter-tabs" role="tablist" aria-label="环境读数状态筛选">
        <button
          v-for="filter in filters"
          :key="filter.key"
          type="button"
          role="tab"
          :aria-selected="summaryState.filter === filter.key"
          :class="['filter-tab', `filter-tab--${filter.key}`, {
            'is-active': summaryState.filter === filter.key,
          }]"
          @click="summaryState.filter = filter.key"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <div class="group-switch">
        <button
          type="button"
          :class="{ 'is-active': summaryState.groupBy === 'zone' }"
          @click="summaryState.groupBy = 'zone'"
        >
          按修复区域
        </button>
        <button
          type="button"
          :class="{ 'is-active': summaryState.groupBy === 'metric' }"
          @click="summaryState.groupBy = 'metric'"
        >
          按固定指标
        </button>
      </div>
    </div>

    <div class="summary-groups">
      <section v-for="group in groups" :key="group.key" class="summary-group">
        <h4 class="group-title">{{ group.label }}</h4>
        <ul class="reading-list">
          <li
            v-for="row in group.rows"
            :key="row.id"
            :class="['reading-row', `reading-row--${row.status}`]"
          >
            <div class="reading-main">
              <span class="reading-name">
                {{ summaryState.groupBy === 'zone' ? row.metricLabel : row.zoneLabel }}
              </span>
              <span class="reading-context">{{ row.rangeText }}</span>
            </div>
            <div class="reading-values">
              <template v-if="row.status === 'pending'">
                <span class="reading-value reading-value--muted">
                  {{ row.valueText }}
                </span>
                <span
                  v-if="row.pendingReason === 'conflict'"
                  class="reading-dual"
                >
                  旧值 {{ row.previousValueText }}
                </span>
              </template>
              <template v-else>
                <span class="reading-value">{{ row.valueText }}</span>
                <span
                  v-if="row.status === 'over'"
                  class="reading-direction"
                >
                  {{ row.overDirection === 'high' ? '高于上限' : '低于下限' }}
                </span>
              </template>
            </div>
            <span :class="['status-badge', `status-badge--${row.status}`]">
              <template v-if="row.status === 'pending'">
                待确认 · {{ row.pendingReasonText }}
              </template>
              <template v-else>
                {{ statusLabel(row.status) }}
              </template>
            </span>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="groups.length === 0" class="summary-empty">
      当前筛选下没有环境读数。
    </p>
  </div>
</template>

<style scoped>
.env-summary {
  display: grid;
  gap: 18px;
}

.summary-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 34, 0.18);
  background: rgba(255, 255, 255, 0.7);
  color: #6a5439;
  font: inherit;
  font-size: 0.84rem;
  cursor: pointer;
}

.filter-tab.is-active {
  background: #5d4322;
  border-color: #5d4322;
  color: #fff8eb;
}

.filter-tab--over.is-active {
  background: #913d2f;
  border-color: #913d2f;
}

.filter-tab--pending.is-active {
  background: #8b6314;
  border-color: #8b6314;
}

.filter-count {
  min-width: 20px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(93, 67, 34, 0.12);
  font-size: 0.76rem;
  text-align: center;
}

.filter-tab.is-active .filter-count {
  background: rgba(255, 248, 235, 0.22);
}

.group-switch {
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: #e9ddc5;
}

.group-switch button {
  padding: 6px 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #775936;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.group-switch button.is-active {
  background: #fffaf0;
  color: #5d4322;
  box-shadow: 0 2px 6px rgba(100, 73, 34, 0.14);
}

.summary-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.group-title {
  margin: 0 0 10px;
  font-size: 0.92rem;
  color: #5d4322;
}

.reading-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.reading-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 14px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(93, 67, 34, 0.12);
  border-left-width: 4px;
  background: rgba(255, 255, 255, 0.72);
}

.reading-row--over {
  border-left-color: #b44934;
  background: #faeae6;
}

.reading-row--pending {
  border-left-color: #b98a2c;
  background: #faf3e0;
}

.reading-row--normal {
  border-left-color: #6f9170;
}

.reading-main {
  display: grid;
  gap: 2px;
}

.reading-name {
  font-weight: 700;
}

.reading-context {
  font-size: 0.78rem;
  color: #82684b;
}

.reading-values {
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
}

.reading-value {
  font-size: 1.12rem;
}

.reading-value--muted {
  color: #9a8565;
}

.reading-dual {
  font-size: 0.8rem;
  color: #8b6314;
  text-decoration: line-through;
  text-decoration-color: rgba(139, 99, 20, 0.5);
}

.reading-direction {
  font-size: 0.78rem;
  color: #913d2f;
}

.status-badge {
  grid-row: 1;
  grid-column: 2;
  justify-self: end;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  white-space: nowrap;
}

.status-badge--over {
  background: #e7c7bf;
  color: #913d2f;
}

.status-badge--pending {
  background: #f0e0b6;
  color: #8b6314;
}

.status-badge--normal {
  background: #d9ead9;
  color: #366338;
}

.summary-empty {
  margin: 0;
  padding: 20px;
  text-align: center;
  color: #82684b;
}

@media (max-width: 680px) {
  .status-badge {
    grid-row: auto;
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>

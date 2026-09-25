<script setup>
import PanelSection from '../components/common/PanelSection.vue'
import EnvironmentSummaryPanel from '../components/restoration/EnvironmentSummaryPanel.vue'
import { useEnvironmentSummary } from '../composables/useEnvironmentSummary'

const { overCount, pendingCount } = useEnvironmentSummary()
</script>

<template>
  <div class="view-stack">
    <PanelSection
      title="环境参数异常汇总"
      :badge="`超线 ${overCount} · 待确认 ${pendingCount}`"
    >
      <p class="summary-intro">
        合并固定环境指标与各修复区域的当前读数。超出控制线的项目以红色标出；
        请求未返回、读数缺失或同一指标出现新旧两值时，统一列入“待确认”，不按正常读数展示。
      </p>
      <EnvironmentSummaryPanel />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}

.summary-intro {
  margin: 0 0 18px;
  color: #6a5439;
  font-size: 0.9rem;
}
</style>

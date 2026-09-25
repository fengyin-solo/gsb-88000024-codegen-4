<script setup>
import PanelSection from '../components/common/PanelSection.vue'
import EnvironmentAnomalySummary from '../components/restoration/EnvironmentAnomalySummary.vue'
import { useEnvironmentAnomalies } from '../composables/useEnvironmentAnomalies'

const { summaryRows, summaryCounts } = useEnvironmentAnomalies()
</script>

<template>
  <div class="view-stack">
    <PanelSection title="环境参数异常汇总" badge="指标 × 区域">
      <EnvironmentAnomalySummary :rows="summaryRows" :counts="summaryCounts" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}
</style>

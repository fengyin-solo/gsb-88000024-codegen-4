export const readingStatus = {
  normal: 'normal',
  exceeded: 'exceeded',
  pending: 'pending',
}

function formatValue(value, unit) {
  return `${value}${unit}`
}

function hasValue(value) {
  return value !== null && value !== undefined
}

// 判定单条读数：请求未返回、读数缺失、新旧两值不一致都归为待确认，
// 只有拿到确定读数时才与控制线比较，区分超限与正常
export function resolveReading(metric, reading) {
  if (!reading || reading.pending) {
    return { status: readingStatus.pending, reason: '请求未返回', displayValue: '—', capturedAt: '' }
  }
  if (!hasValue(reading.value)) {
    return {
      status: readingStatus.pending,
      reason: '读数缺失',
      displayValue: '—',
      capturedAt: reading.capturedAt ?? '',
    }
  }
  if (hasValue(reading.previousValue) && reading.previousValue !== reading.value) {
    return {
      status: readingStatus.pending,
      reason: '新旧读数不一致',
      displayValue: `${formatValue(reading.previousValue, metric.unit)} → ${formatValue(reading.value, metric.unit)}`,
      capturedAt: reading.capturedAt ?? '',
    }
  }
  const belowMin = hasValue(metric.controlMin) && reading.value < metric.controlMin
  const aboveMax = hasValue(metric.controlMax) && reading.value > metric.controlMax
  const status = belowMin || aboveMax ? readingStatus.exceeded : readingStatus.normal
  return {
    status,
    reason: '',
    displayValue: formatValue(reading.value, metric.unit),
    capturedAt: reading.capturedAt ?? '',
  }
}

// 把固定指标与各区域读数合并成 区域 × 指标 的汇总行
export function buildEnvironmentSummary(metrics, zones, readings) {
  const readingMap = new Map(readings.map((item) => [`${item.zone}:${item.metric}`, item]))
  const rows = []
  for (const zone of zones) {
    for (const metric of metrics) {
      const reading = readingMap.get(`${zone.key}:${metric.key}`)
      rows.push({
        id: `${zone.key}:${metric.key}`,
        zoneKey: zone.key,
        zoneName: zone.name,
        metricKey: metric.key,
        metricLabel: metric.label,
        unit: metric.unit,
        controlText: `控制线 ${metric.controlMin}${metric.unit} - ${metric.controlMax}${metric.unit}`,
        ...resolveReading(metric, reading),
      })
    }
  }
  return rows
}

export function summarizeEnvironmentRows(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.total += 1
      acc[row.status] += 1
      return acc
    },
    { total: 0, normal: 0, exceeded: 0, pending: 0 },
  )
}

export const ENV_STATUS = {
  OVER: 'over',
  PENDING: 'pending',
  NORMAL: 'normal',
}

export const PENDING_REASON = {
  FAILED: 'failed',
  MISSING: 'missing',
  CONFLICT: 'conflict',
}

export const environmentStatusMeta = {
  [ENV_STATUS.OVER]: {
    label: '超出控制线',
    tone: 'over',
  },
  [ENV_STATUS.PENDING]: {
    label: '待确认',
    tone: 'pending',
  },
  [ENV_STATUS.NORMAL]: {
    label: '正常',
    tone: 'normal',
  },
}

export const pendingReasonMeta = {
  [PENDING_REASON.FAILED]: '请求未返回',
  [PENDING_REASON.MISSING]: '读数缺失',
  [PENDING_REASON.CONFLICT]: '新旧两值不一致',
}

export function formatEnvironmentValue(value, unit) {
  if (value === null || value === undefined) {
    return '—'
  }

  // lux 等非符号单位与数值之间保留空格，% / ℃ 直接拼接。
  const spaced = unit.length > 2
  return `${value}${spaced ? ' ' : ''}${unit}`
}

export function formatControlRange(spec) {
  const suffix = (value) => formatEnvironmentValue(value, spec.unit)
  return `控制线 ${suffix(spec.min)} - ${suffix(spec.max)}`
}

// 将固定指标与各区域原始读数合并为带状态的明细行。
// pending（待确认）优先于 over：异常读数未确认前不得显示为正常结论。
export function normalizeEnvironmentRows(specs, zones, readings) {
  const readingIndex = new Map()
  for (const reading of readings) {
    readingIndex.set(`${reading.zoneKey}:${reading.metricKey}`, reading)
  }

  return zones.flatMap((zone) =>
    specs.map((spec) => {
      const reading = readingIndex.get(`${zone.key}:${spec.key}`)
      const hasReading = Boolean(reading)
      const failed = reading?.readingState === 'failed'
      const missing = !hasReading || reading.readingState === 'missing'
      const hasConflict =
        hasReading &&
        reading.previousValue !== null &&
        reading.previousValue !== undefined &&
        reading.previousValue !== reading.value

      let status = ENV_STATUS.NORMAL
      let pendingReason = ''

      if (failed) {
        status = ENV_STATUS.PENDING
        pendingReason = PENDING_REASON.FAILED
      } else if (missing) {
        status = ENV_STATUS.PENDING
        pendingReason = PENDING_REASON.MISSING
      } else if (hasConflict) {
        status = ENV_STATUS.PENDING
        pendingReason = PENDING_REASON.CONFLICT
      } else if (
        reading.value < spec.min ||
        reading.value > spec.max
      ) {
        status = ENV_STATUS.OVER
      }

      const overDirection =
        status === ENV_STATUS.OVER
          ? reading.value > spec.max
            ? 'high'
            : 'low'
          : ''

      return {
        id: `${zone.key}-${spec.key}`,
        zoneKey: zone.key,
        zoneLabel: zone.label,
        metricKey: spec.key,
        metricLabel: spec.label,
        unit: spec.unit,
        rangeText: formatControlRange(spec),
        value: hasReading && !failed ? reading.value : null,
        previousValue: hasReading ? reading.previousValue ?? null : null,
        valueText: formatEnvironmentValue(
          hasReading && !failed ? reading.value : null,
          spec.unit,
        ),
        previousValueText: hasReading
          ? formatEnvironmentValue(reading.previousValue ?? null, spec.unit)
          : '—',
        status,
        pendingReason,
        pendingReasonText: pendingReason
          ? pendingReasonMeta[pendingReason]
          : '',
        overDirection,
      }
    }),
  )
}

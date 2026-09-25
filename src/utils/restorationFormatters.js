export function riskMeta(risk) {
  const map = {
    high: {
      label: '高',
      tone: 'high',
    },
    medium: {
      label: '中',
      tone: 'medium',
    },
    low: {
      label: '低',
      tone: 'low',
    },
  }

  return map[risk] ?? map.low
}

export function environmentStatusMeta(status) {
  const map = {
    normal: {
      label: '正常',
      tone: 'normal',
    },
    exceeded: {
      label: '超限',
      tone: 'exceeded',
    },
    pending: {
      label: '待确认',
      tone: 'pending',
    },
  }

  return map[status] ?? map.pending
}

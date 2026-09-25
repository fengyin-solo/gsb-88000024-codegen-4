export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '环境概览', to: '/environment' },
  { label: '批次档案', to: '/batches' },
  { label: '任务清单', to: '/tasks' },
]

export const restorationHero = {
  title: '古籍虫蛀修复批次板',
  description:
    '聚焦修复批次、控湿参数和文献归档风险，适合作为修复工作室内部业务系统的前端原型。',
  backlogLabel: '待处理批次',
  backlogValue: '12 册',
  note: '高湿季节前优先清理虫道扩散页。',
}

export const restorationBatches = [
  {
    code: 'A-03',
    title: '明抄本县志残卷',
    pages: '17-29',
    risk: 'high',
    status: '补纸前',
    note: '虫道集中在装订线外沿。',
  },
  {
    code: 'B-11',
    title: '碑帖拓片册页',
    pages: '5-14',
    risk: 'medium',
    status: '控湿中',
    note: '需先降湿 48 小时，再进入纤维加固。',
  },
  {
    code: 'C-02',
    title: '戏曲抄本散页',
    pages: '1-9',
    risk: 'low',
    status: '归档前',
    note: '边角缺损明显，建议先做透明托裱。',
  },
]

export const restorationEnvironment = [
  {
    label: '相对湿度',
    value: '52%',
    note: '控制线 50% - 55%',
  },
  {
    label: '纸浆补配',
    value: '2 批',
    note: '桑皮纤维待过滤',
  },
  {
    label: '紫外检查',
    value: '4 页',
    note: '夜间统一复核霉斑残留',
  },
]

// 固定环境指标：带控制线的标准监测项，用于异常汇总判定
export const environmentMetrics = [
  { key: 'humidity', label: '相对湿度', unit: '%', controlMin: 50, controlMax: 55 },
  { key: 'temperature', label: '库房温度', unit: '℃', controlMin: 18, controlMax: 22 },
  { key: 'light', label: '光照强度', unit: 'lx', controlMin: 0, controlMax: 50 },
  { key: 'voc', label: '挥发物浓度', unit: 'µg/m³', controlMin: 0, controlMax: 300 },
]

export const environmentZones = [
  { key: 'studio-a', name: '修复一区' },
  { key: 'studio-b', name: '修复二区' },
  { key: 'storage', name: '暂存库房' },
]

// 各修复区域当前读数：value 为 null 表示读数缺失，pending 表示请求未返回，
// previousValue 与 value 不一致表示同一指标存在新旧两值，均按待确认处理
export const environmentZoneReadings = [
  { zone: 'studio-a', metric: 'humidity', value: 52, capturedAt: '09:10' },
  { zone: 'studio-a', metric: 'temperature', value: 21, capturedAt: '09:10' },
  { zone: 'studio-a', metric: 'light', value: 46, capturedAt: '09:10' },
  { zone: 'studio-a', metric: 'voc', value: 212, capturedAt: '09:10' },
  { zone: 'studio-b', metric: 'humidity', value: 58, capturedAt: '09:12' },
  { zone: 'studio-b', metric: 'temperature', value: 23, capturedAt: '09:12' },
  { zone: 'studio-b', metric: 'light', value: null, capturedAt: '' },
  { zone: 'studio-b', metric: 'voc', value: 268, previousValue: 305, capturedAt: '09:12' },
  { zone: 'storage', metric: 'humidity', value: 51, capturedAt: '09:05' },
  { zone: 'storage', metric: 'temperature', pending: true },
  { zone: 'storage', metric: 'light', value: 38, capturedAt: '09:05' },
  { zone: 'storage', metric: 'voc', value: 340, capturedAt: '09:05' },
]

export const restorationSteps = [
  '拍照建档并标注虫蛀起止页。',
  '低压吸附除尘，保留边角碎纤维。',
  '喷雾回软后局部补纸，不做整页过度清洗。',
  '平整定型 8 小时后转入无酸盒暂存。',
]

export const restorationTasks = [
  {
    title: '明抄本县志残卷',
    stage: '补纸前',
    risk: 'high',
    owner: '韩澈',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    title: '碑帖拓片册页',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    note: '边缘卷曲，可延后压平。',
  },
  {
    title: '戏曲抄本散页',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '等待封套尺寸确认。',
  },
]

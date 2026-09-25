export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '批次档案', to: '/batches' },
  { label: '环境监测', to: '/environment' },
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

// 固定环境指标：全工作室统一监测的指标定义与控制线。
// min / max 以数值形式给出，配合 unit 判定各区域读数是否超出控制线。
export const restorationMetricSpecs = [
  {
    key: 'humidity',
    label: '相对湿度',
    unit: '%',
    min: 50,
    max: 55,
  },
  {
    key: 'temperature',
    label: '温度',
    unit: '℃',
    min: 18,
    max: 22,
  },
  {
    key: 'illuminance',
    label: '照度',
    unit: 'lux',
    min: 150,
    max: 300,
  },
]

// 修复区域：各区域独立上报环境读数，与固定指标合并展示。
export const restorationZones = [
  { key: 'patch', label: '补纸区' },
  { key: 'damping', label: '控湿区' },
  { key: 'storage', label: '暂存区' },
]

// 各修复区域的当前读数（模拟采集接口返回的原始数据）：
// - value 为正常上报的数值；
// - previousValue 存在表示同一指标出现新旧两值，需人工确认；
// - readingState: 'missing' 读数缺失，'failed' 请求未返回。
export const restorationZoneReadings = [
  { zoneKey: 'patch', metricKey: 'humidity', value: 52 },
  { zoneKey: 'patch', metricKey: 'temperature', value: 23.4 },
  {
    zoneKey: 'patch',
    metricKey: 'illuminance',
    value: 260,
    previousValue: 340,
  },
  { zoneKey: 'damping', metricKey: 'humidity', value: 58 },
  {
    zoneKey: 'damping',
    metricKey: 'temperature',
    value: 20.5,
    readingState: 'failed',
  },
  { zoneKey: 'damping', metricKey: 'illuminance', value: 210 },
  {
    zoneKey: 'storage',
    metricKey: 'humidity',
    value: 51,
    readingState: 'missing',
  },
  { zoneKey: 'storage', metricKey: 'temperature', value: 19.8 },
  { zoneKey: 'storage', metricKey: 'illuminance', value: 120 },
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

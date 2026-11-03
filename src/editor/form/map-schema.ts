import { mdiCog, mdiMap } from '@mdi/js';
import { html } from 'lit';

import { ALERT_INFO } from '../editor-const';

const mapTilerHelper = html`如何获取 MapTiler API 密钥？
  <a href=${ALERT_INFO.MAPTILER_DOC_LINK} target="_blank" rel="noreferrer">点击这里</a>`;

const tiandituHelper = html`在<a href="https://console.tianditu.gov.cn/" target="_blank" rel="noreferrer"
    >天地图控制台</a
  >申请「浏览器端」密钥（tk），免费额度约 1 万次/天。`;

const gaodeHelper = html`在<a href="https://console.amap.com/dev/key/app" target="_blank" rel="noreferrer"
    >高德开放平台</a
  >创建「Web 服务」Key（仅用于"逆地理编码"显示地址；底图本身无需密钥）。`;

const MAP_SOURCE_OPTIONS = [
  { value: 'openfreemap', label: 'OpenFreeMap（海外，默认）' },
  { value: 'tianditu', label: '天地图（国内，需密钥）' },
  { value: 'gaode', label: '高德地图（国内，坐标已纠偏，底图免密钥）' },
] as const;

export const BASE_MAP_SCHEMA = [
  {
    name: 'device_tracker',
    label: '定位设备实体',
    helper: '需要实体才能配置地图',
    required: true,
    selector: { entity: { filter: { domain: ['device_tracker', 'person'] } } },
  },
] as const;

const LAYOUT_BOOL = [
  { name: 'enable_popup', label: '启用弹窗' },
  { name: 'us_format', label: '美式地址格式' },
  { name: 'hide_map_address', label: '隐藏地图地址' },
  { name: 'use_zone_name', label: '使用区域名称' },
  { name: 'user_location', label: '用户位置' },
  { name: 'disable_interaction', label: '禁用地图交互' },
] as const;

const LAYOUT_BOOL_HELPER: Partial<Record<(typeof LAYOUT_BOOL)[number]['name'], string>> = {
  disable_interaction:
    '禁止内联地图的拖拽/平移和滚轮缩放，避免其拦截仪表盘的滚动手势。点击地图改为弹出大图。',
};

export const MINI_MAP_LAYOUT_SCHEMA = [
  {
    type: 'expandable',
    title: '小地图布局',
    flatten: true,
    iconPath: mdiMap,
    schema: [
      {
        type: 'grid',
        flatten: true,
        schema: [
          ...LAYOUT_BOOL.map(({ name, label }) => ({
            name,
            label,
            helper: LAYOUT_BOOL_HELPER[name],
            selector: { boolean: {} },
          })),
        ] as const,
      },
      {
        type: 'grid',
        flatten: true,
        schema: [
          {
            name: 'map_zoom',
            label: '地图缩放级别',
            default: 14,
            selector: { number: { mode: 'box', min: 0, max: 20, step: 1 } },
          },
          {
            name: 'map_height',
            label: '地图高度',
            default: 150,
            selector: { number: { mode: 'box', min: 150, max: 500, step: 10 } },
          },
        ] as const,
      },
    ],
  },
];

export const BASE_MAP_CONFIG_SCHEMA = (data: any) => {
  const noEntity = !data?.device_tracker || data?.device_tracker === '';
  const notMapTiler = !data?.maptiler_api_key || data?.maptiler_api_key === '';
  const helperText = notMapTiler
    ? '需要 MapTiler API 密钥'
    : '启用后，小地图将作为独立的单张卡片显示，而不是嵌在其他卡片区块内。';
  const notUseSingleMapCard = data?.single_map_card !== true;
  return [
    {
      title: '底图配置',
      type: 'expandable',
      flatten: true,
      expanded: noEntity,
      iconPath: mdiCog,
      schema: [
        ...BASE_MAP_SCHEMA,
        {
          name: 'map_source',
          label: '地图源',
          helper: '国内网络建议选择「天地图」（瓦片来自 tianditu.gov.cn，加载更快）；海外网络保持 OpenFreeMap 即可。',
          default: 'openfreemap',
          selector: {
            select: {
              options: MAP_SOURCE_OPTIONS,
            },
          },
          disabled: noEntity,
        },
        {
          name: 'tianditu_key',
          label: '天地图 API 密钥 (tk)',
          helper: tiandituHelper,
          type: 'string',
          disabled: noEntity || data?.map_source !== 'tianditu',
          required: false,
        },
        {
          name: 'gaode_key',
          label: '高德 Web 服务 Key（逆地理编码，可选）',
          helper: gaodeHelper,
          type: 'string',
          disabled: noEntity || data?.map_source !== 'gaode',
          required: false,
        },
        {
          name: 'maptiler_api_key',
          label: 'MapTiler API 密钥（可选）',
          helper: mapTilerHelper,
          type: 'string',
          disabled: noEntity,
          required: false,
        },
        ...(!notMapTiler
          ? [
              {
                name: 'single_map_card',
                label: '小地图作为单张卡片',
                helper: helperText,
                type: 'boolean',
                default: false,
                disabled: notMapTiler,
              },
            ]
          : []),
      ],
    },
    ...(!noEntity && notUseSingleMapCard ? MINI_MAP_LAYOUT_SCHEMA : []),
  ] as const;
};

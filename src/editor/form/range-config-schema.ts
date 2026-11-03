import memoizeOne from 'memoize-one';

import { capitalizeFirstLetter } from '../../ha/common/string/capitalize-first-letter';
import { computeOptionalActionSchemaFull } from './actions-config';

interface TemplateItem<T = string> {
  name: T;
  label?: string;
  helper?: string;
  selector: {
    template: { preview?: boolean };
  };
}
const DIMENSION_KEYS = ['bar_height', 'bar_width', 'bar_radius'];

const CHARGE_TARGET_KEYS = [
  'charge_target_entity',
  'charge_target_color',
  'charge_target_visibility',
  'charge_target_tooltip',
] as const;

const CHARGING_KEYS = [
  'charging_entity',
  'charging_template',
  'charging_icon_template',
  'charging_icon_color_template',
] as const;

const TEMPLATES = [
  {
    name: 'charging_template',
    label: '充电模板',
    helper: '用模板控制充电中图标的可见性',
  },
  {
    name: 'charging_icon_template',
    label: '充电图标模板',
    helper: '基于模板用自定义图标覆盖默认的充电图标',
  },
  {
    name: 'charging_icon_color_template',
    label: '充电图标颜色模板',
    helper: '用模板设置充电图标的颜色，覆盖默认的进度条颜色',
  },
  {
    name: 'charge_target_visibility',
    label: '充电目标可见性',
    helper: '用模板控制充电目标线的可见性；若设置了 charge_target_entity 则默认为 true',
  },
  {
    name: 'visibility_template',
    label: ' ',
    helper: '当模板结果为 true 时显示进度条',
  },
];

const TemplateKeys = TEMPLATES.map((t) => t.name);
type TemplateKey = (typeof TemplateKeys)[number];

const computeTemplateSchema = (type?: TemplateKey[]) => {
  if (!type) {
    type = TemplateKeys;
  }
  const list: TemplateItem[] = [];
  type.forEach((key) => {
    const t = TEMPLATES.find((tt) => tt.name === key);
    if (t) {
      list.push({
        name: t.name,
        label: t.label,
        helper: t.helper,
        selector: {
          template: { preview: true },
        },
      });
    }
  });
  return list;
};

export { DIMENSION_KEYS, CHARGE_TARGET_KEYS, CHARGING_KEYS };

const POSTIONS = ['outside', 'inside', 'off'] as const;
const ALIGNMENTS = ['start', 'end'] as const;

export const VALUE_ALIGNMENT_SCHEMA = (disabled: boolean) => {
  return [
    {
      name: 'value_alignment',
      label: '数值对齐',
      default: 'end',
      selector: {
        select: {
          mode: 'dropdown',
          options: ALIGNMENTS.map((alignment) => ({
            value: alignment,
            label: alignment.charAt(0).toUpperCase() + alignment.slice(1),
          })),
        },
      },
      disabled: !disabled,
    },
  ] as const;
};

export const RANGE_ITEM_BASE_SCHEMA = () =>
  [
    {
      name: 'icon',
      label: '图标',
      selector: { icon: {} },
      context: { icon_entity: 'entity' },
    },
    {
      name: 'hide_icon',
      label: '隐藏图标',
      type: 'boolean',
      default: false,
      helper: '即使已设置也隐藏图标',
    },
    {
      name: 'icon_state_color',
      label: '图标状态颜色',
      type: 'boolean',
      default: false,
      helper: '为图标使用状态颜色',
    },
    {
      name: 'value_position',
      label: '数值位置',
      default: 'outside',
      selector: {
        select: {
          mode: 'dropdown',
          options: POSTIONS.map((position) => ({
            value: position,
            label: position.charAt(0).toUpperCase() + position.slice(1),
          })),
        },
      },
    },
  ] as const;

export const RANGE_ITEM_SCHEMA = memoizeOne((entityId: string, required: boolean = false, valueAligment?: boolean) => [
  {
    name: 'entity',
    required: required,
    selector: { entity: {} },
  },
  ...(entityId && entityId !== ''
    ? [
        {
          name: 'attribute',
          label: '属性',
          selector: {
            attribute: {
              entity_id: entityId,
            },
          },
        },
        {
          name: '',
          type: 'grid',
          flatten: true,
          schema: [
            ...RANGE_ITEM_BASE_SCHEMA(),
            ...(valueAligment ? VALUE_ALIGNMENT_SCHEMA(valueAligment) : []),
            ...(required === true
              ? [
                  {
                    name: 'max_value',
                    label: '最大值',
                    type: 'integer',
                    valueMin: 0,
                  },
                ]
              : []),
          ],
        },
        {
          name: '',
          type: 'expandable',
          title: '交互选项',
          icon: 'mdi:gesture-tap-button',
          flatten: true,
          schema: [...computeOptionalActionSchemaFull()],
        },
      ]
    : []),
]);

export const PROGRESS_BAR_SCHEMA = [
  {
    name: '',
    type: 'grid',
    column_min_width: '140px',
    schema: [
      {
        name: 'bar_height',
        label: '进度条高度 (px)',
        type: 'integer',
        valueMin: 1,
      },
      {
        name: 'bar_width',
        label: '进度条宽度 (%)',
        type: 'integer',
        valueMax: 100,
      },
      {
        name: 'bar_radius',
        label: '圆角半径 (px)',
        type: 'integer',
        valueMin: 0,
      },
    ],
  },
] as const;

export const CHARGING_STATE_SCHEMA = () => {
  return [
    {
      name: 'charging_entity',
      label: ' ',
      selector: { entity: {} },
      required: false,
    },
    {
      title: '模板选项（可选）',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:code-json',
      context: { isTemplate: true },
      schema: [
        {
          type: 'optional_actions',
          flatten: true,
          context: { isTemplate: true },
          schema: [
            ...computeTemplateSchema(['charging_template', 'charging_icon_template', 'charging_icon_color_template']),
          ],
        },
      ],
    },
  ] as const;
};

export const CHARGE_TARGET_SCHEMA = (entityId: string | undefined) =>
  [
    {
      name: 'charge_target_entity',
      selector: { entity: {} },
      required: false,
    },
    ...(entityId && entityId !== ''
      ? [
          {
            name: '',
            type: 'grid',
            flatten: true,
            schema: [
              {
                name: 'charge_target_color',
                label: '充电目标线颜色',
                selector: {
                  ui_color: {
                    include_none: false,
                    include_states: false,
                    default_color: 'accent',
                  },
                },
              },
            ] as const,
          },
          {
            name: 'charge_target_tooltip',
            label: '显示提示浮层',
            helper: '悬停在充电目标线上时，用提示浮层显示目标值',
            default: false,
            type: 'boolean',
          },
          {
            name: 'charge_target_visibility',
            label: '充电目标可见性',
            helper:
              '用模板控制充电目标线的可见性；若设置了 charge_target_entity 则默认为 true',
            selector: { template: {} },
          },
        ]
      : []),
  ] as const;

const RANGE_LAYOUTS = ['column', 'row'] as const;
export const RANGE_LAYOUT_SCHEMA = [
  {
    name: 'layout',
    label: '布局外观',
    type: 'select',
    default: 'column',
    required: false,
    options: RANGE_LAYOUTS.map((layout) => [layout, layout.charAt(0).toUpperCase() + layout.slice(1)]),
  },
] as const;

export const RANGE_LAYOUT = [
  {
    name: 'layout',
    label: '选择里程信息布局',
    default: 'column',
    required: false,
    selector: {
      select: {
        mode: 'dropdown',
        options: RANGE_LAYOUTS.map((layout) => ({
          value: layout,
          label: capitalizeFirstLetter(layout),
        })),
      },
    },
  },
] as const;

export const RANGE_VISIBILITY_SCHEMA = [...computeTemplateSchema(['visibility_template'])];

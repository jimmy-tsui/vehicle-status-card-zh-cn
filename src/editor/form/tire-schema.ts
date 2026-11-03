import memoizeOne from 'memoize-one';

import { TireEntityConfig, TireTemplateConfig } from '../../types/config';

const DEFAULT_TIRE_ENTITY: TireEntityConfig = {
  entity: '',
  attribute: '',
  name: '',
  color: '',
};

export const DEFAULT_LAYOUT = {
  horizontal: false,
  hide_rotation_button: false,
  image_size: 100,
  value_size: 100,
  top: 50,
  left: 50,
  aspect_ratio: '1/1',
};
export const DEFAULT_TIRE_CONFIG: TireTemplateConfig = {
  title: '',
  background: '',
  front_left: DEFAULT_TIRE_ENTITY,
  front_right: DEFAULT_TIRE_ENTITY,
  rear_left: DEFAULT_TIRE_ENTITY,
  rear_right: DEFAULT_TIRE_ENTITY,
  ...DEFAULT_LAYOUT,
};

const DIMENSION_SCHEMA = (isHorizontal: boolean) => {
  return [
    {
      name: '',
      flatten: true,
      type: 'grid',
      schema: [
        {
          name: 'image_size',
          label: '基准图片尺寸比例 (%)',
          selector: { number: { max: 200, min: 0, mode: 'slider', step: 1 } },
          default: 100,
        },
        {
          name: 'value_size',
          label: '名称/数值尺寸比例 (%)',
          selector: { number: { max: 150, min: 50, mode: 'slider', step: 1 } },
          default: 100,
        },
        {
          name: 'top',
          label: `${!isHorizontal ? 'Top' : 'Left'} position`,
          default: 50,
          selector: { number: { max: 100, min: 0, mode: 'slider', step: 1 } },
        },
        {
          name: 'left',
          label: `${!isHorizontal ? 'Left' : 'Top'} position`,
          default: 50,
          selector: { number: { max: 100, min: 0, mode: 'slider', step: 1 } },
        },
      ],
    },
  ] as const;
};

export const TIRE_APPEARANCE_SCHEMA = memoizeOne(
  (isHorizontal: boolean) =>
    [
      {
        name: 'title',
        label: '卡片标题',
        required: false,
        selector: { text: { type: 'text' } },
      },
      {
        name: '',
        flatten: true,
        type: 'grid',
        schema: [
          {
            name: 'horizontal',
            label: '横向',
            default: false,
            selector: { boolean: {} },
          },
          {
            name: 'hide_rotation_button',
            label: '隐藏旋转按钮',
            default: false,
            selector: { boolean: {} },
          },
          {
            name: 'aspect_ratio',
            label: '宽高比',
            selector: { text: { type: 'text' } },
            default: '1/1',
          },
        ],
      },
      ...DIMENSION_SCHEMA(isHorizontal),
    ] as const
);

export const TIRE_BACKGROUND_SCHEMA = [
  {
    name: 'background',
    label: '背景图片',
    selector: {
      media: {
        accept: ['image/*'] as string[],
        clearable: true,
        image_upload: true,
        hide_content_type: false,
      },
    },
    helper:
      'The image should be square with a maximum resolution of 450x450 pixels. A transparent background is recommended.',
  },
  {
    name: 'background_entity',
    label: '背景实体',
    selector: { entity: { domain: ['image'] } },
    helper: '若设置，背景图片将取自该实体。',
  },
] as const;

export const TIRE_CUSTOM_POSITION_SCHEMA = (useCustomPosition: boolean = false, isHorizontal: boolean = false) => {
  return [
    {
      type: 'expandable',
      label: '自定义位置',
      flatten: true,
      schema: [
        {
          name: 'use_custom_position',
          label: '使用自定义位置',
          type: 'boolean',
          default: false,
          helper: '启用后可为此轮胎条目设置自定义位置。',
        },
        {
          name: 'position',
          label: '位置 (%)',
          type: 'grid',
          flatten: false,
          disabled: !useCustomPosition,
          schema: [
            {
              name: 'top',
              label: `${!isHorizontal ? 'Top' : 'Left'} (%)`,
              type: 'float',
            },
            {
              name: 'left',
              label: `${!isHorizontal ? 'Left' : 'Top'} (%)`,
              type: 'float',
            },
          ],
        },
      ],
    },
  ];
};

export const ADDITIONAL_ENTITY_SCHEMA = [
  {
    name: 'entity',
    label: '实体',
    selector: { entity: {} },
    required: true,
  },
  {
    name: 'state_content',
    label: '状态内容',
    selector: {
      ui_state_content: {
        allow_context: true,
      },
    },
    context: {
      filter_entity: 'entity',
    },
  },
  {
    name: 'prefix',
    label: '前缀',
    selector: { text: { type: 'text' } },
    required: false,
  },
  {
    name: 'suffix',
    label: '后缀',
    selector: { text: { type: 'text' } },
    required: false,
  },
] as const;

export const TIRE_ENTITY_SCHEMA = memoizeOne(
  (tirePosition: string, useCustomPosition: boolean = false, isHorizontal: boolean = false) => {
    const tireLabel = tirePosition.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return [
      {
        type: 'expandable',
        label: '主数值实体',
        flatten: true,
        schema: [
          {
            name: 'entity',
            label: '实体',
            selector: { entity: {} },
          },
          {
            name: 'attribute',
            label: '属性',
            selector: { attribute: {} },
            context: {
              filter_entity: `entity`,
            },
          },
          {
            name: 'name',
            label: '名称',
            selector: { text: { type: 'text' } },
            default: tireLabel,
            helper: '轮胎名称',
          },
          {
            name: 'color',
            label: '数值颜色模板',
            selector: { template: {} },
            helper:
              '基于模板自定义颜色。模板需返回合法的颜色名称或十六进制色值。',
          },
        ],
      },
      ...TIRE_CUSTOM_POSITION_SCHEMA(useCustomPosition, isHorizontal),
    ] as const;
  }
);

export const SINGLE_TIRE_ENABLED_SCHEMA = [
  {
    name: 'single_tire_card',
    type: 'grid',
    flatten: false,
    schema: [
      {
        name: 'enabled',
        label: '启用独立轮胎卡片',
        helper: '启用后，轮胎卡片将以独立卡片形式显示。',
        type: 'boolean',
        default: false,
      },
    ],
  },
] as const;

import { mdiButtonCursor, mdiGestureTap, mdiPalette } from '@mdi/js';
import { capitalize } from 'es-toolkit';

import type { BaseButtonCardItemConfig } from '../../types/config';

import { computeIconActionSchema, computeOptionalActionSchemaFull } from './actions-config';

interface TemplateItem<T = string> {
  name: T;
  label?: string;
  helper?: string;
  selector: {
    template: {};
  };
}

interface BooleanItem<T = string> {
  name: T;
  label?: string;
  helper?: string;
  default?: boolean;
  type: 'boolean';
}

const BUTTON_TYPE = ['default', 'action'] as const;
const CARD_TYPE = ['default', 'custom', 'tire'] as const;
const LAYOUT = ['horizontal', 'vertical'] as const;
const PRIMARY_INFO = ['name', 'state', 'primary-template'] as const;
const ICON_TYPE = ['icon', 'entity-picture', 'icon-template'] as const;

const BOOLEANS = [
  {
    name: 'show_primary',
    label: '显示主信息',
  },
  {
    name: 'show_secondary',
    label: '显示次要信息',
  },
  {
    name: 'show_icon',
    label: '显示图标',
  },
  {
    name: 'state_color',
    label: '状态颜色',
    helper: '在可用时把颜色应用到图标背景',
    default: false,
  },
  {
    name: 'include_state_template',
    label: '包含状态模板',
    helper: '用 state_template 扩展次要内容',
  },
  {
    name: 'transparent',
    label: '透明背景',
    helper: '启用此选项可使按钮背景透明。',
  },
  {
    name: 'secondary_multiline',
    label: '允许次要内容多行显示',
    helper: '允许次要内容在需要时换行显示为多行。',
  },
  {
    name: 'hide_button',
    label: '在卡片上隐藏按钮',
    helper: '在卡片上隐藏该按钮。',
  },
];
const computeBooleanSchema = (type?: BooleanItem['name'][]) => {
  if (!type) {
    type = BOOLEANS.map((b) => b.name);
  }
  const list: BooleanItem[] = [];
  type.forEach((key) => {
    const b = BOOLEANS.find((bb) => bb.name === key);
    if (b) {
      list.push({
        name: b.name,
        label: b.label,
        helper: b.helper,
        default: b.default,
        type: 'boolean',
      });
    }
  });
  return list;
};

const TEMPLATES = [
  {
    name: 'primary_template',
    label: '主标签模板',
    helper: '主标签模板。覆盖主标签的内容。',
  },
  {
    name: 'state_template',
    label: '次要状态模板',
    helper: '用于扩展次要状态内容的附加模板。',
  },
  {
    name: 'icon_template',
    label: '图标模板',
    helper: '通过模板覆盖图标。模板需返回合法的图标名称。',
  },
  {
    name: 'color_template',
    label: '图标颜色模板',
    helper:
      'Template to override the color to the icon. The template should return a valid CSS color (name, hex, rgb, hsl, etc.).',
  },
] as const;

const BADGE_TEMPLATES = [
  {
    name: 'notify',
    label: '徽标可见性',
    helper: '使用 Jinja2 模板，结果为 `true` 时显示通知徽标',
  },
  {
    name: 'notify_color',
    label: '徽标颜色',
    helper: '徽标颜色。支持模板或 CSS 颜色格式',
  },
  {
    name: 'notify_icon',
    label: '徽标图标',
    helper: '以徽标显示的图标。支持模板',
  },
  {
    name: 'notify_text',
    label: '徽标文本（替换图标）',
    helper: '徽标内显示的文本。支持模板',
  },
] as const;

const TEMPLATES_ALL = [...TEMPLATES, ...BADGE_TEMPLATES];

const TemplateKeys = TEMPLATES_ALL.map((t) => t.name);

type TemplateKey = (typeof TemplateKeys)[number];

const computeTemplateSchema = (type?: TemplateKey[]) => {
  if (!type) {
    type = TemplateKeys;
  }
  const list: TemplateItem[] = [];
  type.forEach((key) => {
    const t = TEMPLATES_ALL.find((tt) => tt.name === key);
    if (t) {
      list.push({
        name: t.name,
        label: t.label,
        helper: t.helper,
        selector: {
          template: {},
        },
      });
    }
  });
  return list;
};

const BASE_TEMPLATE_KEYS: TemplateKey[] = ['primary_template', 'state_template', 'icon_template', 'color_template'];
const NOTIFY_TEMPLATE_KEYS: TemplateKey[] = ['notify', 'notify_color', 'notify_icon', 'notify_text'];

const _generateOptionalTemplate = (type: 'base' | 'notify') => {
  const schemaObj = {
    base: {
      title: '附加模板（高级）',
      icon: 'mdi:code-block-braces',
      keys: BASE_TEMPLATE_KEYS,
    },
    notify: {
      title: '徽标',
      icon: 'mdi:square-rounded-badge',
      keys: NOTIFY_TEMPLATE_KEYS,
    },
  };
  const obj = schemaObj[type];
  return [
    {
      title: obj.title,
      type: 'expandable',
      flatten: true,
      icon: obj.icon,
      context: {
        isTemplate: true,
      },
      schema: [
        {
          type: 'optional_actions',
          flatten: true,
          context: { isTemplate: true },
          schema: [...computeTemplateSchema(obj.keys)],
        },
      ],
    },
  ] as const;
};

const BUTTON_BEHAVIOR_SCHEMA = (isActionButton: boolean) => {
  return [
    {
      title: '按钮行为',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:gesture-tap-button',
      helper:
        'Tap action is ommitted when button type is "default", as tapping will open subcard. Other actions will still apply.',
      schema: [
        {
          type: 'grid',
          schema: [
            {
              name: 'button_type',
              label: '按钮类型',
              default: 'default',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: BUTTON_TYPE.map((type) => ({ value: type, label: capitalize(type.replace(/_/g, ' ')) })),
                },
              },
            },
            {
              name: 'card_type',
              label: '卡片类型',
              default: 'default',
              disabled: isActionButton,
              selector: {
                select: {
                  mode: 'dropdown',
                  options: CARD_TYPE.map((type) => ({
                    value: type,
                    label: capitalize(type.replace(/_/g, ' ') + ' card'),
                  })),
                },
              },
            },
          ] as const,
        },
        // ...(isActionButton ? [...computeOptionalActionSchemaFull()] : []),
        ...computeOptionalActionSchemaFull(!isActionButton),
      ],
    },
  ] as const;
};

const ICON_COLOR_SCHEMA = [
  {
    title: '图标与颜色',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:emoticon-happy',
    context: {
      isTemplate: true,
    },
    schema: [
      ...computeBooleanSchema(['show_icon']),
      {
        type: 'grid',
        schema: [
          {
            name: 'color',
            selector: {
              ui_color: {
                default_color: 'none',
                include_none: true,
                include_state: true,
              },
            },
          },
          ...computeBooleanSchema(['state_color']),
          {
            name: 'icon',
            selector: {
              icon: {},
            },
            context: { icon_entity: 'entity' },
          },
          {
            name: 'icon_type',
            label: '图标类型',
            helper: '决定图标的生成与显示方式。（默认：图标）',
            required: false,
            default: 'icon',
            selector: {
              select: {
                mode: 'dropdown',
                options: ICON_TYPE.map((type) => ({
                  value: type,
                  label: capitalize(type.replace(/_/g, ' ')),
                })),
              },
            },
          },
        ],
      },

      {
        type: 'optional_actions',
        flatten: true,
        context: { isTemplate: true },
        schema: [...computeTemplateSchema(['icon_template', 'color_template'])],
      },
    ] as const,
  },
] as const;

const PRIMARY_INFO_SCHEMA = [
  {
    title: '主信息',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:format-text',
    context: {
      isTemplate: true,
    },
    schema: [
      ...computeBooleanSchema(['show_primary']),
      {
        name: 'primary_info',
        label: '主信息',
        helper: '选择作为主信息显示的内容类型（默认：名称）',
        required: false,
        default: 'name',
        selector: {
          select: {
            mode: 'dropdown',
            options: PRIMARY_INFO.map((type) => ({
              value: type,
              label: capitalize(type.replace(/_/g, ' ')),
            })),
          },
        },
      },
      {
        type: 'optional_actions',
        flatten: true,
        context: { isTemplate: true },
        schema: [...computeTemplateSchema(['primary_template'])],
      },
    ] as const,
  },
] as const;

const SECONDARY_INFO_SCHEMA = (entity?: string) =>
  [
    {
      title: '次要信息',
      type: 'expandable',
      flatten: true,
      icon: 'mdi:format-text-variant',
      context: {
        isTemplate: true,
      },
      schema: [
        ...computeBooleanSchema(['show_secondary', 'include_state_template']),
        ...(!!entity
          ? [
              {
                name: 'state_content',
                label: '次要状态内容',
                helper:
                  'Additional content to display in the secondary state area. Select from available attributes and options.',
                selector: {
                  ui_state_content: {
                    entity_id: entity,
                    allow_name: true,
                  },
                },
                context: {
                  filter_entity: entity,
                },
              },
            ]
          : []),
      ] as const,
    },
  ] as const;

const LAYOUT_SCHEMA = [
  {
    title: '布局与样式',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:image-text',
    schema: [
      ...computeBooleanSchema(['transparent', 'secondary_multiline']),
      {
        name: 'layout',
        label: '按钮布局',
        required: true,
        selector: {
          select: {
            mode: 'box',
            options: LAYOUT.map((value) => ({
              label: capitalize(value),
              value,
              image: {
                src: `/static/images/form/tile_content_layout_${value}.svg`,
                src_dark: `/static/images/form/tile_content_layout_${value}_dark.svg`,
                flip_rtl: true,
              },
            })),
          },
        },
      },
    ] as const,
  },
] as const;

export const MAIN_BUTTON_SCHEMA = (data: BaseButtonCardItemConfig) => {
  const isActionButton = data?.button_type === 'action';
  const entity = data?.entity;
  return [
    {
      title: '上下文与标识',
      type: 'expandable',
      flatten: true,
      iconPath: mdiButtonCursor,
      schema: [
        ...computeBooleanSchema(['hide_button']),

        {
          name: 'name',
          label: '名称（可选）',
          required: false,
          selector: { text: {} },
        },
        {
          name: 'entity',
          label: '实体（可选）',
          helper: '用于模板、动作与状态显示的实体',
          required: false,
          selector: {
            entity: {},
          },
          context: { group_entity: true },
        },
      ] as const,
    },
    {
      title: '外观与内容',
      type: 'expandable',
      flatten: true,
      iconPath: mdiPalette,
      headingLevel: 2,
      schema: [
        ...ICON_COLOR_SCHEMA,
        ...PRIMARY_INFO_SCHEMA,
        ...SECONDARY_INFO_SCHEMA(entity),
        ..._generateOptionalTemplate('notify'),
        ...LAYOUT_SCHEMA,
      ] as const,
    },
    {
      title: '交互',
      type: 'expandable',
      flatten: true,
      iconPath: mdiGestureTap,
      schema: [
        ...BUTTON_BEHAVIOR_SCHEMA(isActionButton),
        {
          title: '图标交互',
          type: 'expandable',
          flatten: true,
          icon: 'mdi:gesture-tap-hold',
          helper: '点击图标时的动作与行为',
          schema: [...computeIconActionSchema()] as const,
        },
      ] as const,
    },
  ] as const;
};

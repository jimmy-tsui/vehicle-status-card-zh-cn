import { mdiCodeJson, mdiDotsHexagon, mdiGestureTap, mdiPalette, mdiTextShort } from '@mdi/js';

import { computeOptionalActionSchemaFull } from './actions-config';

const DISPLAY_ELEMENTS = ['show_name', 'show_state', 'show_icon'] as const;

export const DISPLAY_OPTIONS_SCHEMA = (stateContentAllowed: boolean = true, entity?: string) =>
  [
    {
      type: 'expandable',
      flatten: true,
      title: '显示选项',
      iconPath: mdiTextShort,
      schema: [
        {
          type: 'grid',
          schema: [
            ...DISPLAY_ELEMENTS.map((element) => ({
              label: element.replace(/_/g, ' '),
              name: element,
              type: 'boolean',
            })),
          ] as const,
        },
        ...(stateContentAllowed
          ? [
              {
                name: 'state_content',
                label: '状态内容',
                selector: {
                  ui_state_content: {
                    entity_id: entity,
                    allow_name: false,
                  },
                },
                context: {
                  filter_entity: entity,
                },
              },
            ]
          : []),
      ],
    },
  ] as const;

export const ROW_NO_WRAP_SCHEMA = [
  {
    name: 'no_wrap',
    label: '禁止换行',
    type: 'boolean',
    helper: '条目在一行内排列，可横向滚动。',
    default: false,
  },
] as const;

export const ICON_SIZE_SCHEMA = [
  {
    name: 'icon_size',
    label: '图标尺寸 (px)',
    required: false,
    default: 21,
    selector: { number: { min: 14, step: 1, mode: 'box', unit_of_measurement: 'px' } },
  },
] as const;

export interface BooleanItemSchema {
  type: 'boolean';
  name: string;
  label?: string;
  helper?: string;
  default?: boolean;
}

interface BooleanItem<T = string> {
  name: T;
  label?: string;
  helper?: string;
  type: 'boolean';
  default?: boolean;
}

interface TemplateItem<T = string> {
  name: T;
  label?: string;
  helper?: string;
  selector: {
    template: {};
  };
}

const BaseBooleanConfig: Record<string, Partial<BooleanItem>> = {
  ignore_global: {
    label: '忽略全局配置',
    helper: '忽略该条目的全局外观配置。',
  },
  show_entity_picture: {
    label: '显示实体图片',
  },
  column_reverse: {
    label: '列反转',
    helper: '反转名称与状态顺序',
  },
  row_reverse: {
    label: '行反转',
    helper: '反转图标与内容顺序',
  },
  include_state_template: {
    label: '包含状态模板',
    helper: '将状态模板结果添加到内容中',
  },
};

const GlobalBooleanConfig: Record<string, Partial<BooleanItem>> = {
  global_column_reverse: {
    label: '全局列反转',
    helper: '反转该行所有条目的名称与状态顺序',
  },
  global_row_reverse: {
    label: '全局行反转',
    helper: '反转该行所有条目的图标与内容顺序',
  },
};

const COMBINED_BOOLEAN_CONFIG = { ...BaseBooleanConfig, ...GlobalBooleanConfig };

const SINGLE_BOOLEAN_KEYS = [
  'ignore_global',
  'show_entity_picture',
  'column_reverse',
  'row_reverse',
  'include_state_template',
] as const;
export const GLOBAL_BOOLEAN_KEYS = [...Object.keys(GlobalBooleanConfig)] as string[];

const BOOLEAN_KEYS = [...SINGLE_BOOLEAN_KEYS, ...GLOBAL_BOOLEAN_KEYS];

// eslint-disable-next-line unused-imports/no-unused-vars
const BooleanTypes = [...BOOLEAN_KEYS] as const;
type BooleanKey = (typeof BooleanTypes)[number];

const DEFAULT_BOLEAN_CONFIG = [
  ...BOOLEAN_KEYS.map((key) => ({
    name: key,
    type: 'boolean',
    default: false,
    ...(COMBINED_BOOLEAN_CONFIG[key] || {}),
  })),
] as BooleanItemSchema[];

export const createBooleanSchema = (overrides?: Partial<BooleanItemSchema>[]): BooleanItemSchema[] => {
  const defaultConfig = DEFAULT_BOLEAN_CONFIG;

  if (!overrides) {
    return defaultConfig;
  }
  const merged = defaultConfig.map((item) => {
    const override = overrides.find((o) => o.name === item.name);
    if (override) {
      return { ...item, ...override };
    }
    return item;
  });
  // Add any additional items that are not in the default list
  overrides.forEach((override) => {
    if (!merged.find((m) => m.name === override.name)) {
      merged.push(override as BooleanItemSchema);
    }
  });
  return merged;
};

export const computeBooleanSchema = (keys: BooleanKey[]): BooleanItemSchema[] => {
  return createBooleanSchema().filter((item) => keys.includes(item.name as BooleanKey));
};

export const computeBooleanList = (keys?: BooleanKey[]) => {
  if (!keys) {
    keys = BOOLEAN_KEYS;
  }
  const baseConfig = { ...BaseBooleanConfig, ...GlobalBooleanConfig };
  const list: BooleanItem[] = [];
  keys.forEach((key) => {
    if (baseConfig[key]) {
      list.push({
        name: key,
        type: 'boolean',
        default: false,
        label: baseConfig[key].label || key.replace(/_/g, ' ').replace('show', ''),
        helper: baseConfig[key].helper || '',
      });
    }
  });
  return list;
};

const TEMPLATES = [
  {
    name: 'visibility',
    label: '可见性模板',
    helper: '基于模板控制指示器的显示/隐藏。模板需返回 true 或 false。',
  },
  {
    name: 'state_template',
    label: '状态模板',
    helper: '基于模板自定义状态。模板需返回合法的状态名称。',
  },
  {
    name: 'icon_template',
    label: '图标模板',
    helper: '通过模板覆盖图标。模板需返回合法的图标名称。',
  },
  {
    name: 'color_template',
    label: '颜色模板',
    helper: '通过模板覆盖颜色。模板需返回合法的 CSS 颜色（名称、hex、rgb、hsl 等）。',
  },
  {
    name: 'row_visibility',
    label: '行可见性模板',
    helper: '基于模板控制整行的显示/隐藏。返回 false 时隐藏整行。',
  },
];

const TemplateKeys = TEMPLATES.map((t) => t.name);
type TemplateKey = (typeof TemplateKeys)[number];

export const computeTemplateSchema = (type?: TemplateKey[], exclude?: TemplateKey[]) => {
  if (!type) {
    type = TemplateKeys;
  }
  if (exclude) {
    type = type.filter((key) => !exclude.includes(key));
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
          template: {},
        },
      });
    }
  });
  return list;
};

export const ROW_ICON_SIZE_NO_WRAP_SCHEMA = [
  {
    title: '全局外观（可选）',
    type: 'expandable',
    iconPath: mdiPalette,
    helper: '这些选项作用于所有条目，除非条目自身已覆盖设置。',
    flatten: true,
    schema: [
      {
        type: 'grid',
        schema: [
          {
            name: 'global_icon_size',
            label: '图标尺寸 (px)',
            helper: '该行所有图标的尺寸。',
            required: false,
            default: 21,
            selector: { number: { min: 14, step: 1, mode: 'box', unit_of_measurement: 'px' } },
          },
          ,
          ...computeBooleanSchema(GLOBAL_BOOLEAN_KEYS as BooleanKey[]),
        ],
      },
      {
        type: 'expandable',
        flatten: true,
        title: '附加模板（高级）',
        schema: [...computeTemplateSchema(['row_visibility'])],
      },
    ],
  },
] as const;

export const ROW_INTERACTON_BASE_SCHEMA = [
  {
    title: '交互',
    type: 'expandable',
    flatten: true,
    iconPath: mdiGestureTap,
    schema: [...computeOptionalActionSchemaFull()],
  },
] as const;

// SINGLE ENTITY TYPE SCHEMA
export const ROW_ITEM_CONTENT_SCHEMA = () =>
  [
    {
      name: 'name',
      selector: {
        text: {},
      },
    },
    {
      name: '',
      type: 'grid',
      flatten: true,
      schema: [
        {
          name: 'color',
          selector: {
            ui_color: {
              default_color: 'state',
              include_state: true,
            },
          },
        },
        {
          name: 'icon',
          selector: {
            icon: {},
          },
          context: {
            icon_entity: 'entity',
          },
        },
        ...ICON_SIZE_SCHEMA,
        ...computeBooleanSchema([...SINGLE_BOOLEAN_KEYS]),
      ],
    },
  ] as const;

export const ENTITY_SINGLE_TYPE_SCHEMA = (data: any) => {
  const entity = data?.entity;
  return [
    { name: 'entity', required: true, selector: { entity: {} } },
    {
      title: '外观与内容',
      type: 'expandable',
      flatten: true,
      iconPath: mdiPalette,
      schema: [...ROW_ITEM_CONTENT_SCHEMA(), ...DISPLAY_OPTIONS_SCHEMA(!!entity, entity), ...OPTIONAL_TEMPLATE_SCHEMA],
    },

    ...ROW_INTERACTON_BASE_SCHEMA,
  ] as const;
};

export const ROW_GROUP_BASE_SCHEMA = (groupEntity?: string, isGroupEntityType: boolean = false) =>
  [
    {
      title: '分组配置',
      type: 'expandable',
      flatten: true,
      expanded: false,
      iconPath: mdiDotsHexagon,
      schema: [
        {
          name: 'name',
          label: '分组名称',
          selector: {
            text: {},
          },
        },
        {
          name: 'entity',
          label: '分组实体（可选）',
          helper: '此实体用于获取状态内容',
          required: false,
          selector: {
            entity: {},
          },
          context: { group_entity: true },
        },
        ...(groupEntity && isGroupEntityType
          ? [
              {
                name: 'ignore_group_members',
                label: '忽略分组内成员',
                type: 'boolean',
                helper:
                  'Do not include entities from the group entity attribute. Only use entities defined in the items.',
                default: false,
              },
            ]
          : []),
      ],
    },
    {
      title: '外观与内容',
      type: 'expandable',
      flatten: true,
      iconPath: mdiPalette,
      schema: [
        {
          name: '',
          type: 'grid',
          schema: [
            {
              name: 'color',
              selector: {
                ui_color: {
                  include_state: false,
                },
              },
            },
            {
              name: 'icon',
              selector: {
                icon: {},
              },
              context: { icon_entity: 'entity' },
            },
            ...ICON_SIZE_SCHEMA,
          ],
        },
        {
          name: '',
          type: 'grid',
          schema: [
            ...computeBooleanSchema(['ignore_global', 'column_reverse', 'row_reverse', 'include_state_template']),
          ],
        },
        ...DISPLAY_OPTIONS_SCHEMA(!!groupEntity, groupEntity),
      ],
    },
    ...OPTIONAL_TEMPLATE_SCHEMA,
    {
      title: '交互',
      helper: '分组不设置点击动作：点击分组用于展开/折叠。',
      type: 'expandable',
      flatten: true,
      iconPath: mdiGestureTap,
      schema: [...computeOptionalActionSchemaFull(true)],
    },
  ] as const;

export const SUBGROUP_ENTITY_SCHEMA = (data: any) => {
  const entity = data?.entity;
  return [
    { name: 'entity', selector: { entity: {} } },
    {
      name: 'name',
      selector: {
        text: {},
      },
    },
    {
      title: '内容',
      type: 'expandable',
      flatten: true,
      iconPath: mdiTextShort,
      schema: [
        {
          name: '',
          type: 'grid',
          flatten: true,
          schema: [
            {
              name: 'color',
              selector: {
                ui_color: {
                  default_color: 'state',
                  include_state: true,
                },
              },
            },
            {
              name: 'icon',
              selector: {
                icon: {},
              },
              context: {
                icon_entity: 'entity',
              },
            },
            ...computeBooleanSchema([...SINGLE_BOOLEAN_KEYS]),
          ],
        },
        ...DISPLAY_OPTIONS_SCHEMA(!!entity, entity),
        ...OPTIONAL_TEMPLATE_SCHEMA,
      ],
    },
  ] as const;
};

export const OPTIONAL_TEMPLATE_SCHEMA = [
  {
    title: '附加模板（高级）',
    type: 'expandable',
    flatten: true,
    iconPath: mdiCodeJson,
    context: {
      isTemplate: true,
    },
    schema: [
      {
        type: 'optional_actions',
        flatten: true,
        context: { isTemplate: true },
        schema: [...computeTemplateSchema(undefined, ['row_visibility'])],
      },
    ],
  },
] as const;

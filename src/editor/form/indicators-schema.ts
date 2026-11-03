import { mdiGestureTap, mdiPalette } from '@mdi/js';
import memoizeOne from 'memoize-one';

import { UiAction } from '../../ha';
import { computeOptionalActionSchema } from './actions-config';

const DEFAULT_ACTIONS: UiAction[] = ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'assist'];

export const singleIndicatorSchema = memoizeOne(
  (entity: string | undefined) =>
    [
      {
        name: 'entity',
        required: true,
        selector: {
          entity: {},
        },
      },
      {
        name: 'attribute',
        label: '属性',
        selector: {
          attribute: {
            entity_id: entity,
          },
        },
      },
      {
        name: 'icon',
        selector: { icon: {} },
        context: { icon_entity: 'entity' },
      },
    ] as const
);

export const singleApparenceSchema = [
  {
    name: '',
    type: 'expandable',
    iconPath: mdiPalette,
    title: '外观',
    schema: [
      {
        name: 'state_color',
        label: '状态颜色',
        type: 'boolean',
        default: false,
        helper: '使用实体状态颜色为指示器着色。',
      },
      {
        name: 'visibility',
        label: '可见性模板',
        selector: { template: {} },
        helper: '基于模板控制指示器的显示/隐藏。模板需返回 true 或 false。',
      },
      {
        name: 'icon_template',
        label: '图标模板',
        selector: { template: {} },
        helper: '基于模板自定义图标。模板需返回合法的图标名称（mdi: 格式）。',
      },
      {
        name: 'color',
        label: '颜色模板',
        selector: { template: {} },
        helper: '基于模板自定义颜色。模板需返回合法的颜色名称或十六进制色值。',
      },
      {
        name: 'state_template',
        label: '状态模板',
        selector: { template: {} },
        helper: '基于模板自定义状态。模板需返回合法的状态名称。',
      },
    ],
  },
] as const;

export const singleActionSchema = memoizeOne(() => [
  {
    name: 'action_config',
    type: 'expandable',
    title: '动作配置',
    iconPath: mdiGestureTap,
    schema: [...computeOptionalActionSchema()],
  },
]);

export const mainGroupSchema = [
  {
    name: '',
    type: 'grid',
    schema: [
      {
        name: 'name',
        label: '分组名称',
        selector: { text: {} },
      },
      {
        name: 'icon',
        label: '分组图标',
        selector: { icon: {} },
      },
    ],
  },
] as const;

export const groupApparenceSchema = [
  {
    name: '',
    type: 'expandable',
    iconPath: mdiPalette,
    title: '外观',
    schema: [
      {
        name: 'visibility',
        label: '可见性模板',
        selector: { template: {} },
        helper: '基于模板控制指示器的显示/隐藏。模板需返回 true 或 false。',
      },
      {
        name: 'color',
        label: '颜色模板',
        selector: { template: {} },
        helper: '基于模板自定义颜色。模板需返回合法的颜色名称或十六进制色值。',
      },
    ],
  },
] as const;

export const subGroupItemSchema = memoizeOne(
  (entity: string) =>
    [
      {
        name: '',
        type: 'grid',
        schema: [
          {
            name: 'name',
            label: '条目名称',
            required: false,
            type: 'string',
            default: '',
          },
          ...singleIndicatorSchema(entity),
        ],
      },
      {
        name: '',
        type: 'expandable',
        title: '附加模板',
        schema: [
          {
            name: 'state_color',
            label: '状态颜色',
            type: 'boolean',
            default: false,
            helper: '使用实体状态颜色为指示器着色。',
          },
          {
            name: 'icon_template',
            label: '图标模板',
            selector: { template: {} },
            helper: '基于模板自定义图标。模板需返回合法的图标名称（mdi: 格式）。',
          },
          {
            name: 'state_template',
            label: '状态模板',
            selector: { template: {} },
            helper: '基于模板自定义状态',
          },
          {
            name: 'color',
            label: '颜色模板',
            selector: { template: {} },
          },
        ] as const,
      },
      {
        name: 'action_config',
        type: 'expandable',
        title: '交互配置',
        iconPath: mdiGestureTap,
        schema: (['tap_action', 'hold_action', 'double_tap_action'] as const).map((action) => ({
          name: action,
          selector: {
            ui_action: {
              actions: DEFAULT_ACTIONS,
              default_action: 'none' as const,
            },
          },
        })),
      },
    ] as const
);

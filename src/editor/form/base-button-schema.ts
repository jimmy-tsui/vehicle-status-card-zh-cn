import { mdiGestureTap, mdiPalette } from '@mdi/js';
import memoizeOne from 'memoize-one';

import { CARD_TYPES, BUTTON_TYPE } from '../editor-const';
import { computeOptionalActionSchema } from './actions-config';

export const BASE_BUTTON_SCHEMA = memoizeOne(
  (typeDisabled: boolean) =>
    [
      {
        name: '',
        type: 'grid',
        schema: [
          {
            name: 'button_type',
            label: '按钮类型',
            default: 'default',
            selector: {
              select: {
                mode: 'dropdown',
                options: BUTTON_TYPE,
              },
            },
          },
          {
            name: 'card_type',
            label: '卡片类型',
            default: 'default',
            disabled: typeDisabled,
            selector: {
              select: {
                mode: 'dropdown',
                options: CARD_TYPES,
              },
            },
          },
        ],
      },
    ] as const
);

export const BASE_BUTTON_APPEARANCE_SCHEMA = memoizeOne(
  (secondEntity: string) =>
    [
      {
        name: 'button',
        type: 'expandable',
        iconPath: mdiPalette,
        title: '按钮外观',
        schema: [
          {
            name: '',
            type: 'grid',
            schema: [
              {
                name: 'primary',
                label: '主标题',
                selector: { text: { type: 'text' } },
              },
              {
                name: 'icon',
                label: '图标',
                selector: { icon: {} },
              },
            ],
          },
          {
            name: 'secondary',
            type: 'expandable',
            title: '次要信息',
            expanded: true,
            schema: [
              {
                name: '',
                type: 'grid',
                schema: [
                  {
                    name: 'entity',
                    selector: { entity: {} },
                  },
                  {
                    name: 'attribute',
                    label: '属性',
                    selector: { attribute: { entity_id: secondEntity } },
                  },
                ],
              },
              {
                name: 'state_template',
                label: '状态模板',
                helper: '次要信息状态的模板',
                selector: { template: {} },
              },
            ],
          },
          {
            name: '',
            type: 'expandable',
            title: '高级选项',
            schema: [
              {
                name: 'state_color',
                label: '状态颜色',
                type: 'boolean',
                default: false,
                disabled: secondEntity === undefined || secondEntity === '',
                helper:
                  'Set to true to have icon colored when entity is active, or to show entity picture instead of icon. (entity required)',
              },
              {
                name: 'color',
                label: '图标颜色模板',
                helper: '图标颜色模板',
                selector: { template: {} },
              },
              {
                name: 'picture_template',
                label: '图片与图标模板',
                helper:
                  'Result starts with `http` or "/" will be treated as image URL, otherwise as icon. (this change picked icon)',
                selector: { template: {} },
              },
              {
                name: '',
                type: 'expandable',
                title: '通知徽标选项',
                schema: [
                  {
                    name: 'notify',
                    label: '通知徽标可见性模板',
                    helper: '使用 Jinja2 模板，结果为 `true` 时显示通知徽标',
                    selector: { template: {} },
                  },
                  {
                    name: 'notify_color',
                    label: '通知徽标颜色模板',
                    helper: '使用 Jinja2 模板设置徽标颜色',
                    selector: { template: {} },
                  },
                  {
                    name: 'notify_icon',
                    label: '通知徽标图标模板',
                    helper: '模板结果需为 `mdi:` 格式，用于设置徽标图标',
                    selector: { template: {} },
                  },
                ],
              },
            ],
          },
        ] as const,
      },
    ] as const
);

export const BASE_BUTTON_ACTION_SCHEMA = [
  {
    name: 'button_action',
    type: 'expandable',
    iconPath: mdiGestureTap,
    title: '交互',
    schema: [
      {
        name: 'entity',
        selector: { entity: {} },
        helper: '用于控制按钮启用状态的实体',
      },
      ...computeOptionalActionSchema(),
    ],
  },
] as const;

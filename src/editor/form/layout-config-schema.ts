import { mdiButtonCursor, mdiListBox, mdiPalette } from '@mdi/js';

import { capitalizeFirstLetter } from '../../ha/common/string/capitalize-first-letter';
import { SECTION_KEYS } from '../../types/config/card/layout';

// CARD NAME OPTIONS
export const NAME_SCHEMA = [
  {
    name: 'name',
    label: '卡片名称',
    required: false,
    type: 'string',
  },
] as const;
export const HIDE_CARD_NAME_SCHEMA = (disabled: boolean = false) => {
  return [
    {
      name: 'hide_card_name',
      label: '隐藏卡片名称',
      type: 'boolean',
      default: false,
      disabled,
    },
  ] as const;
};

// SECTION ORDER
export const SECTION_ORDER_SCHEMA = [
  {
    name: 'section_order',
    label: '选择要显示的区块',
    helper: '拖拽调整各区块在卡片上的显示顺序。',
    selector: {
      select: {
        mode: 'dropdown',
        multiple: true,
        reorder: true,
        options: SECTION_KEYS.map((option) => ({
          value: option,
          label: capitalizeFirstLetter(option.replace(/_/g, ' ')),
        })),
      },
    },
  },
] as const;
export const SECTION_ORDER_SCHEMA_EXPAND = [
  {
    title: '区块顺序',
    type: 'expandable',
    flatten: true,
    iconPath: mdiListBox,
    context: { isSectionOrder: true },
    schema: [...SECTION_ORDER_SCHEMA],
  },
] as const;

// BUTTON GRID SECTION
export const BUTTON_GRID_SCHEMA = (swipeDisabled: boolean = false) =>
  [
    {
      name: '',
      type: 'grid',
      flatten: true,
      column_min_width: '140px',
      schema: [
        {
          name: 'swipe',
          label: '支持滑动',
          type: 'boolean',
          default: false,
        },

        ...(!swipeDisabled
          ? [
              {
                name: 'rows',
                label: '行数',
                type: 'integer',
                disabled: swipeDisabled,
                selector: { number: { mode: 'box', min: 1, step: 1 } },
              },
            ]
          : []),

        {
          name: 'columns',
          label: '列数',
          type: 'integer',
          selector: { number: { mode: 'box', min: 1, step: 1 } },
        },
      ],
    },
  ] as const;

export const BUTTON_GRID_LAYOUT_SCHEMA = (swipeDisabled: boolean = false, name: string = '') =>
  [
    {
      name,
      title: '按钮网格选项',
      type: 'expandable',
      flatten: name === '' ? true : false,
      iconPath: mdiButtonCursor,
      schema: BUTTON_GRID_SCHEMA(swipeDisabled),
    },
  ] as const;

// THEME OPTIONS
const THEME_MODE_OPTIONS = ['auto', 'light', 'dark'] as const;
export const CARD_THEME_SCHEMA = [
  {
    title: '主题选项',
    type: 'expandable',
    flatten: true,
    iconPath: mdiPalette,
    schema: [
      {
        name: 'theme_config',
        flatten: false,
        type: 'grid',
        schema: [
          {
            name: 'theme',
            label: '主题',
            default: 'default',
            required: false,
            selector: { theme: { include_default: true } },
          },
          {
            name: 'mode',
            label: '主题模式',
            required: false,
            default: 'auto',
            selector: {
              select: {
                mode: 'dropdown',
                options: THEME_MODE_OPTIONS.map((mode) => ({
                  value: mode,
                  label: capitalizeFirstLetter(mode),
                })),
              },
            },
          },
        ],
      },
    ],
  },
] as const;

const BG_SIZE = ['cover', 'contain', 'auto'] as const;
const BG_POSITION = [
  'left',
  'center',
  'right',
  'top',
  'bottom',
  'top left',
  'top right',
  'bottom left',
  'bottom right',
] as const;
export const CUSTOM_BACKGROUND_SCHEMA = [
  {
    title: '自定义背景',
    name: 'custom_background',
    type: 'expandable',
    flatten: false,
    icon: 'mdi:image-multiple',
    schema: [
      {
        name: 'url',
        label: '背景图片',
        required: false,
        selector: {
          media: {
            accept: ['image/*'] as string[],
            clearable: true,
            image_upload: true,
            hide_content_type: false,
          },
        },
      },
      {
        name: 'size',
        label: '背景尺寸',
        required: false,
        default: 'cover',
        selector: {
          select: {
            mode: 'dropdown',
            custom_value: true,
            options: BG_SIZE.map((size) => ({
              value: size,
              label: capitalizeFirstLetter(size),
            })),
          },
        },
      },
      {
        name: 'position',
        label: '背景位置',
        required: false,
        default: 'center',
        selector: {
          select: {
            mode: 'dropdown',
            options: BG_POSITION.map((position) => ({
              value: position,
              label: capitalizeFirstLetter(position),
            })),
          },
        },
      },
    ],
  },
] as const;

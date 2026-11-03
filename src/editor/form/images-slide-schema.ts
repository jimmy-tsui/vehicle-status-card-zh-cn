import { mdiGestureSwipe, mdiGestureTap, mdiImage } from '@mdi/js';

import { capitalizeFirstLetter } from '../../ha/common/string/capitalize-first-letter';
import { computeOptionalActionSchemaFull } from './actions-config';

export const ImageSchema = [
  {
    name: 'image',
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
    name: 'image_entity',
    required: false,
    selector: { entity: { domain: 'image' } },
  },
  {
    name: 'action',
    required: false,
    type: 'expandable',
    title: '交互',
    iconPath: mdiGestureTap,
    flatten: false,
    schema: [
      {
        name: 'entity',
        selector: { entity: {} },
      },
      ...computeOptionalActionSchemaFull(),
    ],
  },
] as const;

// IMAGES SWIPE SECTION
const SWIPE_EFFECT_OPTIONS = ['slide', 'fade', 'coverflow'] as const;

export const SLIDE_SIZE_SCHEMA = [
  {
    type: 'expandable',
    title: '图片尺寸',
    helper: '此设置决定每张图片的尺寸，从而影响每屏显示的图片数量',
    expanded: true,
    iconPath: mdiImage,
    schema: [
      {
        type: 'grid',
        flatten: true,
        schema: [
          {
            name: 'height',
            helper: '图片高度 (px)',
            default: 150,
            selector: { number: { unit_of_measurement: 'px' } },
          },
          {
            name: 'width',
            helper: '图片宽度 (px)',
            default: 450,
            selector: { number: { unit_of_measurement: 'px' } },
          },
        ],
      },
    ],
  },
] as const;

export const SWIPE_BEHAVIOR_SCHEMA = (data: any) => {
  const isAutoplay = data?.autoplay === true;
  return [
    {
      type: 'expandable',
      title: '滑动行为',
      expanded: false,
      iconPath: mdiGestureSwipe,
      schema: [
        {
          type: 'grid',
          flatten: true,
          schema: [
            {
              name: 'effect',
              default: 'slide',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: SWIPE_EFFECT_OPTIONS.map((value) => ({
                    value,
                    label: capitalizeFirstLetter(value),
                  })),
                },
              },
            },
            {
              name: 'speed',
              label: '速度 (ms)',
              helper: '图片切换动画速度',
              default: 500,
              selector: { number: { min: 100, mode: 'slider', step: 50, unit_of_measurement: 'ms' } },
            },
            {
              name: 'loop',
              label: '循环',
              default: false,
              type: 'boolean',
            },
            {
              name: 'hide_pagination',
              label: '隐藏分页',
              default: false,
              type: 'boolean',
            },
            {
              name: 'autoplay',
              label: '自动播放',
              helper: '自动开始轮播',
              type: 'boolean',
              default: false,
            },
            {
              name: 'delay',
              label: '延迟 (ms)',
              helper: '切换之间的延迟',
              default: 3000,
              selector: { number: { min: 500, mode: 'slider', step: 50, unit_of_measurement: 'ms' } },
              disabled: !isAutoplay,
            },
          ],
        },
      ],
    },
  ] as const;
};

export const IMAGES_LAYOUT_SCHEMA = (data: any, name: string = '') =>
  [
    {
      name,
      title: '图片区块',
      type: 'expandable',
      flatten: name === '' ? true : false,
      iconPath: mdiImage,
      schema: [...SLIDE_SIZE_SCHEMA, ...SWIPE_BEHAVIOR_SCHEMA(data)],
    },
  ] as const;

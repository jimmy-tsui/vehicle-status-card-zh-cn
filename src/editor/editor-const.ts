import { CARD_NAME } from '../constants/const';

const makePanel = (name: string, description: string, icon?: string, helper?: string) => ({
  name,
  description,
  icon,
  helper,
});

const DOC_URL = 'https://github.com/ngocjohn/vehicle-status-card?tab=readme-ov-file#';

export const CONFIG_TYPES = {
  name: '配置类型',
  description: '选择要编辑的配置类型。',
  options: {
    indicators: {
      name: '指示器',
      description: '以指示器形式显示单个或分组的实体状态。',
      doc: `${DOC_URL}indicators-configuration`,
      subpanels: {
        single: makePanel(
          'Single Indicators',
          'Indicators are used to display the state of an entity. You can choose the entity, attribute, and icon to display.'
        ),
        group: makePanel(
          'Group Indicators',
          'Group indicators are used to display the wrapped state of multiple entities. Click on the group to expand and see the individual entities.'
        ),
      },
    },
    range_info: {
      name: '里程信息条',
      description: '为燃油、电量或任意带里程状态的实体显示进度条。',
      doc: `${DOC_URL}range-info-bars`,
      subpanels: {
        rangeIndicator: makePanel(
          'Range Indicator',
          'Display the state of an entity with a range. You can choose the entity, attribute, and icon to display.'
        ),
      },
    },
    images: {
      name: '图片轮播',
      description: '添加轮播图片，并设置自动切换的间隔时间。',
      doc: `${DOC_URL}image-slides`,
    },
    mini_map: {
      name: '小地图',
      description: '在小地图上跟踪 device_tracker 实体。',
      doc: `${DOC_URL}mini-map`,
    },
    buttons: {
      name: '按钮与子卡片',
      description: '配置按钮外观、通知以及默认/自定义卡片。',
      doc: `${DOC_URL}button-card`,
      subpanels: {
        button: makePanel(
          '按钮',
          '在默认卡片与动作类型之间选择按钮类型。默认会打开卡片，动作类型会触发一个动作。'
        ),
        default_cards: makePanel('默认卡片', '要调整区块顺序，请按住手柄拖拽。'),
        custom_cards: makePanel('自定义卡片', '添加要显示的自定义卡片，使用 Lovelace 卡片配置。'),
        tire_card: makePanel('轮胎卡片', '设置轮胎卡片的标题与条目。'),
      },
    },
    layout_config: {
      name: '布局配置',
      description: '设置卡片的布局、主题及各区块的可见性。',
    },
  },
};

const PREVIEW_CONFIG_TYPES = [
  'btn_preview',
  'default_card_preview',
  'card_preview',
  'tire_preview',
  'active_group',

  'active_button',
];

type BUTTON_CARD_ACTIONS =
  | 'add-item'
  | 'add-new-button'
  | 'back-to-list'
  | 'category-add'
  | 'category-back'
  | 'category-delete'
  | 'category-edit'
  | 'custom-card-preview'
  | 'duplicate-button'
  | 'delete-button'
  | 'delete-item'
  | 'edit-button'
  | 'edit-item'
  | 'item-back'
  | 'show-button'
  | 'show-delete'
  | 'category-duplicate'
  | 'yaml-editor'
  | 'hide-button'
  | 'unhide-button'
  | 'yaml-default-card';
export enum ACTIONS {
  ADD_ITEM = 'add-item',
  ADD_NEW_BUTTON = 'add-new-button',
  BACK_TO_LIST = 'back-to-list',
  CATEGORY_ADD = 'category-add',
  CATEGORY_BACK = 'category-back',
  CATEGORY_DELETE = 'category-delete',
  CATEGORY_DUPLICATE = 'category-duplicate',
  CATEGORY_EDIT = 'category-edit',
  CUSTOM_CARD_PREVIEW = 'custom-card-preview',
  DELETE_BUTTON = 'delete-button',
  DELETE_ITEM = 'delete-item',
  DUPLICATE_BUTTON = 'duplicate-button',
  EDIT_BUTTON = 'edit-button',
  EDIT_ITEM = 'edit-item',
  HIDE_BUTTON = 'hide-button',
  ITEM_BACK = 'item-back',
  SHOW_BUTTON = 'show-button',
  SHOW_DELETE = 'show-delete',
  UNHIDE_BUTTON = 'unhide-button',
}

export enum RANGE_ACTIONS {
  DELETE_ITEM = 'delete-item',
  EDIT_ITEM = 'edit-item',
}

const BUTTON_TYPE = [
  { value: 'default', label: '默认' },
  { value: 'action', label: '动作' },
];

const CARD_TYPES = [
  { value: 'default', label: '默认卡片' },
  { value: 'custom', label: '自定义 Lovelace' },
  { value: 'tire', label: '轮胎卡片' },
];

const NEW_BUTTON_CONFIG = {
  button: {
    primary: 'New Button',
    secondary: [{ entity: '', attribute: '', state_template: '' }],
    icon: 'mdi:new-box',
    notify: '',
  },
  button_type: 'default',
  hide_button: false,
  card_type: 'default',
  default_card: [],
  custom_card: [],
  button_action: {
    entity: '',
    // tap_action: { action: 'none' },
    // hold_action: { action: 'none' },
    // double_tap_action: { action: 'none' },
  },
};

enum ALERT_INFO {
  MAPTILER_GET = '如何获取 MapTiler API 密钥？',
  MAPTILER_DOC_LINK = 'https://github.com/ngocjohn/vehicle-status-card/wiki/Mini-map#maptiler-popup',
  MAP_SINGLE_CARD = '配置与 HA 默认地图卡片相同',
  MAP_SINGLE_LINK = 'https://www.home-assistant.io/dashboards/map/',
  IDICATOR_LEGACY = 'More info in the wiki. Or migrate to the new format.',
  INDICATOR_ROW_URL = 'https://github.com/ngocjohn/vehicle-status-card/wiki/Indicators-Configuration',
}

export { BUTTON_TYPE, CARD_TYPES, BUTTON_CARD_ACTIONS, PREVIEW_CONFIG_TYPES, NEW_BUTTON_CONFIG, ALERT_INFO };

export const EDITOR_NAME = `${CARD_NAME}-editor`;

const PANEL_PREFIX = 'panel-';

export enum PANEL {
  RANGE_INFO = `${PANEL_PREFIX}range-info`,
  BASE_BUTTON = `${PANEL_PREFIX}base-button`,
  BUTTON_CARD = `${PANEL_PREFIX}button-card`,
  BUTTON_SEC = `${PANEL_PREFIX}button-card-sec`,
  DEFAULT_CARD = `${PANEL_PREFIX}default-card`,
  EDITOR_UI = `${PANEL_PREFIX}editor-ui`,
  IMAGES_EDITOR = `${PANEL_PREFIX}images-editor`,
  INDICATOR_GROUP = `${PANEL_PREFIX}indicator-group`,
  INDICATOR_SINGLE = `${PANEL_PREFIX}indicator-single`,
  INDICATOR_ROWS = `${PANEL_PREFIX}indicator-rows`,
  INDICATOR_ITEM = `${PANEL_PREFIX}indicator-item`,
  MAP_EDITOR = `${PANEL_PREFIX}map-editor`,
  TIRE_CONFIG = `${PANEL_PREFIX}tire-config`,
  YAML_EDITOR = `${PANEL_PREFIX}yaml-editor`,
  BUTTON_LIST = `${PANEL_PREFIX}button-list`,
  LAYOUT_EDITOR = `${PANEL_PREFIX}layout-editor`,
}

export enum SUB_PANEL {
  ROW_SUB_ITEM = `${PANEL_PREFIX}row-sub-item`,
  ROW_ITEM = `${PANEL_PREFIX}row-item`,
  ROW_SUB_GROUP_ITEM = `${PANEL_PREFIX}row-sub-group-item`,
  BTN_MAIN = `${PANEL_PREFIX}button-card-main`,
  BTN_DEFAULT_CARD = `${PANEL_PREFIX}button-card-default`,
  BTN_DEFAULT_CARD_ITEM = `${PANEL_PREFIX}button-card-default-item`,
  BTN_TIRE_CARD = `${PANEL_PREFIX}button-card-tire`,
}

export enum ELEMENT {
  FORM_BOOLEAN = 'ha-form-boolean',
  FORM_GRID = 'ha-form-grid',
  FORM_EXPANDABLE = 'ha-form-expandable',
  FORM_OPTIONAL_ACTIONS = 'ha-form-optional_actions',
  HA_EXPANSION_PANEL = 'ha-expansion-panel',
  CHIP_INPUT = 'ha-input-chip',
  HA_BUTTON_MENU = 'ha-button-menu',
  HA_PICTURE_UPLOAD = 'ha-picture-upload',
}

export enum SELECTOR {
  OPTIONAL_BUTTON_TRIGGER = 'ha-form-optional_actions$ha-button[slot="trigger"]',
  HA_CHIP_SET = 'ha-selector$ha-selector-select$ha-chip-set',
  SECTION_ORDER_CHIPS = 'ha-selector$ha-selector-select$ha-chip-set ha-input-chip',
}

export enum HA_EVENT {
  EXPANSION_WILL_CHANGE = 'expanded-will-change',
  EXPANSION_CHANGED = 'expanded-changed',
}

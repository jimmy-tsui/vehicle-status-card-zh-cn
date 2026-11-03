[![hacs][hacs-default]][hacs-default-link] [![hacs][hacs-validate]][hacs-url] ![Github last commit][git-last-commit-badge] ![git-download-all][git-download-all-badge] ![git-download-latest][git-download-latest-badge]

# 🚘 Vehicle Status Card（车辆状态卡片 · 中文汉化版）

> 本仓库为 **Vehicle Status Card**（原版：https://github.com/ngocjohn/vehicle-status-card ）的中文化分支：
> ① 编辑器与卡片界面中文；② 内置「国内 / 海外」地图源切换；③ 中文文档。
> 原版英文文档见 [README.en.md](README.en.md)。

<a href="#"><img src="https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/vehicle-status-header.gif" style="border-radius: 8px"></a>

---

这是为 Home Assistant 设计的 **车辆状态卡片**，用于展示车辆的详细信息：头部指示器、里程/续航进度条、交互按钮，以及跟踪 `device_tracker` 实体的小地图。卡片支持高度自定义，可展示多种类型的数据与布局。

## 特性

- **指示器（Indicators）**：在卡片头部以单个或分组的实体状态展示。
- **里程信息条（Range Info）**：为油量、电量或任意带「里程/范围」状态的实体显示进度条。
- **图片轮播（Images）**：上传或添加图片，可设置自动切换间隔。
- **小地图（Mini Map）**：内置地图，实时跟踪 `device_tracker` 实体。
- **按钮卡片（Button Cards）**：设置主/次按钮、图标、通知徽标，以及默认/自定义子卡片，用于与车辆实体交互。
- **布局配置（Layout）**：自定义布局、主题、行/列数与滑动（swipe）行为。
- **🇨🇳 国内地图源**：内置 **天地图** 源，国内网络下加载更流畅（详见 [小地图 - 地图源](#小地图-mini-map)）。

## 目录

- [安装](#安装)
- [使用 UI 编辑器配置](#使用-ui-编辑器配置)
- [指示器配置](#指示器配置-indicators)
- [里程信息条](#里程信息条-range-info)
- [图片轮播](#图片轮播-images)
- [小地图（含国内地图源）](#小地图-mini-map)
- [按钮卡片](#按钮卡片-button-card)
- [常见问题与提示](#常见问题与提示)

---

# 安装

## 通过 HACS 安装（推荐）

1. 若未安装 HACS，请参考 <https://hacs.xyz/docs/use/#getting-started-with-hacs>。
2. 在 Home Assistant 中打开 HACS → 「前端」→ 右下角「+」添加自定义仓库：
   - 仓库地址：`https://github.com/jimmy-tsui/vehicle-status-card-zh-cn`
   - 类别：**插件（Plugin / Frontend）**
3. 搜索 `Vehicle Status Card` 并点击下载。
4. 强制刷新页面：`Ctrl` + `F5`（或 `Shift` + `⌘` + `R`）。
5. 在仪表盘中添加「Vehicle Status Card」卡片。

## 手动安装

1. 下载构建产物：`build/vehicle-status-card.js`（或从 Releases 下载最新的 `vehicle-status-card.js`）。
2. 将文件放到 Home Assistant 的 `config/www` 目录（没有就创建 `www` 文件夹）。
3. 打开「配置 → 仪表盘 → 资源」（找不到「资源」请在账户设置中开启高级模式），新增资源：
   - Url = `/local/vehicle-status-card.js`
   - 资源类型 = `module`
4. 强制刷新页面后添加卡片。

## 本地开发/构建

```bash
pnpm install
pnpm build      # lint + rollup，产物在 build/vehicle-status-card.js
```

---

<!--README-CONTENT-START-->

# 使用 UI 编辑器配置

本卡片完全支持 Home Assistant 的 **UI 卡片编辑器**，无需手写 YAML。

新增卡片时，编辑器提供「生成示例（Generate Example）」功能：

- 从你的 Home Assistant 中随机挑选实体；
- 生成一份完整示例配置；
- 提供可直接预览的真实效果，帮助快速上手。

![YAML-Config](https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/config-example.gif)

---

# 指示器配置（Indicators）

**指示器行（Indicator Rows）** 用更灵活的方式组织卡片头部的指示器 —— 支持把指示器按 **行** 分组，每一行可以放单个实体或实体分组。

| 名称        | 类型     | 必填      | 说明                                                           |
| ----------- | -------- | --------- | -------------------------------------------------------------- |
| `row_items` | 对象数组 | 必填      | 条目数组，条目类型：`entity`（实体）、`group`（分组）。         |
| `alignment` | 字符串   | 可选      | 行内条目对齐方式（`default`、`start`、`center`、`end`、`justify`） |
| `no_wrap`   | 布尔     | 可选      | 禁止换行；条目单行排列并支持横向滚动。                         |

> 旧版 `indicators.single / indicators.group` 自 v1.16.0 起已弃用，请改用 `row_items`。

![Indicators Rows](https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/config-indicators-row.gif)

---

# 里程信息条（Range Info）

里程信息条用于展示「有量程」的实体进度，例如油量、电量或剩余续航里程，便于一眼掌握关键指标。

- **电量等级（Energy Level）**：显示剩余电量/油量，可为百分比或具体数值（公里、升）。
- **里程等级（Range Level）**：显示当前剩余能量可行驶的距离，对新能源车尤其有用。
- **充电状态实体（Charging Status）**：可选，显示当前是否在充电。
- **充电目标线（Charge Target Line）**：在条上标出目标电量（如 80%）。
- **进度颜色（Progress Color）**：自定义进度条颜色（如满=绿、中=黄、低=红）。

支持同时配置多个进度条（主电池、副电池、油箱、续航等），并可选择 **row（横向）/ column（纵向）** 布局。

![Range info bars](https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/config-range-info.gif)

---

# 图片轮播（Images）

上传或添加多张图片，设置自动切换间隔与方向，即可在卡片内轮播展示。

---

# 小地图（Mini Map）

小地图在卡片内实时显示 `device_tracker` 实体的位置，可用于监控车辆或其它可定位设备。

- **实时跟踪**：使用任意 `device_tracker` 实体显示实时位置。
- **多实体支持**：同一张地图上可跟踪多个设备。
- **自定义缩放**：设置默认缩放级别。
- **主题适配**：自动跟随仪表盘明暗主题（light / dark / auto）。

![Config mini map](https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/config-mini-map.gif)

## 地图源（国内 / 海外切换）⭐ 中文版新增

> 原版将底图硬编码为 OpenFreeMap（海外服务器，国内加载较慢）。
> 本分支新增 `map_source` 配置项，可在 **编辑器 → 底图配置** 中直接切换：

| `map_source`    | 说明                                                   | 是否需要密钥            |
| --------------- | ------------------------------------------------------ | ---------------------- |
| `openfreemap`   | 默认。OpenFreeMap 海外矢量瓦片，全球可用，无需密钥。    | 否                     |
| `tianditu`      | **天地图**（国内）。瓦片来自 `tianditu.gov.cn`，国内加载快。 | 是（浏览器端 `tk`）    |

当选择「天地图」时，填入你的 **天地图浏览器端密钥（tk）**：

1. 在 [天地图控制台](https://console.tianditu.gov.cn/) 注册并创建应用，选择 **「浏览器端」** 类型；
2. 复制生成的密钥（tk）；
3. 在卡片编辑器 → 底图配置 → 地图源中选择「天地图」，并粘贴密钥保存。

> 说明：天地图免费额度约 **1 万次/天**（按瓦片请求计），个人使用完全足够；天地图坐标即为 WGS84，与设备的 GPS 坐标一致，无需偏移。地址反查（点地图显示地址）同样优先使用天地图地理编码（国内网络更稳）。

示例 YAML：

```yaml
type: custom:vehicle-status-card
mini_map:
  device_tracker: device_tracker.your_device
  map_source: tianditu          # 或 openfreemap（默认）
  tianditu_key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  map_zoom: 14
  map_height: 150
  enable_popup: true
```

## MapTiler（可选，用于高清弹窗大图）

原版小地图弹窗使用 MapTiler 瓦片。若需更高质量的弹窗地图：

1. 免费注册并创建密钥：<https://www.maptiler.com/> / <https://cloud.maptiler.com/account/keys/>
2. 把密钥粘贴到「小地图配置 → MapTiler API 密钥（可选）」。
3. 保存后即可启用 **独立大图卡片**（Single map card）模式。

> 提示：内联小地图的底图由 `map_source` 决定（可不填 MapTiler 密钥）；MapTiler 密钥仅用于弹窗大图与地址反查的优先来源。

---

# 按钮卡片（Button Card）

按钮卡片用于与车辆实体交互或监控。每个按钮可自定义主标签、次要信息、图标与通知徽标。

- **主标签（Primary Label）**：按钮主文字，通常表示动作或实体（如「锁车门」）。
- **次要信息（Secondary Info）**：主标签下方的补充信息（如「已锁定」）。
- **图标（Icon）**：自定义按钮图标。
- **通知（Notifications）**：按条件显示通知徽标（如低油量提醒）。
- **动作类型（Action Type）**：支持 `tap_action`（单击）、`hold_action`（长按）、`double_tap_action`（双击）。

支持的动作为 Home Assistant 标准动作：`more-info`、`toggle`、`call-service`、`navigate`、`url`。

![Config button](https://raw.githubusercontent.com/ngocjohn/vehicle-status-card/main/assets/config-button.gif)

---

# 常见问题与提示

- **地图加载慢 / 白屏**：国内网络请将 `map_source` 设为 `tianditu` 并填入 `tianditu_key`。
- **编辑器文字仍显示英文**：卡片界面内的绝大多数提示跟随 Home Assistant 界面语言；若 HA 界面为中文，则卡片运行时提示自动为中文。本次汉化覆盖了编辑器中的硬编码英文。
- **HACS 下载后需要强刷**：安装新版本后请 `Ctrl + F5` 强制刷新，避免旧脚本缓存。
- **原版**：https://github.com/ngocjohn/vehicle-status-card

---

[hacs-default]: https://img.shields.io/badge/HACS-Default-orange.svg
[hacs-default-link]: https://github.com/hacs/integration
[hacs-validate]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg
[hacs-url]: https://github.com/hacs/integration
[git-last-commit-badge]: https://img.shields.io/github/last-commit/jimmy-tsui/vehicle-status-card-zh-cn/main
[git-download-all]: https://img.shields.io/github/downloads/jimmy-tsui/vehicle-status-card-zh-cn/total
[git-download-latest]: https://img.shields.io/github/downloads/jimmy-tsui/vehicle-status-card-zh-cn/latest/total

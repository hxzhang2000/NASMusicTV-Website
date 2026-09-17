/**
 * 官网截图清单（唯一数据源）
 *
 * 图片来源有三种，前端按优先级取：
 *   1) `web/public/screens/index.json` 清单（可写本地文件名，也可写图床 / CDN / GitHub 外链）
 *      —— 当前用的就是这种：16 张图已自托管于 web/public/screens/（本地文件名），不再使用 GitHub 外链。
 *   2) `web/public/screens/` 下的本地图片（自动识别 .png / .jpg / .jpeg / .webp）；
 *   3) 省事别名（见 nameAliases）：首页.png / 01.png / 01-首页.jpg 等同样能识别。
 * 也可以把一堆任意命名的截图丢进某个目录，跑 `bash web/scripts/place-screenshots.sh <目录>`
 * 自动改名归档并生成清单。
 * 未提供（或文件名写错）的图片不会破图，对应位置渲染空帧并只显示界面名。
 *
 * 现状（已定稿）：16 张界面截图全部收齐 —— 01-dashboard … 16-remote。
 *   - 首页主视觉：不再单独提供 00-hero.png，自动复用 01-dashboard。
 *   - 社交分享图：不再单独提供 00-share-cover.png，index.html 的 og:image 复用本地 01-dashboard.jpg。
 *   - 手机版 5 张为可选项（本轮不提供），后续补图会自动出现 TV / 手机 切换按钮。
 * 以后想换成专门的横版大图，只需把文件放进目录并按 00-hero.png / 00-share-cover.png 命名，
 * 或在 index.json 里加对应槽位，无需修改任何代码。
 */

export const SCREENSHOT_DIR = `${import.meta.env.BASE_URL}screens/`;

export interface ShotSpec {
  /** 需要放入 public/screens/ 的文件名 */
  file: string;
  /** 图片规格与实际尺寸说明 */
  spec: string;
  /** 画面内容说明 */
  note: string;
  /** 可选：手机端版本文件名（提供后卡片右上角出现 TV / 手机 切换） */
  mobileFile?: string;
  mobileSpec?: string;
  /**
   * 可选：竖屏截图（如手机遥控页）。为 true 时截图位改为 9:16 竖屏框，
   * 并按手机比例居中展示，避免 16:9 框里两侧大片留白。
   */
  portrait?: boolean;
  /**
   * 可选：备用文件名。主文件缺失时自动改用这里的图（按顺序取第一个存在的），
   * 例如首页主视觉直接复用首页仪表盘截图。
   */
  fallbackFiles?: string[];
}

/** 支持的图片扩展名：同一截图位放任意一种后缀都会被自动识别 */
export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

/** 去掉扩展名得到「截图槽位名」，用于比较与探测 */
export const baseName = (file: string): string => file.replace(/\.(png|jpe?g|webp)$/i, "");

/**
 * 文件名别名：允许用「更省事」的名字放图，效果与规范名完全一致。
 * 例如 首页.png、01.png、01-首页.jpg 都会被当作 01-dashboard.png 使用。
 * 全部为「去掉扩展名后完全相等」的比较，不做模糊匹配，避免误判。
 */
export const nameAliases: Record<string, string[]> = {
  "00-hero": ["00", "hero", "主视觉", "首页大图"],
  "00-share-cover": ["share-cover", "分享封面", "分享图"],
  "01-dashboard": ["01", "1", "01-首页", "首页", "01-home", "首页仪表盘"],
  "02-player": ["02", "2", "02-正在播放", "正在播放", "播放页"],
  "03-karaoke": ["03", "3", "03-K歌", "K歌", "卡拉OK"],
  "04-mtv": ["04", "4", "04-MTV", "MTV"],
  "05-visualizer": ["05", "5", "05-可视化", "可视化", "可视化舞台"],
  "06-library": ["06", "6", "06-曲库", "曲库"],
  "07-discover": ["07", "7", "07-发现", "发现"],
  "08-search": ["08", "8", "08-搜索", "搜索"],
  "09-weather-radio": ["09", "9", "09-天气电台", "天气电台", "天气"],
  "10-detail": ["10", "10-艺术家详情", "艺术家详情", "详情", "详情页"],
  "11-queue": ["11", "11-播放队列", "播放队列", "队列"],
  "12-mine": ["12", "12-我的", "我的", "我的页"],
  "13-settings": ["13", "13-设置", "设置", "设置页"],
  "14-connection": ["14", "14-连接", "连接", "连接页", "服务器连接", "服务器配置"],
  "15-about": ["15", "15-关于", "关于", "关于页"],
  "16-remote": ["16", "16-遥控", "遥控", "遥控页", "手机遥控", "手机遥控页"],
  "01-dashboard-mobile": ["01-手机", "首页-手机"],
  "02-player-mobile": ["02-手机", "正在播放-手机"],
  "03-karaoke-mobile": ["03-手机", "K歌-手机"],
  "06-library-mobile": ["06-手机", "曲库-手机"],
  "12-mine-mobile": ["12-手机", "我的-手机"],
};

/** 展开某个槽位对应的全部扩展名候选（.png → .png/.jpg/.jpeg/.webp） */
export const fileVariants = (file: string): string[] =>
  IMAGE_EXTENSIONS.map((ext) => baseName(file) + ext);

/** 别名候选：只探测最常见的 .png / .jpg 两种后缀，避免首屏请求过多 */
export const aliasVariants = (file: string): string[] =>
  (nameAliases[baseName(file)] ?? []).flatMap((name) => [name + ".png", name + ".jpg"]);

/** 首页主视觉（Hero 大图）：不再单独提供，首页自动复用首页仪表盘截图 */
export const heroShot: ShotSpec = {
  file: "00-hero.png",
  spec: "不再单独提供；复用 01-dashboard（首页仪表盘，接近 16:9 最佳）",
  note:
    "首页 Hero 主视觉。已决定不再单独提供此图：首页自动复用 01-dashboard（首页仪表盘截图）。若以后放入本文件，会自动顶替为专用主视觉。回退顺序：01-dashboard → 02-player → 03-karaoke → 04-mtv → 05-visualizer → 06-library → 07-discover → 08-search → 09-weather-radio → 10-detail → 11-queue → 12-mine → 13-settings → 14-connection → 15-about → 16-remote。",
  fallbackFiles: [
    "01-dashboard.png",
    "02-player.png",
    "03-karaoke.png",
    "04-mtv.png",
    "05-visualizer.png",
    "06-library.png",
    "07-discover.png",
    "08-search.png",
    "09-weather-radio.png",
    "10-detail.png",
    "11-queue.png",
    "12-mine.png",
    "13-settings.png",
    "14-connection.png",
    "15-about.png",
    "16-remote.png",
  ],
};

/** 社交分享图（微信 / 微博 / Twitter 卡片缩略图）：不再单独提供，复用首页截图 */
export const shareCover: ShotSpec = {
  file: "00-share-cover.png",
  spec: "不再单独提供；社交分享图复用 01-dashboard（原建议 1200×630）",
  note:
    "社交分享封面。已决定不再单独提供，`index.html` 的 og:image / twitter:image 已指向本地 `/screens/01-dashboard.jpg`；若以后放入本文件可按需改回专用封面。",
  fallbackFiles: ["01-dashboard.png"],
};

/** 各界面截图，key 与 site.tsx 中 screens[].name 一一对应（均已于本轮收齐） */
export const screenShots: Record<string, ShotSpec> = {
  首页仪表盘: {
    file: "01-dashboard.png",
    spec: "已收齐（1568×872，接近 16:9）",
    note:
      "首页：品牌栏与导航（首页 / 正在播放 / 曲库 / 我的 / 播放队列 / 设置）、「正在播放」卡片（鸿雁 / 呼斯楞）、曲库 / 搜索 / 播放队列三个快捷入口、下方「最近播放」封面网格。",
    mobileFile: "01-dashboard-mobile.png",
    mobileSpec: "2340×1080（手机横屏，可选）",
  },
  播放页: {
    file: "02-player.png",
    spec: "已收齐（1568×883）",
    note:
      "播放页：左侧封面 + 歌手与「信息 / 已下载」标签、上一首 / 暂停 / 下一首 / 循环按钮、频谱 / K 歌 / MTV 按钮、右侧两行逐字歌词（当前字高亮）、0:46 / 4:19 进度条、右上角「内嵌 / 本地 / 在线 / 缓存 / 逐字 / A+ / 定时-」标签行。",
    mobileFile: "02-player-mobile.png",
    mobileSpec: "2340×1080（手机横屏，可选）",
  },
  "K 歌页": {
    file: "03-karaoke.png",
    spec: "已收齐（1568×883）",
    note:
      "K 歌页：顶部居中的歌名 + 歌手（鸿雁 / 呼斯楞）、中间半透明毛玻璃歌词卡（两行逐字歌词，当前字变黄高亮）、左下角返回、底部中央 上一首 / 绿色大播放钮 / 下一首、底部细渐变进度条、右侧 调·原调 / 速·原速 / 原唱 / 质量🔒 四个胶囊按钮。",
    mobileFile: "03-karaoke-mobile.png",
    mobileSpec: "2340×1080（手机横屏，可选）",
  },
  "MTV 播放页": {
    file: "04-mtv.png",
    spec: "已收齐（1568×883，带左右黑边的全屏视频帧）",
    note:
      "MTV 播放页：全屏 MV 视频帧铺满画面、正中发光歌名（鸿雁）与其下方逐字歌词、左下角圆形返回、底部中央 上一首 / 暂停 / 下一首 三个圆按钮、右下角「歌词」「切换」两个圆角方按钮、最底部细渐变进度条。",
  },
  可视化舞台: {
    file: "05-visualizer.png",
    spec: "已收齐（1568×883）",
    note:
      "可视化舞台：左上角圆形关闭（×）按钮、顶部居中半透明胶囊标题（当前句歌词）、占满屏幕的可视化效果（数学函数散点曲线：坐标轴 / 网格 / 刻度 + 右侧「y sin(x/2) sin(x/3)」图例）、左下角歌名 + 歌手、最底部一排进度圆点指示器（当前点青蓝高亮）。",
  },
  曲库页: {
    file: "06-library.png",
    spec: "已收齐（1568×830）",
    note:
      "曲库页：「曲库」大标题 + 分类 Tab（搜索 / 发现 / 专辑 / 艺术家（选中）/ 歌曲 / 风格 / 年代 / 电台）+ 右侧「搜索歌曲、专辑…」输入框、计数「艺术家 (1960)」、当前字母 H 与右侧竖排 A–Z 字母索引、下方艺术家圆角封面网格。",
    mobileFile: "06-library-mobile.png",
    mobileSpec: "2340×1080（手机横屏，可选）",
  },
  发现页: {
    file: "07-discover.png",
    spec: "已收齐（1568×831）",
    note:
      "发现页：Tab 选中「发现」、六行筛选标签组（语种 / 纯音乐 / 年代 / 情怀 / 风格 / 主题，每行左侧分组名 + 一排胶囊按钮，默认「所有」为青绿选中态），从粤语、钢琴到驾车、雨天等场景组合一键筛选。",
  },
  搜索页: {
    file: "08-search.png",
    spec: "已收齐（1568×866）",
    note:
      "搜索页：搜索框已输入「赵雷」并带清除 ×、「搜索来源」五个青绿点亮胶囊（NAS / 网络 / 百度 / Jamendo / 本地）+「全部点亮」、「全部播放」/「加入队列」+ 计数「68 首」、结果行（序号 + 封面 + 歌名 + 「网络」来源标签 + 歌手 + 0:00 与下载 / 收藏 / 队列 / 添加四个行内图标）。",
  },
  天气电台: {
    file: "09-weather-radio.png",
    spec: "已收齐（1568×830）",
    note:
      "天气电台：「← 返回」+「天气电台」大标题 + 右上「▶ 播放全部」、天气卡片（图标 + 30°C + Beijing · 少云）、右侧两行天气场景胶囊（阳光·轻音乐 / 多云·民谣（选中）/ 雨天·钢琴 / 雪天·温暖 / 风天·激昂 / 雷雨·史诗）、「电台歌曲 (10)」计数与歌曲行（序号 01 / 02 + 封面 + 歌名 + 「网络」标签 + 歌手 + 0:00 与下载 ↓）。",
  },
  详情页: {
    file: "10-detail.png",
    spec: "已收齐（1560×729）",
    note:
      "艺术家详情页：「← 返回」+ 艺术家名大标题「呼斯楞」+ 右上「全部播放」青绿胶囊 /「加入队列」+「29 首」、左侧大号圆形头像占位（音符符号）、右侧歌曲列表（序号 + 方形封面 + 歌名 +「已下载」青绿 /「百度」黄色标签 + 歌手名 + 0:00 与 ♡ / ✓ / ↓ / ≡ / + 行内图标）。",
  },
  队列页: {
    file: "11-queue.png",
    spec: "已收齐（1560×830）",
    note:
      "播放队列：左侧当前曲目大封面卡（卡下居中歌名「鸿雁」）、右侧「播放队列」大标题 + 计数「3 首」+「清空」按钮、队列行（01 行为正在播放项，整行青绿半透明底 + 序号与歌名青绿 +「已下载」蓝青标签；02 / 03 行「网络」绿色标签；行尾 0:00 与 ↓ 下载 / ↑ 上移 / × 移除）。",
  },
  我的页: {
    file: "12-mine.png",
    spec: "已收齐（1568×830）",
    note:
      "我的页：上方当前曲目播放条（封面 + ▶ + 歌名「主角」+「网络」标签 + 歌手「王菲」+ 0:00 与 下载 ↓ / 红心 ♥ / 队列 ≡ / 添加 + 四图标）、下方「本地歌单」大标题 + 青绿「+ 新建歌单」按钮、歌单行（音符图标 +「我喜欢的」+「1 首」+ 行尾「播放」（青绿）/「重命名」/「移除」（黄））。",
    mobileFile: "12-mine-mobile.png",
    mobileSpec: "2340×1080（手机横屏）或 1080×2340（手机竖屏，可选）",
  },
  设置页: {
    file: "13-settings.png",
    spec: "已收齐（1568×862）",
    note:
      "设置页：左侧设置导航卡片（青绿齿轮方块 +「设置」+ 通用（选中）/ 播放 / 下载 / 服务器）、右侧「通用」「语言」小标题与「选择应用界面语言」、语言选项（跟随系统（选中）/ 中文 / English）、「暗色主题 · 使用深色背景保护视力」与「界面动画」两张开关卡片（右侧青绿「✓ 开启」）。",
  },
  连接页: {
    file: "14-connection.png",
    spec: "已收齐（1560×744，IP 已用示例地址）",
    note:
      "连接页：页面正中「服务器配置」卡片（青绿圆角方块图标 + 副标题「选择您的 NAS 音乐后端类型」）、「服务器类型」五种后端一行平铺（Jellyfin（青绿选中胶囊）/ Navidrome / Subsonic / 道理鱼 / 飞牛）、「服务器地址」输入框（示例 http://192.168.8.183:8096）+ 青绿「连接测试」按钮。",
  },
  关于页: {
    file: "15-about.png",
    spec: "已收齐（1560×734）",
    note:
      "关于页：左侧设置导航卡片（缓存管理 / 网络检测 / 网盘 / 数据管理 / 关于（青绿高亮选中））、右侧青绿「关于」大标题 + 信息表（应用名称 NAS Music TV / 版本 v2.32.5 / 构建类型 release / 开源协议 GPL v3 / 支持后端 Jellyfin · Navidrome · Subsonic · 道理鱼 · 飞牛 / 内容类型 主媒体）。",
  },
  手机遥控页: {
    file: "16-remote.png",
    spec: "已收齐（1080×2340，手机竖屏）",
    note:
      "手机遥控页：顶部居中音符图标 + 青绿「NASMusicTV 遥控」标题、「播放队列」（青绿下划线，选中）与「搜索」双 Tab、「正在播放」圆角卡片（「彩虹下面 赵雷」+「（网络）」）、队列行卡片（歌名 + 歌手 + 红色「NET」标签；右侧灰色圆角按钮 首行 ↓ 下载，其余 ↑ 上移 / ↓ 下移，最右红色 × 移除）。",
    portrait: true,
  },
};

/** 全部期望的截图文件名，用于自动探测是否已就位 */
export const allScreenshotFiles: string[] = Array.from(
  new Set([
    heroShot.file,
    shareCover.file,
    ...Object.values(screenShots).flatMap((s) =>
      s.mobileFile ? [s.file, s.mobileFile] : [s.file]
    ),
  ])
);

/** 截图清单表（界面预览页底部展示） */
export const screenshotTable = Object.entries(screenShots).map(([name, shot]) => ({
  name,
  ...shot,
}));

/** 必需文件：16 张界面截图（本轮已全部收齐） */
export const requiredScreenshotFiles: string[] = Object.values(screenShots).map((s) => s.file);

/** 本轮明确不再单独提供的文件（主视觉、分享封面）——缺失不计入「待补」 */
export const skippedScreenshotFiles: string[] = [heroShot.file, shareCover.file];

/** 可选文件（手机版截图，提供后卡片右上角出现 TV / 手机 切换；本轮未提供） */
export const optionalScreenshotFiles: string[] = Object.values(screenShots)
  .map((s) => s.mobileFile)
  .filter((f): f is string => typeof f === "string");

export const screenshotSummary = {
  /** 全部截图位（含已取消的两个与可选手机版） */
  total: allScreenshotFiles.length,
  /** 必需：16 张界面截图 */
  required: requiredScreenshotFiles.length,
  /** 可选：手机版截图 */
  optional: optionalScreenshotFiles.length,
  /** 已取消单独提供：主视觉 + 分享封面（自动复用首页截图） */
  skipped: skippedScreenshotFiles.length,
};

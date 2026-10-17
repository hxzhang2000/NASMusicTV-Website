/**
 * 可视化特效截图清单（单一数据源）。
 *
 * - enum：应用内 VisualizerTheme 枚举名，同时也是截图文件名；
 *   资源位于 web/public/effects/<枚举名>.jpg，线上 URL 为 /effects/<枚举名>.jpg
 * - name：页面展示用的中文效果名
 *
 * 「枚举名 → 中文效果名」对照只在本文件出现一处，页面与灯箱均从此处取文案。
 * 计数一律用 effects.length 推导，不要在页面上写死套数。
 */
export interface EffectShot {
  /** 应用内枚举名（与截图文件名一致，如 SEASIDE） */
  enum: string;
  /** 页面展示用中文效果名（如 海边） */
  name: string;
}

/** 特效截图目录（站点绝对路径） */
export const EFFECTS_DIR = "/effects/";

export const effects: EffectShot[] = [
  { enum: "BEAT_FIREWORK", name: "节拍烟花" },
  { enum: "BIRDS_FLOCK", name: "鸟群" },
  { enum: "CIRCULAR_RING", name: "频谱环" },
  { enum: "CONCENTRIC_GEARS", name: "齿轮" },
  { enum: "CONSTELLATION", name: "星座" },
  { enum: "DESERT_SMOKE", name: "大漠孤烟" },
  { enum: "DNA", name: "DNA 双螺旋" },
  { enum: "ECG_WAVE", name: "心跳" },
  { enum: "HYPNOTIC_FUNCTION", name: "催眠" },
  { enum: "LIGHT_BEAMS", name: "光轴" },
  { enum: "LIQUID_GRID", name: "液态网格" },
  { enum: "LIQUID_RIPPLE", name: "液态涟漪" },
  { enum: "LYRICS_DOT_MATRIX", name: "歌词点阵" },
  { enum: "MATRIX_RAIN", name: "数字雨" },
  { enum: "MILKDROP_FEEDBACK", name: "反馈残像" },
  { enum: "MOLECULE", name: "分子" },
  { enum: "MOONLIT", name: "明月" },
  { enum: "ORBITAL_RINGS", name: "太阳系" },
  { enum: "RADAR_GRID", name: "雷达" },
  { enum: "SEASIDE", name: "海边" },
  { enum: "SNOW_CEDAR", name: "雪松" },
  { enum: "STAR_TRAILS", name: "星空星轨" },
  { enum: "TRIPOD_FOG", name: "迷雾之战" },
  { enum: "VINTAGE_TV", name: "怀旧" },
  { enum: "WORLD", name: "世界地球" },
];

/** 单张截图地址：/effects/SEASIDE.jpg */
export const effectSrc = (shot: EffectShot): string => `${EFFECTS_DIR}${shot.enum}.jpg`;

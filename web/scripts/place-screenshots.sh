#!/usr/bin/env bash
#
# 一键归档官网截图：把手里的一堆截图（任意文件名）自动改名放进 web/public/screens/
#
# 用法（在项目根目录执行）：
#   bash web/scripts/place-screenshots.sh ~/Downloads            # 复制并改名 + 生成清单
#   bash web/scripts/place-screenshots.sh ~/Downloads --dry-run   # 只预览匹配结果，不动文件
#   bash web/scripts/place-screenshots.sh web/public/screens      # 已在目标目录里就直接原地改名
#
# 匹配规则（两步）：
#   1) 关键字匹配：文件名去掉扩展名后命中别名表（首页 / 01 / dashboard → 01-dashboard）
#   2) 顺序兜底：仍没匹配上的图片，按文件名排序依次填入还空着的 01~16 槽位（会给出警告）
#
# 跑完后：打开 web/public/screens/ 核对，然后点左上方构建按钮。
# 以后手动增删图片，重跑本脚本（刷新 index.json）或删掉 index.json 即可。
#
set -uo pipefail

if [ "${BASH_VERSINFO[0]:-0}" -lt 4 ]; then
  echo "[错误] 需要 bash 4 及以上（macOS 自带 3.2）。"
  echo "       macOS 可先 brew install bash，再用 /opt/homebrew/bin/bash web/scripts/place-screenshots.sh <目录>"
  exit 1
fi

SRC="${1:-}"
DRY=0
if [ "${2:-}" = "--dry-run" ]; then DRY=1; fi

TARGET_DIR="web/public/screens"

if [ -z "$SRC" ]; then
  echo "用法: bash web/scripts/place-screenshots.sh <截图所在目录> [--dry-run]"
  exit 1
fi
if [ ! -d "$SRC" ]; then
  echo "[错误] 目录不存在: $SRC"
  exit 1
fi

mkdir -p "$TARGET_DIR" || exit 1

# 槽位表：槽位名|关键字…（= 开头表示「完全相等」，其余为「包含即命中」）
SLOTS='00-hero|=00-hero|hero|主视觉|首页大图
00-share-cover|=00-share-cover|sharecover|分享封面|分享图
01-dashboard|=01-dashboard|=01|=1|首页|仪表盘|dashboard
02-player|=02-player|=02|=2|正在播放|播放页|player
03-karaoke|=03-karaoke|=03|=3|k歌|卡拉ok|karaoke
04-mtv|=04-mtv|=04|=4|mtv
05-visualizer|=05-visualizer|=05|=5|可视化|visualizer
06-library|=06-library|=06|=6|曲库|library
07-discover|=07-discover|=07|=7|发现|discover
08-search|=08-search|=08|=8|搜索|search
09-weather-radio|=09-weather-radio|=09|=9|天气|weather
10-detail|=10-detail|=10|艺术家详情|详情|detail
11-queue|=11-queue|=11|播放队列|队列|queue
12-mine|=12-mine|=12|=我的|我的页|mine
13-settings|=13-settings|=13|设置|settings
14-connection|=14-connection|=14|连接|服务器配置|服务器连接|connection
15-about|=15-about|=15|关于|=about
16-remote|=16-remote|=16|遥控|remote
01-dashboard-mobile|=01-dashboard-mobile|01-mobile|01-手机|首页-手机
02-player-mobile|=02-player-mobile|02-mobile|02-手机|正在播放-手机
03-karaoke-mobile|=03-karaoke-mobile|03-mobile|03-手机|k歌-手机
06-library-mobile|=06-library-mobile|06-mobile|06-手机|曲库-手机
12-mine-mobile|=12-mine-mobile|12-mobile|12-手机|我的-手机'

norm() {
  printf '%s' "$1" \
    | tr 'A-Z' 'a-z' \
    | sed -e 's/^screenshot//' -e 's/^screen//' -e 's/^img//' -e 's/^image//' \
          -e 's/微信图片//g' -e 's/截屏//g' -e 's/截图//g' \
          -e 's/[ _()（）【】\[\]-]//g'
}

declare -A DONE=()   # 来源文件 → 槽位名
declare -A SKIP=()   # 需要忽略的来源文件（同一槽位被多张图命中时的后来者）

# 某槽位是否已被占用
slot_used() {
  local want="$1" k
  if [ "${#DONE[@]}" -eq 0 ]; then return 1; fi
  for k in "${!DONE[@]}"; do
    if [ "${DONE[$k]}" = "$want" ]; then return 0; fi
  done
  return 1
}

# 收集源图片
FILES=()
while IFS= read -r f; do
  if [ -z "$f" ]; then continue; fi
  case "$(printf '%s' "$f" | tr 'A-Z' 'a-z')" in
    *.png|*.jpg|*.jpeg|*.webp) FILES+=("$f") ;;
  esac
done < <(find "$SRC" -maxdepth 1 -type f | sort)

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "[错误] $SRC 下没找到 png / jpg / jpeg / webp 图片"
  exit 1
fi

echo "来源目录: $SRC"
echo "目标目录: $TARGET_DIR"
echo "图片数量: ${#FILES[@]}"
echo "---"

# 第一轮：关键字匹配
while IFS= read -r line; do
  if [ -z "$line" ]; then continue; fi
  SLOT="${line%%|*}"
  KEYS="${line#*|}"
  IFS='|' read -r -a TOKENS <<< "$KEYS"
  for FILE in "${FILES[@]}"; do
    if [ -n "${DONE[$FILE]:-}" ] || [ -n "${SKIP[$FILE]:-}" ]; then continue; fi
    NAME="$(basename "$FILE")"
    NAME="${NAME%.*}"
    N="$(norm "$NAME")"
    HIT=0
    for TOKEN in "${TOKENS[@]}"; do
      T="$(norm "${TOKEN#=}")"
      if [ -z "$T" ]; then continue; fi
      case "$TOKEN" in
        =*) if [ "$N" = "$T" ]; then HIT=1; fi ;;
        *)  case "$N" in *"$T"*) HIT=1 ;; esac ;;
      esac
      if [ "$HIT" = 1 ]; then break; fi
    done
    if [ "$HIT" = 1 ]; then
      if slot_used "$SLOT"; then
        SKIP["$FILE"]=1
        echo "[重复] $(basename "$FILE") 也想匹配 $SLOT，但该槽位已被占用，已忽略"
      else
        DONE["$FILE"]="$SLOT"
      fi
      break
    fi
  done
done <<< "$SLOTS"

# 第二轮：关键字没命中的图片，按顺序填入还空着的 01~16 槽位
PENDING=()
for FILE in "${FILES[@]}"; do
  if [ -n "${DONE[$FILE]:-}" ] || [ -n "${SKIP[$FILE]:-}" ]; then continue; fi
  PENDING+=("$FILE")
done

if [ "${#PENDING[@]}" -gt 0 ]; then
  IDX=0
  while IFS= read -r line; do
    if [ -z "$line" ]; then continue; fi
    SLOT="${line%%|*}"
    case "$SLOT" in 00-*|*-mobile) continue ;; esac
    if slot_used "$SLOT"; then continue; fi
    if [ "$IDX" -ge "${#PENDING[@]}" ]; then break; fi
    DONE["${PENDING[$IDX]}"]="$SLOT"
    echo "[顺序兜底] $(basename "${PENDING[$IDX]}") → $SLOT  （关键字没命中，请人工核对！）"
    IDX=$((IDX + 1))
  done <<< "$SLOTS"
fi

# 执行复制 / 改名
SAME_DIR=0
if [ "$( cd "$SRC" && pwd )" = "$( cd "$TARGET_DIR" && pwd )" ]; then SAME_DIR=1; fi

for FILE in "${FILES[@]}"; do
  SLOT="${DONE[$FILE]:-}"
  if [ -n "${SKIP[$FILE]:-}" ]; then
    echo "[忽略] $(basename "$FILE")"
    continue
  fi
  if [ -z "$SLOT" ]; then
    echo "[跳过] $(basename "$FILE")  （没有可用槽位）"
    continue
  fi
  EXT="$(printf '%s' "${FILE##*.}" | tr 'A-Z' 'a-z')"
  if [ "$EXT" = "jpeg" ]; then EXT="jpg"; fi
  DEST="$TARGET_DIR/$SLOT.$EXT"
  if [ "$DRY" = 1 ]; then
    echo "[预览] $(basename "$FILE") → $SLOT.$EXT"
    continue
  fi
  if [ "$SAME_DIR" = 1 ] && [ "$FILE" = "$DEST" ]; then
    echo "[已就位] $SLOT.$EXT"
    continue
  fi
  for E in png jpg jpeg webp; do
    rm -f "$TARGET_DIR/$SLOT.$E"
  done
  if [ "$SAME_DIR" = 1 ]; then
    mv -f "$FILE" "$DEST"
  else
    cp -f "$FILE" "$DEST"
  fi
  echo "[归档] $(basename "$FILE") → $SLOT.$EXT"
done

# 生成清单 index.json（前端优先读它，命中时不再逐张探测）
if [ "$DRY" = 0 ]; then
  MANIFEST="$TARGET_DIR/index.json"
  {
    printf '{\n  "generated": "%s",\n  "files": [' "$(date '+%Y-%m-%d %H:%M:%S')"
    FIRST=1
    for FILE in "${FILES[@]}"; do
      SLOT="${DONE[$FILE]:-}"
      if [ -z "$SLOT" ] || [ -n "${SKIP[$FILE]:-}" ]; then continue; fi
      EXT="$(printf '%s' "${FILE##*.}" | tr 'A-Z' 'a-z')"
      if [ "$EXT" = "jpeg" ]; then EXT="jpg"; fi
      if [ ! -f "$TARGET_DIR/$SLOT.$EXT" ]; then continue; fi
      if [ "$FIRST" = 1 ]; then FIRST=0; else printf ','; fi
      printf '\n    "%s.%s"' "$SLOT" "$EXT"
    done
    printf '\n  ]\n}\n'
  } > "$MANIFEST"
  echo "---"
  echo "已生成清单: $MANIFEST"
fi

# 缺失清单（只统计 01~16 这 16 张必需图）
echo "---"
MISSING=()
while IFS= read -r line; do
  if [ -z "$line" ]; then continue; fi
  SLOT="${line%%|*}"
  case "$SLOT" in 00-*|*-mobile) continue ;; esac
  if [ "$DRY" = 1 ]; then
    if ! slot_used "$SLOT"; then MISSING+=("$SLOT"); fi
    continue
  fi
  FOUND=0
  for E in png jpg jpeg webp; do
    if [ -f "$TARGET_DIR/$SLOT.$E" ]; then FOUND=1; break; fi
  done
  if [ "$FOUND" = 0 ]; then MISSING+=("$SLOT"); fi
done <<< "$SLOTS"

if [ "${#MISSING[@]}" -eq 0 ]; then
  echo "✓ 16 张界面截图已全部就位"
else
  echo "还缺 ${#MISSING[@]} 张（缺失的位置只会显示占位框，不影响运行）："
  for M in "${MISSING[@]}"; do echo "  - $M"; done
fi
echo "---"
echo "完成。请核对 $TARGET_DIR，然后点左上方构建按钮。"

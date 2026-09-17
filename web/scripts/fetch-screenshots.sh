#!/usr/bin/env bash
#
# 从 urls.txt 批量下载官网截图到 web/public/screens/（图片放图床 / CDN / GitHub 时用）
#
# 用法（在项目根目录执行）：
#   bash web/scripts/fetch-screenshots.sh                    # 读取 web/public/screens/urls.txt
#   bash web/scripts/fetch-screenshots.sh /path/to/urls.txt  # 指定其它清单文件
#   bash web/scripts/fetch-screenshots.sh urls.txt --dry-run # 只打印将要执行的下载
#
# 清单格式：每行「槽位名 图片网址」，空格分隔，# 开头为注释
#  01-dashboard https://cdn.example.com/01-dashboard.png
#
# 下载完成后会重写 web/public/screens/index.json 清单，前端读到清单即零探测请求。
# 只想改图床地址、不想把图片落到本地仓库时，可以直接手写 index.json 的 "urls" 字段。
set -uo pipefail

URLS="${1:-web/public/screens/urls.txt}"
DRY=0
if [ "${2:-}" = "--dry-run" ]; then DRY=1; fi

TARGET_DIR="web/public/screens"

if [ ! -f "$URLS" ]; then
  echo "[错误] 找不到清单文件: $URLS"
  echo "       可先复制模板: web/public/screens/urls.txt"
  exit 1
fi

DOWN=0
if command -v curl > /dev/null 2>&1; then
  DOWN=1
elif command -v wget > /dev/null 2>&1; then
  DOWN=2
else
  echo "[错误] 需要 curl 或 wget 才能下载，二者都没找到。"
  exit 1
fi

mkdir -p "$TARGET_DIR" || exit 1

echo "清单文件: $URLS"
echo "目标目录: $TARGET_DIR"
echo "---"

OK=0
FAIL=0
SLOTS=""

while IFS= read -r LINE || [ -n "$LINE" ]; do
  # 去掉首尾空白与行尾注释
  LINE="$(printf '%s' "$LINE" | sed -e 's/[[:space:]]*#.*$//' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  if [ -z "$LINE" ]; then continue; fi

  SLOT="$(printf '%s' "$LINE" | awk '{print $1}')"
  URL="$(printf '%s' "$LINE" | awk '{print $2}')"

  if [ -z "$SLOT" ] || [ -z "$URL" ]; then
    echo "[跳过] 格式应为「槽位名 图片网址」: $LINE"
    continue
  fi

  # 扩展名：取 URL 路径部分的最后一段后缀，去掉查询串
  EXT="$(printf '%s' "${URL%%\?*}" | sed -e 's/.*\.//' | tr 'A-Z' 'a-z')"
  case "$EXT" in
    png|jpg|jpeg|webp) ;;
    *) EXT="png" ;;
  esac
  if [ "$EXT" = "jpeg" ]; then EXT="jpg"; fi

  DEST="$TARGET_DIR/$SLOT.$EXT"

  if [ "$DRY" = 1 ]; then
    echo "[预览] $SLOT ← $URL  →  $DEST"
    continue
  fi

  # 先清掉同槽位的其它后缀，避免旧图残留
  for E in png jpg jpeg webp; do
    rm -f "$TARGET_DIR/$SLOT.$E"
  done

  if [ "$DOWN" = 1 ]; then
    if curl -fsSL --retry 2 -o "$DEST" "$URL"; then
      echo "[下载] $SLOT.$EXT"
      OK=$((OK + 1))
      SLOTS="$SLOTS $SLOT.$EXT"
    else
      echo "[失败] $SLOT ← $URL"
      FAIL=$((FAIL + 1))
    fi
  else
    if wget -q -O "$DEST" "$URL"; then
      echo "[下载] $SLOT.$EXT"
      OK=$((OK + 1))
      SLOTS="$SLOTS $SLOT.$EXT"
    else
      echo "[失败] $SLOT ← $URL"
      FAIL=$((FAIL + 1))
    fi
  fi
done < "$URLS"

if [ "$DRY" = 1 ]; then
  echo "---"
  echo "预览结束（未改动任何文件）。去掉 --dry-run 即开始下载。"
  exit 0
fi

# 重写清单 index.json（files 数组写法，前端优先读它，不再逐张探测）
MANIFEST="$TARGET_DIR/index.json"
{
  printf '{\n  "_comment": "由 web/scripts/fetch-screenshots.sh 自动生成，可删（删掉后前端自动扫描本地图片）。",\n  "generated": "%s",\n  "files": [' "$(date '+%Y-%m-%d %H:%M:%S')"
  FIRST=1
  for S in $SLOTS; do
    if [ "$FIRST" = 1 ]; then FIRST=0; else printf ','; fi
    printf '\n    "%s"' "$S"
  done
  printf '\n  ]\n}\n'
} > "$MANIFEST"

echo "---"
echo "成功 $OK 张，失败 $FAIL 张"
echo "已生成清单: $MANIFEST"
echo "完成后请核对 $TARGET_DIR，然后点左上方构建按钮。"

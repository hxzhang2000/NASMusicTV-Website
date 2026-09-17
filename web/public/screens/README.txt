NAS Music TV 官网截图目录
=========================

【当前状态】16 张界面截图已全部接入，图片不放在本目录，而是通过 index.json 指向
GitHub 仓库里的 docs/snapshot/ 目录（仓库 hxzhang2000/NASMusicTV，main 分支）：

    https://raw.githubusercontent.com/hxzhang2000/NASMusicTV/main/docs/snapshot/01-dashboard.jpg

前端读取顺序：
    1) 本目录 index.json（当前用的就是这个：外链）
    2) 本目录下的本地图片文件（自动识别 .png / .jpg / .jpeg / .webp）
    3) 「偷懒命名」别名（首页.png、01.png …）
都找不到 → 该位置显示空帧，不会破图。

⚠ 注意：GitHub 的 blob 页面地址（…/blob/main/…）不能当图片用，必须是 raw 地址
（…/raw.githubusercontent.com/… 或 raw 链接）。index.json 里已写成 raw 地址。
换图 / 改文件名后，只要同步改 index.json 对应槽位的网址，再重新构建即可。
（另：若想更快，可把 raw.githubusercontent.com 换成 jsDelivr：
  https://cdn.jsdelivr.net/gh/hxzhang2000/NASMusicTV@main/docs/snapshot/01-dashboard.jpg）


想改成「图片直接进仓库」？把 16 张图丢进本目录即可，两种办法任选：

  A. 一键脚本：在项目根目录执行
         bash web/scripts/place-screenshots.sh <截图所在目录>
     脚本自动改名归档并重写 index.json（改成 files 列表）。

  B. 手动改名（只有 16 个）：01-dashboard.png … 16-remote.png
     然后删掉 index.json 里的 urls 内容（或整个删除 index.json），前端会自动扫描本地文件。

详细说明见项目里的 web/PLACE-SCREENSHOTS.md。

【偷懒起名】以下名字与规范名完全等价：
    01.png … 16.png ／ 首页.png ／ 正在播放.png ／ K歌.png ／ MTV.png ／ 可视化.png
    曲库.png ／ 发现.png ／ 搜索.png ／ 天气电台.png ／ 详情.png ／ 队列.png
    我的.png ／ 设置.png ／ 连接.png ／ 关于.png ／ 遥控.png


16 张界面截图（已定稿，全部就位）
--------------------------------
  01-dashboard.jpg        首页（正在播放卡片 + 曲库/搜索/队列快捷入口 + 最近播放网格）
  02-player.jpg           正在播放页（左侧封面 + 两行逐字歌词 + 0:46 / 4:19 进度条）
  03-karaoke.jpg          K 歌页（毛玻璃歌词卡 + 绿色大播放钮 + 调/速/原唱/质量）
  04-mtv.jpg              MTV 播放页（全屏 MV + 正中发光歌名 + 逐字歌词）
  05-visualizer.jpg       可视化舞台（左上 × + 顶部歌词胶囊 + 全屏函数散点曲线）
  06-library.jpg          曲库页（艺术家选中 + 1960 计数 + A–Z 字母索引）
  07-discover.jpg         发现页（语种/纯音乐/年代/情怀/风格/主题 六行筛选胶囊）
  08-search.jpg           搜索页（赵雷 + 五源点亮 + 68 首 + 行内四图标）
  09-weather-radio.jpg    天气电台（30°C Beijing·少云 + 六个场景胶囊 + 电台歌曲）
  10-detail.jpg           艺术家详情（呼斯楞 + 圆形头像 + 29 首）
  11-queue.jpg            播放队列（左侧大封面 + 正在播放行整行青绿高亮 + 3 首）
  12-mine.jpg             我的页（当前播放条 + 本地歌单 + 新建歌单）
  13-settings.jpg         设置页（左侧四组入口 + 语言三选一 + 暗色主题/界面动画开关）
  14-connection.jpg       服务器配置（五种后端 + 示例地址 + 连接测试）
  15-about.jpg            关于页（NAS Music TV / v2.32.5 / GPL v3 / 支持后端列表）
  16-remote.jpg           手机遥控页（竖屏，双 Tab + 正在播放卡 + 队列行）


不再单独提供（自动复用首页截图）
--------------------------------
  00-hero.png             首页主视觉 → 自动使用 01-dashboard
                          （回退顺序 01 → 02 → 03 → … → 16）
  00-share-cover.png      社交分享图 → index.html 的 og:image 已指向 01-dashboard
  想换成专门的图？把文件按上面这两个名字放进本目录（或加到 index.json）即可自动顶替。


可选项（本轮不提供）
--------------------
  01-dashboard-mobile  02-player-mobile  03-karaoke-mobile  06-library-mobile  12-mine-mobile
  放进任意一张，对应卡片右上角会自动出现 TV / 手机 切换按钮。

NAS Music TV 官网截图目录
========================

【当前状态】16 张界面截图已全部就位，并已**自托管**于本目录（不再依赖外部图床 / GitHub 外链）：

    01-dashboard.jpg   02-player.jpg      03-karaoke.jpg    04-mtv.jpg
    05-visualizer.jpg  06-library.jpg     07-discover.jpg   08-search.jpg
    09-weather-radio.jpg 10-detail.jpg    11-queue.jpg      12-mine.jpg
    13-settings.jpg    14-connection.jpg  15-about.jpg      16-remote.jpg

前端读取顺序（`web/src/data/screenshots.ts` + `useScreenshots`）：
    1) 本目录 index.json（当前用的就是这个：指向下面的本地文件名）
    2) 本目录下的本地图片文件（自动识别 .png / .jpg / .jpeg / .webp）
    3) 「省事命名」别名（首页.png、01.png …）
都找不到 → 该位置显示空帧，不会破图。

【换图】直接替换本目录下同名文件即可，index.json 无需改动（除非改文件名）。
【改外链】若想把图片放到图床 / CDN，把 index.json 里的值改成完整 https:// 地址即可。

详细说明见项目里的 web/PLACE-SCREENSHOTS.md（及 README「界面截图」一节）。


不再单独提供（自动复用首页截图）
--------------------------------
  00-hero.png          首页主视觉 → 自动使用 01-dashboard
  00-share-cover.png   社交分享图 → index.html 的 og:image 已指向本地 /screens/01-dashboard.jpg
  想换成专门的图？把文件按上面两个名字放进本目录（或加到 index.json）即可自动顶替。


可选项（暂不提供）
--------------------
  01-dashboard-mobile  02-player-mobile  03-karaoke-mobile  06-library-mobile  12-mine-mobile
  放进任意一张，对应卡片右上角会自动出现 TV / 手机 切换按钮。

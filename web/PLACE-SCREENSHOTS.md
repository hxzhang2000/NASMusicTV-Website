# 把截图放进官网（3 分钟搞定）

> **先说结论**：截图属于「构建期打进镜像的静态资源」，官网没有上传接口，图片必须先躺在
> `web/public/screens/`（或写进 `index.json` 的外链）里，然后重新构建一次才会在线生效。
> 聊天窗口里发来的图片不会自动进入项目，我在沙箱里也无法落盘二进制图片
> （写文件的工具只支持文本后缀），所以需要你按下面任一条路把它放一次。

## ✅ 当前状态：已按「方式 C」接入 16 张截图

16 张图已通过 `web/public/screens/index.json` 指向你仓库里的
`docs/snapshot/*.jpg`（GitHub raw 直链），**图片不进本仓库、无需再放一次**：

```
https://raw.githubusercontent.com/hxzhang2000/NASMusicTV/main/docs/snapshot/01-dashboard.jpg
```

要改图 / 加图，只做两件事之一：
1. 直接替换 `docs/snapshot/` 下的同名文件（连 `index.json` 都不用动）；
2. 或把 `index.json` 里对应槽位的网址换成新的直链（⚠️ 必须是 raw 地址，
   带 `/blob/` 的网页地址不能当图片用），然后点左上方构建按钮。

下面的三条路是「以后想换接入方式」时的备选，现在不需要执行。

## 三条路，选一条

| 方式 | 需要做什么 | 图片进仓库 | 适合 |
| --- | --- | --- | --- |
| **A. 脚本归档** | 图片放一个目录，跑一条命令 | 是 | 已下载到本地，图名乱 |
| **B. 手动改名** | 把 16 张图按规范名放进 `web/public/screens/` | 是 | 图不多、想完全掌控 |
| **C. 图床外链** | 图片传图床/CDN，把网址给我（或自己写 `index.json`） | 否 | 不想把大图提交进仓库 |

三条路最后动作都一样：**提交 → 点左上方构建按钮**（图片是构建期打进镜像的，改完必须重新构建）。

---

## 方式 A：一键脚本（推荐，图片名字随便）

1. 把 16 张截图（微信/QQ/相册保存的都行，文件名不用改）全部下载到 **同一个目录**，
   例如 `~/Downloads`；
2. 把本仓库更新到本地后，在**项目根目录**执行：

```bash
bash web/scripts/place-screenshots.sh ~/Downloads
```

3. 脚本会：按关键字（`首页` / `正在播放` / `K歌` / `MTV` / `可视化` / `曲库` / `发现` / `搜索` /
   `天气` / `详情` / `队列` / `我的` / `设置` / `连接` / `关于` / `遥控`，以及 `01`…`16`）
   自动改名复制到 `web/public/screens/`，然后生成清单文件 `web/public/screens/index.json`；
4. 看脚本输出：`✓ 16 张界面截图已全部就位` 就完事了；若有 `[顺序兜底]` 提示，说明某张图
   名字没被识别、被按顺序塞进了空槽位，请打开 `web/public/screens/` 人工核对改名；
5. 点左上方构建按钮。

想先预览不动文件：加 `--dry-run`

```bash
bash web/scripts/place-screenshots.sh ~/Downloads --dry-run
```

---

## 方式 B：手动改名（不多，只有 16 个）

把图片放到 `web/public/screens/`，并改成下面的名字（`.png` 换成 `.jpg` / `.webp` 也认）：

| 序号 | 文件名 | 你发的那张截图 |
| --- | --- | --- |
| 1 | `01-dashboard.png` | 首页（正在播放卡片 + 最近播放） |
| 2 | `02-player.png` | 正在播放页（两行逐字歌词） |
| 3 | `03-karaoke.png` | K 歌页 |
| 4 | `04-mtv.png` | MTV 播放页 |
| 5 | `05-visualizer.png` | 可视化舞台 |
| 6 | `06-library.png` | 曲库页（艺术家索引） |
| 7 | `07-discover.png` | 发现页（六行筛选） |
| 8 | `08-search.png` | 搜索页（赵雷 / 68 首） |
| 9 | `09-weather-radio.png` | 天气电台 |
| 10 | `10-detail.png` | 艺术家详情（呼斯楞） |
| 11 | `11-queue.png` | 播放队列 |
| 12 | `12-mine.png` | 我的页（本地歌单） |
| 13 | `13-settings.png` | 设置页（语言 / 开关） |
| 14 | `14-connection.png` | 服务器配置页 ⚠️ 隐去真实 IP / Token |
| 15 | `15-about.png` | 关于页（版本 v2.32.5） |
| 16 | `16-remote.png` | 手机遥控页（竖屏 1080×2340） |

### 也可以偷懒用别名

以下名字与规范名**完全等价**，不用改全名：

- `01.png` … `16.png`（纯序号，最省事）
- 中文名：`首页.png`、`正在播放.png`、`K歌.png`、`MTV.png`、`可视化.png`、`曲库.png`、
  `发现.png`、`搜索.png`、`天气电台.png`、`详情.png`、`队列.png`、`我的.png`、
  `设置.png`、`连接.png`、`关于.png`、`遥控.png`
- 中英混写：`01-首页.jpg`、`02-正在播放.jpg`、`03-K歌.jpg` …

别名清单的代码位置：`web/src/data/screenshots.ts` 的 `nameAliases`，想加自己的叫法改这里即可。

---

## 方式 C：图床 / CDN 外链（不往仓库里放图片）

1. 把 16 张图传到任意可直链访问的地方：图床、对象存储、CDN、GitHub 仓库 raw 地址都行，
   只要浏览器能直接打开图片 URL；
2. 两种落地办法：

   - **自己写清单**：编辑 `web/public/screens/index.json`，用 `urls` 字段按槽位名填网址：

     ```json
     {
       "urls": {
         "01-dashboard": "https://cdn.example.com/nas/01-dashboard.png",
         "02-player": "https://cdn.example.com/nas/02-player.png"
       }
     }
     ```

   - **给我网址**：把「槽位名 + 网址」发我，我把它写进 `index.json`
     （这是文本文件，我能直接写，不需要你动手）；
3. 想改成「先下载到本地再打包」（长期维护更稳，不受图床稳定性影响）：把网址填进
   `web/public/screens/urls.txt`（每行「槽位名 网址」），然后执行：

   ```bash
   bash web/scripts/fetch-screenshots.sh
   ```

   脚本会下载全部图片并自动重写 `index.json` 清单；
4. 提交后点左上方构建按钮。

> 注意：`index.json` 同样是构建期打进镜像的，所以改外链后也需要重新构建一次。

---

## 常见问题

**Q：我已经发布过了，现在补图要怎么做？**
在本地把图片放进 `web/public/screens/`（方式 A / B）或把网址写进 `index.json`（方式 C），
提交到仓库，然后点左上方构建按钮重新构建并发布一次。图片是构建期打进镜像的，
所以「不重新构建就能换图」是不行的（本项目的 web 服务是静态 nginx，没有上传接口）。

**Q：少放了几张会怎样？**
不会报错、不会破图。缺的那张位置显示空帧，其余页面正常。以后补上即可。

**Q：`.jpg` 和 `.png` 混着放行不行？**
行。同一槽位四种后缀（png/jpg/jpeg/webp）都会自动识别。

**Q：`index.json` 是什么？必须吗？**
清单文件：前端若读到它就不必逐张试探哪个文件存在，一次请求即可。
方式 A 会自动生成，方式 C 可手写；方式 B（手动改名）不需要它，前端会自动退化为逐个探测。
**用方式 A 放过图之后又手动增删过图片的话**，请重跑一次脚本刷新清单，或直接删掉
`web/public/screens/index.json`，让前端回到自动探测模式。

**Q：以后想换图？**
把新图按同名覆盖 `web/public/screens/` 下对应文件即可；若是用方式 A 放的图，
换图后再跑一次脚本刷新 `index.json`。

**Q：`00-hero.png` / `00-share-cover.png` 呢？**
已定稿不再单独提供：首页主视觉自动复用 `01-dashboard.png`
（回退顺序 `01 → 02 → … → 16`），社交分享图（og:image）也指向 `01-dashboard.png`。
想换成专门的大图，把文件命名成 `00-hero.png` / `00-share-cover.png` 放进去就会自动顶替。

**Q：手机版截图？**
可选、本轮不提供。若以后放进 `01-dashboard-mobile.png`（或 `01-手机.png`）等 5 个名字，
对应卡片右上角会自动出现 TV / 手机 切换按钮。

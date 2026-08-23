# QilyLean 无广告斗地主｜简单娱乐，益智生活

几年前，我发现父母喜欢玩网页版斗地主，但实名注册、账号登录、验证码验证等流程，对于不熟悉智能设备操作的老年人来说并不友好。由于子女常年在外工作，很多时候需要等待家人回家才能协助完成登录。

因此，我开发了这款**无广告、无强制注册、操作简单的斗地主游戏**，希望为我们父母辈老年人提供一个更加轻松、便捷、安全的休闲娱乐方式。

游戏采用简洁直观的设计理念，无需复杂操作，不被广告打扰，打开即可畅玩。既适合家庭休闲，也适合老年人在娱乐过程中活跃思维、锻炼反应能力，让日常生活多一份乐趣。

同时，工作中的我们长期面对复杂的问题分析、工程改善、项目管理和高强度思考，大脑也需要适度放松与调节。斗地主不仅是一种娱乐方式，也是一种简单的益智活动，在轻松游戏过程中保持思考、缓解压力，让工作与生活更加平衡。

我希望通过这款小小的游戏，解决一个真实的家庭需求，也将自己多年工程实践中追求的简单、高效、友好的理念融入数字产品设计中。

> 愿每一次出牌，都带来轻松与快乐；  
> 愿每一次思考，都保持活力与智慧。

完整产品概述见：[docs/PRODUCT_OVERVIEW.md](docs/PRODUCT_OVERVIEW.md)

## 当前版本：v1.1.0

在“简单娱乐，益智生活”的主旨下，当前版本继续保持打开即玩、无广告、无强制注册、无支付干扰，并保留以下能力：

- **Expert / Challenge AI**：默认 Expert；AI 仅依据公开牌桌信息记牌、控牌和决策，不读取对手隐藏手牌。
- **QilyLean 主题牌面**：传统点数与花色角标保持清晰，牌面融入现场事实、工程数据、精益改善、质量保证、数智固化、知识资产，以及 IE、ECRS、SMED、VSM、TPM、OEE、单件流等技能主题。
- **特色 Joker**：大王使用 QilyLean 官网现有个人头像；小王使用六大业务 C919 飞机模型。
- **适老化体验**：高对比牌面、大按钮，支持标准大字、舒适大字、特大字。
- **横竖屏自由旋转**：手机、平板和网页版自动重排牌桌，Android 版沉浸式显示。
- **中文语音与音效**：叫分、出牌、输赢均可语音提示，音乐和音效可独立关闭。
- **本机战绩**：积分、胜负、连胜与设置只保存在当前设备。

## 立即体验

- 网页版：https://qilylean.com/tools/pure-ddz/
- Android 安装包：`Pure-DDZ-Classic-v1.1.0.apk`
- 官方网址：https://qilylean.com
- 官网邮箱：admin@qilylean.com

## 本地运行网页版

```bash
python3 -m http.server 4173 --directory web
```

打开 `http://127.0.0.1:4173/index.html`。网页版支持 PWA、横竖屏切换与离线缓存。

## 构建 Android APK

构建脚本直接使用 Android SDK Build Tools，不下载 Gradle 或第三方运行依赖：

```bash
scripts/build-android-apk.sh
```

当前输出文件：

- `dist/Pure-DDZ-Classic-v1.1.0.apk`
- `dist/Pure-DDZ-Classic-v1.1.0.sha256`

首次本机构建会在忽略提交的 `.signing/` 目录生成发布签名。后续升级必须妥善保留并复用同一签名，不得把密钥或密码提交到 GitHub。

Android 包名为 `com.pureddz.classic`，最低 Android 8（API 26），当前 targetSdk 为 36。应用不声明 `INTERNET` 权限，游戏核心资源全部打包在 APK 内。

## 自动化检查

```bash
npm install
npx playwright install chromium
npm run test:web
```

自动测试覆盖开局发牌、Expert/Challenge 设置、QilyLean 主题牌、大王头像、小王 C919、经典牌型规则、移动端横竖屏布局与浏览器脚本错误；Android 发布门禁还包括 Android 35 模拟器真实安装、MainActivity 启动、5 秒进程存活与 FATAL EXCEPTION 检查。

## 隐私与产品承诺

游戏不接入广告、账号体系、支付、统计或远程业务服务器。积分、胜负记录和偏好设置仅存储在设备本地；清除浏览器或应用数据后会同时清除。

**统一开发者支持：** 官方网址 https://qilylean.com；官网邮箱 admin@qilylean.com。

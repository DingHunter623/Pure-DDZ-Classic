# 纯净斗地主（Pure-DDZ-Classic）

一款为父母辈打造、也适合成年人休闲养神益智的单机斗地主。打开即玩，无广告、无注册、无登录、无支付，不申请网络权限，也不收集个人信息。

## 产品亮点

- 无广告纯单机：断网也能完整使用，没有弹窗和付费套路。
- 适老化大字体：高对比牌面、大按钮，支持标准大字、舒适大字、特大字。
- 横竖屏自由旋转：手机、平板和电脑版均自动重排牌桌，Android 版沉浸式最大化显示。
- 积分与奖励：胜负、连胜、炸弹倍数和每日首胜奖励只保存在本机。
- 中文语音：叫分、出牌和输赢均可语音提示，可随时关闭。
- 经典斗地主氛围音乐：原创五声音阶背景音乐与轻柔音效，可独立开关。
- AI 智能辅助：AI 提示推荐出牌并解释牌型，电脑玩家不会读取你的隐藏手牌。

## 立即体验

- 网页版：将在 QilyLean 官网提供“开始网页版”入口。
- Android 安装包：`dist/Pure-DDZ-Classic-v1.0.0.apk`
- 官方网站：[https://qilylean.com](https://qilylean.com)
- 企业邮箱：[admin@qilylean.com](mailto:admin@qilylean.com)
- 微信：`Qily259`

官方网址按产品规范固定为 `https://qilylean.com`，末尾不带斜杠。

## 本地运行网页版

```bash
python3 -m http.server 4173 --directory web
```

打开 `http://127.0.0.1:4173/index.html`。网页版支持 PWA 安装、横竖屏切换与离线缓存。

## 构建 Android APK

构建脚本直接使用本机 Android SDK Build Tools，不下载 Gradle 或第三方依赖：

```bash
scripts/build-android-apk.sh
```

输出文件：

- `dist/Pure-DDZ-Classic-v1.0.0.apk`
- `dist/Pure-DDZ-Classic-v1.0.0.sha256`

首次本机构建会在忽略提交的 `.signing/` 目录生成发布签名。后续升级必须妥善保留并复用这份签名；不得把密钥或密码提交到 GitHub。

Android 包名为 `com.pureddz.classic`，最低 Android 8（API 26），目标 API 37。应用不声明 `INTERNET` 权限，游戏资源全部打包在 APK 内。

## 自动化检查

```bash
npm install
npx playwright install chromium
npm run test:web
```

测试覆盖开局发牌、设置页官网信息、牌型规则、移动端横竖屏布局与浏览器脚本错误。

## 隐私承诺

游戏不接入广告、账号、支付、统计或远程服务器。本机积分、胜负记录和偏好设置仅存储在设备本地；清除浏览器/应用数据后会同时清除。

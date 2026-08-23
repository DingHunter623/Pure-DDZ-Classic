# Android 稳定发布签名要求

Pure DDZ Classic 的正式 Android 发布必须使用持久、唯一、受保护的 release keystore。

当前 `scripts/build-android-apk.sh` 在未提供 `PURE_DDZ_SIGNING_DIR` 时会在构建环境创建 `.signing` 目录、随机密码和 keystore。该机制适用于临时 CI 冒烟包，但不适合作为长期升级发布签名，因为不同临时 Runner 可能产生不同证书，导致已安装用户无法直接覆盖升级。

正式发布链目标：

1. 在受控环境生成并长期保存唯一 release keystore；
2. keystore 与密码不得提交到 Git 仓库；
3. 通过 GitHub Actions Secrets / 受保护的发布环境向 CI 注入签名材料；
4. 构建时必须校验 release 证书 SHA-256 指纹与预期值一致；
5. 版本升级必须验证可从上一正式版直接覆盖安装；
6. 在完成稳定签名迁移前，对外明确采用“卸载旧测试包后全新安装”作为兼容路径。

此项属于发布工程治理，不影响 v1.0.3 已修复的 MainActivity 启动崩溃结论。
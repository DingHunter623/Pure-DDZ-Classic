# Pure DDZ Classic v1.0.3 发布状态

- Android 35 / x86_64 模拟器安装：通过
- `MainActivity` 启动：通过
- 启动后 5 秒进程存活：通过
- `MainActivity` 保持前台：通过
- `FATAL EXCEPTION` 检查：通过
- Web Playwright smoke test：通过

v1.0.3 修复了 v1.0.2 在 `onCreate()` 阶段过早调用 `WindowInsetsController`、因 `DecorView` 尚未建立而触发的启动崩溃。

长期发布签名治理见 `docs/RELEASE_SIGNING.md`。
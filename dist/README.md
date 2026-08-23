# Android distribution (v1.1.0)

Run `scripts/build-android-apk.sh` on the release machine. The signed APK and SHA-256 file are written here.

The persistent release keystore is stored locally in `.signing/` and is intentionally excluded from Git. Keep that directory for future upgrade-compatible signatures.

GitHub Actions artifacts are test-signed with an ephemeral key. They are installable for validation but are not upgrade-compatible production releases.

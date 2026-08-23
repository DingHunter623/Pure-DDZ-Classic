#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK_ROOT="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-$HOME/Library/Android/sdk}}"
VERSION="1.1.0"
TARGET_API="${PURE_DDZ_TARGET_API:-36}"
BUILD_TOOLS_VERSION="${PURE_DDZ_BUILD_TOOLS_VERSION:-36.0.0}"
BUILD_TOOLS="$SDK_ROOT/build-tools/$BUILD_TOOLS_VERSION"
PLATFORM_JAR="$SDK_ROOT/platforms/android-$TARGET_API/android.jar"
JAVA_ROOT="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"

if [[ ! -f "$PLATFORM_JAR" ]]; then
  PLATFORM_JAR="$(find "$SDK_ROOT/platforms" -mindepth 2 -maxdepth 2 -name android.jar | sort | tail -1)"
fi

export JAVA_HOME="$JAVA_ROOT"
export PATH="$JAVA_ROOT/bin:$PATH"

if [[ ! -x "$JAVA_ROOT/bin/javac" ]]; then
  echo "未找到 JDK：$JAVA_ROOT" >&2
  exit 1
fi
if [[ ! -x "$BUILD_TOOLS/aapt" || ! -f "$PLATFORM_JAR" ]]; then
  echo "Android SDK 不完整：$SDK_ROOT" >&2
  exit 1
fi

BUILD_DIR="$ROOT/build/manual-android"
STAGE_DIR="$BUILD_DIR/stage"
CLASSES_DIR="$BUILD_DIR/classes"
DEX_DIR="$BUILD_DIR/dex"
DIST_DIR="$ROOT/dist"
SIGNING_DIR="${PURE_DDZ_SIGNING_DIR:-$ROOT/.signing}"
KEYSTORE="$SIGNING_DIR/pure-ddz-classic-release.jks"
PASSWORD_FILE="$SIGNING_DIR/release.password"
UNSIGNED_APK="$BUILD_DIR/pure-ddz-unsigned.apk"
ALIGNED_APK="$BUILD_DIR/pure-ddz-aligned.apk"
OUTPUT_APK="$DIST_DIR/Pure-DDZ-Classic-v$VERSION.apk"

rm -rf "$BUILD_DIR"
mkdir -p "$STAGE_DIR/assets" "$CLASSES_DIR" "$DEX_DIR" "$DIST_DIR" "$SIGNING_DIR"
cp -R "$ROOT/web" "$STAGE_DIR/assets/www"

"$BUILD_TOOLS/aapt" package -f \
  -M "$ROOT/app/src/main/AndroidManifest.xml" \
  -S "$ROOT/app/src/main/res" \
  -A "$STAGE_DIR/assets" \
  -I "$PLATFORM_JAR" \
  -F "$UNSIGNED_APK"

"$JAVA_ROOT/bin/javac" -encoding UTF-8 --release 17 \
  -classpath "$PLATFORM_JAR" \
  -d "$CLASSES_DIR" \
  "$ROOT/app/src/main/java/com/pureddz/classic/MainActivity.java"

find "$CLASSES_DIR" -type f -name '*.class' -print0 | \
  xargs -0 "$BUILD_TOOLS/d8" --release --min-api 26 --lib "$PLATFORM_JAR" --output "$DEX_DIR"
(cd "$DEX_DIR" && "$BUILD_TOOLS/aapt" add "$UNSIGNED_APK" classes.dex >/dev/null)
"$BUILD_TOOLS/zipalign" -f 4 "$UNSIGNED_APK" "$ALIGNED_APK"

if [[ ! -f "$PASSWORD_FILE" ]]; then
  umask 077
  "$JAVA_ROOT/bin/java" -version >/dev/null 2>&1
  openssl rand -hex 24 > "$PASSWORD_FILE"
fi
KEY_PASSWORD="$(tr -d '\r\n' < "$PASSWORD_FILE")"

if [[ ! -f "$KEYSTORE" ]]; then
  "$JAVA_ROOT/bin/keytool" -genkeypair -noprompt \
    -keystore "$KEYSTORE" \
    -storepass "$KEY_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -alias pure-ddz-classic \
    -keyalg RSA -keysize 3072 -validity 10000 \
    -dname "CN=QilyLean Pure DDZ Classic, OU=Digital Products, O=QilyLean, L=Dongguan, ST=Guangdong, C=CN"
fi

"$BUILD_TOOLS/apksigner" sign \
  --ks "$KEYSTORE" \
  --ks-key-alias pure-ddz-classic \
  --ks-pass "pass:$KEY_PASSWORD" \
  --key-pass "pass:$KEY_PASSWORD" \
  --out "$OUTPUT_APK" \
  "$ALIGNED_APK"

"$BUILD_TOOLS/apksigner" verify --verbose --print-certs "$OUTPUT_APK"
"$BUILD_TOOLS/aapt" dump badging "$OUTPUT_APK" | sed -n '1,6p'
APK_HASH="$(shasum -a 256 "$OUTPUT_APK" | awk '{print $1}')"
printf '%s  %s\n' "$APK_HASH" "$(basename "$OUTPUT_APK")" | tee "$DIST_DIR/Pure-DDZ-Classic-v$VERSION.sha256"
echo "APK_READY=$OUTPUT_APK"

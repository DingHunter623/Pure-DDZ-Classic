package com.pureddz.classic;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.Locale;

public final class MainActivity extends Activity {
    private static final String VERSION = "1.2.0";
    private static final String LOCAL_GAME_URL = "file:///android_asset/www/index.html?source=android";
    private static final Uri ONLINE_GAME_URL = Uri.parse("https://qilylean.com/tools/pure-ddz/");

    private WebView gameView;
    private TextToSpeech speech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(7, 60, 71));
        window.setNavigationBarColor(Color.rgb(7, 60, 71));
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        try {
            gameView = new WebView(this);
            gameView.setBackgroundColor(Color.rgb(7, 60, 71));
            gameView.setOverScrollMode(View.OVER_SCROLL_NEVER);

            WebSettings settings = gameView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(false);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(false);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setJavaScriptCanOpenWindowsAutomatically(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            settings.setSupportZoom(false);
            settings.setTextZoom(100);
            settings.setUserAgentString(settings.getUserAgentString() + " PureDDZClassic/" + VERSION + " QilyLean");

            gameView.setWebChromeClient(new WebChromeClient());
            gameView.setWebViewClient(new GameWebViewClient());
            gameView.addJavascriptInterface(new AndroidBridge(this), "QilyLeanAndroid");
            setContentView(gameView);
            gameView.post(this::hideSystemBars);
            gameView.loadUrl(LOCAL_GAME_URL);
        } catch (Throwable startupError) {
            showNativeFallback();
        }

        try {
            speech = new TextToSpeech(getApplicationContext(), status -> {
                if (status == TextToSpeech.SUCCESS && speech != null) {
                    int result = speech.setLanguage(Locale.SIMPLIFIED_CHINESE);
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        speech.setLanguage(Locale.CHINESE);
                    }
                    speech.setSpeechRate(0.92f);
                    speech.setPitch(1.0f);
                }
            });
        } catch (Throwable ignored) {
            speech = null;
        }
    }

    private void applyHiddenSystemBars(WindowInsetsController controller) {
        controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
        controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }

    private void hideSystemBars() {
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);
            View decorView = window.getDecorView();
            if (decorView == null) return;

            WindowInsetsController controller = decorView.getWindowInsetsController();
            if (controller != null) {
                applyHiddenSystemBars(controller);
                return;
            }

            decorView.post(() -> {
                WindowInsetsController deferredController = decorView.getWindowInsetsController();
                if (deferredController != null) applyHiddenSystemBars(deferredController);
            });
        } else {
            window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }

    private void showNativeFallback() {
        runOnUiThread(() -> {
            if (gameView != null) {
                try {
                    gameView.stopLoading();
                    gameView.removeJavascriptInterface("QilyLeanAndroid");
                } catch (Throwable ignored) {
                }
            }

            LinearLayout panel = new LinearLayout(this);
            panel.setOrientation(LinearLayout.VERTICAL);
            panel.setGravity(Gravity.CENTER);
            panel.setPadding(48, 48, 48, 48);
            panel.setBackgroundColor(Color.rgb(7, 60, 71));

            TextView title = new TextView(this);
            title.setText("纯净斗地主");
            title.setTextColor(Color.WHITE);
            title.setTextSize(28);
            title.setGravity(Gravity.CENTER);

            TextView copy = new TextView(this);
            copy.setText("本机 WebView 暂时无法加载离线牌桌。应用本身已正常启动，可点击下方按钮进入 QilyLean 官网网页版。\n\nv" + VERSION);
            copy.setTextColor(Color.rgb(220, 239, 234));
            copy.setTextSize(17);
            copy.setGravity(Gravity.CENTER);
            copy.setPadding(0, 28, 0, 28);

            Button openWeb = new Button(this);
            openWeb.setText("打开官网网页版");
            openWeb.setTextSize(18);
            openWeb.setOnClickListener(v -> openExternal(ONLINE_GAME_URL));

            panel.addView(title, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            panel.addView(copy, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            panel.addView(openWeb, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            setContentView(panel);
            panel.post(this::hideSystemBars);
        });
    }

    private void openExternal(Uri uri) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (Throwable ignored) {
        }
    }

    private final class GameWebViewClient extends WebViewClient {
        private boolean isLocalGameUri(Uri uri) {
            if (uri == null) return false;
            String scheme = uri.getScheme();
            return "file".equalsIgnoreCase(scheme)
                || "data".equalsIgnoreCase(scheme)
                || "about".equalsIgnoreCase(scheme)
                || "blob".equalsIgnoreCase(scheme);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (isLocalGameUri(uri)) return false;
            openExternal(uri);
            return true;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri uri = Uri.parse(url);
            if (isLocalGameUri(uri)) return false;
            openExternal(uri);
            return true;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request != null && request.isForMainFrame()) {
                showNativeFallback();
            }
        }
    }

    private final class AndroidBridge {
        private final Context context;

        AndroidBridge(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void speak(String text) {
            if (text == null || text.trim().isEmpty()) return;
            runOnUiThread(() -> {
                if (speech != null) speech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "pure-ddz-voice");
            });
        }

        @JavascriptInterface
        public String getVersion() {
            return VERSION;
        }
    }

    @Override
    public void onBackPressed() {
        if (gameView == null) {
            super.onBackPressed();
            return;
        }
        try {
            gameView.evaluateJavascript("Boolean(window.PureDDZNativeBack && window.PureDDZNativeBack())", value -> {
                if (!"true".equals(value)) MainActivity.super.onBackPressed();
            });
        } catch (Throwable ignored) {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (gameView != null) gameView.onPause();
        if (speech != null) speech.stop();
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemBars();
        if (gameView != null) gameView.onResume();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (gameView != null) gameView.post(this::hideSystemBars);
    }

    @Override
    protected void onDestroy() {
        if (gameView != null) {
            try {
                gameView.removeJavascriptInterface("QilyLeanAndroid");
                gameView.destroy();
            } catch (Throwable ignored) {
            }
        }
        if (speech != null) {
            speech.stop();
            speech.shutdown();
        }
        super.onDestroy();
    }
}

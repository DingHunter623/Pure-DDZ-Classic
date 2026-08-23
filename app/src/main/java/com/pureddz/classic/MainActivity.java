package com.pureddz.classic;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Locale;

public final class MainActivity extends Activity {
    private WebView gameView;
    private TextToSpeech speech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(15, 75, 90));
        window.setNavigationBarColor(Color.rgb(15, 75, 90));
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemBars();

        gameView = new WebView(this);
        gameView.setBackgroundColor(Color.rgb(15, 75, 90));
        gameView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = gameView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " PureDDZClassic/1.1.0 QilyLean");
        WebView.setWebContentsDebuggingEnabled(false);

        gameView.setWebChromeClient(new WebChromeClient());
        gameView.setWebViewClient(new GameWebViewClient());
        gameView.addJavascriptInterface(new AndroidBridge(), "QilyLeanAndroid");
        setContentView(gameView);

        speech = new TextToSpeech(getApplicationContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                int result = speech.setLanguage(Locale.SIMPLIFIED_CHINESE);
                if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    speech.setLanguage(Locale.CHINESE);
                }
                speech.setSpeechRate(0.92f);
                speech.setPitch(1.0f);
            }
        });

        gameView.loadUrl("file:///android_asset/www/index.html?source=android");
    }

    private void hideSystemBars() {
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);
            WindowInsetsController controller = window.getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
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

    private void openExternal(Uri uri) {
        String scheme = uri.getScheme();
        if (!("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme) || "mailto".equalsIgnoreCase(scheme))) return;
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (Exception ignored) {
        }
    }

    private final class GameWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (uri.toString().startsWith("file:///android_asset/www/")) return false;
            openExternal(uri);
            return true;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri uri = Uri.parse(url);
            if (url.startsWith("file:///android_asset/www/")) return false;
            openExternal(uri);
            return true;
        }
    }

    private final class AndroidBridge {
        @JavascriptInterface
        public void speak(String text) {
            if (text == null || text.trim().isEmpty()) return;
            runOnUiThread(() -> {
                if (speech != null) speech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "pure-ddz-voice");
            });
        }

        @JavascriptInterface
        public String getVersion() {
            return "1.1.0";
        }
    }

    @Override
    public void onBackPressed() {
        if (gameView == null) {
            super.onBackPressed();
            return;
        }
        gameView.evaluateJavascript("Boolean(window.PureDDZNativeBack && window.PureDDZNativeBack())", value -> {
            if (!"true".equals(value)) MainActivity.super.onBackPressed();
        });
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
            gameView.removeJavascriptInterface("QilyLeanAndroid");
            gameView.destroy();
        }
        if (speech != null) {
            speech.stop();
            speech.shutdown();
        }
        super.onDestroy();
    }
}

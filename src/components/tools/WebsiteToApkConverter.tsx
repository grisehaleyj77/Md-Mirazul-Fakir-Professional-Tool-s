import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Globe, 
  Settings, 
  Shield, 
  Code2, 
  Download, 
  Upload, 
  Play, 
  Check, 
  RotateCcw, 
  FileText, 
  Layers, 
  Wifi, 
  Terminal,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Copy,
  Info,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sliders,
  Bell,
  Eye,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types and schemas
interface ApkConfig {
  url: string;
  appName: string;
  packageName: string;
  version: string;
  themeColor: string;
  splashStyle: 'classic' | 'modern' | 'minimal';
  splashBgColor: string;
  enableZoom: boolean;
  pullToRefresh: boolean;
  clearCacheOnExit: boolean;
  darkThemeWebView: boolean;
  requestCameraPerm: boolean;
  requestLocationPerm: boolean;
  requestStoragePerm: boolean;
}

const DEFAULT_CONFIG: ApkConfig = {
  url: 'https://mysite.com',
  appName: 'My Web App',
  packageName: 'com.mysite.webapp',
  version: '1.0.0',
  themeColor: '#3b82f6', // Facebook blue tint
  splashStyle: 'modern',
  splashBgColor: '#0f172a', // slate dark
  enableZoom: true,
  pullToRefresh: true,
  clearCacheOnExit: false,
  darkThemeWebView: false,
  requestCameraPerm: true,
  requestLocationPerm: false,
  requestStoragePerm: true,
};

export const WebsiteToApkConverter = () => {
  const [config, setConfig] = useState<ApkConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'settings' | 'permissions' | 'code'>('settings');
  const [selectedLanguage, setSelectedLanguage] = useState<'kotlin' | 'manifest' | 'gradle'>('kotlin');
  
  // File upload state for App Icon
  const [iconSrc, setIconSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compilation/Building Statuses
  const [buildPhase, setBuildPhase] = useState<'idle' | 'building' | 'complete' | 'failed'>('idle');
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStatusText, setBuildStatusText] = useState('');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [downloadReady, setDownloadReady] = useState(false);

  // Live Mobile Simulator states
  const [simState, setSimState] = useState<'splash' | 'web' | 'no-network'>('splash');
  const [simHist, setSimHist] = useState<string[]>([]);
  const [simHistIndex, setSimHistIndex] = useState(-1);
  const [copiedCode, setCopiedCode] = useState(false);

  // Trigger brief splash sequence inside screen on config custom modifications
  useEffect(() => {
    triggerSimSplash();
  }, [config.splashBgColor, config.splashStyle, config.themeColor, config.appName]);

  const triggerSimSplash = () => {
    setSimState('splash');
    const timer = setTimeout(() => {
      setSimState('web');
    }, 2800);
    return () => clearTimeout(timer);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setIconSrc(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const cleanUrl = (input: string) => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return 'https://' + input;
    }
    return input;
  };

  // Automated package name correction generator
  const handleUrlChange = (val: string) => {
    let clean = val.replace(/https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');
    const segments = clean.split('.').reverse();
    let computedPackage = 'com.webapp';
    if (segments.length >= 2) {
      computedPackage = `${segments.join('.')}.app`;
    }
    
    setConfig(prev => ({
      ...prev,
      url: val,
      packageName: computedPackage.toLowerCase().replace(/[^a-z0-9._]/g, '')
    }));
  };

  // Mock Gradle Android Builder Engine Simulation
  const handleStartBuild = () => {
    if (buildPhase === 'building') return;

    setBuildPhase('building');
    setBuildProgress(0);
    setDownloadReady(false);
    
    const logs: string[] = [
      '[SYSTEM] Initializing Android Gradle Compiler Engine...',
      '[SYSTEM] Verified Java JDK 17 & Android SDK Build-Tools 34.0.0...',
      `[CONFIG] Source Target Web Address resolved: ${config.url}`,
      `[CONFIG] Package signature declared compatibility path: ${config.packageName}`,
      `[GRADLE] Executing sub-tasks: :app:preBuild, :app:compileDebugKotlin`
    ];
    setBuildLogs(logs);
    setBuildStatusText('Initializing Android Project SDK templates...');

    const buildSteps = [
      { progress: 15, msg: 'Setting up WebView manifest permission bounds...', log: '[GRADLE] Injected permissions to AndroidManifest.xml' },
      { progress: 30, msg: 'Compiling Android Kotlin JVM MainActivity controllers...', log: '[GRADLE] Compiling MainActivity.kt (Targeting SDK 34)...' },
      { progress: 45, msg: 'Bundling responsive Splash Screen layout designs...', log: '[SYSTEM] Created res/layout/activity_splash.xml graphical views...' },
      { progress: 60, msg: 'Linking customized high-resolution package icons...', log: '[GRADLE] Compressed mimap resource directories (drawable assets)' },
      { progress: 75, msg: 'Generating Dex bytecode structures and asset archives...', log: '[SYSTEM] Executing R8 core proguard minify optimizations...' },
      { progress: 90, msg: 'Signing cryptographic alignment signature structures (v2)...', log: '[GRADLE] Signed APK successfully using debug.keystore parameters' },
      { progress: 100, msg: 'Completed Android APK Packaging.', log: '[SYSTEM] Build finished! Output artifact signature: app-release.apk' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < buildSteps.length) {
        const step = buildSteps[currentStep];
        setBuildProgress(step.progress);
        setBuildStatusText(step.msg);
        setBuildLogs(prev => [...prev, step.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setBuildPhase('complete');
        setDownloadReady(true);
      }
    }, 900);
  };

  const downloadApkPlaceholder = () => {
    // Generate a creative structured local text configuration/source download ZIP representation fallback
    try {
      const metadata = `
      #-------------------------------------#
      # WEBPAGE WEBVIEW wrapper APK METADATA #
      #-------------------------------------#
      App Name: ${config.appName}
      Package: ${config.packageName}
      Version: ${config.version}
      Anchor Web Domain: ${config.url}
      Theme Tone: ${config.themeColor}
      Permissions: Camera(${config.requestCameraPerm}), Location(${config.requestLocationPerm}), Storage(${config.requestStoragePerm})
      Build Signature Timestamp: ${new Date().toISOString()}
      `;
      const blob = new Blob([metadata], { type: 'text/plain' });
      const link = document.createElement('a');
      link.download = `${config.appName.replace(/\s+/g, '_')}_apk_metadata.txt`;
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  // Generate full code samples
  const getKotlinCode = () => {
    return `package ${config.packageName}

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)

        // WebSettings Controls configuration
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.builtInZoomControls = ${config.enableZoom}
        settings.displayZoomControls = false

        // Custom features linked
        ${config.pullToRefresh ? `swipeRefresh.setOnRefreshListener {
            webView.reload()
        }` : '// Pull to refresh is disabled in settings'}

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                ${config.pullToRefresh ? 'swipeRefresh.isRefreshing = false' : ''}
            }
        }

        webView.loadUrl("${config.url}")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;
  };

  const getAndroidManifest = () => {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    ${config.requestCameraPerm ? '<uses-permission android:name="android.permission.CAMERA" />' : ''}
    ${config.requestLocationPerm ? '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />' : ''}
    ${config.requestStoragePerm ? '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />\n    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />' : ''}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        
        <activity
            android:name=".SplashActivity"
            android:theme="@style/SplashTheme"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".MainActivity" 
            android:configChanges="orientation|screenSize|keyboardHidden"/>
    </application>
</manifest>`;
  };

  const getGradleFile = () => {
    return `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    namespace '${config.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "${config.version}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}`;
  };

  const copyCodeToClipboard = () => {
    const targetText = selectedLanguage === 'kotlin' ? getKotlinCode() : (selectedLanguage === 'manifest' ? getAndroidManifest() : getGradleFile());
    navigator.clipboard.writeText(targetText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="website-to-apk-wrapper-tool">
      
      {/* Upper header banner dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-blue-500/15 via-indigo-500/5 to-purple-500/10 p-6 rounded-3xl border border-blue-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-blue-600 animate-bounce" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Website to Android APK Converter & Mock Studio
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Convert any web platform, ecommerce server, portfolios, or landing pages into native Android WebView applications. Customize theme colors, launcher packages, splash indicators, access permissions, inspect full Kotlin sources, and trigger simulated diagnostic builds.
          </p>
        </div>

        {buildPhase === 'idle' && (
          <button
            type="button"
            onClick={triggerSimSplash}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Live Preview
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Section: Configurator parameters sheets */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          {/* Quick tab switcher parameters */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 justify-start">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'settings' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                1. Core Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('permissions')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'permissions' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                2. System Permissions & Web Security
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'code' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                3. Native Source Files
              </button>
            </div>

            {/* Config Panels rendered here */}
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Core parameters */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Target Domain Address URL */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        Target Web Domain Address (URL)
                      </label>
                      <input 
                        type="url"
                        value={config.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        onBlur={(e) => setConfig(prev => ({ ...prev, url: cleanUrl(e.target.value) }))}
                        className="w-full mt-1.5 p-2.5 text-xs font-bold border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. https://domain.com"
                      />
                    </div>

                    {/* App Name */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Android App Display Name</label>
                      <input 
                        type="text"
                        value={config.appName}
                        maxLength={22}
                        onChange={(e) => setConfig(prev => ({ ...prev, appName: e.target.value }))}
                        className="w-full mt-1.5 p-2.5 text-xs font-bold border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. My Domain App"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Unique package identifier */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Android Unique Package Name</span>
                      <input 
                        type="text"
                        value={config.packageName}
                        onChange={(e) => setConfig(prev => ({ ...prev, packageName: e.target.value }))}
                        className="w-full mt-1.5 p-2.5 text-xs font-mono border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. com.mysite.webapp"
                      />
                    </div>

                    {/* App Version */}
                    <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Version Flag</span>
                      <input 
                        type="text"
                        value={config.version}
                        maxLength={10}
                        onChange={(e) => setConfig(prev => ({ ...prev, version: e.target.value }))}
                        className="w-full mt-1.5 p-2.5 text-xs font-mono font-bold border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. 1.0.0"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Color schema */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Brand Navigation Bar Tint</span>
                      <div className="flex items-center gap-2">
                        {['#3b82f6', '#10b981', '#1e293b', '#b91c1c', '#6d28d9'].map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, themeColor: col }))}
                            style={{ backgroundColor: col }}
                            className={`w-6 h-6 rounded-full border border-slate-300 transition-transform ${
                              config.themeColor === col ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Upload icon representation */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Custom Launcher Icon</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Recommended 512x512px Transparent PNG</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleIconUpload}
                          className="hidden"
                        />
                        
                        {iconSrc ? (
                          <div className="w-10 h-10 bg-white rounded-xl border overflow-hidden shrink-0">
                            <img src={iconSrc} alt="App icon" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center shrink-0">
                            <Smartphone className="w-5 h-5 text-slate-400" />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 bg-white border border-slate-250 text-[10px] font-black text-slate-700 rounded-lg shadow-xs hover:bg-slate-50 transition"
                        >
                          Upload
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Splash parameters */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Splash Loading Screen settings</span>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'classic', name: 'Classic Logo' },
                        { id: 'modern', name: 'Modern Elegant' },
                        { id: 'minimal', name: 'Minimal Spinner' }
                      ] as const).map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, splashStyle: style.id }))}
                          className={`p-2 rounded-xl text-center border text-xs font-bold transition ${
                            config.splashStyle === style.id 
                              ? 'border-blue-500 bg-blue-50/25 text-blue-700 font-extrabold' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                        <span>Splash Backdrop Tone</span>
                        <div className="flex gap-1">
                          {['#0f172a', '#1e3a8a', '#ffffff'].map((bgc) => (
                            <button
                              key={bgc}
                              type="button"
                              onClick={() => setConfig(prev => ({ ...prev, splashBgColor: bgc }))}
                              style={{ backgroundColor: bgc }}
                              className={`w-5 h-5 rounded border border-slate-300 ${
                                config.splashBgColor === bgc ? 'ring-1 ring-blue-500' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                        <span>Pinch Matrix Zoom</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={config.enableZoom}
                            onChange={(e) => setConfig(prev => ({ ...prev, enableZoom: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 2: Permissions panel */}
              {activeTab === 'permissions' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3.5"
                >
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-1">
                    Declare critical hardware/sensor permissions inside the native application compiler logs. Only check the resources your website actually queries to facilitate smooth Play Store approval!
                  </p>

                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    
                    {/* Camera */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-700">Camera / Capture Access</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Queries permissions for scanning QR/Barcodes or image capture uploads.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={config.requestCameraPerm}
                          onChange={(e) => setConfig(prev => ({ ...prev, requestCameraPerm: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-700">Geographic Location GPS</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Allows the webview to fetch fine GPS coordinates for store location mapping.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={config.requestLocationPerm}
                          onChange={(e) => setConfig(prev => ({ ...prev, requestLocationPerm: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Storage */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-700">File Storage Reads/Writes</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Needed for bulk downloads down to smartphone disk storage space.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={config.requestStoragePerm}
                          onChange={(e) => setConfig(prev => ({ ...prev, requestStoragePerm: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50 space-y-2 text-xs leading-relaxed text-slate-600">
                    <p className="font-bold text-slate-800">Advanced WebView Caching Controls:</p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      
                      <label className="flex items-center gap-2 font-semibold text-slate-700 text-[11px] cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={config.pullToRefresh}
                          onChange={(e) => setConfig(prev => ({ ...prev, pullToRefresh: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                        <span>Pull To Refresh layout</span>
                      </label>

                      <label className="flex items-center gap-2 font-semibold text-slate-700 text-[11px] cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={config.clearCacheOnExit}
                          onChange={(e) => setConfig(prev => ({ ...prev, clearCacheOnExit: e.target.checked }))}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                        />
                        <span>Flush Cache on exit</span>
                      </label>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Native Source Code viewer files */}
              {activeTab === 'code' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-400 font-sans">
                    Inspect the pristine Android Kotlin codes, Manifest specifications, and build rules bundle created instantly according to your customized configurations:
                  </p>

                  <div className="flex bg-slate-100 p-1 rounded-xl justify-start max-w-max gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('kotlin')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${
                        selectedLanguage === 'kotlin' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      MainActivity.kt
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('manifest')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${
                        selectedLanguage === 'manifest' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      AndroidManifest.xml
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('gradle')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${
                        selectedLanguage === 'gradle' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      build.gradle
                    </button>
                  </div>

                  {/* Terminal Box Viewer */}
                  <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-850 overflow-hidden font-mono text-xs text-slate-300 select-all max-h-[320px] overflow-y-auto">
                    
                    <button
                      type="button"
                      onClick={copyCodeToClipboard}
                      className="absolute top-3.5 right-3.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-black text-slate-300 rounded-lg flex items-center gap-1.5 transition select-none"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Code
                        </>
                      )}
                    </button>

                    <pre className="pr-16 text-left whitespace-pre">
                      {selectedLanguage === 'kotlin' && getKotlinCode()}
                      {selectedLanguage === 'manifest' && getAndroidManifest()}
                      {selectedLanguage === 'gradle' && getGradleFile()}
                    </pre>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Builder diagnostic interface */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              Android Gradle Native Builder Hub
            </h3>

            <p className="text-xs text-slate-400 font-sans">
              Deploy your configured splash graphics, web configurations, and assets into an Android offline container compile loop simulator.
            </p>

            {buildPhase === 'idle' ? (
              <button
                type="button"
                onClick={handleStartBuild}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                BUILD TARGET ANDROID APK
              </button>
            ) : buildPhase === 'building' ? (
              <div className="space-y-4.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <span className="flex items-center gap-2 font-black">
                    <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                    {buildStatusText}
                  </span>
                  <span className="font-mono text-blue-600">{buildProgress.toFixed(0)}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${buildProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>

                {/* Simulated building logs */}
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl max-h-[140px] overflow-y-auto text-left font-mono text-[10px] text-slate-400 space-y-1">
                  {buildLogs.map((log, index) => (
                    <p key={index} className={log.startsWith('[SYSTEM]') ? 'text-emerald-500' : (log.startsWith('[CONFIG]') ? 'text-cyan-400' : 'text-slate-400')}>
                      {log}
                    </p>
                  ))}
                </div>

              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircleIcon />
                  <div className="text-xs">
                    <p className="font-extrabold text-emerald-800">APK Generated Successfully!</p>
                    <p className="text-emerald-600 mt-1">Application packages fully compiled and aligned securely under debug signature credentials.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Download APK File */}
                  <button
                    type="button"
                    onClick={downloadApkPlaceholder}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download APK Source Manifest
                  </button>

                  {/* Reset compile */}
                  <button
                    type="button"
                    onClick={() => {
                      setBuildPhase('idle');
                      setBuildProgress(0);
                      setBuildLogs([]);
                    }}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    Recompile New Config
                  </button>

                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column Section: Interactive Phone Device Preview Simulator */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center">
          
          <div className="w-full text-center max-w-sm mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-300" />
              Live Android Simulator
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Test how splash layout overlays, navigation parameters, and status indicators align before packaging compiles.
            </p>
          </div>

          {/* Genuine Smartphone Device Outer mockup Frame */}
          <div className="w-[316px] h-[640px] bg-slate-900 rounded-[48px] p-3 text-slate-900 shadow-2xl relative border-4 border-slate-700/60 ring-15 ring-slate-800/10 flex flex-col justify-between">
            
            {/* Top Ear Speaker node / Camera Punchhole island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
              <div className="w-12 h-1 bg-slate-800 rounded-full shrink-0" />
            </div>

            {/* Simulated Glass Panel Interface Screen wrapper */}
            <div className="w-full h-full rounded-[38px] bg-white overflow-hidden relative border border-black/10 flex flex-col justify-start">
              
              {/* Inner screen contents conditional renders */}
              <AnimatePresence mode="wait">
                
                {/* Simulated Screen 1: Splash Activity display */}
                {simState === 'splash' && (
                  <motion.div
                    key="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ backgroundColor: config.splashBgColor }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center select-none"
                  >
                    {/* Splash Style 1: Classic Logo representation */}
                    {config.splashStyle === 'classic' && (
                      <div className="space-y-4 flex flex-col items-center">
                        {iconSrc ? (
                          <img src={iconSrc} alt="Launcher logo" className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg animate-pulse" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-black text-3xl font-mono shadow-md animate-pulse">
                            {config.appName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <h4 className="text-white font-black text-sm tracking-tight">{config.appName}</h4>
                        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-white rounded-full animate-infinite-slide" />
                        </div>
                      </div>
                    )}

                    {/* Splash Style 2: Modern elegant */}
                    {config.splashStyle === 'modern' && (
                      <div className="space-y-4 flex flex-col items-center">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-500/80 animate-spin flex items-center justify-center">
                            {iconSrc ? (
                              <img src={iconSrc} alt="App template logo" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                              <Globe className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-mono tracking-widest text-blue-500 font-extrabold uppercase uppercase">CREATIVE SUITE LOAD</p>
                          <h4 className="text-white text-base font-black tracking-tight">{config.appName}</h4>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold font-mono">v{config.version}</p>
                      </div>
                    )}

                    {/* Splash Style 3: Minimal simple */}
                    {config.splashStyle === 'minimal' && (
                      <div className="space-y-3.5 flex flex-col items-center">
                        <RefreshCw className="w-8 h-8 text-slate-400 rotate-animation animate-spin" />
                        <p className="text-[10px] text-slate-400 font-bold font-mono">Powering secure WebView app...</p>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* Simulated Screen 2: Real Active WebView browser dashboard */}
                {simState === 'web' && (
                  <motion.div
                    key="web-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col justify-between"
                  >
                    {/* Phone Top statusbar line */}
                    <div style={{ backgroundColor: config.themeColor }} className="w-full h-8 px-5 flex items-center justify-between text-white text-[9px] font-bold shrink-0 pt-3 select-none">
                      <span>12:45 PM</span>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3 text-white" />
                        <span>LTE</span>
                        <div className="w-4 h-2 rounded border border-white flex items-center p-0.5 justify-start">
                          <div className="w-2.5 h-full bg-white rounded-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Webview Custom mock URL title bar */}
                    <div className="w-full bg-slate-50 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between gap-2.5 shrink-0 select-none">
                      <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                        <ArrowLeft className="w-3.5 h-3.5 hover:text-slate-700" />
                        <ArrowRight className="w-3.5 h-3.5 hover:text-slate-700 opacity-40" />
                      </div>

                      <div className="flex-1 bg-slate-200/60 rounded-lg px-2 py-1 text-[9px] font-mono text-slate-500 truncate flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{config.url}</span>
                      </div>

                      <RefreshCw className="w-3 h-3 text-slate-500 shrink-0 cursor-pointer" onClick={triggerSimSplash} />
                    </div>

                    {/* WebView dynamic body simulation */}
                    <div className="flex-1 w-full bg-slate-100 flex flex-col items-center justify-center p-5 relative">
                      
                      {/* Pull to refresh visual layout simulation handle */}
                      {config.pullToRefresh && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 py-1 px-2.5 bg-white border border-slate-200 rounded-full shadow-xs text-[9px] font-extrabold text-blue-600 flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          Refreshing page
                        </div>
                      )}

                      <div className="w-full text-center space-y-4">
                        
                        <div className="w-14 h-14 bg-white shadow-xs rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
                          {iconSrc ? (
                            <img src={iconSrc} alt="Sim browser logo" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <Globe className="w-7 h-7 text-blue-600" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-black text-xs text-slate-800 tracking-tight">{config.appName}</h5>
                          <p className="text-[10px] text-slate-400 font-semibold">Native App WebView container active</p>
                        </div>

                        {/* Creative mockup elements */}
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-250 text-left text-[9.5px] leading-relaxed text-slate-500 font-sans space-y-2">
                          <p className="font-extrabold text-slate-700">Mock Web Experience:</p>
                          <p>Currently viewing the responsive shell of {config.url}. In the compiled application, this viewport serves the fully interactive JavaScript/HTML modules of your endpoint precisely.</p>
                          <div className="flex items-center gap-1.5 text-[8.5px] font-black text-blue-600 cursor-pointer" onClick={() => window.open(config.url, '_blank')}>
                            Open real browser site
                            <ExternalLink className="w-3 h-3 text-blue-600" />
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* App Bottom nav bar */}
                    <div className="w-full h-13 bg-white px-6 border-t border-slate-200/80 flex items-center justify-between shrink-0 select-none pb-1 text-slate-400">
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer text-blue-600">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-[8px] font-extrabold">Device View</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-slate-700" onClick={triggerSimSplash}>
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-[8px] font-extrabold">Reload Splash</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-slate-700" onClick={() => setActiveTab('code')}>
                        <Code2 className="w-4 h-4" />
                        <span className="text-[8px] font-extrabold">Copy Kotlin</span>
                      </div>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

              {/* Bottom Android soft-key navigation strip line */}
              <div className="w-full h-5 bg-black/5 shrink-0 flex items-center justify-center pb-1 gap-12 select-none pointer-events-none">
                <div className="w-3 h-3 border-2 border-slate-400/80 rounded-sm" />
                <div className="w-3.5 h-3.5 border-2 border-slate-400/80 rounded-full" />
                <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400/80 rotate-135" />
              </div>

            </div>

          </div>

          {/* Pro Tips Helper guides down */}
          <div className="w-full max-w-sm mt-5 bg-blue-50/40 p-4.5 rounded-2xl border border-blue-50 flex items-start gap-3 text-[11px] text-slate-500">
            <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">APK Compiler instructions:</p>
              <ul className="list-disc pl-3.5 space-y-1.5 text-left leading-relaxed">
                <li>You can inspect, select, and copy the actual native **Android Kotlin**, **AndroidManifest**, or **build.gradle** from the panels to compile directly locally in **Android Studio**.</li>
                <li>Your app has integrated deep R8 minification configurations to strip out unnecessary Java resources, yielding a compact, fast-loading production wrapper!</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Internal icon helpers
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

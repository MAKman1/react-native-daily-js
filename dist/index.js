"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyMediaView = exports.removeAppStateListener = exports.setupAppStateListener = exports.appStateSubscription = void 0;
var daily_js_1 = __importDefault(require("@daily-co/daily-js"));
var react_native_webrtc_1 = require("@daily-co/react-native-webrtc");
var DailyMediaView_1 = __importDefault(require("./DailyMediaView"));
exports.DailyMediaView = DailyMediaView_1.default;
var iOSCallObjectBundleCache_1 = __importDefault(require("./iOSCallObjectBundleCache"));
require("react-native-url-polyfill/auto"); // Applies global URL polyfill
var react_native_background_timer_1 = __importDefault(require("react-native-background-timer"));
var react_native_1 = require("react-native");
var DailyNativeUtils = react_native_1.NativeModules.DailyNativeUtils, WebRTCModule = react_native_1.NativeModules.WebRTCModule;
var webRTCEventEmitter = new react_native_1.NativeEventEmitter(WebRTCModule);
var hasAudioFocus;
var appState;
var appStateSubscription;
exports.appStateSubscription = appStateSubscription;
var audioFocusChangeListeners = new Set();
var appActiveStateChangeListeners = new Set();
function setupEventListeners() {
    // audio focus: used by daily-js to auto-mute mic, for instance
    if (react_native_1.Platform.OS === 'android') {
        hasAudioFocus = true; // safe assumption, hopefully
        webRTCEventEmitter.addListener('EventAudioFocusChange', function (event) {
            if (!event || typeof event.hasFocus !== 'boolean') {
                console.error('invalid EventAudioFocusChange event');
            }
            var hadAudioFocus = hasAudioFocus;
            hasAudioFocus = event.hasFocus;
            if (hadAudioFocus !== hasAudioFocus) {
                audioFocusChangeListeners.forEach(function (listener) {
                    return listener(hasAudioFocus);
                });
            }
        });
    }
    // app active state: used by daily-js to auto-mute cam, for instance
    setupAppStateListener();
}
function setupAppStateListener() {
    appState = react_native_1.AppState.currentState;
    exports.appStateSubscription = appStateSubscription = react_native_1.AppState.addEventListener('change', function (nextState) {
        var previousState = appState;
        appState = nextState;
        var wasActive = previousState === 'active';
        var isActive = appState === 'active';
        if (wasActive !== isActive) {
            appActiveStateChangeListeners.forEach(function (listener) { return listener(isActive); });
        }
    });
}
exports.setupAppStateListener = setupAppStateListener;
function removeAppStateListener() {
    if (appStateSubscription) {
        appStateSubscription.remove();
        exports.appStateSubscription = appStateSubscription = null;
    }
}
exports.removeAppStateListener = removeAppStateListener;
function setupGlobals() {
    // WebRTC APIs + global `window` object
    react_native_webrtc_1.registerGlobals();
    // A shim to prevent errors in call machine bundle (not ideal)
    global.window.addEventListener = function () { };
    // A workaround for iOS HTTP cache not caching call object bundle due to size
    if (react_native_1.Platform.OS === 'ios') {
        global.iOSCallObjectBundleCache = iOSCallObjectBundleCache_1.default;
    }
    // Let timers run while Android app is in the background.
    // See https://github.com/jitsi/jitsi-meet/blob/caabdadf19ae5def3f8173acec6c49111f50a04e/react/features/mobile/polyfills/browser.js#L409,
    // where this technique was borrowed from.
    // For now we don't need this for iOS since we're recommending that apps use
    // the "voip" background mode capability, which keeps the app running normally
    // during a call.
    if (react_native_1.Platform.OS === 'android') {
        global.clearTimeout = react_native_background_timer_1.default.clearTimeout.bind(react_native_background_timer_1.default);
        global.clearInterval = react_native_background_timer_1.default.clearInterval.bind(react_native_background_timer_1.default);
        global.setInterval = react_native_background_timer_1.default.setInterval.bind(react_native_background_timer_1.default);
        global.setTimeout = function (fn, ms) {
            if (ms === void 0) { ms = 0; }
            return react_native_background_timer_1.default.setTimeout(fn, ms);
        };
    }
    global.DailyNativeUtils = __assign(__assign({}, DailyNativeUtils), { setAudioMode: WebRTCModule.setDailyAudioMode, enableNoOpRecordingEnsuringBackgroundContinuity: WebRTCModule.enableNoOpRecordingEnsuringBackgroundContinuity, addAudioFocusChangeListener: function (listener) {
            audioFocusChangeListeners.add(listener);
        }, removeAudioFocusChangeListener: function (listener) {
            audioFocusChangeListeners.delete(listener);
        }, addAppActiveStateChangeListener: function (listener) {
            appActiveStateChangeListeners.add(listener);
        }, removeAppActiveStateChangeListener: function (listener) {
            appActiveStateChangeListeners.delete(listener);
        }, platform: react_native_1.Platform });
}
setupEventListeners();
setupGlobals();
exports.default = daily_js_1.default;
__exportStar(require("@daily-co/daily-js"), exports);
__exportStar(require("@daily-co/react-native-webrtc"), exports);

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_webrtc_1 = require("@daily-co/react-native-webrtc");
function DailyMediaView(props) {
    var _a = react_1.useState(null), stream = _a[0], setStream = _a[1];
    react_1.useEffect(function () {
        var tracks = [props.videoTrack, props.audioTrack].filter(function (t) { return t; });
        var stream = tracks.length > 0 ? new react_native_webrtc_1.MediaStream(tracks) : null;
        setStream(stream);
    }, [props.videoTrack, props.audioTrack]);
    var rtcView = stream ? (<react_native_webrtc_1.RTCView streamURL={stream.toURL()} mirror={props.mirror} zOrder={props.zOrder} objectFit={props.objectFit} 
    // on iOS, hide if there's no video track in order to prevent a frozen
    // frame from being displayed. audio playback is unaffected.
    // on Android, hiding is unnecessary since no frozen frame is displayed,
    // and in fact triggers a bug where if it's hidden while in the background
    // it gets "stuck" in the hidden state.
    style={props.videoTrack || react_native_1.Platform.OS === 'android'
        ? props.style
        : { display: 'none' }}/>) : null;
    // provide empty placeholder when no video is playing, to try to avoid
    // messing with any layout that depends on this DailyMediaView's style
    var placeholderView = props.videoTrack ? null : (<react_native_1.View style={props.style}/>);
    return (<>
      {rtcView}
      {placeholderView}
    </>);
}
exports.default = DailyMediaView;

/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { MediaStreamTrack, RTCViewProps } from '@daily-co/react-native-webrtc';
declare type Props = {
    videoTrack: MediaStreamTrack | null;
    audioTrack: MediaStreamTrack | null;
    mirror?: RTCViewProps['mirror'];
    zOrder?: RTCViewProps['zOrder'];
    objectFit?: RTCViewProps['objectFit'];
    style?: ViewStyle;
};
export default function DailyMediaView(props: Props): JSX.Element;
export {};

/// <reference types="react-native" />
declare type CacheResponse = {
    code?: string;
    refetchHeaders?: Headers;
};
/**
 * A workaround for the fact that the iOS HTTP cache won't cache the call
 * object bundle due to size.
 */
export default class iOSCallObjectBundleCache {
    static get(url: string, ignoreExpiry?: boolean): Promise<CacheResponse | null>;
    static renew(url: string, headers: Headers): Promise<CacheResponse>;
    static set(url: string, code: string, headers: Headers): Promise<void>;
}
export {};

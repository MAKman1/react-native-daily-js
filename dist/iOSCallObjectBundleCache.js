"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var FIELD_CACHE_EXPIRY = 'expiry';
var FIELD_BUNDLE_CODE = 'code';
var FIELD_BUNDLE_LAST_MODIFIED = 'last-modified';
var FIELD_BUNDLE_ETAG = 'etag';
var REQUIRED_FIELDS = [FIELD_BUNDLE_CODE, FIELD_CACHE_EXPIRY];
var DEFAULT_EXPIRY_MS = 60 * 1000;
function cacheKeyForUrl(url) {
    return "callobj_bundle_" + url;
}
/**
 * A workaround for the fact that the iOS HTTP cache won't cache the call
 * object bundle due to size.
 */
var iOSCallObjectBundleCache = /** @class */ (function () {
    function iOSCallObjectBundleCache() {
    }
    iOSCallObjectBundleCache.get = function (url, ignoreExpiry) {
        if (ignoreExpiry === void 0) { ignoreExpiry = false; }
        return __awaiter(this, void 0, void 0, function () {
            var now, cacheItemString, cacheItem, _i, REQUIRED_FIELDS_1, field, headers, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_storage_1.default.getItem(cacheKeyForUrl(url))];
                    case 2:
                        cacheItemString = _a.sent();
                        // If cache miss, return null
                        if (!cacheItemString) {
                            return [2 /*return*/, null];
                        }
                        cacheItem = JSON.parse(cacheItemString);
                        // Check cache item for missing required fields
                        for (_i = 0, REQUIRED_FIELDS_1 = REQUIRED_FIELDS; _i < REQUIRED_FIELDS_1.length; _i++) {
                            field = REQUIRED_FIELDS_1[_i];
                            if (!cacheItem[field]) {
                                throw new Error("Missing call object bundle cache item field: " + field);
                            }
                        }
                        // If cache expired, return headers needed to conditionally fetch the
                        // bundle again
                        if (!ignoreExpiry && now > cacheItem[FIELD_CACHE_EXPIRY]) {
                            headers = {};
                            // Only set headers for validators (ETag, Last-Modified) that exist in
                            // the cache item
                            cacheItem[FIELD_BUNDLE_ETAG] &&
                                (headers['if-none-match'] = cacheItem[FIELD_BUNDLE_ETAG]);
                            cacheItem[FIELD_BUNDLE_LAST_MODIFIED] &&
                                (headers['if-modified-since'] =
                                    cacheItem[FIELD_BUNDLE_LAST_MODIFIED]);
                            return [2 /*return*/, { refetchHeaders: new Headers(headers) }];
                        }
                        // Return cached code
                        return [2 /*return*/, { code: cacheItem[FIELD_BUNDLE_CODE] }];
                    case 3:
                        e_1 = _a.sent();
                        // console.log("[iOSCallObjectBundleCache] error in get", url, e);
                        // Clear potentially problematic cache entry and return null
                        async_storage_1.default.removeItem(cacheKeyForUrl(url));
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    iOSCallObjectBundleCache.renew = function (url, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(url, true)];
                    case 1:
                        cacheResponse = _a.sent();
                        if (!(cacheResponse && cacheResponse.code)) {
                            throw new Error('Attempting to renew a call object bundle cache item that is missing');
                        }
                        this.set(url, cacheResponse.code, headers);
                        return [2 /*return*/, cacheResponse];
                }
            });
        });
    };
    iOSCallObjectBundleCache.set = function (url, code, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var expiry, cacheControlHeader, expiryMatch, etag, lastModified, cacheItem;
            return __generator(this, function (_a) {
                // console.log("[iOSCallObjectBundleCache] set", url, headers);
                if (!code) {
                    return [2 /*return*/];
                }
                expiry = DEFAULT_EXPIRY_MS;
                cacheControlHeader = headers.get('cache-control');
                if (cacheControlHeader) {
                    expiryMatch = cacheControlHeader.match(/max-age=([0-9]+)/i);
                    if (expiryMatch && expiryMatch[1] && !isNaN(Number(expiryMatch[1]))) {
                        expiry = Date.now() + Number(expiryMatch[1]) * 1000;
                    }
                }
                etag = headers.get('etag');
                lastModified = headers.get('last-modified');
                cacheItem = {};
                cacheItem[FIELD_BUNDLE_CODE] = code;
                cacheItem[FIELD_CACHE_EXPIRY] = expiry;
                cacheItem[FIELD_BUNDLE_ETAG] = etag;
                cacheItem[FIELD_BUNDLE_LAST_MODIFIED] = lastModified;
                return [2 /*return*/, async_storage_1.default.setItem(cacheKeyForUrl(url), JSON.stringify(cacheItem))];
            });
        });
    };
    return iOSCallObjectBundleCache;
}());
exports.default = iOSCallObjectBundleCache;

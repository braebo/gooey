/**
 * Detects the current operating system.  On the server, the request object must be provided.
 * @param request - The request object. If not provided, the global `navigator` object is used.
 * @returns The operating system.  Note: `ipados` is separate from `ios`.
 */
export declare function getOS(request?: Request): 'mac' | 'windows' | 'linux' | 'android' | 'ios' | 'ipados';
/**
 * Detects the current browser.
 */
export declare function getBrowser(request?: Request): 'chrome' | 'firefox' | 'safari' | 'other';
/**
 * Resolves the user agent string.  On the server, the request object must be provided.
 * @param request - The request object. If not provided, the global `navigator` object is returned.
 */
export declare function getUserAgent(request?: Request): string;
/**
 * Detects if the current browser matches the provided platform.
 */
export declare function isPlatform(platform: RegExp, request?: Request): boolean;
/**
 * Detects if the current browser is a webview. The request parameter is required on the server.
 * @param request - The request object. If not provided, the global `navigator` object is used.
 */
export declare function isWebview(request?: Request): boolean;
/**
 * `true` if the current browser is running on a desktop.
 */
export declare function isDesktop(request?: Request): boolean;
/**
 * `true` if the current browser is running on MacOS.
 */
export declare function isMac(request?: Request): boolean;
/**
 * `true` if the current browser is running on MacOS.
 */
export declare function isApple(request?: Request): boolean;
/**
 * `true` if the current browser is running on Windows.
 */
export declare function isWindows(request?: Request): boolean;
/**
 * `true` if the current browser is running on Linux.
 */
export declare function isLinux(request?: Request): boolean;
/**
 * `true` when running in a browser.
 */
export declare function isBrowser(): boolean;
/**
 * `true` when running in a server environment.
 */
export declare function isServer(): boolean;
/**
 * `true` if the current browser is running on a mobile device.
 */
export declare function isMobile(request?: Request): boolean;
/**
 * `true` if the current browser is running on iOS.
 */
export declare function isIOS(request?: Request): boolean;
/**
 * `true` if the current browser is running on iPadOS.
 */
export declare function isIPadOS(request?: Request): boolean;
/**
 * `true` if the current browser is running on an iPad.
 */
export declare function isIPad(request?: Request): boolean;
/**
 * `true` if the current browser is running on Android.
 */
export declare function isAndroid(request?: Request): boolean;
/**
 * `true` if the current browser is running on Safari.
 */
export declare function isSafari(request?: Request): boolean;
/**
 * `true` if the current browser is Chrome.
 */
export declare function isChrome(request?: Request): boolean;
/**
 * `true` if the current browser is Firefox.
 */
export declare function isFirefox(request?: Request): boolean;
/**
 * `true` if the current browser is Edge.
 */
export declare function isEdge(request?: Request): boolean;

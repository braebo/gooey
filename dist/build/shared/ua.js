/**
 * Detects the current operating system.  On the server, the request object must be provided.
 * @param request - The request object. If not provided, the global `navigator` object is used.
 * @returns The operating system.  Note: `ipados` is separate from `ios`.
 */
export function getOS(request) {
    if (isIOS(request))
        return 'ios';
    if (isIPad(request))
        return 'ipados';
    if (isAndroid(request))
        return 'android';
    if (isMac(request))
        return 'mac';
    if (isWindows(request))
        return 'windows';
    if (isLinux(request))
        return 'linux';
    throw new Error('Unknown platform');
}
/**
 * Detects the current browser.
 */
export function getBrowser(request) {
    if (isChrome(request) || isEdge(request))
        return 'chrome';
    if (isFirefox(request))
        return 'firefox';
    if (isSafari(request))
        return 'safari';
    return 'other';
}
/**
 * Resolves the user agent string.  On the server, the request object must be provided.
 * @param request - The request object. If not provided, the global `navigator` object is returned.
 */
export function getUserAgent(request) {
    if (typeof globalThis.navigator === 'undefined' && !request) {
        console.error('Error getting user-agent: Request object is required on the server, but was not provided.');
    }
    return request?.headers.get('user-agent') || globalThis.navigator?.userAgent;
}
/**
 * Detects if the current browser matches the provided platform.
 */
export function isPlatform(platform, request) {
    const ua = getUserAgent(request);
    return !!ua?.match(platform);
}
/**
 * Detects if the current browser is a webview. The request parameter is required on the server.
 * @param request - The request object. If not provided, the global `navigator` object is used.
 */
export function isWebview(request) {
    return !!getUserAgent(request).match(/webview|wv|ip((?!.*Safari)|(?=.*like Safari))/i);
}
/**
 * `true` if the current browser is running on a desktop.
 */
export function isDesktop(request) {
    return !isMobile(request);
}
/**
 * `true` if the current browser is running on MacOS.
 */
export function isMac(request) {
    return isPlatform(/mac/i, request) && !isMobile(request);
}
/**
 * `true` if the current browser is running on MacOS.
 */
export function isApple(request) {
    return (isMac(request) || isIOS(request) || isIPad(request) || isIPadOS(request) || isIPad(request));
}
/**
 * `true` if the current browser is running on Windows.
 */
export function isWindows(request) {
    return isPlatform(/win/i, request);
}
/**
 * `true` if the current browser is running on Linux.
 */
export function isLinux(request) {
    return isPlatform(/linux/i, request);
}
/**
 * `true` when running in a browser.
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}
/**
 * `true` when running in a server environment.
 */
export function isServer() {
    return typeof window === 'undefined';
}
/**
 * `true` if the current browser is running on a mobile device.
 */
export function isMobile(request) {
    return isAndroid(request) || isIOS(request) || isIPad(request);
}
/**
 * `true` if the current browser is running on iOS.
 */
export function isIOS(request) {
    return isPlatform(/iphone/i, request);
}
/**
 * `true` if the current browser is running on iPadOS.
 */
export function isIPadOS(request) {
    return isIPad(request);
}
/**
 * `true` if the current browser is running on an iPad.
 */
export function isIPad(request) {
    // return isSafari(request) && !isIOS(request)
    return isPlatform(/ipad/i, request);
}
/**
 * `true` if the current browser is running on Android.
 */
export function isAndroid(request) {
    return isPlatform(/android/i, request);
}
/**
 * `true` if the current browser is running on Safari.
 */
export function isSafari(request) {
    return isPlatform(/^((?!chrome|android).)*safari/i, request);
}
/**
 * `true` if the current browser is Chrome.
 */
export function isChrome(request) {
    return isPlatform(/chrome/i, request);
}
/**
 * `true` if the current browser is Firefox.
 */
export function isFirefox(request) {
    return isPlatform(/firefox/i, request);
}
/**
 * `true` if the current browser is Edge.
 */
export function isEdge(request) {
    return isPlatform(/edg/i, request);
}

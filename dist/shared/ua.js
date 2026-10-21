//#region src/shared/ua.ts
/**
* Resolves the user agent string.  On the server, the request object must be provided.
* @param request - The request object. If not provided, the global `navigator` object is returned.
*/
function getUserAgent(request) {
	if (typeof globalThis.navigator === "undefined" && !request) console.error("Error getting user-agent: Request object is required on the server, but was not provided.");
	return request?.headers.get("user-agent") || globalThis.navigator?.userAgent;
}
/**
* Detects if the current browser matches the provided platform.
*/
function isPlatform(platform, request) {
	return !!getUserAgent(request)?.match(platform);
}
/**
* `true` if the current browser is running on MacOS.
*/
function isMac(request) {
	return isPlatform(/mac/i, request) && !isMobile(request);
}
/**
* `true` if the current browser is running on MacOS.
*/
function isApple(request) {
	return isMac(request) || isIOS(request) || isIPad(request) || isIPadOS(request) || isIPad(request);
}
/**
* `true` if the current browser is running on a mobile device.
*/
function isMobile(request) {
	return isAndroid(request) || isIOS(request) || isIPad(request);
}
/**
* `true` if the current browser is running on iOS.
*/
function isIOS(request) {
	return isPlatform(/iphone/i, request);
}
/**
* `true` if the current browser is running on iPadOS.
*/
function isIPadOS(request) {
	return isIPad(request);
}
/**
* `true` if the current browser is running on an iPad.
*/
function isIPad(request) {
	return isPlatform(/ipad/i, request);
}
/**
* `true` if the current browser is running on Android.
*/
function isAndroid(request) {
	return isPlatform(/android/i, request);
}

//#endregion
export { isApple, isMac };
//# sourceMappingURL=ua.js.map
export function isInAppBrowser() {
  const userAgent = navigator.userAgent || window.opera;
  
  // Focus only on problematic social media in-app browsers
  if (/LinkedIn/i.test(userAgent)) return true;
  if (/FBAN|FBAV/i.test(userAgent)) return true; // Facebook
  if (/Twitter/i.test(userAgent)) return true;
  if (/Instagram/i.test(userAgent)) return true;
  
  // Return false for all other cases
  return false;
}
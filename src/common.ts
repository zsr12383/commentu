export const isValidURL = (e: chrome.webNavigation.WebNavigationFramedCallbackDetails) =>
  e.url.match(/^https:\/\/www.youtube.com\/watch?.+/);

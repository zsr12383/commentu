const isValidURL = (e: chrome.webNavigation.WebNavigationFramedCallbackDetails) =>
  e.url.match(/^https:\/\/www.youtube.com\/watch?.+/);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.webNavigation.onCompleted.addListener(function (e) {
  if (e.frameId || !isValidURL(e)) return;
  console.log(e.frameId);
  chrome.storage.local.get('enabled', (data) => {
    if (!data.enabled) return;
    runScript(e.tabId);
  });
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (e) {
  if (e.frameId || !isValidURL(e)) return;
  console.log(e.frameId);
  chrome.storage.local.get('enabled', (data) => {
    if (!data.enabled) return;
    runScript(e.tabId);
  });
});

async function runScript(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['js/content_script.js'],
  });
}

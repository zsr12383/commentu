import { isValidURL } from './common/URL';

function debounce(func: any) {
  const table: any = {};
  return (tabId: number) => {
    if (table[tabId]) clearTimeout(table[tabId]);
    table[tabId] = setTimeout(() => {
      func(tabId);
    }, 1600);
  };
}

const debounceRunScript = debounce(runScript);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    transparency: 70,
  });
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((e) => {
//   if (e.frameId || !isValidURL(e.url)) return;
//   chrome.storage.local.get('enabled', (data) => {
//     if (data.enabled) debounceRunScript(e.tabId);
//   });
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url || !(tab.url && isValidURL(tab.url))) return;
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled) debounceRunScript(tabId);
    console.log(new Date().getTime());
  });
});

function runScript(tabId: number) {
  chrome.tabs.get(tabId, function () {
    if (chrome.runtime.lastError) return;
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['js/mountScript.js'],
    });
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'local') return;
  const data = Object.entries(changes).find((ele) => {
    const [key] = ele;
    return key === 'enabled';
  });
  if (!data) return;
  const { newValue } = data[1];
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
      if (!tab.id || !tab.url || !isValidURL(tab.url) || !newValue) return;
      runScript(tab.id);
    });
  });
});

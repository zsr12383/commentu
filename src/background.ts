import { isValidURL } from './common/URL';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    opacity: 70,
    duration: 5,
    'number of messages': 1,
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!changeInfo.url || !(tab.url && isValidURL(tab.url))) return;
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled) runScript(tabId);
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

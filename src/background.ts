import { isValidURL } from './common';

function debounce() {
  const table: any = {};
  return (tabId: number) => {
    if (table[tabId]) clearTimeout(table[tabId]);
    table[tabId] = setTimeout(() => {
      runScript(tabId);
    }, 512);
  };
}

const debounceFunc = debounce();

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.webNavigation.onHistoryStateUpdated.addListener((e) => {
  if (e.frameId || !isValidURL(e)) return;
  chrome.storage.local.get('enabled', (data) => {
    debounceFunc(e.tabId);
  });
});

async function runScript(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['js/content_script.js'],
  });
}

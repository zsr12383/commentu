import { isValidURL } from './common/URL';

function debounce(func: any) {
  const table: any = {};
  return (tabId: number) => {
    if (table[tabId]) clearTimeout(table[tabId]);
    table[tabId] = setTimeout(() => {
      func(tabId);
    }, 2000);
  };
}

const debounceRunScript = debounce(runScript);
const debounceTurnOff = debounce(turnOff);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.webNavigation.onHistoryStateUpdated.addListener((e) => {
  if (e.frameId) return;
  if (isValidURL(e.url)) {
    chrome.storage.local.get('enabled', (data) => {
      if (data.enabled) debounceRunScript(e.tabId);
    });
  } else {
    debounceTurnOff(e.tabId);
  }
});

function runScript(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['js/mountScript.js'],
  });
}

function turnOff(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['js/unMount.js'],
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'local') return;
  const data = Object.entries(changes).find((ele) => {
    const [key] = ele;
    return key === 'enabled';
  });
  if (!data) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { newValue } = data[1];

  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
      if (!tab.id || !tab.url || !isValidURL(tab.url)) return;
      if (newValue === true) {
        runScript(tab.id);
      } else if (newValue === false) {
        // turnOff(tab.id);
      }
    });
  });
});

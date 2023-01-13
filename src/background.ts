import { isValidURL } from './common/URL';

function debounce() {
  const table: any = {};
  return (tabId: number) => {
    if (table[tabId]) clearTimeout(table[tabId]);
    table[tabId] = setTimeout(() => {
      runScript(tabId);
    }, 2000);
  };
}

const debounceFunc = debounce();

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.webNavigation.onHistoryStateUpdated.addListener((e) => {
  if (e.frameId || !isValidURL(e.url)) return;
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

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   // eslint-disable-next-line no-restricted-syntax
//   for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`,
//     );
//   }
// });
// 탭 별로 돌면서 runscript 돌리기, 이것도 나중에 따로 이벤트 만들어야함

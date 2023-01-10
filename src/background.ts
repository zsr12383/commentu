chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.runtime.onMessage.addListener((message /* sender, sendResponse */) => {
  if (typeof message === 'object' && message.type === 'btnChange') {
    runBtnChangeCallBack(chrome);
  }
  return true;
});

chrome.webNavigation.onCompleted.addListener(function (e) {
  chrome.storage.local.get('enabled', (data) => {
    if (isValidTrigger(data, e)) runScript();
  });
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (e) {
  chrome.storage.local.get('enabled', (data) => {
    if (isValidTrigger(data, e)) runScript();
  });
});

async function runBtnChangeCallBack(chrome: typeof globalThis.chrome) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.match(/^https:\/\/www.youtube.com\/watch?.+/)) {
    console.log(tab);
    console.log('Invalid_URL');
    return;
  }
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled) {
      chrome.scripting.executeScript({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target: { tabId: tab.id },
        files: ['content.js'],
      });
    } else {
      // 여기서 컨텐츠로 메시지 보내거나 아니면 그냥 바로 팝업에서 보내도 될듯?
      console.log('button off');
    }
  });
}

async function runScript() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
}

const isValidTrigger = (
  data: { [x: string]: any; enabled?: any },
  e: chrome.webNavigation.WebNavigationFramedCallbackDetails,
) => data.enabled && e.url.match(/^https:\/\/www.youtube.com\/watch?.+/);

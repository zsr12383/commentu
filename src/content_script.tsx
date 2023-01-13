import { isValidURL } from './common/URL';

function getTime(currentTimeString: string) {
  if (currentTimeString.length > 5)
    return (
      parseInt(currentTimeString.replace(/:.+/, ''), 10) * 3600 +
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parseInt(currentTimeString.match(/:([0-9]+):/)[1], 10) * 60 +
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parseInt(currentTimeString.match(/[0-9]+$/)[0], 10)
    );
  return (
    parseInt(currentTimeString.replace(/:[0-9]+/, ''), 10) * 60 + parseInt(currentTimeString.replace(/[0-9]+:/, ''), 10)
  );
}

async function getReply() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const target = window.location.search.match(/=([^=&/]+)/)[1];
  const apiKey = 'AIzaSyAZTp4U-uezgl12gW_Vu4yZDQ9Z6styTuY';

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${apiKey}&videoId=${target}&maxResults=100`;
  const reply: any[] = [];
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.items.forEach((ele: { snippet: { topLevelComment: { snippet: { textDisplay: never } } } }) => {
        reply.push(ele.snippet.topLevelComment.snippet.textDisplay);
      });
    });
  const ans = {};
  reply.forEach((ele) => {
    let tmp;
    // eslint-disable-next-line no-cond-assign
    if ((tmp = ele.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ans[getTime(tmp[1])] = ele;
    }
  });
  return ans;
}

(async function () {
  const currentURL = document.location.href;
  if (!isValidURL(currentURL)) return;
  const data = await chrome.storage.local.get(currentURL);
  console.log(data);
  if (!data[currentURL]) {
    const reply = await getReply();
    console.log(reply);
  }

  // 이미 있는지 확인
  // O.자막을 꺼내온다.
  // X.댓글을 받아오고 저장한다.
  // on/off 여부를 통해 자막 삽입하는 script 실행
})();

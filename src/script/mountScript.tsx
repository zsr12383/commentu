import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import { isValidURL } from '../common/URL';

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

async function fetchAPI(url: string) {
  const tmpArray: any = [];
  let nextPageToken = '';
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) return;
      // eslint-disable-next-line prefer-destructuring
      if (data.nextPageToken) nextPageToken = data.nextPageToken;
      data.items.forEach((ele: { snippet: { topLevelComment: { snippet: { textDisplay: never } } } }) => {
        tmpArray.push(ele.snippet.topLevelComment.snippet);
      });
    });
  return { tmpArray, nextPageToken };
}

const repeatFetch = async (ret: any, cnt: number, apiKey: string, target: string) => {
  let i = 0;
  let reply: any = [];
  while (ret.nextPageToken && i < cnt) {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${apiKey}&videoId=${target}&maxResults=100&pageToken=${ret.nextPageToken}`;
    // eslint-disable-next-line no-param-reassign,no-await-in-loop
    ret = await fetchAPI(url);
    // eslint-disable-next-line no-param-reassign
    reply = [...reply, ...ret.tmpArray];
    i += 1;
  }
  return reply;
};

async function getReply() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const target = window.location.search.match(/=([^=&/]+)/)[1];
  const apiKey = process.env.API_KEY ? process.env.API_KEY : '';
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${apiKey}&videoId=${target}&maxResults=100`;
  let reply: any[] = [];
  const ret = await fetchAPI(url);
  reply = [...ret.tmpArray];
  reply = [...reply, ...(await repeatFetch(ret, 2, apiKey, target))];
  const res = {};
  reply.forEach((ele) => {
    let tmp;
    const { textDisplay, textOriginal } = ele;
    // eslint-disable-next-line no-cond-assign
    if ((tmp = textDisplay.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res[getTime(tmp[1])] = textOriginal;
    }
  });
  return res;
}

function bundleComments(replys: any) {
  const res = {};
  Object.entries(replys).forEach((ele) => {
    const [time, reply] = ele;
    let indexTime = parseInt(time, 10) - 1;
    indexTime = indexTime < 5 ? 5 : indexTime;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    res[indexTime] ? res[indexTime].push(reply) : (res[indexTime] = [reply]);
  });
  return res;
}

function remove() {
  const root = document.getElementById('commentu');
  if (!root) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
}

function removeHandler(this: HTMLMediaElement) {
  this.removeEventListener('abort', removeHandler);
  remove();
}

function ReplyList() {
  const [comments, setComments] = useState<any>(null);

  useEffect(() => {
    getReply().then((reply) => {
      setComments(bundleComments(reply));
    });
  }, []);

  useEffect(() => {
    if (comments === null) return;
    console.log(comments);
    const videoElement = document.querySelector('video') as HTMLMediaElement;
    let interval = setInterval(() => {
      const currentTime = Math.floor(videoElement.currentTime);
      if (!comments[currentTime]) return;
      comments[currentTime].forEach((ele: string) => toast(ele));
    }, 1000);

    function pauseHandler() {
      clearInterval(interval);
    }

    function playingHandler() {
      interval = setInterval(() => {
        const currentTime = Math.floor(videoElement.currentTime);
        if (!comments[currentTime]) return;
        comments[currentTime].forEach((ele: string) => toast(ele));
      }, 1000);
    }

    videoElement.addEventListener('abort', removeHandler);
    videoElement.addEventListener('pause', pauseHandler);
    videoElement.addEventListener('playing', playingHandler);
    chrome.storage.onChanged.addListener(remove);

    // eslint-disable-next-line consistent-return
    return () => {
      videoElement.removeEventListener('pause', pauseHandler);
      videoElement.removeEventListener('playing', playingHandler);
      chrome.storage.onChanged.removeListener(remove);
      clearInterval(interval);
    };
  }, [comments]);

  return (
    <div>
      <ToastContainer autoClose={5000} className="toast-message" position="bottom-center" theme="dark" limit={3} />
    </div>
  );
}

(() => {
  if (!isValidURL(document.location.href)) return;
  let root = document.getElementById('commentu');
  if (root) {
    ReactDOM.render(
      <React.StrictMode>
        <ReplyList />
      </React.StrictMode>,
      root,
    );
    return;
  }

  const parentNode = document.getElementById('primary-inner');
  if (!parentNode) return;
  root = document.createElement('div');
  root.id = 'commentu';
  const siblingNode = document.getElementById('below');
  parentNode.insertBefore(root, siblingNode);

  ReactDOM.render(
    <React.StrictMode>
      <ReplyList />
    </React.StrictMode>,
    root,
  );
})();

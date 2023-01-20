import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import { isValidURL } from '../common/URL';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';

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
        reply.push(ele.snippet.topLevelComment.snippet);
      });
    });
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
    indexTime = indexTime < 4 ? 4 : indexTime;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    res[indexTime] ? res[indexTime].push(reply) : (res[indexTime] = [reply]);
  });
  return res;
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
    const interval = setInterval(() => {
      const currentTime = Math.floor(videoElement.currentTime);
      if (!comments[currentTime]) return;
      comments[currentTime].forEach((ele: string) => toast(ele));
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [comments]);

  // 원래 시간을 넣어서 key로 사용하기
  return (
    <div>
      <ToastContainer autoClose={4000} bodyClassName="toast-message" />
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

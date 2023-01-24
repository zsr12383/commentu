import React, { useState, useEffect, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import { Simulate } from 'react-dom/test-utils';
import { isValidURL } from '../common/URL';
import rateChange = Simulate.rateChange;

const URL = 'https://gh8vx163lc.execute-api.ap-northeast-2.amazonaws.com/commentuV1/commentu?videoId=';

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
  const reply = await fetch(`${URL}${target}`).then((res) => res.json());
  const res = {};
  reply.forEach((ele: { textDisplay: string; textOriginal: string }) => {
    const { textDisplay, textOriginal } = ele;
    if (textOriginal.length > 200) return;
    let tmp;
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
    indexTime = indexTime < 8 ? 8 : indexTime;
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

function removeHandler() {
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
    }, 1000 / videoElement.playbackRate);

    function pauseHandler() {
      clearInterval(interval);
    }

    function playingHandler() {
      clearInterval(interval);
      interval = setInterval(() => {
        const currentTime = Math.floor(videoElement.currentTime);
        if (!comments[currentTime]) return;
        comments[currentTime].forEach((ele: string) => toast(ele));
      }, 1000 / videoElement.playbackRate);
    }

    videoElement.addEventListener('abort', removeHandler);
    videoElement.addEventListener('pause', pauseHandler);
    videoElement.addEventListener('playing', playingHandler);
    videoElement.addEventListener('ratechange', playingHandler);
    chrome.storage.onChanged.addListener(remove);

    // eslint-disable-next-line consistent-return
    return () => {
      videoElement.removeEventListener('abort', removeHandler);
      videoElement.removeEventListener('pause', pauseHandler);
      videoElement.removeEventListener('playing', playingHandler);
      videoElement.removeEventListener('ratechange', playingHandler);
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

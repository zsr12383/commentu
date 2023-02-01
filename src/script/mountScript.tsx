import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import { isValidURL } from '../common/URL';

const URL = 'https://gh8vx163lc.execute-api.ap-northeast-2.amazonaws.com/commentuV1/commentu?videoId=';

function getTime(currentTimeString: string) {
  if (currentTimeString.length <= 5)
    return (
      parseInt(currentTimeString.replace(/:[0-9]+/, ''), 10) * 60 +
      parseInt(currentTimeString.replace(/[0-9]+:/, ''), 10)
    );
  const minute = currentTimeString.match(/:([0-9]+):/);
  const sec = currentTimeString.match(/[0-9]+$/);
  return (
    parseInt(currentTimeString.replace(/:.+/, ''), 10) * 3600 +
    parseInt(minute ? minute[1] : '0', 10) * 60 +
    parseInt(sec ? sec[0] : '0', 10)
  );
}

async function getComments(target: string) {
  const comments = await fetch(`${URL}${target}`).then((res) => res.json());
  return comments;
}

type Bundle = {
  [index: string]: string[];
};

interface Comment {
  textDisplay: string;
  textOriginal: string;
}

function bundleComments(comments: Comment[]) {
  const res: Bundle = {};
  comments.forEach((ele: Comment) => {
    const { textDisplay, textOriginal } = ele;
    if (textOriginal.length > 180) return;
    const matchResult = textDisplay.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</);
    if (!matchResult) return;
    let indexTime = getTime(matchResult[1]) - 1;
    indexTime = indexTime < 8 ? 8 : indexTime;
    if (res[indexTime]) {
      res[indexTime].push(textOriginal);
      return;
    }
    res[indexTime] = [textOriginal];
  });
  return res;
}

function turnOffHandler(changes: { [p: string]: any }) {
  Object.entries(changes).forEach((ele) => {
    const [key, { newValue }] = ele;
    if (key !== 'enabled' || newValue) return;
    remove();
  });
}

function remove() {
  const root = document.getElementById('commentu');
  if (!root) return;
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
}

function getVideoId(currentURL: string) {
  if (!isValidURL(currentURL)) return '';
  const tempArray = window.location.search.match(/=([^=&/]+)/);
  if (!tempArray) return '';
  return tempArray[1];
}

interface PropsType {
  videoId: string;
}

function ReplyList({ videoId }: PropsType) {
  const [comments, setComments] = useState<Bundle | null>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [duration, setDuration] = useState(5000);
  const [count, setCount] = useState(1);

  useEffect(() => {
    chrome.storage.local.get('opacity', (data) => {
      setOpacity(data.opacity / 100);
    });
    chrome.storage.local.get('duration', (data) => {
      setDuration(data.duration * 1000);
    });
    chrome.storage.onChanged.addListener(turnOffHandler);
  }, []);

  useEffect(() => {
    getComments(videoId)
      .then((comments) => {
        setComments(bundleComments(comments));
      })
      .catch(() => remove());
  }, []);

  useEffect(() => {
    if (comments === null) return undefined;
    // console.log(comments);
    const videoElement = document.querySelector('video') as HTMLMediaElement;
    if (!videoElement) {
      remove();
      return undefined;
    }

    let needRestart = false;
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
        if (!comments || !comments[currentTime]) return;
        comments[currentTime].forEach((ele: string) => toast(ele));
      }, 1000 / videoElement.playbackRate);
    }

    function opacityHandler(changes: { [p: string]: any }) {
      Object.entries(changes).forEach((ele) => {
        const [key, { newValue }] = ele;
        if (key !== 'opacity') return;
        setOpacity(newValue / 100);
      });
    }

    function durationHandler(changes: { [p: string]: any }) {
      Object.entries(changes).forEach((ele) => {
        const [key, { newValue }] = ele;
        if (key !== 'duration') return;
        setDuration(newValue * 1000);
      });
    }

    function countHandler(changes: { [p: string]: any }) {
      Object.entries(changes).forEach((ele) => {
        const [key, { newValue }] = ele;
        if (key !== 'number of messages') return;
        setCount(newValue);
      });
    }

    videoElement.addEventListener('pause', pauseHandler);
    videoElement.addEventListener('playing', playingHandler);
    videoElement.addEventListener('ratechange', playingHandler);
    chrome.storage.onChanged.addListener(opacityHandler);
    chrome.storage.onChanged.addListener(durationHandler);
    chrome.storage.onChanged.addListener(countHandler);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName !== 'src') return;
        needRestart = true;
        remove();
      });
    });
    const config = { attributes: true, childList: true, characterData: true };
    observer.observe(videoElement, config);

    return () => {
      videoElement.removeEventListener('pause', pauseHandler);
      videoElement.removeEventListener('playing', playingHandler);
      videoElement.removeEventListener('ratechange', playingHandler);
      chrome.storage.onChanged.removeListener(turnOffHandler);
      chrome.storage.onChanged.removeListener(opacityHandler);
      chrome.storage.onChanged.removeListener(durationHandler);
      chrome.storage.onChanged.removeListener(countHandler);
      clearInterval(interval);
      observer.disconnect();
      if (needRestart) {
        init();
      }
    };
  }, [comments]);

  return (
    <ToastContainer
      autoClose={duration}
      hideProgressBar
      className="toast-message"
      position="bottom-center"
      theme="dark"
      limit={count}
      style={{ opacity }}
    />
  );
}

function init() {
  if (document.getElementById('commentu') || !document.querySelector('video')) return;
  const videoId = getVideoId(window.location.href);
  if (!videoId) return;

  const parentNode = document.querySelector('body');
  if (!parentNode) return;
  const root = document.createElement('div');
  root.id = 'commentu';
  parentNode.appendChild(root);

  ReactDOM.render(
    <React.StrictMode>
      <ReplyList videoId={videoId} />
    </React.StrictMode>,
    root,
  );
}

init();

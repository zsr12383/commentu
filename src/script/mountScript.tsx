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

async function getComments() {
  const tempArray = window.location.search.match(/=([^=&/]+)/);
  if (!tempArray) return [];
  const target = tempArray[1];
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
  // console.log(comments);
  comments.forEach((ele: { textDisplay: string; textOriginal: string }) => {
    const { textDisplay, textOriginal } = ele;
    if (textOriginal.length > 200) return;
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
    abortHandler();
  });
}

function abortHandler() {
  const root = document.getElementById('commentu');
  if (!root) return;
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
}

function ReplyList() {
  const [comments, setComments] = useState<Bundle | null>(null);
  const [transparency, setTransparency] = useState(0.7);

  useEffect(() => {
    chrome.storage.local.get('transparency', (data) => {
      setTransparency(data.transparency / 100);
    });
  }, []);

  useEffect(() => {
    getComments().then((comments) => {
      setComments(bundleComments(comments));
    });
  }, []);

  useEffect(() => {
    if (comments === null) return undefined;
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
        if (!comments || !comments[currentTime]) return;
        comments[currentTime].forEach((ele: string) => toast(ele));
      }, 1000 / videoElement.playbackRate);
    }

    function transparencyHandler(changes: { [p: string]: any }) {
      Object.entries(changes).forEach((ele) => {
        const [key, { newValue }] = ele;
        if (key !== 'transparency') return;
        setTransparency(newValue / 100);
      });
    }

    videoElement.addEventListener('abort', abortHandler);
    videoElement.addEventListener('pause', pauseHandler);
    videoElement.addEventListener('playing', playingHandler);
    videoElement.addEventListener('ratechange', playingHandler);
    chrome.storage.onChanged.addListener(turnOffHandler);
    chrome.storage.onChanged.addListener(transparencyHandler);

    return () => {
      videoElement.removeEventListener('abort', abortHandler);
      videoElement.removeEventListener('pause', pauseHandler);
      videoElement.removeEventListener('playing', playingHandler);
      videoElement.removeEventListener('ratechange', playingHandler);
      chrome.storage.onChanged.removeListener(turnOffHandler);
      chrome.storage.onChanged.removeListener(transparencyHandler);
      clearInterval(interval);
    };
  }, [comments]);

  return (
    <div>
      <ToastContainer
        autoClose={5000}
        className="toast-message"
        position="bottom-center"
        theme="dark"
        limit={3}
        style={{ opacity: transparency }}
      />
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

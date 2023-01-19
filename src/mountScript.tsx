import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
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
  const res = {};
  reply.forEach((ele) => {
    let tmp;
    // eslint-disable-next-line no-cond-assign
    if ((tmp = ele.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res[getTime(tmp[1])] = ele;
    }
  });
  return res;
}

function bundleComments(replys: any) {
  let indexTime = 5;
  const res = {};
  Object.entries(replys).forEach((ele) => {
    const [time, reply] = ele;
    while (indexTime < parseInt(time, 10)) indexTime += 5;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    res[indexTime] ? res[indexTime].push(reply) : (res[indexTime] = [reply]);
  });
  return res;
}

function ReplyList() {
  const [comments, setComments] = useState<any>(null);
  const [test, setTest] = useState<number>(0);
  const currentURL = useMemo(() => document.location.href, [document.location.href]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isValidURL(currentURL)) return <></>;

  useEffect(() => {
    getReply().then((reply) => {
      setComments(bundleComments(reply));
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{test}</div>;
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

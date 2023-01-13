import { isValidURL } from './common';

// function getTime(currentTimeString: string) {
//   if (currentTimeString.length > 5)
//     return (
//       parseInt(currentTimeString.replace(/:.+/, ''), 10) * 3600 +
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       parseInt(currentTimeString.match(/:([0-9]+):/)[1], 10) * 60 +
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       parseInt(currentTimeString.match(/[0-9]+$/)[0], 10)
//     );
//   return (
//     parseInt(currentTimeString.replace(/:[0-9]+/, ''), 10) * 60 + parseInt(currentTimeString.replace(/[0-9]+:/, ''), 10)
//   );
// }
//
// class ReplyExtractor {
//   static instance: ReplyExtractor;
//
//   private readonly comment: Array<any>;
//
//   private readonly api_key: string;
//
//   private readonly target: string;
//
//   private url: string;
//
//   private inter: NodeJS.Timer | undefined;
//
//   private rand: number;
//
//   private runtime: Element | undefined;
//
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   private h1: HTMLCollectionOf<HTMLElementTagNameMap[string]> | undefined;
//
//   private title: never | undefined;
//
//   private video: HTMLVideoElement | undefined;
//
//   private b: { [index: number]: string };
//
//   constructor() {
//     this.comment = [];
//     this.api_key = '';
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     this.target = window.location.search.match(/=([^=&/]+)/)[1];
//     this.url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${this.api_key}&videoId=${this.target}&maxResults=100`;
//     this.rand = Math.random();
//     this.b = {};
//
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     fetch(this.url)
//       .then((res) => res.json())
//       .then((data) => {
//         data.items.forEach((ele: { snippet: { topLevelComment: { snippet: { textDisplay: never } } } }) => {
//           this.comment.push(ele.snippet.topLevelComment.snippet.textDisplay);
//         });
//         this.runtime = document.getElementsByClassName('ytp-time-current')[0];
//
//         // this.h1 = undefined;
//         // while (!this.h1) this.h1 = document.getElementsByTagName('h1');
//
//         this.h1 = document.getElementsByTagName('h1');
//         this.title = this.h1[1].innerText;
//         this.video = document.getElementsByClassName('video-stream html5-main-video')[0] as HTMLVideoElement;
//
//         let tmp = null;
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         this.comment.forEach((ele) => {
//           // eslint-disable-next-line no-cond-assign
//           if ((tmp = ele.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</))) {
//             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//             // @ts-ignore
//             this.b[getTime(tmp[1])] = ele;
//           }
//         });
//       });
//   }
//
//   off_active() {
//     if (this.inter) clearInterval(this.inter);
//     if (this.h1) this.h1[1].innerText = this.title;
//   }
//
//   setIntervalText(): undefined | NodeJS.Timer {
//     let run;
//     if (this.video === undefined) return undefined;
//     return setInterval(() => {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       run = Math.floor(this.video.currentTime); // string으로 해야되나? 확인한번
//       if (this.b && this.b[run] && this.h1) {
//         this.h1[1].innerText = this.b[run]; // 나중에 자막으로 삽입
//       }
//     }, 1000);
//   }
//
//   on_active() {
//     if (this.video === undefined) return;
//
//     this.inter = this.setIntervalText();
//
//     this.video.onplay = () => {
//       if (this.inter) clearInterval(this.inter);
//       this.inter = this.setIntervalText();
//     };
//
//     this.video.onpause = () => {
//       if (this.inter) clearInterval(this.inter);
//     };
//
//     window.onunload = () => {
//       if (this.inter) clearInterval(this.inter);
//     };
//
//     window.onpopstate = () => {
//       if (this.inter) clearInterval(this.inter);
//     };
//   }
// }
//
// function getCurrentDom() {
//   let currentDom;
//   if (document.body) currentDom = document.body;
//   else if (document.documentElement) currentDom = document.documentElement;
//   return currentDom;
// }
//
// const currentDom = getCurrentDom();
// if (currentDom) {
//   currentDom.addEventListener(
//     'transitionend',
//     (/* TransitionEvent */ event) => {
//       if (event.propertyName === 'width' && event.target /* && event.target.id && event.target.id === 'progress' */)
//         console.log('test');
//     },
//     true,
//   );
//
//   if (!ReplyExtractor.instance) {
//     ReplyExtractor.instance = new ReplyExtractor();
//   }
// }

(function () {
  const currentURL = document.location.href;
  if (!isValidURL(currentURL)) return;
  console.log(456);
})();

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   // eslint-disable-next-line no-restricted-syntax
//   for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`,
//     );
//   }
// });
// 스크립트 하나 더 만들어서 탭 생성 이벤트에 걸어주는 식으로 바꾸기

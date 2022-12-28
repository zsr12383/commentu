const ReplyExtractor = class {
  static instance: never;

  private readonly comment: Array<any>;

  private readonly api_key: string;

  private readonly target: string;

  private url: string;

  private inter: never | undefined;

  private rand: number;

  private runtime: Element | undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private h1: HTMLCollectionOf<HTMLElementTagNameMap[string]> | undefined;

  private title: never | undefined;

  private video: Element | undefined;

  private btn: undefined;

  private b: object | undefined;

  constructor() {
    this.comment = [];
    this.api_key = '';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.target = window.location.search.match(/=([^=&/]+)/)[1];
    this.url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${this.api_key}&videoId=${this.target}&maxResults=100`;
    this.rand = Math.random();

    (async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await fetch(this.url)
        .then((res) => res.json())
        .then((data) => {
          data.items.forEach((ele: { snippet: { topLevelComment: { snippet: { textDisplay: never } } } }) => {
            this.comment.push(ele.snippet.topLevelComment.snippet.textDisplay);
          });
        });
      this.runtime = document.getElementsByClassName('ytp-time-current')[0];

      this.h1 = undefined;
      while (!this.h1) this.h1 = document.getElementsByTagName('h1');

      this.title = this.h1[1].innerText;
      this.video = document.getElementsByClassName('video-stream html5-main-video')[0];
      this.btn = undefined;
      this.b = {};
      let tmp = null;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.comment.forEach((ele) => {
        // eslint-disable-next-line no-cond-assign
        if ((tmp = ele.match(/<a href[^<>]+>(([0-9]+:)?[0-9]+:[0-9]+)</))) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.b[this.eval_time(tmp[1])] = i;
        }
      });

      this.on_active(this);
    })();
  }

  eval_time(str) {
    if (str.length > 5)
      return (
        parseInt(str.replace(/:.+/, '')) * 3600 +
        parseInt(str.match(/:([0-9]+):/)[1]) * 60 +
        parseInt(str.match(/[0-9]+$/)[0])
      );
    return parseInt(str.replace(/:[0-9]+/, '')) * 60 + parseInt(str.replace(/[0-9]+:/, ''));
  }

  off_active() {
    // popup.js나 background에서 메시지 콜백 식으로 가자..
    console.log(this);
    clearInterval(this.inter);
    this.h1[1].innerText = this.title;
  }

  on_active(self) {
    (() => {
      let run;
      self.inter = setInterval(function () {
        run = Math.floor(self.video.currentTime); // string으로 해야되나? 확인한번
        console.log(run);
        if (/* self.btn && */ self.b[run]) {
          self.h1[1].innerText = self.b[run]; // 나중에 자막으로 삽입
          console.log(self.h1[1].innerText);
        }
      }, 1000);

      self.video.onplay = () => {
        let run;
        clearInterval(self.inter);
        self.inter = setInterval(function () {
          run = Math.floor(self.video.currentTime);
          console.log(run);
          if (/* self.btn && */ self.b[run]) {
            self.h1[1].innerText = self.b[run];
            console.log(self.h1[1].innerText);
          }
        }, 1000);
      };

      self.video.onpause = function () {
        clearInterval(self.inter);
      };

      window.onunload = function () {
        clearInterval(self.inter);
        self = null;
      };

      window.onpopstate = () => {
        clearInterval(self.inter);
      }; // <-- 새로 클래스 만들어서 적용될 수 있도록 구현
    })();
  }
};

function getCurrentDom() {
  let currentDom;
  if (document.body) currentDom = document.body;
  else if (document.documentElement) currentDom = documentElement;
  else console.log('Invalid Page');
  return currentDom;
}

// 익명함수 처리 필요할듯?

const currentDom = getCurrentDom();
if (currentDom) {
  currentDom.addEventListener(
    'transitionend',
    function (/* TransitionEvent */ event) {
      if (event.propertyName === 'width' && event.target.id === 'progress') {
      }
    },
    true,
  );

  if (!ReplyExtractor.instance) {
    ReplyExtractor.instance = new ReplyExtractor();
  }
}

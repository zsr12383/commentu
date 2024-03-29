# commentu

유튜브에서 현재 재생 시각을 나타내는 댓글을 함께 볼 수 있는 크롬 익스텐션입니다.

A Chrome extension that allows you to view comments that indicate the current playback time on YouTube.

[다운로드](https://chrome.google.com/webstore/detail/commentu/jcehlnipihamdcngkmlmmaaacdcnfchf?hl=ko)

## Demo

[commentu1.webm](https://user-images.githubusercontent.com/62196278/213736107-6de34d4c-dd41-4129-b765-3d6d665e955b.webm)

<br>

![popup](https://user-images.githubusercontent.com/62196278/216070017-e92fc74e-c7f6-457a-ab6e-e16d86483e81.jpg)

## Includes
* TypeScript
* Webpack
* React

## Project Structure

![Web App Reference Architecture](https://user-images.githubusercontent.com/62196278/213968684-9432cc43-34ea-4159-bdff-9eb255e57a78.svg)

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```bash
yarn install
```

## Build

```bash
yarn build
```

## Build in watch mode

### terminal

```bash
yarn watch
```

## Load extension to chrome

Load `dist` directory


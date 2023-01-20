# commentu

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

유튜브에서 현재 재생 시각을 나타내는 댓글을 함께 볼 수 있는 크롬 익스텐션

A Chrome extension that allows you to view comments that indicate the current playback time on YouTube.

## Demo

### normal
[commentu5.webm](https://user-images.githubusercontent.com/62196278/213796216-659b2a2a-f35a-4983-81c0-6a14a3f89c57.webm)

<br>

### full screen
[commentu1.webm](https://user-images.githubusercontent.com/62196278/213736107-6de34d4c-dd41-4129-b765-3d6d665e955b.webm)

## Includes
* TypeScript
* Webpack
* React
* Jest

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## API_KEY
You need key of YouTube Data API V3: https://console.cloud.google.com/apis/

**./.env**
```bash
API_KEY=#your API KEY here
```

## Setup

```bash
npm install
# or
yarn install
```

## Build

```bash
npm run build
# or
yarn build
```

## Build in watch mode

### terminal

```bash
npm run watch
# or
yarn watch
```

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `npm run test`

export const isValidURL = (url: string) => url.match(/^https:\/\/www.youtube.com\/watch?.+/);

export const isYoutubeURL = (url: string) => url.match(/^https:\/\/www.youtube.com\//);

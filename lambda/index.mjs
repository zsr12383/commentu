import axios from 'axios';
const PREFIX_URL = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=";
const COUNT = 3;

async function getYoutubeComment(videoId) {
  const url = PREFIX_URL + process.env.API_KEY + "&videoId=" + videoId + "&maxResults=100";
  let { data } = await axios.get(url);
  if(!data) {
    return [];
  }
  let i = 1;
  const ret = data.items.map((ele) => ele.snippet.topLevelComment.snippet);
  while (data.nextPageToken && i < COUNT) {
    const res = await axios.get(url + "&pageToken=" + data.nextPageToken);
    data = res.data;
    data.items.forEach((ele) => ret.push(ele.snippet.topLevelComment.snippet));
    i++;
  }
  return ret;
}

export const handler = async(event) => {
  const {queryStringParameters} = event;
  let ret = [];

  if(!queryStringParameters) {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "https://www.youtube.com",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify(ret),
    };
    return response;
  }

  ret = await getYoutubeComment(queryStringParameters.videoId);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "https://www.youtube.com",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
    body: JSON.stringify(ret),
  };
  return response;
};

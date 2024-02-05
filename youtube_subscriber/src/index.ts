//import { CookiesManager } from "./cookies_manager.js";
const CookiesManager= require('./cookies_manager'); 
const YouTubeHttpClient = require('./youtube_http_client'); 

async function main() {
  console.log("Initializing Youtube Subscriber.");

  var cookies = await CookiesManager.readCookies();

  if (!cookies || !cookies.length)
    throw new Error("There re no cookies defined.");

  const res = await YouTubeHttpClient.subscribe(cookies, "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8","@SonyAATH");

  console.log("Cookies", cookies);
  console.log("Youtube Subscriber finished execution.");
}

main();
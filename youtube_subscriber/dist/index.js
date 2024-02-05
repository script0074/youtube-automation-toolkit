var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { CookiesManager } from "./cookies_manager.js";
const CookiesManager = require('./cookies_manager');
const YouTubeHttpClient = require('./youtube_http_client');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Initializing Youtube Subscriber.");
        var cookies = yield CookiesManager.readCookies();
        if (!cookies || !cookies.length)
            throw new Error("There re no cookies defined.");
        const res = yield YouTubeHttpClient.subscribe(cookies, "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", "@SonyAATH");
        console.log("Cookies", cookies);
        console.log("Youtube Subscriber finished execution.");
    });
}
main();

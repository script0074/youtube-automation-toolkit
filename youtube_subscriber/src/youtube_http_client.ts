const sha1 = require("sha1");
const zlib = require("zlib");
const http2 = require("http2");
const fs = require("fs");

const generateHeaders = (cookies: Cookie[], channel: string) => {
  const sapisidCookie = cookies.find((cookie) => cookie.name === "SAPISID");

  if (!sapisidCookie) throw new Error("Auth cookie not found.");

  const now = new Date();
  const origin = "https://www.youtube.com";
  const timems = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const timesec = Math.round(timems / 1000);
  const SAPISID = sapisidCookie;
  const newHash =
    timesec + "_" + sha1(timesec + " " + SAPISID + " " + origin, "utf8", "hex");
  const SAPISIDHASH = newHash;

  let headers = {
    Cookie: cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; "),
    Authorization: "SAPISIDHASH" + " " + SAPISIDHASH,
    Origin: "https://www.youtube.com",
    Pragma: "no-cache",
    Referer: `https://www.youtube.com/${channel}`, // CHANNEL SPECIFIC
    "Sec-Ch-Ua": '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Model": '""',
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Ch-Ua-Platform-Version": '"15.0.0"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "same-origin",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Gpc": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "X-Goog-Authuser": "0",
    "X-Goog-Visitor-Id":
      "unique-google-authenticator-id-.-it-is-generated-when-loging-in-google",
    "X-Origin": "https://www.youtube.com",
    "X-Youtube-Bootstrap-Logged-In": "true",
    "X-Youtube-Client-Name": "1",
    "X-Youtube-Client-Version": "2.20240201.01.00",
    ":authority": "www.youtube.com",
    ":method": "POST",
    ":path":
      "/youtubei/v1/subscription/subscribe?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false",
    ":scheme": "https",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  };
};

const subscribe = async (
  cookies: Cookie[],
  key: string,
  channel: string
): Promise<any> => {
  if (!cookies || !cookies.length)
    throw new Error("There re no cookies defined.");

  if (!key) throw new Error("Key defined is not valid.");

  const url = `https://www.youtube.com/youtubei/v1/subscription/subscribe?key=${key}&prettyPrint=false`;

  return new Promise((resolve, reject) => {
    //const headers = generateHeaders(cookies, channel);

    const options = {
      method: "POST",
      headers: generateHeaders(cookies, channel),
    };

    const client = http2.connect(url);

    const req = client.request(options);
    let responseHeaders: any = {};

    req.on("response", (headers, flags) => {
      responseHeaders = headers;
      console.log("Response Headers:");
      console.log(headers);
    });

    let data = Buffer.from([]);

    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });

    req.on("end", () => {
      const contentEncoding = responseHeaders["content-encoding"];

      console.log("\nResponse Body:");

      if (contentEncoding === "gzip") {
        data = zlib.gunzipSync(data);
      } else if (contentEncoding === "deflate") {
        data = zlib.inflateSync(data);
      } else if (contentEncoding === "br") {
        data = zlib.brotliDecompressSync(data);
      }

      const content = data.toString();
      try {
        fs.writeFileSync("output.html", content);
        // file written successfully
      } catch (err) {
        console.error(err);
      }

      client.close();
    });

    req.on("error", (error) => {
      console.error("Request Error:", error);
    });
  });
};

module.exports = { subscribe };

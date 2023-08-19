const path = require('path');
const decompress = require("decompress");
const https = require('follow-redirects').https;
// import { https } from 'follow-redirects';
const fs = require('fs');

const isWin = process.platform === "win32";
const cache = path.join(__dirname, ".cache","puppeteer")

const extensions_path = [
  //uBlock
  // "extensions/ublock/1.51.0_0",
  path.join(cache, "extensions", "ublock"),
  //cookie
  // "extensions/isdcac/1.1.1_0/",
  path.join(cache, "extensions", "isdcac"),
];
const browser_path = path.join(cache,
  "browser", "chrome", isWin ? "chrome.exe" : "chrome")

function loading() {
  var P = ["\\", "|", "/", "-"];
  var x = 0;
  return setInterval(function() {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);
};

function write_wait(text) {
  console.log(text);
  return loading();
}

function extract_archive(archive_name, output_dir, strip, remove = false) {
  let l = write_wait("Extracting archive...");
  decompress(archive_name, output_dir, {strip: strip})
    .then((files) => {
      clearInterval(l)
      console.log();
      console.log("Extraction completed!");
      if (remove) {
        fs.rmSync(archive_name)
      }
    })
    .catch((error) => {
      clearInterval(l)
      console.log(error);
    });
}

// The downloaded file should be a zip
function dl_if_not_exist(test_path, dir_name, dl_url, strip) {

  if (fs.existsSync(test_path)) {
    return 0;
  }

  fs.mkdirSync(dir_name, { recursive: true });

  archive_name = path.join(dir_name, "dl.zip")
  if (!fs.existsSync(archive_name)) {
    let l = write_wait(`Downloading ${path.basename(dir_name)}...`);
    const file = fs.createWriteStream(archive_name);
    https.get(dl_url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        clearInterval(l);
        console.log();
        console.log("Download completed!");
        extract_archive(archive_name, dir_name, strip, true)
      });
    });
  } else {
    extract_archive(archive_name, dir_name, strip, true)
  }
}

dl_if_not_exist(
  browser_path,
  path.join(cache, "browser","chrome"),
  //isWin ? "chrome-win.zip" : "chrome-linux.zip",
  isWin ?
  "https://www.googleapis.com/download/storage/v1/b/"
  + "chromium-browser-snapshots/o/Win_x64%2F1184619%2Fchrome-win.zip?generation=1692271014345520&alt=media"
  :
  "https://commondatastorage.googleapis.com/"
    + "chromium-browser-snapshots/Linux_x64/1184557/chrome-linux.zip",
  1
)

dl_if_not_exist(
  extensions_path[0],
  path.join(cache, "extensions", "ublock"),
  // "1.51.0_0.zip",
  "https://github.com/gorhill/uBlock/releases/download/1.51.0/uBlock0_1.51.0.chromium.zip",
  1
)

dl_if_not_exist(
  extensions_path[1],
  path.join(cache, "extensions", "isdcac"),
  // "1.1.0_0.zip",
  "https://github.com/OhMyGuus/I-Still-Dont-Care-About-Cookies/releases/download/v1.1.1/ISDCAC-chrome-source.zip",
  0
)

module.exports = {
  extensions_path,
  browser_path
};

// const dir_name = isWin ? join(cache, "browser") : join(cache, "browser");
// const archive_name = isWin ? join(dir_name, "chrome-win.zip") : join(dir_name, "chrome-linux.zip");
// const dl_url = isWin ?
//   "https://www.googleapis.com/download/storage/v1/b/"
//   + "chromium-browser-snapshots/o/Win_x64%2F1184619%2Fchrome-win.zip?generation=1692271014345520&alt=media"
//   :
//   "https://commondatastorage.googleapis.com/"
//   + "chromium-browser-snapshots/Linux_x64/1184557/chrome-linux.zip"





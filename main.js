'use strict';
const prompt = require('prompt-sync')({sigint: true});
const puppeteer = require('puppeteer');
const sites = require('./sites.js');

const { extensions_path, browser_path } = require('./config.js');

function setBrowsersPosSize(list, width, height, grid = 10) {
  const height_correction = 28;
  const ypos_correction = height_correction / 2;
  list.forEach(element => {
    element.size = `${width},${height+height_correction}`
  });
  list[0].pos = `0,0`;
  list[1].pos = `${width+grid},0`;
  list[2].pos = `0,${height+grid-ypos_correction}`;
  list[3].pos = `${width+grid},${height+grid-ypos_correction}`;
}

function loadBrowsers() {
  return sites.map(site => puppeteer.launch({
      executablePath: browser_path,
      headless: false,
      defaultViewport: null,
      devtools: false,
      protocolTimeout: 1800000,
      args: [
        `--window-size=${site.size}`,
        `--window-position=${site.pos}`,
        `--disable-extensions-except=${extensions_path.join()}`,
        `--load-extension=${extensions_path.join()}`,
        "--no-default-browser-check",
        "--disable-features=site-per-process",
        "--disable-infobars"
      ],
      ignoreDefaultArgs: [
        "--enable-blink-features",
        "--enable-automation",
      ]
    }).then(async (browser) => {
      const currentPage = await browser.pages().then(allPages => allPages[0]);
      const page = await browser.newPage();
      currentPage.close();
      return { browser: page, site: site };
    })
  )
}
async function searchWord(browser, word) {
  const page = browser.browser
  await page.bringToFront();
  await page.goto(browser.site.url.replace('_WORD_', word));
  if ("input_path" in browser.site) {
    await page.type(browser.site.input_path, word);
    await page.select(browser.site.select_path, browser.site.select_value);
    await page.click(browser.site.button);
  }
  try{
    await page.waitForSelector(`${browser.site.result_container}:not(:empty)`);
    const element = await page.$(browser.site.scroll_to);
    await page.evaluate((element) => { element.scrollIntoView(true); }, element);
  } catch (e) {
  }
  return page
}
function parseHrtimeToSeconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    return seconds;
}
async function run() {
  const browsers = await Promise.all(loadBrowsers()).then((browsers) => {
    console.log("Browsers loaded.")
    // console.log(browsers)
    return browsers;
  });
  while (true) {
    const searchstring = prompt('> Cauta un cuvant: ');
    var startTime = process.hrtime();
    await Promise.all(browsers.map(item => searchWord(item,searchstring)))
    var elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
    console.log(`( results in ${elapsedSeconds} seconds )`);
  }
}

setBrowsersPosSize(sites, 960, 540)
// console.log(sites);
run();

import { Builder, Browser } from "selenium-webdriver";
import fs from "fs";
import { ExtractPageDate } from "./center-fm/extract-page-data";
import { SwitchPage } from "./center-fm/switch-page";

import { Song } from "./center-fm/models"


const url = "https://centerfm.by/ru/history/";
const date = "27.05.2022";

(async function parse() {
  const driver = new Builder().forBrowser(Browser.FIREFOX).build();
  driver.get(url);

  const trackList: Song[] = [];

  try {
    const timeArray = makeTimes();
    
    for (const time of timeArray) {
      await SwitchPage(driver, date, time);
      const data = await ExtractPageDate(driver);
      trackList.push(...data);
    }

  } catch (error) {
    console.log(error);
  }

  saveFile(trackList);
  setTimeout(() => driver.quit(), 10000);


  function makeTimes () {
    const timeArray: string[] = [];
  
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m <= 59; m += 7) {
        const mh = h <= 9 ? `0${h}` : h;
        const mMin = m <= 9 ? `0${m}` : m;
        timeArray.push(`${mh}:${mMin}`);
      }
    }
    return timeArray
  };
  
  function saveFile(trackList: Song[]) {
    fs.writeFile("songs.json", JSON.stringify(trackList),
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }
        console.log("JSON file has been saved.");
      }
    );
  };

})();

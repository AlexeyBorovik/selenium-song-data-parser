import { Builder, Browser, By, WebElement } from "selenium-webdriver";
import fs from "fs";

(async function parse() {
  let driver = new Builder().forBrowser(Browser.FIREFOX).build();
  driver.get("https://centerfm.by/ru/history/");

  let trackList: Song[] = [];

  try {

    let timeArray = makeTimes();
    let date = "27.05.2022";
    await setDate(date);

    let oldFirstTime: string = await getFistTime();

    for (const time of timeArray) {
      console.log("timeCycleChecker");
      let timeInput = await driver.findElement(
        By.name("play_history_search[time]")
      );
      let searchButton = await driver.findElement(
        By.css(".b-form-search .b-btn")
      );

      await setTime(timeInput, searchButton, time);

      oldFirstTime = await checkLoad(getFistTime, oldFirstTime);

      let contentDivs = await driver.findElements(
        By.css(".b-track-item__content-inner")
      );

      for (const contentDiv of contentDivs) {
        await pushSongs(contentDiv);
      };
    };

    saveFile(trackList);

    setTimeout(() => driver.quit(), 10000);

  } catch (error) {

    saveFile(trackList);

    console.log(error);
    setTimeout(() => driver.quit(), 10000);
  }


  function makeTimes () {
    let timeArray: string[] = [];
  
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m <= 59; m += 7) {
        const mh = h <= 9 ? `0${h}` : h;
        const mMin = m <= 9 ? `0${m}` : m;
        timeArray.push(`${mh}:${mMin}`);
      }
    }
    return timeArray
  };

  async function setDate(date: string) {
    let dateInput = await driver.findElement(
      By.name("play_history_search[date]")
    );
    await dateInput.clear();
    await dateInput.sendKeys(date);
  };
  
  async function getFistTime() {
    let items = await driver.findElements(
      By.css(".b-track-item__content-inner .b-track-item__time")
    );
    return items[0].getText();
  };

  async function setTime(timeInput: WebElement, searchButton: WebElement, time: string) {
    await timeInput.clear();
    await timeInput.sendKeys(`${time}`);
    await searchButton.click();
    console.log(`search Clicked, ${time}`);
  };
  
  async function checkLoad(getFistTime: Function, oldFirstTime: string) {
    while (true) {
      await PromiseDelay(1000);
      const newFirstTime: string = await getFistTime();
      if (oldFirstTime !== newFirstTime) {
        return newFirstTime;
      }
    }
  };

  async function pushSongs(contentDiv: WebElement) {
        let author = await contentDiv
          .findElement(By.css(".b-track-item__author"))
          .getText();
        let song = await contentDiv
          .findElement(By.css(".b-track-item__song"))
          .getText();
        let time = await contentDiv
          .findElement(By.css(".b-track-item__time"))
          .getText();
          trackList.push({ author, song, time })

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

function PromiseDelay(delayInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
};


type Song = {
  author: string;
  song: string;
  time: string;
}

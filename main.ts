const { Builder, Browser, By } = require("selenium-webdriver");
const fs = require("fs");

(async function parse() {
  let driver = new Builder().forBrowser(Browser.FIREFOX).build();
  driver.get("https://centerfm.by/ru/history/");
  let trackList = [];
  
  try {
    let timeArray = [];

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m <= 59; m += 7) {
       const mh = h <= 9 ? `0${h}` : h;
       const mMin = m <= 9 ? `0${m}` : m;
        timeArray.push(`${mh}:${mMin}`);
      }
    }

    let dateInput = await driver.findElement(
      By.name("play_history_search[date]")
    );

    await dateInput.clear();
    await dateInput.sendKeys("27.05.2022");


    let getFistTime = async () => {
        let items = await driver.findElements(
            By.css(".b-track-item__content-inner .b-track-item__time")
            );
       return items[0].getText();
      }
    let oldFirstTime = await getFistTime();

    for (const time of timeArray) {
        console.log('timeCycleChecker');
      let timeInput = await driver.findElement(
        By.name("play_history_search[time]")
      );
      let searchButton = await driver.findElement(
        By.css(".b-form-search .b-btn")
      );

      await timeInput.clear();
      await timeInput.sendKeys(`${time}`);
      await searchButton.click();
      console.log(`search Clicked, ${time}`);

      while (true) {
          console.log("LoadChecker"); 
          await PromiseDelay(1000);
          let newFirstTime = await getFistTime();
          if (oldFirstTime !== newFirstTime) {
              oldFirstTime = newFirstTime
              break;
          };
       };
      
      let contentDivs = await driver.findElements(
          By.css(".b-track-item__content-inner")
          );
                   
      for (const contentDiv of contentDivs) {
        let author = await contentDiv
          .findElement(By.css(".b-track-item__author"))
          .getText();
        let song = await contentDiv
          .findElement(By.css(".b-track-item__song"))
          .getText();
        let time = await contentDiv
          .findElement(By.css(".b-track-item__time"))
          .getText();
        trackList.push({ author, song, time });
      }
    }

     fs.writeFile("songs3.json", JSON.stringify(trackList), function (err: any) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    })

    setTimeout(() => driver.quit(), 10000);
  } catch (error) {
    fs.writeFile("PartOfsongs3.json", JSON.stringify(trackList), function (err: any) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    })
    console.log(error);
    setTimeout(() => driver.quit(), 10000);
  }
})();

function PromiseDelay(delayInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
};

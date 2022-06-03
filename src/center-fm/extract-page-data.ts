import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { Song } from "./models";

export async function ExtractPageDate(driver: ThenableWebDriver, ) {
    const data: Song[] = [];
    const contentDivs = await driver.findElements(
        By.css(".b-track-item__content-inner")
      );

      for (const contentDiv of contentDivs) {
        await pushSongs(contentDiv, data);
      };

      return data
}

async function pushSongs(contentDiv: WebElement, data: Song[]) {
    const author = await contentDiv
      .findElement(By.css(".b-track-item__author"))
      .getText();
    const song = await contentDiv
      .findElement(By.css(".b-track-item__song"))
      .getText();
    const time = await contentDiv
      .findElement(By.css(".b-track-item__time"))
      .getText();

      data.push({ author, song, time })
};

import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";

export async function SwitchPage(driver: ThenableWebDriver, date: string, time: string) {
    await setDate(driver, date);
    
    const oldFirstTime: string = await getFistTime(driver);

    
      console.log("timeCycleChecker");
      const timeInput = await driver.findElement(
        By.name("play_history_search[time]")
      );
      const searchButton = await driver.findElement(
        By.css(".b-form-search .b-btn")
      );

      await setTime(timeInput, searchButton, time);

      await checkLoad(getFistTime, oldFirstTime, driver);
  };


  async function setDate(driver: ThenableWebDriver, date: string) {
    const dateInput = await driver.findElement(
      By.name("play_history_search[date]")
    );
    await dateInput.clear();
    await dateInput.sendKeys(date);
  };
  
  async function getFistTime(driver: ThenableWebDriver) {
    const items = await driver.findElements(
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
  
  async function checkLoad(getFistTime: Function, oldFirstTime: string, driver: ThenableWebDriver) {
    while (true) {
      await PromiseDelay(1000);
      const newFirstTime: string = await getFistTime(driver);
      if (oldFirstTime !== newFirstTime) {
        return newFirstTime;
      }
    }
  };

  function PromiseDelay(delayInMs: number) {
    return new Promise((resolve) => setTimeout(resolve, delayInMs));
  };

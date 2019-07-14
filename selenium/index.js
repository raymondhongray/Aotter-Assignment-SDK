const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const Page = function() {
  this.driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

  // visit a webpage
  this.visit = async function(theUrl) {
    return await this.driver.get(theUrl);
  };

  this.wait = async function(ms) {
    await new Promise(resolve => {
      this.driver.wait(function() {
        resolve();
      }, ms);
    });
  };
  // quit current session
  this.quit = async function() {
    return await this.driver.quit();
  };

  this.findByElementID = async function(driver, elementID) {
    return await driver.findElement(By.id(elementID));
  };

  this.findByTagName = async function(driver, tag) {
    return await driver.findElement(By.tagName(tag));
  };
}

module.exports = Page;
const host = 'http://localhost:3000';
const Page = require('../selenium/index');

describe('test aotter-assignment-sdk', () => {
  let page;
  let driver;
  beforeAll (async () => {
    page = new Page();
    driver = page.driver;
    By = page.By;
    await page.visit(host);
    await page.wait(5000);
  });
  afterAll (async () => {
    await page.quit();
  });
  
  it('find the banner ad', async () => {
    const id = 'aotter-ad-banner';
    let resultStat = await page.findByElementID(driver, id);
    try {
      resultStat = await page.findByTagName(resultStat, 'iframe');
      console.log('find banner iframe!');
      expect(true).toBe(true);
    } catch (error) {
      console.log('404 OOPS! banner ad not found!');
      const notFoundText = await resultStat.getText();
      expect(notFoundText).toBe('404 OOPS! aotter-Ad not found!');
    }
  }, 30000);

  it('find the video ad', async () => {
    const id = 'aotter-ad-video';
    let resultStat = await page.findByElementID(driver, id);
    try {
      resultStat = await page.findByTagName(resultStat, 'iframe');
      console.log('find video iframe!');
      expect(true).toBe(true);
    } catch (error) {
      console.log('404 OOPS! video ad not found!');
      const notFoundText = await resultStat.getText();
      expect(notFoundText).toBe('404 OOPS! aotter-Ad not found!');
    }
  }, 30000);
});
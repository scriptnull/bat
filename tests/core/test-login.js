var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');

test.describe('Google Search', function() {
  this.timeout(150000);
  test.it('should work', function(done) {
    this.timeout(150000);
    setTimeout(done, 150000);
    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
    driver.get('https://alpha.shippable.com/');
    driver.findElement(webdriver.By.linkText('LOGIN')).click();
    driver.findElement(webdriver.By.linkText('GitHub')).click();
    driver.findElement(webdriver.By.name('login')).sendKeys('username');
    driver.findElement(webdriver.By.name('password')).sendKeys('password');
    driver.findElement(webdriver.By.name('commit')).click();
    driver.quit();
    return done();
  });
});
var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');

var driver;

test.describe('Login workflow',
  function() {
    this.timeout(150000);

    test.beforeEach(
      function(done) {
        // runs before all tests in this block
        driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();
        driver.get('https://alpha.shippable.com/');
        return done();
      });

    test.afterEach(
      function(done) {
        // runs after all tests in this block
        driver.findElement(webdriver.By.linkText('GitHub')).click();
        driver.findElement(webdriver.By.name('login')).sendKeys('username');
        driver.findElement(webdriver.By.name('password')).sendKeys('password');
        driver.findElement(webdriver.By.name('commit')).click();
        driver.quit();
        return done();
      });

    test.it('Login',
      function(done) {
        this.timeout(150000);
        setTimeout(done, 150000);
        driver.findElement(webdriver.By.linkText('LOGIN')).click();
        return done();
    });

    test.it('Get Started',
      function(done) {
        this.timeout(150000);
        setTimeout(done, 150000);
        driver.findElement(webdriver.By.linkText('Get Started')).click();
        return done();
    });
});
